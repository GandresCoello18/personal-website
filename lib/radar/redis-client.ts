import { Redis } from "@upstash/redis"
import { getRedisCredentials } from "./redis-env.ts"

let cached: Redis | null | undefined

export function getRedis(): Redis | null {
  if (cached !== undefined) return cached
  const credentials = getRedisCredentials()
  if (!credentials) {
    cached = null
    return null
  }
  cached = new Redis({ url: credentials.url, token: credentials.token })
  return cached
}

export function resetRedisClientCache() {
  cached = undefined
}
