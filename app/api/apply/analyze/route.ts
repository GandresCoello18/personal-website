import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requestHasApplyUnlock } from "@/lib/apply/auth"
import { isValidCvKey } from "@/lib/apply/cv"
import { jobCategorySchema } from "@/lib/apply/types"
import { analyzeJobPosting } from "@/services/apply/analyze"

const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/jpg"])

export async function POST(request: NextRequest) {
  try {
    if (!requestHasApplyUnlock(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const form = await request.formData()
    const mode = String(form.get("mode") || "")
    const categoryOverrideRaw = form.get("categoryOverride")
    const manualCvRaw = form.get("manualCv")

    const categoryOverride =
      typeof categoryOverrideRaw === "string" && categoryOverrideRaw
        ? jobCategorySchema.parse(categoryOverrideRaw)
        : undefined
    const manualCv =
      typeof manualCvRaw === "string" && isValidCvKey(manualCvRaw) ? manualCvRaw : undefined

    if (mode === "text") {
      const text = String(form.get("text") || "").trim()
      if (text.length < 20) {
        return NextResponse.json(
          { error: "Pega el texto completo de la vacante (mínimo 20 caracteres)." },
          { status: 400 },
        )
      }

      const result = await analyzeJobPosting({
        mode: "text",
        text,
        categoryOverride,
        manualCv,
      })
      return NextResponse.json(result)
    }

    if (mode === "image") {
      const file = form.get("image")
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Sube una imagen PNG o JPG." }, { status: 400 })
      }

      const mimeType = file.type === "image/jpg" ? "image/jpeg" : file.type
      if (!ALLOWED_MIME.has(mimeType) && !ALLOWED_MIME.has(file.type)) {
        return NextResponse.json(
          { error: "Formato no soportado. Usa PNG, JPG o JPEG." },
          { status: 400 },
        )
      }

      if (file.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: "La imagen supera el límite de 5 MB." },
          { status: 400 },
        )
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await analyzeJobPosting({
        mode: "image",
        mimeType: mimeType === "image/jpg" ? "image/jpeg" : mimeType,
        base64: buffer.toString("base64"),
        categoryOverride,
        manualCv,
      })
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "mode debe ser text o image" }, { status: 400 })
  } catch (error) {
    console.error("[apply/analyze]", error)
    const message = error instanceof Error ? error.message : "Error al analizar"
    const userFacing = message.includes("saturado")
      ? message
      : "No se pudo analizar la vacante."
    return NextResponse.json(
      {
        error: userFacing,
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    )
  }
}
