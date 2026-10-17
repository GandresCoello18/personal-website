import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requestHasApplyUnlock } from "@/lib/apply/auth"
import { isValidCvKey } from "@/lib/apply/cv"
import { enqueueDraftJob } from "@/lib/apply/enqueue-job"
import { respondQueuedOrError } from "@/lib/apply/queue-from-route"
import { jobCategorySchema, jobExtractSchema } from "@/lib/apply/types"
import { tooManyRequests } from "@/lib/http/rate-limit-response"
import { getClientIp } from "@/lib/security/client-ip"
import { applyAiLimiter } from "@/lib/security/limiters"
import { draftFromExtract } from "@/services/apply/draft"

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    if (!requestHasApplyUnlock(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const limited = applyAiLimiter.check(getClientIp(request))
    if (!limited.ok) {
      return tooManyRequests(limited)
    }

    const body = await request.json()
    const extractParsed = jobExtractSchema.safeParse(body?.extract)
    if (!extractParsed.success) {
      return NextResponse.json(
        { error: "Extract inválido. Analiza la vacante primero." },
        { status: 400 },
      )
    }

    const categoryOverride =
      typeof body?.categoryOverride === "string" && body.categoryOverride
        ? jobCategorySchema.parse(body.categoryOverride)
        : undefined
    const manualCv =
      typeof body?.manualCv === "string" && isValidCvKey(body.manualCv) ? body.manualCv : undefined
    const recruiterProfileText =
      typeof body?.recruiterProfileText === "string" ? body.recruiterProfileText : undefined

    const input = {
      extract: extractParsed.data,
      categoryOverride,
      manualCv,
      recruiterProfileText,
    }

    try {
      const result = await draftFromExtract(input)

      if (result.error && !result.draft) {
        return NextResponse.json(result, { status: 400 })
      }

      return NextResponse.json(result)
    } catch (error) {
      console.error("[apply/draft]", error)
      return respondQueuedOrError(
        error,
        () => enqueueDraftJob(input),
        "No se pudo generar el correo.",
      )
    }
  } catch (error) {
    console.error("[apply/draft]", error)
    const message = error instanceof Error ? error.message : "Error al generar borrador"
    return NextResponse.json(
      {
        error: "No se pudo generar el correo.",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    )
  }
}
