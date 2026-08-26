import { describe, expect, it } from "vitest"
import {
  ALLOWED_UPLOAD_EXTENSIONS,
  HUB_ACCEPT,
  formatAcceptHint,
  getContrastText,
  naturalServiceLabel,
} from "./lib"

describe("service-page helpers", () => {
  it("keeps every service hub on the server-supported upload allowlist", () => {
    expect(ALLOWED_UPLOAD_EXTENSIONS).toBe(".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx")
    expect(Object.values(HUB_ACCEPT)).toEqual(
      Array.from({ length: 5 }, () => ALLOWED_UPLOAD_EXTENSIONS)
    )
  })

  it("renders a readable file-type hint", () => {
    expect(formatAcceptHint(".pdf,.jpg,.docx")).toBe("PDF, JPG, DOCX")
  })

  it("creates natural service labels without repeating known prefixes", () => {
    expect(naturalServiceLabel("Status Check", "SASSA")).toBe("SASSA Status Check")
    expect(naturalServiceLabel("SARS eFiling", "SARS")).toBe("SARS eFiling")
  })

  it("chooses a readable contrast color", () => {
    expect(getContrastText("#ffffff")).toBe("#1a1a1a")
    expect(getContrastText("#0f3f66")).toBe("#ffffff")
  })
})
