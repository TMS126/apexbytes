// components/tools/cv-writer.tsx
"use client"

import { createContext, useContext, useRef, useState } from "react"
import type { ComponentProps, ReactNode } from "react"
import { FileArrowUp, Plus, WhatsappLogo, X } from "@phosphor-icons/react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { waChatLink } from "@/lib/brand"
import { ToolBackLink } from "@/components/tools/tool-back-link"
import { ToolHelpAccordion } from "@/components/tools/tool-help-accordion"
import { DatePicker, formatPickerValue, todayValue } from "./date-picker"
import { CvPaper, EMPTY_CV, PROVINCES, dateRange, newEducation, newReferee, newRole, splitLines } from "./cv-paper"
import type { CvData, CvEducation, CvReferee, CvRole } from "./cv-paper"
import { SearchableSelect } from "./searchable-select"
import { useSaSchools, useSaTowns } from "./use-sa-locations"
import {
  CERTIFICATION_SUGGESTIONS,
  COUNTRY_OPTIONS,
  EDUCATION_LEVELS,
  EMPLOYMENT_TYPES,
  FIELD_OF_STUDY_SUGGESTIONS,
  INSTITUTION_TYPES_INTERNATIONAL,
  INSTITUTION_TYPES_SA,
  INTERNATIONAL_QUALIFICATION_TYPES,
  JOB_TITLE_SUGGESTIONS,
  LANGUAGE_LEVELS,
  LANGUAGE_SUGGESTIONS,
  LICENCES,
  MARITAL_STATUS,
  SCHOOL_QUALIFICATIONS,
  SCHOOL_QUALIFICATION_TYPES,
  SKILL_SUGGESTIONS,
  TERTIARY_QUALIFICATION_TYPES,
} from "@/lib/data/cv-options"
import { institutionsFor, programmesFor } from "@/lib/data/tertiary"
import type { TertiaryType } from "@/lib/data/tertiary"

const STEPS = [
  { id: "style", label: "Style" },
  { id: "details", label: "Details" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "preview", label: "Preview" },
] as const
type StepId = (typeof STEPS)[number]["id"]

const CV_HELP = [
  { question: "What information do I need before I start?", answer: "Your contact details, a short introduction, work history with start and end dates, your qualifications and your skills. Required fields are marked with an asterisk." },
  { question: "What is the difference between Traditional and Modern?", answer: "Traditional is a single column with a centred heading, which prints cleanly and suits most employers. Modern uses a coloured side panel for contact, skills and languages, with your experience on the right." },
  { question: "What does the South Africa / International choice change?", answer: "South Africa adds optional ID number, date of birth, nationality, marital status and a photo. International leaves those out, because employers abroad usually do not want them. Only include personal details an employer asks for." },
  { question: "I have no work experience. Can I still make a CV?", answer: "Yes. Tick “I have no work experience yet” and your CV will lead with your education, skills and languages." },
  { question: "What happens when I finish?", answer: "Review the layout, then send your details to ApexBytesHub on WhatsApp. We can check, polish and print it for you." },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const STYLE_OPTIONS = [
  { value: "traditional", label: "Traditional — single column" },
  { value: "modern", label: "Modern — two columns" },
]
const REGION_OPTIONS = [
  { value: "sa", label: "South Africa" },
  { value: "intl", label: "International (abroad)" },
]
const STYLE_NOTE: Record<CvData["style"], string> = {
  traditional: "Traditional: one column with a centred heading. Easy to read and prints cleanly.",
  modern: "Modern: a coloured side panel for contact, skills and languages, with your experience on the right.",
}
const REGION_NOTE: Record<CvData["region"], string> = {
  sa: "South Africa: adds optional ID number, date of birth, nationality, marital status, driver's licence and a photo. Only include what the employer asks for.",
  intl: "International: leaves out photo, ID number, date of birth and marital status, which employers abroad usually do not want.",
}

type Option = string | { value: string; label: string }
const optionValue = (option: Option) => (typeof option === "string" ? option : option.value)
const optionLabel = (option: Option) => (typeof option === "string" ? option : option.label)

const FormContext = createContext<{ attempted: boolean; errors: Record<string, string> }>({ attempted: false, errors: {} })
function useFieldError(id: string) {
  const { attempted, errors } = useContext(FormContext)
  return attempted ? errors[id] : undefined
}

const PRIMARY_BUTTON = "min-h-12 flex-1 rounded-[14px] px-5 font-semibold disabled:opacity-45"
const PRIMARY_STYLE = { backgroundColor: "var(--brand-orange)", color: "var(--on-brand-orange)" }

function ErrorText({ error }: { error?: string }) {
  if (!error) return null
  return <span role="alert" className="mt-1.5 block text-xs font-medium text-red-600 dark:text-red-300">{error}</span>
}

function TextField({ id, label, value, onChange, placeholder, hint, type = "text", required = false, multiline = false, span2 = false, inputMode }: {
  id: string; label: string; value: string; onChange: (value: string) => void; placeholder: string; hint?: string
  type?: string; required?: boolean; multiline?: boolean; span2?: boolean; inputMode?: "numeric" | "tel" | "email" | "text"
}) {
  const error = useFieldError(id)
  const valid = Boolean(value.trim()) && !error
  return (
    <label className={`cv-editor-field block text-left text-sm font-medium text-foreground ${span2 ? "sm:col-span-2" : ""} ${valid ? "cv-editor-field-valid" : ""}`} htmlFor={`cv-${id}`}>
      <span className="mb-2 block">{label}{required ? " *" : ""}</span>
      {multiline ? (
        <textarea id={`cv-${id}`} aria-invalid={error ? true : undefined} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} />
      ) : (
        <input id={`cv-${id}`} aria-invalid={error ? true : undefined} type={type} inputMode={inputMode} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      )}
      {hint && <span className="mt-1.5 block text-xs font-normal text-muted-foreground">{hint}</span>}
      <ErrorText error={error} />
    </label>
  )
}

function SelectField({ id, label, value, onChange, options, required = false, allowEmpty = true, span2 = false }: {
  id: string; label: string; value: string; onChange: (value: string) => void; options: Option[]; required?: boolean; allowEmpty?: boolean; span2?: boolean
}) {
  const error = useFieldError(id)
  const valid = Boolean(value.trim()) && !error
  return (
    <label className={`cv-editor-field block text-left text-sm font-medium text-foreground ${span2 ? "sm:col-span-2" : ""} ${valid ? "cv-editor-field-valid" : ""}`} htmlFor={`cv-${id}`}>
      <span className="mb-2 block">{label}{required ? " *" : ""}</span>
      <select id={`cv-${id}`} aria-invalid={error ? true : undefined} value={value} onChange={(event) => onChange(event.target.value)}>
        {allowEmpty && <option value="">Choose one</option>}
        {options.map((option) => <option key={optionValue(option)} value={optionValue(option)}>{optionLabel(option)}</option>)}
      </select>
      <ErrorText error={error} />
    </label>
  )
}

function SearchableField({ errorId, ...props }: ComponentProps<typeof SearchableSelect> & { errorId: string }) {
  const error = useFieldError(errorId)
  return <SearchableSelect {...props} error={error} />
}

function DateField({ id, label, value, onChange, required = false, mode = "month", min, max, hint, initialView, disabled = false, placeholder }: {
  id: string; label: string; value: string; onChange: (value: string) => void; required?: boolean; mode?: "day" | "month"
  min?: string; max?: string; hint?: string; initialView?: string; disabled?: boolean; placeholder?: string
}) {
  const error = useFieldError(id)
  return (
    <div className={`block text-left text-sm font-medium text-foreground ${disabled ? "opacity-50" : ""}`}>
      <label htmlFor={`cv-${id}`} className="mb-2 block">{label}{required ? " *" : ""}</label>
      {disabled ? (
        <div className="flex min-h-12 items-center px-3.5 text-sm text-muted-foreground" style={{ border: "1px solid color-mix(in srgb, var(--foreground) 22%, transparent)", borderRadius: 14 }}>Present</div>
      ) : (
        <DatePicker id={`cv-${id}`} value={value} onChange={onChange} mode={mode} min={min} max={max} initialView={initialView} invalid={Boolean(error)} placeholder={placeholder ?? (mode === "month" ? "Choose month and year" : "Choose a date")} />
      )}
      {hint && <span className="mt-1.5 block text-xs font-normal text-muted-foreground">{hint}</span>}
      <ErrorText error={error} />
    </div>
  )
}

function CheckField({ label, checked, onChange, span2 = false }: { label: string; checked: boolean; onChange: (checked: boolean) => void; span2?: boolean }) {
  return (
    <label className={`flex min-h-10 items-center gap-2.5 text-left text-sm text-foreground ${span2 ? "sm:col-span-2" : ""}`}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-[var(--brand-orange)]" />
      <span>{label}</span>
    </label>
  )
}

function ChipField({ id, label, hint, placeholder, chips, required = false, levels, suggestions, onAdd, onRemove }: {
  id: string; label: string; hint?: string; placeholder: string; chips: string[]; required?: boolean
  levels?: string[]; suggestions?: string[]; onAdd: (text: string, level: string) => void; onRemove: (index: number) => void
}) {
  const error = useFieldError(id)
  const [draft, setDraft] = useState("")
  const [level, setLevel] = useState(levels?.[1] ?? "")
  const add = () => {
    const text = draft.trim()
    if (!text) return
    onAdd(text, level)
    setDraft("")
  }
  return (
    <div className="sm:col-span-2 text-left text-sm font-medium text-foreground">
      <label htmlFor={`cv-${id}`} className="mb-2 block">{label}{required ? " *" : ""}</label>
      <div className="flex gap-2">
        <div className="cv-editor-field min-w-0 flex-1">
          <input
            id={`cv-${id}`}
            list={suggestions ? `cv-${id}-suggestions` : undefined}
            autoComplete="off"
            aria-invalid={error ? true : undefined}
            value={draft}
            placeholder={placeholder}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={add}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                add()
              }
            }}
          />
          {suggestions ? (
            <datalist id={`cv-${id}-suggestions`}>
              {suggestions.map((suggestion) => <option key={suggestion} value={suggestion} />)}
            </datalist>
          ) : null}
        </div>
        {levels && (
          <div className="cv-editor-field w-36 shrink-0">
            <select aria-label={`${label} level`} value={level} onChange={(event) => setLevel(event.target.value)}>
              {levels.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        )}
        <button type="button" onClick={add} className="cv-secondary-button shrink-0 px-4 text-sm font-semibold"><span>Add</span></button>
      </div>
      {hint && <span className="mt-1.5 block text-xs font-normal text-muted-foreground">{hint}</span>}
      <ErrorText error={error} />
      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <span key={`${chip}-${index}`} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm font-medium text-foreground">
              <span>{chip}</span>
              <button type="button" aria-label={`Remove ${chip}`} onClick={() => onRemove(index)} className="flex size-5 items-center justify-center text-muted-foreground"><X size={13} weight="bold" aria-hidden="true" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function CvCard({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="cv-editor-card rounded-[14px] p-5 shadow-[0_8px_28px_-22px_rgba(15,23,42,.55)] md:p-7">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  )
}

function Stepper({ step }: { step: StepId }) {
  const current = STEPS.findIndex((item) => item.id === step)
  return (
    <div className="cv-stepper grid text-xs" style={{ gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))` }}>
      {STEPS.map((item, index) => (
        <div key={item.id} className="relative flex min-w-0 flex-col items-center gap-2">
          {index < STEPS.length - 1 && <span className="cv-step-line absolute left-1/2 top-3.5 h-px w-full" />}
          <div className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${index < current ? "bg-emerald-500 text-[#052e16]" : index === current ? "bg-[var(--brand-orange)] text-[var(--on-brand-orange)]" : "cv-step-muted"}`}>
            {index < current ? "✓" : index + 1}
          </div>
          <span className={`max-w-full truncate ${index === current ? "block font-semibold cv-step-active" : "hidden md:block"}`}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function RoleEditor({ role, index, canRemove, onChange, onRemove }: { role: CvRole; index: number; canRemove: boolean; onChange: (patch: Partial<CvRole>) => void; onRemove: () => void }) {
  const key = `role-${role.id}`
  const thisMonth = todayValue("month")
  return (
    <div className="cv-role-panel">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Role {index + 1}</h3>
        {canRemove && <button type="button" onClick={onRemove} className="cv-remove-role"><span>Remove</span></button>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id={`${key}-title`} label="Job title" value={role.title} onChange={(value) => onChange({ title: value })} placeholder="Your job title" required />
        <TextField id={`${key}-company`} label="Employer" value={role.company} onChange={(value) => onChange({ company: value })} placeholder="Company or organisation" required />
        <SelectField id={`${key}-employmentType`} label="Employment type" value={role.employmentType} onChange={(value) => onChange({ employmentType: value })} options={EMPLOYMENT_TYPES} />
        <span className="hidden sm:block" />
        <DateField id={`${key}-startDate`} label="Start date" value={role.startDate} onChange={(value) => onChange({ startDate: value })} required max={thisMonth} initialView={thisMonth} />
        <DateField id={`${key}-endDate`} label="End date" value={role.endDate} onChange={(value) => onChange({ endDate: value })} required={!role.current} min={role.startDate || undefined} max={thisMonth} initialView={role.startDate || thisMonth} disabled={role.current} />
        <CheckField span2 label="I currently work here" checked={role.current} onChange={(checked) => onChange({ current: checked, endDate: checked ? "" : role.endDate })} />
        <TextField span2 multiline required id={`${key}-responsibilities`} label="Responsibilities and achievements" value={role.responsibilities} onChange={(value) => onChange({ responsibilities: value })} placeholder="Write one responsibility or achievement per line" hint="Start each line with an action word and use real numbers only if you can back them up." />
      </div>
    </div>
  )
}

function EducationEditor({ item, index, canRemove, region, onChange, onRemove }: { item: CvEducation; index: number; canRemove: boolean; region: CvData["region"]; onChange: (patch: Partial<CvEducation>) => void; onRemove: () => void }) {
  const key = `edu-${item.id}`
  const sa = region === "sa"
  const schoolData = useSaSchools(sa && item.level === "school" ? item.province : "")
  const tertiaryTypes: TertiaryType[] = item.institutionType && item.institutionType !== "Other"
    ? [item.institutionType as TertiaryType]
    : ["University", "University of Technology", "TVET College", "Private Higher Education Institution"]
  const tertiaryOptions = sa && item.level === "tertiary"
    ? institutionsFor(item.province, tertiaryTypes).map((institution) => institution.name)
    : []
  const programmeOptions = sa && item.level === "tertiary" ? programmesFor(item.institution) : []

  return (
    <div className="cv-role-panel">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Qualification {index + 1}</h3>
        {canRemove && <button type="button" onClick={onRemove} className="cv-remove-role"><span>Remove</span></button>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          id={`${key}-level`}
          label="What are you adding?"
          value={item.level}
          onChange={(value) => onChange({ level: value as CvEducation["level"], institution: "", institutionType: "", qualification: "", type: "" })}
          options={EDUCATION_LEVELS}
          allowEmpty={false}
          required
        />
        {sa ? (
          <SelectField
            id={`${key}-province`}
            label="Province"
            value={item.province}
            onChange={(value) => onChange({ province: value, institution: "", qualification: "" })}
            options={PROVINCES}
            required
          />
        ) : (
          <SelectField
            id={`${key}-country`}
            label="Country of study"
            value={item.country}
            onChange={(value) => onChange({ country: value, institution: "", qualification: "" })}
            options={COUNTRY_OPTIONS}
            required
          />
        )}

        {sa && item.level === "school" && (
          <>
            <SearchableField
              span2
              id={`cv-${key}-institution`}
              errorId={`${key}-institution`}
              label="School"
              value={item.institution}
              onChange={(value) => onChange({ institution: value, qualification: "" })}
              options={schoolData.options}
              loading={schoolData.loading}
              allowCustom
              required
              placeholder="Search for your school"
              searchPlaceholder="Type a school name…"
              hint={schoolData.error ?? "The list is the DBE 2023 school masterlist. If your school is missing or renamed, type its name."}
            />
            <SelectField id={`${key}-type`} label="Qualification type" value={item.type} onChange={(value) => onChange({ type: value })} options={SCHOOL_QUALIFICATION_TYPES} required />
            <SelectField id={`${key}-qualification`} label="Qualification or grade" value={item.qualification} onChange={(value) => onChange({ qualification: value })} options={SCHOOL_QUALIFICATIONS} required />
          </>
        )}

        {sa && item.level === "tertiary" && (
          <>
            <SelectField
              id={`${key}-institutionType`}
              label="Institution type"
              value={item.institutionType}
              onChange={(value) => onChange({ institutionType: value, institution: "", qualification: "" })}
              options={INSTITUTION_TYPES_SA}
              required
            />
            <span className="hidden sm:block" />
            <SearchableField
              span2
              id={`cv-${key}-institution`}
              errorId={`${key}-institution`}
              label="Institution"
              value={item.institution}
              onChange={(value) => onChange({ institution: value, qualification: "" })}
              options={tertiaryOptions}
              allowCustom
              required
              placeholder="Search universities, colleges or TVET colleges"
              searchPlaceholder="Type an institution name…"
              hint="Public universities, universities of technology, 50 public TVET colleges and selected private institutions. Type your institution if it is not listed."
            />
            <SearchableField
              span2
              id={`cv-${key}-qualification`}
              errorId={`${key}-qualification`}
              label="Course or field of study"
              value={item.qualification}
              onChange={(value) => onChange({ qualification: value })}
              options={programmeOptions}
              allowCustom
              required
              placeholder={item.institution ? "Search courses at this institution" : "Choose an institution first, or type your course"}
              searchPlaceholder="Type a course or field of study…"
              hint="Course availability differs by campus. Type your exact course if it is not listed."
            />
            <SelectField id={`${key}-type`} label="Qualification type" value={item.type} onChange={(value) => onChange({ type: value })} options={TERTIARY_QUALIFICATION_TYPES} required />
          </>
        )}

        {sa && item.level === "other" && (
          <>
            <TextField span2 id={`${key}-institution`} label="Training provider" value={item.institution} onChange={(value) => onChange({ institution: value })} placeholder="Name of training provider" required />
            <TextField span2 id={`${key}-qualification`} label="Course or qualification" value={item.qualification} onChange={(value) => onChange({ qualification: value })} placeholder="Name of course or qualification" required />
            <SelectField id={`${key}-type`} label="Qualification type" value={item.type} onChange={(value) => onChange({ type: value })} options={TERTIARY_QUALIFICATION_TYPES} required />
          </>
        )}

        {!sa && (
          <>
            <SelectField
              id={`${key}-institutionType`}
              label="Institution type"
              value={item.institutionType}
              onChange={(value) => onChange({ institutionType: value, institution: "" })}
              options={INSTITUTION_TYPES_INTERNATIONAL}
            />
            <TextField
              span2
              id={`${key}-institution`}
              label="School, college or university"
              value={item.institution}
              onChange={(value) => onChange({ institution: value })}
              placeholder="Name of institution"
              required
            />
            <SearchableField
              span2
              id={`cv-${key}-qualification`}
              errorId={`${key}-qualification`}
              label="Course or field of study"
              value={item.qualification}
              onChange={(value) => onChange({ qualification: value })}
              options={FIELD_OF_STUDY_SUGGESTIONS}
              allowCustom
              required
              placeholder="Search a subject area"
              searchPlaceholder="Type a course or subject…"
              hint="Pick a common field or type the exact course name used in that country."
            />
            <SelectField id={`${key}-type`} label="Qualification type" value={item.type} onChange={(value) => onChange({ type: value })} options={INTERNATIONAL_QUALIFICATION_TYPES} required />
          </>
        )}

        <DateField id={`${key}-startDate`} label="Start date" value={item.startDate} onChange={(value) => onChange({ startDate: value })} hint="Optional" initialView={item.endDate || undefined} />
        <DateField id={`${key}-endDate`} label="Completion date" value={item.endDate} onChange={(value) => onChange({ endDate: value })} required={!item.current} min={item.startDate || undefined} disabled={item.current} initialView={item.startDate || undefined} />
        <CheckField span2 label="I am still studying here" checked={item.current} onChange={(checked) => onChange({ current: checked, endDate: checked ? "" : item.endDate })} />
        <TextField span2 multiline id={`${key}-notes`} label="Subjects or highlights" value={item.notes} onChange={(value) => onChange({ notes: value })} placeholder="Optional: main subjects, distinctions or achievements" />
      </div>
    </div>
  )
}

function RefereeEditor({ item, index, onChange, onRemove }: { item: CvReferee; index: number; onChange: (patch: Partial<CvReferee>) => void; onRemove: () => void }) {
  const key = `ref-${item.id}`
  return (
    <div className="cv-role-panel">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Referee {index + 1}</h3>
        <button type="button" onClick={onRemove} className="cv-remove-role"><span>Remove</span></button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id={`${key}-name`} label="Full name" value={item.name} onChange={(value) => onChange({ name: value })} placeholder="Referee's name" required />
        <TextField id={`${key}-position`} label="Position and company" value={item.position} onChange={(value) => onChange({ position: value })} placeholder="Their job title and employer" />
        <TextField id={`${key}-phone`} label="Phone number" value={item.phone} onChange={(value) => onChange({ phone: value })} placeholder="Their contact number" type="tel" required />
        <TextField id={`${key}-email`} label="Email address" value={item.email} onChange={(value) => onChange({ email: value })} placeholder="Optional" type="email" />
      </div>
    </div>
  )
}

function validateStep(step: StepId, data: CvData): Record<string, string> {
  const errors: Record<string, string> = {}
  const required = (id: string, value: string) => {
    if (!value.trim()) errors[id] = "This field is required."
  }

  if (step === "details") {
    required("fullName", data.fullName)
    required("professionalTitle", data.professionalTitle)
    required("phone", data.phone)
    if (data.phone.trim() && data.phone.replace(/\D/g, "").length < 9) errors.phone = "Enter a valid phone number."
    if (data.email.trim() && !EMAIL_PATTERN.test(data.email.trim())) errors.email = "Enter a valid email address."
    if (data.region === "sa" && data.idNumber.trim() && !/^\d{13}$/.test(data.idNumber.replace(/\s/g, ""))) errors.idNumber = "A South African ID number has 13 digits."
    required("profile", data.profile)
  }

  if (step === "experience" && !data.noExperience) {
    for (const role of data.roles) {
      const key = `role-${role.id}`
      required(`${key}-title`, role.title)
      required(`${key}-company`, role.company)
      required(`${key}-startDate`, role.startDate)
      if (!role.current) {
        required(`${key}-endDate`, role.endDate)
        if (role.startDate && role.endDate && role.endDate < role.startDate) errors[`${key}-endDate`] = "End date cannot be before the start date."
      }
      required(`${key}-responsibilities`, role.responsibilities)
    }
  }

  if (step === "education") {
    for (const item of data.education) {
      const key = `edu-${item.id}`
      required(`${key}-level`, item.level)
      if (data.region === "sa") {
        required(`${key}-province`, item.province)
        if (item.level === "tertiary") required(`${key}-institutionType`, item.institutionType)
      } else {
        required(`${key}-country`, item.country)
      }
      required(`${key}-type`, item.type)
      required(`${key}-qualification`, item.qualification)
      required(`${key}-institution`, item.institution)
      if (!item.current) {
        required(`${key}-endDate`, item.endDate)
        if (item.startDate && item.endDate && item.endDate < item.startDate) errors[`${key}-endDate`] = "Completion date cannot be before the start date."
      }
    }
  }

  if (step === "skills") {
    if (data.skills.length === 0) errors.skills = "Add at least one skill."
    if (!data.refsOnRequest) {
      for (const ref of data.referees) {
        required(`ref-${ref.id}-name`, ref.name)
        required(`ref-${ref.id}-phone`, ref.phone)
      }
    }
  }

  return errors
}

function buildCvMessage(data: CvData): string {
  const lines: string[] = []
  const add = (label: string, value: string) => {
    if (value.trim()) lines.push(`${label}: ${value.trim()}`)
  }
  lines.push(`CV layout: ${data.style === "modern" ? "Modern (two columns)" : "Traditional (single column)"} · ${data.region === "sa" ? "South Africa" : "International"}`)
  add("Name", data.fullName)
  add("Title", data.professionalTitle)
  add("Phone", data.phone)
  add("Email", data.email)
  add("Town or city", data.city)
  add(data.region === "sa" ? "Province" : "Country", data.region === "sa" ? data.province : data.country)
  add("LinkedIn or portfolio", data.website)
  if (data.region === "sa") {
    add("ID number", data.idNumber)
    add("Date of birth", formatPickerValue(data.dateOfBirth, "day"))
    add("Nationality", data.nationality)
    add("Marital status", data.maritalStatus)
    add("Driver's licence", data.driverLicense)
  }
  add("About me", data.profile)
  if (data.noExperience) lines.push("Work experience: none yet")
  else data.roles.forEach((role, index) => {
    lines.push(`\nRole ${index + 1}: ${role.title} at ${role.company}${role.employmentType ? ` (${role.employmentType})` : ""}`)
    lines.push(dateRange(role.startDate, role.endDate, role.current))
    splitLines(role.responsibilities).forEach((line) => lines.push(`- ${line}`))
  })
  data.education.forEach((item, index) => {
    const typeSuffix = item.level !== "school" && item.type && item.type !== item.qualification ? ` (${item.type})` : ""
    lines.push(`\nEducation ${index + 1}: ${item.qualification}${typeSuffix} at ${item.institution}`)
    add("Level", item.level === "school" ? "School" : item.level === "tertiary" ? "Tertiary" : "Other training")
    add(data.region === "sa" ? "Province" : "Country", data.region === "sa" ? item.province : item.country)
    add("Institution type", item.institutionType)
    lines.push(dateRange(item.startDate, item.endDate, item.current, "Studying"))
    add("Notes", item.notes)
  })
  add("\nSkills", data.skills.join(", "))
  add("Languages", data.languages.map((item) => `${item.name} (${item.level})`).join(", "))
  add("Certificates", data.certifications.join(", "))
  if (data.refsOnRequest) lines.push("References: available on request")
  else data.referees.forEach((ref, index) => lines.push(`Referee ${index + 1}: ${ref.name}, ${ref.position}, ${ref.phone}${ref.email ? `, ${ref.email}` : ""}`))
  lines.push(`Photo: ${data.region === "sa" && data.photo ? "Included in the CV preview" : "Not included"}`)
  return lines.join("\n")
}

export function CvTool() {
  const [data, setData] = useState<CvData>(EMPTY_CV)
  const [step, setStep] = useState<StepId>("style")
  const [attempted, setAttempted] = useState(false)
  const [shakeCount, setShakeCount] = useState(0)
  const [notice, setNotice] = useState<string | null>(null)
  const idCounter = useRef(100)
  const sa = data.region === "sa"
  const townData = useSaTowns(sa ? data.province : "")
  const takeId = () => {
    idCounter.current += 1
    return idCounter.current
  }

  const set = <K extends keyof CvData>(key: K, value: CvData[K]) => setData((current) => ({ ...current, [key]: value }))
  const updateRole = (id: number, patch: Partial<CvRole>) => setData((current) => ({ ...current, roles: current.roles.map((role) => (role.id === id ? { ...role, ...patch } : role)) }))
  const updateEducation = (id: number, patch: Partial<CvEducation>) => setData((current) => ({ ...current, education: current.education.map((item) => (item.id === id ? { ...item, ...patch } : item)) }))
  const updateReferee = (id: number, patch: Partial<CvReferee>) => setData((current) => ({ ...current, referees: current.referees.map((item) => (item.id === id ? { ...item, ...patch } : item)) }))

  const stepIndex = STEPS.findIndex((item) => item.id === step)
  const errors = validateStep(step, data)
  const scrollToTop = () => window.requestAnimationFrame(() => document.getElementById("main-content")?.scrollIntoView({ behavior: "smooth", block: "start" }))

  const next = () => {
    const keys = Object.keys(errors)
    if (keys.length > 0) {
      setAttempted(true)
      setShakeCount((count) => count + 1)
      setNotice(`Please complete the highlighted details before continuing (${keys.length} to fix).`)
      window.requestAnimationFrame(() => {
        const element = document.getElementById(`cv-${keys[0]}`)
        element?.scrollIntoView({ behavior: "smooth", block: "center" })
        element?.focus({ preventScroll: true })
      })
      return
    }
    setAttempted(false)
    setNotice(null)
    setStep(STEPS[Math.min(stepIndex + 1, STEPS.length - 1)].id)
    scrollToTop()
  }

  const back = () => {
    setAttempted(false)
    setNotice(null)
    setStep(STEPS[Math.max(stepIndex - 1, 0)].id)
    scrollToTop()
  }

  const handlePhoto = (file?: File) => {
    if (!file) return
    if (!["image/jpeg", "image/png"].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setNotice("Please choose a JPG or PNG photo under 2 MB.")
      return
    }
    setNotice(null)
    const reader = new FileReader()
    reader.onload = () => set("photo", typeof reader.result === "string" ? reader.result : null)
    reader.readAsDataURL(file)
  }

  const addUnique = (list: string[], text: string) => (list.some((item) => item.toLowerCase() === text.toLowerCase()) ? list : [...list, text])

  const whatsappHref = waChatLink("CV Writing / CV Typing", buildCvMessage(data))

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-[1480px] px-5 pb-20 pt-[calc(var(--nav-h)+2rem)] md:px-8">
        <div className="mx-auto mb-6 max-w-[1240px] text-center">
          <ToolBackLink />
          <div className="mb-7"><h1 className="abh-page-title mt-2">CV Writer</h1></div>
          <Stepper step={step} />
          {notice && <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400" role="alert">{notice}</p>}
        </div>

        <div className="cv-editor mx-auto grid max-w-[1240px] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,.9fr)] lg:items-start">
          <section className="min-w-0">
            <FormContext.Provider value={{ attempted, errors }}>
              {step === "style" && (
                <CvCard title="Choose your CV" subtitle="Pick a layout and where you will send it. You can change both later.">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <SelectField id="style" label="CV style" value={data.style} onChange={(value) => set("style", value as CvData["style"])} options={STYLE_OPTIONS} allowEmpty={false} />
                    <SelectField id="region" label="Where is this CV for?" value={data.region} onChange={(value) => set("region", value as CvData["region"])} options={REGION_OPTIONS} allowEmpty={false} />
                  </div>
                  <div className="mt-5 space-y-2 rounded-[14px] bg-muted/60 p-4 text-left text-sm text-muted-foreground">
                    <p>{STYLE_NOTE[data.style]}</p>
                    <p>{REGION_NOTE[data.region]}</p>
                  </div>
                </CvCard>
              )}

              {step === "details" && (
                <CvCard title="Your details" subtitle="Start with the basics. Fields marked * are required.">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField id="fullName" label="Full name" value={data.fullName} onChange={(value) => set("fullName", value)} placeholder="Your first name and surname" required />
                    <SearchableField
                      errorId="professionalTitle"
                      id="cv-professionalTitle"
                      label="Professional title"
                      value={data.professionalTitle}
                      onChange={(value) => set("professionalTitle", value)}
                      options={JOB_TITLE_SUGGESTIONS}
                      allowCustom
                      required
                      placeholder="Search a job title"
                      searchPlaceholder="Type a job title…"
                      hint="The job you are looking for or do best. Pick a common title or type your own."
                    />
                    <TextField id="phone" label="Phone number" value={data.phone} onChange={(value) => set("phone", value)} placeholder="A number employers can reach you on" type="tel" inputMode="tel" required />
                    <TextField id="email" label="Email address" value={data.email} onChange={(value) => set("email", value)} placeholder="name@example.com" type="email" inputMode="email" />
                    {sa ? (
                      <SearchableField
                        errorId="city"
                        id="cv-city"
                        label="Town or city"
                        value={data.city}
                        onChange={(value) => set("city", value)}
                        options={townData.options}
                        loading={townData.loading}
                        allowCustom
                        placeholder="Search a town or city"
                        searchPlaceholder="Type a town or city…"
                        hint={townData.error ?? "Pick a town in your province, or type your own."}
                      />
                    ) : (
                      <TextField id="city" label="Town or city" value={data.city} onChange={(value) => set("city", value)} placeholder="Where you live" />
                    )}
                    {sa ? (
                      <SelectField id="province" label="Province" value={data.province} onChange={(value) => set("province", value)} options={PROVINCES} />
                    ) : (
                      <SelectField id="country" label="Country" value={data.country} onChange={(value) => set("country", value)} options={COUNTRY_OPTIONS} />
                    )}
                    <TextField id="website" label="LinkedIn or portfolio" value={data.website} onChange={(value) => set("website", value)} placeholder="Optional link" />
                    {sa && (
                      <>
                        <SelectField id="driverLicense" label="Driver's licence" value={data.driverLicense} onChange={(value) => set("driverLicense", value)} options={LICENCES} />
                        <TextField id="idNumber" label="ID number" value={data.idNumber} onChange={(value) => set("idNumber", value)} placeholder="13-digit ID number (optional)" hint="Only add this if the employer asks for it." inputMode="numeric" />
                        <DateField id="dateOfBirth" label="Date of birth" mode="day" value={data.dateOfBirth} onChange={(value) => set("dateOfBirth", value)} max={todayValue("day")} initialView="1995-01" hint="Optional" />
                        <SelectField id="nationality" label="Nationality" value={data.nationality} onChange={(value) => set("nationality", value)} options={COUNTRY_OPTIONS} />
                        <SelectField id="maritalStatus" label="Marital status" value={data.maritalStatus} onChange={(value) => set("maritalStatus", value)} options={MARITAL_STATUS} />
                      </>
                    )}
                    <TextField span2 multiline required id="profile" label="About me" value={data.profile} onChange={(value) => set("profile", value)} placeholder="Who you are, what you do best and the role you want." hint="Two to four sentences. Be specific and honest." />
                  </div>
                  {sa && (
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">Optional photo (JPG or PNG, under 2 MB)</span>
                      <div className="flex items-center gap-3">
                        {data.photo && <button type="button" onClick={() => set("photo", null)} className="cv-remove-role"><span>Remove</span></button>}
                        <label className="cv-upload-button inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--brand-orange)]">
                          <FileArrowUp size={18} aria-hidden="true" />
                          <span>{data.photo ? "Choose another" : "Upload photo"}</span>
                          <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => handlePhoto(event.target.files?.[0])} />
                        </label>
                      </div>
                    </div>
                  )}
                </CvCard>
              )}

              {step === "experience" && (
                <CvCard title="Work experience" subtitle="Most recent first. Add every role you want employers to see.">
                  <CheckField label="I have no work experience yet" checked={data.noExperience} onChange={(checked) => set("noExperience", checked)} />
                  {data.noExperience ? (
                    <p className="mt-3 rounded-[14px] bg-muted/60 p-4 text-left text-sm text-muted-foreground">No problem. Your CV will lead with your education, skills and languages. You can add volunteering or short jobs later if you want.</p>
                  ) : (
                    <>
                      <div className="mt-4 space-y-5">
                        {data.roles.map((role, index) => (
                          <RoleEditor key={role.id} role={role} index={index} canRemove={data.roles.length > 1} onChange={(patch) => updateRole(role.id, patch)} onRemove={() => set("roles", data.roles.filter((item) => item.id !== role.id))} />
                        ))}
                      </div>
                      <button type="button" onClick={() => set("roles", [...data.roles, newRole(takeId())])} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-[var(--brand-orange)] py-3 text-sm font-semibold text-[var(--brand-orange)]">
                        <Plus size={16} weight="bold" aria-hidden="true" />
                        <span>Add another role</span>
                      </button>
                    </>
                  )}
                </CvCard>
              )}

              {step === "education" && (
                <CvCard title="Education" subtitle="Add your highest qualification first. Pick the real dates from the calendar.">
                  <div className="space-y-5">
                    {data.education.map((item, index) => (
                      <EducationEditor key={item.id} item={item} index={index} canRemove={data.education.length > 1} region={data.region} onChange={(patch) => updateEducation(item.id, patch)} onRemove={() => set("education", data.education.filter((entry) => entry.id !== item.id))} />
                    ))}
                  </div>
                  <button type="button" onClick={() => set("education", [...data.education, newEducation(takeId())])} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-[var(--brand-orange)] py-3 text-sm font-semibold text-[var(--brand-orange)]">
                    <Plus size={16} weight="bold" aria-hidden="true" />
                    <span>Add another qualification</span>
                  </button>
                </CvCard>
              )}

              {step === "skills" && (
                <CvCard title="Skills and more" subtitle="Add one item at a time and tap Add (or press Enter).">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <ChipField id="skills" label="Skills" required placeholder="One skill, e.g. Customer service" hint="Add skills you can honestly demonstrate. Start typing for suggestions." suggestions={SKILL_SUGGESTIONS} chips={data.skills} onAdd={(text) => set("skills", addUnique(data.skills, text))} onRemove={(index) => set("skills", data.skills.filter((_, i) => i !== index))} />
                    <ChipField id="languages" label="Languages" placeholder="One language" levels={LANGUAGE_LEVELS} suggestions={LANGUAGE_SUGGESTIONS} chips={data.languages.map((item) => `${item.name} — ${item.level}`)} onAdd={(text, level) => set("languages", data.languages.some((item) => item.name.toLowerCase() === text.toLowerCase()) ? data.languages : [...data.languages, { name: text, level }])} onRemove={(index) => set("languages", data.languages.filter((_, i) => i !== index))} />
                    <ChipField id="certifications" label="Certificates and short courses" placeholder="One certificate or course" hint="Optional. Start typing for common certificates, or add your own." suggestions={CERTIFICATION_SUGGESTIONS} chips={data.certifications} onAdd={(text) => set("certifications", addUnique(data.certifications, text))} onRemove={(index) => set("certifications", data.certifications.filter((_, i) => i !== index))} />
                    <div className="sm:col-span-2">
                      <CheckField label="References available on request" checked={data.refsOnRequest} onChange={(checked) => set("refsOnRequest", checked)} />
                      {!data.refsOnRequest && (
                        <div className="mt-3 space-y-5">
                          {data.referees.map((item, index) => (
                            <RefereeEditor key={item.id} item={item} index={index} onChange={(patch) => updateReferee(item.id, patch)} onRemove={() => set("referees", data.referees.filter((entry) => entry.id !== item.id))} />
                          ))}
                          <button type="button" onClick={() => set("referees", [...data.referees, newReferee(takeId())])} className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-[var(--brand-orange)] py-3 text-sm font-semibold text-[var(--brand-orange)]">
                            <Plus size={16} weight="bold" aria-hidden="true" />
                            <span>Add a referee</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </CvCard>
              )}

              {step === "preview" && (
                <CvCard title="Your CV is ready to review" subtitle={`${data.style === "modern" ? "Modern" : "Traditional"} layout · ${sa ? "South Africa" : "International"} · A4 preview`}>
                  <p className="text-left text-sm text-muted-foreground">Check spelling, dates and contact details. Send it to ApexBytesHub on WhatsApp and we can polish and print it for you.</p>
                </CvCard>
              )}

              <div className="mt-5 flex gap-3">
                <button type="button" onClick={back} disabled={stepIndex === 0} className={`${PRIMARY_BUTTON} cv-secondary-button`}><span>Back</span></button>
                {step === "preview" ? (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={PRIMARY_STYLE} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[14px] px-5 font-semibold">
                    <WhatsappLogo size={18} aria-hidden="true" />
                    <span>Send to ApexBytesHub</span>
                  </a>
                ) : (
                  <button key={shakeCount} type="button" onClick={next} style={PRIMARY_STYLE} className={`${PRIMARY_BUTTON} ${shakeCount ? "cv-shake" : ""}`}><span>Continue</span></button>
                )}
              </div>
            </FormContext.Provider>
          </section>

          <aside className="cv-preview-panel hidden rounded-[14px] p-5 lg:block">
            <div className="mb-4 text-sm">A4 preview · updates as you type</div>
            <CvPaper data={data} />
          </aside>

          {step === "preview" && (
            <div className="lg:hidden">
              <CvPaper data={data} />
            </div>
          )}
        </div>

        <ToolHelpAccordion title="CV Writer help" items={CV_HELP} />
      </main>
      <Footer />
    </div>
  )
}
