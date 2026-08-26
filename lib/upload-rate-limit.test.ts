import { afterEach, describe, expect, it } from "vitest"
import { checkUploadRateLimit, getTrustedClientIdentifier } from "./upload-rate-limit"

const originalUrl = process.env.UPSTASH_REDIS_REST_URL
const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN

afterEach(() => {
  if (originalUrl === undefined) delete process.env.UPSTASH_REDIS_REST_URL
  else process.env.UPSTASH_REDIS_REST_URL = originalUrl

  if (originalToken === undefined) delete process.env.UPSTASH_REDIS_REST_TOKEN
  else process.env.UPSTASH_REDIS_REST_TOKEN = originalToken
})

describe("upload rate limiting", () => {
  it("prefers provider-controlled address headers", () => {
    expect(
      getTrustedClientIdentifier(
        new Headers({
          "x-vercel-forwarded-for": "198.51.100.10",
          "x-forwarded-for": "203.0.113.5",
        })
      )
    ).toBe("198.51.100.10")
  })

  it("uses only the first forwarded address", () => {
    expect(getTrustedClientIdentifier(new Headers({ "x-forwarded-for": "198.51.100.10, 10.0.0.4" }))).toBe(
      "198.51.100.10"
    )
  })

  it("fails closed when Redis credentials are absent", async () => {
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN

    await expect(checkUploadRateLimit("198.51.100.10")).resolves.toEqual({
      allowed: false,
      reason: "not-configured",
    })
  })
})
