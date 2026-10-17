import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  PERSON_ALTERNATE_NAMES,
  PERSON_ALUMNI_OF,
  PERSON_FAMILY_NAME,
  PERSON_GIVEN_NAME,
  PERSON_JOB_TITLE,
  PERSON_LOCALITY,
  PERSON_NAME,
  PERSON_SAME_AS,
  PERSON_WORKS_FOR,
} from "./identity.ts"
import {
  getPersonAuthorJsonLd,
  getPersonJsonLd,
  getProfilePageJsonLd,
  getWebSiteJsonLd,
} from "./json-ld.ts"

describe("Person JSON-LD", () => {
  it("identifies Andrés Coello Goyes with confirmed profile fields", () => {
    const person = getPersonJsonLd()

    assert.equal(person.name, PERSON_NAME)
    assert.deepEqual(person.alternateName, [...PERSON_ALTERNATE_NAMES])
    assert.equal(person.givenName, PERSON_GIVEN_NAME)
    assert.equal(person.familyName, PERSON_FAMILY_NAME)
    assert.equal(person.jobTitle, PERSON_JOB_TITLE)
    assert.equal(person.worksFor.name, PERSON_WORKS_FOR)
    assert.equal(person.address.addressLocality, PERSON_LOCALITY)
    assert.equal(person.address.addressCountry, "EC")
    assert.equal(person.alumniOf.name, PERSON_ALUMNI_OF)
    assert.equal(person.knowsLanguage, "es")
    assert.deepEqual(
      person.sameAs,
      PERSON_SAME_AS.map((profile) => profile.href),
    )
    assert.ok(person.sameAs.includes("https://x.com/acoellogoyes"))
    assert.ok(person.sameAs.includes("https://www.classgap.com/me/andres-coello-web-tech"))
  })

  it("reuses the person @id as author and website publisher", () => {
    const person = getPersonJsonLd()
    const author = getPersonAuthorJsonLd()
    const website = getWebSiteJsonLd()

    assert.equal(author["@id"], person["@id"])
    assert.equal(author.name, PERSON_NAME)
    assert.equal(website.name, PERSON_NAME)
    assert.equal(website.publisher["@id"], person["@id"])
  })
})

describe("ProfilePage JSON-LD", () => {
  it("points /sobre-mi at the same Person node", () => {
    const person = getPersonJsonLd()
    const page = getProfilePageJsonLd()
    const graph = page["@graph"]
    const profile = graph.find((node) => node["@type"] === "ProfilePage")
    const personNode = graph.find((node) => node["@type"] === "Person")

    assert.ok(profile)
    assert.ok(personNode)
    assert.equal(profile.url, "https://andrescoellog.com/sobre-mi")
    assert.equal(profile.mainEntity["@id"], person["@id"])
    assert.equal(personNode.name, PERSON_NAME)
  })
})
