import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requestHasApplyUnlock } from "@/lib/apply/auth"

export async function GET(request: NextRequest) {
  return NextResponse.json({ unlocked: requestHasApplyUnlock(request) })
}
