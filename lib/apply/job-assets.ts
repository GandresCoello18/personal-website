import { getRedis } from "../radar/redis-client.ts"
import type { ApplyImageRef } from "./job-types.ts"

const REDIS_IMAGE_MAX_BYTES = 700_000
const IMAGE_TTL_SECONDS = 7 * 24 * 60 * 60

function redisImageKey(jobId: string) {
  return `pw:apply:job:${jobId}:image`
}

export async function storeJobImage(input: {
  jobId: string
  mimeType: string
  base64: string
}): Promise<ApplyImageRef> {
  const bytes = Math.ceil((input.base64.length * 3) / 4)
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim()

  if (blobToken && bytes > REDIS_IMAGE_MAX_BYTES) {
    const { put } = await import("@vercel/blob")
    const extension = input.mimeType === "image/png" ? "png" : "jpg"
    const blob = await put(
      `apply-jobs/${input.jobId}.${extension}`,
      Buffer.from(input.base64, "base64"),
      {
        access: "private",
        token: blobToken,
        contentType: input.mimeType,
        addRandomSuffix: false,
      },
    )
    return { kind: "blob", url: blob.url }
  }

  const redis = getRedis()
  if (!redis) {
    throw new Error("Redis no está configurado; no se puede guardar la captura para reintentos.")
  }
  if (bytes > REDIS_IMAGE_MAX_BYTES && !blobToken) {
    throw new Error(
      "La captura es demasiado grande para Redis. Crea un Blob store en Vercel y define BLOB_READ_WRITE_TOKEN.",
    )
  }

  const key = redisImageKey(input.jobId)
  await redis.set(
    key,
    { mimeType: input.mimeType, base64: input.base64 },
    { ex: IMAGE_TTL_SECONDS },
  )
  return { kind: "redis", key }
}

export async function readJobImage(
  ref: ApplyImageRef,
): Promise<{ mimeType: string; base64: string }> {
  if (ref.kind === "redis") {
    const redis = getRedis()
    if (!redis) throw new Error("Redis no está configurado")
    const value = await redis.get<{ mimeType: string; base64: string }>(ref.key)
    if (!value?.base64) throw new Error("La captura de la vacante ya no está en Redis")
    return { mimeType: value.mimeType, base64: value.base64 }
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim()
  const { get } = await import("@vercel/blob")
  const blob = await get(ref.url, {
    access: "private",
    token: blobToken,
  })
  if (!blob || blob.statusCode !== 200) {
    throw new Error("No se pudo leer la captura")
  }
  const mimeType = blob.blob.contentType || "image/jpeg"
  const buffer = Buffer.from(await new Response(blob.stream).arrayBuffer())
  return { mimeType, base64: buffer.toString("base64") }
}
