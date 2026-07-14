import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  APPLY_COOKIE_MAX_AGE,
  APPLY_COOKIE_NAME,
  getApplySecret,
  isValidApplySecret,
} from "@/lib/apply/auth"

export async function POST(request: NextRequest) {
  try {
    if (!getApplySecret()) {
      return NextResponse.json(
        { error: "APPLY_ACCESS_SECRET no está configurada en el servidor" },
        { status: 500 },
      )
    }

    const body = await request.json()
    const secret = typeof body?.secret === "string" ? body.secret : ""

    if (!isValidApplySecret(secret)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set(APPLY_COOKIE_NAME, "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: APPLY_COOKIE_MAX_AGE,
    })
    return response
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 })
  }
}
