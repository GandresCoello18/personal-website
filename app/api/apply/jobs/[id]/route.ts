import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { requestHasApplyUnlock } from "@/lib/apply/auth"
import { getApplyJob } from "@/lib/apply/job-store"
import { toPublicJob } from "@/lib/apply/job-types"

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!requestHasApplyUnlock(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { id } = await context.params
  const job = await getApplyJob(id)
  if (!job) {
    return NextResponse.json({ error: "Job no encontrado" }, { status: 404 })
  }

  return NextResponse.json({ job: toPublicJob(job) })
}
