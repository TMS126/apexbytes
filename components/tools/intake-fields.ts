// components/tools/intake-fields.ts
import { HUBS } from "@/lib/data"
import { HUB_ORDER } from "@/components/quote-calculator/lib"
import { SERVICE_SCHEMAS } from "./intake-schemas"
import { visibleFields, type Field, type ServiceOption } from "./intake-types"

export type { Field, ServiceOption }
export { visibleFields }

export const SERVICE_OPTIONS: ServiceOption[] = HUB_ORDER.flatMap((hubId) =>
  HUBS[hubId].sections.flatMap((section) =>
    section.items.map((item) => ({
      value: `${hubId}|${section.title}|${item.name}`,
      label: item.name,
      hubId,
      sectionTitle: section.title,
      description: item.description,
      requirements: item.requirements,
      tips: item.tips,
    }))
  )
)

export function displayFieldValue(value: string) {
  return value.replaceAll("||", ", ")
}

/**
 * Every live service has an explicit schema keyed by hub, section and service
 * name. There is no regex routing. The fallback only protects a future service
 * added to the catalog before its schema is written; it is intentionally plain
 * and is covered by a test that fails when any live service is missing.
 */
const GENERIC_FALLBACK: Field[] = [
  { id: "fullName", label: "Full name", placeholder: "Your full name", required: true },
  { id: "phone", label: "WhatsApp number", placeholder: "Number we can reach you on", required: true, type: "tel" },
  { id: "email", label: "Email address", placeholder: "Optional email", type: "email" },
  { id: "details", label: "What do you need?", placeholder: "Tell us what you need help with, in your own words.", required: true, multiline: true },
  { id: "deadline", label: "When do you need it?", placeholder: "Choose a date", type: "date", dateRule: "future" },
]

export function buildIntakeFields(selected: ServiceOption | undefined): Field[] {
  if (!selected) return []
  const schema = SERVICE_SCHEMAS[selected.value]
  if (schema) return schema.fields
  if (process.env.NODE_ENV !== "production") {
    console.error(`Missing intake schema for service: ${selected.value}`)
  }
  return GENERIC_FALLBACK
}

/** Fields that should be validated, rendered, reviewed and exported right now. */
export function activeIntakeFields(selected: ServiceOption | undefined, values: Record<string, string>): Field[] {
  return visibleFields(buildIntakeFields(selected), values)
}
