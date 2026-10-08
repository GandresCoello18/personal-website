import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import { isValidApplySecret, requireApplySecrets } from "./secrets.ts"

describe("isValidApplySecret", () => {
  afterEach(() => {
    delete process.env.APPLY_ACCESS_SECRET
  })

  it("returns false when the expected secret is missing", () => {
    assert.equal(isValidApplySecret("abc", undefined), false)
  })

  it("accepts the matching secret", () => {
    assert.equal(isValidApplySecret("abc", "abc"), true)
  })

  it("rejects a different secret of the same length", () => {
    assert.equal(isValidApplySecret("abd", "abc"), false)
  })

  it("rejects a different length without throwing", () => {
    assert.equal(isValidApplySecret("ab", "abc"), false)
  })
})

describe("requireApplySecrets", () => {
  afterEach(() => {
    delete process.env.APPLY_ACCESS_SECRET
    delete process.env.APPLY_SESSION_SECRET
  })

  it("fails closed if either secret is empty", () => {
    process.env.APPLY_ACCESS_SECRET = "access"
    process.env.APPLY_SESSION_SECRET = ""
    assert.equal(requireApplySecrets().ok, false)
  })

  it("returns both secrets when present", () => {
    process.env.APPLY_ACCESS_SECRET = "access"
    process.env.APPLY_SESSION_SECRET = "session"
    const result = requireApplySecrets()
    assert.equal(result.ok, true)
    if (result.ok) {
      assert.equal(result.accessSecret, "access")
      assert.equal(result.sessionSecret, "session")
    }
  })
})
