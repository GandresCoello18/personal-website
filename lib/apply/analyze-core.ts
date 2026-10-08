import { applyJobOverrides } from "./overrides.ts"
import type { AnalyzeResult } from "./analyze-types.ts"
import type { CvKey } from "./cv.ts"
import type { JobCategory, JobExtract, JobMatch } from "./types.ts"

export type AnalyzeInput =
  | { mode: "text"; text: string; categoryOverride?: JobCategory; manualCv?: CvKey }
  | {
      mode: "image"
      mimeType: string
      base64: string
      categoryOverride?: JobCategory
      manualCv?: CvKey
    }

export type AnalyzeDeps = {
  extractFromText: (text: string) => Promise<JobExtract>
  extractFromImage: (mimeType: string, base64: string) => Promise<JobExtract>
  match: (input: { jobText?: string; extract: JobExtract }) => Promise<JobMatch | null>
}

export async function runAnalyzeJobPosting(
  input: AnalyzeInput,
  deps: AnalyzeDeps,
): Promise<AnalyzeResult> {
  const extracted =
    input.mode === "text"
      ? await deps.extractFromText(input.text)
      : await deps.extractFromImage(input.mimeType, input.base64)

  const { extract, cvFilename, needsCategoryConfirm, emailMissing } = applyJobOverrides(
    extracted,
    input.categoryOverride,
    input.manualCv ?? null,
  )

  const match = await deps.match({
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
