import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  APPLY_QUEUE_MAX_ATTEMPTS,
  APPLY_QUEUE_RETRY_DELAYS_SECONDS,
  delaySecondsUntilAttempt,
  idempotencyKeyForAttempt,
  onQueueAttemptFailure,
  onQueueAttemptStart,
  onQueueAttemptSuccess,
} from "./job-transitions.ts"
import { processApplyQueueMessage } from "./process-job.ts"
import type { ApplyJobRecord } from "./job-types.ts"
import type { AnalyzeResult } from "./analyze-types.ts"

const QUEUED_AT = Date.parse("2026-10-17T12:00:00.000Z")

function job(partial: Partial<ApplyJobRecord> = {}): ApplyJobRecord {
  const now = new Date(QUEUED_AT).toISOString()
  return {
    id: "job_1",
    kind: "analyze",
    status: "pending",
    createdAt: now,
    updatedAt: now,
    queuedAt: now,
    queueAttempts: 0,
    input: { mode: "text", text: "Vacante de backend en Acme con TypeScript y Node." },
    ...partial,
  }
}

const result: AnalyzeResult = {
  extract: {
    company: "Acme",
    position: "Backend",
    email: "juan@acme.com",
    recruiterName: "Juan",
    recruiterTitle: "",
    recruiterConfidence: "high",
    category: "software",
    confidence: 0.9,
    requirements: [],
    location: "",
    remote: true,
    summary: "Backend",
    language: "es",
  },
  draft: null,
  match: null,
  cvFilename: "cv.pdf",
  needsCategoryConfirm: false,
  needsManualCv: false,
  emailMissing: false,
}

describe("queue retry schedule", () => {
  it("places the 4 attempts at 10, 30, 60 and 90 minutes after enqueue", () => {
    assert.equal(APPLY_QUEUE_MAX_ATTEMPTS, 4)
    assert.deepEqual([...APPLY_QUEUE_RETRY_DELAYS_SECONDS], [600, 1800, 3600, 5400])
    assert.equal(
      delaySecondsUntilAttempt({ attempt: 1, queuedAtMs: QUEUED_AT, nowMs: QUEUED_AT }),
      600,
    )
    assert.equal(
      delaySecondsUntilAttempt({
        attempt: 2,
        queuedAtMs: QUEUED_AT,
        nowMs: QUEUED_AT + 10 * 60 * 1000,
      }),
      20 * 60,
    )
    assert.equal(
      delaySecondsUntilAttempt({ attempt: 4, queuedAtMs: QUEUED_AT, nowMs: QUEUED_AT }),
      90 * 60,
    )
    assert.equal(idempotencyKeyForAttempt("job_1", 2), "job_1:2")
  })

  it("keeps the job pending until the 4th failure, then marks failed", () => {
    const first = onQueueAttemptFailure({
      queueAttemptsBefore: 0,
      queuedAtMs: QUEUED_AT,
      nowMs: QUEUED_AT + 10 * 60 * 1000,
      error: new Error("[429] Resource exhausted"),
    })
    assert.equal(first.status, "pending")
    assert.equal(first.nextAttempt, 2)
    assert.equal(first.delaySeconds, 20 * 60)

    const fourth = onQueueAttemptFailure({
      queueAttemptsBefore: 3,
      queuedAtMs: QUEUED_AT,
      nowMs: QUEUED_AT + 90 * 60 * 1000,
      error: new Error("[503] overloaded"),
    })
    assert.equal(fourth.status, "failed")
    assert.equal(fourth.queueAttempts, 4)
    assert.equal(fourth.nextAttempt, null)
    assert.equal(fourth.delaySeconds, null)
  })

  it("fails immediately on a non-retryable 400", () => {
    const failed = onQueueAttemptFailure({
      queueAttemptsBefore: 0,
      queuedAtMs: QUEUED_AT,
      nowMs: QUEUED_AT,
      error: new Error("[400 Bad Request] INVALID_ARGUMENT"),
    })
    assert.equal(failed.status, "failed")
    assert.equal(failed.nextAttempt, null)
  })
})

describe("processApplyQueueMessage", () => {
  it("pending → running → ready on success", async () => {
    const store = new Map<string, ApplyJobRecord>([["job_1", job()]])
    const ready = await processApplyQueueMessage(
      { jobId: "job_1", attempt: 1 },
      {
        loadJob: async (id) => store.get(id) ?? null,
        savePatch: async (id, patch) => {
          const current = store.get(id)
          if (!current) return null
          const next = { ...current, ...patch }
          store.set(id, next)
          return next
        },
        runAnalyze: async () => result,
        runDraft: async () => {
          throw new Error("draft should not run")
        },
        readImage: async () => {
          throw new Error("no image")
        },
        enqueue: async () => ({ messageId: "m1" }),
        notifyReady: async () => undefined,
        notifyFailed: async () => undefined,
        acquireLock: async () => true,
        releaseLock: async () => undefined,
        now: () => QUEUED_AT + 10 * 60 * 1000,
      },
    )
    assert.equal(ready?.status, "ready")
    assert.equal(store.get("job_1")?.status, "ready")
    assert.equal(onQueueAttemptStart(QUEUED_AT).status, "running")
    assert.equal(
      onQueueAttemptSuccess({ queueAttemptsBefore: 0, nowMs: QUEUED_AT }).status,
      "ready",
    )
  })

  it("pending → running → pending and enqueues the next offset after a retryable failure", async () => {
    const store = new Map<string, ApplyJobRecord>([["job_1", job()]])
    const enqueued: Array<{ attempt: number; delaySeconds: number }> = []
    const next = await processApplyQueueMessage(
      { jobId: "job_1", attempt: 1 },
      {
        loadJob: async (id) => store.get(id) ?? null,
        savePatch: async (id, patch) => {
          const current = store.get(id)
          if (!current) return null
          const nextJob = { ...current, ...patch }
          store.set(id, nextJob)
          return nextJob
        },
        runAnalyze: async () => {
          throw new Error("[429] Resource exhausted")
        },
        runDraft: async () => {
          throw new Error("draft should not run")
        },
        readImage: async () => {
          throw new Error("no image")
        },
        enqueue: async ({ attempt, delaySeconds }) => {
          enqueued.push({ attempt, delaySeconds })
          return { messageId: "m2" }
        },
        notifyReady: async () => undefined,
        notifyFailed: async () => undefined,
        acquireLock: async () => true,
        releaseLock: async () => undefined,
        now: () => QUEUED_AT + 10 * 60 * 1000,
      },
    )
    assert.equal(next?.status, "pending")
    assert.equal(next?.queueAttempts, 1)
    assert.deepEqual(enqueued, [{ attempt: 2, delaySeconds: 20 * 60 }])
  })

  it("marks failed (DLQ) after the 4th queue failure and notifies", async () => {
    const store = new Map<string, ApplyJobRecord>([["job_1", job({ queueAttempts: 3 })]])
    let failedNotice = 0
    const next = await processApplyQueueMessage(
      { jobId: "job_1", attempt: 4 },
      {
        loadJob: async (id) => store.get(id) ?? null,
        savePatch: async (id, patch) => {
          const current = store.get(id)
          if (!current) return null
          const nextJob = { ...current, ...patch }
          store.set(id, nextJob)
          return nextJob
        },
        runAnalyze: async () => {
          throw new Error("[503] overloaded")
        },
        runDraft: async () => {
          throw new Error("draft should not run")
        },
        readImage: async () => {
          throw new Error("no image")
        },
        enqueue: async () => {
          throw new Error("should not enqueue after DLQ")
        },
        notifyReady: async () => undefined,
        notifyFailed: async () => {
          failedNotice += 1
        },
        acquireLock: async () => true,
        releaseLock: async () => undefined,
        now: () => QUEUED_AT + 90 * 60 * 1000,
      },
    )
    assert.equal(next?.status, "failed")
    assert.equal(next?.queueAttempts, 4)
    assert.equal(failedNotice, 1)
  })

  it("keeps the job ready if Telegram notify throws", async () => {
    const store = new Map<string, ApplyJobRecord>([["job_1", job()]])
    const ready = await processApplyQueueMessage(
      { jobId: "job_1", attempt: 1 },
      {
        loadJob: async (id) => store.get(id) ?? null,
        savePatch: async (id, patch) => {
          const current = store.get(id)
          if (!current) return null
          const nextJob = { ...current, ...patch }
          store.set(id, nextJob)
          return nextJob
        },
        runAnalyze: async () => result,
        runDraft: async () => {
          throw new Error("draft should not run")
        },
        readImage: async () => {
          throw new Error("no image")
        },
        enqueue: async () => ({ messageId: "m1" }),
        notifyReady: async () => {
          throw new Error("telegram down")
        },
        notifyFailed: async () => undefined,
        acquireLock: async () => true,
        releaseLock: async () => undefined,
        now: () => QUEUED_AT + 10 * 60 * 1000,
      },
    )
    assert.equal(ready?.status, "ready")
    assert.equal(store.get("job_1")?.status, "ready")
  })

  it("re-enqueues the next attempt when a stale delivery arrives after a recorded failure", async () => {
    const store = new Map<string, ApplyJobRecord>([
      ["job_1", job({ queueAttempts: 1, status: "pending" })],
    ])
    const enqueued: Array<{ attempt: number; delaySeconds: number }> = []
    const next = await processApplyQueueMessage(
      { jobId: "job_1", attempt: 1 },
      {
        loadJob: async (id) => store.get(id) ?? null,
        savePatch: async (id, patch) => {
          const current = store.get(id)
          if (!current) return null
          const nextJob = { ...current, ...patch }
          store.set(id, nextJob)
          return nextJob
        },
        runAnalyze: async () => {
          throw new Error("should not run Gemini again")
        },
        runDraft: async () => {
          throw new Error("draft should not run")
        },
        readImage: async () => {
          throw new Error("no image")
        },
        enqueue: async ({ attempt, delaySeconds }) => {
          enqueued.push({ attempt, delaySeconds })
          return { messageId: "m3" }
        },
        notifyReady: async () => undefined,
        notifyFailed: async () => undefined,
        acquireLock: async () => true,
        releaseLock: async () => undefined,
        now: () => QUEUED_AT + 10 * 60 * 1000,
      },
    )
    assert.equal(next?.status, "pending")
    assert.deepEqual(enqueued, [{ attempt: 2, delaySeconds: 20 * 60 }])
  })
})
