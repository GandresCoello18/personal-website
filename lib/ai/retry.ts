/** 1 initial attempt + 2 retries on retryable errors only. */
export const IN_REQUEST_MAX_ATTEMPTS = 3

/** Nominal backoff before retry 1 and retry 2 (jitter applied on top). */
export const IN_REQUEST_BACKOFF_MS = [1_000, 3_000] as const

/** Cap Retry-After so an in-request wait cannot eat the function budget. */
export const IN_REQUEST_RETRY_AFTER_CAP_MS = 8_000

const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504])
const NON_RETRYABLE_CLIENT_STATUS = new Set([400, 401, 403, 404, 413, 422])

export function getHttpStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined
  const record = error as {
    status?: unknown
    statusCode?: unknown
    httpStatusCode?: unknown
  }
  for (const value of [record.status, record.statusCode, record.httpStatusCode]) {
    if (typeof value === "number" && Number.isFinite(value)) return value
  }

  const message = error instanceof Error ? error.message : String(error)
  const bracket = message.match(/\[(\d{3})\b/)
  if (bracket) return Number(bracket[1])
  const http = message.match(/\bHTTP\s+(\d{3})\b/i)
  if (http) return Number(http[1])
  return undefined
}

function collectErrorText(error: unknown): string {
  if (error == null) return ""
  if (typeof error === "string") return error
  if (error instanceof Error) {
    const cause = error.cause != null ? ` ${collectErrorText(error.cause)}` : ""
    return `${error.name} ${error.message}${cause}`
  }
  try {
    return JSON.stringify(error)
  } catch {
    return String(error)
  }
}

export function isModelUnavailableError(error: unknown): boolean {
  const status = getHttpStatus(error)
  if (status === 404) return true
  const text = collectErrorText(error).toLowerCase()
  return (
    text.includes("model not found") ||
    text.includes("is not found") ||
    text.includes("not supported") ||
    text.includes("unknown model")
  )
}

/**
 * Retry only saturation, overload, and transport failures.
 * 4xx such as 400 fail immediately.
 */
export function isRetryableError(error: unknown): boolean {
  const status = getHttpStatus(error)
  if (status !== undefined) {
    if (NON_RETRYABLE_CLIENT_STATUS.has(status)) return false
    if (RETRYABLE_STATUS.has(status)) return true
  }

  const text = collectErrorText(error)
  const lower = text.toLowerCase()

  if (/\b(400|401|403)\b/.test(text) && /\[(400|401|403)\b/.test(text)) {
    return false
  }

  if (
    lower.includes("high demand") ||
    lower.includes("alta demanda") ||
    lower.includes("saturado") ||
    lower.includes("resource exhausted") ||
    lower.includes("overloaded") ||
    lower.includes("unavailable") ||
    lower.includes("too many requests") ||
    lower.includes("try again later")
  ) {
    return true
  }

  if (
    lower.includes("timeout") ||
    lower.includes("timed out") ||
    lower.includes("etimedout") ||
    lower.includes("econnreset") ||
    lower.includes("econnrefused") ||
    lower.includes("enotfound") ||
    lower.includes("eai_again") ||
    lower.includes("fetch failed") ||
    lower.includes("network") ||
    lower.includes("socket") ||
    lower.includes("aborted")
  ) {
    return true
  }

  return false
}

function parseRetryDelayToken(raw: string): number | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const seconds = trimmed.match(/^(\d+(?:\.\d+)?)\s*s$/i)
  if (seconds) return Math.round(Number(seconds[1]) * 1000)
  const millis = trimmed.match(/^(\d+(?:\.\d+)?)\s*ms$/i)
  if (millis) return Math.round(Number(millis[1]))
  const plain = Number(trimmed)
  if (Number.isFinite(plain) && plain >= 0) {
    return plain > 120 ? Math.round(plain) : Math.round(plain * 1000)
  }
  return null
}

function retryAfterFromDetails(error: unknown): number | null {
  if (!error || typeof error !== "object") return null
  const record = error as {
    retryAfter?: unknown
    retryDelay?: unknown
    errorDetails?: unknown
  }
  if (typeof record.retryAfter === "number" && Number.isFinite(record.retryAfter)) {
    return record.retryAfter > 120
      ? Math.round(record.retryAfter)
      : Math.round(record.retryAfter * 1000)
  }
  if (typeof record.retryAfter === "string") {
    const parsed = parseRetryDelayToken(record.retryAfter)
    if (parsed != null) return parsed
  }
  if (typeof record.retryDelay === "string") {
    const parsed = parseRetryDelayToken(record.retryDelay)
    if (parsed != null) return parsed
  }
  if (Array.isArray(record.errorDetails)) {
    for (const detail of record.errorDetails) {
      if (!detail || typeof detail !== "object") continue
      const retryDelay = (detail as { retryDelay?: unknown }).retryDelay
      if (typeof retryDelay === "string") {
        const parsed = parseRetryDelayToken(retryDelay)
        if (parsed != null) return parsed
      }
    }
  }
  return null
}

/** Milliseconds to wait from Retry-After / Google retryDelay, if present. */
export function parseRetryAfterMs(error: unknown): number | null {
  const fromObject = retryAfterFromDetails(error)
  if (fromObject != null) return fromObject

  const text = collectErrorText(error)
  const header = text.match(/retry-after[:\s]+"?(\d+(?:\.\d+)?)"?/i)
  if (header) {
    const seconds = Number(header[1])
    if (Number.isFinite(seconds)) return Math.round(seconds * 1000)
  }
  const google = text.match(/retryDelay"?\s*[:=]\s*"?(\d+(?:\.\d+)?)s"?/i)
  if (google) return Math.round(Number(google[1]) * 1000)
  return null
}

export type BackoffOptions = {
  random?: () => number
}

/**
 * Wait before in-request retry `failedAttempt` (1 or 2).
 * Uses ~1s then ~3s with ±20% jitter, or Retry-After when it is larger (capped).
 */
export function inRequestBackoffMs(
  failedAttempt: number,
  retryAfterMs: number | null = null,
  options: BackoffOptions = {},
): number {
  const nominal = IN_REQUEST_BACKOFF_MS[failedAttempt - 1] ?? IN_REQUEST_BACKOFF_MS[1]
  const random = options.random ?? Math.random
  const jitter = 0.8 + random() * 0.4
  const withJitter = Math.round(nominal * jitter)
  if (retryAfterMs == null || retryAfterMs <= 0) return withJitter
  const capped = Math.min(retryAfterMs, IN_REQUEST_RETRY_AFTER_CAP_MS)
  return Math.max(withJitter, capped)
}

export async function sleep(ms: number): Promise<void> {
  if (ms <= 0) return
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export type InRequestRetryOptions = {
  now?: () => number
  sleep?: (ms: number) => Promise<void>
  random?: () => number
  deadlineMs?: number
  maxAttempts?: number
}

export async function withInRequestRetries<T>(
  run: () => Promise<T>,
  options: InRequestRetryOptions = {},
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? IN_REQUEST_MAX_ATTEMPTS
  const now = options.now ?? Date.now
  const wait = options.sleep ?? sleep
  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await run()
    } catch (error) {
      lastError = error
      if (!isRetryableError(error) || attempt >= maxAttempts) throw error
      const delay = inRequestBackoffMs(attempt, parseRetryAfterMs(error), {
        random: options.random,
      })
      if (options.deadlineMs != null && now() + delay >= options.deadlineMs) {
        throw error
      }
      await wait(delay)
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError))
}
