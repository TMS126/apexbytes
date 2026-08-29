// components/services-page/mobile-hub-card.tsx — full file
"use client"

import { useState } from "react"
import {
  ArrowUpRight, WarningCircle,
  Printer, FileText, PaintBrush, Globe, Desktop,
} from "@phosphor-icons/react"
import { BRAND, TOKEN } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"

// Same icon set as the hero's HubIconField — used here instead of the
// old PNG thumbnails so both places read as one consistent icon system.
export const HUB_ICON: Record<HubId, React.ElementType> = {
  print: Printer, doc: FileText, design: PaintBrush, eservice: Globe, tech: Desktop,
}

// Desktop 5-card landing grid ribbon — unchanged diagonal-corner treatment.
export function BulkRibbon({ fill }: { fill: string }) {
  return (
    <div className="absolute top-4 -right-8 rotate-45 z-20 pointer-events-none">
      <span
        className="block w-28 text-center py-0.5 text-[0.62rem] font-black uppercase tracking-wider text-white abh-shadow-badge"
        style={{ backgroundColor: fill }}
      >
        Bulk
      </span>
    </div>
  )
}

export function NoticeBadge() {
  return (
    <div className="absolute top-3 right-3 z-20 pointer-events-none">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center abh-shadow-badge"
        style={{ backgroundColor: "#ffffff", color: TOKEN.warningBg }}
        aria-label="Notice for some services in this hub"
      >
        <WarningCircle size={16} weight="bold" aria-hidden="true" />
      </div>
    </div>
  )
}

// Mobile-card bulk badge — a pill centered on the card's bottom edge,
// half in / half out, per spec ("very edge, at the center"). Legible,
// not bold.
function BulkEdgePill({ fill }: { fill: string }) {
  return (
    <span
      className="absolute left-1/2 -bottom-2.5 -translate-x-1/2 z-20 px-3 py-0.5 rounded-full text-[0.68rem] font-medium text-white whitespace-nowrap abh-shadow-badge"
      style={{ backgroundColor: fill }}
    >
      Bulk pricing
    </span>
  )
}

// ══════════════════════════════════════════════════════════════════════
// MOBILE HUB CARD — flat and icon-led. No thumbnail, no gradient, no
// background pill behind the icon — everything neutral by default, and
// touch is the only thing that introduces color (the icon tints to the
// hub's accent and switches to a filled weight; the arrow tints to the
// hub's accent too, from its default orange). Loosely modeled on a flat
// settings-card reference: icon + index top row, title, description,
// arrow anchored bottom-right. No line-clamp — text is never truncated.
// ══════════════════════════════════════════════════════════════════════
export function MobileHubCard({
  hubId, hub, accent, primary, hubHasBulk, hubHasNotice, orderIndex, onClick,
}: {
  hubId: HubId
  hub: (typeof HUBS)[HubId]
  accent: string
  primary: string
  hubHasBulk: boolean
  hubHasNotice: boolean
  orderIndex: number
  onClick: () => void
}) {
  const [pressed, setPressed] = useState(false)
  const Icon = HUB_ICON[hubId]
  const number = String(orderIndex + 1).padStart(2, "0")
  const release = () => setPressed(false)

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      aria-label={`Open ${hub.title}`}
      className="relative w-full min-h-[152px] text-left rounded-[14px] bg-card border border-[var(--card-border)] overflow-visible transition-all duration-200 active:scale-[0.98] transform-gpu p-4 flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon
            size={30}
            weight={pressed ? "fill" : "regular"}
            color={pressed ? accent : "var(--muted-foreground)"}
            className="transition-colors duration-150"
            aria-hidden="true"
          />
          {hubHasNotice && (
            <WarningCircle
              size={14}
              weight="fill"
              aria-label="Notice for some services in this hub"
              style={{ color: BRAND.orange }}
            />
          )}
        </div>
        <span className="text-[0.78rem] font-black" style={{ color: BRAND.orange }} aria-hidden="true">
          {number}
        </span>
      </div>

      <h3 className="font-sans font-black text-[1.05rem] leading-tight text-foreground mb-1.5 break-words">
        {hub.title}
      </h3>

      <p className="text-[0.82rem] text-muted-foreground leading-snug flex-1">
        {hub.desc}
      </p>

      <div className="flex justify-end mt-3">
        <ArrowUpRight
          size={16}
          weight="bold"
          className="transition-colors duration-150"
          style={{ color: pressed ? accent : BRAND.orange }}
          aria-hidden="true"
        />
      </div>

      {hubHasBulk && <BulkEdgePill fill={primary} />}
    </button>
  )
} 
