import { NextRequest, NextResponse } from "next/server"
import { getUploadAuditEvents, hasAdminUploadAccess } from "@/lib/upload-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  if (!hasAdminUploadAccess(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  try {
    const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? "50")
    const events = await getUploadAuditEvents(Number.isFinite(requestedLimit) ? requestedLimit : 50)
    return NextResponse.json({ events })
  } catch (error) {
    console.error("Upload audit retrieval failed.", error)
    return NextResponse.json({ error: "Unable to retrieve the upload audit log." }, { status: 500 })
  }
}
