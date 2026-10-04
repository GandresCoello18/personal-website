import { buildJobApplicationMail } from "@/lib/apply/application-mail"
import { readCvBuffer } from "@/lib/apply/cv-text"
import type { SendApplicationPayload } from "@/lib/apply/types"
import { createMailTransporter, getMailFrom } from "@/services/mail/transporter"

export async function sendJobApplication(payload: SendApplicationPayload) {
  const mail = buildJobApplicationMail(payload)
  const pdfBuffer = readCvBuffer(mail.cvFilename)
  const transporter = createMailTransporter()

  await transporter.sendMail({
    from: getMailFrom(),
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
    attachments: [
      {
        filename: mail.cvFilename,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  })

  return { success: true as const }
}
