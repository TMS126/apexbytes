// components/tools/intake-form.tsx
"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import type { CSSProperties, FormEvent } from "react"
import { PaperPlaneTilt, FileArrowUp, CheckCircle, DownloadSimple } from "@phosphor-icons/react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BIZ, HUB_HEX_COLORS, HUB_ON_COLOR, waChatLink } from "@/lib/brand"
import { HUBS } from "@/lib/data"
import { HUB_ORDER } from "@/components/quote-calculator/lib"
import { ToolBackLink } from "@/components/tools/tool-back-link"
import { ToolHelpAccordion } from "@/components/tools/tool-help-accordion"
import { DatePicker, formatPickerValue, todayValue } from "./date-picker"
import { SERVICE_OPTIONS, buildIntakeFields, displayFieldValue, type Field } from "./intake-fields"
import { buildIntakePdf } from "./intake-pdf"

const INTAKE_HELP = [
  { question: "Why do I choose a service first?", answer: "Choosing a service lets us show only the questions needed for that request, keeping the form shorter and easier to complete." },
  { question: "Which fields are required?", answer: "Required fields are marked with an asterisk. We will highlight anything missing or incorrect before you can review your request." },
  { question: "Can I review the details before sending them?", answer: "Yes. After reviewing your request, you can download or share a fillable PDF, or send the details to ApexBytesHub on WhatsApp." },
  { question: "My phone does not let me edit the PDF. Why?", answer: "Some built-in phone PDF viewers cannot edit form fields. Open the PDF in Adobe Acrobat Reader or Google Drive to edit it, or send your details on WhatsApp instead." },
  { question: "Is my information sent automatically?", answer: "No. You choose whether to download, share, or send your completed details. The form does not send anything without your action." },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Theme = { accent: string; onAccent: string }
type Notice = { tone: "error" | "info"; text: string }

function validateFields(fields: Field[], values: Record<string, string>): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const field of fields) {
    const value = (values[field.id] ?? "").trim()
    if (field.required && !value) {
      errors[field.id] = "This field is required."
      continue
    }
    if (!value) continue
    if (field.type === "email" && !EMAIL_PATTERN.test(value)) errors[field.id] = "Enter a valid email address."
    else if (field.type === "tel" && value.replace(/\D/g, "").length < 9) errors[field.id] = "Enter a valid phone number."
  }
  return errors
}

function fieldDisplay(field: Field, values: Record<string, string>): string {
  const raw = values[field.id] ?? ""
  return field.type === "date" ? formatPickerValue(raw, "day") : displayFieldValue(raw)
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "")
  return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)]
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.rel = "noopener"
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

function InputField({ field, value, error, theme, onChange }: { field: Field; value: string; error?: string; theme: Theme; onChange: (value: string) => void }) {
  const selectedOptions = value ? value.split("||").filter(Boolean) : []
  const toggleOption = (option: string) => {
    if (field.control === "radio-group") {
      onChange(option)
      return
    }
    onChange(selectedOptions.includes(option) ? selectedOptions.filter((item) => item !== option).join("||") : [...selectedOptions, option].join("||"))
  }
  const labelText = `${field.label}${field.required ? " *" : ""}`
  const validClass = value.trim() && !error ? "intake-control-valid" : ""
  const invalid = error ? true : undefined
  const errorNode = error ? <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-300" role="alert">{error}</p> : null
  const controlBase = "intake-control w-full px-1 py-2 text-left text-sm text-foreground focus-visible:outline-none"

  if (field.type === "date") {
    const today = todayValue("day")
    return (
      <div className="intake-field">
        <label htmlFor={field.id} className="intake-field-label">{labelText}</label>
        <DatePicker
          id={field.id}
          value={value}
          onChange={onChange}
          variant="line"
          invalid={Boolean(error)}
          placeholder={field.placeholder}
          min={field.dateRule === "future" ? today : undefined}
          max={field.dateRule === "past" ? today : undefined}
          minYear={field.dateRule === "past" ? 1930 : undefined}
          initialView={field.initialView}
          accent={theme.accent}
          onAccent={theme.onAccent}
        />
        {errorNode}
      </div>
    )
  }

  if (field.control === "select") {
    return (
      <div className="intake-field">
        <label htmlFor={field.id} className="intake-field-label">{labelText}</label>
        <select id={field.id} value={value} aria-invalid={invalid} onChange={(event) => onChange(event.target.value)} className={`${controlBase} ${validClass}`}>
          <option value="">{field.placeholder}</option>
          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        {errorNode}
      </div>
    )
  }

  if (field.control) {
    return (
      <div className="intake-field sm:col-span-2">
        <fieldset id={field.id} tabIndex={-1} className="text-left outline-none">
          <legend className="intake-field-label">{labelText}</legend>
          <div className="intake-choice-grid">
            {field.options?.map((option) => {
              const checked = field.control === "radio-group" ? value === option : selectedOptions.includes(option)
              return (
                <label key={option} className="intake-choice-row">
                  <input
                    type={field.control === "radio-group" ? "radio" : "checkbox"}
                    name={field.id}
                    value={option}
                    checked={checked}
                    onChange={() => toggleOption(option)}
                    className="size-4 accent-[var(--brand-orange)]"
                  />
                  <span>{option}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
        {errorNode}
      </div>
    )
  }

  return (
    <div className={`intake-field ${field.multiline ? "sm:col-span-2" : ""}`}>
      <label htmlFor={field.id} className="intake-field-label">{labelText}</label>
      {field.multiline ? (
        <textarea id={field.id} aria-invalid={invalid} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} rows={4} className={`${controlBase} min-h-24 placeholder:text-muted-foreground ${validClass}`} />
      ) : (
        <input id={field.id} aria-invalid={invalid} type={field.type ?? "text"} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} className={`${controlBase} placeholder:text-muted-foreground ${validClass}`} />
      )}
      {errorNode}
    </div>
  )
}

function ToolShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-6xl px-5 pb-20 pt-[calc(var(--nav-h)+2.5rem)] text-center md:px-8">
        <ToolBackLink />
        <div className="mx-auto mb-9 max-w-3xl"><h1 className="abh-page-title mb-3">{title}</h1></div>
        {children}
        <ToolHelpAccordion title="Intake Form help" items={INTAKE_HELP} />
      </main>
      <Footer />
    </div>
  )
}

export function IntakeTool() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [attempted, setAttempted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState<"download" | "share" | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null)

  const selected = SERVICE_OPTIONS.find((option) => option.value === values.service)
  const fields = useMemo(() => buildIntakeFields(selected), [selected])
  const errors = useMemo(() => validateFields(fields, values), [fields, values])

  useEffect(() => {
    return () => {
      if (fallbackUrl) URL.revokeObjectURL(fallbackUrl)
    }
  }, [fallbackUrl])

  const theme: Theme = selected
    ? { accent: `var(--hub-${selected.hubId}-primary)`, onAccent: HUB_ON_COLOR[selected.hubId] }
    : { accent: "var(--brand-orange)", onAccent: "var(--on-brand-orange)" }

  const wrapperStyle: CSSProperties | undefined = selected
    ? ({
        "--line-rule": theme.accent,
        "--form-rule": theme.accent,
        "--brand-orange": theme.accent,
        "--cta-action": theme.accent,
      } as CSSProperties)
    : undefined
  const tint = selected ? { background: `color-mix(in srgb, ${theme.accent} 10%, transparent)` } : undefined

  const setField = (id: string, value: string) => setValues((current) => ({ ...current, [id]: value }))

  const chooseService = (value: string) => {
    setValues({ service: value })
    setAttempted(false)
    setSubmitted(false)
    setNotice(null)
    setFallbackUrl(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const missingIds = Object.keys(errors)
    setAttempted(true)
    if (missingIds.length > 0) {
      setSubmitted(false)
      setNotice({ tone: "error", text: `Please fix the ${missingIds.length} highlighted field${missingIds.length === 1 ? "" : "s"} before reviewing.` })
      const first = fields.find((field) => errors[field.id])
      if (first) {
        window.requestAnimationFrame(() => {
          const element = document.getElementById(first.id)
          element?.scrollIntoView({ behavior: "smooth", block: "center" })
          element?.focus({ preventScroll: true })
        })
      }
      return
    }
    setNotice(null)
    setSubmitted(true)
    window.requestAnimationFrame(() => document.getElementById("intake-review")?.scrollIntoView({ behavior: "smooth", block: "start" }))
  }

  const pdfName = selected
    ? `apexbyteshub-${selected.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-intake-form.pdf`
    : "apexbyteshub-intake-form.pdf"

  const makePdf = () => {
    if (!selected) throw new Error("No service selected")
    return buildIntakePdf({
      values,
      serviceLabel: selected.label,
      hubTitle: HUBS[selected.hubId].title,
      fields,
      accent: hexToRgb(HUB_HEX_COLORS[selected.hubId].primary),
    })
  }

  const downloadPdf = async () => {
    if (!selected || busy) return
    setBusy("download")
    setNotice(null)
    try {
      const { blob, fillable } = await makePdf()
      saveBlob(blob, pdfName)
      setFallbackUrl(URL.createObjectURL(blob))
      setNotice({
        tone: "info",
        text: fillable
          ? "Your PDF is ready. Check your Downloads folder, or tap “Open PDF” below."
          : "Your PDF is ready in printable form (editable fields were not available on this device). Check your Downloads folder, or tap “Open PDF” below.",
      })
    } catch (error) {
      console.error(error)
      setNotice({ tone: "error", text: "The PDF could not be created on this device. Please use “Send details on WhatsApp” instead." })
    } finally {
      setBusy(null)
    }
  }

  const sharePdf = async () => {
    if (!selected || busy) return
    setBusy("share")
    setNotice(null)
    try {
      const { blob } = await makePdf()
      const file = new File([blob], pdfName, { type: "application/pdf" })
      const canShareFiles = typeof navigator.share === "function" && (typeof navigator.canShare !== "function" || navigator.canShare({ files: [file] }))
      if (canShareFiles) {
        try {
          await navigator.share({ title: `${BIZ.name} service intake`, text: `Service intake for ${selected.label}`, files: [file] })
          return
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return
          throw error
        }
      }
      saveBlob(blob, pdfName)
      setFallbackUrl(URL.createObjectURL(blob))
      setNotice({ tone: "info", text: "Sharing files is not supported in this browser, so the PDF was downloaded instead." })
    } catch (error) {
      console.error(error)
      setNotice({ tone: "error", text: "The PDF could not be shared. Please try “Download fillable PDF” or WhatsApp." })
    } finally {
      setBusy(null)
    }
  }

  const whatsappHref = selected
    ? waChatLink(
        selected.label,
        fields
          .filter((field) => (values[field.id] ?? "").trim())
          .map((field) => `${field.label}: ${fieldDisplay(field, values)}`)
          .join("\n")
      )
    : "#"

  const solidButton = "inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
  const solidStyle: CSSProperties = { backgroundColor: theme.accent, color: theme.onAccent }

  return (
    <ToolShell title="Tell us what you need">
      <div style={wrapperStyle}>
        <div className="intake-document mx-auto max-w-5xl p-5 text-left md:p-8">
          <div className="intake-document-header" style={tint}>
            <div>
              <p className="intake-brand-line" style={selected ? { color: theme.accent } : undefined}>A P E X B Y T E S H U B</p>
              <p className="intake-brand-tagline">DESIGN · PRINT · UPGRADE</p>
            </div>
            <div className="intake-contact-line">WhatsApp &amp; enquiries: {BIZ.whatsappPhone}</div>
          </div>
          <div className="intake-document-title-row">
            <div>
              <h2 className="intake-document-title">{selected ? `${selected.label} Intake Form` : "Client Service Intake Form"}</h2>
              <p className="intake-document-note">Please complete the form clearly. Fields marked * are required.</p>
            </div>
            <label htmlFor="service" className="intake-service-picker">
              <span>Service *</span>
              <select id="service" className={values.service ? "intake-control-valid" : ""} value={values.service ?? ""} onChange={(event) => chooseService(event.target.value)}>
                <option value="">Select a service</option>
                {HUB_ORDER.map((hubId) => (
                  <optgroup key={hubId} label={HUBS[hubId].title}>
                    {SERVICE_OPTIONS.filter((option) => option.hubId === hubId).map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>

          {selected && (
            <form noValidate onSubmit={handleSubmit} className="intake-form-grid mt-7">
              <div className="intake-selected-service sm:col-span-2" style={{ borderLeftColor: theme.accent, ...tint }}>
                <strong>Selected service:</strong> {selected.label} <span>· {selected.sectionTitle}</span>
              </div>
              {fields.map((field, index) => {
                const startsSection = field.section && field.section !== fields[index - 1]?.section
                return (
                  <Fragment key={`${selected.value}-${field.id}`}>
                    {startsSection && (
                      <>
                        <h2 className="intake-section-heading sm:col-span-2" style={{ borderTopColor: theme.accent, color: theme.accent }}>{field.section}</h2>
                        {field.section === "Client self-service authorisation" && (
                          <p className="intake-authorisation sm:col-span-2">I confirm the details above are accurate and belong to me. I authorise ApexBytesHub to assist while I am present to verify entries and approve any SARS One-Time PINs (OTPs).</p>
                        )}
                      </>
                    )}
                    <InputField field={field} value={values[field.id] ?? ""} error={attempted ? errors[field.id] : undefined} theme={theme} onChange={(value) => setField(field.id, value)} />
                  </Fragment>
                )
              })}
              <button type="submit" style={solidStyle} className={`intake-review-button sm:col-span-2 font-bold ${solidButton} min-h-12 px-6`}>
                <CheckCircle size={19} aria-hidden="true" />
                <span>Review my request</span>
              </button>
            </form>
          )}
        </div>

        {notice && (
          <p className={`mx-auto mt-4 max-w-3xl text-sm font-medium ${notice.tone === "error" ? "text-red-600 dark:text-red-300" : "text-foreground"}`} role={notice.tone === "error" ? "alert" : "status"}>
            {notice.text}{" "}
            {notice.tone === "info" && fallbackUrl && (
              <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Open PDF</a>
            )}
          </p>
        )}

        {submitted && selected && (
          <section id="intake-review" className="abh-card mt-8 p-5 text-center md:p-8" aria-live="polite">
            <h2 className="text-2xl font-semibold" style={{ color: theme.accent }}>{selected.label}</h2>
            <dl className="mt-6 grid gap-4 text-center sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.id}>
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{field.label}</dt>
                  <dd className="mt-1 whitespace-pre-line break-words text-sm text-foreground">{fieldDisplay(field, values) || "Not provided"}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => void downloadPdf()} disabled={busy !== null} style={solidStyle} className={solidButton}>
                <DownloadSimple size={18} aria-hidden="true" />
                <span>{busy === "download" ? "Preparing PDF…" : "Download fillable PDF"}</span>
              </button>
              <button type="button" data-no-lift onClick={() => void sharePdf()} disabled={busy !== null} className="inline-flex min-h-11 items-center justify-center gap-2 bg-muted px-4 py-2.5 text-sm font-semibold text-foreground disabled:opacity-60">
                <FileArrowUp size={18} aria-hidden="true" />
                <span>{busy === "share" ? "Preparing PDF…" : "Share PDF"}</span>
              </button>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[14px] bg-[var(--brand-whatsapp)] px-4 py-2.5 text-sm font-semibold text-[var(--on-whatsapp)]">
                <PaperPlaneTilt size={18} aria-hidden="true" />
                <span>Send details on WhatsApp</span>
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">The PDF has editable fields. If your phone viewer cannot edit them, open it in Adobe Acrobat Reader or Google Drive before sending it to ApexBytesHub.</p>
          </section>
        )}
      </div>
    </ToolShell>
  )
}
