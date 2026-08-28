// components/services-page/mobile-hub-card.tsx — full file, paste over the current one
"use client"

import Image from "next/image"
import { WarningCircle } from "@phosphor-icons/react"
import { TOKEN } from "@/lib/brand"
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

// Bulk ribbon — neutral surface, hub color lives only in the text now.
// Used by the desktop 5-card landing grid.
export function BulkRibbon({ accent }: { accent: string }) {
  return (
    <div className="absolute top-4 -right-8 rotate-45 z-20 pointer-events-none">
      <span
        className="abh-shadow-badge block w-28 text-center py-0.5 text-[0.62rem] font-black uppercase tracking-wider"
        style={{ backgroundColor: "var(--muted)", color: accent }}
      >
        Bulk
      </span>
    </div>
  )
}

// Mobile ribbon — moved to the right END of the card (not the icon
// corner anymore), as a straight neutral tag rather than a diagonal
// corner ribbon, since it now sits against the card's own edge.
export function MobileBulkRibbon({ accent }: { accent: string }) {
  return (
    <span
      className="abh-shadow-badge absolute top-1/2 right-3 -translate-y-1/2 z-20 pointer-events-none px-2.5 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-wider whitespace-nowrap"
      style={{ backgroundColor: "var(--muted)", color: accent }}
    >
      Bulk
    </span>
  )
}

export function NoticeBadge() {
  return (
    <div className="absolute top-3 right-3 z-20 pointer-events-none">
      <div
        className="abh-shadow-badge w-7 h-7 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "var(--card)", color: TOKEN.warningBg }}
        aria-label="Notice for some services in this hub"
      >
        <WarningCircle size={16} weight="bold" aria-hidden="true" />
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// MOBILE HUB CARD
// - Removed the life-like elevated shadow — card now stands on its
//   border alone; abh-shadow-badge is reserved for the chip-scale
//   elements (ribbon, notice badge) only.
// - Removed the trailing ">" chevron button entirely.
// - Bulk ribbon moved out of the icon box to the card's own right edge.
// - Stat tag text is neutral now — mobile has no hover state to reveal
//   hub color on, so it stays plain rather than being permanently tinted.
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
      className="relative w-full min-h-[132px] text-left rounded-[14px] bg-card border border-[var(--card-border)] overflow-hidden transition-all duration-200 active:scale-[0.98] transform-gpu p-4 flex items-center gap-4"
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
            weight="bold"
            aria-label="Notice for some services"
            className="absolute top-2 left-2 z-20"
            style={{ color: TOKEN.orangeText }}
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1.5">
          <h3 className="font-sans font-black text-[1.08rem] leading-tight text-foreground break-words pr-6">
            {hub.title}
          </h3>
        </div>

        <p className="text-[0.8rem] text-muted-foreground leading-snug mb-2 line-clamp-2">
          {hub.desc}
        </p>

        <p className="text-[0.78rem] font-bold text-foreground">
          {itemCount} services <span className="opacity-40 mx-0.5">•</span>
          <span className="text-muted-foreground"> {HUB_STAT_TAG[hubId]}</span>
        </p>
      </div>

      {hubHasBulk && <MobileBulkRibbon accent={accent} />}
    </button>
  )
} 
