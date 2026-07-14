import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requestHasApplyUnlock } from "@/lib/apply/auth"
import { isValidCvKey } from "@/lib/apply/cv"
import { jobCategorySchema, jobExtractSchema } from "@/lib/apply/types"
import { draftFromExtract } from "@/services/apply/analyze"

export async function POST(request: NextRequest) {
  try {
    if (!requestHasApplyUnlock(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const extractParsed = jobExtractSchema.safeParse(body?.extract)
    if (!extractParsed.success) {
      return NextResponse.json({ error: "Extract inválido. Analiza la vacante primero." }, { status: 400 })
    }

    const categoryOverride =
      typeof body?.categoryOverride === "string" && body.categoryOverride
        ? jobCategorySchema.parse(body.categoryOverride)
        : undefined
    const manualCv =
      typeof body?.manualCv === "string" && isValidCvKey(body.manualCv) ? body.manualCv : undefined

    const result = await draftFromExtract({
      extract: extractParsed.data,
      categoryOverride,
      manualCv,
    })

    if (result.error && !result.draft) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[apply/draft]", error)
    const message = error instanceof Error ? error.message : "Error al generar borrador"
    const userFacing =
      message.includes("saturado") || message.includes("Timeout")
        ? message
        : "No se pudo generar el correo."
    return NextResponse.json(
      {
        error: userFacing,
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    )
  }
}
