"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { PaperPlaneTilt, FileArrowUp, WhatsappLogo, CheckCircle, DownloadSimple } from "@phosphor-icons/react"
import { jsPDF } from "jspdf"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageScrollControls } from "@/components/page-scroll-controls"
import { PageNoticeBell } from "@/components/page-notice-bell"
import { BIZ, waChatLink } from "@/lib/brand"
import { HUBS } from "@/lib/data"
import { HUB_ORDER } from "@/components/quote-calculator/lib"
import { ToolBackLink } from "@/components/tools/tool-back-link"

type ToolMode = "cv" | "intake"
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
  if (/sars|tax|efiling|itr12|vat|pay[e|e]|tcs|penalty|compliance|rav01/.test(name)) return [
    { id: "surname", label: "Surname", placeholder: "As shown on your ID or passport", required: true },
    { id: "idOrPassport", label: "RSA ID or passport number", placeholder: "13-digit ID or passport number", required: true },
    { id: "taxReference", label: "SARS tax reference number", placeholder: "If known" },
    { id: "otpPhone", label: "Active cellphone for SARS OTP", placeholder: "Number that can receive SARS SMS OTPs", required: true, type: "tel" },
    { id: "taxYear", label: "Tax year or period", placeholder: "e.g. 2026 or 2026/10" },
    { id: "efilingUsername", label: "SARS eFiling username", placeholder: "If already registered" },
    { id: "requestType", label: "Document or action needed", placeholder: "Tax status, statement, ITA34, tax number, return, VAT, PAYE, or other" },
    { id: "address", label: "Residential or postal address", placeholder: "Street, suburb/town, province and postal code", multiline: true },
    { id: "bankDetails", label: "Bank details or RAV01 changes", placeholder: "Bank name, account type, account number and branch code, if relevant", multiline: true },
    { id: "supportingDocuments", label: "Supporting documents available", placeholder: "ID, proof of address, certificates, statements, or other documents", multiline: true },
    { id: "clientAuthorisation", label: "Authorisation or additional notes", placeholder: "Explain the request, dates, penalty reason, or any details we should capture.", multiline: true },
  ]
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
      <label htmlFor={field.id} className="mb-1.5 block text-center text-sm font-semibold text-foreground">
        {field.label}{field.required ? " *" : ""}
      </label>
      {field.multiline ? (
        <textarea id={field.id} required={field.required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} rows={4} className="w-full rounded-[14px] bg-background px-4 py-3 text-center text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      ) : (
        <input id={field.id} required={field.required} type={field.type ?? "text"} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} className="w-full rounded-[14px] bg-background px-4 py-3 text-center text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      )}
    </div>
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

type CvStep = "details" | "experience" | "education" | "preview"

const CV_STEPS: { id: CvStep; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "preview", label: "Preview" },
]

function CvStepField({ id, label, value, onChange, placeholder, multiline = false, type = "text" }: { id: string; label: string; value: string; onChange: (value: string) => void; placeholder: string; multiline?: boolean; type?: string }) {
  return <label className="cv-editor-field block text-left text-sm font-medium text-foreground" htmlFor={`cv-${id}`}>
    <span className="mb-2 block">{label}</span>
    {multiline ? <textarea id={`cv-${id}`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} /> : <input id={`cv-${id}`} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />}
  </label>
}

function CvStepSelect({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="cv-editor-field block text-left text-sm font-medium text-foreground" htmlFor={`cv-${id}`}>
    <span className="mb-2 block">{label}</span>
    <select id={`cv-${id}`} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">Choose one</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
}

type CvRole = { id: number }

function CvEditorCard({ children }: { children: React.ReactNode }) {
  return <div className="cv-editor-card rounded-[14px] p-5 shadow-[0_8px_28px_-22px_rgba(15,23,42,.55)] md:p-7">{children}</div>
}

function CvSteps({ step }: { step: CvStep }) {
  const current = CV_STEPS.findIndex((item) => item.id === step)
  return <div className="cv-stepper flex items-center gap-2 text-xs md:gap-3">
    {CV_STEPS.map((item, index) => <div key={item.id} className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
      <div className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${index < current ? "bg-emerald-500 text-white" : index === current ? "bg-[var(--brand-orange)] text-white" : "cv-step-muted"}`}>{index < current ? "✓" : index + 1}</div>
      <span className={`hidden truncate md:block ${index === current ? "font-semibold cv-step-active" : ""}`}>{item.label}</span>
      {index < CV_STEPS.length - 1 && <span className="cv-step-line h-px flex-1" />}
    </div>)}
  </div>
}

function CvPaperPreview({ values, photo, roles }: { values: Record<string, string>; photo: string | null; roles: CvRole[] }) {
  const roleValue = (role: CvRole, field: string) => values[`role-${role.id}-${field}`] ?? ""
  return <div className="cv-paper mx-auto w-full max-w-[560px] bg-white p-7 text-left text-slate-900 shadow-[0_18px_42px_-24px_rgba(15,23,42,.6)] md:p-10">
    <header className="border-b border-slate-200 pb-5">
      <div className="flex items-start justify-between gap-5">
        <div><h2 className="text-3xl font-bold tracking-tight">{values.fullName || "Your name"}</h2><p className="mt-1 text-base font-semibold text-[#1e6fa8]">{values.professionalTitle || "Professional title"}</p></div>
        {photo && <Image unoptimized src={photo} alt="Profile" width={72} height={72} className="size-[72px] rounded object-cover" />}
      </div>
      <p className="mt-3 text-xs text-slate-500">{[values.location, values.phone, values.email, values.driverLicense && `Licence: ${values.driverLicense}`].filter(Boolean).join(" · ") || "Town · phone · email"}</p>
    </header>
    <section className="mt-6"><h3 className="cv-paper-heading">ABOUT ME</h3><p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-600">{values.profile || "Your professional summary will appear here."}</p></section>
    <section className="mt-6 border-t border-slate-200 pt-5"><h3 className="cv-paper-heading">WORK EXPERIENCE</h3><div className="mt-3 space-y-4">{roles.map((role) => <article key={role.id}><div className="flex items-start justify-between gap-3"><div><h4 className="text-sm font-bold">{roleValue(role, "title") || "Job title"}</h4><p className="text-xs text-slate-500">{roleValue(role, "company") || "Company"}{roleValue(role, "employmentType") ? ` · ${roleValue(role, "employmentType")}` : ""}</p></div><span className="shrink-0 text-right text-[0.65rem] text-slate-500">{roleValue(role, "startDate") || "Start"} — {roleValue(role, "endDate") || "Present"}</span></div><p className="mt-1 whitespace-pre-line text-xs leading-5 text-slate-600">{roleValue(role, "responsibilities") || "Responsibilities and achievements will appear here."}</p></article>)}</div></section>
    <div className="mt-6 grid gap-6 border-t border-slate-200 pt-5 sm:grid-cols-2"><section><h3 className="cv-paper-heading">EDUCATION</h3><p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-600">{values.education || "Qualification · Institution · Year"}</p></section><section><h3 className="cv-paper-heading">SKILLS</h3><p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-600">{values.skills || "Your skills will appear here."}</p></section></div>
    {values.references && <section className="mt-6 border-t border-slate-200 pt-5"><h3 className="cv-paper-heading">REFERENCES</h3><p className="mt-2 whitespace-pre-line text-xs leading-5 text-slate-600">{values.references}</p></section>}
  </div>
}

function CvTool() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [roles, setRoles] = useState<CvRole[]>([{ id: 1 }])
  const [photo, setPhoto] = useState<string | null>(null)
  const [step, setStep] = useState<CvStep>("details")
  const [shareError, setShareError] = useState<string | null>(null)
  const setValue = (id: string, value: string) => updateValue(setValues, id, value)
  const roleValue = (role: CvRole, field: string) => values[`role-${role.id}-${field}`] ?? ""
  const addRole = () => setRoles((current) => [...current, { id: Math.max(...current.map((role) => role.id), 0) + 1 }])
  const removeRole = (id: number) => setRoles((current) => current.length === 1 ? current : current.filter((role) => role.id !== id))
  const handlePhoto = (file?: File) => { if (!file) return; if (!["image/jpeg", "image/png"].includes(file.type) || file.size > 2 * 1024 * 1024) { setShareError("Please choose a JPG or PNG photo under 2 MB."); return } setShareError(null); const reader = new FileReader(); reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null); reader.readAsDataURL(file) }
  const shareDetails = () => { setShareError(null); const summary = [...CV_FIELDS, { id: "driverLicense", label: "Driver's licence", placeholder: "" }].map((field) => `${field.label}: ${values[field.id] || "Not provided"}`).join("\n"); const work = roles.map((role, index) => `\nRole ${index + 1}: ${roleValue(role, "title")} at ${roleValue(role, "company")} (${roleValue(role, "startDate")} — ${roleValue(role, "endDate") || "Present"})\n${roleValue(role, "responsibilities")}`).join("\n"); const opened = window.open(waChatLink("CV Writing / CV Typing", `${summary}${work}\nTemplate: ApexBytesHub sample CV\nPhoto: ${photo ? "Included" : "Not included"}`), "_blank", "noopener,noreferrer"); if (!opened) setShareError("WhatsApp could not open. Please allow pop-ups or use the contact page.") }
  const stepIndex = CV_STEPS.findIndex((item) => item.id === step)
  const next = () => setStep(CV_STEPS[Math.min(stepIndex + 1, CV_STEPS.length - 1)].id)
  const back = () => setStep(CV_STEPS[Math.max(stepIndex - 1, 0)].id)

  return <div className="min-h-screen bg-background text-foreground"><Navbar /><PageNoticeBell page="tools" /><main id="main-content" className="mx-auto w-full max-w-[1480px] px-5 pb-20 pt-[calc(var(--nav-h)+2rem)] md:px-8">
    <div className="mx-auto mb-6 max-w-[1240px] text-center"><ToolBackLink /><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--brand-orange)]">Free tool</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl">CV Writer</h1><p className="mt-2 text-lg text-muted-foreground">Fill in the basics — we handle the layout.</p></div><CvSteps step={step} /></div>
    <div className="cv-editor mx-auto grid max-w-[1240px] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,.9fr)] lg:items-start"><section className="min-w-0">
      {step === "details" && <CvEditorCard><h2 className="text-2xl font-bold">Your details</h2><p className="mt-1 text-sm text-muted-foreground">Start with the basics.</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><CvStepField id="fullName" label="Full name" value={values.fullName ?? ""} onChange={(v) => setValue("fullName", v)} placeholder="e.g. Thabo Mokoena" /><CvStepField id="professionalTitle" label="Professional title" value={values.professionalTitle ?? ""} onChange={(v) => setValue("professionalTitle", v)} placeholder="e.g. Junior Bookkeeper" /><CvStepField id="phone" label="Phone number" value={values.phone ?? ""} onChange={(v) => setValue("phone", v)} placeholder="Your best contact number" type="tel" /><CvStepField id="email" label="Email address" value={values.email ?? ""} onChange={(v) => setValue("email", v)} placeholder="you@example.com" type="email" /><CvStepField id="location" label="Location" value={values.location ?? ""} onChange={(v) => setValue("location", v)} placeholder="Town, province" /><CvStepSelect id="driverLicense" label="Driver's licence" value={values.driverLicense ?? ""} onChange={(v) => setValue("driverLicense", v)} options={["No licence", "Code 8 / B", "Code 10 / C1", "Code 14 / EC", "Other"]} /><CvStepField id="profile" label="About me" value={values.profile ?? ""} onChange={(v) => setValue("profile", v)} placeholder="A short, confident introduction about your experience and goals." multiline /></div><div className="mt-6 flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">Optional photo</span><label className="cv-upload-button inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--brand-orange)]"><FileArrowUp size={18} /> {photo ? "Choose another" : "Upload photo"}<input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => handlePhoto(event.target.files?.[0])} /></label></div></CvEditorCard>}
      {step === "experience" && <CvEditorCard><div className="flex items-start justify-between gap-4"><div><h2 className="text-2xl font-bold">Work experience</h2><p className="mt-1 text-sm text-muted-foreground">Most recent first. Add every role you want employers to see.</p></div><span className="cv-count-label">{roles.length} {roles.length === 1 ? "role" : "roles"}</span></div><div className="mt-6 space-y-5">{roles.map((role, index) => <div key={role.id} className="cv-role-panel"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">Role {index + 1}</h3>{roles.length > 1 && <button type="button" onClick={() => removeRole(role.id)} className="cv-remove-role">Remove</button>}</div><div className="grid gap-5 sm:grid-cols-2"><CvStepField id={`role-${role.id}-title`} label="Job title" value={roleValue(role, "title")} onChange={(v) => setValue(`role-${role.id}-title`, v)} placeholder="e.g. Junior Bookkeeper" /><CvStepField id={`role-${role.id}-company`} label="Company" value={roleValue(role, "company")} onChange={(v) => setValue(`role-${role.id}-company`, v)} placeholder="e.g. Bothaville Motors" /><CvStepField id={`role-${role.id}-startDate`} label="Start date" value={roleValue(role, "startDate")} onChange={(v) => setValue(`role-${role.id}-startDate`, v)} placeholder="e.g. Jan 2022" /><CvStepSelect id={`role-${role.id}-employmentType`} label="Employment type" value={roleValue(role, "employmentType")} onChange={(v) => setValue(`role-${role.id}-employmentType`, v)} options={["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Volunteer"]} /><CvStepSelect id={`role-${role.id}-endDate`} label="End date" value={roleValue(role, "endDate")} onChange={(v) => setValue(`role-${role.id}-endDate`, v)} options={["Present", "2026", "2025", "2024", "2023", "2022", "2021 or earlier"]} /><CvStepField id={`role-${role.id}-responsibilities`} label="Responsibilities and achievements" value={roleValue(role, "responsibilities")} onChange={(v) => setValue(`role-${role.id}-responsibilities`, v)} placeholder="Use a new line for each responsibility or achievement" multiline /></div></div>)}</div><button type="button" onClick={addRole} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-[var(--brand-orange)] py-3 text-sm font-semibold text-[var(--brand-orange)]">＋ Add another role</button></CvEditorCard>}
      {step === "education" && <CvEditorCard><h2 className="text-2xl font-bold">Education and skills</h2><p className="mt-1 text-sm text-muted-foreground">Add the details employers need.</p><div className="mt-6 grid gap-5"><CvStepSelect id="educationType" label="Qualification type" value={values.educationType ?? ""} onChange={(v) => setValue("educationType", v)} options={["High school", "Certificate", "National certificate", "Diploma", "Degree", "Short course", "Other"]} /><CvStepField id="education" label="Education" value={values.education ?? ""} onChange={(v) => setValue("education", v)} placeholder="Qualification — Institution — Year" multiline /><CvStepField id="skills" label="Skills" value={values.skills ?? ""} onChange={(v) => setValue("skills", v)} placeholder="Bookkeeping, Sage, Excel, Reconciliation" multiline /><CvStepField id="certifications" label="Certificates and achievements" value={values.certifications ?? ""} onChange={(v) => setValue("certifications", v)} placeholder="Optional certificates, awards or short courses" multiline /><CvStepField id="references" label="References" value={values.references ?? ""} onChange={(v) => setValue("references", v)} placeholder="Available on request, or add contact details" multiline /></div></CvEditorCard>}
      {step === "preview" && <CvEditorCard><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-2xl font-bold">Your CV is ready to review</h2><p className="mt-1 text-sm text-muted-foreground">One polished sample-based layout · A4 preview</p></div><button type="button" onClick={shareDetails} className="inline-flex items-center gap-2 rounded-[14px] bg-[var(--brand-orange)] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_20px_-12px_rgba(250,82,21,.8)]"><WhatsappLogo size={18} /> Send to ApexBytesHub</button></div>{shareError && <p className="mt-4 text-sm text-red-600" role="alert">{shareError}</p>}</CvEditorCard>}
      <div className="mt-5 flex gap-3"><button type="button" onClick={back} disabled={stepIndex === 0} className="min-h-12 flex-1 rounded-[14px] cv-secondary-button px-5 font-semibold disabled:opacity-45">Back</button><button type="button" onClick={next} disabled={step === "preview"} className="min-h-12 flex-1 rounded-[14px] bg-[var(--brand-orange)] px-5 font-semibold text-white shadow-[0_10px_20px_-12px_rgba(250,82,21,.8)] disabled:opacity-45">{step === "preview" ? "Done" : "Continue"}</button></div>
    </section><aside className="cv-preview-panel hidden rounded-[14px] p-5 lg:block"><div className="mb-4 flex items-center justify-between text-sm"><span>📄 A4 — 1 page</span><span>− &nbsp; 100% &nbsp; +</span></div><CvPaperPreview values={values} photo={photo} roles={roles} /></aside>{step === "preview" && <div className="lg:hidden"><CvPaperPreview values={values} photo={photo} roles={roles} /></div>}</div>
  </main><PageScrollControls /><Footer /></div>
}

function IntakeTool() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)
  const selected = SERVICE_OPTIONS.find((option) => option.value === values.service)
  const fields = useMemo(() => selected ? [...INTAKE_BASE_FIELDS.slice(0, 3), ...serviceFields(selected), ...INTAKE_BASE_FIELDS.slice(3)] : [], [selected])
  const sharePdf = async () => {
    if (!selected) return
    setShareError(null)
    const blob = buildIntakePdf(values, selected.label)
    const file = new File([blob], "apexbyteshub-service-intake.pdf", { type: "application/pdf" })
    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({ title: `${BIZ.name} service intake`, text: `Service intake for ${selected.label}`, files: [file] })
        return
      }
      const url = URL.createObjectURL(blob)
    window.open(url, "_blank", "noopener,noreferrer")
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch {
      setShareError("The PDF could not be shared. Please try WhatsApp or try again.")
    }
  }
  const shareText = () => {
    if (!selected) return
    const summary = fields.map((field) => `${field.label}: ${values[field.id] || "Not provided"}`).join("\n")
    const opened = window.open(waChatLink(selected.label, summary), "_blank", "noopener,noreferrer")
    if (!opened) setShareError("WhatsApp could not open. Please allow pop-ups or use the contact page.")
  }

  return <ToolShell title="Tell us what you need" description="Choose one service first. We will then ask only for the details that help us prepare your request properly.">
    <div className="abh-card p-5 md:p-8">
      <label htmlFor="service" className="mb-2 block text-sm font-semibold text-foreground">1. Choose the service you need *</label>
      <select id="service" required value={values.service ?? ""} onChange={(event) => { setValues({ service: event.target.value }); setSubmitted(false) }} className="w-full rounded-[14px] bg-background px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="">Select a service</option>{HUB_ORDER.map((hubId) => <optgroup key={hubId} label={HUBS[hubId].title}>{SERVICE_OPTIONS.filter((option) => option.hubId === hubId).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</optgroup>)}</select>
      {selected && <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }} className="mt-8 grid gap-5 sm:grid-cols-2"><div className="sm:col-span-2 rounded-[14px] bg-muted/60 px-4 py-3 text-sm text-muted-foreground"><strong className="text-foreground">Selected:</strong> {selected.label} · {selected.sectionTitle}</div>{fields.map((field) => <InputField key={`${selected.value}-${field.id}`} field={field} value={values[field.id] ?? ""} onChange={(value) => updateValue(setValues, field.id, value)} />)}<button type="submit" className="abh-btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-bold sm:col-span-2"><CheckCircle size={19} /> Review my request</button></form>}
    </div>
    {shareError && <p className="mt-4 text-sm text-red-600 dark:text-red-300" role="alert">{shareError}</p>}
    {submitted && selected && <section className="mt-8 abh-card p-5 text-center md:p-8" aria-live="polite"><h2 className="text-2xl font-semibold">{selected.label}</h2><dl className="mt-6 grid gap-4 text-center sm:grid-cols-2">{fields.map((field) => <div key={field.id}><dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{field.label}</dt><dd className="mt-1 whitespace-pre-line break-words text-sm text-foreground">{values[field.id] || "Not provided"}</dd></div>)}</dl><div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={() => void sharePdf()} className="abh-btn-primary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"><DownloadSimple size={18} /> Share / open PDF</button><button type="button" onClick={shareText} className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-whatsapp)] px-4 py-2.5 text-sm font-semibold text-white"><PaperPlaneTilt size={18} /> Send details on WhatsApp</button></div><p className="mt-4 text-sm text-muted-foreground">On phones that support file sharing, the PDF opens directly into your share sheet. On desktop, it opens as a PDF preview ready to forward.</p></section>}
  </ToolShell>
}

function ToolShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <div className="min-h-screen bg-background"><Navbar /><PageNoticeBell page="tools" /><main id="main-content" className="mx-auto w-full max-w-6xl px-5 pb-20 pt-[calc(var(--nav-h)+2.5rem)] text-center md:px-8"><ToolBackLink /><header className="mx-auto mb-9 max-w-3xl"><h1 className="abh-page-title mb-3">{title}</h1><p className="mx-auto max-w-2xl text-muted-foreground">{description}</p></header>{children}</main><PageScrollControls /><Footer /></div>
}

export function ToolForm({ mode }: { mode: ToolMode }) {
  return mode === "cv" ? <CvTool /> : <IntakeTool />
}
