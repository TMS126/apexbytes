// components/services-page/mobile-hub-card.tsx
"use client"

import Image from "next/image"
import { CaretRight, WarningCircle } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { BRAND, TOKEN } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"

export const HUB_ICON_SRC: Record<HubId, string> = {
  print: "/phub.png",
  doc: "/dochub.png",
  design: "/dhub.png",
  eservice: "/ehub.png",
  tech: "/thub.png",
}

export const HUB_STAT_TAG: Record<HubId, string> = {
  print: "Active",
  doc: "Popular",
  design: "Custom-built",
  eservice: "Handled for you",
  tech: "On-site support",
}

// Bulk ribbon — now takes a `fill` prop (hub color) instead of a fixed
// blue, matching what MobileBulkRibbon already did correctly. Used by
// both the desktop 5-card landing grid and anywhere else that needs it.
export function BulkRibbon({ fill }: { fill: string }) {
  return (
    <div className="absolute top-4 -right-8 rotate-45 z-20 pointer-events-none">
      <span
        className="block w-28 text-center py-0.5 text-[0.62rem] font-black uppercase tracking-wider text-white"
        style={{ backgroundColor: fill, boxShadow: `0 4px 10px -2px ${fill}8c, 0 2px 4px -1px rgba(0,0,0,0.25)` }}
      >
        Bulk
      </span>
    </div>
  )
}

export function MobileBulkRibbon({ fill }: { fill: string }) {
  return (
    <div className="absolute -top-1 -right-1 z-20 pointer-events-none w-16 h-16 overflow-hidden">
      <span
        className="absolute top-[11px] right-[-21px] rotate-45 block w-20 text-center py-0.5 text-[0.56rem] font-black uppercase tracking-wider text-white"
        style={{ backgroundColor: fill, boxShadow: "0 3px 8px -2px rgba(0,0,0,0.35)" }}
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
        className="w-7 h-7 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "#ffffff", color: TOKEN.warningBg, boxShadow: "0 2px 6px -1px rgba(0,0,0,0.2)" }}
        aria-label="Notice for some services in this hub"
      >
        <WarningCircle size={16} weight="bold" aria-hidden="true" />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// MOBILE HUB CARD — landscape only now (was portrait/landscape toggle).
// Every card uses this same shape, matching what used to be the Tech
// Hub card's unique layout. Icon stays as the source PNG but is
// desaturated to a neutral tone via CSS filter, so the ONLY colored
// element on the card is the small accent ring behind it and the bulk
// ribbon/notice badge — matching "icons neutral, one accent element
// holds the hub color" across both light and dark mode. Fixed min-height
// keeps every card the same size regardless of description length.
// ══════════════════════════════════════════════════════════════════════
export function MobileHubCard({
  hubId, hub, accent, primary, hubHasBulk, hubHasNotice, onClick,
}: {
  hubId: HubId
  hub: (typeof HUBS)[HubId]
  accent: string
  primary: string
  hubHasBulk: boolean
  hubHasNotice: boolean
  onClick: () => void
}) {
  const itemCount = hub.sections.reduce((sum, s) => sum + s.items.length, 0)

  return (
    <button
      onClick={onClick}
      aria-label={`Open ${hub.title}`}
      className="w-full min-h-[132px] text-left rounded-[14px] bg-card border border-[var(--card-border)] abh-shadow-card overflow-hidden transition-all duration-200 active:scale-[0.98] transform-gpu p-4 flex items-center gap-4"
    >
      <div
        className="relative rounded-[14px] flex items-center justify-center overflow-hidden shrink-0 w-[104px] h-[104px] bg-muted"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${accent}26 0%, ${accent}0d 55%, transparent 78%)`,
        }}
      >
        <Image
          src={HUB_ICON_SRC[hubId]}
          alt=""
          width={76}
          height={76}
          className="object-contain"
          style={{ filter: "grayscale(1) contrast(0.92) brightness(1.08)" }}
          aria-hidden="true"
        />
        {hubHasNotice && (
          <WarningCircle
            size={16}
            weight="fill"
            aria-label="Notice for some services"
            className="absolute top-2 left-2 z-20"
            style={{ color: BRAND.orange }}
          />
        )}
        {hubHasBulk && <MobileBulkRibbon fill={primary} />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-sans font-black text-[1.08rem] leading-tight text-foreground break-words">
            {hub.title}
          </h3>
          <span
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--muted)", color: accent }}
            aria-hidden="true"
          >
            <CaretRight size={13} weight="bold" />
          </span>
        </div>

        <p className="text-[0.8rem] text-muted-foreground leading-snug mb-2 line-clamp-2">
          {hub.desc}
        </p>

        <p className="text-[0.78rem] font-bold text-foreground">
          {itemCount} services <span className="opacity-40 mx-0.5">•</span>
          <span style={{ color: accent }}> {HUB_STAT_TAG[hubId]}</span>
        </p>
      </div>
    </button>
  )
}
