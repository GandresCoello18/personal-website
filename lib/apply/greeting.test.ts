import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { buildEmailGreeting, greetingFirstName } from "./greeting.ts"
import { WRITE_EMAIL_SYSTEM_PROMPT, buildWriteEmailUserPrompt } from "../ai/prompts/write-email.ts"
import type { JobExtract } from "./types.ts"

function extract(partial: Partial<JobExtract> = {}): JobExtract {
  return {
    company: "Acme",
    position: "Backend",
    email: null,
    recruiterName: "",
    recruiterTitle: "",
    recruiterConfidence: "none",
    category: "software",
    confidence: 0.9,
    requirements: [],
    location: "",
    remote: null,
    summary: "",
    language: "es",
    ...partial,
  }
}

describe("buildEmailGreeting", () => {
  it("addresses the recruiter by first name", () => {
    assert.equal(greetingFirstName("María Vélez"), "María")
    assert.equal(
      buildEmailGreeting({
        recruiterName: "Juan Pérez",
        company: "Acme",
        language: "es",
        recruiterConfidence: "high",
      }),
      "Hola Juan,",
    )
    assert.equal(
      buildEmailGreeting({
        recruiterName: "María López",
        company: "Acme",
        language: "en",
        recruiterConfidence: "medium",
      }),
      "Hello María,",
    )
  })

  it("falls back to the company team and never uses a bare Hola,", () => {
    assert.equal(
      buildEmailGreeting({
        recruiterName: "",
        company: "Nubank",
        language: "es",
        recruiterConfidence: "none",
      }),
      "Hola equipo de Nubank,",
    )
    assert.equal(
      buildEmailGreeting({
        recruiterName: "",
        company: "Stripe",
        language: "en",
        recruiterConfidence: "none",
      }),
      "Hello Stripe team,",
    )
    assert.equal(
      buildEmailGreeting({ recruiterName: "", company: "", language: "es" }),
      "Hola equipo,",
    )
    assert.notEqual(buildEmailGreeting({ recruiterName: "", company: "Acme" }), "Hola,")
    assert.notEqual(buildEmailGreeting({ recruiterName: "", company: "" }), "Hola,")
    assert.equal(
      buildEmailGreeting({
        recruiterName: "Juan",
        company: "Nubank",
        language: "es",
        recruiterConfidence: "low",
      }),
      "Hola equipo de Nubank,",
    )
  })

  it("puts greetingLine in the draft prompt and forbids a bare Hola,", () => {
    const prompt = buildWriteEmailUserPrompt(
      extract({ recruiterName: "Juan Pérez", recruiterConfidence: "high" }),
      "CV",
    )
    assert.match(prompt, /"greetingLine": "Hola Juan,"/)
    assert.match(WRITE_EMAIL_SYSTEM_PROMPT, /NUNCA un saludo pelado/)
    assert.match(WRITE_EMAIL_SYSTEM_PROMPT, /Hola equipo de \{Empresa\}/)
    assert.doesNotMatch(WRITE_EMAIL_SYSTEM_PROMPT, /saludo genérico breve \(\“Hola,\”/)
  })
})
