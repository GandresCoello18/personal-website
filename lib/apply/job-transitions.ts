import { isRetryableError } from "../ai/retry.ts"

/** Offsets from the moment the job was first queued (in-request retries already failed). */
export const APPLY_QUEUE_RETRY_DELAYS_SECONDS = [10 * 60, 30 * 60, 60 * 60, 90 * 60] as const

export const APPLY_QUEUE_MAX_ATTEMPTS = APPLY_QUEUE_RETRY_DELAYS_SECONDS.length

export type ApplyJobKind = "analyze" | "draft"
export type ApplyJobStatus = "pending" | "running" | "ready" | "failed"

export type ApplyJobTransition = {
  status: ApplyJobStatus
  queueAttempts: number
  lastError?: string
  updatedAt: string
}

export function queueAttemptOffsetSeconds(attempt: number): number | null {
  if (attempt < 1 || attempt > APPLY_QUEUE_MAX_ATTEMPTS) return null
  return APPLY_QUEUE_RETRY_DELAYS_SECONDS[attempt - 1]
}

/** Seconds until `attempt` should run, based on `queuedAt`. */
export function delaySecondsUntilAttempt(input: {
  attempt: number
  queuedAtMs: number
  nowMs: number
}): number | null {
  const offset = queueAttemptOffsetSeconds(input.attempt)
  if (offset == null) return null
  const targetMs = input.queuedAtMs + offset * 1000
  return Math.max(0, Math.ceil((targetMs - input.nowMs) / 1000))
}

export function idempotencyKeyForAttempt(jobId: string, attempt: number): string {
  return `${jobId}:${attempt}`
}

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  return String(error)
}

export function onQueueAttemptStart(
  nowMs: number,
): Pick<ApplyJobTransition, "status" | "updatedAt"> {
  return { status: "running", updatedAt: new Date(nowMs).toISOString() }
}

export function onQueueAttemptSuccess(input: {
  queueAttemptsBefore: number
  nowMs: number
}): ApplyJobTransition {
  return {
    status: "ready",
    queueAttempts: input.queueAttemptsBefore + 1,
    updatedAt: new Date(input.nowMs).toISOString(),
  }
}

/**
 * After a queue delivery fails: retry at the next offset from `queuedAt`,
 * or mark failed (our DLQ). Non-retryable errors fail immediately.
 */
export function onQueueAttemptFailure(input: {
  queueAttemptsBefore: number
  queuedAtMs: number
  error: unknown
  nowMs: number
}): ApplyJobTransition & { nextAttempt: number | null; delaySeconds: number | null } {
  const failedAttempt = input.queueAttemptsBefore + 1
  const lastError = errorMessage(input.error)
  const updatedAt = new Date(input.nowMs).toISOString()
  const retryable = isRetryableError(input.error)

  if (!retryable || failedAttempt >= APPLY_QUEUE_MAX_ATTEMPTS) {
    return {
      status: "failed",
      queueAttempts: failedAttempt,
      lastError,
      updatedAt,
      nextAttempt: null,
      delaySeconds: null,
    }
  }

  const nextAttempt = failedAttempt + 1
  return {
    status: "pending",
    queueAttempts: failedAttempt,
    lastError,
    updatedAt,
    nextAttempt,
    delaySeconds: delaySecondsUntilAttempt({
      attempt: nextAttempt,
      queuedAtMs: input.queuedAtMs,
      nowMs: input.nowMs,
    }),
  }
}
