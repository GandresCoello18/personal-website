import { randomUUID } from "node:crypto"
import type { AnalyzeInput } from "./analyze-core.ts"
import type { DraftInput } from "./draft-core.ts"
import { storeJobImage } from "./job-assets.ts"
import { enqueueApplyJobAttempt } from "./queue-client.ts"
import { saveApplyJob } from "./job-store.ts"
import {
  queuedApplyResponse,
  type AnalyzeJobInput,
  type ApplyJobRecord,
  type DraftJobInput,
  type QueuedApplyResponse,
} from "./job-types.ts"
import { delaySecondsUntilAttempt } from "./job-transitions.ts"

function newJobId(): string {
  if (typeof randomUUID === "function") return randomUUID()
  return `job_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

async function persistAndEnqueue(job: ApplyJobRecord): Promise<QueuedApplyResponse> {
  await saveApplyJob(job)
  const delaySeconds =
    delaySecondsUntilAttempt({
      attempt: 1,
      queuedAtMs: Date.parse(job.queuedAt),
      nowMs: Date.parse(job.queuedAt),
    }) ?? 0
  try {
    await enqueueApplyJobAttempt({ jobId: job.id, attempt: 1, delaySeconds })
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(
      `El trabajo se guardó (${job.id}) pero Vercel Queues no aceptó el mensaje. ` +
        `Habilita Queues en el dashboard del proyecto (beta pública, Hobby vale) y vuelve a desplegar. ` +
        `Detalle: ${detail}`,
    )
  }
  return queuedApplyResponse(job)
}

export async function enqueueAnalyzeJob(input: AnalyzeInput): Promise<QueuedApplyResponse> {
  const now = new Date().toISOString()
  const id = newJobId()
  let stored: AnalyzeJobInput

  if (input.mode === "text") {
    stored = {
      mode: "text",
      text: input.text,
      categoryOverride: input.categoryOverride,
      manualCv: input.manualCv,
    }
  } else {
    const imageRef = await storeJobImage({
      jobId: id,
      mimeType: input.mimeType,
      base64: input.base64,
    })
    stored = {
      mode: "image",
      mimeType: input.mimeType,
      imageRef,
      categoryOverride: input.categoryOverride,
      manualCv: input.manualCv,
    }
  }

  return persistAndEnqueue({
    id,
    kind: "analyze",
    status: "pending",
    createdAt: now,
    updatedAt: now,
    queuedAt: now,
    queueAttempts: 0,
    input: stored,
  })
}

export async function enqueueDraftJob(input: DraftInput): Promise<QueuedApplyResponse> {
  const now = new Date().toISOString()
  const stored: DraftJobInput = {
    extract: input.extract,
    categoryOverride: input.categoryOverride,
    manualCv: input.manualCv,
    recruiterProfileText: input.recruiterProfileText,
  }
  return persistAndEnqueue({
    id: newJobId(),
    kind: "draft",
    status: "pending",
    createdAt: now,
    updatedAt: now,
    queuedAt: now,
    queueAttempts: 0,
    input: stored,
    label: {
      company: input.extract.company,
      position: input.extract.position,
    },
  })
}
