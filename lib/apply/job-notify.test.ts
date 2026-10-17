import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { buildJobFailedTelegram, buildJobReadyTelegram } from "./job-notify.ts"
import type { ApplyJobRecord } from "./job-types.ts"

const base: ApplyJobRecord = {
  id: "job_abc",
  kind: "draft",
  status: "ready",
  createdAt: "2026-10-17T12:00:00.000Z",
  updatedAt: "2026-10-17T12:10:00.000Z",
  queuedAt: "2026-10-17T12:00:00.000Z",
  queueAttempts: 1,
  input: {
    extract: {
      company: "Acme",
      position: "Backend",
      email: null,
      recruiterName: "Juan",
      recruiterTitle: "",
      recruiterConfidence: "high",
      category: "software",
      confidence: 0.9,
      requirements: [],
      location: "",
      remote: true,
      summary: "",
      language: "es",
    },
  },
  label: { company: "Acme", position: "Backend" },
}

describe("job telegram copy", () => {
  it("includes a review link for a ready draft", () => {
    const text = buildJobReadyTelegram(base)
    assert.match(text, /Borrador listo/)
    assert.match(text, /\/apply\?job=job_abc/)
    assert.match(text, /manual/)
  })

  it("explains the DLQ after 4 attempts", () => {
    const text = buildJobFailedTelegram({
      ...base,
      status: "failed",
      lastError: "Gemini está saturado",
    })
    assert.match(text, /4 intentos/)
    assert.match(text, /Gemini está saturado/)
  })
})
