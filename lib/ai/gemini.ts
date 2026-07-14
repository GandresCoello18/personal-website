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

/**
 * Docs: https://ai.google.dev/gemini-api/docs/get-started
 * Primary matches get-started (gemini-3.5-flash). Fallback when 503 high demand.
 */
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash"
const FALLBACK_MODELS = (process.env.GEMINI_FALLBACK_MODELS || "gemini-3.1-flash-lite")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean)

const MODEL_CHAIN = [PRIMARY_MODEL, ...FALLBACK_MODELS.filter((m) => m !== PRIMARY_MODEL)]

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
    message.includes("Resource exhausted") ||
    message.includes("try again")
  )
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await run(model)
      } catch (error) {
        lastError = error
        if (!isRetryableError(error)) break
        await sleep(800 * (attempt + 1))
      }
    }
  }

  const detail = lastError instanceof Error ? lastError.message : String(lastError)
  if (isRetryableError(lastError)) {
    throw new Error(
      `Gemini está saturado (alta demanda). Espera unos segundos y vuelve a intentar. Detalle: ${detail}`,
    )
  }
  throw lastError instanceof Error ? lastError : new Error(detail)
}

export async function extractJobFromText(jobText: string): Promise<JobExtract> {
  const raw = await generateJsonText(EXTRACT_JOB_SYSTEM_PROMPT, 0.2, async (model) => {
    const result = await model.generateContent(
      `${EXTRACT_JOB_TEXT_USER_PREFIX}\n\n${jobText}`,
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
