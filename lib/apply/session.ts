import { createHmac, randomBytes } from "node:crypto"
import { getApplySessionSecret } from "./secrets.ts"
import { timingSafeEqualString } from "../security/timing.ts"

export const APPLY_COOKIE_NAME = "apply_unlock"
export const APPLY_COOKIE_MAX_AGE = 60 * 60 * 12

const TOKEN_PARTS = 3

export type ApplyCookieOptions = {
  httpOnly: true
  secure: boolean
  sameSite: "lax"
  path: "/"
  maxAge: number
}

export function applyCookieOptions(): ApplyCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" || process.env.VERCEL === "1",
    sameSite: "lax",
    path: "/",
    maxAge: APPLY_COOKIE_MAX_AGE,
  }
}

export function signApplySession(
  sessionSecret = getApplySessionSecret(),
  now = Date.now(),
  nonce = randomBytes(16).toString("base64url"),
): string {
  if (!sessionSecret) {
    throw new Error("APPLY_SESSION_SECRET is not configured")
  }
  const exp = now + APPLY_COOKIE_MAX_AGE * 1000
  const payload = `${exp}.${nonce}`
  const signature = createHmac("sha256", sessionSecret).update(payload).digest("base64url")
  return `${payload}.${signature}`
}

export function verifyApplySession(
  token: string | undefined,
  sessionSecret = getApplySessionSecret(),
  now = Date.now(),
): boolean {
  if (!token || !sessionSecret) return false
  const parts = token.split(".")
  if (parts.length !== TOKEN_PARTS) return false

  const [expRaw, nonce, signature] = parts
  if (!expRaw || !nonce || !signature) return false
  if (!/^[0-9]+$/.test(expRaw)) return false
  if (!/^[A-Za-z0-9_-]+$/.test(nonce) || !/^[A-Za-z0-9_-]+$/.test(signature)) return false

  const exp = Number(expRaw)
  if (!Number.isSafeInteger(exp) || exp <= now) return false

  const payload = `${expRaw}.${nonce}`
  const expected = createHmac("sha256", sessionSecret).update(payload).digest("base64url")
  return timingSafeEqualString(signature, expected)
}
