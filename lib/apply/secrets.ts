import { timingSafeEqualString } from "../security/timing.ts"

export function getApplyAccessSecret(): string | undefined {
  const value = process.env.APPLY_ACCESS_SECRET
  return value && value.length > 0 ? value : undefined
}

export function getApplySessionSecret(): string | undefined {
  const value = process.env.APPLY_SESSION_SECRET
  return value && value.length > 0 ? value : undefined
}

export function requireApplySecrets():
  { ok: true; accessSecret: string; sessionSecret: string } | { ok: false } {
  const accessSecret = getApplyAccessSecret()
  const sessionSecret = getApplySessionSecret()
  if (!accessSecret || !sessionSecret) return { ok: false }
  return { ok: true, accessSecret, sessionSecret }
}

export function isValidApplySecret(secret: string, expected = getApplyAccessSecret()): boolean {
  if (!expected) return false
  return timingSafeEqualString(secret, expected)
}
