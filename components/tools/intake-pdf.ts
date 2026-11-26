// components/tools/intake-pdf.ts
import { BIZ } from "@/lib/brand"
import { displayFieldValue, type Field } from "./intake-fields"
import { formatPickerValue } from "./date-picker"

type LooseField = Record<string, unknown>
type PdfWithForm = {
  AcroForm?: { TextField?: new () => LooseField }
  addField?: (field: LooseField) => void
}

export type IntakePdfInput = {
  values: Record<string, string>
  serviceLabel: string
  hubTitle: string
  fields: Field[]
  /** RGB 0-255 used for the header band. */
  accent: [number, number, number]
}

export type IntakePdfResult = { blob: Blob; fillable: boolean }

const REPLACEMENTS: Array<[RegExp, string]> = [
  [/[‘’]/g, "'"],
  [/[“”]/g, '"'],
  [/[–—]/g, "-"],
  [/…/g, "..."],
  [/•/g, "-"],
  [/\u00A0/g, " "],
]

/** jsPDF's built-in fonts only support Latin-1, so anything else becomes "?". */
function pdfSafe(text: string): string {
  let out = text
  for (const [pattern, replacement] of REPLACEMENTS) out = out.replace(pattern, replacement)
  return out.replace(/[^\n\x20-\x7E\xA1-\xFF]/g, "?")
}

function valueText(field: Field, values: Record<string, string>): string {
  const raw = values[field.id] ?? ""
  if (field.type === "date") return formatPickerValue(raw, "day")
  return displayFieldValue(raw)
}

async function render(input: IntakePdfInput, fillable: boolean): Promise<Blob> {
  const { jsPDF } = await import("jspdf")
  const pdf = new jsPDF({ unit: "mm", format: "a4" })
  const form = pdf as unknown as PdfWithForm
  const TextField = fillable ? form.AcroForm?.TextField : undefined
  if (fillable && (!TextField || typeof form.addField !== "function")) {
    throw new Error("PDF form fields are not available in this jsPDF build")
  }

  const pageWidth = 210
  const left = 18
  const fieldWidth = pageWidth - left * 2
  let y = 0
  let lastSection = ""

  const drawHeader = () => {
    pdf.setFillColor(input.accent[0], input.accent[1], input.accent[2])
    pdf.rect(0, 0, pageWidth, 26, "F")
    pdf.setTextColor(255, 255, 255)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(16)
    pdf.text(pdfSafe(`${BIZ.name} - Service Intake`), left, 12)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(9.5)
    pdf.text(pdfSafe(`Service: ${input.serviceLabel}  |  ${input.hubTitle}`), left, 19.5)
    pdf.setTextColor(30, 41, 59)
    y = 36
    lastSection = ""
  }
  const ensureSpace = (height: number) => {
    if (y + height > 280) {
      pdf.addPage()
      y = 18
      lastSection = ""
    }
  }

  drawHeader()

  input.fields.forEach((field, index) => {
    if (field.section && field.section !== lastSection) {
      ensureSpace(14)
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(10)
      pdf.setTextColor(input.accent[0], input.accent[1], input.accent[2])
      pdf.text(pdfSafe(field.section), left, y)
      pdf.setTextColor(30, 41, 59)
      y += 6
      lastSection = field.section
    }

    const height = field.multiline ? 18 : 9
    ensureSpace(height + 10)
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(8.5)
    pdf.setTextColor(70, 80, 95)
    pdf.text(pdfSafe(`${field.label}${field.required ? " *" : ""}`), left, y)
    y += 2

    const text = pdfSafe(valueText(field, input.values))
    if (TextField && form.addField) {
      const formField = new TextField()
      formField.fieldName = `intake_${index}_${field.id}`
      formField.x = left
      formField.y = y
      formField.width = fieldWidth
      formField.height = height
      formField.fontName = "helvetica"
      formField.fontSize = 9
      formField.required = Boolean(field.required)
      formField.multiline = Boolean(field.multiline)
      formField.value = text
      formField.defaultValue = text
      form.addField(formField)
    } else {
      pdf.setDrawColor(190, 198, 208)
      pdf.rect(left, y, fieldWidth, height)
      pdf.setTextColor(20, 30, 45)
      pdf.setFontSize(9)
      const lines = pdf.splitTextToSize(text || " ", fieldWidth - 4) as string[]
      pdf.text(lines.slice(0, field.multiline ? 4 : 1), left + 2, y + 5.5)
    }
    pdf.setTextColor(30, 41, 59)
    y += height + 6
  })

  ensureSpace(8)
  pdf.setFont("helvetica", "italic")
  pdf.setFontSize(8)
  pdf.setTextColor(90, 100, 115)
  pdf.text("Please review the completed fields before sending this form to ApexBytesHub.", left, y)
  return pdf.output("blob")
}

/**
 * Builds the intake PDF. Tries a fillable (AcroForm) PDF first; if that fails on this
 * device or jsPDF build, it falls back to a printable PDF with the same answers.
 */
export async function buildIntakePdf(input: IntakePdfInput): Promise<IntakePdfResult> {
  try {
    return { blob: await render(input, true), fillable: true }
  } catch (error) {
    console.error("Fillable PDF failed, building a printable PDF instead", error)
    return { blob: await render(input, false), fillable: false }
  }
}
