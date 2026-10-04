import { writeApplicationEmail } from "@/lib/ai/gemini"
import { runDraftFromExtract, type DraftInput } from "@/lib/apply/draft-core"
import type { AnalyzeResult } from "@/lib/apply/analyze-types"
import { extractCvText } from "@/lib/apply/cv-text"
import { readProjectsAndSpeakingContext } from "@/lib/apply/profile-context"

export type { DraftInput } from "@/lib/apply/draft-core"

/** Second step: write email using plain-text CV + optional projects/speaking + recruiter notes. */
export async function draftFromExtract(input: DraftInput): Promise<AnalyzeResult> {
  return runDraftFromExtract(input, {
    writeEmail: writeApplicationEmail,
    readCvText: extractCvText,
    readProjects: readProjectsAndSpeakingContext,
  })
}
