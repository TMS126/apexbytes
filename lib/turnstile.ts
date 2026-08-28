import { randomUUID } from "node:crypto"

type TurnstileResponse = {
  success: boolean
  hostname?: string
  action?: string
  "error-codes"?: string[]
}

type TurnstileResult =
  | { valid: true }
  | { valid: false; reason: "not-configured" | "missing-token" | "verification-failed" | "unexpected-hostname" | "unexpected-action" | "unavailable" }

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

export async function verifyTurnstileToken({
  token,
  remoteIp,
}: {
  token: string | null
  remoteIp: string | null
}): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim()
  const expectedHostname = process.env.TURNSTILE_EXPECTED_HOSTNAME?.trim()

  if (!secret || !expectedHostname) return { valid: false, reason: "not-configured" }
  if (!token || token.length > 2048) return { valid: false, reason: "missing-token" }

  const body = new FormData()
  body.set("secret", secret)
  body.set("response", token)
  body.set("idempotency_key", randomUUID())
  if (remoteIp) body.set("remoteip", remoteIp)

  const timeout = AbortSignal.timeout(10_000)

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      signal: timeout,
      cache: "no-store",
    })

    if (!response.ok) return { valid: false, reason: "unavailable" }

    const result = (await response.json()) as TurnstileResponse
    if (!result.success) return { valid: false, reason: "verification-failed" }
    if (result.hostname !== expectedHostname) return { valid: false, reason: "unexpected-hostname" }
    if (result.action && result.action !== "document_upload") return { valid: false, reason: "unexpected-action" }

    return { valid: true }
  } catch (error) {
    console.error("Turnstile verification failed.", error)
    return { valid: false, reason: "unavailable" }
  }
}
