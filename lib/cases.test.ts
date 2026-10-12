import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { getAllCaseSlugs, getAllCases, getFeaturedCases, readCaseFile } from "./cases.ts"

describe("case studies", () => {
  it("publishes the three confirmed cases with Order Lifecycle off the home featured set", () => {
    assert.deepEqual(getAllCaseSlugs(), ["tayos", "meniuz", "order-lifecycle"])
    assert.deepEqual(
      getFeaturedCases().map((item) => item.slug),
      ["tayos", "meniuz"],
    )
  })

  it("keeps the Meniuz role as Backend & DevOps Lead", () => {
    const meniuz = getAllCases().find((item) => item.slug === "meniuz")
    assert.ok(meniuz)
    assert.equal(meniuz.role, "Backend & DevOps Lead")
    assert.match(meniuz.summary, /500\+/)
  })

  it("does not attach usage metrics to Tayos", () => {
    const tayos = getAllCases().find((item) => item.slug === "tayos")
    assert.ok(tayos)
    assert.doesNotMatch(tayos.summary, /\d[\d.]*\s*(usuarios|users|descargas)/i)
  })

  it("records the confirmed Meniuz and Tayos decisions", () => {
    const meniuz = readCaseFile("meniuz")
    const tayos = readCaseFile("tayos")
    assert.ok(meniuz)
    assert.ok(tayos)
    assert.match(meniuz.body, /GraphQL/)
    assert.match(meniuz.body, /monolito modular/)
    assert.match(meniuz.body, /EC2/)
    assert.doesNotMatch(meniuz.body, /DraftSection/)
    assert.match(tayos.body, /webhooks/)
    assert.match(tayos.body, /BFF/)
  })
})
