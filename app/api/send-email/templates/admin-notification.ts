import { escapeHtml, escapeHtmlWithBreaks } from "../../../../lib/security/html.ts"

export function getAdminNotificationTemplate(
  nombre: string,
  email: string,
  asunto: string,
  mensaje: string,
) {
  const safeName = escapeHtml(nombre)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(asunto)
  const formattedMessage = escapeHtmlWithBreaks(mensaje)
  const replyHref = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${asunto}`)}`

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Mensaje de Contacto</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="width: 60px; height: 60px; background-color: rgba(255,255,255,0.2); border-radius: 50%; display: inline-block; margin-bottom: 15px; display: flex; align-items: center; justify-content: center;">
                      <span style="color: #ffffff; font-size: 28px;">🔔</span>
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Nuevo Mensaje de Contacto</h1>
                    <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 13px;">Notificación del Portafolio</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="padding: 20px 30px; background-color: #fef2f2; border-bottom: 1px solid #fee2e2;">
              <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 500;">
                ⚠️ Tienes un nuevo mensaje que requiere tu atención
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 25px 0; color: #1f2937; font-size: 22px; font-weight: 600;">Información del Contacto</h2>
              
              <!-- Contact Info Cards -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 25px;">
                <tr>
                  <td style="padding: 15px; background-color: #f8f9fa; border-radius: 6px; margin-bottom: 10px;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Nombre</p>
                    <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 500;">${safeName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;"></td>
                </tr>
                <tr>
                  <td style="padding: 15px; background-color: #f8f9fa; border-radius: 6px; margin-bottom: 10px;">
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                    <p style="margin: 0; color: #1f2937; font-size: 16px;">
                      <a href="${replyHref}" style="color: #2563eb; text-decoration: none;">${safeEmail}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Subject -->
              <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; color: #1e40af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Asunto</p>
                <p style="margin: 0; color: #1e3a8a; font-size: 16px; font-weight: 500;">${safeSubject}</p>
              </div>

              <!-- Message -->
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; margin: 25px 0; border-radius: 6px;">
                <p style="margin: 0 0 12px 0; color: #374151; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Mensaje</p>
                <div style="color: #1f2937; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${formattedMessage}</div>
              </div>

              <!-- Quick Actions -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="background-color: #2563eb; border-radius: 6px; padding: 12px 24px;">
                          <a href="${replyHref}" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-block;">
                            📧 Responder por Email
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #6b7280; font-size: 12px; line-height: 1.5;">
                Este mensaje fue generado automáticamente desde tu portafolio web.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
