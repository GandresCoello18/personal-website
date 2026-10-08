export type RedisCredentials = {
  url: string
  token: string
  source: "upstash" | "kv"
}

/**
 * Prefer the manual Upstash REST vars; fall back to Vercel Marketplace KV names.
 */
export function getRedisCredentials(env: NodeJS.ProcessEnv = process.env): RedisCredentials | null {
  const upstashUrl = env.UPSTASH_REDIS_REST_URL?.trim()
  const upstashToken = env.UPSTASH_REDIS_REST_TOKEN?.trim()
  if (upstashUrl && upstashToken) {
    return { url: upstashUrl, token: upstashToken, source: "upstash" }
  }

  const kvUrl = env.KV_REST_API_URL?.trim()
  const kvToken = env.KV_REST_API_TOKEN?.trim()
  if (kvUrl && kvToken) {
    return { url: kvUrl, token: kvToken, source: "kv" }
  }

  return null
}
