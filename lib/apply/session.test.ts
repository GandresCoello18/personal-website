import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { signApplySession, verifyApplySession } from "./session.ts"

const SECRET = "test-session-secret-value"
const OTHER = "another-session-secret-value"

describe("apply session token", () => {
  it("accepts a freshly signed token", () => {
    const now = 1_700_000_000_000
    const token = signApplySession(SECRET, now, "noncevalue")
    assert.equal(verifyApplySession(token, SECRET, now + 1_000), true)
  })

  it("rejects a forged apply_unlock=1 cookie", () => {
    assert.equal(verifyApplySession("1", SECRET), false)
  })

  it("rejects a missing token or secret", () => {
    assert.equal(verifyApplySession(undefined, SECRET), false)
    assert.equal(verifyApplySession("x.y.z", undefined), false)
  })

  it("rejects an expired token", () => {
    const now = 1_700_000_000_000
    const token = signApplySession(SECRET, now, "noncevalue")
    const twelveHours = 12 * 60 * 60 * 1000
    assert.equal(verifyApplySession(token, SECRET, now + twelveHours + 1), false)
  })

  it("rejects a tampered payload", () => {
    const now = 1_700_000_000_000
    const token = signApplySession(SECRET, now, "noncevalue")
    const [exp, , sig] = token.split(".")
    const tampered = `${exp}.tamperednonce.${sig}`
    assert.equal(verifyApplySession(tampered, SECRET, now + 1_000), false)
  })

  it("rejects a signature from another secret", () => {
    const now = 1_700_000_000_000
    const token = signApplySession(SECRET, now, "noncevalue")
    assert.equal(verifyApplySession(token, OTHER, now + 1_000), false)
  })

  it("rejects malformed tokens", () => {
    assert.equal(verifyApplySession("only-one-part", SECRET), false)
    assert.equal(verifyApplySession("a.b", SECRET), false)
    assert.equal(verifyApplySession("notanumber.abc.def", SECRET), false)
  })
})
