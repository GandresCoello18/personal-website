import { absoluteUrl } from "@/lib/site"

export function getUserConfirmationTemplate(nombre: string, asunto: string, mensaje: string) {
  const formattedMessage = mensaje.replace(/\n/g, "<br />")
  const profileImageUrl = absoluteUrl("/me.jpg")
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Mensaje</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1c4e5a 0%, #2d7a8a 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center">
                    <img 
                      src="${profileImageUrl}" 
                      alt="Andres Coello" 
                      style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(255,255,255,0.3); margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;"
                    />
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Andres Coello</h1>
                    <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Software Developer & Mentor</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1c4e5a; font-size: 24px; font-weight: 600;">¡Hola ${nombre}!</h2>
              
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Gracias por contactarme. He recibido tu mensaje y te responderé lo antes posible.
              </p>

              <div style="background-color: #f8f9fa; border-left: 4px solid #1c4e5a; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 12px 0; color: #666666; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Asunto:</p>
                <p style="margin: 0; color: #1c4e5a; font-size: 16px; font-weight: 500;">${asunto}</p>
              </div>

              <div style="background-color: #f8f9fa; border-left: 4px solid #1c4e5a; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <p style="margin: 0 0 12px 0; color: #666666; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Tu Mensaje:</p>
                <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.6;">${formattedMessage}</p>
              </div>

              <div style="background-color: #e8f4f8; padding: 20px; margin: 30px 0; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #1c4e5a; font-size: 14px; line-height: 1.6;">
                  <strong>⏱️ Tiempo de respuesta:</strong><br />
                  Te responderé en máximo <strong>24 horas</strong>
                </p>
              </div>

              <p style="margin: 30px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                Si tienes alguna pregunta urgente, no dudes en contactarme nuevamente.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; color: #1c4e5a; font-size: 16px; font-weight: 600;">Andres Coello</p>
              <p style="margin: 0 0 20px 0; color: #666666; font-size: 14px;">Software Developer & Mentor</p>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px auto;">
                <tr>
                  <td style="padding: 0 10px;">
                    <a href="https://github.com/GandresCoello18" style="color: #1c4e5a; text-decoration: none; font-size: 14px;">GitHub</a>
                  </td>
                  <td style="padding: 0 10px; color: #ccc;">|</td>
                  <td style="padding: 0 10px;">
                    <a href="https://www.linkedin.com/in/andrescoellogoyes/" style="color: #1c4e5a; text-decoration: none; font-size: 14px;">LinkedIn</a>
                  </td>
                  <td style="padding: 0 10px; color: #ccc;">|</td>
                  <td style="padding: 0 10px;">
                    <a href="https://x.com/acoellogoyes" style="color: #1c4e5a; text-decoration: none; font-size: 14px;">Twitter</a>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; color: #999999; font-size: 12px; line-height: 1.5;">
                Este es un mensaje automático de confirmación.<br />
                Por favor, no respondas a este email.
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

