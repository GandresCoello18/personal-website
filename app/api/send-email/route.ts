import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { evaluateContactSubmission } from "@/lib/contact/schema"
import { tooManyRequests } from "@/lib/http/rate-limit-response"
import { getClientIp } from "@/lib/security/client-ip"
import { contactHourLimiter, contactShortLimiter } from "@/lib/security/limiters"
import { sanitizeHeaderValue } from "@/lib/security/headers"
import { createMailTransporter, getMailFrom } from "@/services/mail/transporter"
import { getAdminNotificationTemplate } from "./templates/admin-notification"
import { getUserConfirmationTemplate } from "./templates/user-confirmation"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const evaluation = evaluateContactSubmission(body)

    if (evaluation.kind === "honeypot") {
      return NextResponse.json({ success: true, message: "Email enviado exitosamente" })
    }

    if (evaluation.kind === "invalid") {
      return NextResponse.json({ error: evaluation.error }, { status: 400 })
    }

    const ip = getClientIp(request)
    const shortLimit = contactShortLimiter.check(ip)
    if (!shortLimit.ok) {
      return tooManyRequests(shortLimit)
    }
    const hourLimit = contactHourLimiter.check(ip)
    if (!hourLimit.ok) {
      return tooManyRequests(hourLimit)
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.GMAIL_RECIPIENT) {
      console.error("[send-email] Configuración de correo incompleta")
      return NextResponse.json(
        { error: "Configuración de email no disponible. Contacta al administrador." },
        { status: 500 },
      )
    }

    const { nombre, email, asunto, mensaje } = evaluation.data
    const transporter = createMailTransporter()
    const from = getMailFrom()

    await transporter.sendMail({
      from,
      to: email,
      subject: sanitizeHeaderValue(`Confirmación: ${asunto}`),
      html: getUserConfirmationTemplate(nombre, asunto, mensaje),
    })

    await transporter.sendMail({
      from,
      to: process.env.GMAIL_RECIPIENT,
      subject: sanitizeHeaderValue(`Nuevo Contacto: ${asunto}`),
      html: getAdminNotificationTemplate(nombre, email, asunto, mensaje),
    })

    return NextResponse.json({ success: true, message: "Email enviado exitosamente" })
  } catch {
    return NextResponse.json(
      { error: "Error al enviar el email. Por favor intenta de nuevo." },
      { status: 500 },
    )
  }
}
