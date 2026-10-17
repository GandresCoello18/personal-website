import { absoluteUrl } from "../site.ts"
import { escapeTelegramHtml } from "../radar/telegram-format.ts"
import type { ApplyJobRecord } from "./job-types.ts"

function jobUrl(jobId: string): string {
  return absoluteUrl(`/apply?job=${encodeURIComponent(jobId)}`)
}

function label(job: ApplyJobRecord): string {
  const company = job.label?.company?.trim() || job.result?.extract.company?.trim()
  const position = job.label?.position?.trim() || job.result?.extract.position?.trim()
  if (company && position) return `${company} / ${position}`
  if (company) return company
  if (position) return position
  return job.kind === "draft" ? "el correo" : "la vacante"
}

export function buildJobReadyTelegram(job: ApplyJobRecord): string {
  const what = job.kind === "draft" ? "Borrador listo" : "Análisis listo"
  const url = jobUrl(job.id)
  return (
    `<b>${escapeTelegramHtml(what)}</b> para ${escapeTelegramHtml(label(job))}.\n` +
    `Revísalo en ${escapeTelegramHtml(url)}\n` +
    `El envío por Gmail sigue siendo manual.`
  )
}

export function buildJobFailedTelegram(job: ApplyJobRecord): string {
  const action = job.kind === "draft" ? "generar el correo" : "analizar la vacante"
  const detail = (job.lastError || "Gemini no respondió").slice(0, 280)
  const url = jobUrl(job.id)
  return (
    `<b>Falló el reintento en cola</b>\n` +
    `No se pudo ${escapeTelegramHtml(action)} después de 4 intentos.\n` +
    `${escapeTelegramHtml(label(job))}\n` +
    `${escapeTelegramHtml(detail)}\n` +
    `${escapeTelegramHtml(url)}`
  )
}
