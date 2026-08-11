import { matchJobToProfile } from "@/lib/ai/gemini"
import {
  buildJobTextFromExtract,
  buildProfileContextForMatching,
} from "@/lib/apply/profile-context"
import type { JobExtract, JobMatch } from "@/lib/apply/types"

export async function matchJobPosting(input: {
  jobText?: string
  extract: JobExtract
}): Promise<JobMatch | null> {
  const fromExtract = buildJobTextFromExtract(input.extract)
  const jobText = (input.jobText?.trim() || fromExtract).trim()
  if (!jobText) return null

  try {
    const profileContext = buildProfileContextForMatching()
    return await matchJobToProfile(jobText, profileContext)
  } catch (error) {
    console.error("[apply/match]", error)
    return null
  }
}
