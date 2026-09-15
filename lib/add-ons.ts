// lib/add-ons.ts
// Single source of truth for the add-ons introduced 15 September 2026 —
// both the Services page notice and the Pricing page card render from
// this list, so wording/prices only ever need to change in one place.
export interface AddOn {
  name: string
  price: string
  desc: string
}

export const ADD_ONS_EFFECTIVE_DATE = "15 September 2026"

export const PAID_ADD_ONS: AddOn[] = [
  { name: "Photo Collage", price: "R5", desc: "We put many photos together on one page." },
  { name: "Proofreading", price: "R10", desc: "We check and fix spelling mistakes before printing." },
  { name: "File Conversion", price: "R5", desc: "We change your file — Word to PDF, HEIC to JPG." },
  { name: "Photo Enhancement", price: "R5", desc: "We make a dark or faded photo brighter and clear." },
  { name: "Background Removal", price: "R5", desc: "We remove the background behind you to clean white." },
  { name: "Professional Formatting", price: "R20", desc: "We make your document look neat and professional." },
  { name: "PDF + Word Bundle", price: "R10", desc: "You get both PDF for printing and Word to edit later." },
  { name: "Rush 30-Minutes", price: "R10", desc: "You jump the queue, we finish in 30 minutes." },
  { name: "Extra Revision", price: "R10", desc: "Second change to same typed document after printing." },
  { name: "Bulk Printing", price: "Bulk Price", desc: "The more copies you print, the cheaper per page." },
]

export const FREE_ADD_ONS: string[] = [
  "Digital Copy on WhatsApp / Email / USB",
  "Stapling",
  "Hole Punching",
  "Combine Many Scans Into One PDF",
  "Border or No Border Photo Prints — same price",
]

export const ADD_ONS_FOOTER = "More coming soon…"
