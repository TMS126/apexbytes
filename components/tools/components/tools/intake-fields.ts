// components/tools/intake-fields.ts
import { HUBS } from "@/lib/data"
import type { HubId } from "@/lib/data/types"
import { HUB_ORDER } from "@/components/quote-calculator/lib"

export type Field = {
  id: string
  label: string
  placeholder: string
  required?: boolean
  multiline?: boolean
  type?: "text" | "email" | "tel" | "date"
  control?: "text" | "select" | "checkbox-group" | "radio-group"
  options?: string[]
  section?: string
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
}

export const SERVICE_OPTIONS: ServiceOption[] = HUB_ORDER.flatMap((hubId) =>
  HUBS[hubId].sections.flatMap((section) =>
    section.items.map((item) => ({
      value: `${hubId}|${section.title}|${item.name}`,
      label: item.name,
      hubId,
      sectionTitle: section.title,
    }))
  )
)

export function displayFieldValue(value: string) {
  return value.replaceAll("||", ", ")
}

const PROVINCES = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"]
const BANKS = ["ABSA", "Capitec", "FNB", "Nedbank", "Standard Bank", "Other"]
const ACCOUNT_TYPES = ["Savings", "Cheque / Current", "Transmission", "Other"]

export const SARS_PATTERN = /sars|tax|efiling|itr12|vat|paye|tcs|penalty|compliance|rav01/

export const INTAKE_BASE_FIELDS: Field[] = [
  { id: "fullName", label: "Full name", placeholder: "Your full name", required: true },
  { id: "phone", label: "Phone number", placeholder: "Your WhatsApp number", required: true, type: "tel" },
  { id: "email", label: "Email address", placeholder: "Optional email", type: "email" },
  { id: "preferredContact", label: "Preferred contact method", placeholder: "Choose one", control: "select", options: ["WhatsApp", "Phone call", "Email"] },
  { id: "province", label: "Province", placeholder: "Choose one", control: "select", options: PROVINCES },
  { id: "deadline", label: "When do you need it?", placeholder: "Choose a date", type: "date", dateRule: "future" },
  { id: "details", label: "What should we know?", placeholder: "Tell us what you need help with, in your own words.", required: true, multiline: true },
]

export const INTAKE_FORM_END_FIELDS: Field[] = [
  { id: "clientSignature", label: "Client signature / authorisation", placeholder: "Type your full name to confirm the details are yours", required: true, section: "Client self-service authorisation" },
  { id: "signatureDate", label: "Date", placeholder: "Choose a date", type: "date", required: true, section: "Client self-service authorisation" },
  { id: "documentsVerified", label: "Documents verified", placeholder: "Select all that apply", control: "checkbox-group", options: ["ID", "Proof of address / bank"], section: "Office use" },
  { id: "addOns", label: "Additional items to include", placeholder: "Select all that apply", control: "checkbox-group", options: ["Printed copy", "Email copy", "WhatsApp / PDF copy"], section: "Office use" },
  { id: "processedBy", label: "Processed by staff", placeholder: "For ApexBytesHub use", section: "Office use" },
]

/** Service-specific questions. Bespoke per-service forms can be added here later. */
export function serviceFields(selected: ServiceOption | undefined): Field[] {
  if (!selected) return []
  const name = selected.label.toLowerCase()

  if (SARS_PATTERN.test(name)) {
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
      { id: "dateOfBirth", label: "Date of birth", placeholder: "Choose a date", type: "date", dateRule: "past", initialView: "1995-01", required: true, section: "1. Personal identification details" },
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
      { id: "addressProvince", label: "Province", placeholder: "Choose one", control: "select", options: PROVINCES, required: true, section: "3. Residential and postal address" },
      { id: "postalCode", label: "Postal code", placeholder: "4-digit postal code", required: true, section: "3. Residential and postal address" },
      { id: "postalAddress", label: "Postal address", placeholder: "If different from residential address", multiline: true, section: "3. Residential and postal address" },
      { id: "bankAccountHolder", label: "Bank account holder full name", placeholder: "Must match ID", section: "4. Personal bank account details" },
      { id: "bankName", label: "Bank name", placeholder: "Choose one", control: "select", options: BANKS, section: "4. Personal bank account details" },
      { id: "accountType", label: "Account type", placeholder: "Choose one", control: "select", options: ACCOUNT_TYPES, section: "4. Personal bank account details" },
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

    if (/return|vat|paye/.test(name)) return [
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
      { id: "newResidentialProvince", label: "New province", placeholder: "Choose one", control: "select", options: PROVINCES, section: "3. Profile details to update on RAV01" },
      { id: "newResidentialPostalCode", label: "New postal code", placeholder: "4-digit postal code", section: "3. Profile details to update on RAV01" },
      { id: "newPostalAddress", label: "New postal address", placeholder: "Write ‘Same as residential’ if applicable", multiline: true, section: "3. Profile details to update on RAV01" },
      { id: "newBankName", label: "New bank name", placeholder: "Choose one", control: "select", options: BANKS, section: "3. Profile details to update on RAV01" },
      { id: "newAccountType", label: "New account type", placeholder: "Choose one", control: "select", options: ACCOUNT_TYPES, section: "3. Profile details to update on RAV01" },
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
  if (/application|sassa|nsfas|online|email|website/.test(name)) return [
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

/** Full ordered field list for the selected service. */
export function buildIntakeFields(selected: ServiceOption | undefined): Field[] {
  if (!selected) return []
  const specific = serviceFields(selected)
  if (SARS_PATTERN.test(selected.label.toLowerCase())) return [...specific, ...INTAKE_FORM_END_FIELDS]
  return [...INTAKE_BASE_FIELDS.slice(0, 3), ...specific, ...INTAKE_BASE_FIELDS.slice(3), ...INTAKE_FORM_END_FIELDS]
}
