import { describe, expect, it } from "vitest"
import { SERVICE_OPTIONS, buildIntakeFields } from "./intake-fields"
import { SERVICE_SCHEMAS } from "./intake-schemas"
import { isFieldVisible, visibleFields, type Field } from "./intake-types"

const liveKeys = SERVICE_OPTIONS.map((service) => service.value)
const schemaKeys = Object.keys(SERVICE_SCHEMAS)

describe("intake service schemas", () => {
  it("has an explicit schema for every live service", () => {
    const missing = liveKeys.filter((key) => !schemaKeys.includes(key))
    expect(missing).toEqual([])
    expect(schemaKeys).toHaveLength(79)
  })

  it("does not contain orphan schemas for services that are not live", () => {
    const orphans = schemaKeys.filter((key) => !liveKeys.includes(key))
    expect(orphans).toEqual([])
  })

  it("has no duplicate field ids inside a service", () => {
    for (const key of liveKeys) {
      const ids = buildIntakeFields(SERVICE_OPTIONS.find((service) => service.value === key)).map((field) => field.id)
      expect(new Set(ids).size, `${key} has a duplicate field id`).toBe(ids.length)
    }
  })

  it("keeps each live service on its own schema rather than a shared regex bucket", () => {
    const shapes = new Set(liveKeys.map((key) => JSON.stringify(buildIntakeFields(SERVICE_OPTIONS.find((service) => service.value === key)))))
    expect(shapes.size).toBe(liveKeys.length)
  })

  it("gives every service a required contact and request field", () => {
    for (const key of liveKeys) {
      const fields = buildIntakeFields(SERVICE_OPTIONS.find((service) => service.value === key))
      expect(fields.some((field) => field.required && /name/i.test(field.id)), `${key} needs a required name field`).toBe(true)
      expect(fields.some((field) => field.required && /phone|whatsapp|contact/i.test(field.id)), `${key} needs a required contact field`).toBe(true)
    }
  })
})

describe("intake conditional visibility", () => {
  const fields: Field[] = [
    { id: "kind", label: "Kind", placeholder: "", required: true, control: "select", options: ["A", "B"] },
    { id: "detailA", label: "Detail A", placeholder: "", showWhen: { field: "kind", equals: "A" } },
    { id: "detailB", label: "Detail B", placeholder: "", showWhen: { field: "kind", notEquals: "A" } },
    { id: "many", label: "Many", placeholder: "", showWhen: { field: "services", includes: "passport" } },
  ]

  it("shows equals and notEquals branches correctly", () => {
    const a = visibleFields(fields, { kind: "A" }).map((field) => field.id)
    const b = visibleFields(fields, { kind: "B" }).map((field) => field.id)
    expect(a).toContain("detailA")
    expect(a).not.toContain("detailB")
    expect(b).toContain("detailB")
    expect(b).not.toContain("detailA")
  })

  it("supports multi-select includes values", () => {
    expect(isFieldVisible(fields[3], { services: "id||passport" })).toBe(true)
    expect(isFieldVisible(fields[3], { services: "id" })).toBe(false)
  })

  it("hides every dependent field when the parent is empty", () => {
    expect(visibleFields(fields, {}).map((field) => field.id)).toEqual(["kind"])
  })
})
