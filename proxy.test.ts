import { describe, expect, it } from "vitest"
import { createContentSecurityPolicy } from "./proxy"

describe("content security policy", () => {
  it("uses the supplied nonce instead of unsafe-inline", () => {
    const policy = createContentSecurityPolicy("test-nonce")

    expect(policy).toContain("'nonce-test-nonce'")
    expect(policy).not.toMatch(/script-src[^;]*'unsafe-inline'/)
    expect(policy).not.toContain("script-src 'self' 'nonce-test-nonce' 'strict-dynamic'")
    expect(policy).not.toContain("style-src 'self' 'nonce-test-nonce' 'unsafe-inline'")
    expect(policy).toContain("style-src-attr 'unsafe-inline'")
    expect(policy).not.toContain("'unsafe-eval'")
  })

  it("permits only the Turnstile script and frame origins required by the widget", () => {
    const policy = createContentSecurityPolicy("test-nonce")

    expect(policy).toContain("script-src 'self' 'nonce-test-nonce' https://va.vercel-scripts.com https://www.googletagmanager.com https://challenges.cloudflare.com")
    expect(policy).toContain("frame-src 'self' https://challenges.cloudflare.com")
  })
})
