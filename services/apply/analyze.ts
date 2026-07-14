import {
  extractJobFromImage,
  extractJobFromText,
  writeApplicationEmail,
} from "@/lib/ai/gemini"
import { resolveCvFilename, type CvKey } from "@/lib/apply/cv"
import { extractCvText } from "@/lib/apply/pdf-text"
import {
  CONFIDENCE_THRESHOLD,
  jobCategorySchema,
  type EmailDraft,
  type JobCategory,
  type JobExtract,
} from "@/lib/apply/types"

export type AnalyzeInput =
  | { mode: "text"; text: string; categoryOverride?: JobCategory; manualCv?: CvKey }
  | {
      mode: "image"
      mimeType: string
      base64: string
      categoryOverride?: JobCategory
      manualCv?: CvKey
    }

export type AnalyzeResult = {
  extract: JobExtract
  draft: EmailDraft | null
  cvFilename: string | null
  needsCategoryConfirm: boolean
  needsManualCv: boolean
  emailMissing: boolean
  error?: string
}

export async function analyzeJobPosting(input: AnalyzeInput): Promise<AnalyzeResult> {
  let extract =
    input.mode === "text"
      ? await extractJobFromText(input.text)
      : await extractJobFromImage(input.mimeType, input.base64)

  if (input.categoryOverride) {
    const parsed = jobCategorySchema.safeParse(input.categoryOverride)
    if (parsed.success) {
      extract = { ...extract, category: parsed.data, confidence: Math.max(extract.confidence, 0.85) }
    }
  }

  const emailMissing = !extract.email
  const needsCategoryConfirm = extract.confidence < CONFIDENCE_THRESHOLD
  const needsManualCv = extract.category === "unknown" && !input.manualCv

  const cvFilename = resolveCvFilename(extract.category, input.manualCv ?? null)

  if (needsManualCv || !cvFilename) {
    return {
      extract,
      draft: null,
      cvFilename: null,
      needsCategoryConfirm,
      needsManualCv: extract.category === "unknown",
      emailMissing,
      error:
        extract.category === "unknown"
          ? "Categoría desconocida: selecciona el CV manualmente y vuelve a generar."
          : undefined,
    }
  }

  const cvText = await extractCvText(cvFilename)
  const draft = await writeApplicationEmail(extract, cvText)

  return {
    extract,
    draft,
    cvFilename,
    needsCategoryConfirm,
    needsManualCv: false,
    emailMissing,
  }
}
