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
  jobExtractSchema,
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

function applyOverrides(
  extract: JobExtract,
  categoryOverride?: JobCategory,
  manualCv?: CvKey | null,
): {
  extract: JobExtract
  cvFilename: string | null
  needsCategoryConfirm: boolean
  needsManualCv: boolean
  emailMissing: boolean
} {
  let next = extract
  if (categoryOverride) {
    const parsed = jobCategorySchema.safeParse(categoryOverride)
    if (parsed.success) {
      next = { ...next, category: parsed.data, confidence: Math.max(next.confidence, 0.85) }
    }
  }

  const emailMissing = !next.email
  const needsCategoryConfirm = next.confidence < CONFIDENCE_THRESHOLD
  const needsManualCv = next.category === "unknown" && !manualCv
  const cvFilename = resolveCvFilename(next.category, manualCv ?? null)

  return { extract: next, cvFilename, needsCategoryConfirm, needsManualCv, emailMissing }
}

/** Only extracts job data (1 Gemini call). Does not write the email. */
export async function analyzeJobPosting(input: AnalyzeInput): Promise<AnalyzeResult> {
  const extracted =
    input.mode === "text"
      ? await extractJobFromText(input.text)
      : await extractJobFromImage(input.mimeType, input.base64)

  const { extract, cvFilename, needsCategoryConfirm, needsManualCv, emailMissing } =
    applyOverrides(extracted, input.categoryOverride, input.manualCv ?? null)

  return {
    extract,
    draft: null,
    cvFilename,
    needsCategoryConfirm,
    needsManualCv: extract.category === "unknown" && !input.manualCv,
    emailMissing,
    error:
      extract.category === "unknown" && !input.manualCv
        ? "Categoría desconocida: selecciona el CV y luego genera el correo."
        : undefined,
  }
}

export type DraftInput = {
  extract: JobExtract
  categoryOverride?: JobCategory
  manualCv?: CvKey
}

/** Second step: 1 Gemini call using CV text + extract. */
export async function draftFromExtract(input: DraftInput): Promise<AnalyzeResult> {
  const parsedExtract = jobExtractSchema.parse(input.extract)
  const { extract, cvFilename, needsCategoryConfirm, needsManualCv, emailMissing } =
    applyOverrides(parsedExtract, input.categoryOverride, input.manualCv ?? null)

  if (needsManualCv || !cvFilename) {
    return {
      extract,
      draft: null,
      cvFilename: null,
      needsCategoryConfirm,
      needsManualCv: true,
      emailMissing,
      error: "Selecciona categoría/CV antes de generar el correo.",
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
