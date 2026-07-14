import { writeApplicationEmail } from "@/lib/ai/gemini"
import type { CvKey } from "@/lib/apply/cv"
import { extractCvText } from "@/lib/apply/cv-text"
import { jobExtractSchema, type JobCategory, type JobExtract } from "@/lib/apply/types"
import { applyJobOverrides, type AnalyzeResult } from "@/services/apply/result"

export type DraftInput = {
  extract: JobExtract
  categoryOverride?: JobCategory
  manualCv?: CvKey
}

/** Second step: write email using plain-text CV (content/cv/*.txt). */
export async function draftFromExtract(input: DraftInput): Promise<AnalyzeResult> {
  const parsedExtract = jobExtractSchema.parse(input.extract)
  const { extract, cvFilename, needsCategoryConfirm, needsManualCv, emailMissing } =
    applyJobOverrides(parsedExtract, input.categoryOverride, input.manualCv ?? null)

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

  const cvText = extractCvText(cvFilename)
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
