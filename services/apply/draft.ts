import { writeApplicationEmail } from "@/lib/ai/gemini"
import type { CvKey } from "@/lib/apply/cv"
import { extractCvText } from "@/lib/apply/cv-text"
import { readProjectsAndSpeakingContext } from "@/lib/apply/profile-context"
import { jobExtractSchema, type JobCategory, type JobExtract } from "@/lib/apply/types"
import { applyJobOverrides, type AnalyzeResult } from "@/services/apply/result"

const MAX_RECRUITER_PROFILE_CHARS = 4_000

export type DraftInput = {
  extract: JobExtract
  categoryOverride?: JobCategory
  manualCv?: CvKey
  /** Optional pasted LinkedIn/profile notes about the recruiter. */
  recruiterProfileText?: string
}

/** Second step: write email using plain-text CV + optional projects/speaking + recruiter notes. */
export async function draftFromExtract(input: DraftInput): Promise<AnalyzeResult> {
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

  const cvText = extractCvText(cvFilename)
  const projectsContext = readProjectsAndSpeakingContext()
  const recruiterProfileText = (input.recruiterProfileText || "").trim().slice(0, MAX_RECRUITER_PROFILE_CHARS)
  const draft = await writeApplicationEmail(
    extract,
    cvText,
    projectsContext,
    recruiterProfileText,
  )

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
