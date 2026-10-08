import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { evaluateContactSubmission } from "./schema.ts"
import { escapeHtml } from "../security/html.ts"

const valid = {
  nombre: "Ana Pérez",
  email: "ana@example.com",
  asunto: "Consulta",
  mensaje: "Quiero información sobre mentoría.",
}

describe("evaluateContactSubmission", () => {
  it("accepts a valid payload", () => {
    const result = evaluateContactSubmission(valid)
    assert.equal(result.kind, "ok")
  })

  it("treats a filled honeypot as a silent success path", () => {
    const result = evaluateContactSubmission({ ...valid, website: "https://spam.test" })
    assert.equal(result.kind, "honeypot")
  })

  it("rejects a missing name", () => {
    const result = evaluateContactSubmission({ ...valid, nombre: "  " })
    assert.equal(result.kind, "invalid")
  })

  it("rejects an invalid email", () => {
    const result = evaluateContactSubmission({ ...valid, email: "not-an-email" })
    assert.equal(result.kind, "invalid")
  })

  it("rejects a short message", () => {
    const result = evaluateContactSubmission({ ...valid, mensaje: "hola" })
    assert.equal(result.kind, "invalid")
  })

  it("strips header injection from the subject", () => {
    const result = evaluateContactSubmission({
      ...valid,
      asunto: "Hola\r\nBcc: other@example.com",
    })
    assert.equal(result.kind, "ok")
    if (result.kind === "ok") {
      assert.equal(result.data.asunto.includes("\n"), false)
      assert.equal(result.data.asunto.includes("\r"), false)
    }
  })
})

describe("contact HTML escaping", () => {
  it("neutralizes a name that tries to inject markup", () => {
    assert.equal(escapeHtml("<b>Ana</b>"), "&lt;b&gt;Ana&lt;/b&gt;")
  })
})
