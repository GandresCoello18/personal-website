export const DEFAULT_RADAR_TIMEZONE = "America/Guayaquil"

export function radarTimezone(): string {
  return process.env.RADAR_TIMEZONE?.trim() || DEFAULT_RADAR_TIMEZONE
}

export function calendarDay(now: Date = new Date(), timeZone = radarTimezone()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
}

export function formatAppliedAt(iso: string, timeZone = radarTimezone()): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat("es-EC", {
    timeZone,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function channelLabel(channel: string): string {
  switch (channel) {
    case "apply_manual":
      return "vía /apply"
    case "radar_telegram":
      return "vía radar"
    case "manual_external":
      return "vía registro manual"
    default:
      return "vía otro canal"
  }
}

export function alreadyAppliedMessage(
  appliedAt: string,
  extras?: { channel?: string; email?: string | null },
) {
  const date = formatAppliedAt(appliedAt)
  const parts = [`Ya aplicaste el ${date}`]
  if (extras?.channel) parts.push(channelLabel(extras.channel))
  if (extras?.email) parts.push(`a ${extras.email}`)
  return parts.join(" · ")
}

export function formatAppliedBanner(record: {
  appliedAt: string
  company: string
  position: string
  channel: string
  email: string | null
}): string {
  const date = formatAppliedAt(record.appliedAt)
  const role = [record.company, record.position].filter(Boolean).join(" — ")
  const via = channelLabel(record.channel)
  const email = record.email ? `, a ${record.email}` : ""
  const target = role ? ` a ${role}` : ""
  return `Ya aplicaste el ${date}${target} (${via}${email})`
}

export function formatCompanyWarning(warning: {
  company: string
  position: string
  appliedAt: string
}): string {
  const date = formatAppliedAt(warning.appliedAt)
  const position = warning.position ? ` (${warning.position})` : ""
  return `Ya aplicaste a ${warning.company} el ${date}${position}`
}

export function formatEmailWarning(warning: { email: string; appliedAt: string }): string {
  return `Ya escribiste a ${warning.email} el ${formatAppliedAt(warning.appliedAt)}`
}
