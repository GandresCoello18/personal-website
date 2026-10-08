import { getTelegramBotToken, getTelegramChatId } from "@/lib/radar/telegram-guard"
import { splitTelegramMessages } from "@/lib/radar/telegram-format"

const TELEGRAM_API = "https://api.telegram.org"

export type TelegramSendResult = {
  ok: boolean
  skipped?: boolean
}

export async function sendTelegramMessage(
  text: string,
  options: {
    chatId?: string
    token?: string
    parseMode?: "HTML"
    fetchImpl?: typeof fetch
  } = {},
): Promise<TelegramSendResult> {
  const token = options.token ?? getTelegramBotToken()
  const chatId = options.chatId ?? getTelegramChatId()
  if (!token || !chatId) {
    return { ok: true, skipped: true }
  }

  const fetchImpl = options.fetchImpl ?? fetch
  const chunks = splitTelegramMessages(text)
  for (const chunk of chunks) {
    const response = await fetchImpl(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: chunk,
        parse_mode: options.parseMode ?? "HTML",
        disable_web_page_preview: true,
      }),
    })
    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      throw new Error(`Telegram sendMessage ${response.status} ${detail}`.trim())
    }
  }
  return { ok: true }
}

export async function sendTelegramMessageSafe(text: string): Promise<void> {
  try {
    await sendTelegramMessage(text)
  } catch (error) {
    console.error("[telegram] no se pudo enviar el mensaje", error)
  }
}
