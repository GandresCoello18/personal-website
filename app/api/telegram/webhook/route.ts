import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getRadarStore } from "@/lib/radar/store-upstash"
import { handleTelegramWebhook, readTelegramSecretHeader } from "@/lib/radar/telegram-webhook"
import { sendTelegramMessageSafe } from "@/services/telegram/client"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  let payload: unknown = {}
  try {
    payload = await request.json()
  } catch {
    payload = {}
  }

  const result = await handleTelegramWebhook({
    secretHeader: readTelegramSecretHeader(request.headers),
    payload,
    store: getRadarStore(),
  })

  if (result.reply) {
    void sendTelegramMessageSafe(result.reply)
  }

  return NextResponse.json(result.body, { status: result.status })
}
