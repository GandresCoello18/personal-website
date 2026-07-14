import { extractJobFromImage, extractJobFromText } from "@/lib/ai/gemini"
import type { CvKey } from "@/lib/apply/cv"
import type { JobCategory } from "@/lib/apply/types"
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

/** Only extracts job data (1 Gemini call). No CV text / no PDF deps. */
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
