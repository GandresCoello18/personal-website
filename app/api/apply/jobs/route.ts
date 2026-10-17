import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requestHasApplyUnlock } from "@/lib/apply/auth"
import { listRecentApplyJobs } from "@/lib/apply/job-store"

export async function GET(request: NextRequest) {
  if (!requestHasApplyUnlock(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const jobs = await listRecentApplyJobs(20)
  return NextResponse.json({ jobs })
}
