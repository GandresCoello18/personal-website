import { resolveCvFilename, type CvKey } from "./cv.ts"
import { mergeRecruiterContact } from "./recruiter.ts"
import {
  CONFIDENCE_THRESHOLD,
  jobCategorySchema,
  type JobCategory,
  type JobExtract,
} from "./types.ts"

export function applyJobOverrides(
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
  let next = mergeRecruiterContact(extract)
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
