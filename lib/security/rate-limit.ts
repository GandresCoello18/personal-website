export type RateLimitResult = {
  ok: boolean
  remaining: number
  retryAfterMs: number
  resetAt: number
}

export type MemoryRateLimiterOptions = {
  windowMs: number
  max: number
  /** Extra cooldown after the window is exhausted. */
  backoffMs?: number
}

type Bucket = {
  count: number
  resetAt: number
  blockedUntil: number
}

export type MemoryRateLimiter = {
  check: (key: string, now?: number) => RateLimitResult
  reset: () => void
  size: () => number
}

const MAX_KEYS = 10_000

/**
 * Best-effort in-process limiter. On Vercel each isolate has its own map, so
 * this is a speed bump until Upstash Redis is added for the LinkedIn radar.
 */
export function createMemoryRateLimiter(options: MemoryRateLimiterOptions): MemoryRateLimiter {
  const store = new Map<string, Bucket>()
  const backoffMs = options.backoffMs ?? 0

  function prune(now: number) {
    if (store.size < MAX_KEYS) {
      for (const [key, bucket] of store) {
        if (bucket.resetAt <= now && bucket.blockedUntil <= now) {
          store.delete(key)
        }
      }
      return
    }
    store.clear()
  }

  return {
    check(key: string, now = Date.now()): RateLimitResult {
      prune(now)
      const existing = store.get(key)

      if (existing && existing.blockedUntil > now) {
        return {
          ok: false,
          remaining: 0,
          retryAfterMs: existing.blockedUntil - now,
          resetAt: existing.blockedUntil,
        }
      }

      if (!existing || existing.resetAt <= now) {
        const resetAt = now + options.windowMs
        store.set(key, { count: 1, resetAt, blockedUntil: 0 })
        return {
          ok: true,
          remaining: Math.max(0, options.max - 1),
          retryAfterMs: 0,
          resetAt,
        }
      }

      if (existing.count >= options.max) {
        const blockedUntil = Math.max(existing.resetAt, now + backoffMs)
        existing.blockedUntil = blockedUntil
        return {
          ok: false,
          remaining: 0,
          retryAfterMs: blockedUntil - now,
          resetAt: blockedUntil,
        }
      }

      existing.count += 1
      return {
        ok: true,
        remaining: Math.max(0, options.max - existing.count),
        retryAfterMs: 0,
        resetAt: existing.resetAt,
      }
    },
    reset() {
      store.clear()
    },
    size() {
      return store.size
    },
  }
}

export function retryAfterSeconds(retryAfterMs: number): number {
  return Math.max(1, Math.ceil(retryAfterMs / 1000))
}
