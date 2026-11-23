"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, DownloadSimple, PaperPlaneTilt } from "@phosphor-icons/react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageScrollControls } from "@/components/page-scroll-controls"
import { PageNoticeBell } from "@/components/page-notice-bell"
import { waChatLink } from "@/lib/brand"

type ToolMode = "cv" | "intake"

// Shared labels and field metadata keep both tools consistent and accessible.
export function ToolForm({ mode }: { mode: ToolMode }) {
  const isCv = mode === "cv"
  const [values, setValues] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const fields = isCv
    ? [
        { id: "fullName", label: "Full name", placeholder: "Enter your full name", required: true },
        { id: "phone", label: "Phone number", placeholder: "Enter your phone number", required: true },
        { id: "email", label: "Email address", placeholder: "Enter your email address", required: false },
        { id: "location", label: "Location", placeholder: "Enter your town or suburb", required: false },
        { id: "profile", label: "Professional summary", placeholder: "Describe your experience and career goal", required: false, multiline: true },
        { id: "experience", label: "Work experience", placeholder: "Add roles, employers, and dates", required: false, multiline: true },
        { id: "education", label: "Education", placeholder: "Add qualifications and institutions", required: false, multiline: true },
        { id: "skills", label: "Skills", placeholder: "Enter your key skills", required: false },
      ]
    : [
        { id: "fullName", label: "Full name", placeholder: "Enter your full name", required: true },
        { id: "phone", label: "Phone number", placeholder: "Enter your phone number", required: true },
        { id: "email", label: "Email address", placeholder: "Enter your email address", required: false },
        { id: "service", label: "Service needed", placeholder: "Describe the service you need", required: true },
        { id: "deadline", label: "Preferred date", placeholder: "Enter your preferred date", required: false },
        { id: "details", label: "Request details", placeholder: "Tell us what you need help with", required: true, multiline: true },
      ]
  const title = isCv ? "CV Writing / CV Typing" : "Intake Form Filling"
  const cvText = useMemo(() => [values.fullName, values.location, values.phone, values.email, "", "PROFESSIONAL SUMMARY", values.profile, "", "WORK EXPERIENCE", values.experience, "", "EDUCATION", values.education, "", "SKILLS", values.skills].filter(Boolean).join("\n"), [values])

  const updateField = (id: string, value: string) => setValues((current) => ({ ...current, [id]: value }))
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }
  const shareDetails = () => {
    const summary = fields.map((field) => `${field.label}: ${values[field.id] || "Not provided"}`).join("\n")
    window.open(waChatLink(isCv ? "CV Writing / CV Typing" : undefined, summary), "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageNoticeBell page="tools" />
      <main id="main-content" className="mx-auto w-full max-w-3xl px-5 pb-20 pt-[calc(var(--nav-h)+2.5rem)] md:px-8">
        <Link href="/tools" className="mb-7 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ArrowLeft size={17} aria-hidden="true" /> Back to tools
        </Link>
        <header className="mb-8 text-center">
          <p className="abh-eyebrow mb-2">ApexbytesHub Tools</p>
          <h1 className="abh-page-title mb-3">{title}</h1>
          <p className="mx-auto max-w-xl text-muted-foreground">{isCv ? "Enter your information to create a clear, formatted CV you can print or save as PDF." : "Tell us a little about your request so we can prepare the right support."}</p>
        </header>
        <form onSubmit={handleSubmit} className="abh-card flex flex-col gap-5 p-5 md:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.id} className={field.multiline ? "sm:col-span-2" : ""}>
                <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium text-foreground">{field.label}{field.required ? " *" : ""}</label>
                {field.multiline ? (
                  <textarea id={field.id} required={field.required} value={values[field.id] ?? ""} onChange={(event) => updateField(field.id, event.target.value)} placeholder={field.placeholder} rows={4} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                ) : (
                  <input id={field.id} required={field.required} type={field.id === "email" ? "email" : "text"} value={values[field.id] ?? ""} onChange={(event) => updateField(field.id, event.target.value)} placeholder={field.placeholder} className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                )}
              </div>
            ))}
          </div>
          <button type="submit" className="abh-btn-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{isCv ? "Create my CV" : "Review my request"}</button>
        </form>
        {submitted && (
          <section aria-live="polite" className="mt-8 rounded-xl border border-border bg-card p-5 md:p-8">
            <h2 className="mb-4 text-xl font-semibold text-foreground">{isCv ? "Your formatted CV" : "Your request summary"}</h2>
            {isCv ? <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-foreground">{cvText}</pre> : <dl className="grid gap-3 sm:grid-cols-2">{fields.map((field) => <div key={field.id}><dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{field.label}</dt><dd className="mt-1 break-words text-sm text-foreground">{values[field.id] || "Not provided"}</dd></div>)}</dl>}
            <div className="mt-6 flex flex-wrap gap-3">
              {isCv && <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><DownloadSimple size={17} aria-hidden="true" /> Print / Save as PDF</button>}
              <button type="button" onClick={shareDetails} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><PaperPlaneTilt size={17} aria-hidden="true" /> Send to ApexbytesHub</button>
            </div>
          </section>
        )}
      </main>
      <PageScrollControls />
      <Footer />
    </div>
  )
}
