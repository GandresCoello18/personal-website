import { timingSafeEqualString } from "../security/timing.ts"

export type TelegramGuardDecision =
  | { ok: true }
  | { ok: false; status: 401 | 503; reason: string }
  | { ok: false; ignore: true; reason: string }

export function normalizeTelegramId(value: string | number | undefined | null): string | null {
  if (value === undefined || value === null) return null
  const text = String(value).trim()
  return text ? text : null
}

/**
 * Webhook auth (Fase 2 / §6.2):
 * - sin TELEGRAM_WEBHOOK_SECRET o sin TELEGRAM_CHAT_ID → falla cerrado (503)
 * - header distinto → 401 (comparación en tiempo constante)
 * - chat.id / from.id distintos del permitido → se ignora (200 vacío)
 */
export function authorizeTelegramWebhook(input: {
  secretHeader: string | undefined | null
  configuredSecret: string | undefined | null
  allowedChatId: string | undefined | null
  chatId?: string | number | null
  fromId?: string | number | null
}): TelegramGuardDecision {
  const configuredSecret = input.configuredSecret?.trim() || ""
  const allowedChatId = normalizeTelegramId(input.allowedChatId)
  if (!configuredSecret || !allowedChatId) {
    return {
      ok: false,
      status: 503,
      reason: "Telegram no está configurado (falta TELEGRAM_WEBHOOK_SECRET o TELEGRAM_CHAT_ID).",
    }
  }

  const header = input.secretHeader ?? ""
  if (!timingSafeEqualString(header, configuredSecret)) {
    return { ok: false, status: 401, reason: "Secret token inválido." }
  }

  const chatId = normalizeTelegramId(input.chatId)
  const fromId = normalizeTelegramId(input.fromId)
  if (chatId !== allowedChatId) {
    return { ok: false, ignore: true, reason: "chat.id no autorizado" }
  }
  if (!fromId || fromId !== allowedChatId) {
    return { ok: false, ignore: true, reason: "from.id no autorizado" }
  }
  return { ok: true }
}

export function getTelegramWebhookSecret(env: NodeJS.ProcessEnv = process.env): string | null {
  const value = env.TELEGRAM_WEBHOOK_SECRET?.trim()
  return value || null
}

export function getTelegramChatId(env: NodeJS.ProcessEnv = process.env): string | null {
  return normalizeTelegramId(env.TELEGRAM_CHAT_ID)
}

export function getTelegramBotToken(env: NodeJS.ProcessEnv = process.env): string | null {
  const value = env.TELEGRAM_BOT_TOKEN?.trim()
  return value || null
}
