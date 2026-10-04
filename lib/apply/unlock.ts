import { isValidApplySecret, requireApplySecrets } from "./secrets.ts"
import { signApplySession } from "./session.ts"
import type { MemoryRateLimiter, RateLimitResult } from "../security/rate-limit.ts"

export type UnlockSuccess = {
  ok: true
  token: string
}

export type UnlockFailure = {
  ok: false
  status: 400 | 401 | 429 | 500
  error: string
  retryAfterMs?: number
}

export type UnlockResult = UnlockSuccess | UnlockFailure

export function attemptUnlock(
  secret: unknown,
  limiter: MemoryRateLimiter,
  ip: string,
  now = Date.now(),
): UnlockResult {
  const secrets = requireApplySecrets()
  if (!secrets.ok) {
    return { ok: false, status: 500, error: "Configuración de acceso incompleta" }
  }

  const limited = limiter.check(ip, now)
  if (!limited.ok) {
    return {
      ok: false,
      status: 429,
      error: "Demasiados intentos. Espera un momento.",
      retryAfterMs: limited.retryAfterMs,
    }
  }

  if (typeof secret !== "string" || secret.length === 0) {
    return { ok: false, status: 401, error: "Acceso denegado" }
  }

  if (!isValidApplySecret(secret, secrets.accessSecret)) {
    return { ok: false, status: 401, error: "Acceso denegado" }
  }

  return { ok: true, token: signApplySession(secrets.sessionSecret, now) }
}

export function rateLimitDenied(result: RateLimitResult): boolean {
  return !result.ok
}
