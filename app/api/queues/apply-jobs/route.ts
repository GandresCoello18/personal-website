import { handleCallback } from "@vercel/queue"
import { processQueuedApplyJob } from "@/services/apply/process-queued"
import type { ApplyQueueMessage } from "@/lib/apply/job-types"

export const runtime = "nodejs"
export const maxDuration = 60

export const POST = handleCallback<ApplyQueueMessage>(
  async (message) => {
    if (!message?.jobId) {
      throw new Error("Mensaje de cola sin jobId")
    }
    await processQueuedApplyJob(message)
  },
  {
    visibilityTimeoutSeconds: 90,
    retry: (error, metadata) => {
      if (metadata.deliveryCount >= 8) return { acknowledge: true }
      const text = error instanceof Error ? error.message : String(error)
      if (text.includes("job lock")) return { afterSeconds: 30 }
      return { afterSeconds: 60 }
    },
  },
)
