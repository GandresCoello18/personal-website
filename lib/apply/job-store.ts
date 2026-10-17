import { getRedis } from "../radar/redis-client.ts"
import {
  applyJobRecordSchema,
  type ApplyJobPublic,
  type ApplyJobRecord,
  toPublicJob,
} from "./job-types.ts"

export const APPLY_JOB_TTL_SECONDS = 7 * 24 * 60 * 60
function jobKey(id: string) {
  return `pw:apply:job:${id}`
}

function jobLogKey() {
  return "pw:apply:jobs:log"
}

function asRecord(value: unknown): ApplyJobRecord | null {
  const parsed = applyJobRecordSchema.safeParse(value)
  if (!parsed.success) return null
  return parsed.data as ApplyJobRecord
}

export async function saveApplyJob(job: ApplyJobRecord): Promise<void> {
  const redis = getRedis()
  if (!redis) throw new Error("Redis no está configurado")
  const createdMs = Date.parse(job.createdAt) || Date.now()
  const pipeline = redis.pipeline()
  pipeline.set(jobKey(job.id), job, { ex: APPLY_JOB_TTL_SECONDS })
  pipeline.zadd(jobLogKey(), { score: createdMs, member: job.id })
  await pipeline.exec()
}

export async function getApplyJob(id: string): Promise<ApplyJobRecord | null> {
  const redis = getRedis()
  if (!redis) return null
  const value = await redis.get(jobKey(id))
  return asRecord(value)
}

export async function listRecentApplyJobs(limit = 20): Promise<ApplyJobPublic[]> {
  const redis = getRedis()
  if (!redis) return []
  const ids = await redis.zrange<string[]>(jobLogKey(), 0, limit - 1, { rev: true })
  if (!ids?.length) return []
  const pipeline = redis.pipeline()
  for (const id of ids) pipeline.get(jobKey(id))
  const rows = await pipeline.exec()
  const jobs: ApplyJobPublic[] = []
  for (const row of rows) {
    const record = asRecord(row)
    if (record) jobs.push(toPublicJob(record))
  }
  return jobs
}

export async function updateApplyJob(
  id: string,
  patch: Partial<ApplyJobRecord>,
): Promise<ApplyJobRecord | null> {
  const current = await getApplyJob(id)
  if (!current) return null
  const next: ApplyJobRecord = { ...current, ...patch, id: current.id }
  await saveApplyJob(next)
  return next
}
