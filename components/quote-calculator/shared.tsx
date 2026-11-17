"use client"

/* ============================================================
   AUDIT: getReadableTextColor(hex) only works on a literal hex
   string. HUB_COLORS.accentLight/accentDark and HOME_BLUE.light/dark
   are all CSS var() references (e.g. "var(--hub-tech-primary)") —
   passing those in silently produced garbage, which is the root
   cause of the invisible hub icons / pills / badges. For hub colors,
   use HUB_ON_COLOR from lib/brand.ts instead (a real per-theme
   token). This function is kept only for cases where you truly have
   a resolved hex string at runtime (e.g. a user-picked color from a
   future settings screen) — don't reach for it for anything already
   backed by a design token.
   ============================================================ */

import { Printer, FileText, PaintBrush, Globe, Desktop } from "@phosphor-icons/react"
import { BRAND } from "@/lib/brand"
import { HubId } from "@/lib/data"

export const HOME_BLUE = { light: BRAND.blue, dark: BRAND.lightBlue }

export function getReadableTextColor(hex: string): string {
  const clean = hex.replace("#", "")
  const r = parseInt(clean.substring(0, 2), 16) / 255
  const g = parseInt(clean.substring(2, 4), 16) / 255
  const b = parseInt(clean.substring(4, 6), 16) / 255
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  const contrastWhite = 1.05 / (luminance + 0.05)
  const contrastDark  = (luminance + 0.05) / 0.062
  return contrastWhite >= contrastDark ? "#ffffff" : "#18181b"
}

export const GLASS = {
  panel:   "border border-border/80 bg-card shadow-none",
  section: "border border-border/70 bg-muted/30",
  item:    "border border-border/60 bg-card",
  pill:    "bg-muted",
  btn:     "border border-border/70 bg-muted",
} as const

export function HubIcon({ id, size = 16, color }: { id: HubId; size?: number; color?: string }) {
  const p = { size, weight: "fill" as const, color: color ?? "currentColor", "aria-hidden": true }
  switch (id) {
    case "print":    return <Printer    {...p} />
    case "doc":      return <FileText   {...p} />
    case "design":   return <PaintBrush {...p} />
    case "eservice": return <Globe      {...p} />
    case "tech":     return <Desktop    {...p} />
  }
} 
