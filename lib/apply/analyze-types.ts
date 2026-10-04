import type { EmailDraft, JobExtract, JobMatch } from "./types.ts"

export type AnalyzeResult = {
  extract: JobExtract
  draft: EmailDraft | null
  match: JobMatch | null
  cvFilename: string | null
  needsCategoryConfirm: boolean
  needsManualCv: boolean
  emailMissing: boolean
  error?: string
}
