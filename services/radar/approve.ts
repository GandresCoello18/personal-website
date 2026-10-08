import { registerExternalApply, sendWithDedupe, type DedupeResult } from "@/lib/radar/dedupe"
import { getRadarStore } from "@/lib/radar/store-upstash"
import { formatManualApplyNotice } from "@/lib/radar/telegram-format"
import type { ApplyRegisterInput } from "@/lib/radar/types"
import type { SendApplicationPayload } from "@/lib/apply/types"
import { sendJobApplication } from "@/services/apply/send-application"
import { sendTelegramMessageSafe } from "@/services/telegram/client"

export async function sendApplicationWithDedupe(
  payload: SendApplicationPayload,
): Promise<DedupeResult> {
  const result = await sendWithDedupe({
    store: getRadarStore(),
    payload,
    channel: "apply_manual",
    confirmDuplicate: payload.confirmDuplicate,
    send: async () => {
      await sendJobApplication(payload)
    },
  })
  if (result.ok) {
    await sendTelegramMessageSafe(formatManualApplyNotice(result.record))
  }
  return result
}

export async function registerManualApplication(input: ApplyRegisterInput): Promise<DedupeResult> {
  return registerExternalApply({
    store: getRadarStore(),
    input,
    confirmDuplicate: input.confirmDuplicate,
  })
}
