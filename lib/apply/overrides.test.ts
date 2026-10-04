import assert from "node:assert/strict"
import { describe, it } from "node:test"
import type { JobExtract } from "./types.ts"
import { applyJobOverrides } from "./overrides.ts"
import { CV_FILES } from "./cv.ts"

function baseExtract(partial: Partial<JobExtract> = {}): JobExtract {
  return {
    company: "Acme",
    position: "Full Stack",
    email: "maria.velez@acme.com",
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

describe("applyJobOverrides", () => {
  it("fills recruiter name from email and picks the software CV", () => {
    const result = applyJobOverrides(baseExtract())
    assert.equal(result.extract.recruiterName, "Maria Velez")
    assert.equal(result.cvFilename, CV_FILES.software)
    assert.equal(result.needsManualCv, false)
    assert.equal(result.emailMissing, false)
  })

  it("asks for a manual CV when category is unknown", () => {
    const result = applyJobOverrides(baseExtract({ category: "unknown", confidence: 0.2, email: null }))
    assert.equal(result.needsManualCv, true)
    assert.equal(result.needsCategoryConfirm, true)
    assert.equal(result.emailMissing, true)
    assert.equal(result.cvFilename, null)
  })

  it("applies a category override and raises confidence", () => {
    const result = applyJobOverrides(baseExtract({ category: "unknown", confidence: 0.4 }), "education")
    assert.equal(result.extract.category, "education")
    assert.ok(result.extract.confidence >= 0.85)
    assert.equal(result.cvFilename, CV_FILES.education)
  })

  it("uses the manual CV for unknown category", () => {
    const result = applyJobOverrides(baseExtract({ category: "unknown" }), undefined, "software")
    assert.equal(result.needsManualCv, false)
    assert.equal(result.cvFilename, CV_FILES.software)
  })
})
