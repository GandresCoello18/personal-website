import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { APPLY_COOKIE_NAME, verifyApplySession } from "./session.ts"

export {
  APPLY_COOKIE_MAX_AGE,
  APPLY_COOKIE_NAME,
  applyCookieOptions,
} from "./session.ts"
export { getApplyAccessSecret as getApplySecret, isValidApplySecret } from "./secrets.ts"

export async function hasApplyUnlockCookie(): Promise<boolean> {
  const jar = await cookies()
  return verifyApplySession(jar.get(APPLY_COOKIE_NAME)?.value)
}

export function requestHasApplyUnlock(request: NextRequest): boolean {
  return verifyApplySession(request.cookies.get(APPLY_COOKIE_NAME)?.value)
}
