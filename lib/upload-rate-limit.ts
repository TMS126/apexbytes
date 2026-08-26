import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const RATE_LIMIT_PREFIX = "apexbytes:upload"
const MAX_UPLOADS_PER_WINDOW = 5
const WINDOW = "10 m"

type RateLimitResult =
  | { allowed: true; remaining: number; reset: number }
  | { allowed: false; reason: "not-configured" | "limited" | "unavailable"; retryAfterSeconds?: number }

declare global {
  var apexbytesUploadRateLimit: Ratelimit | undefined
}

function getRateLimit() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }

  if (!globalThis.apexbytesUploadRateLimit) {
    globalThis.apexbytesUploadRateLimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(MAX_UPLOADS_PER_WINDOW, WINDOW),
      analytics: true,
      prefix: RATE_LIMIT_PREFIX,
    })
  }

  return globalThis.apexbytesUploadRateLimit
}

export function getTrustedClientIdentifier(headers: Headers) {
  // Prefer provider-controlled forwarding headers. Use only the first address
  // from x-forwarded-for because proxies append addresses to the chain.
  const ip =
    headers.get("x-vercel-forwarded-for") ??
    headers.get("cf-connecting-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim()

  return ip && ip.length <= 128 ? ip : "unknown-client"
}

export async function checkUploadRateLimit(identifier: string): Promise<RateLimitResult> {
  const rateLimit = getRateLimit()
  if (!rateLimit) return { allowed: false, reason: "not-configured" }

  try {
    const result = await rateLimit.limit(identifier)
    if (result.success) {
      return { allowed: true, remaining: result.remaining, reset: result.reset }
    }

    return {
      allowed: false,
      reason: "limited",
      retryAfterSeconds: Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    }
  } catch (error) {
    console.error("Upload rate-limit check failed.", error)
    return { allowed: false, reason: "unavailable" }
  }
}
