/* components/services-page/lib.ts */
/**
 * ────────────────────────────────────────────────────────────────────────
 * SHARED HELPERS FOR THE SERVICES PAGE
 *
 * This file has no UI in it — it's constants, small pure functions, and
 * the SelectedService type that gets passed around between HubModal and
 * ServiceDetailModal whenever someone taps a service.
 * ────────────────────────────────────────────────────────────────────────
 */

import { HUBS, HubId, TURNAROUND, TURNAROUND_OVERRIDE } from "@/lib/data"

// ─── Constants ────────────────────────────────────────────────────────────
export const HUB_ORDER: HubId[] = ["print", "doc", "design", "eservice", "tech"]

export const HUB_PREVIEWS: Record<HubId, [string, string, string]> = {
  print:    ["Print Documents", "Copy Pages", "Photo Prints"],
  doc:      ["Build CVs", "Laminate Docs", "Type Letters"],
  design:   ["Design Logos", "Make Flyers", "Social Posts"],
  eservice: ["SASSA Help", "SARS eFiling", "UIF Claims"],
  tech:     ["Install Windows", "Remove Viruses", "Fix Laptops"],
}

export const MAX_UPLOAD_MB = 5
// Keep the browser picker aligned with the stricter server-side allowlist.
// The server remains authoritative and also verifies basic file signatures.
export const ALLOWED_UPLOAD_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
export const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
])

export const HUB_ACCEPT: Record<HubId, string> = {
  print: ALLOWED_UPLOAD_EXTENSIONS,
  doc: ALLOWED_UPLOAD_EXTENSIONS,
  design: ALLOWED_UPLOAD_EXTENSIONS,
  eservice: ALLOWED_UPLOAD_EXTENSIONS,
  tech: ALLOWED_UPLOAD_EXTENSIONS,
}

export const NOTICE = {
  text:      "Add-on services will be available from ",
  date:      "15 September 2026",
  textAfter: ". Minor price adjustments have also been made across some services. We appreciate your continued support and will keep you updated as we grow.",
}

// ─── Turnaround lookup ────────────────────────────────────────────────────
export function getTurnaround(sectionTitle: string, itemName: string): string {
  return TURNAROUND_OVERRIDE[itemName] ?? TURNAROUND[sectionTitle] ?? "Same day"
}

// ─── Lightweight analytics stub ───────────────────────────────────────────
export function trackEvent(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("abh:track", { detail: { name, ...payload } }))
  }
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[track]", name, payload)
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────
export function formatAcceptHint(accept: string) {
  return accept
    .split(",")
    .map(ext => ext.trim().replace(/^\./, "").toUpperCase())
    .filter(Boolean)
    .join(", ")
}

const SUFFIX_SECTIONS: Record<string, string> = {
  "Printing": "Printing", "Copying": "Copying", "Photo Printing": "Photo Printing",
  "Typing + Printing": "Typing and Printing", "Laminating": "Laminating",
  "Business Cards": "Business Cards", "Flyers & Posters": "Flyers and Posters",
  "Invitations": "Invitations", "Revisions": "Revisions",
}
const PREFIX_SECTIONS: Record<string, string> = {
  "SASSA": "SASSA", "SARS": "SARS", "PSIRA": "PSIRA",
  "Social Media": "Social Media", "Email Services": "Email",
}

export function cleanText(s: string) {
  return s.replace(/\s*\/\s*/g, " or ").replace(/\s*\+\s*/g, " and ").replace(/\s*&\s*/g, " and ")
}

export function naturalServiceLabel(name: string, sectionTitle: string) {
  const cleanName = cleanText(name)
  if (SUFFIX_SECTIONS[sectionTitle]) return `${cleanName} ${SUFFIX_SECTIONS[sectionTitle]}`
  if (PREFIX_SECTIONS[sectionTitle]) {
    const keyword = PREFIX_SECTIONS[sectionTitle]
    if (cleanName.toLowerCase().startsWith(keyword.toLowerCase())) return cleanName
    return `${keyword} ${cleanName}`
  }
  return cleanName
}

// ─── WCAG contrast helpers ─────────────────────────────────────────────────
function hexToRgb(hex: string) {
  const clean = hex.replace("#", "")
  const full = clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean
  const bigint = parseInt(full, 16)
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

export function contrastRatio(hexA: string, hexB: string) {
  const lA = relativeLuminance(hexToRgb(hexA))
  const lB = relativeLuminance(hexToRgb(hexB))
  const [lighter, darker] = lA > lB ? [lA, lB] : [lB, lA]
  return (lighter + 0.05) / (darker + 0.05)
}

export function getContrastText(hex: string) {
  const whiteRatio = contrastRatio(hex, "#ffffff")
  const blackRatio = contrastRatio(hex, "#1a1a1a")
  return whiteRatio >= blackRatio ? "#ffffff" : "#1a1a1a"
}

// ─── Search ─────────────────────────────────────────────────────────────────
export interface SearchableService {
  hubId: HubId; sectionTitle: string; name: string
  price: string; description: string; requirements: string[]; turnaround?: string
}

export function buildSearchIndex(): SearchableService[] {
  const all: SearchableService[] = []
  HUB_ORDER.forEach((hubId) => {
    HUBS[hubId].sections.forEach((section) => {
      section.items.forEach((item) => {
        all.push({
          hubId, sectionTitle: section.title,
          name: item.name, price: item.price,
          description: item.description ?? "",
          requirements: item.requirements,
          turnaround: getTurnaround(section.title, item.name),
        })
      })
    })
  })
  return all
}

// ─── SelectedService ──────────────────────────────────────────────────────
// This is the shape passed from HubModal -> ServicesPage -> ServiceDetailModal
// whenever someone taps a service. `tips` and `notice` are both optional —
// most services have neither, some have tips, and a rare few (like an
// NSFAS item during a known delay) also carry a `notice`.
export interface SelectedService {
  name: string; price: string; hubId: HubId
  sectionTitle: string; requirements: string[]; desc?: string; turnaround?: string
  tips?: string[]
  notice?: string   // Set only when this specific service has an active warning to show
} 
