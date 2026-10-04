import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { sanitizeHeaderValue } from "./headers.ts"

describe("sanitizeHeaderValue", () => {
  it("strips CR LF to block header injection", () => {
    assert.equal(
      sanitizeHeaderValue("Hola\r\nBcc: victim@example.com"),
      "Hola Bcc: victim@example.com",
    )
  })

  it("collapses leftover whitespace", () => {
    assert.equal(sanitizeHeaderValue("  hola   mundo  "), "hola mundo")
  })
})
