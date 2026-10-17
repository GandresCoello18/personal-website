import { APPLY_JOBS_TOPIC, type ApplyQueueMessage } from "./job-types.ts"
import { idempotencyKeyForAttempt } from "./job-transitions.ts"

export const APPLY_QUEUE_RETENTION_SECONDS = 2 * 24 * 60 * 60

export type SendApplyQueueMessage = (
  message: ApplyQueueMessage,
  options: { delaySeconds: number; idempotencyKey: string },
) => Promise<{ messageId: string | null }>

async function defaultSend(
  message: ApplyQueueMessage,
  options: { delaySeconds: number; idempotencyKey: string },
): Promise<{ messageId: string | null }> {
  const { send } = await import("@vercel/queue")
  return send(APPLY_JOBS_TOPIC, message, {
    delaySeconds: options.delaySeconds,
    idempotencyKey: options.idempotencyKey,
    retentionSeconds: APPLY_QUEUE_RETENTION_SECONDS,
  })
}

let sendImpl: SendApplyQueueMessage = defaultSend

export function setApplyQueueSender(impl: SendApplyQueueMessage | null) {
  sendImpl = impl ?? defaultSend
}

export async function enqueueApplyJobAttempt(input: {
  jobId: string
  attempt: number
  delaySeconds: number
}): Promise<{ messageId: string | null }> {
  const message: ApplyQueueMessage = { jobId: input.jobId, attempt: input.attempt }
  try {
    return await sendImpl(message, {
      delaySeconds: Math.max(0, input.delaySeconds),
      idempotencyKey: idempotencyKeyForAttempt(input.jobId, input.attempt),
    })
  } catch (error) {
    const name = error instanceof Error ? error.name : ""
    const text = error instanceof Error ? error.message : String(error)
    if (name.includes("Idempotency") || /idempotency/i.test(text)) {
      return { messageId: null }
    }
    throw error
  }
}
