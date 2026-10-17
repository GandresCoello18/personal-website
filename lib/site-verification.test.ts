import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { buildSiteVerification } from "./site-verification.ts"

describe("buildSiteVerification", () => {
  it("omits tags when tokens are empty", () => {
    assert.equal(buildSiteVerification({}), undefined)
    assert.equal(buildSiteVerification({ google: "   ", bing: "" }), undefined)
  })

  it("emits only the providers that have a real token", () => {
    assert.deepEqual(buildSiteVerification({ google: "google-token" }), {
      google: "google-token",
    })
    assert.deepEqual(buildSiteVerification({ bing: "bing-token" }), {
      other: { "msvalidate.01": "bing-token" },
    })
    assert.deepEqual(buildSiteVerification({ google: " g ", bing: " b " }), {
      google: "g",
      other: { "msvalidate.01": "b" },
    })
  })
})
