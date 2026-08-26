import { afterEach, describe, expect, it } from "vitest"
import { hasAdminUploadAccess, hasCronAccess } from "./upload-admin"

const originalAdminSecret = process.env.ADMIN_UPLOADS_SECRET
const originalCronSecret = process.env.CRON_SECRET

afterEach(() => {
  if (originalAdminSecret === undefined) delete process.env.ADMIN_UPLOADS_SECRET
  else process.env.ADMIN_UPLOADS_SECRET = originalAdminSecret

  if (originalCronSecret === undefined) delete process.env.CRON_SECRET
  else process.env.CRON_SECRET = originalCronSecret
})

describe("upload administration authentication", () => {
  it("accepts only the configured staff secret", () => {
    process.env.ADMIN_UPLOADS_SECRET = "a-long-random-staff-secret"

    expect(
      hasAdminUploadAccess(new Request("https://example.test", { headers: { "x-admin-upload-secret": "a-long-random-staff-secret" } }))
    ).toBe(true)
    expect(
      hasAdminUploadAccess(new Request("https://example.test", { headers: { "x-admin-upload-secret": "a-long-random-staff-secrex" } }))
    ).toBe(false)
    expect(hasAdminUploadAccess(new Request("https://example.test"))).toBe(false)
  })

  it("accepts only a bearer token that matches the configured cron secret", () => {
    process.env.CRON_SECRET = "a-long-random-cron-secret"

    expect(
      hasCronAccess(new Request("https://example.test", { headers: { authorization: "Bearer a-long-random-cron-secret" } }))
    ).toBe(true)
    expect(
      hasCronAccess(new Request("https://example.test", { headers: { authorization: "Bearer a-long-random-cron-secrex" } }))
    ).toBe(false)
    expect(hasCronAccess(new Request("https://example.test"))).toBe(false)
  })
})
