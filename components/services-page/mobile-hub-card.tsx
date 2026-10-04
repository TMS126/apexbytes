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
      className="group relative w-full text-left rounded-[14px] bg-card overflow-visible transition-all duration-200 active:scale-[0.98] transform-gpu flex flex-col hover:shadow-[var(--shadow-card-lift)] min-h-[152px] p-4 sm:min-h-[164px] sm:p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <Icon
          size={30}
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

      <h3 className="font-sans font-black text-foreground mb-1.5 break-words text-[1.05rem]">{hub.title}</h3>
      <p className="text-muted-foreground leading-snug text-[0.82rem] flex-1">{hub.desc}</p>

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
