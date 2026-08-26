import { NextRequest, NextResponse } from "next/server"
import {
  deletePendingUpload,
  hasAdminUploadAccess,
  listPendingUploads,
  type UploadResourceType,
} from "@/lib/upload-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
}

export async function GET(request: NextRequest) {
  if (!hasAdminUploadAccess(request)) return unauthorized()

  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? "50")
  const uploads = await listPendingUploads(Number.isFinite(requestedLimit) ? requestedLimit : 50)

  // Metadata only: this endpoint intentionally never returns a delivery URL.
  return NextResponse.json({ uploads })
}

export async function DELETE(request: NextRequest) {
  if (!hasAdminUploadAccess(request)) return unauthorized()

  try {
    const body = (await request.json()) as { publicId?: unknown; resourceType?: unknown }
    if (typeof body.publicId !== "string" || (body.resourceType !== "image" && body.resourceType !== "raw")) {
      return NextResponse.json({ error: "Invalid deletion request." }, { status: 400 })
    }

    const result = await deletePendingUpload({
      publicId: body.publicId,
      resourceType: body.resourceType as UploadResourceType,
      actor: "admin",
    })

    return NextResponse.json({ deleted: result === "ok" || result === "not found" })
  } catch (error) {
    console.error("Staff upload deletion failed.", error)
    return NextResponse.json({ error: "Unable to delete the document." }, { status: 500 })
  }
}
