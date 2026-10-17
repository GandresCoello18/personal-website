import { sendTelegramMessageSafe } from "@/services/telegram/client"
import { analyzeJobPosting } from "@/services/apply/analyze"
import { draftFromExtract } from "@/services/apply/draft"
import { buildJobFailedTelegram, buildJobReadyTelegram } from "@/lib/apply/job-notify"
import { processApplyQueueMessage } from "@/lib/apply/process-job"
import type { ApplyQueueMessage } from "@/lib/apply/job-types"

export async function processQueuedApplyJob(message: ApplyQueueMessage) {
  return processApplyQueueMessage(message, {
    runAnalyze: analyzeJobPosting,
    runDraft: draftFromExtract,
    notifyReady: async (job) => {
      await sendTelegramMessageSafe(buildJobReadyTelegram(job))
    },
    notifyFailed: async (job) => {
      await sendTelegramMessageSafe(buildJobFailedTelegram(job))
    },
  })
}
