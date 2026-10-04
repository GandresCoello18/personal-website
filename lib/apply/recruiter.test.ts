import assert from "node:assert/strict"
import { describe, it } from "node:test"
import type { JobExtract } from "./types.ts"
import { canPersonalizeGreeting, inferNameFromEmail, mergeRecruiterContact } from "./recruiter.ts"

function baseExtract(partial: Partial<JobExtract> = {}): JobExtract {
  return {
    company: "",
    position: "",
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

describe("inferNameFromEmail", () => {
  it("infers first.last with medium confidence", () => {
    const result = inferNameFromEmail("maria.velez@empresa.com")
    assert.equal(result.name, "Maria Velez")
    assert.equal(result.confidence, "medium")
  })

  it("rejects role mailboxes", () => {
    const result = inferNameFromEmail("hr@empresa.com")
    assert.equal(result.name, null)
    assert.equal(result.confidence, "none")
  })

  it("marks single token as low confidence", () => {
    const result = inferNameFromEmail("carlos@empresa.com")
    assert.equal(result.name, "Carlos")
    assert.equal(result.confidence, "low")
  })

  it("handles missing email", () => {
    assert.deepEqual(inferNameFromEmail(null), { name: null, confidence: "none" })
  })
})

describe("canPersonalizeGreeting", () => {
  it("allows high and medium only", () => {
    assert.equal(canPersonalizeGreeting("high"), true)
    assert.equal(canPersonalizeGreeting("medium"), true)
    assert.equal(canPersonalizeGreeting("low"), false)
    assert.equal(canPersonalizeGreeting("none"), false)
  })
})

describe("mergeRecruiterContact", () => {
  it("keeps explicit high-confidence name", () => {
    const merged = mergeRecruiterContact(
      baseExtract({
        email: "maria.velez@empresa.com",
        recruiterName: "María Vélez",
        recruiterConfidence: "high",
      }),
    )
    assert.equal(merged.recruiterName, "María Vélez")
    assert.equal(merged.recruiterConfidence, "high")
  })

  it("fills name from email when JD has none", () => {
    const merged = mergeRecruiterContact(
      baseExtract({
        email: "juan.perez@acme.io",
        recruiterName: "",
        recruiterConfidence: "none",
      }),
    )
    assert.equal(merged.recruiterName, "Juan Perez")
    assert.equal(merged.recruiterConfidence, "medium")
  })

  it("prefers medium email inference over low explicit", () => {
    const merged = mergeRecruiterContact(
      baseExtract({
        email: "ana.lopez@corp.com",
        recruiterName: "Someone",
        recruiterConfidence: "low",
      }),
    )
    assert.equal(merged.recruiterName, "Ana Lopez")
    assert.equal(merged.recruiterConfidence, "medium")
  })
})
