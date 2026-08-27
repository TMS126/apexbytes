import { createHash, timingSafeEqual } from "node:crypto"
import { v2 as cloudinary } from "cloudinary"
import { Redis } from "@upstash/redis"

const PENDING_UPLOAD_TAG = "pending-review"
const UPLOAD_FOLDER_PREFIX = "apexbyteshub/pending-review/"
const AUDIT_KEY = "apexbytes:upload-audit"
const MAX_AUDIT_EVENTS = 1_000
const CLEANUP_PAGE_SIZE = 100
const MAX_CLEANUP_PAGES_PER_RUN = 10

export type UploadResourceType = "image" | "raw"

type PendingUpload = {
  publicId: string
  resourceType: UploadResourceType
  bytes: number
  createdAt: string
  format?: string
  tags?: string[]
}

type UploadAuditEvent = {
  at: string
  action: "deleted" | "cleanup-complete"
  actor: "admin" | "cron"
  publicId?: string
  resourceType?: UploadResourceType
  deletedCount?: number
}

function configureCloudinary() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary configuration is incomplete.")
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

function safeEqual(value: string | null, expected: string | undefined) {
  if (!value || !expected) return false

  // Compare fixed-length digests so the comparison itself does not branch on
  // secret length before timingSafeEqual is called.
  const actualDigest = createHash("sha256").update(value).digest()
  const expectedDigest = createHash("sha256").update(expected).digest()
  return timingSafeEqual(actualDigest, expectedDigest)
}

export function hasAdminUploadAccess(request: Request) {
  return safeEqual(request.headers.get("x-admin-upload-secret"), process.env.ADMIN_UPLOADS_SECRET)
}

export function hasCronAccess(request: Request) {
  const authorization = request.headers.get("authorization")
  const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : null
  return safeEqual(token, process.env.CRON_SECRET)
}

function getAuditRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("Upstash Redis configuration is incomplete.")
  }
  return Redis.fromEnv()
}

async function appendAuditEvent(event: UploadAuditEvent) {
  const redis = getAuditRedis()
  await redis.lpush(AUDIT_KEY, JSON.stringify(event))
  await redis.ltrim(AUDIT_KEY, 0, MAX_AUDIT_EVENTS - 1)
}

function assertPendingUpload(publicId: string, resourceType: string): asserts resourceType is UploadResourceType {
  if (!publicId.startsWith(UPLOAD_FOLDER_PREFIX) || (resourceType !== "image" && resourceType !== "raw")) {
    throw new Error("Invalid pending-upload identifier.")
  }
}

function mapResource(resource: {
  public_id: string
  resource_type: string
  bytes: number
  created_at: string
  format?: string
  tags?: string[]
}): PendingUpload {
  return {
    publicId: resource.public_id,
    resourceType: resource.resource_type === "image" ? "image" : "raw",
    bytes: resource.bytes,
    createdAt: resource.created_at,
    format: resource.format,
    tags: resource.tags,
  }
}

export async function listPendingUploads(maxResults = 100) {
  configureCloudinary()
  const results = await cloudinary.search
    .expression(`tags=${PENDING_UPLOAD_TAG} AND folder=${UPLOAD_FOLDER_PREFIX.slice(0, -1)}`)
    .with_field("tags")
    .max_results(Math.min(Math.max(maxResults, 1), 100))
    .execute()

  return (results.resources ?? []).map(mapResource)
}

export async function deletePendingUpload({
  publicId,
  resourceType,
  actor,
}: {
  publicId: string
  resourceType: UploadResourceType
  actor: "admin" | "cron"
}) {
  assertPendingUpload(publicId, resourceType)
  configureCloudinary()

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    type: "authenticated",
    invalidate: true,
  })

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error("Cloudinary did not confirm document deletion.")
  }

  await appendAuditEvent({
    at: new Date().toISOString(),
    action: "deleted",
    actor,
    publicId,
    resourceType,
  })

  return result.result
}

export async function deleteExpiredPendingUploads({ retentionDays }: { retentionDays: number }) {
  if (!Number.isInteger(retentionDays) || retentionDays < 1 || retentionDays > 365) {
    throw new Error("Retention days must be an integer between 1 and 365.")
  }

  configureCloudinary()
  const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString()
  // Cloudinary search expressions require ISO timestamps containing reserved
  // characters such as ':' to be quoted.
  const expression = `tags=${PENDING_UPLOAD_TAG} AND folder=${UPLOAD_FOLDER_PREFIX.slice(0, -1)} AND created_at<"${cutoff}"`
  const resources: PendingUpload[] = []
  let nextCursor: string | undefined
  let pagesProcessed = 0

  // Collect first, then delete. This avoids changing the result set while a
  // cursor-based search is still being consumed.
  do {
    let search = cloudinary.search.expression(expression).with_field("tags").max_results(CLEANUP_PAGE_SIZE)
    if (nextCursor) search = search.next_cursor(nextCursor)

    const results = await search.execute()
    resources.push(...(results.resources ?? []).map(mapResource))
    nextCursor = results.next_cursor
    pagesProcessed += 1
  } while (nextCursor && pagesProcessed < MAX_CLEANUP_PAGES_PER_RUN)

  let deletedCount = 0
  for (const resource of resources) {
    await deletePendingUpload({ ...resource, actor: "cron" })
    deletedCount += 1
  }

  await appendAuditEvent({
    at: new Date().toISOString(),
    action: "cleanup-complete",
    actor: "cron",
    deletedCount,
  })

  return {
    deletedCount,
    cutoff,
    pagesProcessed,
    remainingCandidates: Boolean(nextCursor),
  }
}

export async function getUploadAuditEvents(limit = 50) {
  const redis = getAuditRedis()
  const entries = await redis.lrange<string>(AUDIT_KEY, 0, Math.min(Math.max(limit, 1), 100) - 1)
  return entries.flatMap((entry) => {
    try {
      return [JSON.parse(entry) as UploadAuditEvent]
    } catch {
      return []
    }
  })
}
