import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requestHasApplyUnlock } from "@/lib/apply/auth"
import { sendApplicationSchema } from "@/lib/apply/types"
import { tooManyRequests } from "@/lib/http/rate-limit-response"
import { getClientIp } from "@/lib/security/client-ip"
import { applySendLimiter } from "@/lib/security/limiters"
import { sendJobApplication } from "@/services/apply/send-application"

export async function POST(request: NextRequest) {
  try {
    if (!requestHasApplyUnlock(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const limited = applySendLimiter.check(getClientIp(request))
    if (!limited.ok) {
      return tooManyRequests(limited, "Demasiados envíos. Intenta más tarde.")
    }

    const body = await request.json()
    const parsed = sendApplicationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de envío inválidos", details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    await sendJobApplication(parsed.data)
    return NextResponse.json({ success: true, message: "Postulación enviada" })
  } catch (error) {
    console.error("[apply/send]", error)
    const message = error instanceof Error ? error.message : "Error al enviar"
    return NextResponse.json(
      {
        error: "No se pudo enviar la postulación.",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    )
  }
}
