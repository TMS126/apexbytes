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
import { ToolHelpAccordion } from "@/components/tools/tool-help-accordion"

type ToolMode = "cv" | "intake"
type Field = {
  id: string
  label: string
  placeholder: string
  required?: boolean
  multiline?: boolean
  type?: "text" | "email" | "tel" | "date"
  control?: "text" | "select" | "checkbox-group" | "radio-group"
  options?: string[]
  section?: string
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
  { id: "location", label: "Location", placeholder: "Town or city" },
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
  { id: "preferredContact", label: "Preferred contact method", placeholder: "Choose one", control: "select", options: ["WhatsApp", "Phone call", "Email"] },
  { id: "province", label: "Province", placeholder: "Choose one", control: "select", options: ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"] },
  { id: "deadline", label: "When do you need it?", placeholder: "Choose a date", type: "date" },
  { id: "details", label: "What should we know?", placeholder: "Tell us what you need help with, in your own words.", required: true, multiline: true },
]

const INTAKE_FORM_END_FIELDS: Field[] = [
  { id: "clientSignature", label: "Client signature / authorisation", placeholder: "Type your full name to confirm the details are yours", required: true, section: "Client self-service authorisation" },
  { id: "signatureDate", label: "Date", placeholder: "Choose a date", type: "date", required: true, section: "Client self-service authorisation" },
  { id: "documentsVerified", label: "Documents verified", placeholder: "Select all that apply", control: "checkbox-group", options: ["ID", "Proof of address / bank"], section: "Office use" },
  { id: "addOns", label: "Additional items to include", placeholder: "Select all that apply", control: "checkbox-group", options: ["Printed copy", "Email copy", "WhatsApp / PDF copy"], section: "Office use" },
  { id: "processedBy", label: "Processed by staff", placeholder: "For ApexBytesHub use", section: "Office use" },
]

function displayFieldValue(value: string) {
  return value.replaceAll("||", ", ")
}

function serviceFields(selected: (typeof SERVICE_OPTIONS)[number] | undefined): Field[] {
  if (!selected) return []
  const name = selected.label.toLowerCase()
  if (/sars|tax|efiling|itr12|vat|pay[e|e]|tcs|penalty|compliance|rav01/.test(name)) {
    const common: Field[] = [
      { id: "fullName", label: "Full names / registered entity name", placeholder: "Exactly as shown on your ID, passport, or registration documents", required: true, section: "1. Taxpayer details and access" },
      { id: "surname", label: "Surname", placeholder: "As shown on your ID or passport", required: true, section: "1. Taxpayer details and access" },
      { id: "idOrPassport", label: "RSA ID, passport, or CIPC registration number", placeholder: "13-digit ID, passport, or registration number", required: true, section: "1. Taxpayer details and access" },
      { id: "taxReference", label: "SARS tax reference number", placeholder: "If known", section: "1. Taxpayer details and access" },
      { id: "phone", label: "Active cellphone for SARS OTP", placeholder: "Number that can receive SARS SMS OTPs", required: true, type: "tel", section: "1. Taxpayer details and access" },
      { id: "email", label: "Current email address", placeholder: "For SARS notices, OTPs, or delivery", type: "email", section: "1. Taxpayer details and access" },
    ]

    if (/registration|new taxpayer|efiling profile/.test(name)) return [
      ...common,
      { id: "dateOfBirth", label: "Date of birth", placeholder: "YYYY-MM-DD", type: "date", required: true, section: "1. Personal identification details" },
      { id: "maritalStatus", label: "Marital status", placeholder: "Choose one", control: "radio-group", options: ["Single", "Married"], section: "1. Personal identification details" },
      { id: "citizenship", label: "Country of citizenship / passport country", placeholder: "Choose one", control: "select", options: ["South Africa", "Botswana", "Eswatini", "Lesotho", "Mozambique", "Namibia", "Zimbabwe", "Other"], required: true, section: "1. Personal identification details" },
      { id: "registrationReason", label: "Reason for registration", placeholder: "Select all that apply", control: "checkbox-group", options: ["Employment", "Bank / bursary", "Other"], section: "1. Personal identification details" },
      { id: "alternativePhone", label: "Alternative contact number", placeholder: "Optional", type: "tel", section: "2. Contact and eFiling login" },
      { id: "efilingUsername", label: "Preferred eFiling username", placeholder: "Choose a username", required: true, section: "2. Contact and eFiling login" },
      { id: "newEmailSetup", label: "New email setup needed?", placeholder: "Choose one", control: "radio-group", options: ["Yes", "No"], section: "2. Contact and eFiling login" },
      { id: "securityQuestion", label: "Security question and answer", placeholder: "For password recovery", section: "2. Contact and eFiling login" },
      { id: "addressLine", label: "Residential address line", placeholder: "Unit / stand number and street name", required: true, section: "3. Residential and postal address" },
      { id: "addressArea", label: "Suburb, township, or village", placeholder: "Area or neighbourhood", required: true, section: "3. Residential and postal address" },
      { id: "addressTown", label: "Town or city", placeholder: "Town or city", required: true, section: "3. Residential and postal address" },
      { id: "addressProvince", label: "Province", placeholder: "Choose one", control: "select", options: ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"], required: true, section: "3. Residential and postal address" },
      { id: "postalCode", label: "Postal code", placeholder: "4-digit postal code", required: true, section: "3. Residential and postal address" },
      { id: "postalAddress", label: "Postal address", placeholder: "If different from residential address", multiline: true, section: "3. Residential and postal address" },
      { id: "bankAccountHolder", label: "Bank account holder full name", placeholder: "Must match ID", section: "4. Personal bank account details" },
      { id: "bankName", label: "Bank name", placeholder: "Choose one", control: "select", options: ["ABSA", "Capitec", "FNB", "Nedbank", "Standard Bank", "Other"], section: "4. Personal bank account details" },
      { id: "accountType", label: "Account type", placeholder: "Choose one", control: "select", options: ["Savings", "Cheque / Current", "Transmission", "Other"], section: "4. Personal bank account details" },
      { id: "bankAccount", label: "Account number", placeholder: "Account number", section: "4. Personal bank account details" },
      { id: "branchCode", label: "Branch code", placeholder: "6-digit branch code", section: "4. Personal bank account details" },
    ]

    if (/penalty|pin recovery|remission/.test(name)) return [
      ...common,
      { id: "efilingUsername", label: "eFiling username", placeholder: "If registered", section: "1. Taxpayer details and eFiling access" },
      { id: "efilingAccess", label: "eFiling access status", placeholder: "Choose one", control: "radio-group", options: ["Have password", "Forgot password / locked"], section: "1. Taxpayer details and eFiling access" },
      { id: "requestedAction", label: "Select required action", placeholder: "Choose one", control: "radio-group", options: ["Tax number / IT150 notice retrieval", "Penalty statement / breakdown check", "Request for remission (RFR01)"], required: true, section: "2. Service requested" },
      { id: "penaltyYears", label: "Tax year(s) penalised", placeholder: "e.g. 2023, 2024, 2025", section: "3. Administrative penalty dispute details" },
      { id: "penaltyAmount", label: "Total penalty amount shown", placeholder: "Amount shown on the SARS statement", section: "3. Administrative penalty dispute details" },
      { id: "lateFilingReason", label: "Primary reason for late filing / non-submission", placeholder: "Select all that apply", control: "checkbox-group", options: ["First-time offender / unaware", "Below tax threshold / unemployed", "Medical / hospitalisation", "Other"], section: "3. Administrative penalty dispute details" },
      { id: "clientExplanation", label: "Client explanation and supporting dates", placeholder: "Explain the circumstances for the RFR01 motivation", multiline: true, required: true, section: "3. Administrative penalty dispute details" },
    ]

    if (/clearance|good standing|tcs/.test(name)) return [
      ...common,
      { id: "applicantType", label: "Applicant type", placeholder: "Choose one", control: "radio-group", options: ["Individual taxpayer", "Registered company (Pty Ltd / CC)"], required: true, section: "1. Applicant / entity details" },
      { id: "vatReference", label: "VAT reference number", placeholder: "If registered", section: "1. Applicant / entity details" },
      { id: "payeReference", label: "PAYE / UIF / SDL number", placeholder: "If registered", section: "1. Applicant / entity details" },
      { id: "efilingUsername", label: "eFiling username", placeholder: "Username", section: "2. eFiling access and OTP verification" },
      { id: "tcsPurpose", label: "Purpose of Tax Compliance Status PIN", placeholder: "Select all that apply", control: "checkbox-group", options: ["Good standing (general)", "Tender / CSD registration", "Employment / licensing", "Foreign investment (FIA)"], required: true, section: "3. Tax Compliance Status request details" },
      { id: "complianceChecks", label: "Pre-submission compliance check", placeholder: "Confirm all that apply", control: "checkbox-group", options: ["All tax returns submitted", "No overdue SARS debt / penalties", "RAV01 details up to date"], section: "3. Tax Compliance Status request details" },
      { id: "requestingInstitution", label: "Requesting institution / tender name", placeholder: "Optional reference", section: "3. Tax Compliance Status request details" },
    ]

    if (/verification|supporting|upload/.test(name)) return [
      ...common,
      { id: "caseReference", label: "SARS case / verification reference number", placeholder: "If available", section: "1. Taxpayer identification and portal access" },
      { id: "efilingUsername", label: "eFiling username or SOQS upload", placeholder: "Username or portal details", section: "1. Taxpayer identification and portal access" },
      { id: "submissionChannel", label: "Submission channel", placeholder: "Select all that apply", control: "checkbox-group", options: ["SARS eFiling", "SARS Online Query (SOQS)"], section: "1. Taxpayer identification and portal access" },
      { id: "supportingDocuments", label: "Supporting documents provided", placeholder: "Tick every document supplied", control: "checkbox-group", options: ["Certified ID / Smart Card", "Selfie holding ID and written note", "Bank statements (3 months)", "Bank confirmation letter", "Proof of residential address", "IRP5 / IT3(a) certificates", "Medical aid / RA certificates", "Logbook / receipts", "Affidavit"], section: "2. Supporting documents provided" },
      { id: "physicalPages", label: "Total physical pages scanned", placeholder: "Number of pages", section: "2. Supporting documents provided" },
      { id: "documentFormat", label: "Document format check", placeholder: "Confirm all that apply", control: "checkbox-group", options: ["Merged PDF", "Under 5 MB per file"], section: "2. Supporting documents provided" },
      { id: "verificationNotes", label: "Additional notes / SARS verification letter instructions", placeholder: "Instructions for the submission", multiline: true, section: "2. Supporting documents provided" },
    ]

    if (/return|vat|pay[e|e]/.test(name)) return [
      ...common,
      { id: "taxPeriod", label: "Tax period / assessment year", placeholder: "e.g. 2026 or 2026/10", required: true, section: "1. Taxpayer / business details" },
      { id: "efilingUsername", label: "eFiling username", placeholder: "Username", section: "1. Taxpayer / business details" },
      { id: "returnType", label: "Select return being submitted", placeholder: "Choose all that apply", control: "checkbox-group", options: ["Individual income tax (ITR12)", "Provisional tax (IRP6)", "VAT return (VAT201)", "PAYE / UIF / SDL (EMP201)"], required: true, section: "2. Return type and supporting certificates" },
      { id: "supportingCertificates", label: "Supporting certificates / schedules provided", placeholder: "Select all supplied", control: "checkbox-group", options: ["IRP5 / IT3(a) salary certificates", "Medical aid tax certificate", "Retirement annuity certificate", "Bank interest IT3(b)", "Travel logbook", "VAT output / input summary", "Payroll / EMP201 figures", "Nil return"], section: "2. Return type and supporting certificates" },
      { id: "bankDetailsVerified", label: "Are bank details on SARS RAV01 correct?", placeholder: "Choose one", control: "radio-group", options: ["Yes, verified", "Needs update"], section: "2. Return type and supporting certificates" },
      { id: "additionalIncome", label: "Additional income / deductions declared?", placeholder: "Choose one", control: "radio-group", options: ["None", "Yes — see notes below"], section: "2. Return type and supporting certificates" },
      { id: "clientFigures", label: "Client figures / declarations to capture", placeholder: "VAT output/input, PAYE totals, other income, or deductions", multiline: true, section: "2. Return type and supporting certificates" },
    ]

    return [
      ...common,
      { id: "documentNeeded", label: "Select document / check needed", placeholder: "Select all that apply", control: "checkbox-group", options: ["Tax status / compliance check", "Statement of Account (SOA)", "Notice of Assessment (ITA34)", "Tax reference number lookup"], required: true, section: "2. Requested enquiry or statement type" },
      { id: "taxYear", label: "Tax year(s) requested", placeholder: "e.g. 2024, 2025, 2026", section: "2. Requested enquiry or statement type" },
      { id: "sarsChannel", label: "Preferred SARS channel", placeholder: "Select all that apply", control: "checkbox-group", options: ["SARS eFiling", "SARS Online Query (SOQS)", "SARS WhatsApp"], section: "2. Requested enquiry or statement type" },
      { id: "newCellphone", label: "New cellphone number", placeholder: "OTP required", type: "tel", section: "3. Profile details to update on RAV01" },
      { id: "newEmail", label: "New email address", placeholder: "OTP required", type: "email", section: "3. Profile details to update on RAV01" },
      { id: "newResidentialAddress", label: "New residential address", placeholder: "Street/stand number and street name", section: "3. Profile details to update on RAV01" },
      { id: "newResidentialArea", label: "New suburb, township, or village", placeholder: "Area or neighbourhood", section: "3. Profile details to update on RAV01" },
      { id: "newResidentialTown", label: "New town or city", placeholder: "Town or city", section: "3. Profile details to update on RAV01" },
      { id: "newResidentialProvince", label: "New province", placeholder: "Choose one", control: "select", options: ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"], section: "3. Profile details to update on RAV01" },
      { id: "newResidentialPostalCode", label: "New postal code", placeholder: "4-digit postal code", section: "3. Profile details to update on RAV01" },
      { id: "newPostalAddress", label: "New postal address", placeholder: "Write ‘Same as residential’ if applicable", multiline: true, section: "3. Profile details to update on RAV01" },
      { id: "newBankName", label: "New bank name", placeholder: "Choose one", control: "select", options: ["ABSA", "Capitec", "FNB", "Nedbank", "Standard Bank", "Other"], section: "3. Profile details to update on RAV01" },
      { id: "newAccountType", label: "New account type", placeholder: "Choose one", control: "select", options: ["Savings", "Cheque / Current", "Transmission", "Other"], section: "3. Profile details to update on RAV01" },
      { id: "newBankAccount", label: "New bank account number", placeholder: "If updating banking", section: "3. Profile details to update on RAV01" },
      { id: "newBranchCode", label: "New branch code", placeholder: "If updating banking", section: "3. Profile details to update on RAV01" },
    ]
  }
  if (/print|copy|laminat|photo|scan/.test(name)) return [
    { id: "quantity", label: "Quantity or number of pages", placeholder: "e.g. 20 pages" },
    { id: "paperSize", label: "Paper size", placeholder: "Choose one", control: "select", options: ["A4", "A3", "A5", "ID / passport size", "Other"] },
    { id: "colour", label: "Colour option", placeholder: "Choose one", control: "select", options: ["Black and white", "Full colour", "Not sure"] },
    { id: "sidedness", label: "Print sidedness", placeholder: "Choose one", control: "select", options: ["Single-sided", "Double-sided", "Not sure"] },
    { id: "fileFormat", label: "File format", placeholder: "Choose one", control: "select", options: ["PDF", "JPG / PNG", "Word document", "Other", "Not sure"] },
    { id: "fileNote", label: "Additional print notes", placeholder: "Finishing, binding, paper preference, or anything else", multiline: true },
  ]
  if (/cv|typing|document|letter|form/.test(name)) return [
    { id: "fileNote", label: "What will you bring or send?", placeholder: "USB, WhatsApp photos, handwritten notes, existing document...", multiline: true },
    { id: "format", label: "Preferred output format", placeholder: "Choose one", control: "select", options: ["Word document", "PDF", "Printed copy", "Word and PDF", "Not sure"] },
  ]
  if (/logo|design|flyer|business|social|invitation/.test(name)) return [
    { id: "deliverable", label: "Design deliverable", placeholder: "Choose one", control: "select", options: ["Logo", "Flyer / poster", "Business card", "Social media graphic", "Invitation", "Other"] },
    { id: "style", label: "Style or colours", placeholder: "Describe the look you want" },
    { id: "fileFormat", label: "Preferred file format", placeholder: "Choose one", control: "select", options: ["PNG", "JPG", "PDF", "PNG and PDF", "Not sure"] },
    { id: "fileNote", label: "Reference or content", placeholder: "Business name, wording, logo files, examples...", multiline: true },
  ]
  if (/application|sassa|sars|nsfas|online|email|website/.test(name)) return [
    { id: "platform", label: "Platform or application", placeholder: "Choose one", control: "select", options: ["SASSA", "SARS eFiling", "NSFAS", "Email", "Website", "Other"] },
    { id: "fileNote", label: "Documents you have ready", placeholder: "ID, proof of address, certificates, login details, etc.", multiline: true },
  ]
  if (/computer|pc|windows|software|setup|repair|tech/.test(name)) return [
    { id: "deviceType", label: "Device type", placeholder: "Choose one", control: "select", options: ["Laptop", "Desktop computer", "Printer", "Phone / tablet", "Router / Wi-Fi", "Other"] },
    { id: "platform", label: "Platform or operating system", placeholder: "Choose one", control: "select", options: ["Windows", "Android", "iPhone / iPad", "macOS", "Linux", "Not sure"] },
    { id: "device", label: "Problem description", placeholder: "Tell us what is not working", multiline: true },
    { id: "fileNote", label: "Anything else we should know?", placeholder: "Error messages, deadline, accessories, etc.", multiline: true },
  ]
  return [{ id: "fileNote", label: "Helpful details or files", placeholder: "Add anything that will help us prepare.", multiline: true }]
}

function updateValue(setValues: React.Dispatch<React.SetStateAction<Record<string, string>>>, id: string, value: string) {
  setValues((current) => ({ ...current, [id]: value }))
}

function InputField({ field, value, onChange }: { field: Field; value: string; onChange: (value: string) => void }) {
  const selectedOptions = value ? value.split("||").filter(Boolean) : []
  const toggleOption = (option: string) => {
    if (field.control === "radio-group") {
      onChange(option)
      return
    }
    onChange(selectedOptions.includes(option) ? selectedOptions.filter((item) => item !== option).join("||") : [...selectedOptions, option].join("||"))
  }

  return (
    <div className={`intake-field ${field.multiline ? "sm:col-span-2" : ""}`}>
      {field.control === "select" ? (
        <>
          <label htmlFor={field.id} className="intake-field-label">{field.label}{field.required ? " *" : ""}</label>
          <select id={field.id} required={field.required} value={value} onChange={(event) => onChange(event.target.value)} className={`intake-control w-full px-1 py-2 text-left text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${value.trim() ? "intake-control-valid" : ""}`}>
            <option value="">{field.placeholder}</option>
            {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </>
      ) : field.control ? (
        <fieldset className="sm:col-span-2 text-left">
          <legend className="intake-field-label">{field.label}{field.required ? " *" : ""}</legend>
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
                    required={field.required && field.control === "radio-group" && !value}
                    onChange={() => toggleOption(option)}
                    className="size-4 accent-[var(--brand-orange)]"
                  />
                  <span>{option}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      ) : (
        <>
          <label htmlFor={field.id} className="intake-field-label">
            {field.label}{field.required ? " *" : ""}
          </label>
          {field.multiline ? (
        <textarea id={field.id} required={field.required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} rows={4} className={`intake-control min-h-24 w-full px-1 py-2 text-left text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${value.trim() ? "intake-control-valid" : ""}`} />
      ) : (
        <input id={field.id} required={field.required} type={field.type ?? "text"} value={value} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} className={`intake-control w-full px-1 py-2 text-left text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${field.type === "date" ? "tool-date-input" : ""} ${value.trim() ? "intake-control-valid" : ""}`} />
      )}
        </>
      )}
    </div>
  )
}

function buildIntakePdf(values: Record<string, string>, selectedLabel: string, fields: Field[]) {
  const pdf = new jsPDF({ unit: "mm", format: "a4" })
  const pageWidth = 210
  const left = 18
  const fieldWidth = pageWidth - left * 2
  let y = 22
  let lastSection = ""
  const addPage = () => { pdf.addPage(); y = 20; lastSection = "" }
  const ensureSpace = (height: number) => { if (y + height > 278) addPage() }

  pdf.setFont("helvetica", "bold"); pdf.setFontSize(17); pdf.text(`${BIZ.name} — Service Intake`, left, y)
  y += 8
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(10); pdf.text(`Service: ${selectedLabel}`, left, y)
  y += 9; pdf.setDrawColor(210, 214, 220); pdf.line(left, y, pageWidth - left, y); y += 8

  fields.forEach((field, index) => {
    if (field.section && field.section !== lastSection) {
      ensureSpace(13)
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); pdf.text(field.section, left, y); y += 6
      lastSection = field.section
    }
    const height = field.multiline ? 17 : 9
    ensureSpace(height + 9)
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(8.5); pdf.text(`${field.label}${field.required ? " *" : ""}`, left, y); y += 2
    const formField = pdf.AcroForm.TextField()
    formField.fieldName = `intake_${index}_${field.id}`
    formField.x = left; formField.y = y; formField.width = fieldWidth; formField.height = height
    formField.fontName = "helvetica"; formField.fontSize = 9; formField.required = Boolean(field.required)
    formField.multiline = Boolean(field.multiline); formField.value = displayFieldValue(values[field.id] ?? ""); formField.defaultValue = formField.value
    pdf.addField(formField)
    y += height + 6
  })

  ensureSpace(8); pdf.setFont("helvetica", "italic"); pdf.setFontSize(8)
  pdf.text("Please review the completed fields before sending this form to ApexBytesHub.", left, y)
  return pdf.output("blob")
}

type CvStep = "details" | "experience" | "education" | "preview"

const CV_STEPS: { id: CvStep; label: string }[] = [
  { id: "details", label: "Details" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "preview", label: "Preview" },
]

const CV_HELP = [
  { question: "What information do I need before I start?", answer: "Prepare your contact details, professional title, short summary, work history, education, and skills. Required details are marked with an asterisk and must be completed before you can continue." },
  { question: "Can I add more than one job?", answer: "Yes. Add each relevant role from the most recent backwards. Include the employer, dates, responsibilities, and achievements so the preview can present your experience clearly." },
  { question: "Can I include a photo?", answer: "Yes, you can add a JPG or PNG photo under 2 MB. A photo is optional and can be replaced before you review the CV." },
  { question: "What happens when I finish?", answer: "You can review the sample-based CV layout on this page and send the completed details to ApexBytesHub on WhatsApp for assistance." },
]

const INTAKE_HELP = [
  { question: "Why do I choose a service first?", answer: "Choosing a service lets us show only the questions needed for that request, keeping the form shorter and easier to complete." },
  { question: "Which fields are required?", answer: "Required fields are marked with an asterisk. Your browser will not submit the form while required information is missing." },
  { question: "Can I review the details before sending them?", answer: "Yes. After reviewing your request, you can download or share a fillable PDF, or send the details to ApexBytesHub on WhatsApp." },
  { question: "Is my information sent automatically?", answer: "No. You choose whether to download, share, or send your completed details. The form does not send anything without your action." },
]

const REQUIRED_CV_FIELDS = new Set(["fullName", "professionalTitle", "phone", "profile", "educationType", "educationYear", "qualification", "institution", "skills"])

function isRequiredCvField(id: string) {
  return REQUIRED_CV_FIELDS.has(id) || /role-\d+-(title|company|startDate|responsibilities)$/.test(id)
}

function missingCvFields(step: CvStep, values: Record<string, string>, roles: CvRole[]) {
  if (step === "details") return ["fullName", "professionalTitle", "phone", "profile"].filter((id) => !values[id]?.trim())
  if (step === "experience") return roles.flatMap((role, index) => ["title", "company", "startDate", "responsibilities"].filter((field) => !values[`role-${role.id}-${field}`]?.trim()).map((field) => `Role ${index + 1}: ${field}`))
  if (step === "education") return ["educationType", "educationYear", "qualification", "institution", "skills"].filter((id) => !values[id]?.trim())
  return []
}

function CvStepField({ id, label, value, onChange, placeholder, multiline = false, type = "text" }: { id: string; label: string; value: string; onChange: (value: string) => void; placeholder: string; multiline?: boolean; type?: string }) {
  const required = isRequiredCvField(id)
  return <label className={`cv-editor-field block text-left text-sm font-medium text-foreground ${value.trim() ? "cv-editor-field-valid" : ""}`} htmlFor={`cv-${id}`}>
    <span className="mb-2 block">{label}{required ? " *" : ""}</span>
    {multiline ? <textarea id={`cv-${id}`} required={required} aria-required={required} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} /> : <input id={`cv-${id}`} required={required} aria-required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={type === "date" ? "tool-date-input" : undefined} />}
  </label>
}

function CvStepSelect({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  const required = isRequiredCvField(id)
  return <label className={`cv-editor-field block text-left text-sm font-medium text-foreground ${value.trim() ? "cv-editor-field-valid" : ""}`} htmlFor={`cv-${id}`}>
    <span className="mb-2 block">{label}{required ? " *" : ""}</span>
    <select id={`cv-${id}`} required={required} aria-required={required} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">Choose one</option>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
}

type CvRole = { id: number }

function CvEditorCard({ children }: { children: React.ReactNode }) {
  return <div className="cv-editor-card rounded-[14px] p-5 shadow-[0_8px_28px_-22px_rgba(15,23,42,.55)] md:p-7">{children}</div>
}

function CvSteps({ step, invalidSteps }: { step: CvStep; invalidSteps: Partial<Record<CvStep, boolean>> }) {
  const current = CV_STEPS.findIndex((item) => item.id === step)
  return <div className="cv-stepper flex items-center gap-2 text-xs md:gap-3">
    {CV_STEPS.map((item, index) => <div key={item.id} className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
      <div className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${index < current && !invalidSteps[item.id] ? "bg-emerald-500 text-[#052e16]" : index === current ? "bg-[var(--brand-orange)] text-[var(--on-brand-orange)]" : "cv-step-muted"}`}>{index < current ? (invalidSteps[item.id] ? "?" : "✓") : index + 1}</div>
      <span className={`hidden truncate md:block ${index === current ? "font-semibold cv-step-active" : ""}`}>{item.label}</span>
      {index < CV_STEPS.length - 1 && <span className="cv-step-line h-px flex-1" />}
    </div>)}
  </div>
}

function CvPaperPreview({ values, photo, roles }: { values: Record<string, string>; photo: string | null; roles: CvRole[] }) {
  const roleValue = (role: CvRole, field: string) => values[`role-${role.id}-${field}`] ?? ""
  return <div className="cv-paper mx-auto w-full max-w-[560px] bg-white p-6 text-left text-slate-900 shadow-[0_18px_42px_-24px_rgba(15,23,42,.6)] md:p-8">
    <header className="bg-[#1688c4] px-5 py-4 text-white">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0"><h2 className="truncate text-2xl font-bold tracking-tight">{values.fullName || "Your name"}</h2><p className="mt-0.5 text-xs font-medium uppercase tracking-[0.12em]">{values.professionalTitle || "Professional title"}</p></div>
        {photo && <Image unoptimized src={photo} alt="Profile" width={64} height={64} className="size-16 shrink-0 rounded-full object-cover" />}
      </div>
    </header>
    <div className="grid gap-6 px-1 pt-6 sm:grid-cols-[0.72fr_1.28fr] sm:gap-7">
      <aside className="space-y-5 text-[0.68rem] leading-4">
        <section><h3 className="cv-paper-heading">CONTACT</h3><p className="mt-2 whitespace-pre-line text-slate-600">{[values.phone, values.email, values.location].filter(Boolean).join("\n") || "Phone\nEmail\nTown or city"}</p>{values.website && <p className="mt-2 break-words text-slate-600">{values.website}</p>}</section>
        <section><h3 className="cv-paper-heading">EDUCATION</h3><p className="mt-2 whitespace-pre-line text-slate-600">{[values.qualification, values.institution, values.educationYear].filter(Boolean).join("\n") || "Qualification\nInstitution\nYear"}</p></section>
        <section><h3 className="cv-paper-heading">RELEVANT SKILLS</h3><p className="mt-2 whitespace-pre-line text-slate-600">{values.skills || "Your skills will appear here."}</p></section>
        {values.certifications && <section><h3 className="cv-paper-heading">CERTIFICATIONS</h3><p className="mt-2 whitespace-pre-line text-slate-600">{values.certifications}</p></section>}
      </aside>
      <main className="space-y-5 text-[0.68rem] leading-4">
        <section><h3 className="cv-paper-heading">ABOUT ME</h3><p className="mt-2 whitespace-pre-line text-slate-600">{values.profile || "Your professional summary will appear here."}</p></section>
        <section><h3 className="cv-paper-heading">PROFESSIONAL EXPERIENCE</h3><div className="mt-3 space-y-4">{roles.map((role) => <article key={role.id}><div className="flex items-start justify-between gap-3"><div><h4 className="text-xs font-bold">{roleValue(role, "title") || "Job title"}</h4><p className="text-[0.65rem] text-slate-500">{roleValue(role, "company") || "Company"}{roleValue(role, "employmentType") ? ` · ${roleValue(role, "employmentType")}` : ""}</p></div><span className="shrink-0 text-right text-[0.6rem] text-slate-500">{roleValue(role, "startDate") || "Start"} — {roleValue(role, "endDate") || "Present"}</span></div><p className="mt-1 whitespace-pre-line text-slate-600">{roleValue(role, "responsibilities") || "Responsibilities and achievements will appear here."}</p></article>)}</div></section>
        {values.languages && <section><h3 className="cv-paper-heading">LANGUAGES</h3><p className="mt-2 whitespace-pre-line text-slate-600">{values.languages}</p></section>}
        {values.references && <section><h3 className="cv-paper-heading">REFERENCES</h3><p className="mt-2 whitespace-pre-line text-slate-600">{values.references}</p></section>}
      </main>
    </div>
  </div>
}

function CvTool() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [roles, setRoles] = useState<CvRole[]>([{ id: 1 }])
  const [photo, setPhoto] = useState<string | null>(null)
  const [step, setStep] = useState<CvStep>("details")
  const [invalidSteps, setInvalidSteps] = useState<Partial<Record<CvStep, boolean>>>({})
  const [shareError, setShareError] = useState<string | null>(null)
  const setValue = (id: string, value: string) => updateValue(setValues, id, value)
  const roleValue = (role: CvRole, field: string) => values[`role-${role.id}-${field}`] ?? ""
  const addRole = () => setRoles((current) => [...current, { id: Math.max(...current.map((role) => role.id), 0) + 1 }])
  const removeRole = (id: number) => setRoles((current) => current.length === 1 ? current : current.filter((role) => role.id !== id))
  const handlePhoto = (file?: File) => { if (!file) return; if (!["image/jpeg", "image/png"].includes(file.type) || file.size > 2 * 1024 * 1024) { setShareError("Please choose a JPG or PNG photo under 2 MB."); return } setShareError(null); const reader = new FileReader(); reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null); reader.readAsDataURL(file) }
  const shareDetails = () => { setShareError(null); const summary = [...CV_FIELDS, { id: "driverLicense", label: "Driver's licence", placeholder: "" }].map((field) => `${field.label}: ${values[field.id] || "Not provided"}`).join("\n"); const work = roles.map((role, index) => `\nRole ${index + 1}: ${roleValue(role, "title")} at ${roleValue(role, "company")} (${roleValue(role, "startDate")} — ${roleValue(role, "endDate") || "Present"})\n${roleValue(role, "responsibilities")}`).join("\n"); const opened = window.open(waChatLink("CV Writing / CV Typing", `${summary}${work}\nTemplate: ApexBytesHub sample CV\nPhoto: ${photo ? "Included" : "Not included"}`), "_blank", "noopener,noreferrer"); if (!opened) setShareError("WhatsApp could not open. Please allow pop-ups or use the contact page.") }
  const stepIndex = CV_STEPS.findIndex((item) => item.id === step)
  const missing = missingCvFields(step, values, roles)
  const next = () => {
    if (missing.length > 0) {
      setInvalidSteps((current) => ({ ...current, [step]: true }))
      setShareError(`Please complete the required CV details before continuing (${missing.length} remaining).`)
      return
    }
    setInvalidSteps((current) => ({ ...current, [step]: false }))
    setShareError(null)
    setStep(CV_STEPS[Math.min(stepIndex + 1, CV_STEPS.length - 1)].id)
  }
  const back = () => setStep(CV_STEPS[Math.max(stepIndex - 1, 0)].id)

  return <div className="min-h-screen bg-background text-foreground"><Navbar /><PageNoticeBell page="tools" /><main id="main-content" className="mx-auto w-full max-w-[1480px] px-5 pb-20 pt-[calc(var(--nav-h)+2rem)] md:px-8">
    <div className="mx-auto mb-6 max-w-[1240px] text-center"><ToolBackLink /><div className="mb-7"><h1 className="abh-page-title mt-2">CV Writer</h1></div><CvSteps step={step} invalidSteps={invalidSteps} />{invalidSteps[step] && missing.length > 0 && <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400" role="alert">Complete the required details marked with * before continuing.</p>}</div>
    <div className="cv-editor mx-auto grid max-w-[1240px] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(420px,.9fr)] lg:items-start"><section className="min-w-0">
      {step === "details" && <CvEditorCard><h2 className="text-2xl font-bold">Your details</h2><p className="mt-1 text-sm text-muted-foreground">Start with the basics.</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><CvStepField id="fullName" label="Full name" value={values.fullName ?? ""} onChange={(v) => setValue("fullName", v)} placeholder="e.g. Thabo Mokoena" /><CvStepField id="professionalTitle" label="Professional title" value={values.professionalTitle ?? ""} onChange={(v) => setValue("professionalTitle", v)} placeholder="e.g. Junior Bookkeeper" /><CvStepField id="phone" label="Phone number" value={values.phone ?? ""} onChange={(v) => setValue("phone", v)} placeholder="Your best contact number" type="tel" /><CvStepField id="email" label="Email address" value={values.email ?? ""} onChange={(v) => setValue("email", v)} placeholder="you@example.com" type="email" /><CvStepField id="location" label="Town or city" value={values.location ?? ""} onChange={(v) => setValue("location", v)} placeholder="e.g. Bothaville" /><CvStepSelect id="province" label="Province" value={values.province ?? ""} onChange={(v) => setValue("province", v)} options={["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"]} /><CvStepSelect id="driverLicense" label="Driver's licence" value={values.driverLicense ?? ""} onChange={(v) => setValue("driverLicense", v)} options={["No licence", "Code 8 / B", "Code 10 / C1", "Code 14 / EC", "Other"]} /><CvStepField id="profile" label="About me" value={values.profile ?? ""} onChange={(v) => setValue("profile", v)} placeholder="A short, confident introduction about your experience and goals." multiline /></div><div className="mt-6 flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">Optional photo</span><label className="cv-upload-button inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--brand-orange)]"><FileArrowUp size={18} /> {photo ? "Choose another" : "Upload photo"}<input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(event) => handlePhoto(event.target.files?.[0])} /></label></div></CvEditorCard>}
      {step === "experience" && <CvEditorCard><div className="flex items-start justify-between gap-4"><div><h2 className="text-2xl font-bold">Work experience</h2><p className="mt-1 text-sm text-muted-foreground">Most recent first. Add every role you want employers to see.</p></div><span className="cv-count-label">{roles.length} {roles.length === 1 ? "role" : "roles"}</span></div><div className="mt-6 space-y-5">{roles.map((role, index) => <div key={role.id} className="cv-role-panel"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">Role {index + 1}</h3>{roles.length > 1 && <button type="button" onClick={() => removeRole(role.id)} className="cv-remove-role">Remove</button>}</div><div className="grid gap-5 sm:grid-cols-2"><CvStepField id={`role-${role.id}-title`} label="Job title" value={roleValue(role, "title")} onChange={(v) => setValue(`role-${role.id}-title`, v)} placeholder="e.g. Junior Bookkeeper" /><CvStepField id={`role-${role.id}-company`} label="Company" value={roleValue(role, "company")} onChange={(v) => setValue(`role-${role.id}-company`, v)} placeholder="e.g. Bothaville Motors" /><CvStepField id={`role-${role.id}-startDate`} label="Start date" value={roleValue(role, "startDate")} onChange={(v) => setValue(`role-${role.id}-startDate`, v)} placeholder="Choose a date" type="date" /><CvStepSelect id={`role-${role.id}-employmentType`} label="Employment type" value={roleValue(role, "employmentType")} onChange={(v) => setValue(`role-${role.id}-employmentType`, v)} options={["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Volunteer"]} /><CvStepField id={`role-${role.id}-endDate`} label="End date" value={roleValue(role, "endDate")} onChange={(v) => setValue(`role-${role.id}-endDate`, v)} placeholder="Leave blank if current" type="date" /><CvStepField id={`role-${role.id}-responsibilities`} label="Responsibilities and achievements" value={roleValue(role, "responsibilities")} onChange={(v) => setValue(`role-${role.id}-responsibilities`, v)} placeholder="Use a new line for each responsibility or achievement" multiline /></div></div>)}</div><button type="button" onClick={addRole} className="mt-5 flex w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-[var(--brand-orange)] py-3 text-sm font-semibold text-[var(--brand-orange)]">＋ Add another role</button></CvEditorCard>}
      {step === "education" && <CvEditorCard><h2 className="text-2xl font-bold">Education and skills</h2><p className="mt-1 text-sm text-muted-foreground">Add the details employers need.</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><CvStepSelect id="educationType" label="Qualification type" value={values.educationType ?? ""} onChange={(v) => setValue("educationType", v)} options={["High school", "Certificate", "National certificate", "Diploma", "Degree", "Short course", "Other"]} /><CvStepSelect id="educationYear" label="Completion year" value={values.educationYear ?? ""} onChange={(v) => setValue("educationYear", v)} options={["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019 or earlier", "Currently studying"]} /><CvStepField id="qualification" label="Qualification or subject" value={values.qualification ?? ""} onChange={(v) => setValue("qualification", v)} placeholder="e.g. National Certificate: Accounting" /><CvStepField id="institution" label="Institution" value={values.institution ?? ""} onChange={(v) => setValue("institution", v)} placeholder="School, college, or university" /><CvStepField id="skills" label="Skills" value={values.skills ?? ""} onChange={(v) => setValue("skills", v)} placeholder="Bookkeeping, Sage, Excel, Reconciliation" multiline /><CvStepField id="certifications" label="Certificates and achievements" value={values.certifications ?? ""} onChange={(v) => setValue("certifications", v)} placeholder="Optional certificates, awards or short courses" multiline /><CvStepField id="references" label="References" value={values.references ?? ""} onChange={(v) => setValue("references", v)} placeholder="Available on request, or add contact details" multiline /></div></CvEditorCard>}
      {step === "preview" && <CvEditorCard><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-2xl font-bold">Your CV is ready to review</h2><p className="mt-1 text-sm text-muted-foreground">One polished sample-based layout · A4 preview</p></div><button type="button" onClick={shareDetails} className="inline-flex items-center gap-2 rounded-[14px] bg-[var(--brand-orange)] px-4 py-3 text-sm font-semibold text-[var(--on-brand-orange)] shadow-[0_10px_20px_-12px_rgba(250,82,21,.8)]"><WhatsappLogo size={18} /> Send to ApexBytesHub</button></div>{shareError && <p className="mt-4 text-sm text-red-600" role="alert">{shareError}</p>}</CvEditorCard>}
      <div className="mt-5 flex gap-3"><button type="button" onClick={back} disabled={stepIndex === 0} className="min-h-12 flex-1 rounded-[14px] cv-secondary-button px-5 font-semibold disabled:opacity-45">Back</button><button type="button" onClick={next} disabled={step === "preview"} className="min-h-12 flex-1 rounded-[14px] bg-[var(--brand-orange)] px-5 font-semibold text-[var(--on-brand-orange)] shadow-[0_10px_20px_-12px_rgba(250,82,21,.8)] disabled:opacity-45">{step === "preview" ? "Done" : "Continue"}</button></div>
    </section><aside className="cv-preview-panel hidden rounded-[14px] p-5 lg:block"><div className="mb-4 flex items-center justify-between text-sm"><span>📄 A4 — 1 page</span><span>− &nbsp; 100% &nbsp; +</span></div><CvPaperPreview values={values} photo={photo} roles={roles} /></aside>{step === "preview" && <div className="lg:hidden"><CvPaperPreview values={values} photo={photo} roles={roles} /></div>}</div><ToolHelpAccordion title="CV Writer help" items={CV_HELP} />
  </main><PageScrollControls /><Footer /></div>
}

function IntakeTool() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [shareError, setShareError] = useState<string | null>(null)
  const selected = SERVICE_OPTIONS.find((option) => option.value === values.service)
  const fields = useMemo(() => {
    if (!selected) return []
    const isStructuredSars = /sars|tax|efiling|itr12|vat|pay[e|e]|tcs|penalty|compliance|rav01/.test(selected.label.toLowerCase())
    return isStructuredSars ? [...serviceFields(selected), ...INTAKE_FORM_END_FIELDS] : [...INTAKE_BASE_FIELDS.slice(0, 3), ...serviceFields(selected), ...INTAKE_BASE_FIELDS.slice(3), ...INTAKE_FORM_END_FIELDS]
  }, [selected])
  const sharePdf = async () => {
    if (!selected) return
    setShareError(null)
    const blob = buildIntakePdf(values, selected.label, fields)
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
  const downloadPdf = () => {
    if (!selected) return
    const blob = buildIntakePdf(values, selected.label, fields)
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `apexbyteshub-${selected.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-intake-form.pdf`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  const shareText = () => {
    if (!selected) return
    const summary = fields.map((field) => `${field.label}: ${displayFieldValue(values[field.id] || "Not provided")}`).join("\n")
    const opened = window.open(waChatLink(selected.label, summary), "_blank", "noopener,noreferrer")
    if (!opened) setShareError("WhatsApp could not open. Please allow pop-ups or use the contact page.")
  }

  return <ToolShell title="Tell us what you need" description="Choose one service first. We will then ask only for the details that help us prepare your request properly.">
    <div className="intake-document mx-auto max-w-5xl p-5 text-left md:p-8">
      <header className="intake-document-header">
        <div>
          <p className="intake-brand-line">A P E X B Y T E S H U B</p>
          <p className="intake-brand-tagline">DESIGN · PRINT · UPGRADE · E-SERVICE HUB</p>
        </div>
        <div className="intake-contact-line">WhatsApp &amp; enquiries: {BIZ.phone}</div>
      </header>
      <div className="intake-document-title-row">
        <div>
          <h2 className="intake-document-title">{selected ? `${selected.label} Intake Form` : "Client Service Intake Form"}</h2>
          <p className="intake-document-note">Please complete the form clearly. Fields marked * are required.</p>
        </div>
        <label htmlFor="service" className="intake-service-picker"><span>Service *</span><select id="service" required value={values.service ?? ""} onChange={(event) => { setValues({ service: event.target.value }); setSubmitted(false) }}><option value="">Select a service</option>{HUB_ORDER.map((hubId) => <optgroup key={hubId} label={HUBS[hubId].title}>{SERVICE_OPTIONS.filter((option) => option.hubId === hubId).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</optgroup>)}</select></label>
      </div>
      {selected && <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true) }} className="intake-form-grid mt-7"><div className="intake-selected-service sm:col-span-2"><strong>Selected service:</strong> {selected.label} <span>· {selected.sectionTitle}</span></div>{fields.map((field, index) => <div key={`${selected.value}-${field.id}`} className={field.section && field.section !== fields[index - 1]?.section ? "contents" : "contents"}>{field.section && field.section !== fields[index - 1]?.section && <><h2 className="intake-section-heading sm:col-span-2">{field.section}</h2>{field.section === "Client self-service authorisation" && <p className="intake-authorisation sm:col-span-2">I confirm the details above are accurate and belong to me. I authorise ApexBytesHub to assist while I am present to verify entries and approve any SARS One-Time PINs (OTPs).</p>}</>}<InputField field={field} value={values[field.id] ?? ""} onChange={(value) => updateValue(setValues, field.id, value)} /></div>)}<button type="submit" className="abh-btn-primary intake-review-button inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-bold sm:col-span-2"><CheckCircle size={19} /> Review my request</button></form>}
    </div>
    {shareError && <p className="mt-4 text-sm text-red-600 dark:text-red-300" role="alert">{shareError}</p>}
      {submitted && selected && <section className="mt-8 abh-card p-5 text-center md:p-8" aria-live="polite"><h2 className="text-2xl font-semibold">{selected.label}</h2><dl className="mt-6 grid gap-4 text-center sm:grid-cols-2">{fields.map((field) => <div key={field.id}><dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{field.label}</dt><dd className="mt-1 whitespace-pre-line break-words text-sm text-foreground">{displayFieldValue(values[field.id] || "Not provided")}</dd></div>)}</dl><div className="mt-7 flex flex-wrap justify-center gap-3"><button type="button" onClick={downloadPdf} className="abh-btn-primary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"><DownloadSimple size={18} /> Download fillable PDF</button><button type="button" onClick={() => void sharePdf()} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold"><FileArrowUp size={18} /> Share PDF</button><button type="button" onClick={shareText} className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-whatsapp)] px-4 py-2.5 text-sm font-semibold text-[var(--on-whatsapp)]"><PaperPlaneTilt size={18} /> Send details on WhatsApp</button></div><p className="mt-4 text-sm text-muted-foreground">The download contains editable PDF fields. You can complete or update it in a PDF app before sending it to ApexBytesHub.</p></section>}
  </ToolShell>
}

function ToolShell({ title, children }: { title: string; description?: string; children: React.ReactNode }) {
  return <div className="min-h-screen bg-background"><Navbar /><PageNoticeBell page="tools" /><main id="main-content" className="mx-auto w-full max-w-6xl px-5 pb-20 pt-[calc(var(--nav-h)+2.5rem)] text-center md:px-8"><ToolBackLink /><header className="mx-auto mb-9 max-w-3xl"><h1 className="abh-page-title mb-3">{title}</h1></header>{children}<ToolHelpAccordion title="Intake Form help" items={INTAKE_HELP} /></main><PageScrollControls /><Footer /></div>
}

export function ToolForm({ mode }: { mode: ToolMode }) {
  return mode === "cv" ? <CvTool /> : <IntakeTool />
}
