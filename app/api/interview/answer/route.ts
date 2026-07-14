import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requestHasApplyUnlock } from "@/lib/apply/auth"
import { answerRecruiterQuestions } from "@/services/interview/answer"

export async function POST(request: NextRequest) {
  try {
    if (!requestHasApplyUnlock(request)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const questions = typeof body?.questions === "string" ? body.questions : ""
    if (!questions.trim()) {
      return NextResponse.json({ error: "Campo questions requerido." }, { status: 400 })
    }

    const result = await answerRecruiterQuestions(questions)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[interview/answer]", error)
    const message = error instanceof Error ? error.message : "Error al responder"
    const isClient =
      message.includes("Pega al menos") ||
      message.includes("contexto") ||
      message.includes("questions")
    const userFacing =
      message.includes("saturado") ||
      message.includes("Timeout") ||
      isClient
        ? message
        : "No se pudieron generar las respuestas."
    return NextResponse.json(
      {
        error: userFacing,
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: isClient ? 400 : 500 },
    )
  }
}
