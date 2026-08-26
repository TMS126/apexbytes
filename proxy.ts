import { NextRequest, NextResponse } from "next/server"

// This broad, in-memory guard is intentionally only a lightweight backstop.
// The upload route has its own durable Redis-backed rate limit.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000
const MAX_REQUESTS = 100

export function createContentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://va.vercel-scripts.com https://www.googletagmanager.com https://challenges.cloudflare.com`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' blob: data: https://*.whatsapp.net https://res.cloudinary.com",
    "font-src 'self'",
    "connect-src 'self' https://va.vercel-scripts.com https://api.cloudinary.com https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://challenges.cloudflare.com",
    "frame-src 'self' https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://wa.me",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ")
}

export function proxy(request: NextRequest) {
  const isMaintenanceMode = false
  if (isMaintenanceMode) {
    return NextResponse.rewrite(new URL("/maintenance", request.url))
  }

  const ip = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for") ?? "unknown-client"
  const now = Date.now()
  const limitInfo = rateLimitMap.get(ip) ?? { count: 0, lastReset: now }

  if (now - limitInfo.lastReset > RATE_LIMIT_WINDOW) {
    limitInfo.count = 1
    limitInfo.lastReset = now
  } else {
    limitInfo.count += 1
  }

  rateLimitMap.set(ip, limitInfo)
  if (limitInfo.count > MAX_REQUESTS) {
    return new NextResponse("Too Many Requests", { status: 429 })
  }

  const nonce = btoa(crypto.randomUUID())
  const contentSecurityPolicy = createContentSecurityPolicy(nonce)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)
  // Next.js reads the forwarded request CSP to attach the nonce to its own
  // script and style output; the identical policy is sent to the browser.
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set("Content-Security-Policy", contentSecurityPolicy)
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()")
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?|ttf|otf)$).*)"],
}
