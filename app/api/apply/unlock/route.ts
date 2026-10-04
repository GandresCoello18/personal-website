import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { APPLY_COOKIE_NAME, applyCookieOptions } from "@/lib/apply/session"
import { attemptUnlock } from "@/lib/apply/unlock"
import { getClientIp } from "@/lib/security/client-ip"
import { unlockLimiter } from "@/lib/security/limiters"
import { retryAfterSeconds } from "@/lib/security/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = attemptUnlock(body?.secret, unlockLimiter, getClientIp(request))

    if (!result.ok) {
      const headers =
        result.status === 429 && result.retryAfterMs
          ? { "Retry-After": String(retryAfterSeconds(result.retryAfterMs)) }
          : undefined
      return NextResponse.json({ error: result.error }, { status: result.status, headers })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(APPLY_COOKIE_NAME, result.token, applyCookieOptions())
    return response
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 })
  }
}
