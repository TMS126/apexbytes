// components/quote-calculator/pdf-names.ts
/* ============================================================
   PDF SERVICE NAMES — how each service reads on the quote PDF.
   Key = the cart item id: `${hubId}-${sectionTitle}-${itemName}`
   One clear line per service, no repeated category words.
   A service that is not listed here simply shows its own name.
   ============================================================ */

const PDF_NAMES: Record<string, string> = {
  // ── Print hub ──
  "print-Printing-Black & White": "Black & White Printing",
  "print-Printing-Colour": "Colour Printing",
  "print-Copying-Black & White": "Black & White Copying",
  "print-Copying-Colour": "Colour Copying",
  "print-Photo Printing-4x6 Glossy": "4x6 Glossy Photo Print",
  "print-Photo Printing-A4 Glossy": "A4 Glossy Photo Print",

  // ── Document hub ──
  "doc-Typing + Printing-Black & White": "Typing & Printing (Black & White)",
  "doc-Typing + Printing-Colour": "Typing & Printing (Colour)",
  "doc-CV Services-CV from Scratch": "CV Written from Scratch",
  "doc-CV Services-CV Upgrade/Fix": "CV Upgrade / Fix",
  "doc-CV Services-Cover Letter": "Cover Letter",
  "doc-Other Documents-Affidavit / Letter": "Affidavit / Letter",
  "doc-Scanning-Scan to Digital": "Document Scanning",
  "doc-Laminating-A5": "A5 Laminating",
  "doc-Laminating-A4": "A4 Laminating",
  "doc-Laminating-A3": "A3 Laminating",

  // ── Design hub ──
  "design-Logos-Basic Logo": "Basic Logo Design",
  "design-Logos-Standard Logo": "Standard Logo Design",
  "design-Logos-Premium Logo": "Premium Logo Design",
  "design-Business Cards-Single Side - Business Card": "Business Card Design (Single Side)",
  "design-Business Cards-Double Side - Business Card": "Business Card Design (Double Side)",
  "design-Flyers & Posters-Simple Design": "Simple Flyer / Poster Design",
  "design-Flyers & Posters-Custom Design": "Custom Flyer / Poster Design",
  "design-Flyers & Posters-Complex Design": "Complex Flyer / Poster Design",
  "design-Social Media-Post Design": "Social Media Post Design",
  "design-Social Media-Post + Story Designs": "Social Media Post + Story Designs",
  "design-Invitations-Image/Static Inv. Design": "Image / Static Invitation Design",
  "design-Invitations-Video Inv. Creation": "Video Invitation",
  "design-Business Profile-Basic Profile (1 page)": "Basic Business Profile (1 page)",
  "design-Business Profile-Standard Profile (2-3 pages)": "Standard Business Profile (2-3 pages)",
  "design-Business Profile-Premium Profile (4-5 pages)": "Premium Business Profile (4-5 pages)",
  "design-Business Profile-Additional Pages (beyond 5)": "Extra Business Profile Pages (beyond 5)",
  "design-Revisions-While Busy": "Design Revisions (while in progress)",
  "design-Revisions-After Completion": "Design Revisions (after completion)",

  // ── eService hub ──
  "eservice-SASSA-SASSA Status Check": "SASSA Status Check",
  "eservice-SASSA-UPDATE Details": "SASSA Details Update",
  "eservice-SASSA-SASSA Reapplication": "SASSA Reapplication",
  "eservice-SASSA-SRD Application": "SASSA SRD Application",
  "eservice-SASSA-SASSA Grant Appeal": "SASSA Grant Appeal",
  "eservice-SASSA-SASSA Banking Update": "SASSA Banking Update",
  "eservice-SASSA-Grant Application": "SASSA Grant Application",
  "eservice-SARS-Enquiry / Statement / Updates": "SARS Enquiry / Statement / Updates",
  "eservice-SARS-New Taxpayer / eFiling": "SARS New Taxpayer / eFiling",
  "eservice-SARS-Tax Pin / Penalty": "Tax PIN / Penalty",
  "eservice-SARS-Tax Clearance": "Tax Clearance",
  "eservice-SARS-Pin Submission": "Tax PIN Submission",
  "eservice-SARS-Tax Return / VAT / PAYE": "Tax Return / VAT / PAYE",
  // PSIRA (section is switched off for now, ready for when it returns)
  "eservice-PSIRA-PSIRA Status Check": "PSIRA Status Check",
  "eservice-PSIRA-Update / Certificate": "PSIRA Certificate Update",
  "eservice-PSIRA-Lost Certificate": "PSIRA Lost Certificate",
  "eservice-PSIRA-Renewal / New Registration": "PSIRA Renewal / New Registration",
  "eservice-PSIRA-ID Application": "ID Application",
  "eservice-Online Applications-NSFAS Status Check": "NSFAS Status Check",
  "eservice-Online Applications-NSFAS Banking Update": "NSFAS Banking Update",
  "eservice-Online Applications-Learnership Application": "Learnership Application",
  "eservice-Online Applications-Job / DPSA Application": "Job / DPSA Application",
  "eservice-Online Applications-Bursary Application": "Bursary Application",
  "eservice-Online Applications-NSFAS Appeal": "NSFAS Appeal",
  "eservice-Online Applications-NSFAS Application": "NSFAS Application",
  "eservice-Online Applications-University Application": "University Application",
  "eservice-Email Services-Setup / Send / Receive": "Email Setup / Send / Receive",
  "eservice-Business Services-Good Standing Letter": "Good Standing Letter",
  "eservice-Business Services-Google Business Setup": "Google Business Setup",
  "eservice-Business Services-UIF Monthly Declaration": "UIF Monthly Declaration",
  "eservice-Business Services-UIF Registration": "UIF Registration",
  "eservice-Business Services-CSD Update": "CSD Update",
  "eservice-Business Services-UIF Claims": "UIF Claims",
  "eservice-Business Services-CSD Registration": "CSD Registration",
  "eservice-Digital Setup-Social Media Setup": "Social Media Setup",
  "eservice-Digital Setup-Learner's Licence Booking": "Learner's Licence Booking",
  "eservice-Digital Setup-WhatsApp Business Setup": "WhatsApp Business Setup",

  // ── Tech hub ──
  "tech-Software-Software Install": "Software Installation",
  "tech-Software-Driver Installation": "Driver Installation",
  "tech-Software-App / Office Updates": "App / Office Updates",
  "tech-Hardware-Printer Setup": "Printer Setup",
  "tech-Hardware-PC Setup": "PC Setup",
  "tech-Support-Troubleshooting": "Troubleshooting (per hour)",
  "tech-Support-PC Cleanup": "PC Cleanup",
  "tech-Support-Virus / Malware Removal": "Virus / Malware Removal",
  "tech-Support-OS Update": "Operating System Update",
  "tech-Windows & Office-Windows Install (No Activation)": "Windows Install (No Activation)",
  "tech-Windows & Office-Windows Install + Activation": "Windows Install + Activation",
  "tech-Windows & Office-Activation Only": "Windows Activation Only",
  "tech-Windows & Office-Microsoft 365 Setup": "Microsoft 365 Setup",
}

export function pdfServiceName(item: { id: string; name: string }): string {
  return PDF_NAMES[item.id] ?? item.name
}
