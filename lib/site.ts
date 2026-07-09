const DEFAULT_SITE_URL = "https://andrescoellog.com"

/** Canonical site URL for metadata and JSON-LD. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL
  return raw.replace(/\/$/, "")
}

export function getSiteUrlObject(): URL {
  return new URL(getSiteUrl())
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`
}
