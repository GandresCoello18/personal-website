import { Redis } from "@upstash/redis"
import { companyKey } from "./fingerprint.ts"
import {
  APPLY_RECORD_TTL_SECONDS,
  COMPANY_INDEX_TTL_SECONDS,
  EMAIL_INDEX_TTL_SECONDS,
  type ApplyRecord,
} from "./types.ts"
import type { RadarStatField, RadarStore } from "./store.ts"
import { StoreUnavailableError } from "./store.ts"
import { getRedisCredentials, type RedisCredentials } from "./redis-env.ts"

const PREFIX = "pw"

function key(...parts: string[]): string {
  return [PREFIX, ...parts].join(":")
}

function applyFpKey(fp: string) {
  return key("apply", "fp", fp)
}

function applyUrlKey(urlKey: string) {
  return key("apply", "url", urlKey)
}

function applyCompanyKey(companyNorm: string) {
  return key("apply", "company", companyNorm)
}

function applyEmailKey(email: string) {
  return key("apply", "email", email)
}

function applyLockKey(lockKey: string) {
  return key("apply", "lock", lockKey)
}

function applyLogKey() {
  return key("apply", "log")
}

function statsKey(day: string) {
  return key("radar", "stats", day)
}

function pauseKey() {
  return key("radar", "pause")
}

function asRecord(value: unknown): ApplyRecord | null {
  if (!value) return null
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as ApplyRecord
    } catch {
      return null
    }
  }
  if (typeof value === "object") return value as ApplyRecord
  return null
}

export class UpstashRadarStore implements RadarStore {
  constructor(private readonly redis: Redis) {}

  async getApplyByFp(fp: string): Promise<ApplyRecord | null> {
    return asRecord(await this.redis.get(applyFpKey(fp)))
  }

  async getApplyByUrl(urlKey: string): Promise<ApplyRecord | null> {
    const fp = await this.redis.get<string>(applyUrlKey(urlKey))
    if (!fp) return null
    return this.getApplyByFp(fp)
  }

  async saveApply(record: ApplyRecord): Promise<void> {
    const appliedMs = Date.parse(record.appliedAt) || Date.now()
    const companyNorm = companyKey(record.company)
    const pipeline = this.redis.pipeline()
    pipeline.set(applyFpKey(record.fp), record, { ex: APPLY_RECORD_TTL_SECONDS })
    if (record.urlKey) {
      pipeline.set(applyUrlKey(record.urlKey), record.fp, { ex: APPLY_RECORD_TTL_SECONDS })
    }
    if (companyNorm) {
      pipeline.zadd(applyCompanyKey(companyNorm), { score: appliedMs, member: record.fp })
      pipeline.expire(applyCompanyKey(companyNorm), COMPANY_INDEX_TTL_SECONDS)
    }
    if (record.email) {
      pipeline.zadd(applyEmailKey(record.email), { score: appliedMs, member: record.fp })
      pipeline.expire(applyEmailKey(record.email), EMAIL_INDEX_TTL_SECONDS)
    }
    pipeline.zadd(applyLogKey(), { score: appliedMs, member: record.fp })
    await pipeline.exec()
  }

  async getRecentByCompany(companyNorm: string, sinceMs: number): Promise<ApplyRecord[]> {
    if (!companyNorm) return []
    const fps = await this.redis.zrange<string[]>(
      applyCompanyKey(companyNorm),
      sinceMs,
      Number.MAX_SAFE_INTEGER,
      { byScore: true },
    )
    return this.loadRecords(fps)
  }

  async getRecentByEmail(email: string, sinceMs: number): Promise<ApplyRecord[]> {
    if (!email) return []
    const fps = await this.redis.zrange<string[]>(
      applyEmailKey(email),
      sinceMs,
      Number.MAX_SAFE_INTEGER,
      { byScore: true },
    )
    return this.loadRecords(fps)
  }

  async acquireLock(lockKey: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.redis.set(applyLockKey(lockKey), "1", {
      nx: true,
      ex: ttlSeconds,
    })
    return result === "OK"
  }

  async releaseLock(lockKey: string): Promise<void> {
    await this.redis.del(applyLockKey(lockKey))
  }

  async isLocked(lockKey: string): Promise<boolean> {
    const value = await this.redis.get(applyLockKey(lockKey))
    return value !== null
  }

  async incrementStat(day: string, field: RadarStatField, by = 1): Promise<void> {
    await this.redis.hincrby(statsKey(day), field, by)
  }

  async getStats(day: string): Promise<Partial<Record<RadarStatField, number>>> {
    const raw = await this.redis.hgetall<Record<string, string | number>>(statsKey(day))
    if (!raw) return {}
    const stats: Partial<Record<RadarStatField, number>> = {}
    for (const [field, value] of Object.entries(raw)) {
      const n = typeof value === "number" ? value : Number(value)
      if (Number.isFinite(n)) stats[field as RadarStatField] = n
    }
    return stats
  }

  async setPauseUntil(untilIso: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(pauseKey(), untilIso, { ex: ttlSeconds })
  }

  async getPauseUntil(): Promise<string | null> {
    const value = await this.redis.get<string>(pauseKey())
    return value ?? null
  }

  private async loadRecords(fps: string[] | null | undefined): Promise<ApplyRecord[]> {
    if (!fps?.length) return []
    const pipeline = this.redis.pipeline()
    for (const fp of fps) pipeline.get(applyFpKey(fp))
    const rows = await pipeline.exec()
    const records: ApplyRecord[] = []
    for (const row of rows) {
      const record = asRecord(row)
      if (record) records.push(record)
    }
    return records.sort((a, b) => Date.parse(b.appliedAt) - Date.parse(a.appliedAt))
  }
}

let cached: RadarStore | null | undefined

export function getRadarStore(): RadarStore | null {
  if (cached !== undefined) return cached
  const credentials = getRedisCredentials()
  if (!credentials) {
    cached = null
    return null
  }
  cached = createUpstashStore(credentials)
  return cached
}

export function createUpstashStore(credentials: RedisCredentials): RadarStore {
  return new UpstashRadarStore(
    new Redis({
      url: credentials.url,
      token: credentials.token,
    }),
  )
}

export function resetRadarStoreCache() {
  cached = undefined
}

export function requireRadarStore(): RadarStore {
  const store = getRadarStore()
  if (!store) throw new StoreUnavailableError()
  return store
}
