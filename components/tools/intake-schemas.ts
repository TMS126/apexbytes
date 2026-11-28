// components/tools/intake-schemas.ts
import type { Field, ServiceSchema } from "./intake-types"

const PROVINCES = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"]
const BANK_NAMES = ["ABSA", "Capitec", "FNB", "Nedbank", "Standard Bank", "TymeBank", "African Bank", "Discovery Bank", "Bank Zero", "Other"]
const ACCOUNT_TYPES = ["Savings", "Cheque / Current", "Transmission", "Other"]
const CONTACT_METHODS = ["WhatsApp", "Phone call", "Email"]
const YES_NO = ["Yes", "No"]
const YES_NO_UNSURE = ["Yes", "No", "Not sure"]
const NATIONALITIES = ["South African", "Zimbabwean", "Mozambican", "Lesotho", "Swati", "Botswanan", "Namibian", "Malawian", "Zambian", "Other"]
const INDUSTRIES = ["Administration", "Agriculture", "Beauty and wellness", "Construction", "Creative and design", "Education", "Finance", "Government", "Health", "Hospitality", "IT and technology", "Legal", "Logistics", "Manufacturing", "Retail", "Security", "Transport", "Other"]
const STYLE_DIRECTIONS = ["Modern", "Minimal", "Bold", "Classic", "Playful", "Luxury", "Rustic", "Tech", "Other"]
const COLOUR_PREFERENCES = ["Blue", "Orange", "Green", "Red", "Black and white", "Earth tones", "Pastel", "No preference", "Other"]
const DESIGN_ASSETS = ["Logo", "Photos", "Product images", "Brand guide", "None"]
const DESIGN_FORMATS = ["PNG", "JPG", "PDF", "SVG", "Print-ready PDF", "Editable source file", "Not sure"]
const FILE_SOURCES = ["USB / flash drive", "WhatsApp", "Email", "Google Drive link", "Printed original", "Other"]
const FINISHING = ["None", "Staple", "Paper clip", "Fold", "Bind", "Other"]

function f(id: string, label: string, placeholder: string, extra: Partial<Field> = {}): Field {
  return { id, label, placeholder, ...extra }
}
function req(id: string, label: string, placeholder: string, extra: Partial<Field> = {}): Field {
  return f(id, label, placeholder, { ...extra, required: true })
}
function area(id: string, label: string, placeholder: string, extra: Partial<Field> = {}): Field {
  return f(id, label, placeholder, { ...extra, multiline: true })
}
function sel(id: string, label: string, placeholder: string, options: string[], extra: Partial<Field> = {}): Field {
  return f(id, label, placeholder, { ...extra, control: "select", options })
}
function check(id: string, label: string, placeholder: string, options: string[], extra: Partial<Field> = {}): Field {
  return f(id, label, placeholder, { ...extra, control: "checkbox-group", options })
}
function radio(id: string, label: string, options: string[], extra: Partial<Field> = {}): Field {
  return f(id, label, "Choose one", { ...extra, control: "radio-group", options })
}
function date(id: string, label: string, placeholder: string, extra: Partial<Field> = {}): Field {
  return f(id, label, placeholder, { ...extra, type: "date" })
}
function sec(section: string, fields: Field[]): Field[] {
  return fields.map((field) => ({ ...field, section }))
}
function client(section = "1. Your details"): Field[] {
  return sec(section, [
    req("fullName", "Full name", "Your full name"),
    req("phone", "WhatsApp number", "Number we can reach you on", { type: "tel" }),
    f("email", "Email address", "Optional email", { type: "email" }),
    sel("preferredContact", "Preferred contact method", "Choose one", CONTACT_METHODS),
    sel("province", "Province", "Choose one", PROVINCES),
  ])
}
function deadline(section = "Final details"): Field[] {
  return sec(section, [
    date("deadline", "When do you need it?", "Choose a date", { dateRule: "future" }),
    area("finalNotes", "Anything else we should know?", "Add any detail that will help us prepare."),
  ])
}
function authorisation(): Field[] {
  return sec("Authorisation", [
    req("clientSignature", "Type your full name to authorise", "Your full name"),
    date("signatureDate", "Date", "Choose a date", { required: true }),
    check("consent", "I confirm the details are mine and I authorise ApexBytesHub to assist", "Select to confirm", ["I confirm"], { required: true }),
  ])
}
function identityFields(section = "2. Identity"): Field[] {
  return sec(section, [
    sel("idType", "Identity document", "Choose one", ["SA ID / Smart ID", "Passport", "Asylum permit", "Refugee permit", "Birth certificate", "Other"], { required: true }),
    req("idNumber", "ID or passport number", "The number exactly as printed"),
    date("dateOfBirth", "Date of birth", "Choose a date", { dateRule: "past", initialView: "1995-01" }),
    sel("nationality", "Nationality", "Choose one", NATIONALITIES),
  ])
}
function addressFields(section = "Address"): Field[] {
  return sec(section, [
    req("addressLine", "Street address", "Unit / stand number and street name"),
    req("addressSuburb", "Suburb, township or village", "Area or neighbourhood"),
    req("addressTown", "Town or city", "Town or city"),
    sel("addressProvince", "Province", "Choose one", PROVINCES, { required: true }),
    req("postalCode", "Postal code", "4-digit postal code"),
    area("postalAddress", "Postal address", "Only if it is different from the street address."),
  ])
}
function bankFields(section = "Bank details"): Field[] {
  return sec(section, [
    req("accountHolder", "Account holder full name", "Must match the bank account"),
    sel("bankName", "Bank name", "Choose one", BANK_NAMES, { required: true }),
    sel("accountType", "Account type", "Choose one", ACCOUNT_TYPES, { required: true }),
    req("accountNumber", "Account number", "Your account number"),
    req("branchCode", "Branch code", "6-digit branch code"),
    radio("bankConfirmation", "Do you have a bank confirmation letter or recent statement?", YES_NO_UNSURE),
  ])
}
function documentChecklist(section: string, options: string[]): Field[] {
  return sec(section, [
    check("documents", "Documents you have ready", "Select all that apply", options),
    area("documentNotes", "Document notes", "Tell us about anything missing, expired, or difficult to obtain."),
  ])
}
function designBase(specific: Field[], specificSection: string): Field[] {
  return [
    ...client("1. Your details"),
    ...sec("2. The business", [
      req("businessName", "Business or brand name", "The name that should appear on the design"),
      sel("industry", "Industry", "Choose one", INDUSTRIES),
      area("targetAudience", "Who is this for?", "Describe the customer or audience you want to reach."),
      area("designPurpose", "What should this design achieve?", "Promotion, launch, event, trust, sales, etc."),
    ]),
    ...sec(specificSection, specific),
    ...sec("Style and references", [
      check("styleDirection", "Style direction", "Select all that apply", STYLE_DIRECTIONS),
      sel("colourPreference", "Colour preference", "Choose one", COLOUR_PREFERENCES),
      area("referenceLinks", "Reference links or examples", "Paste links or describe designs you like."),
      check("assetsAvailable", "What do you already have?", "Select all that apply", DESIGN_ASSETS),
    ]),
    ...sec("Delivery", [
      check("deliveryFormat", "Files you need", "Select all that apply", DESIGN_FORMATS),
      date("deadline", "When do you need it?", "Choose a date", { dateRule: "future" }),
      area("designNotes", "Anything else about the design?", "Words to include, things to avoid, print size, etc."),
    ]),
  ]
}

function sassaBase(specific: Field[], documents: string[]): Field[] {
  return [
    ...client("1. Applicant details"),
    ...identityFields("2. Identity"),
    ...sec("3. Grant details", specific),
    ...documentChecklist("4. Supporting documents", documents),
    ...addressFields("5. Address"),
    ...authorisation(),
  ]
}

function sarsIdentity(): Field[] {
  return sec("2. Tax and identity", [
    sel("taxpayerType", "Taxpayer type", "Choose one", ["Individual", "Company", "Trust", "Partnership", "Not sure"], { required: true }),
    sel("idType", "Identity document", "Choose one", ["SA ID / Smart ID", "Passport", "Asylum permit", "Refugee permit", "Company registration", "Other"], { required: true }),
    req("idNumber", "ID, passport or registration number", "The number exactly as printed"),
    f("taxReference", "SARS tax reference number", "If you know it"),
    f("efilingUsername", "eFiling username", "If you are registered"),
    date("dateOfBirth", "Date of birth", "Choose a date", { dateRule: "past", initialView: "1995-01" }),
  ])
}

function sarsBase(specific: Field[], documents: string[]): Field[] {
  return [
    ...client("1. Taxpayer details"),
    ...sarsIdentity(),
    ...sec("3. Service details", specific),
    ...documentChecklist("4. Supporting documents", documents),
    ...addressFields("5. Tax residence address"),
    ...authorisation(),
  ]
}

function onlineBase(specific: Field[], documents: string[]): Field[] {
  return [
    ...client("1. Applicant details"),
    ...identityFields("2. Identity"),
    ...sec("3. Application details", specific),
    ...documentChecklist("4. Supporting documents", documents),
    ...authorisation(),
  ]
}

function businessBase(specific: Field[], documents: string[]): Field[] {
  return [
    ...client("1. Contact details"),
    ...sec("2. Business details", [
      req("companyName", "Registered business name", "Exactly as registered"),
      req("registrationNumber", "Company registration number", "e.g. 2024/123456/07"),
      sel("companyType", "Business type", "Choose one", ["Pty Ltd", "Close corporation", "Sole proprietor", "NPC", "Other"]),
      f("taxReference", "SARS tax reference number", "If known"),
      f("vatNumber", "VAT number", "If registered"),
    ]),
    ...sec("3. Service details", specific),
    ...documentChecklist("4. Supporting documents", documents),
    ...authorisation(),
  ]
}

function techBase(specific: Field[], sectionTitle = "3. The issue"): Field[] {
  return [
    ...client("1. Your details"),
    ...sec("2. Device", [
      sel("deviceType", "Device type", "Choose one", ["Laptop", "Desktop computer", "Printer", "Phone / tablet", "Router / Wi-Fi", "Other"], { required: true }),
      f("deviceMake", "Make", "e.g. HP, Lenovo, Dell, Canon"),
      f("deviceModel", "Model", "The model name or number"),
      sel("operatingSystem", "Operating system", "Choose one", ["Windows 10", "Windows 11", "macOS", "Android", "iOS", "Linux", "Not sure"]),
      sel("deviceAge", "How old is the device?", "Choose one", ["Under 1 year", "1–2 years", "3–5 years", "5+ years", "Not sure"]),
    ]),
    ...sec(sectionTitle, specific),
    ...sec("4. Service logistics", [
      radio("backup", "Is your data backed up?", YES_NO_UNSURE),
      radio("charger", "Will you bring the charger?", YES_NO),
      sel("dropOff", "How would you like to be helped?", "Choose one", ["Walk-in", "Appointment", "Remote support"]),
      area("techNotes", "Anything else we should know?", "Error messages, accessories, deadline, or recent changes."),
    ]),
  ]
}

export const SERVICE_SCHEMAS: Record<string, ServiceSchema> = {
  // ---------------------------------------------------------------- PRINT
  "print|Printing|B&W Page Printing": {
    intro: "Tell us what you are printing, how many pages, and how you will send the file.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Print job", [
        sel("documentType", "What are you printing?", "Choose one", ["Document", "Assignment", "CV", "Form / application", "Notice / letter", "Other"], { required: true }),
        req("pageCount", "How many pages?", "e.g. 12", { type: "number" }),
        req("copies", "How many copies?", "e.g. 1", { type: "number" }),
        sel("paperSize", "Paper size", "Choose one", ["A4", "A3", "A5", "Other"], { required: true }),
        sel("sidedness", "Print sides", "Choose one", ["Single-sided", "Double-sided", "Not sure"]),
        check("finishing", "Finishing", "Select all that apply", FINISHING),
        sel("printSource", "How will you send the file?", "Choose one", FILE_SOURCES, { required: true }),
        area("printNotes", "Anything else about this print job?", "Specific pages, double-sided layout, paper colour, etc."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "print|Printing|Colour Page Printing": {
    intro: "Tell us what needs colour, how many pages, and how you will send the file.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Print job", [
        sel("documentType", "What are you printing?", "Choose one", ["Document", "Presentation", "Flyer / poster", "Certificate", "CV", "Other"], { required: true }),
        req("pageCount", "How many pages?", "e.g. 8", { type: "number" }),
        req("copies", "How many copies?", "e.g. 1", { type: "number" }),
        sel("colourPages", "Which pages need colour?", "Choose one", ["All pages", "Selected pages only", "Not sure"]),
        sel("paperSize", "Paper size", "Choose one", ["A4", "A3", "A5", "Other"], { required: true }),
        sel("sidedness", "Print sides", "Choose one", ["Single-sided", "Double-sided", "Not sure"]),
        check("finishing", "Finishing", "Select all that apply", FINISHING),
        sel("printSource", "How will you send the file?", "Choose one", FILE_SOURCES, { required: true }),
        area("printNotes", "Anything else about this colour print job?", "Colour matching, images, page order, etc."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "print|Copying|B&W Page Copying": {
    intro: "Bring the original document and tell us how many copies you need.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Copy job", [
        sel("originalType", "What are you copying?", "Choose one", ["ID / small card", "Certificate", "Document", "Book pages", "Mixed documents", "Other"], { required: true }),
        req("pageCount", "How many pages?", "e.g. 10", { type: "number" }),
        req("copies", "How many copies?", "e.g. 2", { type: "number" }),
        sel("paperSize", "Paper size", "Choose one", ["A4", "A3", "A5", "Other"], { required: true }),
        sel("sidedness", "Copy sides", "Choose one", ["Single-sided", "Double-sided", "Not sure"]),
        sel("originalCondition", "What condition is the original in?", "Choose one", ["Good", "Faded", "Damaged", "Mixed"]),
        check("finishing", "Finishing", "Select all that apply", FINISHING),
        area("printNotes", "Anything else about this copy job?", "Pages to skip, enlargement, reduction, etc."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "print|Copying|Colour Page Copying": {
    intro: "Bring the original and tell us which colours or details must be reproduced faithfully.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Copy job", [
        sel("originalType", "What are you copying?", "Choose one", ["ID / small card", "Certificate", "Document", "Photo", "Book pages", "Mixed documents", "Other"], { required: true }),
        req("pageCount", "How many pages?", "e.g. 6", { type: "number" }),
        req("copies", "How many copies?", "e.g. 1", { type: "number" }),
        sel("colourDetail", "What level of colour detail is needed?", "Choose one", ["Standard colour", "Photo-quality colour", "Certificate / document colour"]),
        sel("paperSize", "Paper size", "Choose one", ["A4", "A3", "A5", "Other"], { required: true }),
        sel("sidedness", "Copy sides", "Choose one", ["Single-sided", "Double-sided", "Not sure"]),
        sel("originalCondition", "What condition is the original in?", "Choose one", ["Good", "Faded", "Damaged", "Mixed"]),
        check("finishing", "Finishing", "Select all that apply", FINISHING),
        area("printNotes", "Anything else about this colour copy job?", "Colour matching, pages to skip, enlargement, etc."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "print|Photo Printing|4 × 6 Glossy Photo Print": {
    intro: "Send us the photos and tell us how you want the 4 × 6 prints finished.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Photo prints", [
        req("photoCount", "How many photos?", "e.g. 10", { type: "number" }),
        sel("photoSource", "How will you send the photos?", "Choose one", ["WhatsApp", "Email", "USB / flash drive", "Google Drive link", "Other"], { required: true }),
        sel("photoOrientation", "Photo orientation", "Choose one", ["Portrait", "Landscape", "Mixed"]),
        sel("photoFinish", "Finish", "Choose one", ["Glossy", "Matte"]),
        sel("photoBorder", "Border", "Choose one", ["White border", "No border"]),
        area("photoNotes", "Anything else about the photos?", "Which photos to print, cropping, colour adjustments, etc."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "print|Photo Printing|A4 Glossy Photo Print": {
    intro: "Send us the photos and tell us how you want the large A4 prints finished.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Photo prints", [
        req("photoCount", "How many A4 photos?", "e.g. 3", { type: "number" }),
        sel("photoSource", "How will you send the photos?", "Choose one", ["WhatsApp", "Email", "USB / flash drive", "Google Drive link", "Other"], { required: true }),
        sel("photoOrientation", "Photo orientation", "Choose one", ["Portrait", "Landscape", "Mixed"]),
        sel("photoFinish", "Finish", "Choose one", ["Glossy", "Matte"]),
        sel("photoBorder", "Border", "Choose one", ["White border", "No border"]),
        area("photoNotes", "Anything else about the photos?", "Which photos to print, cropping, colour adjustments, etc."),
      ]),
      ...deadline("3. Timing"),
    ],
  },

  // ------------------------------------------------------------- DOCUMENTS
  "doc|Typing + Printing|B&W Typing & Printing": {
    intro: "Bring your handwritten notes or draft and tell us how the typed document should look.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Document", [
        sel("documentType", "What type of document is it?", "Choose one", ["Letter", "Application", "Form", "Assignment", "Minutes", "Notice", "Other"], { required: true }),
        sel("documentSource", "What are you giving us?", "Choose one", ["Handwritten notes", "Printed draft", "Photos of notes", "Word / PDF file", "Other"], { required: true }),
        sel("handwritingQuality", "How clear is the handwriting?", "Choose one", ["Clear", "Mostly clear", "Some parts unclear"]),
        sel("formattingStyle", "Formatting style", "Choose one", ["Standard", "Formal letter", "Report", "Assignment", "Other"]),
        req("pageCount", "How many pages?", "e.g. 2", { type: "number" }),
        req("copies", "How many printed copies?", "e.g. 1", { type: "number" }),
        sel("outputFormat", "What output do you need?", "Choose one", ["Printed only", "PDF", "Word", "PDF and printed", "Not sure"]),
        area("documentNotes", "Anything else about the document?", "Font, spacing, headings, words to check, etc."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "doc|Typing + Printing|Colour Typing & Printing": {
    intro: "Tell us what needs colour and how the typed document should be laid out.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Document", [
        sel("documentType", "What type of document is it?", "Choose one", ["Letter", "Application", "Form", "Assignment", "Report", "Notice", "Other"], { required: true }),
        sel("documentSource", "What are you giving us?", "Choose one", ["Handwritten notes", "Printed draft", "Photos of notes", "Word / PDF file", "Other"], { required: true }),
        check("colourElements", "What needs colour?", "Select all that apply", ["Headings", "Tables", "Images", "Charts", "Logos", "Other"]),
        sel("formattingStyle", "Formatting style", "Choose one", ["Standard", "Formal letter", "Report", "Assignment", "Other"]),
        req("pageCount", "How many pages?", "e.g. 4", { type: "number" }),
        req("copies", "How many printed copies?", "e.g. 1", { type: "number" }),
        sel("outputFormat", "What output do you need?", "Choose one", ["Printed only", "PDF", "Word", "PDF and printed", "Not sure"]),
        area("documentNotes", "Anything else about the document?", "Font, spacing, colour references, etc."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "doc|CV Services|CV Creation": {
    intro: "Tell us about the job you want. We will build a clean CV from your details, even if you have never had one.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. The job you want", [
        req("cvTargetRole", "Job title or role you are targeting", "e.g. Office Administrator"),
        sel("industry", "Industry", "Choose one", INDUSTRIES),
        sel("experienceLevel", "How much work experience do you have?", "Choose one", ["No experience yet", "Less than 1 year", "1–2 years", "3–5 years", "5+ years"]),
        sel("highestQualification", "Highest qualification", "Choose one", ["Grade 9 or below", "Grade 10", "Grade 11", "Matric / Grade 12", "Certificate", "Diploma", "Degree", "Postgraduate", "Other"]),
        sel("hasExistingCv", "Do you have an existing CV?", "Choose one", ["No CV yet", "Old CV to update", "Notes only", "Photos of an old CV"]),
        sel("photoOption", "Do you want a photo on the CV?", "Choose one", ["No photo", "Yes, I will send one", "Not sure"]),
        sel("cvLanguage", "CV language", "Choose one", ["English", "Afrikaans", "isiZulu", "isiXhosa", "Sesotho", "Setswana", "Other"]),
        sel("cvStyle", "CV style", "Choose one", ["Traditional", "Modern", "Not sure"]),
        area("cvNotes", "Anything else we should highlight?", "Achievements, volunteer work, languages, tools you know, etc."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "doc|CV Services|CV Refresh & Editing": {
    intro: "Send your current CV and tell us what feels out of date or unclear. We will restructure and refresh it.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Your current CV", [
        sel("existingCvFormat", "How will you send your current CV?", "Choose one", ["Word document", "PDF", "Printed copy", "Photos of pages", "Other"], { required: true }),
        sel("lastUpdated", "When was it last updated?", "Choose one", ["Within 6 months", "1–2 years ago", "3+ years ago", "Never", "Not sure"]),
        check("changesNeeded", "What needs to change?", "Select all that apply", ["Update contact details", "Add recent job", "Remove old jobs", "Improve layout", "Tailor to a job", "Fix spelling and grammar", "Other"]),
        req("targetRole", "Job title or role you are targeting", "e.g. Warehouse Supervisor"),
        sel("industry", "Industry", "Choose one", INDUSTRIES),
        area("cvNotes", "What should we know before editing?", "What is not working, what to keep, and any new details."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "doc|CV Services|Cover Letter Writing": {
    intro: "Give us the job details and your strongest points. We will write a one-page letter that sounds like you.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. The job", [
        req("jobTitle", "Job title", "The exact title in the advert"),
        req("companyName", "Company or organisation", "Who the letter is addressed to"),
        sel("jobAdvertSource", "Where did you see the advert?", "Choose one", ["Indeed", "LinkedIn", "WhatsApp", "Newspaper", "Word of mouth", "Company website", "Other"]),
        area("keyStrengths", "Your strongest relevant points", "Skills, experience, achievements, or personal qualities."),
        area("whyRole", "Why do you want this job?", "A short, honest reason helps the letter sound personal."),
        sel("letterTone", "Tone", "Choose one", ["Formal", "Warm", "Confident", "Simple and direct"]),
        radio("cvAvailable", "Do you have a CV we can reference?", YES_NO),
        area("letterNotes", "Anything else we should include?", "Notice period, availability, relocation, etc."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "doc|Other Documents|Affidavit or Formal Letter": {
    intro: "Tell us what the document must say and who it is for. Some affidavits must be sworn at a police station or Commissioner of Oaths.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. The document", [
        sel("documentPurpose", "What do you need?", "Choose one", ["Affidavit", "Bank letter", "School letter", "Landlord letter", "Police affidavit", "Permission letter", "Other"], { required: true }),
        req("recipient", "Who is it addressed to?", "e.g. The Branch Manager, Capitec Bank"),
        area("facts", "What facts must the document contain?", "Write the full story in your own words. Include names, dates and amounts.", { required: true }),
        radio("commissioner", "Does it need to be sworn in front of a Commissioner of Oaths?", YES_NO_UNSURE),
        radio("idAvailable", "Will you bring your ID?", YES_NO),
        req("copies", "How many copies do you need?", "e.g. 2", { type: "number" }),
        area("documentNotes", "Anything else about this document?", "Deadline, special wording, or a sample you want us to follow."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "doc|Scanning|Document Scanning": {
    intro: "Tell us what you need scanned and how you want the digital file delivered.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Scanning job", [
        sel("documentType", "What are you scanning?", "Choose one", ["ID / card", "Certificate", "Contract", "Book pages", "Photos", "Mixed documents", "Other"], { required: true }),
        req("pageCount", "How many pages or items?", "e.g. 15", { type: "number" }),
        sel("scanFormat", "File format", "Choose one", ["PDF", "JPG", "PDF and JPG", "Not sure"]),
        sel("colourScan", "Scan in colour or black and white?", "Choose one", ["Colour", "Black and white", "Mixed"]),
        sel("resolution", "Quality", "Choose one", ["Standard", "High", "Not sure"]),
        sel("delivery", "How should we send the file?", "Choose one", ["WhatsApp", "Email", "USB / flash drive", "Google Drive link"]),
        area("scanNotes", "Anything else about the scan?", "Pages to skip, order, file names, etc."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "doc|Laminating|A5 Document Laminating": {
    intro: "A5 laminating protects small certificates, cards, ID-sized documents and notices.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Laminating job", [
        sel("itemType", "What are you laminating?", "Choose one", ["ID / card", "Driver's licence", "Certificate", "Photo", "Small notice", "Other"], { required: true }),
        req("itemCount", "How many items?", "e.g. 2", { type: "number" }),
        sel("laminateFinish", "Finish", "Choose one", ["Gloss", "Matte"]),
        radio("doubleSided", "Is anything printed on both sides?", YES_NO),
        area("laminateNotes", "Anything else about the items?", "Size, shape, or anything that needs special care."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "doc|Laminating|A4 Document Laminating": {
    intro: "A4 laminating keeps certificates, notices, timetables and documents clean and protected.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Laminating job", [
        sel("itemType", "What are you laminating?", "Choose one", ["Certificate", "Notice", "Timetable", "Document", "Poster", "Other"], { required: true }),
        req("itemCount", "How many items?", "e.g. 3", { type: "number" }),
        sel("laminateFinish", "Finish", "Choose one", ["Gloss", "Matte"]),
        radio("doubleSided", "Is anything printed on both sides?", YES_NO),
        area("laminateNotes", "Anything else about the items?", "Size, shape, or anything that needs special care."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "doc|Laminating|A3 Document Laminating": {
    intro: "A3 laminating is for larger posters, menus, maps, timetables and display material.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Laminating job", [
        sel("itemType", "What are you laminating?", "Choose one", ["Poster", "Menu", "Timetable", "Map", "Certificate", "Notice", "Other"], { required: true }),
        req("itemCount", "How many items?", "e.g. 1", { type: "number" }),
        sel("laminateFinish", "Finish", "Choose one", ["Gloss", "Matte"]),
        radio("doubleSided", "Is anything printed on both sides?", YES_NO),
        area("laminateNotes", "Anything else about the items?", "Size, shape, or anything that needs special care."),
      ]),
      ...deadline("3. Timing"),
    ],
  },

  // ---------------------------------------------------------------- DESIGN
  "design|Logos|Basic Logo Design": {
    intro: "A clean, simple logo for a new or small business. Tell us the name and the look you have in mind.",
    fields: designBase([
      sel("logoType", "Logo type", "Choose one", ["Icon / symbol", "Wordmark", "Combination mark", "Not sure"], { required: true }),
      f("tagline", "Tagline", "Optional short line under the name"),
      sel("logoUsage", "Where will the logo be used?", "Choose one", ["Social media", "Print", "Signage", "All of these", "Not sure"]),
      sel("conceptCount", "How many initial concepts?", "Choose one", ["1", "2", "3"]),
    ], "3. Logo details"),
  },
  "design|Logos|Standard Logo Design": {
    intro: "A more refined logo with multiple concepts, colour variants and the files you need to use it properly.",
    fields: designBase([
      sel("logoType", "Logo type", "Choose one", ["Icon / symbol", "Wordmark", "Combination mark", "Not sure"], { required: true }),
      f("tagline", "Tagline", "Optional short line under the name"),
      sel("conceptCount", "How many initial concepts?", "Choose one", ["2", "3", "4"]),
      check("colourVariants", "Colour versions needed", "Select all that apply", ["Full colour", "Black", "White", "One-colour"]),
      check("logoFiles", "Files needed", "Select all that apply", ["PNG", "JPG", "PDF", "SVG", "Editable source"]),
    ], "3. Logo details"),
  },
  "design|Logos|Premium Logo & Brand Identity": {
    intro: "A full identity: logo, colours, typography and a short guide so everything stays consistent.",
    fields: designBase([
      sel("logoType", "Logo type", "Choose one", ["Icon / symbol", "Wordmark", "Combination mark", "Not sure"], { required: true }),
      f("tagline", "Tagline", "Optional short line under the name"),
      area("brandVision", "Brand vision", "What should people feel or think when they see the brand?"),
      area("brandAudience", "Target audience", "Who are you speaking to?"),
      check("brandPersonality", "Brand personality", "Select all that apply", ["Professional", "Friendly", "Bold", "Calm", "Premium", "Young", "Traditional"]),
      radio("brandGuide", "Do you need a brand guide?", YES_NO),
      check("stationeryItems", "Brand items to include", "Select all that apply", ["Business card", "Letterhead", "Email signature", "Social media kit", "Packaging", "None"]),
    ], "3. Brand identity"),
  },
  "design|Business Cards|Single-Sided Business Card Design": {
    intro: "A clean single-sided card with your name, role, business and contact details.",
    fields: designBase([
      sel("cardSize", "Card size", "Choose one", ["Standard 85 × 55 mm", "Square", "Other"], { required: true }),
      sel("cardOrientation", "Orientation", "Choose one", ["Landscape", "Portrait"]),
      area("contactDetails", "Contact details for the card", "Phone, email, WhatsApp, website, address.", { required: true }),
      radio("qrCode", "Add a QR code?", YES_NO),
      sel("printQuantity", "How many cards should we print?", "Choose one", ["100", "250", "500", "1000", "Not sure"]),
    ], "3. Card details"),
  },
  "design|Business Cards|Double-Sided Business Card Design": {
    intro: "Front and back card design with room for services, social media, a QR code or a map.",
    fields: designBase([
      sel("cardSize", "Card size", "Choose one", ["Standard 85 × 55 mm", "Square", "Other"], { required: true }),
      sel("cardOrientation", "Orientation", "Choose one", ["Landscape", "Portrait"]),
      area("contactDetails", "Contact details for the front", "Phone, email, WhatsApp, website, address.", { required: true }),
      check("backContent", "What should go on the back?", "Select all that apply", ["Services", "Social media", "QR code", "Map", "Photo", "Other"]),
      area("backNotes", "Back-of-card details", "List the services, handles or message to include."),
      sel("printQuantity", "How many cards should we print?", "Choose one", ["100", "250", "500", "1000", "Not sure"]),
    ], "3. Card details"),
  },
  "design|Flyers & Posters|Simple Flyer Design": {
    intro: "A clean flyer for a promotion, event or notice. The information matters more than complex visuals.",
    fields: designBase([
      sel("flyerSize", "Flyer size", "Choose one", ["A4", "A5", "DL", "Social media", "Other"], { required: true }),
      sel("flyerPurpose", "What is the flyer for?", "Choose one", ["Promotion", "Event", "Notice", "Sale", "Other"]),
      f("headline", "Main headline", "The one line people should see first"),
      area("bodyText", "Body text", "The full wording to include."),
      area("contactDetails", "Contact details", "Phone, WhatsApp, address, social handles."),
      radio("photoAssets", "Do you have photos to use?", YES_NO),
    ], "3. Flyer content"),
  },
  "design|Flyers & Posters|Custom Flyer & Poster Design": {
    intro: "A fully designed flyer or poster built around your brand, message and audience.",
    fields: designBase([
      sel("flyerSize", "Size", "Choose one", ["A4", "A3", "A2", "A1", "A0", "Social media", "Custom"], { required: true }),
      sel("printOrDigital", "Where will it be used?", "Choose one", ["Print", "Digital", "Both"]),
      f("headline", "Main headline", "The one line people should see first"),
      area("bodyText", "Body text", "The full wording to include."),
      area("contentSections", "Content sections", "List each section, in order, with its text."),
      radio("photoAssets", "Do you have photos to use?", YES_NO),
    ], "3. Poster content"),
  },
  "design|Flyers & Posters|Complex Flyer & Poster Design": {
    intro: "For content-heavy layouts, event programmes or designs that need real creative structure.",
    fields: designBase([
      sel("flyerSize", "Size", "Choose one", ["A4", "A3", "A2", "A1", "A0", "Social media", "Custom"], { required: true }),
      sel("printOrDigital", "Where will it be used?", "Choose one", ["Print", "Digital", "Both"]),
      sel("contentVolume", "How much content is there?", "Choose one", ["Medium", "High", "Very high"]),
      area("contentSections", "Content sections", "List each section, in order, with its text."),
      radio("illustrationNeeded", "Do you need custom illustration or graphics?", YES_NO_UNSURE),
      radio("multiPage", "Is this a single page or multiple pages?", ["Single page", "Multiple pages"]),
      area("productionNotes", "Print or production notes", "Fold, bleed, quantity, finish, etc."),
    ], "3. Poster content"),
  },
  "design|Social Media|Social Media Post Design": {
    intro: "A branded post sized for your platform, built to stop the scroll.",
    fields: designBase([
      check("platform", "Platforms", "Select all that apply", ["Facebook", "Instagram", "TikTok", "LinkedIn", "WhatsApp Status", "X"], { required: true }),
      sel("postSize", "Post size", "Choose one", ["Square 1:1", "Portrait 4:5", "Story 9:16", "Landscape 16:9", "Not sure"]),
      f("headline", "Main headline", "The line people should see first"),
      area("caption", "Caption or body text", "The wording that must appear on the design."),
      radio("photoAssets", "Do you have photos to use?", YES_NO),
    ], "3. Post content"),
  },
  "design|Social Media|Social Media Post + Story Package": {
    intro: "One message, adapted into a feed post and a matching story.",
    fields: designBase([
      check("platform", "Platforms", "Select all that apply", ["Facebook", "Instagram", "TikTok", "LinkedIn", "WhatsApp Status", "X"], { required: true }),
      f("headline", "Main headline", "The line people should see first"),
      area("caption", "Caption or body text", "The wording that must appear on the post."),
      sel("storyAdaptation", "How should the story differ?", "Choose one", ["Same message", "Different call to action", "Countdown", "Other"]),
      check("storyExtras", "Story extras", "Select all that apply", ["Link sticker", "Countdown", "Poll", "Swipe-up", "None"]),
      radio("photoAssets", "Do you have photos to use?", YES_NO),
    ], "3. Post and story content"),
  },
  "design|Invitations|Static Invitation Design": {
    intro: "A beautiful static invitation you can save, share on WhatsApp or print.",
    fields: designBase([
      sel("eventType", "Event type", "Choose one", ["Wedding", "Birthday", "Baby shower", "Graduation", "Memorial", "Corporate", "Other"], { required: true }),
      date("eventDate", "Event date", "Choose a date"),
      f("eventTime", "Event time", "e.g. 14:00 for 14:30"),
      req("venue", "Venue", "Name and address"),
      f("host", "Host", "Who is hosting the event?"),
      f("guestCount", "Approximate guest count", "e.g. 80"),
      sel("invitationFormat", "How will it be shared?", "Choose one", ["WhatsApp image", "Print", "Both", "Not sure"]),
      area("theme", "Theme or style", "Colours, flowers, mood, cultural details, etc."),
    ], "3. Event details"),
  },
  "design|Invitations|Animated Video Invitation": {
    intro: "A short animated invitation with text reveals, music and your event details.",
    fields: designBase([
      sel("eventType", "Event type", "Choose one", ["Wedding", "Birthday", "Baby shower", "Graduation", "Memorial", "Corporate", "Other"], { required: true }),
      date("eventDate", "Event date", "Choose a date"),
      f("eventTime", "Event time", "e.g. 14:00 for 14:30"),
      req("venue", "Venue", "Name and address"),
      f("host", "Host", "Who is hosting the event?"),
      sel("videoLength", "Video length", "Choose one", ["15 seconds", "30 seconds", "45 seconds", "60 seconds"]),
      sel("musicStyle", "Music style", "Choose one", ["Soft instrumental", "Upbeat", "Gospel", "Amapiano", "No music", "Other"]),
      radio("voiceOver", "Add a voice-over?", YES_NO_UNSURE),
      sel("animationStyle", "Animation style", "Choose one", ["Elegant", "Playful", "Minimal", "Photo slideshow"]),
      area("videoNotes", "Anything else for the video?", "Photos, clips, wording, timing, etc."),
    ], "3. Event and video details"),
  },
  "design|Business Profile|One-Page Business Profile": {
    intro: "A single polished page with your logo, about-us blurb, services and contact details.",
    fields: designBase([
      area("businessDescription", "Short business description", "What you do, who you serve, and what makes you different."),
      area("servicesList", "Services to list", "One service per line."),
      area("contactDetails", "Contact details", "Phone, WhatsApp, email, address, website, social handles."),
      radio("logoAvailable", "Do you have a logo?", YES_NO),
      sel("profileTone", "Tone", "Choose one", ["Corporate", "Friendly", "Minimal", "Bold"]),
    ], "3. Profile content"),
  },
  "design|Business Profile|Business Profile (2–3 Pages)": {
    intro: "A short company profile with room for your team, services and testimonials.",
    fields: designBase([
      area("businessDescription", "Business description", "What you do, who you serve, and what makes you different."),
      area("servicesList", "Services to list", "One service per line."),
      area("teamInfo", "Founder or team information", "Names, roles, short bios and photos if available."),
      area("testimonials", "Testimonials to feature", "Quote, name and role. Only include real reviews."),
      check("pageContent", "Pages to include", "Select all that apply", ["About", "Services", "Team", "Testimonials", "Gallery", "Contact"]),
      area("contactDetails", "Contact details", "Phone, WhatsApp, email, address, website, social handles."),
    ], "3. Profile content"),
  },
  "design|Business Profile|Business Profile (4–5 Pages)": {
    intro: "A full company profile with your story, services, team, testimonials and achievements.",
    fields: designBase([
      area("companyHistory", "Company history or story", "How the business started and where it is going."),
      area("servicesList", "Services to list", "One service per line."),
      area("teamInfo", "Team information", "Names, roles, short bios and photos if available."),
      area("testimonials", "Testimonials to feature", "Quote, name and role. Only include real reviews."),
      area("achievements", "Achievements and milestones", "Projects, awards, certifications, years in business."),
      radio("galleryAssets", "Do you have gallery images?", YES_NO),
      check("pageContent", "Pages to include", "Select all that apply", ["About", "Services", "Team", "Testimonials", "Gallery", "Achievements", "Contact"]),
    ], "3. Profile content"),
  },
  "design|Business Profile|Additional Business Profile Pages": {
    intro: "Extra pages added to an existing profile, matched to the current design.",
    fields: designBase([
      req("existingProfilePages", "How many pages does the current profile have?", "e.g. 5", { type: "number" }),
      req("additionalPages", "How many extra pages do you need?", "e.g. 2", { type: "number" }),
      area("additionalContent", "What goes on the extra pages?", "List the content for each page."),
      radio("matchingStyle", "Should we match the existing design?", YES_NO_UNSURE),
      area("contactDetails", "Contact details", "Phone, WhatsApp, email, address, website, social handles."),
    ], "3. Extra page details"),
  },
  "design|Revisions|In-Progress Design Revision": {
    intro: "For changes while a design is still being worked on. Tell us exactly what should move, change or stay.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Revision", [
        req("originalProject", "Which project is this for?", "Project name or description"),
        f("originalDesigner", "Who is working on it?", "Optional: staff member or designer name"),
        area("changes", "What changes are needed?", "Be specific: text, colour, layout, image, size, etc.", { required: true }),
        sel("revisionScope", "How big is the change?", "Choose one", ["Minor tweak", "Moderate change", "Major rework"]),
        area("revisionNotes", "Anything else we should know?", "Deadline, references, or parts that must stay unchanged."),
      ]),
      ...deadline("3. Timing"),
    ],
  },
  "design|Revisions|Post-Delivery Design Revision": {
    intro: "For changes after a design has been delivered and signed off. We reopen the project file and rework the finished elements.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Revision", [
        req("originalProject", "Which project is this for?", "Project name or description"),
        date("deliveryDate", "When was it delivered?", "Choose a date", { dateRule: "past" }),
        area("changes", "What changes are needed?", "Be specific: text, colour, layout, image, size, etc.", { required: true }),
        sel("revisionScope", "How big is the change?", "Choose one", ["Minor tweak", "Moderate change", "Major rework"]),
    radio("originalFilesAvailable", "Do you have the original files?", YES_NO_UNSURE),
    radio("approval", "Was the previous version approved?", YES_NO),
    area("revisionNotes", "Anything else we should know?", "Deadline, references, or parts that must stay unchanged."),
  ]),
  ...deadline("3. Timing"),
    ],
  },

  // ------------------------------------------------------------- E-SERVICE
  "eservice|SASSA|SASSA Grant Status Check": {
    intro: "We check the official SASSA channels and tell you exactly where your grant or application stands.",
    fields: sassaBase([
      sel("checkType", "What should we check?", "Choose one", ["Grant status", "Application status", "Payment status", "Appeal status"], { required: true }),
      f("sassaReference", "SASSA reference or application number", "If you have one"),
      sel("grantType", "Grant type", "Choose one", ["Older Persons Grant", "Disability Grant", "Child Support Grant", "Foster Child Grant", "Care Dependency Grant", "SRD Grant", "Grant-in-Aid", "Not sure"]),
      date("applicationDate", "When did you apply?", "Choose a date", { dateRule: "past" }),
      date("lastPaymentDate", "When did you last receive a payment?", "Choose a date", { dateRule: "past" }),
      area("statusNotes", "Anything else we should check?", "SMS messages, reference numbers, or dates that matter."),
    ], ["SA ID / Smart ID", "SASSA reference number", "Proof of address", "Bank confirmation letter", "SASSA letter or SMS", "Other"]),
  },
  "eservice|SASSA|SASSA Profile Details Update": {
    intro: "Update your phone, address, banking or personal details on the official SASSA system.",
    fields: sassaBase([
      check("updateFields", "What needs to change?", "Select all that apply", ["Phone number", "Address", "Banking details", "Name or surname", "Marital status", "Other"], { required: true }),
      f("newPhone", "New phone number", "The number SASSA should use", { type: "tel", showWhen: { field: "updateFields", includes: "Phone number" } }),
      area("newAddress", "New address", "Street, suburb, town and postal code", { showWhen: { field: "updateFields", includes: "Address" } }),
      sel("newBankName", "New bank", "Choose one", BANK_NAMES, { showWhen: { field: "updateFields", includes: "Banking details" } }),
      f("newAccountNumber", "New account number", "The account SASSA should pay into", { showWhen: { field: "updateFields", includes: "Banking details" } }),
      f("newBranchCode", "New branch code", "6-digit branch code", { showWhen: { field: "updateFields", includes: "Banking details" } }),
      sel("newMaritalStatus", "New marital status", "Choose one", ["Single", "Married", "Divorced", "Widowed"], { showWhen: { field: "updateFields", includes: "Marital status" } }),
      area("updateReason", "Why are you updating these details?", "A short explanation helps us capture the change correctly."),
    ], ["SA ID / Smart ID", "Proof of the new details", "SASSA reference number", "Bank confirmation letter", "Marriage certificate", "Other"]),
  },
  "eservice|SASSA|SASSA Grant Reapplication": {
    intro: "If your grant lapsed, was cancelled, or you were asked to reapply, we complete the reapplication correctly.",
    fields: sassaBase([
      sel("previousGrantType", "Which grant did you have?", "Choose one", ["Older Persons Grant", "Disability Grant", "Child Support Grant", "Foster Child Grant", "Care Dependency Grant", "SRD Grant", "Grant-in-Aid", "Other"], { required: true }),
      f("previousReference", "Previous SASSA reference number", "If you have it"),
      sel("lapsedReason", "Why did it stop?", "Choose one", ["Cancelled", "Lapsed", "Rejected", "Moved", "Not sure", "Other"]),
      area("reapplicationReason", "Why should the grant be reinstated?", "Explain what changed or why you still qualify."),
      radio("bankDetailsChanged", "Have your banking details changed?", YES_NO_UNSURE),
      sel("newBankName", "New bank", "Choose one", BANK_NAMES, { showWhen: { field: "bankDetailsChanged", equals: "Yes" } }),
      f("newAccountNumber", "New account number", "The account for payment", { showWhen: { field: "bankDetailsChanged", equals: "Yes" } }),
      f("newBranchCode", "New branch code", "6-digit branch code", { showWhen: { field: "bankDetailsChanged", equals: "Yes" } }),
    ], ["SA ID / Smart ID", "Previous SASSA letter or rejection letter", "Proof of income or affidavit", "Bank confirmation letter", "Other"]),
  },
  "eservice|SASSA|SASSA SRD Grant Application": {
    intro: "We submit your Social Relief of Distress application through the official SASSA SRD portal.",
    fields: sassaBase([
      sel("srdApplicationType", "What do you need?", "Choose one", ["New SRD application", "SRD reapplication", "SRD appeal"], { required: true }),
      f("previousSrdReference", "Previous SRD reference number", "If you have one"),
      sel("srdPaymentMethod", "How should you be paid?", "Choose one", ["Bank account", "Cash send", "Not sure"]),
      sel("srdBankName", "Bank name", "Choose one", BANK_NAMES, { showWhen: { field: "srdPaymentMethod", equals: "Bank account" } }),
      f("srdAccountHolder", "Account holder name", "Must match the bank account", { showWhen: { field: "srdPaymentMethod", equals: "Bank account" } }),
      f("srdAccountNumber", "Account number", "The account for payment", { showWhen: { field: "srdPaymentMethod", equals: "Bank account" } }),
      f("srdBranchCode", "Branch code", "6-digit branch code", { showWhen: { field: "srdPaymentMethod", equals: "Bank account" } }),
      area("srdNotes", "Anything else we should know?", "Previous applications, appeals, or payment problems."),
    ], ["SA ID / Smart ID", "Active cellphone number", "Bank confirmation letter", "Proof of income or affidavit", "Other"]),
  },
  "eservice|SASSA|SASSA Grant Appeal": {
    intro: "If SASSA declined a grant you believe you qualify for, we prepare and submit a clear appeal.",
    fields: sassaBase([
      sel("declinedGrant", "Which grant was declined?", "Choose one", ["Older Persons Grant", "Disability Grant", "Child Support Grant", "Foster Child Grant", "Care Dependency Grant", "SRD Grant", "Grant-in-Aid", "Other"], { required: true }),
      sel("declineReason", "What reason did SASSA give?", "Choose one", ["Income too high", "ID verification", "Bank verification", "Insufficient documents", "Medical assessment", "Other", "Not sure"]),
      date("declineDate", "When were you declined?", "Choose a date", { dateRule: "past" }),
      area("appealReason", "Why should the decision be reviewed?", "Explain your circumstances and why you qualify.", { required: true }),
      check("supportingDocs", "Supporting documents you can provide", "Select all that apply", ["Medical report", "Proof of income", "Affidavit", "Bank statements", "ID copy", "Other"]),
      area("appealNotes", "Anything else we should know?", "Reference numbers, previous appeals, or deadlines."),
    ], ["SA ID / Smart ID", "Rejection letter or SMS", "Supporting documents for the appeal", "Proof of income", "Medical report", "Other"]),
  },
  "eservice|SASSA|SASSA Banking Details Update": {
    intro: "Change the bank account your SASSA grant is paid into, so your next payment goes to the right place.",
    fields: sassaBase([
      f("currentBank", "Current bank", "The bank SASSA currently pays into"),
      sel("newBankName", "New bank", "Choose one", BANK_NAMES, { required: true }),
      req("newAccountHolder", "New account holder name", "Must match the bank account"),
      req("newAccountNumber", "New account number", "The account for future payments"),
      req("newBranchCode", "New branch code", "6-digit branch code"),
      sel("newAccountType", "Account type", "Choose one", ACCOUNT_TYPES),
      area("reasonForChange", "Why are you changing banks?", "A short explanation helps us update the record correctly."),
      radio("bankLetter", "Do you have a bank confirmation letter?", YES_NO_UNSURE),
    ], ["SA ID / Smart ID", "SASSA reference number", "Bank confirmation letter", "Three months of bank statements", "Other"]),
  },
  "eservice|SASSA|SASSA Grant Application (Other Grants)": {
    intro: "Apply for a formal SASSA grant with the correct supporting documents the first time.",
    fields: sassaBase([
      sel("grantType", "Which grant are you applying for?", "Choose one", ["Child Support Grant", "Older Persons Grant", "Disability Grant", "Foster Child Grant", "Care Dependency Grant", "Grant-in-Aid", "Other"], { required: true }),
      sel("applicantStatus", "Is this a new application or a reapplication?", "Choose one", ["New application", "Reapplication", "Appeal"]),
      f("householdSize", "How many people live in your household?", "e.g. 5", { type: "number" }),
      check("incomeSource", "Household income sources", "Select all that apply", ["Salary", "Grant", "Piece jobs", "Business", "No income", "Other"]),
      area("childDetails", "Child details", "Full names, dates of birth and birth certificate numbers.", { showWhen: { field: "grantType", equals: "Child Support Grant" } }),
      area("medicalDetails", "Medical or disability details", "Explain the condition and the assessment you have.", { showWhen: { field: "grantType", equals: "Disability Grant" } }),
      area("grantNotes", "Anything else we should know?", "Previous applications, reference numbers, or special circumstances."),
    ], ["SA ID / Smart ID", "Birth certificate", "Proof of income", "Medical report", "Affidavit", "Bank confirmation letter", "Other"]),
  },

  // ---------------------------------------------------------------- SARS
  "eservice|SARS|SARS Enquiry, Statement or Profile Update": {
    intro: "Tax status, statements, assessments and basic profile updates handled through eFiling.",
    fields: sarsBase([
      check("requestType", "What do you need?", "Select all that apply", ["Tax status / compliance check", "Statement of account", "Notice of assessment", "Profile update", "Tax number lookup", "Other"], { required: true }),
      f("taxYears", "Tax year(s)", "e.g. 2024, 2025, 2026"),
      check("profileFields", "Profile details to update", "Select all that apply", ["Phone number", "Email address", "Residential address", "Banking details", "Representative details", "Other"], { showWhen: { field: "requestType", includes: "Profile update" } }),
      area("newDetails", "New details", "Provide the exact new information to capture.", { showWhen: { field: "requestType", includes: "Profile update" } }),
      area("requestNotes", "Anything else about this request?", "Reference numbers, deadlines, or specific years."),
    ], ["SA ID / Smart ID", "Tax reference number", "Proof of address", "Bank confirmation letter", "SARS letter or notice", "Other"]),
  },
  "eservice|SARS|SARS Registration & eFiling Setup": {
    intro: "Register as a taxpayer, get your tax reference number and set up your eFiling profile.",
    fields: [
      ...client("1. Taxpayer details"),
      ...sarsIdentity(),
      ...sec("3. Registration details", [
        sel("maritalStatus", "Marital status", "Choose one", ["Single", "Married", "Divorced", "Widowed"]),
        sel("citizenship", "Country of citizenship", "Choose one", ["South Africa", "Botswana", "Eswatini", "Lesotho", "Mozambique", "Namibia", "Zimbabwe", "Other"]),
        check("registrationReason", "Why are you registering?", "Select all that apply", ["Employment", "Bank or bursary", "Business", "Rental income", "Other"]),
        req("preferredUsername", "Preferred eFiling username", "Choose a username you will remember"),
        f("securityQuestion", "Security question and answer", "For password recovery"),
        radio("newEmailSetup", "Do you need a new email address?", YES_NO),
      ]),
      ...bankFields("4. Bank details"),
      ...documentChecklist("5. Supporting documents", ["SA ID / Smart ID", "Passport", "Proof of address", "Bank confirmation letter", "Proof of income", "Other"]),
      ...addressFields("6. Residential address"),
      ...authorisation(),
    ],
  },
  "eservice|SARS|SARS Tax PIN or Penalty Assistance": {
    intro: "Retrieve a tax PIN or respond to a SARS penalty with a clear, supported motivation.",
    fields: sarsBase([
      sel("assistanceType", "What help do you need?", "Choose one", ["Tax PIN retrieval", "Penalty notice", "Request for remission", "Both PIN and penalty"], { required: true }),
      f("penaltyYears", "Tax year(s) affected", "e.g. 2023, 2024, 2025"),
      f("penaltyAmount", "Penalty amount shown", "The amount on the SARS statement"),
      check("penaltyReason", "Why was the penalty issued?", "Select all that apply", ["Late filing", "Non-submission", "Underestimation", "Administrative penalty", "Other", "Not sure"]),
      sel("efilingAccess", "Can you access eFiling?", "Choose one", ["Yes, I have my password", "Forgot password / locked", "Not registered"]),
      area("clientExplanation", "Your explanation", "Explain the circumstances, dates and anything that supports your case.", { required: true }),
    ], ["SA ID / Smart ID", "Tax reference number", "SARS penalty letter or notice", "Proof of income", "Bank statements", "Other"]),
  },
  "eservice|SARS|SARS Tax Compliance Status Certificate": {
    intro: "Apply for a Tax Compliance Status PIN, commonly needed for tenders, contracts, visas and emigration.",
    fields: sarsBase([
      sel("applicantType", "Applicant type", "Choose one", ["Individual taxpayer", "Registered company (Pty Ltd / CC)", "Trust", "Other"], { required: true }),
      f("vatReference", "VAT reference number", "If registered"),
      f("payeReference", "PAYE / UIF / SDL number", "If registered"),
      check("tcsPurpose", "What is the PIN for?", "Select all that apply", ["Tender / CSD", "Good standing", "Employment / licensing", "Foreign investment", "Other"], { required: true }),
      f("requestingInstitution", "Requesting institution or tender name", "Optional reference"),
      check("complianceChecks", "Pre-submission checks", "Select all that apply", ["All tax returns submitted", "No overdue SARS debt", "Banking details up to date", "Address up to date"]),
    ], ["SA ID / Smart ID", "Tax reference number", "Company registration documents", "Proof of address", "Bank confirmation letter", "Other"]),
  },
  "eservice|SARS|SARS PIN Submission Assistance": {
    intro: "Submit a SARS PIN or reference correctly through eFiling, without errors that delay your matter.",
    fields: sarsBase([
      sel("pinType", "What type of PIN is it?", "Choose one", ["Tax compliance PIN", "VAT registration PIN", "PAYE PIN", "Tax reference PIN", "Other"], { required: true }),
      f("pinReference", "PIN or reference number", "The number supplied by SARS"),
      radio("requestLetter", "Do you have the SARS request letter?", YES_NO_UNSURE),
      date("submissionDeadline", "When must it be submitted?", "Choose a date", { dateRule: "future" }),
      area("submissionNotes", "Anything else about this submission?", "Where it must be submitted, who requested it, etc."),
    ], ["SA ID / Smart ID", "Tax reference number", "SARS request letter", "The PIN or reference", "Other"]),
  },
  "eservice|SARS|Tax, VAT or PAYE Return Filing": {
    intro: "Your income tax, VAT201 or PAYE return prepared and filed accurately on eFiling.",
    fields: sarsBase([
      check("returnType", "Which return are you filing?", "Select all that apply", ["Individual income tax (ITR12)", "Provisional tax (IRP6)", "VAT return (VAT201)", "PAYE / UIF / SDL (EMP201)", "Other"], { required: true }),
      req("taxPeriod", "Tax period or assessment year", "e.g. 2026 or 2026/10"),
      check("incomeSources", "Income sources", "Select all that apply", ["Salary", "Business income", "Rental income", "Investments", "Other"]),
      check("deductions", "Deductions to claim", "Select all that apply", ["Retirement annuity", "Medical expenses", "Travel", "Donations", "None"]),
      check("supportingCertificates", "Supporting certificates you have", "Select all that apply", ["IRP5 / IT3(a)", "Medical aid certificate", "Retirement annuity certificate", "Bank interest IT3(b)", "Travel logbook", "VAT output / input summary", "Payroll / EMP201 figures", "Nil return"]),
      radio("bankDetailsVerified", "Are your SARS bank details correct?", ["Yes, verified", "Needs update", "Not sure"]),
      area("clientFigures", "Figures or declarations to capture", "VAT output/input, PAYE totals, other income, or deductions."),
    ], ["SA ID / Smart ID", "Tax reference number", "IRP5 / IT3 certificates", "Medical certificate", "Retirement annuity certificate", "Bank statements", "Invoices", "Other"]),
  },

  // ---------------------------------------------------- ONLINE APPLICATIONS
  "eservice|Online Applications|NSFAS Funding Status Check": {
    intro: "Check your NSFAS application, funding, appeal or registration status on myNSFAS.",
    fields: onlineBase([
      f("nsfasReference", "NSFAS reference number", "If you have one"),
      f("applicationYear", "Application year", "e.g. 2026"),
      sel("checkType", "What should we check?", "Choose one", ["Application status", "Funding status", "Appeal status", "Registration status", "Not sure"], { required: true }),
      f("institution", "Institution", "The university or college you applied to"),
      area("statusNotes", "Anything else we should check?", "SMS messages, reference numbers, or dates."),
    ], ["SA ID / Smart ID", "NSFAS reference number", "Matric results", "Proof of household income", "Other"]),
  },
  "eservice|Online Applications|NSFAS Banking Details Update": {
    intro: "Update the bank account NSFAS uses for your allowances so your money reaches you without delays.",
    fields: onlineBase([
      f("nsfasReference", "NSFAS reference number", "If you have one"),
      f("oldBank", "Current bank", "The bank NSFAS currently has"),
      sel("newBankName", "New bank", "Choose one", BANK_NAMES, { required: true }),
      req("accountHolder", "Account holder name", "Must match the bank account"),
      req("accountNumber", "Account number", "The account for allowances"),
      req("branchCode", "Branch code", "6-digit branch code"),
      sel("accountType", "Account type", "Choose one", ACCOUNT_TYPES),
      area("reason", "Why are you changing banks?", "A short explanation helps us update the record."),
      radio("bankLetter", "Do you have a bank confirmation letter?", YES_NO_UNSURE),
    ], ["SA ID / Smart ID", "NSFAS reference number", "Bank confirmation letter", "Three months of bank statements", "Other"]),
  },
  "eservice|Online Applications|Learnership Application Assistance": {
    intro: "Find a learnership that fits you and complete the online application with your CV and documents.",
    fields: onlineBase([
      sel("learnershipField", "Which field interests you?", "Choose one", ["Administration", "IT", "Engineering", "Hospitality", "Tourism", "Agriculture", "Finance", "Health", "Other"], { required: true }),
      sel("qualificationLevel", "Highest qualification", "Choose one", ["Grade 9 or below", "Grade 10", "Grade 11", "Matric / Grade 12", "Certificate", "Diploma", "Degree", "Other"]),
      sel("preferredProvince", "Preferred province", "Choose one", PROVINCES),
      f("preferredEmployer", "Preferred employer or programme", "If you have one in mind"),
      radio("hasCv", "Do you have a CV?", YES_NO),
      sel("availability", "When can you start?", "Choose one", ["Immediately", "Within 1 month", "Within 3 months", "Other"]),
      area("learnershipNotes", "Anything else we should know?", "Disability, transport, or specific learnerships you have seen."),
    ], ["SA ID / Smart ID", "Highest qualification certificate", "CV", "Proof of address", "Other"]),
  },
  "eservice|Online Applications|Government Job / DPSA Application": {
    intro: "Complete a government job application accurately, including the Z83 form and all required attachments.",
    fields: onlineBase([
      req("postTitle", "Post title", "The exact title in the advert"),
      f("department", "Department or public entity", "Who is advertising the post?"),
      f("postNumber", "Post number", "If the advert lists one"),
      f("referenceNumber", "Reference number", "If the advert lists one"),
      date("closingDate", "Closing date", "Choose a date", { dateRule: "future" }),
      radio("z83Required", "Does the advert require a Z83 form?", YES_NO_UNSURE),
      sel("qualificationLevel", "Highest qualification", "Choose one", ["Grade 9 or below", "Grade 10", "Grade 11", "Matric / Grade 12", "Certificate", "Diploma", "Degree", "Postgraduate", "Other"]),
      radio("hasCv", "Do you have a CV?", YES_NO),
      radio("hasCertifiedDocs", "Are your documents certified?", YES_NO_UNSURE),
      area("applicationNotes", "Anything else about this application?", "Post requirements, experience, or special instructions."),
    ], ["SA ID / Smart ID", "CV", "Certified qualifications", "Z83 form", "Proof of address", "Other"]),
  },
  "eservice|Online Applications|Bursary Application Assistance": {
    intro: "Complete a competitive bursary application with the right documents and a clear motivation.",
    fields: onlineBase([
      req("bursaryName", "Bursary name", "The bursary or fund you are applying to"),
      sel("fieldOfStudy", "Field of study", "Choose one", ["Agriculture", "Arts and humanities", "Business and commerce", "Education", "Engineering", "Health sciences", "IT and computer science", "Law", "Science", "Social sciences", "Other"]),
      f("institution", "Institution", "Where you study or plan to study"),
      sel("yearOfStudy", "Year of study", "Choose one", ["First year", "Second year", "Third year", "Fourth year", "Postgraduate", "Not yet studying"]),
      sel("householdIncome", "Household income", "Choose one", ["No income", "Under R120 000", "R120 000 – R250 000", "R250 000 – R350 000", "R350 000 – R600 000", "Above R600 000", "Prefer not to say"]),
      sel("academicAverage", "Academic average", "Choose one", ["Below 60%", "60–69%", "70–79%", "80%+", "Not sure"]),
      radio("hasAcceptanceLetter", "Do you have an acceptance letter?", YES_NO_UNSURE),
      check("bursaryDocuments", "Documents you have ready", "Select all that apply", ["SA ID", "Matric results", "Academic transcript", "Proof of income", "Acceptance letter", "Motivation letter", "Other"]),
      area("bursaryNotes", "Anything else we should know?", "Deadline, special criteria, or a motivation you want us to use."),
    ], ["SA ID / Smart ID", "Academic results", "Proof of household income", "Acceptance letter", "Motivation letter", "Other"]),
  },
  "eservice|Online Applications|NSFAS Funding Appeal": {
    intro: "Submit a clear NSFAS appeal with the right motivation and supporting documents.",
    fields: onlineBase([
      f("nsfasReference", "NSFAS reference number", "If you have one"),
      sel("declineReason", "What reason did NSFAS give?", "Choose one", ["Household income too high", "ID verification", "Academic eligibility", "Insufficient documents", "Other", "Not sure"]),
      area("appealReason", "Why should the decision be reviewed?", "Explain your circumstances and why you qualify.", { required: true }),
      sel("householdIncome", "Household income", "Choose one", ["No income", "Under R120 000", "R120 000 – R250 000", "R250 000 – R350 000", "R350 000 – R600 000", "Above R600 000", "Prefer not to say"]),
      check("supportingDocs", "Supporting documents you can provide", "Select all that apply", ["Proof of income", "Affidavit", "Death certificate", "Medical report", "Academic results", "Other"]),
      area("appealNotes", "Anything else we should know?", "Reference numbers, previous appeals, or deadlines."),
    ], ["SA ID / Smart ID", "NSFAS rejection notification", "Proof of income", "Affidavit", "Academic results", "Other"]),
  },
  "eservice|Online Applications|NSFAS Funding Application": {
    intro: "Complete your full NSFAS application with personal, household, institution and income details.",
    fields: onlineBase([
      f("householdSize", "How many people live in your household?", "e.g. 5", { type: "number" }),
      sel("householdIncome", "Household income", "Choose one", ["No income", "Under R120 000", "R120 000 – R250 000", "R250 000 – R350 000", "R350 000 – R600 000", "Above R600 000", "Prefer not to say"]),
      f("institution", "Institution", "The university or college you plan to attend"),
      f("course", "Course or programme", "What you plan to study"),
      sel("yearOfStudy", "Year of study", "Choose one", ["First year", "Second year", "Third year", "Fourth year", "Postgraduate", "Not yet studying"]),
      radio("disability", "Do you have a disability?", YES_NO_UNSURE),
      check("nsfasDocuments", "Documents you have ready", "Select all that apply", ["SA ID", "Matric results", "Proof of income", "Consent form", "Disability assessment", "Other"]),
      check("consentNsfas", "NSFAS consent", "Select to confirm", ["I consent to NSFAS verifying my household income"], { required: true }),
      area("nsfasNotes", "Anything else we should know?", "Previous applications, gaps in study, or special circumstances."),
    ], ["SA ID / Smart ID", "Matric results", "Proof of household income", "Signed consent form", "Disability assessment", "Other"]),
  },
  "eservice|Online Applications|University Application Assistance": {
    intro: "Apply to university through the correct portal with your programme choices, results and documents.",
    fields: onlineBase([
      sel("applicationType", "Application type", "Choose one", ["Undergraduate", "Postgraduate", "Diploma", "Higher certificate", "Other"], { required: true }),
      f("institution", "University or college", "The institution you are applying to"),
      f("courseChoice1", "First programme choice", "The exact programme name"),
      f("courseChoice2", "Second programme choice", "Optional alternative programme"),
      sel("studyProvince", "Province of the institution", "Choose one", PROVINCES),
      f("matricYear", "Matric year", "e.g. 2025"),
      sel("apsScore", "APS score", "Choose one", ["Below 20", "20–24", "25–29", "30–34", "35–39", "40+", "Not sure"]),
      radio("applicationFee", "Has the application fee been paid?", YES_NO_UNSURE),
      check("universityDocuments", "Documents you have ready", "Select all that apply", ["SA ID", "Matric results", "Academic transcript", "Proof of address", "Application fee receipt", "Other"]),
      area("universityNotes", "Anything else about this application?", "Closing date, residence application, or special requirements."),
    ], ["SA ID / Smart ID", "Matric results", "Academic transcript", "Proof of address", "Application fee receipt", "Other"]),
  },

  // --------------------------------------------------------------- EMAIL
  "eservice|Email Services|Email Account Setup & Support": {
    intro: "Create a working email address or get help sending and receiving important documents.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Email help", [
        sel("setupType", "What do you need?", "Choose one", ["Create a new email account", "Recover an existing account", "Send an email", "Check or receive email", "Other"], { required: true }),
        sel("device", "Which device will you use?", "Choose one", ["Phone", "Laptop", "Both"]),
        f("existingEmail", "Existing email address", "If you have one", { type: "email" }),
        f("newEmailName", "Preferred new email name", "e.g. thabo.mokoena"),
        f("recoveryPhone", "Recovery phone number", "The number for verification codes", { type: "tel" }),
        sel("purpose", "What is the email for?", "Choose one", ["Government application", "Job application", "Business", "School", "Other"]),
        area("emailNotes", "Anything else we should know?", "The message you need to send, or the account you cannot access."),
      ]),
      ...deadline("3. Timing"),
    ],
  },

  // ------------------------------------------------------------- BUSINESS
  "eservice|Business Services|CIPC Good Standing Letter": {
    intro: "Retrieve a CIPC Good Standing Letter or compliance checklist for a tender, bank or contract.",
    fields: businessBase([
      radio("cipcLogin", "Do you have CIPC login details?", YES_NO_UNSURE),
      f("directorId", "Director ID number", "The ID number on the CIPC record"),
      sel("purpose", "What is the letter for?", "Choose one", ["Tender", "Bank", "Contract", "Compliance", "Other"]),
      area("cipcNotes", "Anything else about this request?", "Tender reference, deadline, or previous CIPC issues."),
    ], ["Company registration documents", "Director ID", "CIPC login details", "Tax clearance", "Other"]),
  },
  "eservice|Business Services|Google Business Profile Setup": {
    intro: "Get your business on Google Maps and local search with a complete, verified profile.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Business details", [
        req("businessName", "Business name", "The name customers search for"),
        sel("businessCategory", "Business category", "Choose one", ["Retail", "Food and beverage", "Beauty and wellness", "Construction", "Professional services", "Health", "Education", "Transport", "Other"]),
        req("businessAddress", "Physical address", "Street, suburb, town and postal code"),
        f("businessPhone", "Business phone number", "The number customers should call", { type: "tel" }),
        f("businessEmail", "Business email", "Optional public email", { type: "email" }),
        f("website", "Website", "Optional website or social page"),
        f("businessHours", "Business hours", "e.g. Mon–Fri 08:00–17:00, Sat 08:00–13:00"),
        radio("serviceArea", "Do you serve customers at your address or travel to them?", ["At my address", "I travel to customers", "Both"]),
      ]),
      ...sec("3. Profile assets", [
        radio("logoAvailable", "Do you have a logo?", YES_NO),
        sel("photoCount", "How many business photos can you provide?", "Choose one", ["None", "1–3", "4–10", "10+"]),
        sel("verificationMethod", "Preferred verification method", "Choose one", ["Postcard", "Phone", "Email", "Video", "Not sure"]),
        area("googleNotes", "Anything else about the business?", "Services, specialties, or details customers should see."),
      ]),
      ...deadline("4. Timing"),
    ],
  },
  "eservice|Business Services|UIF Monthly Employer Declaration": {
    intro: "Submit your monthly UIF declaration with accurate employee and earnings information.",
    fields: businessBase([
      f("uifReference", "UIF reference number", "The employer UIF reference"),
      f("declarationMonth", "Declaration month", "e.g. October 2026"),
      f("employeeCount", "Number of employees", "e.g. 8", { type: "number" }),
      f("totalEarnings", "Total monthly earnings", "The total declared to UIF"),
      radio("employeeChanges", "Did any employees join or leave this month?", YES_NO),
      radio("uifLogin", "Do you have UIF login details?", YES_NO_UNSURE),
      area("uifNotes", "Anything else about this declaration?", "New employees, terminations, or previous declaration issues."),
    ], ["UIF reference number", "Employee details", "Monthly earnings", "UIF login details", "Other"]),
  },
  "eservice|Business Services|UIF Employer Registration": {
    intro: "Register your business as a UIF employer and get the reference needed to declare and contribute.",
    fields: businessBase([
      f("tradeName", "Trading name", "If different from the registered name"),
      f("contactPerson", "Contact person", "The person UIF should contact"),
      f("employeeCount", "Number of employees", "e.g. 5", { type: "number" }),
      area("uifRegistrationNotes", "Anything else about the registration?", "Business activity, start date, or previous UIF registration."),
    ], ["Company registration documents", "Director ID", "Employee details", "Bank confirmation letter", "Other"]),
  },
  "eservice|Business Services|CSD Supplier Profile Update": {
    intro: "Keep your Central Supplier Database profile current so you remain eligible for government work.",
    fields: businessBase([
      f("supplierNumber", "CSD supplier number", "Your existing CSD number"),
      check("updateFields", "What needs to change?", "Select all that apply", ["Banking details", "Tax status", "Address", "Contact details", "BEE status", "Other"], { required: true }),
      area("newDetails", "New details", "Provide the exact information to update."),
      radio("taxClearance", "Is your tax clearance still valid?", YES_NO_UNSURE),
      area("csdUpdateNotes", "Anything else about this update?", "Tender deadlines, login issues, or previous CSD problems."),
    ], ["Company registration documents", "CSD supplier number", "Proof of the new details", "Tax clearance", "Bank confirmation letter", "Other"]),
  },
  "eservice|Business Services|UIF Benefits Claim": {
    intro: "Submit a UIF benefits claim with the correct forms, employment history and bank details.",
    fields: [
      ...client("1. Your details"),
      ...identityFields("2. Identity"),
      ...sec("3. Claim details", [
        sel("claimType", "What are you claiming for?", "Choose one", ["Unemployment", "Maternity", "Illness", "Dismissal", "Other"], { required: true }),
        f("uifReference", "UIF reference number", "If you have one"),
        f("lastEmployer", "Last employer", "Company name"),
        date("lastDayWorked", "Last day worked", "Choose a date", { dateRule: "past" }),
        sel("terminationReason", "Why did the job end?", "Choose one", ["Retrenched", "Dismissed", "Contract ended", "Resigned", "Maternity", "Illness", "Other"]),
        radio("ui19Available", "Do you have a UI19 form or termination letter?", YES_NO_UNSURE),
      ]),
      ...bankFields("4. Bank details"),
      ...documentChecklist("5. Supporting documents", ["SA ID / Smart ID", "UI19 form", "Termination letter", "Bank confirmation letter", "Proof of address", "Other"]),
      ...authorisation(),
    ],
  },
  "eservice|Business Services|CSD Supplier Registration": {
    intro: "Register your business on the Central Supplier Database so you can bid for government contracts.",
    fields: businessBase([
      sel("beeLevel", "BEE level", "Choose one", ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Non-compliant", "Not sure"]),
      f("contactPerson", "Contact person", "The person responsible for the profile"),
      f("businessAddress", "Business address", "Street, suburb, town and postal code"),
      area("csdNotes", "Anything else about the registration?", "Tender deadlines, categories, or special requirements."),
    ], ["Company registration documents", "Tax clearance", "Bank confirmation letter", "BEE certificate or affidavit", "Director ID", "Other"]),
  },

  // ---------------------------------------------------------- DIGITAL SETUP
  "eservice|Digital Setup|Social Media Business Profile Setup": {
    intro: "Set up a professional social media profile with the right name, bio, links and visuals.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Business details", [
        req("businessName", "Business name", "The name that should appear on the profile"),
        f("username", "Preferred username", "e.g. @apexbyteshub"),
        sel("businessCategory", "Business category", "Choose one", ["Retail", "Food and beverage", "Beauty and wellness", "Construction", "Professional services", "Health", "Education", "Transport", "Other"]),
        area("bio", "Short bio", "What the business does, in one or two lines."),
        area("contactDetails", "Contact details", "Phone, WhatsApp, email, website and address."),
        f("loginEmail", "Email for the account", "The email that will own the profile", { type: "email" }),
      ]),
      ...sec("3. Profile assets", [
        radio("logoAvailable", "Do you have a logo?", YES_NO),
        radio("photoAssets", "Do you have photos for the profile?", YES_NO),
        area("socialNotes", "Anything else about the profiles?", "Platforms to prioritise, handles to keep, or content to pin."),
      ]),
      ...deadline("4. Timing"),
    ],
  },
  "eservice|Digital Setup|WhatsApp Business Profile Setup": {
    intro: "Set up WhatsApp Business with a professional profile, catalogue, hours and automatic replies.",
    fields: [
      ...client("1. Your details"),
      ...sec("2. Business details", [
        req("businessName", "Business name", "The name customers will see"),
        req("businessPhone", "Dedicated business phone number", "The number that will use WhatsApp Business", { type: "tel" }),
        sel("businessCategory", "Business category", "Choose one", ["Retail", "Food and beverage", "Beauty and wellness", "Construction", "Professional services", "Health", "Education", "Transport", "Other"]),
        area("description", "Business description", "What you sell and who you serve."),
        f("businessAddress", "Business address", "Optional physical address"),
        f("businessHours", "Business hours", "e.g. Mon–Fri 08:00–17:00, Sat 08:00–13:00"),
        f("website", "Website", "Optional website or social page"),
      ]),
      ...sec("3. WhatsApp setup", [
        radio("catalog", "Do you want a product catalogue?", YES_NO),
        area("catalogItems", "Catalogue items", "List each product, price and short description.", { showWhen: { field: "catalog", equals: "Yes" } }),
        area("greetingMessage", "Greeting message", "The first message customers should receive."),
        area("awayMessage", "Away message", "What customers should see outside business hours."),
        area("whatsappNotes", "Anything else about the setup?", "Labels, quick replies, or existing WhatsApp data to keep."),
      ]),
      ...deadline("4. Timing"),
    ],
  },
  "eservice|Digital Setup|Learner's Licence Test Booking": {
    intro: "Book a learner's licence test at a traffic department, or ask us to find the next available centre.",
    fields: [
      ...client("1. Applicant details"),
      ...identityFields("2. Identity"),
      ...sec("3. Booking details", [
        sel("licenceCode", "Which learner's licence code?", "Choose one", ["Code 1 / A1", "Code 2 / A", "Code 3 / B", "Code 4 / EB", "Code 10 / C1", "Code 14 / EC", "Not sure"], { required: true }),
        sel("bookingType", "Is this a first booking or a retake?", "Choose one", ["First booking", "Retake after a failed test", "Renewal", "Not sure"], { required: true }),
        req("testCentre", "Preferred testing centre", "Town, suburb or traffic department name"),
        date("preferredDate", "Preferred test date", "Choose a date", { dateRule: "future" }),
        date("alternativeDate", "Alternative date", "Optional second choice", { dateRule: "future" }),
        radio("travelAllowed", "Can you travel to another testing centre?", YES_NO),
      ]),
      ...sec("4. Supporting documents", [
        check("documentsReady", "What do you already have?", "Select all that apply", ["SA ID / Smart ID", "Proof of address", "Learner's licence application form", "Eye test certificate", "Previous learner's licence", "Passport photo", "Other"]),
        area("bookingNotes", "Anything else we should know?", "Existing booking reference, accessibility needs, or date limits."),
      ]),
      ...deadline("5. Timing"),
    ],
  },

  // ----------------------------------------------------------------- TECH
  "tech|Software|Software Installation": {
    intro: "Tell us which program you need installed and whether you have the installation file or licence.",
    fields: techBase([
      req("softwareName", "Software name", "e.g. Microsoft Office, AutoCAD, Pastel"),
      sel("softwareSource", "Where is the installation file?", "Choose one", ["I have the installation file", "It must be downloaded", "Microsoft Store", "Vendor website", "Not sure"]),
      radio("licenseKey", "Do you have a valid licence or product key?", YES_NO_UNSURE),
      sel("installationType", "Installation type", "Choose one", ["New install", "Reinstall", "Upgrade", "Not sure"]),
      area("softwareNotes", "Anything else about the installation?", "Version needed, files to keep, or errors you have seen."),
    ], "3. Software details"),
  },
  "tech|Software|Device Driver Installation": {
    intro: "Fix missing or outdated drivers for sound, display, Wi-Fi, USB, printers or other hardware.",
    fields: techBase([
      sel("hardwareDevice", "Which hardware is not working?", "Choose one", ["Printer", "Graphics / display", "Sound", "Wi-Fi", "USB", "Camera", "Keyboard / mouse", "Other"], { required: true }),
      f("deviceBrand", "Hardware brand and model", "e.g. HP LaserJet M15, Realtek audio"),
      sel("driverSource", "Where should the driver come from?", "Choose one", ["Manufacturer website", "Windows Update", "Unknown", "Not sure"]),
      sel("issueSince", "When did the problem start?", "Choose one", ["After an update", "After connecting a new device", "Suddenly", "It never worked"]),
      area("driverNotes", "Anything else about the driver problem?", "Error messages, device manager warnings, etc."),
    ], "3. Driver details"),
  },
  "tech|Software|Software & Office Updates": {
    intro: "Update Windows, Office, browsers, antivirus and other software to the latest stable versions.",
    fields: techBase([
      check("softwareList", "What should be updated?", "Select all that apply", ["Windows", "Microsoft Office", "Browser", "Antivirus", "Drivers", "Other"], { required: true }),
      f("currentVersion", "Current version", "If you know it"),
      sel("updateReason", "Why do you want to update?", "Choose one", ["Performance", "Security", "Compatibility", "Required for work or school", "Other"]),
      radio("restartAllowed", "Can the device restart during the service?", YES_NO),
      area("updateNotes", "Anything else about the updates?", "Software that must keep working, or versions to avoid."),
    ], "3. Update details"),
  },
  "tech|Hardware|Printer Setup & Connection": {
    intro: "Set up a new printer, fix an offline printer, or get scanning and Wi-Fi working.",
    fields: techBase([
      sel("printerType", "Printer type", "Choose one", ["Inkjet", "Laser", "All-in-one", "Photo printer", "Label printer", "Other"], { required: true }),
      sel("connection", "How should the printer connect?", "Choose one", ["USB", "Wi-Fi", "Bluetooth", "Network cable", "Not sure"]),
      f("printerBrand", "Printer brand", "e.g. HP, Canon, Epson, Brother"),
      f("printerModel", "Printer model", "The model name or number"),
      f("routerBrand", "Router brand", "If connecting over Wi-Fi"),
      sel("printerIssue", "What is happening?", "Choose one", ["New printer setup", "Not printing", "Printer offline", "Scanning issue", "Wi-Fi connection issue", "Other"]),
      area("printerNotes", "Anything else about the printer?", "Error lights, paper jams, ink issues, etc."),
    ], "3. Printer details"),
  },
  "tech|Hardware|New PC Setup": {
    intro: "Set up a new laptop or desktop with Windows, Office, antivirus, printers and your files.",
    fields: techBase([
      sel("pcType", "Computer type", "Choose one", ["Laptop", "Desktop", "All-in-one"], { required: true }),
      f("pcBrand", "Brand", "e.g. HP, Lenovo, Dell"),
      f("pcModel", "Model", "The model name or number"),
      sel("osPreference", "Operating system", "Choose one", ["Windows 10", "Windows 11", "No preference"]),
      check("setupNeeds", "What should we set up?", "Select all that apply", ["Windows", "Microsoft Office", "Antivirus", "Printer", "Email", "Data transfer", "Other"]),
      radio("oldPcData", "Do you need files moved from an old computer?", YES_NO_UNSURE),
      area("softwareList", "Software to install", "List any programs you need."),
      area("newPcNotes", "Anything else about the setup?", "Work account, school requirements, or accessories."),
    ], "3. Setup details"),
  },
  "tech|Support|Computer Diagnostics & Troubleshooting": {
    intro: "Tell us what the computer is doing so we can diagnose the cause before replacing parts.",
    fields: techBase([
      sel("issueStart", "When did the problem start?", "Choose one", ["Today", "This week", "This month", "Longer ago"]),
      sel("issueFrequency", "How often does it happen?", "Choose one", ["Always", "Sometimes", "After an update", "Randomly"]),
      check("symptoms", "What are the symptoms?", "Select all that apply", ["Slow", "Freezing", "Crashing", "Blue screen", "No power", "Overheating", "Noise", "Internet problems", "Other"], { required: true }),
      f("errorMessage", "Error message or code", "Copy the exact wording if you can"),
      check("recentChanges", "What changed recently?", "Select all that apply", ["Windows update", "New software", "Hardware change", "Virus warning", "Nothing"]),
      area("diagnosticNotes", "Anything else about the problem?", "When it started, what you tried, and what makes it worse."),
    ], "3. Symptoms"),
  },
  "tech|Support|PC Tune-Up & Cleanup": {
    intro: "Speed up a slow computer, free up storage and clean out startup clutter.",
    fields: techBase([
      sel("tuneUpReason", "Why do you want a tune-up?", "Choose one", ["Slow performance", "Full storage", "Slow startup", "Fan noise", "Routine maintenance", "Other"]),
      sel("lastTuneUp", "When was it last tuned up?", "Choose one", ["Never", "Within 6 months", "1+ year ago", "Not sure"]),
      radio("dataBackup", "Is your data backed up?", YES_NO_UNSURE),
      area("softwareKeep", "Software or files that must stay", "List anything we should not remove."),
      area("tuneUpNotes", "Anything else about the tune-up?", "Startup programs, old files, or performance complaints."),
    ], "3. Tune-up details"),
  },
  "tech|Support|Virus & Malware Removal": {
    intro: "Remove viruses, malware, pop-ups and unwanted programs, then check that the device is clean.",
    fields: techBase([
      check("symptoms", "What are you seeing?", "Select all that apply", ["Pop-ups", "Browser redirects", "Slow performance", "Unknown programs", "Files missing", "Antivirus disabled", "Other"], { required: true }),
      radio("antivirusInstalled", "Is antivirus installed?", YES_NO_UNSURE),
      f("virusName", "Virus or warning name", "If you have seen a name or message"),
      radio("dataSensitive", "Is there sensitive data on the device?", YES_NO_UNSURE),
      area("virusNotes", "Anything else about the infection?", "When it started, what you clicked, and what you have tried."),
    ], "3. Infection details"),
  },
  "tech|Support|Windows Update & Repair": {
    intro: "Fix Windows updates that fail, get stuck, or leave the computer unable to boot properly.",
    fields: techBase([
      sel("windowsVersion", "Windows version", "Choose one", ["Windows 10", "Windows 11", "Not sure"], { required: true }),
      sel("updateIssue", "What is happening?", "Choose one", ["Update fails", "Update stuck", "Blue screen", "Boot loop", "Corrupted system files", "Other"], { required: true }),
      f("errorCode", "Error code", "Copy the exact code if you can"),
      f("lastSuccessfulBoot", "When did it last start normally?", "e.g. yesterday, last week"),
      area("repairNotes", "Anything else about the problem?", "What you tried, and whether you can still access Windows."),
    ], "3. Windows problem"),
  },
  "tech|Windows & Office|Windows Installation (No Activation)": {
    intro: "A clean Windows install without activation. Your existing licence can be activated separately.",
    fields: techBase([
      sel("installType", "Installation type", "Choose one", ["Clean install", "Reinstall", "Repair install"], { required: true }),
      sel("windowsVersion", "Windows version", "Choose one", ["Windows 10", "Windows 11"], { required: true }),
      sel("edition", "Edition", "Choose one", ["Home", "Pro", "Education", "Not sure"]),
      radio("dataBackup", "Is your data backed up?", YES_NO_UNSURE),
      radio("driverInstall", "Should we install the drivers too?", YES_NO),
      area("softwareList", "Software to install afterwards", "List any programs you need."),
      area("installNotes", "Anything else about the installation?", "Files to keep, partition changes, or work accounts."),
    ], "3. Installation details"),
  },
  "tech|Windows & Office|Windows Installation & Activation": {
    intro: "A clean Windows install with activation, drivers and the essentials ready to use.",
    fields: techBase([
      sel("installType", "Installation type", "Choose one", ["Clean install", "Reinstall", "Repair install"], { required: true }),
      sel("windowsVersion", "Windows version", "Choose one", ["Windows 10", "Windows 11"], { required: true }),
      sel("edition", "Edition", "Choose one", ["Home", "Pro", "Education", "Not sure"]),
      sel("licenseType", "Licence type", "Choose one", ["Retail", "OEM", "Digital licence", "Volume", "Not sure"]),
      radio("licenseKey", "Do you have the product key?", YES_NO_UNSURE),
      f("activationIssue", "Activation issue", "If Windows is already showing an error"),
      radio("dataBackup", "Is your data backed up?", YES_NO_UNSURE),
      area("softwareList", "Software to install afterwards", "List any programs you need."),
      area("installNotes", "Anything else about the installation?", "Files to keep, partition changes, or work accounts."),
    ], "3. Installation details"),
  },
  "tech|Windows & Office|Windows Activation Only": {
    intro: "Activate Windows on a device that is already installed, or fix an activation error.",
    fields: techBase([
      sel("windowsVersion", "Windows version", "Choose one", ["Windows 10", "Windows 11", "Not sure"], { required: true }),
      sel("edition", "Edition", "Choose one", ["Home", "Pro", "Education", "Not sure"]),
      sel("activationStatus", "What is the activation status?", "Choose one", ["Not activated", "Activation expired", "Error message", "New installation"], { required: true }),
      sel("licenseType", "Licence type", "Choose one", ["Retail", "OEM", "Digital licence", "Volume", "Not sure"]),
      radio("licenseKey", "Do you have the product key?", YES_NO_UNSURE),
      f("errorCode", "Activation error code", "Copy the exact code if you can"),
      area("activationNotes", "Anything else about the activation?", "Where the licence came from, or previous activation attempts."),
    ], "3. Activation details"),
  },
  "tech|Windows & Office|Microsoft 365 Installation & Setup": {
    intro: "Install Microsoft 365, sign in, activate the apps and set up Outlook or OneDrive.",
    fields: techBase([
      sel("planType", "Microsoft 365 plan", "Choose one", ["Personal", "Family", "Business Basic", "Business Standard", "Business Premium", "Not sure"], { required: true }),
      sel("installType", "What do you need?", "Choose one", ["New installation", "Reinstall", "Transfer licence", "Set up email", "Other"], { required: true }),
      f("accountEmail", "Microsoft account email", "The email linked to the subscription", { type: "email" }),
      radio("licenseKey", "Do you have a product key?", YES_NO_UNSURE),
      check("appsNeeded", "Which apps do you need?", "Select all that apply", ["Word", "Excel", "PowerPoint", "Outlook", "Teams", "OneDrive", "All"]),
      radio("dataTransfer", "Should we move existing files or email?", YES_NO_UNSURE),
      area("officeNotes", "Anything else about the setup?", "Old Office version, email accounts, or shared files."),
    ], "3. Microsoft 365 details"),
  },
}
