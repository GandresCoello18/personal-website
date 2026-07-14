import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

export const APPLY_COOKIE_NAME = "apply_unlock"
export const APPLY_COOKIE_MAX_AGE = 60 * 60 * 12 // 12h

export function getApplySecret(): string | undefined {
  return process.env.APPLY_ACCESS_SECRET
}

export function isValidApplySecret(secret: string): boolean {
  const expected = getApplySecret()
  if (!expected) return false
  return secret === expected
}

export async function hasApplyUnlockCookie(): Promise<boolean> {
  const jar = await cookies()
  return jar.get(APPLY_COOKIE_NAME)?.value === "1"
}

export function requestHasApplyUnlock(request: NextRequest): boolean {
  return request.cookies.get(APPLY_COOKIE_NAME)?.value === "1"
}
