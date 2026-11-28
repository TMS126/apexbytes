import { describe, expect, it } from "vitest"
import { newEducation } from "@/components/tools/cv-paper"
import { COUNTRY_OPTIONS, SA_PROVINCES } from "./cv-options"
import { TERTIARY_INSTITUTIONS, institutionsFor, programmesFor } from "./tertiary"

describe("South African tertiary data", () => {
  it("covers all nine provinces and a broad institution set", () => {
    expect(SA_PROVINCES).toHaveLength(9)
    expect(TERTIARY_INSTITUTIONS.filter((item) => item.type === "University" || item.type === "University of Technology")).toHaveLength(26)
    expect(TERTIARY_INSTITUTIONS.filter((item) => item.type === "TVET College")).toHaveLength(50)
    expect(TERTIARY_INSTITUTIONS.length).toBeGreaterThan(90)
  })

  it("filters universities by province", () => {
    const kzn = institutionsFor("KwaZulu-Natal", ["University"]).map((item) => item.name)
    expect(kzn).toContain("University of KwaZulu-Natal")
    expect(kzn).not.toContain("University of Cape Town")
  })

  it("filters TVET colleges by province and keeps national institutions available", () => {
    const easternCape = institutionsFor("Eastern Cape", ["TVET College"]).map((item) => item.name)
    expect(easternCape).toContain("Buffalo City TVET College")
    expect(easternCape).not.toContain("Boland TVET College")
  })

  it("returns programmes for a selected institution", () => {
    expect(programmesFor("University of KwaZulu-Natal")).toContain("BCom")
    expect(programmesFor("Not a real institution")).toEqual([])
  })

  it("keeps South Africa first in the country dropdown", () => {
    expect(COUNTRY_OPTIONS[0]).toBe("South Africa")
    expect(COUNTRY_OPTIONS.length).toBeGreaterThan(190)
  })

  it("starts a new education record with the dependent dropdowns empty", () => {
    const education = newEducation(7)
    expect(education.level).toBe("school")
    expect(education.province).toBe("")
    expect(education.country).toBe("")
    expect(education.institutionType).toBe("")
    expect(education.institution).toBe("")
    expect(education.qualification).toBe("")
  })
})
