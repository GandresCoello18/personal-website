import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { lockKeyFor, norm, vacancyIdentity } from "./fingerprint.ts"

describe("norm", () => {
  it("strips legal suffixes", () => {
    assert.equal(norm("Repuestos Andinos S.A."), "andinos repuestos")
    assert.equal(norm("Acme Cloud S.A.S."), "acme cloud")
    assert.equal(norm("Beta Labs Inc"), "beta labs")
    assert.equal(norm("Gamma LLC"), "gamma")
    assert.equal(norm("Delta Ltd"), "delta")
    assert.equal(norm("Epsilon GmbH"), "epsilon")
    assert.equal(norm("Zeta Cia. Ltda."), "zeta")
  })

  it("strips tildes via NFD", () => {
    assert.equal(norm("Tecnológico"), norm("Tecnologico"))
    assert.equal(norm("José María"), "jose maria")
  })

  it("collapses fullstack synonyms", () => {
    assert.equal(norm("Full-Stack Developer"), norm("Developer fullstack"))
    assert.equal(norm("full_stack"), "full stack")
  })

  it("expands sr/dev synonyms", () => {
    assert.equal(norm("Sr Dev"), "developer senior")
    assert.equal(norm("Senior Developer"), "developer senior")
  })

  it("sorts tokens so order does not matter", () => {
    assert.equal(norm("Cloud Acme"), norm("Acme Cloud"))
    assert.equal(norm("Developer Full Stack"), norm("Full Stack Developer"))
  })
})

describe("vacancyIdentity", () => {
  it("produces a 16-hex fingerprint", () => {
    const id = vacancyIdentity("Acme Cloud", "Full Stack Developer")
    assert.equal(id.identityWeak, false)
    assert.match(id.fp, /^[0-9a-f]{16}$/)
    assert.equal(id.fp, vacancyIdentity("ACME CLOUD S.A.", "full-stack developer").fp)
  })

  it("marks identityWeak when company or position is empty", () => {
    assert.equal(vacancyIdentity("", "Developer").identityWeak, true)
    assert.equal(vacancyIdentity("Acme", "").identityWeak, true)
    assert.equal(vacancyIdentity("   ", "  ").identityWeak, true)
  })

  it("locks by fp when identity is strong, else url or email", () => {
    const strong = vacancyIdentity("Acme", "Dev")
    assert.equal(lockKeyFor({ ...strong, urlKey: "li:job:1", email: "a@b.com" }), `fp:${strong.fp}`)
    assert.equal(
      lockKeyFor({ identityWeak: true, fp: "x", urlKey: "li:job:1", email: "a@b.com" }),
      "url:li:job:1",
    )
    assert.equal(
      lockKeyFor({ identityWeak: true, fp: "x", urlKey: null, email: "a@b.com" }),
      "email:a@b.com",
    )
    assert.equal(lockKeyFor({ identityWeak: true, fp: "x", urlKey: null, email: null }), null)
  })
})
