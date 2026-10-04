import { getApplicationEmailTemplate } from "../../app/api/apply/templates/application-email.ts"
import { sanitizeHeaderValue } from "../security/headers.ts"
import { assertAllowedCv } from "./cv-guard.ts"
import { applyProfile } from "./profile.ts"
import type { SendApplicationPayload } from "./types.ts"

export function buildJobApplicationMail(payload: SendApplicationPayload) {
  assertAllowedCv(payload.cvFilename)

  return {
    to: payload.email,
    subject: sanitizeHeaderValue(payload.subject),
    html: getApplicationEmailTemplate({
      body: payload.body,
      name: applyProfile.name,
      phone: applyProfile.phone,
      linkedin: applyProfile.linkedin,
      github: applyProfile.github,
      portfolio: applyProfile.portfolio,
      title: applyProfile.title,
    }),
    cvFilename: payload.cvFilename,
  }
}
