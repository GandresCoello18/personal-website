import { createMemoryRateLimiter } from "./rate-limit.ts"

/** Unlock attempts: 5 per 15 minutes, then 15 minutes of backoff. */
export const unlockLimiter = createMemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  backoffMs: 15 * 60 * 1000,
})

/** Public contact form: 3 messages per 10 minutes. */
export const contactShortLimiter = createMemoryRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 3,
  backoffMs: 10 * 60 * 1000,
})

/** Public contact form: 8 messages per hour. */
export const contactHourLimiter = createMemoryRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 8,
  backoffMs: 30 * 60 * 1000,
})

/** Gemini-backed apply/interview routes after a valid session. */
export const applyAiLimiter = createMemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  backoffMs: 5 * 60 * 1000,
})

/** Sending real application emails after a valid session. */
export const applySendLimiter = createMemoryRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 8,
  backoffMs: 30 * 60 * 1000,
})
