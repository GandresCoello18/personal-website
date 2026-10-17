import { NextResponse } from "next/server"
import { isRetryableError } from "../ai/retry.ts"
import type { QueuedApplyResponse } from "./job-types.ts"

export function shouldQueueGeminiFailure(error: unknown): boolean {
  return isRetryableError(error)
}

export async function respondQueuedOrError(
  error: unknown,
  enqueue: () => Promise<QueuedApplyResponse>,
  fallbackMessage: string,
): Promise<NextResponse> {
  const message = error instanceof Error ? error.message : fallbackMessage
  if (!shouldQueueGeminiFailure(error)) {
    const userFacing =
      message.includes("saturado") || message.includes("Timeout") ? message : fallbackMessage
    return NextResponse.json(
      {
        error: userFacing,
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    )
  }

  try {
    const queued = await enqueue()
    return NextResponse.json(queued, { status: 202 })
  } catch (enqueueError) {
    const enqueueMessage =
      enqueueError instanceof Error ? enqueueError.message : String(enqueueError)
    return NextResponse.json(
      {
        error: enqueueMessage,
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 503 },
    )
  }
}
