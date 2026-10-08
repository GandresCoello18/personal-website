import { channelLabel, formatAppliedAt } from "./dates.ts"
import type { ApplyCheckResult, ApplyRecord } from "./types.ts"
import type { RadarStatField } from "./store.ts"

export const TELEGRAM_MAX_MESSAGE_CHARS = 4096
export const TELEGRAM_MAX_CALLBACK_DATA_BYTES = 64

const CALLBACK_PREFIX = "a"

/** Escape `& < >` so Telegram HTML shows the literal text (no markup). */
export function escapeTelegramHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export function utf8ByteLength(value: string): number {
  return Buffer.byteLength(value, "utf8")
}

export function clipTelegramText(value: string, maxChars = TELEGRAM_MAX_MESSAGE_CHARS): string {
  if (value.length <= maxChars) return value
  const ellipsis = "…"
  return `${value.slice(0, Math.max(0, maxChars - ellipsis.length))}${ellipsis}`
}

/**
 * `callback_data` = `a:<action>:<token>`. Telegram rejects payloads over 64 bytes.
 * The token is truncated so the full string always fits.
 */
export function callbackData(action: string, token: string): string {
  const safeAction = action.replace(/[^a-z0-9_]/gi, "").slice(0, 12) || "x"
  const prefix = `${CALLBACK_PREFIX}:${safeAction}:`
  const prefixBytes = utf8ByteLength(prefix)
  const budget = TELEGRAM_MAX_CALLBACK_DATA_BYTES - prefixBytes
  if (budget <= 0) return prefix.slice(0, TELEGRAM_MAX_CALLBACK_DATA_BYTES)

  let safeToken = token
  while (utf8ByteLength(safeToken) > budget) {
    safeToken = safeToken.slice(0, Math.max(0, safeToken.length - 1))
  }
  return `${prefix}${safeToken}`
}

export function formatManualApplyNotice(record: ApplyRecord): string {
  const role = [record.company, record.position].filter(Boolean).join(" — ")
  const lines = [
    "📨 Postulación manual registrada",
    escapeTelegramHtml(role || "Vacante sin título"),
    `📅 ${formatAppliedAt(record.appliedAt)} · ${channelLabel(record.channel)}${
      record.email ? ` · a ${escapeTelegramHtml(record.email)}` : ""
    }`,
  ]
  if (record.urlKey) lines.push(`🔑 ${escapeTelegramHtml(record.urlKey)}`)
  return clipTelegramText(lines.join("\n"))
}

export function formatYaResponse(result: ApplyCheckResult): string {
  if (result.historyUnavailable) {
    return "El historial no está disponible ahora mismo. Inténtalo en un momento."
  }
  if (result.status === "applied" && result.record) {
    const role = [result.record.company, result.record.position].filter(Boolean).join(" — ")
    return clipTelegramText(
      [
        `Ya aplicaste el ${formatAppliedAt(result.record.appliedAt)}`,
        escapeTelegramHtml(role || result.record.urlKey || "esta vacante"),
        `${channelLabel(result.record.channel)}${
          result.record.email ? ` · a ${escapeTelegramHtml(result.record.email)}` : ""
        }`,
      ].join("\n"),
    )
  }
  if (result.status === "in_progress") {
    return "Hay un envío en curso para esta vacante."
  }
  return "No hay registro"
}

export function formatHoySummary(
  day: string,
  stats: Partial<Record<RadarStatField, number>>,
  pausedUntil: string | null,
): string {
  const n = (field: RadarStatField) => stats[field] ?? 0
  const lines = [
    `📊 Radar · ${escapeTelegramHtml(day)}`,
    `Vistas: ${n("seen")} · duplicadas: ${n("duplicates")} · filtradas: ${n("filtered")} · analizadas: ${n("analyzed")}`,
    `Avisos: ${n("notified")} · enviadas por correo: ${n("sent")} · "ya apliqué": ${n("manual_external")} · descartadas: ${n("dismissed")}`,
    `Postulaciones manuales (/apply): ${n("sent")}`,
    `Repetidas evitadas: ${n("already_applied")}`,
    `Gemini: ${n("llm_calls")} llamadas · errores: ${n("errors")}`,
  ]
  if (pausedUntil) {
    lines.push(`⏸ Avisos en pausa hasta ${escapeTelegramHtml(formatAppliedAt(pausedUntil))}`)
  }
  return clipTelegramText(lines.join("\n"))
}

export function formatPauseResponse(untilIso: string): string {
  return `Avisos silenciados 24 h (hasta ${formatAppliedAt(untilIso)}). El historial y /apply siguen activos.`
}

export function formatYaUsage(): string {
  return "Uso: /ya &lt;url&gt;\nEjemplo: /ya https://www.linkedin.com/jobs/view/4012345678/"
}

export function splitTelegramMessages(
  text: string,
  maxChars = TELEGRAM_MAX_MESSAGE_CHARS,
): string[] {
  if (text.length <= maxChars) return [text]
  const chunks: string[] = []
  let rest = text
  while (rest.length > maxChars) {
    let cut = rest.lastIndexOf("\n", maxChars)
    if (cut < maxChars * 0.6) cut = maxChars
    chunks.push(rest.slice(0, cut))
    rest = rest.slice(cut).replace(/^\n/, "")
  }
  if (rest) chunks.push(rest)
  return chunks
}
