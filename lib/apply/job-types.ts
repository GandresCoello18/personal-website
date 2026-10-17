import { z } from "zod"
import type { AnalyzeResult } from "./analyze-types.ts"
import { jobCategorySchema, jobExtractSchema } from "./types.ts"
import type { ApplyJobKind, ApplyJobStatus } from "./job-transitions.ts"

export type { ApplyJobKind, ApplyJobStatus }

export const applyJobKindSchema = z.enum(["analyze", "draft"])
export const applyJobStatusSchema = z.enum(["pending", "running", "ready", "failed"])

export const applyImageRefSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("redis"), key: z.string().min(1) }),
  z.object({ kind: z.literal("blob"), url: z.string().url() }),
])

export type ApplyImageRef = z.infer<typeof applyImageRefSchema>

const cvKeySchema = z.enum(["software", "education"])

export const analyzeJobInputSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("text"),
    text: z.string().min(1),
    categoryOverride: jobCategorySchema.optional(),
    manualCv: cvKeySchema.optional(),
  }),
  z.object({
    mode: z.literal("image"),
    mimeType: z.string().min(1),
    imageRef: applyImageRefSchema,
    categoryOverride: jobCategorySchema.optional(),
    manualCv: cvKeySchema.optional(),
  }),
])

export type AnalyzeJobInput = z.infer<typeof analyzeJobInputSchema>

export const draftJobInputSchema = z.object({
  extract: jobExtractSchema,
  categoryOverride: jobCategorySchema.optional(),
  manualCv: cvKeySchema.optional(),
  recruiterProfileText: z.string().optional(),
})

export type DraftJobInput = z.infer<typeof draftJobInputSchema>

export const applyJobRecordSchema = z.object({
  id: z.string().min(1),
  kind: applyJobKindSchema,
  status: applyJobStatusSchema,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  queuedAt: z.string().min(1),
  queueAttempts: z.number().int().min(0),
  lastError: z.string().optional(),
  input: z.union([analyzeJobInputSchema, draftJobInputSchema]),
  result: z.unknown().optional(),
  label: z
    .object({
      company: z.string().optional(),
      position: z.string().optional(),
    })
    .optional(),
})

export type ApplyJobRecord = Omit<z.infer<typeof applyJobRecordSchema>, "result"> & {
  result?: AnalyzeResult
}

export type ApplyJobPublic = {
  id: string
  kind: ApplyJobKind
  status: ApplyJobStatus
  createdAt: string
  updatedAt: string
  queuedAt: string
  queueAttempts: number
  lastError?: string
  company?: string
  position?: string
  result?: AnalyzeResult
}

export type QueuedApplyResponse = {
  queued: true
  jobId: string
  status: "pending"
  kind: ApplyJobKind
  message: "En cola, se reintentará"
}

export const APPLY_JOBS_TOPIC = "apply-jobs"

export type ApplyQueueMessage = {
  jobId: string
  attempt: number
}

export function toPublicJob(job: ApplyJobRecord): ApplyJobPublic {
  return {
    id: job.id,
    kind: job.kind,
    status: job.status,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    queuedAt: job.queuedAt,
    queueAttempts: job.queueAttempts,
    lastError: job.lastError,
    company: job.label?.company,
    position: job.label?.position,
    result: job.status === "ready" ? job.result : undefined,
  }
}

export function queuedApplyResponse(job: ApplyJobRecord): QueuedApplyResponse {
  return {
    queued: true,
    jobId: job.id,
    status: "pending",
    kind: job.kind,
    message: "En cola, se reintentará",
  }
}
