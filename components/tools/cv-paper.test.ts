import { describe, expect, it } from "vitest"
import { EMPTY_CV, personalDetails } from "./cv-paper"

describe("CV personal details", () => {
  const data = { ...EMPTY_CV, idNumber: "9001010000001", maritalStatus: "Single", driverLicense: "Code 8 / B" }

  it("includes South African details when selected", () => {
    expect(personalDetails({ ...data, region: "sa" })).toEqual([
      { label: "ID number", value: "9001010000001" },
      { label: "Marital status", value: "Single" },
      { label: "Driver's licence", value: "Code 8 / B" },
    ])
  })

  it("omits South African details from international CVs after switching region", () => {
    expect(personalDetails({ ...data, region: "intl" })).toEqual([])
  })
})
