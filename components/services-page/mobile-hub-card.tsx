// components/services-page/mobile-hub-card.tsx
"use client"

import { useState, type CSSProperties } from "react"
import {
  ArrowUpRight, WarningCircle,
  Printer, FileText, PaintBrush, Globe, Desktop,
} from "@phosphor-icons/react"
import { TOKEN } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"

// ============================================================
// SHARED HUB ICON MAP
// ============================================================
// Same icon set as the hero's HubIconField — shared by the desktop card,
// the hub finder, and the mobile cards so every place reads as one icon
// system.
export const HUB_ICON: Record<HubId, React.ElementType> = {
  print: Printer, doc: FileText, design: PaintBrush, eservice: Globe, tech: Desktop,
}

// ============================================================
// BULK BADGE — neutral background, bulk-ribbon text. Sits inline in the
// footer row (was absolutely positioned bottom-right, directly on top of
// the arrow icon on hubs with bulk pricing).
// ============================================================
function BulkPill() {
  return (
    <span
      className="px-3 py-1 rounded-full text-[0.68rem] font-medium whitespace-nowrap abh-shadow-badge border"
      style={{ backgroundColor: "var(--bulk-ribbon-bg)", color: "var(--bulk-ribbon-text)", borderColor: "var(--border)" }}
    >
      Bulk pricing
    </span>
  )
}

// ============================================================
// MOBILE HUB CARD — icon, title, description, arrow bottom-right.
// (The desktop variant now lives in desktop-hub-card.tsx.)
// ============================================================
export function MobileHubCard({
  hubId, hub, accent, hubHasBulk, hubHasNotice, onClick,
}: {
  hubId: HubId
  hub: (typeof HUBS)[HubId]
  accent: string
  hubHasBulk: boolean
  hubHasNotice: boolean
  onClick: () => void
}) {
  const [pressed, setPressed] = useState(false)
  const Icon = HUB_ICON[hubId]
  const release = () => setPressed(false)

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      aria-label={`Open ${hub.title}`}
      style={{ ["--hub-accent" as string]: accent } as CSSProperties}
      className="group relative w-full text-left border-y border-border/70 bg-transparent overflow-visible transition-all duration-200 active:scale-[0.98] transform-gpu flex flex-col min-h-[170px] p-5 sm:min-h-[184px] sm:p-6 hover:bg-card/35"
    >
      <div className="flex items-start justify-between mb-5">
        <Icon
          size={36}
          weight={pressed ? "fill" : "regular"}
          className="transition-colors duration-150"
          style={{ color: pressed ? accent : "var(--muted-foreground)" }}
          aria-hidden="true"
        />
        {hubHasNotice && (
          <WarningCircle
            size={18}
            weight="fill"
            aria-label="Notice for some services in this hub"
            style={{ color: TOKEN.warningBg }}
          />
        )}
      </div>

      <h3 className="font-heading font-semibold text-foreground mb-2 break-words text-[1.2rem] leading-tight">{hub.title}</h3>
      <p className="text-muted-foreground leading-7 text-[0.98rem] flex-1">{hub.desc}</p>

      <div className="flex items-center justify-between mt-3">
        {hubHasBulk ? <BulkPill /> : <span aria-hidden="true" />}
        <ArrowUpRight
          size={16}
          weight="bold"
          className="transition-colors duration-150"
          style={{ color: pressed ? accent : TOKEN.orangeText }}
          aria-hidden="true"
        />
      </div>
    </button>
  )
}
