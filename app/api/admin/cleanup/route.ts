import { NextRequest, NextResponse } from "next/server"
import { deleteExpiredPendingUploads, hasCronAccess } from "@/lib/upload-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DEFAULT_RETENTION_DAYS = 30

export async function GET(request: NextRequest) {
  if (!hasCronAccess(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  try {
    const retentionDays = Number(process.env.UPLOAD_RETENTION_DAYS ?? DEFAULT_RETENTION_DAYS)
    const result = await deleteExpiredPendingUploads({ retentionDays })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Scheduled upload cleanup failed.", error)
    return NextResponse.json({ error: "Scheduled cleanup failed." }, { status: 500 })
  }
}
