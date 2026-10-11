import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { getAllCaseSlugs, getAllCases, getFeaturedCases } from "./cases.ts"

describe("case studies", () => {
  it("publishes the three confirmed cases in order", () => {
    assert.deepEqual(getAllCaseSlugs(), ["meniuz", "tayos", "order-lifecycle"])
    assert.equal(getFeaturedCases().length, 3)
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
})
