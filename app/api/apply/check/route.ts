import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requestHasApplyUnlock } from "@/lib/apply/auth"
import { checkApply } from "@/lib/radar/dedupe"
import { applyCheckSchema } from "@/lib/radar/types"
import { getRadarStore } from "@/lib/radar/store-upstash"
import { tooManyRequests } from "@/lib/http/rate-limit-response"
import { getClientIp } from "@/lib/security/client-ip"
import { applyCheckLimiter } from "@/lib/security/limiters"

export async function POST(request: NextRequest) {
  try {
    if (!requestHasApplyUnlock(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const limited = applyCheckLimiter.check(getClientIp(request))
    if (!limited.ok) {
      return tooManyRequests(limited, "Demasiadas consultas al historial. Espera un momento.")
    }

    const body = await request.json()
    const parsed = applyCheckSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de comprobación inválidos", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const result = await checkApply(parsed.data, getRadarStore())
    return NextResponse.json(result)
  } catch (error) {
    console.error("[apply/check]", error)
    return NextResponse.json({
      status: "unknown",
      match: null,
      record: null,
      softWarnings: [],
      identityWeak: true,
      historyUnavailable: true,
    })
  }
}
