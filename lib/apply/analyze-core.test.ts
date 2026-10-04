import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { runAnalyzeJobPosting } from "./analyze-core.ts"
import { runDraftFromExtract } from "./draft-core.ts"
import { CV_FILES } from "./cv.ts"
import type { JobExtract, JobMatch } from "./types.ts"

function extract(partial: Partial<JobExtract> = {}): JobExtract {
  return {
    company: "Acme",
    position: "Full Stack Developer",
    email: "talento@acme.com",
    recruiterName: "",
    recruiterTitle: "",
    recruiterConfidence: "none",
    category: "software",
    confidence: 0.92,
    requirements: ["TypeScript"],
    location: "Remoto",
    remote: true,
    summary: "Buscamos full stack",
    language: "es",
    ...partial,
  }
}

const match: JobMatch = {
  score: 80,
  summary: "Buen encaje",
  strengths: ["TypeScript"],
  gaps: [],
  niceToHave: [],
  recommendation: "good",
}

describe("runAnalyzeJobPosting", () => {
  it("uses mocked extract + match and never touches the network", async () => {
    let extractCalls = 0
    let matchCalls = 0
    const result = await runAnalyzeJobPosting(
      { mode: "text", text: "Vacante de Full Stack Developer en Acme con TypeScript." },
      {
        extractFromText: async () => {
          extractCalls += 1
          return extract()
        },
        extractFromImage: async () => {
          throw new Error("image extractor should not run")
        },
        match: async () => {
          matchCalls += 1
          return match
        },
      },
    )

    assert.equal(extractCalls, 1)
    assert.equal(matchCalls, 1)
    assert.equal(result.extract.company, "Acme")
    assert.equal(result.match?.score, 80)
    assert.equal(result.cvFilename, CV_FILES.software)
    assert.equal(result.draft, null)
  })

  it("asks for a manual CV when Gemini returns unknown", async () => {
    const result = await runAnalyzeJobPosting(
      { mode: "text", text: "Something vague." },
      {
        extractFromText: async () => extract({ category: "unknown", confidence: 0.2, email: null }),
        extractFromImage: async () => {
          throw new Error("image extractor should not run")
        },
        match: async () => null,
      },
    )
    assert.equal(result.needsManualCv, true)
    assert.ok(result.error)
  })
})

describe("runDraftFromExtract", () => {
  it("builds a draft with mocked Gemini and local CV text", async () => {
    const result = await runDraftFromExtract(
      { extract: extract() },
      {
        writeEmail: async () => ({ subject: "Postulación", body: "Hola equipo" }),
        readCvText: () => "CV de Andres",
        readProjects: () => "Proyectos",
      },
    )
    assert.equal(result.draft?.subject, "Postulación")
    assert.equal(result.cvFilename, CV_FILES.software)
    assert.equal(result.error, undefined)
  })

  it("does not call Gemini when the CV is missing", async () => {
    let called = 0
    const result = await runDraftFromExtract(
      { extract: extract({ category: "unknown" }) },
      {
        writeEmail: async () => {
          called += 1
          return { subject: "x", body: "y" }
        },
        readCvText: () => {
          throw new Error("should not read CV")
        },
        readProjects: () => "",
      },
    )
    assert.equal(called, 0)
    assert.equal(result.draft, null)
    assert.equal(result.needsManualCv, true)
  })
})
