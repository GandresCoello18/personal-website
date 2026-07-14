import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai"
import {
  EXTRACT_JOB_IMAGE_USER_PROMPT,
  EXTRACT_JOB_SYSTEM_PROMPT,
  EXTRACT_JOB_TEXT_USER_PREFIX,
} from "@/lib/ai/prompts/extract-job"
import {
  WRITE_EMAIL_SYSTEM_PROMPT,
  buildWriteEmailUserPrompt,
} from "@/lib/ai/prompts/write-email"
import {
  emailDraftSchema,
  jobExtractSchema,
  type EmailDraft,
  type JobExtract,
} from "@/lib/apply/types"

/** Free-tier friendly default. Override with GEMINI_MODEL. */
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite"
const FALLBACK_MODELS = (process.env.GEMINI_FALLBACK_MODELS || "")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean)

const MODEL_CHAIN = [PRIMARY_MODEL, ...FALLBACK_MODELS.filter((m) => m !== PRIMARY_MODEL)]

/** Single attempt only — avoids burning free-tier tokens on retries. */
const MAX_ATTEMPTS = 1
const REQUEST_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 55_000)
const MAX_JOB_TEXT_CHARS = 8_000

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no está configurada")
  }
  return new GoogleGenerativeAI(apiKey)
}

function parseJsonPayload(raw: string): unknown {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenced ? fenced[1].trim() : trimmed
  return JSON.parse(candidate)
}

function isRetryableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return (
    message.includes("[503") ||
    message.includes("[429") ||
    message.includes("high demand") ||
    message.includes("Resource exhausted")
  )
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(
        new Error(
          `Timeout: Gemini no respondió en ${Math.round(ms / 1000)}s. Intenta de nuevo o usa Flash-Lite.`,
        ),
      )
    }, ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

type GenerateFn = (model: GenerativeModel) => Promise<string>

async function generateJsonText(
  systemInstruction: string,
  temperature: number,
  run: GenerateFn,
): Promise<string> {
  const client = getClient()
  let lastError: unknown

  for (const modelId of MODEL_CHAIN) {
    const model = client.getGenerativeModel({
      model: modelId,
      systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        temperature,
      },
    })

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        return await withTimeout(run(model), REQUEST_TIMEOUT_MS)
      } catch (error) {
        lastError = error
        // No sleep / no retry by default (MAX_ATTEMPTS = 1)
        if (!isRetryableError(error) || attempt >= MAX_ATTEMPTS - 1) break
      }
    }
  }

  const detail = lastError instanceof Error ? lastError.message : String(lastError)
  if (detail.includes("Timeout:")) {
    throw lastError instanceof Error ? lastError : new Error(detail)
  }
  if (isRetryableError(lastError)) {
    throw new Error(
      `Gemini está saturado (alta demanda). Espera un momento e intenta de nuevo. Detalle: ${detail}`,
    )
  }
  throw lastError instanceof Error ? lastError : new Error(detail)
}

export async function extractJobFromText(jobText: string): Promise<JobExtract> {
  const truncated =
    jobText.length > MAX_JOB_TEXT_CHARS
      ? `${jobText.slice(0, MAX_JOB_TEXT_CHARS)}\n…`
      : jobText

  const raw = await generateJsonText(EXTRACT_JOB_SYSTEM_PROMPT, 0.2, async (model) => {
    const result = await model.generateContent(
      `${EXTRACT_JOB_TEXT_USER_PREFIX}\n\n${truncated}`,
    )
    return result.response.text()
  })
  return jobExtractSchema.parse(parseJsonPayload(raw))
}

export async function extractJobFromImage(
  mimeType: string,
  base64Data: string,
): Promise<JobExtract> {
  const raw = await generateJsonText(EXTRACT_JOB_SYSTEM_PROMPT, 0.2, async (model) => {
    const result = await model.generateContent([
      { text: EXTRACT_JOB_IMAGE_USER_PROMPT },
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
    ])
    return result.response.text()
  })
  return jobExtractSchema.parse(parseJsonPayload(raw))
}

export async function writeApplicationEmail(
  job: JobExtract,
  cvText: string,
): Promise<EmailDraft> {
  const raw = await generateJsonText(WRITE_EMAIL_SYSTEM_PROMPT, 0.4, async (model) => {
    const result = await model.generateContent(buildWriteEmailUserPrompt(job, cvText))
    return result.response.text()
  })
  return emailDraftSchema.parse(parseJsonPayload(raw))
}
