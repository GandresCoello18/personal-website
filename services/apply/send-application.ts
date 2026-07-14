import { CV_FILES } from "@/lib/apply/cv"
import { applyProfile } from "@/lib/apply/profile"
import { readCvBuffer } from "@/lib/apply/pdf-text"
import type { SendApplicationPayload } from "@/lib/apply/types"
import { getApplicationEmailTemplate } from "@/app/api/apply/templates/application-email"
import { createMailTransporter, getMailFrom } from "@/services/mail/transporter"

function assertAllowedCv(filename: string) {
  const allowed = Object.values(CV_FILES)
  if (!allowed.includes(filename as (typeof allowed)[number])) {
    throw new Error("CV no permitido")
  }
}

export async function sendJobApplication(payload: SendApplicationPayload) {
  assertAllowedCv(payload.cvFilename)

  const pdfBuffer = readCvBuffer(payload.cvFilename)
  const html = getApplicationEmailTemplate({
    body: payload.body,
    name: applyProfile.name,
    phone: applyProfile.phone,
    linkedin: applyProfile.linkedin,
    github: applyProfile.github,
    portfolio: applyProfile.portfolio,
    title: applyProfile.title,
  })

  const transporter = createMailTransporter()

  await transporter.sendMail({
    from: getMailFrom(),
    to: payload.email,
    subject: payload.subject,
    html,
    attachments: [
      {
        filename: payload.cvFilename,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  })

  return { success: true as const }
}
