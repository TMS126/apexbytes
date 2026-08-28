// lib/contact-data.ts
// ─────────────────────────────────────────────────────────────────────────
// Contact page — static data & pure helper functions
// (hub color mapping, vCard generation, map embed URL)
// ─────────────────────────────────────────────────────────────────────────

import { BRAND, BIZ, HUB_COLORS, type HubKey } from "@/lib/brand"

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

// FIX: references the shared Tech Hub identity token so palette changes
// remain synchronized across contact and service surfaces.
export const CONTACT_GREY = { light: BRAND.dark100, dark: BRAND.techGreyDark }

export function downloadBusinessVCard() {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:Theji Meje — Apexbytes Hub`,
    `N:ApexbytesHub;Theji Meje;;;`,
    // FIX: was "ORG:ApexbytesHub" (no space) — contradicted this same
    // file's own NOTE field below, which correctly uses the spaced
    // "Apexbytes Hub" form. The earlier codebase audit already
    // established spaced "Apexbytes Hub" as the correct public-facing
    // brand form specifically for places like vCards.
    `ORG:Apexbytes Hub`,
    `TITLE:Founder & Lead Designer`,
    // FIX: was a hardcoded literal duplicating BIZ.phoneE164.
    `TEL;TYPE=CELL,PREF:${BIZ.phoneE164}`,
    // FIX: was a hardcoded literal duplicating BIZ.email.
    `EMAIL;TYPE=WORK:${BIZ.email}`,
    `ADR;TYPE=WORK:;;5878 Mpumalanga Section;Kgotsong;Bothaville;9660;South Africa`,
    // FIX: was the stale v0-apexbytes-hub-website.vercel.app domain.
    `URL:https://apexbytes.vercel.app/`,
    `NOTE:Apexbytes Hub — Print\\, Design\\, Docs\\, Tech & E-Services in Kgotsong\\, Bothaville.`,
    "END:VCARD",
  ].join("\r\n")

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement("a")
  a.href     = url
  a.download = "ApexbytesHub.vcf"
  // FIX: same detached-element / premature-revoke issue as
  // profile-drawer.tsx — see that file's comment for the reasoning.
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function buildOsmEmbedSrc(lat: number, lng: number) {
  const deltaLat = 0.003
  const deltaLng = 0.004
  const bbox = [lng - deltaLng, lat - deltaLat, lng + deltaLng, lat + deltaLat].join(",")
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`
}

export const MAP_EMBED_SRC = buildOsmEmbedSrc(BIZ.lat, BIZ.lng)
export const MAP_LOAD_TIMEOUT_MS = 7000 
