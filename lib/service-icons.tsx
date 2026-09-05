import * as Phosphor from "@phosphor-icons/react"

const ICONS = {
  "B&W Print / Copy": "Printer", "Colour Print / Copy": "Copy", "Bulk Printing": "Stack", "Glossy Photo (4×6)": "Image", "Glossy Photo (A4)": "Images",
  "Typing + Print (B&W)": "Keyboard", "Typing + Print (Colour)": "TextT", "Affidavit / Letter Typing": "FileText", "CV Creation": "ReadCvLogo", "CV Revamp": "IdentificationCard", "Cover Letter": "Envelope", "Scanning to Digital": "Scan", "Laminating (A5)": "Shield", "Laminating (A4)": "ShieldCheck", "Laminating (A3)": "SealCheck",
  "Logo — Starter": "PenNib", "Logo — Standard": "PaintBrushBroad", "Logo — Full Brand": "Crown", "Business Card (Single Side)": "Cardholder", "Business Card (Double Side)": "Cards", "Flyer / Poster — Basic": "Layout", "Flyer / Poster — Standard": "Presentation", "Flyer / Poster — Premium": "FlagBanner", "Social Media Post": "Megaphone", "Post + Story": "InstagramLogo", "Static Invitation": "EnvelopeOpen", "Video Invitation": "Video", "Revision — During Project": "ArrowsClockwise", "Revision — After Completion": "ClockCounterClockwise",
  "Status Check": "MagnifyingGlass", "SRD Application": "HandCoins", "Banking Update": "Bank", "Grant Application": "Coins", "Appeal Submission": "Gavel", "Change of Contact Details": "PhoneCall", "Payment Date / Balance Check": "CalendarCheck", "Reapplication (after rejection)": "ArrowUUpLeft",
  "Enquiry": "Question", "eFiling Registration": "UserPlus", "New Taxpayer Registration": "IdentificationBadge", "Contact Details Update": "AddressBook", "Banking Details Update": "CreditCard", "Statement of Account Request": "Receipt", "Tax Compliance Pin Issuing": "Key", "Tax Clearance Certificate": "Certificate", "Tax Return / ITR12 (Simple)": "Files", "Tax Compliance Pin Submission": "PaperPlaneTilt", "Auto Assessment (Accept / Edit)": "Scales", "VAT Registration": "Percent", "PAYE Registration": "UsersThree", "Penalty Remission Request": "WarningCircle",
  "Job Application": "Briefcase", "University Application": "GraduationCap", "NSFAS Application": "Student", "Bursary Application": "BookBookmark", "Learnership Application": "BookOpen", "Internship Application": "Buildings", "Government Jobs (DPSA)": "Flag", "NSFAS Appeal": "Scroll", "NSFAS Banking Detail Update": "PiggyBank", "NSFAS Status Check": "ChartBar",
  "Certificate Assistance": "ShieldStar", "Renewal": "ArrowClockwise", "ID Application": "UserList", "New Registration (Grade E)": "UserCirclePlus", "Address / Contact Update": "MapPinLine", "Lost Certificate Application": "FileX",
  "CSD Update": "Database", "UIF Registration": "Building", "UIF Claims": "Wallet", "CSD Registration": "Storefront", "UIF uFiling Registration": "GlobeHemisphereWest", "UIF Employer Registration": "BuildingOffice", "UIF Monthly Declaration": "CalendarBlank", "Letter of Good Standing": "Stamp", "Google My Business Setup": "GoogleLogo",
  "Home Affairs Status Check": "Fingerprint", "DLTC Learner's Licence Booking": "Car", "WhatsApp Business Setup": "WhatsappLogo", "Social Media Account Setup": "Users", "Email Setup / Assistance": "At",
  "Minor Software Install": "DownloadSimple", "Windows / Office Install (Unactivated)": "WindowsLogo", "Windows / Office Install + Activation": "Monitor", "Windows Activation Only": "KeyReturn", "App & Office Updates": "ArrowsDownUp", "Full Windows OS Update": "CloudArrowUp", "Driver Installation": "HardDrive", "Microsoft 365 Setup": "MicrosoftOutlookLogo", "PC Setup & Hardware": "ComputerTower", "Printer Setup": "PlugsConnected", "Troubleshooting": "Wrench", "Virus / Malware Removal": "Bug", "PC Cleanup / Optimization": "Broom",
} as const satisfies Record<string, keyof typeof Phosphor>

const aliases: Record<string, keyof typeof ICONS> = {
  "B&W Print": "B&W Print / Copy", "Colour Print": "Colour Print / Copy", "B&W Copy": "B&W Print / Copy", "Colour Copy": "Colour Print / Copy", "CV from Scratch": "CV Creation", "CV Upgrade": "CV Revamp", "Logo (Basic)": "Logo — Starter", "Logo (Standard)": "Logo — Standard", "Logo (Full Brand)": "Logo — Full Brand", "Software Install": "Minor Software Install", "PC Setup": "PC Setup & Hardware", "Virus Removal": "Virus / Malware Removal",
}

export function serviceIconName(label: string): keyof typeof Phosphor {
  const key = (Object.prototype.hasOwnProperty.call(ICONS, label) ? label : aliases[label]) as keyof typeof ICONS | undefined
  return key ? ICONS[key] : "FileText"
}

export function ServiceGlyph({ label, size = 19, color }: { label: string; size?: number; color?: string }) {
  const Icon = Phosphor[serviceIconName(label)] as React.ElementType
  return <Icon size={size} weight="regular" color={color ?? "currentColor"} aria-hidden="true" />
}
