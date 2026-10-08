const LINKEDIN_JOB_VIEW = /\/jobs\/view\/(\d+)/i
const LINKEDIN_CURRENT_JOB = /(?:^|[?&])currentJobId=(\d+)/i
const LINKEDIN_ACTIVITY_URN = /urn:li:activity:(\d+)/i
const LINKEDIN_ACTIVITY_SLUG = /(?:^|[^a-z0-9])activity-(\d+)(?:-|$)/i

export function canonicalizeUrlInput(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(withProtocol)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null
    if (!parsed.hostname) return null
    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Stable vacancy identity from a URL (D1 / D10).
 * LinkedIn jobs → `li:job:<id>`, posts → `li:post:<id>`, others → host+path.
 */
export function urlKeyFromUrl(raw: string | undefined | null): string | null {
  if (!raw) return null
  const canonical = canonicalizeUrlInput(raw)
  if (!canonical) return null

  const linkedInJob = linkedInJobId(canonical)
  if (linkedInJob) return `li:job:${linkedInJob}`

  const linkedInPost = linkedInActivityId(canonical)
  if (linkedInPost) return `li:post:${linkedInPost}`

  try {
    const parsed = new URL(canonical)
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "")
    const path = parsed.pathname.toLowerCase().replace(/\/+$/, "")
    return `${host}${path}`
  } catch {
    return null
  }
}

function linkedInJobId(url: string): string | null {
  const fromPath = url.match(LINKEDIN_JOB_VIEW)
  if (fromPath?.[1]) return fromPath[1]
  const fromQuery = url.match(LINKEDIN_CURRENT_JOB)
  if (fromQuery?.[1]) return fromQuery[1]
  return null
}

function linkedInActivityId(url: string): string | null {
  const fromUrn = url.match(LINKEDIN_ACTIVITY_URN)
  if (fromUrn?.[1]) return fromUrn[1]
  const fromSlug = url.match(LINKEDIN_ACTIVITY_SLUG)
  if (fromSlug?.[1]) return fromSlug[1]
  return null
}
