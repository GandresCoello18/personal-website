import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requestHasApplyUnlock } from "@/lib/apply/auth"
import { applyRegisterSchema } from "@/lib/radar/types"
import { tooManyRequests } from "@/lib/http/rate-limit-response"
import { getClientIp } from "@/lib/security/client-ip"
import { applySendLimiter } from "@/lib/security/limiters"
import { dedupeFailureResponse } from "@/lib/http/dedupe-response"
import { registerManualApplication } from "@/services/radar/approve"

export async function POST(request: NextRequest) {
  try {
    if (!requestHasApplyUnlock(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const limited = applySendLimiter.check(getClientIp(request))
    if (!limited.ok) {
      return tooManyRequests(limited, "Demasiados registros. Intenta más tarde.")
    }

    const body = await request.json()
    const parsed = applyRegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de registro inválidos", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const result = await registerManualApplication(parsed.data)
    if (!result.ok) return dedupeFailureResponse(result)

    return NextResponse.json({
      success: true,
      message: "Vacante registrada como aplicada",
      record: result.record,
    })
  } catch (error) {
    console.error("[apply/register]", error)
    const message = error instanceof Error ? error.message : "Error al registrar"
    return NextResponse.json(
      {
        error: "No se pudo registrar la postulación.",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    )
  }
}
