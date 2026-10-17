import { getRedis } from "../radar/redis-client.ts"
import { readJobImage } from "./job-assets.ts"
import { enqueueApplyJobAttempt } from "./queue-client.ts"
import { getApplyJob, updateApplyJob } from "./job-store.ts"
import type { AnalyzeInput } from "./analyze-core.ts"
import type { AnalyzeResult } from "./analyze-types.ts"
import type { DraftInput } from "./draft-core.ts"
import type {
  AnalyzeJobInput,
  ApplyJobRecord,
  ApplyQueueMessage,
  DraftJobInput,
} from "./job-types.ts"
import {
  APPLY_QUEUE_MAX_ATTEMPTS,
  delaySecondsUntilAttempt,
  onQueueAttemptFailure,
  onQueueAttemptStart,
  onQueueAttemptSuccess,
} from "./job-transitions.ts"

async function notifyQuietly(
  notify: (job: ApplyJobRecord) => Promise<void>,
  job: ApplyJobRecord,
): Promise<void> {
  try {
    await notify(job)
  } catch (error) {
    console.error("[apply/queue] telegram", error)
  }
}

export type ProcessApplyJobDeps = {
  runAnalyze: (input: AnalyzeInput) => Promise<AnalyzeResult>
  runDraft: (input: DraftInput) => Promise<AnalyzeResult>
  notifyReady: (job: ApplyJobRecord) => Promise<void>
  notifyFailed: (job: ApplyJobRecord) => Promise<void>
  loadJob?: (id: string) => Promise<ApplyJobRecord | null>
  savePatch?: (id: string, patch: Partial<ApplyJobRecord>) => Promise<ApplyJobRecord | null>
  readImage?: typeof readJobImage
  enqueue?: typeof enqueueApplyJobAttempt
  acquireLock?: (jobId: string) => Promise<boolean>
  releaseLock?: (jobId: string) => Promise<void>
  now?: () => number
}

const LOCK_TTL_SECONDS = 90

async function defaultAcquireLock(jobId: string): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return true
  const result = await redis.set(`pw:apply:job:${jobId}:lock`, "1", {
    nx: true,
    ex: LOCK_TTL_SECONDS,
  })
  return result === "OK"
}

async function defaultReleaseLock(jobId: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  await redis.del(`pw:apply:job:${jobId}:lock`)
}

async function executeJob(
  job: ApplyJobRecord,
  deps: Required<Pick<ProcessApplyJobDeps, "runAnalyze" | "runDraft" | "readImage">>,
): Promise<ApplyJobRecord["result"]> {
  if (job.kind === "analyze") {
    const input = job.input as AnalyzeJobInput
    if (input.mode === "text") {
      return deps.runAnalyze({
        mode: "text",
        text: input.text,
        categoryOverride: input.categoryOverride,
        manualCv: input.manualCv,
      })
    }
    const image = await deps.readImage(input.imageRef)
    return deps.runAnalyze({
      mode: "image",
      mimeType: input.mimeType,
      base64: image.base64,
      categoryOverride: input.categoryOverride,
      manualCv: input.manualCv,
    })
  }

  const input = job.input as DraftJobInput
  return deps.runDraft(input)
}

function mergeLabel(
  job: ApplyJobRecord,
  result: ApplyJobRecord["result"],
): ApplyJobRecord["label"] {
  return {
    company: result?.extract.company || job.label?.company,
    position: result?.extract.position || job.label?.position,
  }
}

export async function processApplyQueueMessage(
  message: ApplyQueueMessage,
  deps: ProcessApplyJobDeps,
): Promise<ApplyJobRecord | null> {
  const loadJob = deps.loadJob ?? getApplyJob
  const savePatch = deps.savePatch ?? updateApplyJob
  const readImage = deps.readImage ?? readJobImage
  const enqueue = deps.enqueue ?? enqueueApplyJobAttempt
  const acquireLock = deps.acquireLock ?? defaultAcquireLock
  const releaseLock = deps.releaseLock ?? defaultReleaseLock
  const now = deps.now ?? Date.now

  const job = await loadJob(message.jobId)
  if (!job) return null
  if (job.status === "ready" || job.status === "failed") return job

  const attempt = message.attempt
  if (job.status === "pending" && job.queueAttempts >= attempt) {
    const nextAttempt = job.queueAttempts + 1
    if (nextAttempt <= APPLY_QUEUE_MAX_ATTEMPTS) {
      const queuedAtMs = Date.parse(job.queuedAt) || Date.parse(job.createdAt) || now()
      const delaySeconds = delaySecondsUntilAttempt({
        attempt: nextAttempt,
        queuedAtMs,
        nowMs: now(),
      })
      if (delaySeconds != null) {
        await enqueue({ jobId: job.id, attempt: nextAttempt, delaySeconds })
      }
    }
    return job
  }

  const locked = await acquireLock(job.id)
  if (!locked) {
    throw new Error("job lock: el trabajo ya se está procesando")
  }

  if (attempt < 1 || attempt > APPLY_QUEUE_MAX_ATTEMPTS) {
    try {
      const failed = await savePatch(job.id, {
        status: "failed",
        lastError: `Intento de cola inválido (${attempt})`,
        updatedAt: new Date(now()).toISOString(),
      })
      if (failed) await notifyQuietly(deps.notifyFailed, failed)
      return failed
    } finally {
      await releaseLock(job.id)
    }
  }

  const started = onQueueAttemptStart(now())
  await savePatch(job.id, started)

  try {
    const result = await executeJob(job, {
      runAnalyze: deps.runAnalyze,
      runDraft: deps.runDraft,
      readImage,
    })
    const success = onQueueAttemptSuccess({
      queueAttemptsBefore: job.queueAttempts,
      nowMs: now(),
    })
    const ready = await savePatch(job.id, {
      ...success,
      result,
      label: mergeLabel(job, result),
      lastError: undefined,
    })
    if (ready) await notifyQuietly(deps.notifyReady, ready)
    return ready
  } catch (error) {
    const queuedAtMs = Date.parse(job.queuedAt) || Date.parse(job.createdAt) || now()
    const failure = onQueueAttemptFailure({
      queueAttemptsBefore: Math.max(job.queueAttempts, attempt - 1),
      queuedAtMs,
      error,
      nowMs: now(),
    })
    const next = await savePatch(job.id, {
      status: failure.status,
      queueAttempts: failure.queueAttempts,
      lastError: failure.lastError,
      updatedAt: failure.updatedAt,
    })
    if (!next) return null
    if (failure.nextAttempt != null && failure.delaySeconds != null) {
      await enqueue({
        jobId: next.id,
        attempt: failure.nextAttempt,
        delaySeconds: failure.delaySeconds,
      })
    } else if (next.status === "failed") {
      await notifyQuietly(deps.notifyFailed, next)
    }
    return next
  } finally {
    await releaseLock(job.id)
  }
}
