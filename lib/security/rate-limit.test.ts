import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { createMemoryRateLimiter, retryAfterSeconds } from "./rate-limit.ts"

describe("createMemoryRateLimiter", () => {
  it("allows up to max requests in the window", () => {
    const limiter = createMemoryRateLimiter({ windowMs: 1000, max: 2 })
    const now = 1_000_000
    assert.equal(limiter.check("ip", now).ok, true)
    assert.equal(limiter.check("ip", now + 10).ok, true)
    const denied = limiter.check("ip", now + 20)
    assert.equal(denied.ok, false)
    assert.ok(denied.retryAfterMs > 0)
  })

  it("resets after the window", () => {
    const limiter = createMemoryRateLimiter({ windowMs: 1000, max: 1 })
    const now = 1_000_000
    assert.equal(limiter.check("ip", now).ok, true)
    assert.equal(limiter.check("ip", now + 10).ok, false)
    assert.equal(limiter.check("ip", now + 1000).ok, true)
  })

  it("applies backoff after the limit is hit", () => {
    const limiter = createMemoryRateLimiter({ windowMs: 100, max: 1, backoffMs: 5_000 })
    const now = 1_000_000
    limiter.check("ip", now)
    const denied = limiter.check("ip", now + 10)
    assert.equal(denied.ok, false)
    assert.ok(denied.retryAfterMs >= 4_000)
    assert.equal(limiter.check("ip", now + 200).ok, false)
    assert.equal(limiter.check("ip", now + 5_010).ok, true)
  })

  it("isolates keys", () => {
    const limiter = createMemoryRateLimiter({ windowMs: 1000, max: 1 })
    const now = 1_000_000
    assert.equal(limiter.check("a", now).ok, true)
    assert.equal(limiter.check("b", now).ok, true)
  })
})

describe("retryAfterSeconds", () => {
  it("rounds up to at least one second", () => {
    assert.equal(retryAfterSeconds(1), 1)
    assert.equal(retryAfterSeconds(1001), 2)
  })
})
