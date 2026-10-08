import { NextResponse } from "next/server"
import type { DedupeFailure } from "../radar/dedupe.ts"

export function dedupeFailureResponse(result: DedupeFailure) {
  if (result.code === "duplicate") {
    return NextResponse.json(
      {
        error: result.message,
        code: result.code,
        appliedAt: result.record.appliedAt,
        channel: result.record.channel,
        record: result.record,
      },
      { status: 409 },
    )
  }

  const status = result.code === "identity_missing" ? 400 : 409
  return NextResponse.json(
    {
      error: result.message,
      code: result.code,
    },
    { status },
  )
}
