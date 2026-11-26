// lib/contact-data.ts
// ─────────────────────────────────────────────────────────────────────────
// Contact page — static data & pure helper functions
// (hub color mapping, vCard generation, map embed URL)
// ─────────────────────────────────────────────────────────────────────────

import { BRAND, BIZ, HUB_COLORS, type HubKey } from "@/lib/brand"
import { downloadVCard } from "@/lib/vcard"

export const FORM_HUB_KEYS: Record<string, HubKey | null> = {
  "Print Hub":                  "print",
  "Document Hub":                "doc",
  "Design Hub":                  "design",
  "E-Service Hub":               "eservice",
  "Tech Hub":                    "tech",
  "Not Sure — Help Me Choose":  null,
}

export function getFormHubColor(opt: string, isDark: boolean): string {
  const key = FORM_HUB_KEYS[opt]
  if (!key) return isDark ? BRAND.neutral400 : BRAND.neutral500
  const c = HUB_COLORS[key]
  return isDark ? c.accentDark : c.accentLight
}

// FIX: was a hardcoded `dark: "#B8CCE0"` — that's the exact value already
// defined as BRAND.techGreyDark. Referencing the token instead of
// re-typing the hex means it only ever needs to change in one place.
export const CONTACT_GREY = { light: BRAND.dark100, dark: BRAND.techGreyDark }

export function downloadBusinessVCard() {
  downloadVCard("ApexBytesHub.vcf", [
    `FN:Theji Meje — ApexBytesHub`,
    `N:ApexBytesHub;Theji Meje;;;`,
    // FIX: was "ORG:ApexBytesHub" (no space) — contradicted this same
    // file's own NOTE field below, which correctly uses the spaced
    // "ApexBytesHub" form. The earlier codebase audit already
    // established exact "ApexBytesHub" as the correct public-facing
    // brand form specifically for places like vCards.
    `ORG:ApexBytesHub`,
    `TITLE:Founder & Lead Designer`,
    // Calls and WhatsApp are separate lines; the call number is preferred.
    `TEL;TYPE=CELL,PREF:${BIZ.callPhoneE164}`,
    `TEL;TYPE=CELL:${BIZ.whatsappPhoneE164}`,
    // FIX: was a hardcoded literal duplicating BIZ.email.
    `EMAIL;TYPE=WORK:${BIZ.email}`,
    `ADR;TYPE=WORK:;;5878 Mpumalanga Section;Kgotsong;Bothaville;9660;South Africa`,
    // FIX: was the stale v0-apexbytes-hub-website.vercel.app domain.
    `URL:https://apexbytes.vercel.app/`,
    `NOTE:ApexBytesHub — Print\\, Design\\, Docs\\, Tech & E-Services in Kgotsong\\, Bothaville.`,
  ])
}

export function buildOsmEmbedSrc(lat: number, lng: number) {
  const deltaLat = 0.003
  const deltaLng = 0.004
  const bbox = [lng - deltaLng, lat - deltaLat, lng + deltaLng, lat + deltaLat].join(",")
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`
}

export const MAP_EMBED_SRC = buildOsmEmbedSrc(BIZ.lat, BIZ.lng)
export const MAP_LOAD_TIMEOUT_MS = 7000 
