function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function formatBody(body: string): string {
  return escapeHtml(body).replace(/\n/g, "<br />")
}

type ApplicationEmailParams = {
  body: string
  name: string
  phone: string
  linkedin: string
  github: string
  portfolio: string
  title?: string
}

export function getApplicationEmailTemplate({
  body,
  name,
  phone,
  linkedin,
  github,
  portfolio,
  title = "Software Developer & Mentor",
}: ApplicationEmailParams) {
  const formattedBody = formatBody(body)
  const phoneLine = phone
    ? `<br/><a href="tel:${escapeHtml(phone)}" style="color: #1c4e5a; text-decoration: none;">${escapeHtml(phone)}</a>`
    : ""

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Postulación</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #1c4e5a 0%, #2d7a8a 100%); padding: 28px 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600;">${escapeHtml(name)}</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 13px;">${escapeHtml(title)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 30px;">
              <div style="color: #333333; font-size: 15px; line-height: 1.7;">
                ${formattedBody}
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />
              <p style="margin: 0; color: #333333; font-size: 15px; line-height: 1.7;">
                Saludos,<br/>
                <strong style="color: #1c4e5a;">${escapeHtml(name)}</strong>
                ${phoneLine}
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top: 18px;">
                <tr>
                  <td style="padding: 0 10px 0 0;">
                    <a href="${escapeHtml(linkedin)}" style="color: #1c4e5a; text-decoration: none; font-size: 14px;">LinkedIn</a>
                  </td>
                  <td style="padding: 0 10px; color: #ccc;">|</td>
                  <td style="padding: 0 10px;">
                    <a href="${escapeHtml(github)}" style="color: #1c4e5a; text-decoration: none; font-size: 14px;">GitHub</a>
                  </td>
                  <td style="padding: 0 10px; color: #ccc;">|</td>
                  <td style="padding: 0 10px;">
                    <a href="${escapeHtml(portfolio)}" style="color: #1c4e5a; text-decoration: none; font-size: 14px;">Portfolio</a>
                  </td>
                </tr>
              </table>
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
