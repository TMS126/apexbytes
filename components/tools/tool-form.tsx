"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, PaperPlaneTilt, FileArrowUp, WhatsappLogo, CheckCircle, DownloadSimple } from "@phosphor-icons/react"
import { jsPDF } from "jspdf"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageScrollControls } from "@/components/page-scroll-controls"
import { PageNoticeBell } from "@/components/page-notice-bell"
import { BIZ, waChatLink } from "@/lib/brand"
import { HUBS } from "@/lib/data"
import { HUB_ORDER } from "@/components/quote-calculator/lib"

type ToolMode = "cv" | "intake"
type CvTemplate = "modern" | "classic"

type Field = {
  id: string
  label: string
  placeholder: string
  required?: boolean
  multiline?: boolean
  type?: "text" | "email" | "tel" | "date"
}

const SERVICE_OPTIONS = HUB_ORDER.flatMap((hubId) =>
  HUBS[hubId].sections.flatMap((section) =>
    section.items.map((item) => ({
      value: `${hubId}|${section.title}|${item.name}`,
      label: item.name,
      hubId,
      sectionTitle: section.title,
    }))
  )
)

const CV_FIELDS: Field[] = [
  { id: "fullName", label: "Full name", placeholder: "e.g. Thabo Mokoena", required: true },
  { id: "professionalTitle", label: "Professional title", placeholder: "e.g. Office Administrator", required: true },
  { id: "phone", label: "Phone number", placeholder: "Your best contact number", required: true, type: "tel" },
  { id: "email", label: "Email address", placeholder: "you@example.com", type: "email" },
  { id: "location", label: "Location", placeholder: "Town, province" },
  { id: "website", label: "LinkedIn or portfolio", placeholder: "Optional link" },
  { id: "profile", label: "Professional summary", placeholder: "A short, confident introduction about your experience and goals.", multiline: true },
  { id: "experience", label: "Work experience", placeholder: "Role — Employer — Dates\nKey responsibility or achievement", multiline: true },
  { id: "education", label: "Education", placeholder: "Qualification — Institution — Year", multiline: true },
  { id: "skills", label: "Skills", placeholder: "Customer service, MS Word, cash handling...", multiline: true },
  { id: "certifications", label: "Certificates and achievements", placeholder: "Optional certificates, awards or short courses", multiline: true },
  { id: "languages", label: "Languages", placeholder: "English, Setswana, Afrikaans..." },
  { id: "references", label: "References", placeholder: "Available on request, or add contact details", multiline: true },
]

const INTAKE_BASE_FIELDS: Field[] = [
  { id: "fullName", label: "Full name", placeholder: "Your full name", required: true },
  { id: "phone", label: "Phone number", placeholder: "Your WhatsApp number", required: true, type: "tel" },
  { id: "email", label: "Email address", placeholder: "Optional email", type: "email" },
  { id: "deadline", label: "When do you need it?", placeholder: "Choose a date", type: "date" },
  { id: "details", label: "What should we know?", placeholder: "Tell us what you need help with, in your own words.", required: true, multiline: true },
]

function serviceFields(selected: (typeof SERVICE_OPTIONS)[number] | undefined): Field[] {
  if (!selected) return []
  const name = selected.label.toLowerCase()
  if (/print|copy|laminat|photo|scan/.test(name)) return [
    { id: "quantity", label: "Quantity or number of pages", placeholder: "e.g. 20 pages" },
    { id: "fileNote", label: "File or paper details", placeholder: "Colour, paper size, single/double-sided, etc.", multiline: true },
  ]
  if (/cv|typing|document|letter|form/.test(name)) return [
    { id: "fileNote", label: "What will you bring or send?", placeholder: "USB, WhatsApp photos, handwritten notes, existing document...", multiline: true },
    { id: "format", label: "Preferred format", placeholder: "Word, PDF, printed copy, or not sure" },
  ]
  if (/logo|design|flyer|business|social|invitation/.test(name)) return [
    { id: "style", label: "Style or colours", placeholder: "Describe the look you want" },
    { id: "fileNote", label: "Reference or content", placeholder: "Business name, wording, logo files, examples...", multiline: true },
  ]
  if (/application|sassa|sars|nsfas|online|email|website/.test(name)) return [
    { id: "platform", label: "Platform or application", placeholder: "Which website, form or account?" },
    { id: "fileNote", label: "Documents you have ready", placeholder: "ID, proof of address, certificates, login details, etc.", multiline: true },
  ]
  if (/computer|pc|windows|software|setup|repair|tech/.test(name)) return [
    { id: "device", label: "Device and problem", placeholder: "e.g. HP laptop — slow and cannot connect to Wi-Fi", multiline: true },
    { id: "fileNote", label: "Anything else we should know?", placeholder: "Error messages, deadline, accessories, etc.", multiline: true },
  ]
  return [{ id: "fileNote", label: "Helpful details or files", placeholder: "Add anything that will help us prepare.", multiline: true }]
}

function updateValue(setValues: React.Dispatch<React.SetStateAction<Record<string, string>>>, id: string, value: string) {
  setValues((current) => ({ ...current, [id]: value }))
}

function InputField({ field, value, onChange }: { field: Field; value: string; onChange: (value: string) => void }) {
  return (
    <div className={field.multiline ? "sm:col-span-2" : ""}>
      <label htmlFor={field.id} className="mb-1.5 block text-sm font-semibold text-foreground">
        {field.label}{field.required ? " *" : ""}
      </label>
      {field.multiline ? (
        <textarea id={field.id} required={field.required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} rows={4} className="w-full rounded-[14px] bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      ) : (
        <input id={field.id} required={field.required} type={field.type ?? "text"} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} className="w-full rounded-[14px] bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      )}
    </div>
  )
}

function CvPreview({ values, template, photo }: { values: Record<string, string>; template: CvTemplate; photo: string | null }) {
  const section = (title: string, value?: string) => value ? <section className="mt-6"><h3 className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[var(--cv-accent)]">{title}</h3><p className="whitespace-pre-line text-sm leading-6 text-slate-700">{value}</p></section> : null
  const modern = template === "modern"
  return (
    <article className={`cv-preview mx-auto w-full max-w-[820px] overflow-hidden bg-white text-slate-900 shadow-xl ${modern ? "rounded-[10px]" : "rounded-none"}`}>
      <div className={modern ? "grid md:grid-cols-[0.32fr_0.68fr]" : ""}>
        {modern && <aside className="bg-slate-950 p-7 text-white md:min-h-[740px]">
          {photo ? <Image unoptimized src={photo} alt="Profile" width={112} height={112} className="mb-6 size-28 rounded-full object-cover ring-4 ring-white/15" /> : <div className="mb-6 flex size-28 items-center justify-center rounded-full bg-white/10 text-3xl font-semibold">{values.fullName?.slice(0, 1) || "A"}</div>}
          <h2 className="text-xl font-semibold">{values.fullName || "Your name"}</h2>
          <p className="mt-1 text-sm text-white/65">{values.professionalTitle || "Professional title"}</p>
          <div className="mt-8 space-y-3 text-xs text-white/70"><p>{values.phone}</p><p>{values.email}</p><p>{values.location}</p><p>{values.website}</p></div>
          {section("Skills", values.skills)}
          {section("Languages", values.languages)}
        </aside>}
        <div className={modern ? "p-7 md:p-10" : "p-8 md:p-12"} style={{ ["--cv-accent" as string]: modern ? "#1e6fa8" : "#0f172a" }}>
          {!modern && <div className="mb-8 flex items-start justify-between gap-5 border-b-2 border-slate-900 pb-5">{photo ? <Image unoptimized src={photo} alt="Profile" width={96} height={96} className="size-24 rounded object-cover" /> : <div />}{<div className="text-right"><h2 className="text-3xl font-bold tracking-tight">{values.fullName || "Your name"}</h2><p className="mt-1 text-base text-slate-600">{values.professionalTitle || "Professional title"}</p></div>}</div>}
          {modern && <header className="border-b border-slate-200 pb-5"><h1 className="text-3xl font-bold tracking-tight">{values.fullName || "Your name"}</h1><p className="mt-1 text-base text-slate-600">{values.professionalTitle || "Professional title"}</p></header>}
          {section("Professional summary", values.profile)}
          {section("Work experience", values.experience)}
          {section("Education", values.education)}
          {section("Certificates and achievements", values.certifications)}
          {!modern && section("Skills", values.skills)}
          {section("References", values.references)}
        </div>
      </div>
    </article>
  )
}

function buildIntakePdf(values: Record<string, string>, selectedLabel: string) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" })
  const lines = [`${BIZ.name} — Service Intake`, `Service: ${selectedLabel}`, "", ...Object.entries(values).filter(([, value]) => value.trim()).map(([key, value]) => `${key.replace(/([A-Z])/g, " $1")}: ${value}`)]
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(18); pdf.text(lines[0], 18, 22)
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(11)
  let y = 34
  lines.slice(1).forEach((line) => { const wrapped = pdf.splitTextToSize(line, 174); pdf.text(wrapped, 18, y); y += wrapped.length * 6 + 2; if (y > 275) { pdf.addPage(); y = 22 } })
  return pdf.output("blob")
}

function CvTool() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [template, setTemplate] = useState<CvTemplate>("modern")
  const [photo, setPhoto] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handlePhoto = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null)
    reader.readAsDataURL(file)
  }
  const shareDetails = () => {
    const summary = CV_FIELDS.map((field) => `${field.label}: ${values[field.id] || "Not provided"}`).join("\n")
    window.open(waChatLink("CV Writing / CV Typing", `${summary}\nTemplate: ${template}\nPhoto: ${photo ? "Included" : "Not included"}`), "_blank", "noopener,noreferrer")
  }

  return <ToolShell eyebrow="ApexBytesHub Tools · CV Writing" title="Build a CV that feels like you" description="Add your details, choose a layout, and review a clean on-screen preview before sending it to us. Nothing is downloaded from this tool.">
    <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }} className="abh-card grid gap-6 p-5 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="mb-2 block text-sm font-semibold">Layout</label><div className="grid grid-cols-2 gap-2">{(["modern", "classic"] as CvTemplate[]).map((option) => <button type="button" key={option} onClick={() => setTemplate(option)} className={`rounded-[14px] px-4 py-3 text-sm font-semibold ${template === option ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{option === "modern" ? "Modern" : "Classic"}<span className="mt-1 block text-xs font-normal opacity-75">{option === "modern" ? "Clean sidebar" : "Traditional"}</span></button>)}</div></div>
        <div><label className="mb-2 block text-sm font-semibold">Profile photo</label><label className="flex min-h-[76px] cursor-pointer items-center gap-3 rounded-[14px] bg-background px-4 py-3 text-sm text-muted-foreground"><FileArrowUp size={22} /><span>{photo ? "Photo selected — choose another" : "Optional photo — JPG or PNG"}</span><input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => handlePhoto(event.target.files?.[0])} /></label></div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{CV_FIELDS.map((field) => <InputField key={field.id} field={field} value={values[field.id] ?? ""} onChange={(value) => updateValue(setValues, field.id, value)} />)}</div>
      <button type="submit" className="abh-btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-bold"><CheckCircle size={19} /> Review my CV</button>
    </form>
    {submitted && <section className="mt-10" aria-live="polite"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="abh-eyebrow">On-page preview</p><h2 className="text-2xl font-semibold">Your {template === "modern" ? "modern" : "classic"} CV</h2></div><button type="button" onClick={shareDetails} className="abh-btn-primary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"><WhatsappLogo size={18} /> Send to ApexBytesHub</button></div><CvPreview values={values} template={template} photo={photo} /><p className="mt-4 text-center text-sm text-muted-foreground">This is a visual review only. We can polish, format, and prepare the final version with you.</p></section>}
  </ToolShell>
}

function IntakeTool() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const selected = SERVICE_OPTIONS.find((option) => option.value === values.service)
  const fields = useMemo(() => selected ? [...INTAKE_BASE_FIELDS.slice(0, 3), ...serviceFields(selected), ...INTAKE_BASE_FIELDS.slice(3)] : [], [selected])
  const sharePdf = async () => {
    if (!selected) return
    const blob = buildIntakePdf(values, selected.label)
    const file = new File([blob], "apexbyteshub-service-intake.pdf", { type: "application/pdf" })
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      await navigator.share({ title: `${BIZ.name} service intake`, text: `Service intake for ${selected.label}`, files: [file] })
      return
    }
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank", "noopener,noreferrer")
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }
  const shareText = () => {
    if (!selected) return
    const summary = fields.map((field) => `${field.label}: ${values[field.id] || "Not provided"}`).join("\n")
    window.open(waChatLink(selected.label, summary), "_blank", "noopener,noreferrer")
  }

  return <ToolShell eyebrow="ApexBytesHub Tools · Service Intake" title="Tell us what you need" description="Choose one service first. We will then ask only for the details that help us prepare your request properly.">
    <div className="abh-card p-5 md:p-8">
      <label htmlFor="service" className="mb-2 block text-sm font-semibold text-foreground">1. Choose the service you need *</label>
      <select id="service" required value={values.service ?? ""} onChange={(event) => { setValues({ service: event.target.value }); setSubmitted(false) }} className="w-full rounded-[14px] bg-background px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="">Select a service</option>{HUB_ORDER.map((hubId) => <optgroup key={hubId} label={HUBS[hubId].title}>{SERVICE_OPTIONS.filter((option) => option.hubId === hubId).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</optgroup>)}</select>
      {selected && <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }} className="mt-8 grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2 rounded-[14px] bg-muted/60 px-4 py-3 text-sm text-muted-foreground"><strong className="text-foreground">Selected:</strong> {selected.label} · {selected.sectionTitle}</div>{fields.map((field) => <InputField key={`${selected.value}-${field.id}`} field={field} value={values[field.id] ?? ""} onChange={(value) => updateValue(setValues, field.id, value)} />)}<button type="submit" className="abh-btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-bold sm:col-span-2"><CheckCircle size={19} /> Review my request</button></form>}
    </div>
    {submitted && selected && <section className="mt-8 abh-card p-5 md:p-8" aria-live="polite"><p className="abh-eyebrow mb-2">Review before sending</p><h2 className="text-2xl font-semibold">{selected.label}</h2><dl className="mt-6 grid gap-4 sm:grid-cols-2">{fields.map((field) => <div key={field.id}><dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{field.label}</dt><dd className="mt-1 whitespace-pre-line break-words text-sm text-foreground">{values[field.id] || "Not provided"}</dd></div>)}</dl><div className="mt-7 flex flex-wrap gap-3"><button type="button" onClick={() => void sharePdf()} className="abh-btn-primary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"><DownloadSimple size={18} /> Share / open PDF</button><button type="button" onClick={shareText} className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-whatsapp)] px-4 py-2.5 text-sm font-semibold text-white"><PaperPlaneTilt size={18} /> Send details on WhatsApp</button></div><p className="mt-4 text-sm text-muted-foreground">On phones that support file sharing, the PDF opens directly into your share sheet. On desktop, it opens as a PDF preview ready to forward.</p></section>}
  </ToolShell>
}

function ToolShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <div className="min-h-screen bg-background"><Navbar /><PageNoticeBell page="tools" /><main id="main-content" className="mx-auto w-full max-w-6xl px-5 pb-20 pt-[calc(var(--nav-h)+2.5rem)] md:px-8"><Link href="/tools" className="abh-link-underline mb-7 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft size={17} /> Back to tools</Link><header className="mb-9 max-w-3xl"><p className="abh-eyebrow mb-2">{eyebrow}</p><h1 className="abh-page-title mb-3">{title}</h1><p className="max-w-2xl text-muted-foreground">{description}</p></header>{children}</main><PageScrollControls /><Footer /></div>
}

export function ToolForm({ mode }: { mode: ToolMode }) {
  return mode === "cv" ? <CvTool /> : <IntakeTool />
}
