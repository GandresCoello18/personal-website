import { extractJobFromImage, extractJobFromText } from "@/lib/ai/gemini"
import type { CvKey } from "@/lib/apply/cv"
import type { JobCategory } from "@/lib/apply/types"
import { matchJobPosting } from "@/services/apply/match"
import { applyJobOverrides, type AnalyzeResult } from "@/services/apply/result"

export type AnalyzeInput =
  | { mode: "text"; text: string; categoryOverride?: JobCategory; manualCv?: CvKey }
  | {
      mode: "image"
      mimeType: string
      base64: string
      categoryOverride?: JobCategory
      manualCv?: CvKey
    }

/** Extracts job data + match score (separate Gemini calls). No email draft. */
export async function analyzeJobPosting(input: AnalyzeInput): Promise<AnalyzeResult> {
  const extracted =
    input.mode === "text"
      ? await extractJobFromText(input.text)
      : await extractJobFromImage(input.mimeType, input.base64)

  const { extract, cvFilename, needsCategoryConfirm, emailMissing } = applyJobOverrides(
    extracted,
    input.categoryOverride,
    input.manualCv ?? null,
  )

  const match = await matchJobPosting({
    jobText: input.mode === "text" ? input.text : undefined,
    extract,
  })

  return {
    extract,
    draft: null,
    match,
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
