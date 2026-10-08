import { z } from "zod"
import { handleTelegramCommand } from "./telegram-commands.ts"
import {
  authorizeTelegramWebhook,
  getTelegramChatId,
  getTelegramWebhookSecret,
} from "./telegram-guard.ts"
import type { RadarStore } from "./store.ts"

const telegramId = z.union([z.number(), z.string()])

const telegramUpdateSchema = z.object({
  update_id: z.number().optional(),
  message: z
    .object({
      message_id: z.number().optional(),
      text: z.string().optional(),
      chat: z.object({ id: telegramId }),
      from: z.object({ id: telegramId }).optional(),
    })
    .optional(),
  callback_query: z
    .object({
      id: z.string(),
      data: z.string().optional(),
      from: z.object({ id: telegramId }),
      message: z
        .object({
          chat: z.object({ id: telegramId }),
        })
        .optional(),
    })
    .optional(),
})

export type WebhookHandleResult = {
  status: number
  body: { ok: true } | { error: string }
  reply?: string
}

export function readTelegramSecretHeader(headers: {
  get(name: string): string | null
}): string | null {
  return (
    headers.get("x-telegram-bot-api-secret-token") ?? headers.get("X-Telegram-Bot-Api-Secret-Token")
  )
}

export async function handleTelegramWebhook(input: {
  secretHeader: string | null
  payload: unknown
  store: RadarStore | null
  configuredSecret?: string | null
  allowedChatId?: string | null
  now?: Date
}): Promise<WebhookHandleResult> {
  const configuredSecret = input.configuredSecret ?? getTelegramWebhookSecret()
  const allowedChatId = input.allowedChatId ?? getTelegramChatId()

  const parsed = telegramUpdateSchema.safeParse(input.payload)
  const chatId = parsed.success
    ? (parsed.data.message?.chat.id ?? parsed.data.callback_query?.message?.chat.id)
    : undefined
  const fromId = parsed.success
    ? (parsed.data.message?.from?.id ?? parsed.data.callback_query?.from.id)
    : undefined

  const auth = authorizeTelegramWebhook({
    secretHeader: input.secretHeader,
    configuredSecret,
    allowedChatId,
    chatId,
    fromId,
  })

  if (!auth.ok && "status" in auth) {
    return { status: auth.status, body: { error: auth.reason } }
  }
  if (!auth.ok && "ignore" in auth) {
    return { status: 200, body: { ok: true } }
  }

  if (!parsed.success) {
    return { status: 200, body: { ok: true } }
  }

  if (parsed.data.callback_query) {
    return { status: 200, body: { ok: true } }
  }

  const command = await handleTelegramCommand(parsed.data.message?.text, input.store, input.now)
  return { status: 200, body: { ok: true }, reply: command?.text }
}
