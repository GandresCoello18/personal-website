import { z } from "zod"

export const APPLY_CHANNELS = ["apply_manual", "radar_telegram", "manual_external"] as const
export type ApplyChannel = (typeof APPLY_CHANNELS)[number]

export const applyChannelSchema = z.enum(APPLY_CHANNELS)

export type ApplyRecord = {
  fp: string
  urlKey: string | null
  company: string
  position: string
  email: string | null
  channel: ApplyChannel
  subject?: string
  cvFilename?: string
  appliedAt: string
  findingId?: string
  identityWeak: boolean
}

export type ApplyCheckStatus = "new" | "applied" | "in_progress" | "unknown"

export type ApplyCheckMatch = "url" | "fp" | null

export type SoftWarning =
  | {
      kind: "company"
      company: string
      position: string
      appliedAt: string
    }
  | {
      kind: "email"
      email: string
      appliedAt: string
    }

export type ApplyCheckResult = {
  status: ApplyCheckStatus
  match: ApplyCheckMatch
  record: ApplyRecord | null
  softWarnings: SoftWarning[]
  identityWeak: boolean
  historyUnavailable: boolean
}

const emptyToUndefined = (val: unknown) => {
  if (val === null || val === undefined) return undefined
  if (typeof val === "string" && val.trim() === "") return undefined
  return val
}

export const applyCheckSchema = z.object({
  company: z.string().trim().max(200).optional().default(""),
  position: z.string().trim().max(200).optional().default(""),
  email: z.preprocess(emptyToUndefined, z.string().trim().email().max(254).optional()),
  url: z.preprocess(emptyToUndefined, z.string().trim().max(2000).optional()),
})

export type ApplyCheckInput = z.infer<typeof applyCheckSchema>

export const applyRegisterSchema = applyCheckSchema.extend({
  confirmDuplicate: z.boolean().optional(),
})

export type ApplyRegisterInput = z.infer<typeof applyRegisterSchema>

export const APPLY_LOCK_TTL_SECONDS = 120
export const APPLY_SOFT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000
export const APPLY_RECORD_TTL_SECONDS = 365 * 24 * 60 * 60
export const COMPANY_INDEX_TTL_SECONDS = 400 * 24 * 60 * 60
export const EMAIL_INDEX_TTL_SECONDS = 400 * 24 * 60 * 60
