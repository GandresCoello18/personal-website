import { applyJobOverrides } from "./overrides.ts"
import type { AnalyzeResult } from "./analyze-types.ts"
import type { CvKey } from "./cv.ts"
import { jobExtractSchema, type EmailDraft, type JobCategory, type JobExtract } from "./types.ts"

const MAX_RECRUITER_PROFILE_CHARS = 4_000

export type DraftInput = {
  extract: JobExtract
  categoryOverride?: JobCategory
  manualCv?: CvKey
  recruiterProfileText?: string
}

export type DraftDeps = {
  writeEmail: (
    extract: JobExtract,
    cvText: string,
    projectsContext: string,
    recruiterProfileText: string,
  ) => Promise<EmailDraft>
  readCvText: (cvFilename: string) => string
  readProjects: () => string
}

export async function runDraftFromExtract(
  input: DraftInput,
  deps: DraftDeps,
): Promise<AnalyzeResult> {
  const parsedExtract = jobExtractSchema.parse(input.extract)
  const { extract, cvFilename, needsCategoryConfirm, needsManualCv, emailMissing } =
    applyJobOverrides(parsedExtract, input.categoryOverride, input.manualCv ?? null)

  if (needsManualCv || !cvFilename) {
    return {
      extract,
      draft: null,
      match: null,
      cvFilename: null,
      needsCategoryConfirm,
      needsManualCv: true,
      emailMissing,
      error: "Selecciona categoría/CV antes de generar el correo.",
    }
  }

  const cvText = deps.readCvText(cvFilename)
  const projectsContext = deps.readProjects()
  const recruiterProfileText = (input.recruiterProfileText || "")
    .trim()
    .slice(0, MAX_RECRUITER_PROFILE_CHARS)
  const draft = await deps.writeEmail(extract, cvText, projectsContext, recruiterProfileText)

  return {
    extract,
    draft,
    match: null,
    cvFilename,
    needsCategoryConfirm,
    needsManualCv: false,
    emailMissing,
  }
}
