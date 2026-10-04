import { NextResponse } from "next/server"
import { retryAfterSeconds, type RateLimitResult } from "../security/rate-limit.ts"

export function tooManyRequests(result: RateLimitResult, message = "Demasiadas solicitudes. Intenta más tarde.") {
  const seconds = retryAfterSeconds(result.retryAfterMs)
  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: {
        "Retry-After": String(seconds),
      },
    },
  )
}
