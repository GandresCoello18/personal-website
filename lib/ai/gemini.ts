import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai"
import {
  EXTRACT_JOB_IMAGE_USER_PROMPT,
  EXTRACT_JOB_SYSTEM_PROMPT,
  EXTRACT_JOB_TEXT_USER_PREFIX,
} from "@/lib/ai/prompts/extract-job"
import { WRITE_EMAIL_SYSTEM_PROMPT, buildWriteEmailUserPrompt } from "@/lib/ai/prompts/write-email"
import { MATCH_JOB_SYSTEM_PROMPT, buildMatchJobUserPrompt } from "@/lib/ai/prompts/match-job"
import {
  INTERVIEW_ANSWER_SYSTEM_PROMPT,
  buildInterviewAnswerUserPrompt,
} from "@/lib/ai/prompts/interview-answer"
import { resolveGeminiModelChain } from "@/lib/ai/gemini-models"
import { isModelUnavailableError, isRetryableError, withInRequestRetries } from "@/lib/ai/retry"
import {
  emailDraftSchema,
  jobExtractSchema,
  jobMatchSchema,
  type EmailDraft,
  type JobExtract,
  type JobMatch,
} from "@/lib/apply/types"
import { interviewAnswersSchema, type InterviewAnswers } from "@/lib/interview/types"

const REQUEST_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 55_000)
const IN_REQUEST_BUDGET_MS = 50_000
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
  const modelChain = resolveGeminiModelChain()
  const deadlineMs = Date.now() + IN_REQUEST_BUDGET_MS
  let lastError: unknown

  for (const modelId of modelChain) {
    const model = client.getGenerativeModel({
      model: modelId,
      systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        temperature,
      },
    })

    try {
      return await withInRequestRetries(
        async () => {
          const remaining = deadlineMs - Date.now()
          const timeoutMs = Math.min(REQUEST_TIMEOUT_MS, Math.max(1_000, remaining))
          return await withTimeout(run(model), timeoutMs)
        },
        { deadlineMs },
      )
    } catch (error) {
      lastError = error
      if (isModelUnavailableError(error)) continue
      if (!isRetryableError(error)) throw error
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
    jobText.length > MAX_JOB_TEXT_CHARS ? `${jobText.slice(0, MAX_JOB_TEXT_CHARS)}\n…` : jobText

  const raw = await generateJsonText(EXTRACT_JOB_SYSTEM_PROMPT, 0.2, async (model) => {
    const result = await model.generateContent(`${EXTRACT_JOB_TEXT_USER_PREFIX}\n\n${truncated}`)
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
  projectsContext = "",
  recruiterProfileText = "",
): Promise<EmailDraft> {
  const raw = await generateJsonText(WRITE_EMAIL_SYSTEM_PROMPT, 0.4, async (model) => {
    const result = await model.generateContent(
      buildWriteEmailUserPrompt(job, cvText, projectsContext, recruiterProfileText),
    )
    return result.response.text()
  })
  return emailDraftSchema.parse(parseJsonPayload(raw))
}

export async function matchJobToProfile(
  jobText: string,
  profileContext: string,
): Promise<JobMatch> {
  const truncatedJob =
    jobText.length > MAX_JOB_TEXT_CHARS ? `${jobText.slice(0, MAX_JOB_TEXT_CHARS)}\n…` : jobText

  const raw = await generateJsonText(MATCH_JOB_SYSTEM_PROMPT, 0.2, async (model) => {
    const result = await model.generateContent(
      buildMatchJobUserPrompt(truncatedJob, profileContext),
    )
    return result.response.text()
  })
  return jobMatchSchema.parse(parseJsonPayload(raw))
}

export async function answerInterviewQuestions(
  questionsText: string,
  context: string,
): Promise<InterviewAnswers> {
  const raw = await generateJsonText(INTERVIEW_ANSWER_SYSTEM_PROMPT, 0.3, async (model) => {
    const result = await model.generateContent(
      buildInterviewAnswerUserPrompt(questionsText, context),
    )
    return result.response.text()
  })
  return interviewAnswersSchema.parse(parseJsonPayload(raw))
}
