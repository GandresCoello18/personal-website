import { checkApply } from "./dedupe.ts"
import { calendarDay } from "./dates.ts"
import { urlKeyFromUrl } from "./normalize.ts"
import type { RadarStore } from "./store.ts"
import {
  formatHoySummary,
  formatPauseResponse,
  formatYaResponse,
  formatYaUsage,
} from "./telegram-format.ts"

export type TelegramCommandResult = {
  text: string
}

const PAUSE_SECONDS = 24 * 60 * 60

export function parseTelegramCommand(text: string | undefined | null): {
  command: string
  argument: string
} | null {
  if (!text) return null
  const trimmed = text.trim()
  const match = trimmed.match(/^\/([a-zA-Z]+)(?:@\w+)?(?:\s+([\s\S]+))?$/)
  if (!match?.[1]) return null
  return {
    command: match[1].toLowerCase(),
    argument: (match[2] ?? "").trim(),
  }
}

export async function handleTelegramCommand(
  text: string | undefined,
  store: RadarStore | null,
  now = new Date(),
): Promise<TelegramCommandResult | null> {
  const parsed = parseTelegramCommand(text)
  if (!parsed) return null

  if (parsed.command === "hoy") {
    if (!store) {
      return { text: "El historial no está disponible ahora mismo." }
    }
    const day = calendarDay(now)
    const [stats, pause] = await Promise.all([store.getStats(day), store.getPauseUntil()])
    return { text: formatHoySummary(day, stats, pause) }
  }

  if (parsed.command === "ya") {
    if (!parsed.argument) return { text: formatYaUsage() }
    const urlKey = urlKeyFromUrl(parsed.argument)
    if (!urlKey) {
      return { text: "No pude leer esa URL. Pasa el enlace completo de la vacante." }
    }
    const result = await checkApply({ url: parsed.argument, company: "", position: "" }, store)
    return { text: formatYaResponse(result) }
  }

  if (parsed.command === "pausa") {
    if (!store) {
      return { text: "El historial no está disponible; no pude guardar la pausa." }
    }
    const until = new Date(now.getTime() + PAUSE_SECONDS * 1000)
    await store.setPauseUntil(until.toISOString(), PAUSE_SECONDS)
    return { text: formatPauseResponse(until.toISOString()) }
  }

  if (parsed.command === "start" || parsed.command === "help") {
    return {
      text: [
        "Comandos:",
        "/hoy — resumen de hoy",
        "/ya &lt;url&gt; — ¿ya apliqué?",
        "/pausa — silenciar avisos 24 h",
      ].join("\n"),
    }
  }

  return null
}
