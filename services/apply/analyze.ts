import { extractJobFromImage, extractJobFromText } from "@/lib/ai/gemini"
import { runAnalyzeJobPosting, type AnalyzeInput } from "@/lib/apply/analyze-core"
import type { AnalyzeResult } from "@/lib/apply/analyze-types"
import { matchJobPosting } from "@/services/apply/match"

export type { AnalyzeInput } from "@/lib/apply/analyze-core"

/** Extracts job data + match score (separate Gemini calls). No email draft. */
export async function analyzeJobPosting(input: AnalyzeInput): Promise<AnalyzeResult> {
  return runAnalyzeJobPosting(input, {
    extractFromText: extractJobFromText,
    extractFromImage: extractJobFromImage,
    match: matchJobPosting,
  })
}
