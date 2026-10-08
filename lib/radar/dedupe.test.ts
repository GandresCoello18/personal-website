import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { checkApply, registerExternalApply, sendWithDedupe } from "./dedupe.ts"
import { vacancyIdentity } from "./fingerprint.ts"
import { MemoryRadarStore } from "./store.ts"
import type { ApplyRecord } from "./types.ts"

const NOW = new Date("2026-10-05T15:42:30.000Z")

function payload(overrides: Record<string, string | boolean | undefined> = {}) {
  return {
    company: "Acme Cloud",
    position: "Full Stack Developer",
    email: "talento@acme.example",
    url: "https://www.linkedin.com/jobs/view/4012345678/",
    subject: "Postulación — Full Stack Developer — Andres Coello",
    cvFilename: "Andres_Coello_Goyes_full_stack_developer_2026.pdf",
    ...overrides,
  }
}

function record(overrides: Partial<ApplyRecord> = {}): ApplyRecord {
  const identity = vacancyIdentity("Acme Cloud", "Full Stack Developer")
  return {
    fp: identity.fp,
    urlKey: "li:job:4012345678",
    company: "Acme Cloud",
    position: "Full Stack Developer",
    email: "talento@acme.example",
    channel: "radar_telegram",
    appliedAt: "2026-10-03T16:05:00.000Z",
    identityWeak: false,
    ...overrides,
  }
}

describe("checkApply", () => {
  it("D2: detects an existing application by url and by fingerprint", async () => {
    const store = new MemoryRadarStore()
    await store.saveApply(record())

    const byUrl = await checkApply(payload(), store)
    assert.equal(byUrl.status, "applied")
    assert.equal(byUrl.match, "url")
    assert.equal(byUrl.record?.channel, "radar_telegram")

    const byFp = await checkApply(
      { company: "ACME CLOUD S.A.", position: "full-stack developer" },
      store,
    )
    assert.equal(byFp.status, "applied")
    assert.equal(byFp.match, "fp")
  })

  it("D5: soft-warns when the same company had another position in 30 days", async () => {
    const store = new MemoryRadarStore()
    const backend = vacancyIdentity("Acme Cloud", "Backend Developer")
    await store.saveApply(
      record({
        fp: backend.fp,
        urlKey: "li:job:999",
        position: "Backend Developer",
        appliedAt: "2026-09-12T15:00:00.000Z",
        channel: "apply_manual",
      }),
    )

    const result = await checkApply(payload({ url: undefined }), store)
    assert.equal(result.status, "new")
    assert.equal(result.softWarnings[0]?.kind, "company")
    if (result.softWarnings[0]?.kind === "company") {
      assert.equal(result.softWarnings[0].position, "Backend Developer")
    }
  })

  it("D6: soft-warns when the same email was used in 30 days", async () => {
    const store = new MemoryRadarStore()
    const other = vacancyIdentity("Beta Labs", "Node Engineer")
    await store.saveApply(
      record({
        fp: other.fp,
        urlKey: "li:job:888",
        company: "Beta Labs",
        position: "Node Engineer",
        email: "talento@acme.example",
      }),
    )

    const result = await checkApply(payload({ url: undefined }), store)
    assert.ok(result.softWarnings.some((warning) => warning.kind === "email"))
  })

  it("D7: weak identity only matches url, not fingerprint", async () => {
    const store = new MemoryRadarStore()
    await store.saveApply(
      record({
        fp: "url:li:job:4012345678",
        company: "",
        position: "",
        identityWeak: true,
      }),
    )

    const byUrl = await checkApply({ url: "https://linkedin.com/jobs/view/4012345678" }, store)
    assert.equal(byUrl.status, "applied")
    assert.equal(byUrl.match, "url")
    assert.equal(byUrl.identityWeak, true)

    const byEmpty = await checkApply({ company: "", position: "" }, store)
    assert.equal(byEmpty.status, "new")
    assert.equal(byEmpty.match, null)
    assert.equal(byEmpty.identityWeak, true)
  })

  it("reports history unavailable when Redis is missing", async () => {
    const result = await checkApply(payload(), null)
    assert.equal(result.historyUnavailable, true)
    assert.equal(result.status, "unknown")
  })

  it("reports history unavailable when the store throws", async () => {
    const store = new MemoryRadarStore()
    store.getApplyByUrl = async () => {
      throw new Error("down")
    }
    const result = await checkApply(payload(), store)
    assert.equal(result.historyUnavailable, true)
  })

  it("marks in_progress when the lock is held", async () => {
    const store = new MemoryRadarStore()
    const identity = vacancyIdentity("Acme Cloud", "Full Stack Developer")
    await store.acquireLock(`fp:${identity.fp}`, 120)
    const result = await checkApply(payload({ url: undefined }), store)
    assert.equal(result.status, "in_progress")
  })
})

describe("sendWithDedupe", () => {
  it("D4: second send without confirmDuplicate is 409-equivalent", async () => {
    const store = new MemoryRadarStore()
    let sends = 0
    const send = async () => {
      sends += 1
    }

    const first = await sendWithDedupe({
      store,
      payload: payload(),
      channel: "apply_manual",
      send,
      now: NOW,
    })
    assert.equal(first.ok, true)
    assert.equal(sends, 1)

    const second = await sendWithDedupe({
      store,
      payload: payload(),
      channel: "apply_manual",
      send,
      now: NOW,
    })
    assert.equal(second.ok, false)
    if (!second.ok) {
      assert.equal(second.code, "duplicate")
      assert.match(second.message, /Ya aplicaste el/)
    }
    assert.equal(sends, 1)
  })

  it("D4: confirmDuplicate allows a second send and overwrites the record", async () => {
    const store = new MemoryRadarStore()
    await sendWithDedupe({
      store,
      payload: payload(),
      channel: "apply_manual",
      send: async () => {},
      now: new Date("2026-10-03T16:05:00.000Z"),
    })

    const again = await sendWithDedupe({
      store,
      payload: payload(),
      channel: "apply_manual",
      confirmDuplicate: true,
      send: async () => {},
      now: NOW,
    })
    assert.equal(again.ok, true)
    if (again.ok) {
      assert.equal(again.alreadyExisted, true)
      assert.equal(again.record.appliedAt, NOW.toISOString())
    }
  })

  it("D3: a lock race sends only once", async () => {
    const store = new MemoryRadarStore()
    let sends = 0
    const send = async () => {
      sends += 1
      await new Promise((resolve) => setTimeout(resolve, 40))
    }

    const [a, b] = await Promise.all([
      sendWithDedupe({ store, payload: payload(), channel: "apply_manual", send, now: NOW }),
      sendWithDedupe({ store, payload: payload(), channel: "apply_manual", send, now: NOW }),
    ])

    assert.equal(sends, 1)
    const codes = [a, b].map((result) => (result.ok ? "ok" : result.code)).sort()
    assert.deepEqual(codes, ["in_progress", "ok"])
  })

  it("fails open: without store, requires confirmation and then sends", async () => {
    let sends = 0
    const blocked = await sendWithDedupe({
      store: null,
      payload: payload(),
      channel: "apply_manual",
      send: async () => {
        sends += 1
      },
    })
    assert.equal(blocked.ok, false)
    if (!blocked.ok) assert.equal(blocked.code, "history_unavailable")
    assert.equal(sends, 0)

    const confirmed = await sendWithDedupe({
      store: null,
      payload: payload(),
      channel: "apply_manual",
      confirmDuplicate: true,
      send: async () => {
        sends += 1
      },
    })
    assert.equal(confirmed.ok, true)
    assert.equal(sends, 1)
  })

  it("does not send when send() throws, and releases the lock", async () => {
    const store = new MemoryRadarStore()
    const identity = vacancyIdentity("Acme Cloud", "Full Stack Developer")
    await assert.rejects(
      sendWithDedupe({
        store,
        payload: payload(),
        channel: "apply_manual",
        send: async () => {
          throw new Error("smtp down")
        },
      }),
      /smtp down/,
    )
    assert.equal(await store.isLocked(`fp:${identity.fp}`), false)
    assert.equal(await store.getApplyByFp(identity.fp), null)
  })
})

describe("registerExternalApply", () => {
  it("D9: records channel manual_external without sending mail", async () => {
    const store = new MemoryRadarStore()
    const result = await registerExternalApply({
      store,
      input: payload(),
      now: NOW,
    })
    assert.equal(result.ok, true)
    if (result.ok) {
      assert.equal(result.record.channel, "manual_external")
      assert.equal(result.record.urlKey, "li:job:4012345678")
    }
    assert.equal((await store.getStats("2026-10-05")).manual_external, 1)
  })

  it("refuses to register when there is no URL and identity is weak", async () => {
    const store = new MemoryRadarStore()
    const result = await registerExternalApply({
      store,
      input: { company: "", position: "" },
    })
    assert.equal(result.ok, false)
    if (!result.ok) assert.equal(result.code, "identity_missing")
  })

  it("fails closed when Redis is missing (cannot record)", async () => {
    const result = await registerExternalApply({
      store: null,
      input: payload(),
    })
    assert.equal(result.ok, false)
    if (!result.ok) assert.equal(result.code, "history_unavailable")
  })
})
