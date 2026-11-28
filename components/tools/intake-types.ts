// components/tools/intake-types.ts
import type { HubId } from "@/lib/data/types"

export type FieldType = "text" | "email" | "tel" | "date" | "number"
export type FieldControl = "text" | "select" | "checkbox-group" | "radio-group"

/**
 * A field is only shown when its parent answer matches. This keeps each
 * service form short while still allowing follow-up questions.
 */
export type FieldVisibility = {
  field: string
  equals?: string
  includes?: string
  notEquals?: string
}

export type Field = {
  id: string
  label: string
  placeholder: string
  required?: boolean
  multiline?: boolean
  type?: FieldType
  control?: FieldControl
  options?: string[]
  section?: string
  help?: string
  showWhen?: FieldVisibility
  /** Date fields only: "past" blocks future dates, "future" blocks past dates. */
  dateRule?: "past" | "future"
  /** Date fields only: "YYYY-MM" month the calendar opens on. */
  initialView?: string
}

export type ServiceOption = {
  value: string
  label: string
  hubId: HubId
  sectionTitle: string
  description?: string
  requirements: string[]
  tips?: string[]
}

export type ServiceSchema = {
  key?: string
  intro: string
  fields: Field[]
}

export function isFieldVisible(field: Field, values: Record<string, string>): boolean {
  const rule = field.showWhen
  if (!rule) return true
  const raw = values[rule.field] ?? ""
  if (!raw) return false
  if (rule.equals !== undefined && raw !== rule.equals) return false
  if (rule.notEquals !== undefined && raw === rule.notEquals) return false
  if (rule.includes !== undefined && !raw.split("||").filter(Boolean).includes(rule.includes)) return false
  return true
}

export function visibleFields(fields: Field[], values: Record<string, string>): Field[] {
  return fields.filter((field) => isFieldVisible(field, values))
}
