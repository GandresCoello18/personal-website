import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { CV_FILES } from "./cv.ts"
import { isAllowedCvFilename } from "./cv-guard.ts"
import { buildJobApplicationMail } from "./application-mail.ts"
import { sendApplicationSchema } from "./types.ts"

describe("isAllowedCvFilename", () => {
  it("allows only the two published PDFs", () => {
    assert.equal(isAllowedCvFilename(CV_FILES.software), true)
    assert.equal(isAllowedCvFilename(CV_FILES.education), true)
    assert.equal(isAllowedCvFilename("../etc/passwd"), false)
    assert.equal(isAllowedCvFilename("otro.pdf"), false)
  })
})

describe("sendApplicationSchema", () => {
  const valid = {
    company: "Acme",
    position: "Full Stack",
    email: "talento@acme.com",
    category: "software" as const,
    confidence: 0.9,
    cvFilename: CV_FILES.software,
    subject: "Postulación — Full Stack",
    body: "Hola,\nvi la vacante.",
  }

  it("accepts a valid payload", () => {
    const parsed = sendApplicationSchema.safeParse(valid)
    assert.equal(parsed.success, true)
  })

  it("rejects a subject with CR/LF", () => {
    const parsed = sendApplicationSchema.safeParse({
      ...valid,
      subject: "Hola\r\nBcc: other@example.com",
    })
    assert.equal(parsed.success, false)
  })

  it("rejects an invalid email", () => {
    const parsed = sendApplicationSchema.safeParse({ ...valid, email: "not-an-email" })
    assert.equal(parsed.success, false)
  })

  it("accepts optional url, findingId and confirmDuplicate", () => {
    const parsed = sendApplicationSchema.safeParse({
      ...valid,
      url: "https://www.linkedin.com/jobs/view/4012345678/",
      findingId: "f_01HZY8K3QG",
      confirmDuplicate: true,
    })
    assert.equal(parsed.success, true)
    if (parsed.success) {
      assert.equal(parsed.data.url, "https://www.linkedin.com/jobs/view/4012345678/")
      assert.equal(parsed.data.confirmDuplicate, true)
    }
  })
})

describe("buildJobApplicationMail", () => {
  it("escapes HTML in the body and refuses an unknown CV", () => {
    const mail = buildJobApplicationMail({
      company: "Acme",
      position: "Full Stack",
      email: "talento@acme.com",
      category: "software",
      confidence: 0.9,
      cvFilename: CV_FILES.software,
      subject: "Postulación",
      body: "Hola <script>alert(1)</script>",
    })
    assert.equal(mail.html.includes("<script>"), false)
    assert.equal(mail.html.includes("&lt;script&gt;"), true)
    assert.throws(() =>
      buildJobApplicationMail({
        company: "Acme",
        position: "Full Stack",
        email: "talento@acme.com",
        category: "software",
        confidence: 0.9,
        cvFilename: "malware.pdf",
        subject: "Postulación",
        body: "Hola",
      }),
    )
  })
})
