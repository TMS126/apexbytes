// components/services-page/mobile-hub-card.tsx — full file
"use client"

import { useState } from "react"
import {
  ArrowUpRight, WarningCircle,
  Printer, FileText, PaintBrush, Globe, Desktop,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { TOKEN } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"

// Same icon set as the hero's HubIconField — used here instead of the
// old PNG thumbnails so both places read as one consistent icon system.
export const HUB_ICON: Record<HubId, React.ElementType> = {
  print: Printer, doc: FileText, design: PaintBrush, eservice: Globe, tech: Desktop,
}

// Bulk ribbon — neutral background, hub-accent text (was: solid hub-color
// fill + white text). Used on both the desktop diagonal ribbon and the
// mobile edge pill via the `accent` prop, per the "ribbon neutral, text
// hub-colored" rule.
export function BulkRibbon({ accent }: { accent: string }) {
  return (
    <div className="absolute top-4 -right-8 rotate-45 z-20 pointer-events-none">
      <span
        className="block w-28 text-center py-0.5 text-[0.62rem] font-black uppercase tracking-wider abh-shadow-badge border"
        style={{ backgroundColor: "var(--bulk-ribbon-bg)", color: "var(--bulk-ribbon-text)", borderColor: "var(--border)" }}
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
        style={{ backgroundColor: "var(--card)", color: TOKEN.warningBg }}
        aria-label="Notice for some services in this hub"
      >
        <WarningCircle size={16} weight="bold" aria-hidden="true" />
      </div>
    </div>
  )
}

// Mobile-card bulk badge — same neutral-bg/hub-accent-text treatment as
// BulkRibbon above, just shaped as an edge pill instead of a diagonal.
function BulkEdgePill({ accent }: { accent: string }) {
  return (
    <span
      className="absolute left-1/2 -bottom-2.5 -translate-x-1/2 z-20 px-3 py-0.5 rounded-full text-[0.68rem] font-medium whitespace-nowrap abh-shadow-badge border"
      style={{ backgroundColor: "var(--bulk-ribbon-bg)", color: "var(--bulk-ribbon-text)", borderColor: "var(--border)" }}
    >
      Bulk pricing
    </span>
  )
}

// ══════════════════════════════════════════════════════════════════════
// HUB CARD — one component, two variants. Mobile: icon + index number,
// title, description, arrow bottom-right (unchanged from before).
// Desktop: same minimal shell, centered text, and an "Explore" pill
// bottom-center instead of the arrow — orange by default, tinting to the
// hub's own accent color on hover only (desktop-only, since hover has no
// meaning on touch). Icons stay neutral by default in both variants;
// desktop additionally tints its icon to the hub accent on hover via the
// --hub-accent CSS var set on the card itself.
// ══════════════════════════════════════════════════════════════════════
export function MobileHubCard({
  hubId, hub, accent, primary, hubHasBulk, hubHasNotice, orderIndex, onClick, variant = "mobile",
}: {
  hubId: HubId
  hub: (typeof HUBS)[HubId]
  accent: string
  primary: string
  hubHasBulk: boolean
  hubHasNotice: boolean
  orderIndex: number
  onClick: () => void
  variant?: "mobile" | "desktop"
}) {
  const [pressed, setPressed] = useState(false)
  const Icon = HUB_ICON[hubId]
  const release = () => setPressed(false)
  const isDesktop = variant === "desktop"

  return (
    <button
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      aria-label={`Open ${hub.title}`}
      style={{ ["--hub-accent" as unknown as keyof import("react").CSSProperties]: accent }}
      className={cn(
        "group relative w-full text-left rounded-[14px] bg-card border border-[var(--card-border)] overflow-visible transition-all duration-200 active:scale-[0.98] transform-gpu flex flex-col",
        isDesktop ? "min-h-[220px] p-5 items-center text-center h-full" : "min-h-[152px] p-4"
      )}
    >
      <div className={cn("flex items-start justify-between mb-3", isDesktop && "w-full")}>
        <Icon
          size={isDesktop ? 32 : 30}
          weight={!isDesktop && pressed ? "fill" : "regular"}
          className={cn(
            "transition-colors duration-150",
            isDesktop && "text-muted-foreground group-hover:text-[var(--hub-accent)]"
          )}
          style={!isDesktop ? { color: pressed ? accent : "var(--muted-foreground)" } : undefined}
          aria-hidden="true"
        />
        {hubHasNotice && (
          <WarningCircle
            size={isDesktop ? 22 : 18}
            weight="fill"
            aria-label="Notice for some services in this hub"
            style={{ color: TOKEN.warningBg }}
          />
        )}
      </div>

      <h3
        className={cn(
          "font-sans font-black text-foreground mb-1.5 break-words",
          isDesktop ? "text-[1.15rem]" : "text-[1.05rem]"
        )}
      >
        {hub.title}
      </h3>

      <p
        className={cn(
          "text-muted-foreground leading-snug",
          isDesktop ? "text-[0.85rem] flex-1" : "text-[0.82rem] flex-1"
        )}
      >
        {hub.desc}
      </p>

      {isDesktop ? (
        <div className="flex justify-center mt-4 w-full">
          <span
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-[14px] border text-[0.8rem] font-black transition-colors duration-200 group-hover:border-[var(--hub-accent)] group-hover:text-[var(--hub-accent)]"
            style={{ borderColor: TOKEN.orangeText, color: TOKEN.orangeText }}
          >
            Explore
          </span>
        </div>
      ) : (
        <div className="flex justify-end mt-3">
          <ArrowUpRight
            size={16}
            weight="bold"
            className="transition-colors duration-150"
            style={{ color: pressed ? accent : TOKEN.orangeText }}
            aria-hidden="true"
          />
        </div>
      )}

      {hubHasBulk && (isDesktop ? <BulkRibbon accent={accent} /> : <BulkEdgePill accent={accent} />)}
    </button>
  )
} 
