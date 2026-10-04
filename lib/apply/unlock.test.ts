import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import { createMemoryRateLimiter } from "../security/rate-limit.ts"
import { verifyApplySession } from "./session.ts"
import { attemptUnlock } from "./unlock.ts"

const ACCESS = "super-secret-access"
const SESSION = "super-secret-session"

describe("attemptUnlock", () => {
  afterEach(() => {
    delete process.env.APPLY_ACCESS_SECRET
    delete process.env.APPLY_SESSION_SECRET
  })

  it("fails closed when secrets are missing", () => {
    const limiter = createMemoryRateLimiter({ windowMs: 60_000, max: 5 })
    const result = attemptUnlock("anything", limiter, "1.1.1.1")
    assert.equal(result.ok, false)
    if (!result.ok) assert.equal(result.status, 500)
  })

  it("rejects the wrong secret", () => {
    process.env.APPLY_ACCESS_SECRET = ACCESS
    process.env.APPLY_SESSION_SECRET = SESSION
    const limiter = createMemoryRateLimiter({ windowMs: 60_000, max: 5 })
    const result = attemptUnlock("nope", limiter, "1.1.1.1")
    assert.equal(result.ok, false)
    if (!result.ok) assert.equal(result.status, 401)
  })

  it("issues a signed session token for the correct secret", () => {
    process.env.APPLY_ACCESS_SECRET = ACCESS
    process.env.APPLY_SESSION_SECRET = SESSION
    const limiter = createMemoryRateLimiter({ windowMs: 60_000, max: 5 })
    const now = 1_700_000_000_000
    const result = attemptUnlock(ACCESS, limiter, "1.1.1.1", now)
    assert.equal(result.ok, true)
    if (result.ok) {
      assert.equal(verifyApplySession(result.token, SESSION, now + 1_000), true)
      assert.notEqual(result.token, "1")
    }
  })

  it("rate limits repeated failures from the same IP", () => {
    process.env.APPLY_ACCESS_SECRET = ACCESS
    process.env.APPLY_SESSION_SECRET = SESSION
    const limiter = createMemoryRateLimiter({ windowMs: 60_000, max: 3, backoffMs: 60_000 })
    const now = 1_700_000_000_000
    assert.equal(attemptUnlock("bad", limiter, "9.9.9.9", now).ok, false)
    assert.equal(attemptUnlock("bad", limiter, "9.9.9.9", now + 1).ok, false)
    assert.equal(attemptUnlock("bad", limiter, "9.9.9.9", now + 2).ok, false)
    const blocked = attemptUnlock("bad", limiter, "9.9.9.9", now + 3)
    assert.equal(blocked.ok, false)
    if (!blocked.ok) {
      assert.equal(blocked.status, 429)
      assert.ok((blocked.retryAfterMs ?? 0) > 0)
    }
  })
})
