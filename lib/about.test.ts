import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { ABOUT_PARAGRAPHS, countWords, getAboutBioText, PLATZI_CERTIFICATIONS } from "./about.ts"
import { PERSON_NAME } from "./identity.ts"

describe("sobre-mi facts", () => {
  it("keeps the bio between 150 and 250 words and names him in full", () => {
    const bio = getAboutBioText()
    const words = countWords(bio)

    assert.ok(words >= 150, `expected at least 150 words, got ${words}`)
    assert.ok(words <= 250, `expected at most 250 words, got ${words}`)
    assert.ok(bio.includes(PERSON_NAME))
    assert.ok(bio.includes("Ambato"))
    assert.ok(bio.includes("DevLokos"))
    assert.ok(bio.includes("Meniuz"))
    assert.ok(bio.includes("Importadora Sacón"))
    assert.ok(bio.includes("Tecnológico Superior Babahoyo"))
    assert.ok(bio.includes("2017"))
    assert.ok(bio.includes("Platzi"))
    assert.ok(bio.includes("Classgap"))
  })

  it("does not invent a product called CG or claim Kubernetes", () => {
    const text = `${ABOUT_PARAGRAPHS.join(" ")}\n${PLATZI_CERTIFICATIONS.map((item) => item.name).join(" ")}`
    assert.equal(/\bKubernetes\b/i.test(text), false)
    assert.equal(/\bCG\b/.test(text), false)
  })

  it("lists the Platzi certifications from the CV", () => {
    assert.equal(PLATZI_CERTIFICATIONS.length, 4)
    assert.ok(PLATZI_CERTIFICATIONS.some((item) => item.name.includes("Patrones de Diseño")))
    assert.ok(PLATZI_CERTIFICATIONS.some((item) => item.name.includes("DevOps")))
  })
})
