import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getAdminNotificationTemplate } from "./templates/admin-notification"
import { getUserConfirmationTemplate } from "./templates/user-confirmation"
import { createMailTransporter, getMailFrom } from "@/services/mail/transporter"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, asunto, mensaje } = body

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.GMAIL_RECIPIENT) {
      console.error("[v0] Variables de entorno faltantes para Gmail")
      console.error("GMAIL_USER:", process.env.GMAIL_USER ? "✓ Configurado" : "✗ Faltante")
      console.error("GMAIL_APP_PASSWORD:", process.env.GMAIL_APP_PASSWORD ? "✓ Configurado" : "✗ Faltante")
      console.error("GMAIL_RECIPIENT:", process.env.GMAIL_RECIPIENT ? "✓ Configurado" : "✗ Faltante")
      return NextResponse.json(
        { error: "Configuración de email no disponible. Contacta al administrador." },
        { status: 500 },
      )
    }

    const transporter = createMailTransporter()
    const from = getMailFrom()

    const mailOptionsUser = {
      from,
      to: email,
      subject: `Confirmación: ${asunto}`,
      html: getUserConfirmationTemplate(nombre, asunto, mensaje),
    }

    const mailOptionsAdmin = {
      from,
      to: process.env.GMAIL_RECIPIENT,
      subject: `Nuevo Contacto: ${asunto}`,
      html: getAdminNotificationTemplate(nombre, email, asunto, mensaje),
    }

    await transporter.sendMail(mailOptionsUser)
    await transporter.sendMail(mailOptionsAdmin)

    return NextResponse.json({ success: true, message: "Email enviado exitosamente" })
  } catch (error) {
    console.error("[v0] Error al enviar email:", error)

    const errorMessage = error instanceof Error ? error.message : "Error desconocido"
    console.error("Detalles del error:", errorMessage)

    return NextResponse.json(
      {
        error: "Error al enviar el email. Por favor intenta de nuevo.",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 },
    )
  }
}
