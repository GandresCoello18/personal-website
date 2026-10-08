import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { canonicalizeUrlInput, urlKeyFromUrl } from "./normalize.ts"

describe("urlKeyFromUrl", () => {
  it("extracts LinkedIn job id from /jobs/view/<id>/?trk=", () => {
    assert.equal(
      urlKeyFromUrl("https://www.linkedin.com/jobs/view/4012345678/?trk=public_jobs"),
      "li:job:4012345678",
    )
  })

  it("extracts LinkedIn job id from currentJobId", () => {
    assert.equal(
      urlKeyFromUrl(
        "https://www.linkedin.com/jobs/search/?currentJobId=4012345678&keywords=full%20stack",
      ),
      "li:job:4012345678",
    )
  })

  it("extracts activity URN as a post", () => {
    assert.equal(
      urlKeyFromUrl("https://www.linkedin.com/feed/update/urn:li:activity:7123456789012345678/"),
      "li:post:7123456789012345678",
    )
  })

  it("extracts activity id from a posts slug", () => {
    assert.equal(
      urlKeyFromUrl(
        "https://www.linkedin.com/posts/ana-perez_hiring-fullstack-activity-7123456789-AbCd",
      ),
      "li:post:7123456789",
    )
  })

  it("normalizes external URLs to host + path", () => {
    assert.equal(
      urlKeyFromUrl("https://boards.greenhouse.io/acme/jobs/12345/?utm_source=li#apply"),
      "boards.greenhouse.io/acme/jobs/12345",
    )
  })

  it("adds https and strips www for host+path URLs", () => {
    assert.equal(urlKeyFromUrl("www.example.com/jobs/foo/"), "example.com/jobs/foo")
  })

  it("returns null for empty or invalid input", () => {
    assert.equal(urlKeyFromUrl(""), null)
    assert.equal(urlKeyFromUrl("   "), null)
    assert.equal(urlKeyFromUrl("not a url"), null)
    assert.equal(canonicalizeUrlInput("ftp://example.com/x"), null)
  })
})
