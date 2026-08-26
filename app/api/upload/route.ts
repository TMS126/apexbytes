import { randomUUID } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { checkUploadRateLimit, getTrustedClientIdentifier } from "@/lib/upload-rate-limit"
import { verifyTurnstileToken } from "@/lib/turnstile"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024
const UPLOAD_FOLDER = "apexbyteshub/pending-review"

const ALLOWED_FILES = {
  pdf: {
    extensions: ["pdf"],
    mimeTypes: ["application/pdf"],
    resourceType: "raw" as const,
    signature: (bytes: Uint8Array) => startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d]),
  },
  jpg: {
    extensions: ["jpg", "jpeg"],
    mimeTypes: ["image/jpeg"],
    resourceType: "image" as const,
    signature: (bytes: Uint8Array) => startsWith(bytes, [0xff, 0xd8, 0xff]),
  },
  png: {
    extensions: ["png"],
    mimeTypes: ["image/png"],
    resourceType: "image" as const,
    signature: (bytes: Uint8Array) => startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  },
  webp: {
    extensions: ["webp"],
    mimeTypes: ["image/webp"],
    resourceType: "image" as const,
    signature: (bytes: Uint8Array) => startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && readAscii(bytes, 8, 4) === "WEBP",
  },
  doc: {
    extensions: ["doc"],
    mimeTypes: ["application/msword"],
    resourceType: "raw" as const,
    signature: (bytes: Uint8Array) => startsWith(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
  },
  docx: {
    extensions: ["docx"],
    mimeTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    resourceType: "raw" as const,
    signature: (bytes: Uint8Array) => startsWith(bytes, [0x50, 0x4b, 0x03, 0x04]),
  },
} as const

type AllowedFile = (typeof ALLOWED_FILES)[keyof typeof ALLOWED_FILES]

function startsWith(bytes: Uint8Array, prefix: number[]) {
  return prefix.every((value, index) => bytes[index] === value)
}

function readAscii(bytes: Uint8Array, start: number, length: number) {
  return String.fromCharCode(...bytes.slice(start, start + length))
}

function getExtension(filename: string) {
  const normalized = filename.trim().toLowerCase()
  const dot = normalized.lastIndexOf(".")
  return dot > 0 && dot < normalized.length - 1 ? normalized.slice(dot + 1) : ""
}

function findAllowedFile(file: File): AllowedFile | null {
  const extension = getExtension(file.name)
  return Object.values(ALLOWED_FILES).find(
    (allowed) => allowed.extensions.includes(extension as never) && allowed.mimeTypes.includes(file.type as never)
  ) ?? null
}

function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin")
  if (!origin) return true

  try {
    return new URL(origin).host === request.headers.get("host")
  } catch {
    return false
  }
}

function hasCloudinaryConfiguration() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  )
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

export async function POST(request: NextRequest) {
  // Fail closed until deployment-level protections have been configured deliberately.
  if (process.env.UPLOADS_ENABLED !== "true") {
    return NextResponse.json({ error: "Document upload is temporarily unavailable." }, { status: 503 })
  }

  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid upload origin." }, { status: 403 })
  }

  if (!hasCloudinaryConfiguration()) {
    console.error("Cloudinary upload configuration is incomplete.")
    return NextResponse.json({ error: "Document upload is temporarily unavailable." }, { status: 503 })
  }

  const clientIdentifier = getTrustedClientIdentifier(request.headers)
  const rateLimit = await checkUploadRateLimit(clientIdentifier)
  if (!rateLimit.allowed) {
    if (rateLimit.reason === "limited") {
      return NextResponse.json(
        { error: "Too many upload attempts. Please wait and try again." },
        {
          status: 429,
          headers: rateLimit.retryAfterSeconds ? { "Retry-After": String(rateLimit.retryAfterSeconds) } : undefined,
        }
      )
    }

    console.error(`Upload rate limiting is ${rateLimit.reason}.`)
    return NextResponse.json({ error: "Document upload is temporarily unavailable." }, { status: 503 })
  }

  const formData = await request.formData()
  const turnstile = await verifyTurnstileToken({
    token: typeof formData.get("turnstileToken") === "string" ? String(formData.get("turnstileToken")) : null,
    remoteIp: clientIdentifier === "unknown-client" ? null : clientIdentifier,
  })
  if (!turnstile.valid) {
    if (turnstile.reason === "not-configured" || turnstile.reason === "unavailable") {
      console.error(`Turnstile is ${turnstile.reason}.`)
      return NextResponse.json({ error: "Document upload is temporarily unavailable." }, { status: 503 })
    }

    return NextResponse.json({ error: "Please complete the upload verification and try again." }, { status: 403 })
  }

  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 })
  }

  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Files must be between 1 byte and 5 MB." }, { status: 400 })
  }

  const allowed = findAllowedFile(file)
  if (!allowed) {
    return NextResponse.json(
      { error: "Only PDF, JPG, PNG, WEBP, DOC, and DOCX files are accepted." },
      { status: 400 }
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  if (!allowed.signature(buffer)) {
    return NextResponse.json({ error: "The file content does not match its declared type." }, { status: 400 })
  }

  configureCloudinary()

  try {
    const uploadId = randomUUID()
    const result = await new Promise<{ public_id: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: allowed.resourceType,
            type: "authenticated",
            folder: UPLOAD_FOLDER,
            public_id: uploadId,
            overwrite: false,
            use_filename: false,
            unique_filename: false,
            tags: ["pending-review", "customer-document"],
            context: {
              original_extension: getExtension(file.name),
              retention: "manual-review-required",
            },
          },
          (error, uploadResult) => {
            if (error || !uploadResult) return reject(error ?? new Error("Cloudinary upload failed."))
            resolve({ public_id: uploadResult.public_id })
          }
        )
        .end(buffer)
    })

    // Do not return a delivery URL. Authorised staff retrieve authenticated assets
    // through a separately controlled workflow.
    return NextResponse.json({ upload_id: result.public_id }, { status: 201 })
  } catch (error) {
    console.error("Document upload failed.", error)
    return NextResponse.json({ error: "Upload failed. Please try again later." }, { status: 500 })
  }
}
