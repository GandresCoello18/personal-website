import { companyKey } from "./fingerprint.ts"
import type { ApplyRecord } from "./types.ts"

export class StoreUnavailableError extends Error {
  constructor(message = "historial no disponible") {
    super(message)
    this.name = "StoreUnavailableError"
  }
}

export type RadarStatField =
  | "seen"
  | "duplicates"
  | "filtered"
  | "analyzed"
  | "notified"
  | "drafted"
  | "sent"
  | "manual_external"
  | "dismissed"
  | "already_applied"
  | "llm_calls"
  | "errors"

export interface RadarStore {
  getApplyByFp(fp: string): Promise<ApplyRecord | null>
  getApplyByUrl(urlKey: string): Promise<ApplyRecord | null>
  saveApply(record: ApplyRecord): Promise<void>
  getRecentByCompany(companyNorm: string, sinceMs: number): Promise<ApplyRecord[]>
  getRecentByEmail(email: string, sinceMs: number): Promise<ApplyRecord[]>
  acquireLock(lockKey: string, ttlSeconds: number): Promise<boolean>
  releaseLock(lockKey: string): Promise<void>
  isLocked(lockKey: string): Promise<boolean>
  incrementStat(day: string, field: RadarStatField, by?: number): Promise<void>
  getStats(day: string): Promise<Partial<Record<RadarStatField, number>>>
  setPauseUntil(untilIso: string, ttlSeconds: number): Promise<void>
  getPauseUntil(): Promise<string | null>
}

type LockEntry = { expiresAt: number }

export class MemoryRadarStore implements RadarStore {
  readonly appliesByFp = new Map<string, ApplyRecord>()
  readonly appliesByUrl = new Map<string, string>()
  readonly companyIndex = new Map<string, Map<string, number>>()
  readonly emailIndex = new Map<string, Map<string, number>>()
  readonly locks = new Map<string, LockEntry>()
  readonly stats = new Map<string, Partial<Record<RadarStatField, number>>>()
  pauseUntil: string | null = null

  async getApplyByFp(fp: string): Promise<ApplyRecord | null> {
    return this.appliesByFp.get(fp) ?? null
  }

  async getApplyByUrl(urlKey: string): Promise<ApplyRecord | null> {
    const fp = this.appliesByUrl.get(urlKey)
    if (!fp) return null
    return this.appliesByFp.get(fp) ?? null
  }

  async saveApply(record: ApplyRecord): Promise<void> {
    this.appliesByFp.set(record.fp, record)
    if (record.urlKey) this.appliesByUrl.set(record.urlKey, record.fp)
    const appliedMs = Date.parse(record.appliedAt) || Date.now()
    this.indexMember(this.companyIndex, companyKey(record.company), record.fp, appliedMs)
    if (record.email) {
      this.indexMember(this.emailIndex, record.email, record.fp, appliedMs)
    }
  }

  async getRecentByCompany(companyNorm: string, sinceMs: number): Promise<ApplyRecord[]> {
    if (!companyNorm) return []
    return this.recentFromIndex(this.companyIndex, companyNorm, sinceMs)
  }

  async getRecentByEmail(email: string, sinceMs: number): Promise<ApplyRecord[]> {
    if (!email) return []
    return this.recentFromIndex(this.emailIndex, email, sinceMs)
  }

  async acquireLock(lockKey: string, ttlSeconds: number): Promise<boolean> {
    const now = Date.now()
    const existing = this.locks.get(lockKey)
    if (existing && existing.expiresAt > now) return false
    this.locks.set(lockKey, { expiresAt: now + ttlSeconds * 1000 })
    return true
  }

  async releaseLock(lockKey: string): Promise<void> {
    this.locks.delete(lockKey)
  }

  async isLocked(lockKey: string): Promise<boolean> {
    const existing = this.locks.get(lockKey)
    if (!existing) return false
    if (existing.expiresAt <= Date.now()) {
      this.locks.delete(lockKey)
      return false
    }
    return true
  }

  async incrementStat(day: string, field: RadarStatField, by = 1): Promise<void> {
    const current = this.stats.get(day) ?? {}
    current[field] = (current[field] ?? 0) + by
    this.stats.set(day, current)
  }

  async getStats(day: string): Promise<Partial<Record<RadarStatField, number>>> {
    return { ...(this.stats.get(day) ?? {}) }
  }

  async setPauseUntil(untilIso: string, ttlSeconds: number): Promise<void> {
    void ttlSeconds
    this.pauseUntil = untilIso
  }

  async getPauseUntil(): Promise<string | null> {
    return this.pauseUntil
  }

  private indexMember(
    index: Map<string, Map<string, number>>,
    key: string,
    fp: string,
    ts: number,
  ) {
    if (!key) return
    const bucket = index.get(key) ?? new Map<string, number>()
    bucket.set(fp, ts)
    index.set(key, bucket)
  }

  private recentFromIndex(
    index: Map<string, Map<string, number>>,
    key: string,
    sinceMs: number,
  ): ApplyRecord[] {
    const bucket = index.get(key)
    if (!bucket) return []
    const records: ApplyRecord[] = []
    for (const [fp, ts] of bucket) {
      if (ts < sinceMs) continue
      const record = this.appliesByFp.get(fp)
      if (record) records.push(record)
    }
    return records.sort((a, b) => Date.parse(b.appliedAt) - Date.parse(a.appliedAt))
  }
}
