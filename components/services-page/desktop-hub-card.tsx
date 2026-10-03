// components/services-page/desktop-hub-card.tsx
"use client"

import { ArrowUpRight, WarningCircle } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { HUB_COLORS, HUB_ON_COLOR, TOKEN } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"
import { HUB_ICON } from "./mobile-hub-card"

// ============================================================
// TYPES
// ============================================================
interface DesktopHubCardProps {
  hubId: HubId
  hub: (typeof HUBS)[HubId]
  hubHasBulk: boolean
  hubHasNotice: boolean
  onClick: () => void
}

// ============================================================
// DESKTOP HUB CARD
// ============================================================
// Neutral card at rest. On hover / keyboard focus the card fills with the
// hub's own colour and text flips to that hub's verified --on-hub-* pair
// (light + dark themes both covered in globals.css). The hub icon is
// oversized and bleeds off the RIGHT edge of the card (overflow-hidden
// crops it), matching the reference. Text sits bottom-left, capped so it
// never runs under the icon.
export function DesktopHubCard({ hubId, hub, hubHasBulk, hubHasNotice, onClick }: DesktopHubCardProps) {
  const Icon = HUB_ICON[hubId]

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open ${hub.title}`}
      style={{
        ["--hub-fill" as string]: HUB_COLORS[hubId].primary,
        ["--hub-on" as string]: HUB_ON_COLOR[hubId],
      }}
      className={cn(
        "group relative flex h-full min-h-[240px] w-full flex-col justify-end overflow-hidden rounded-[14px] p-6 text-left",
        "bg-card text-foreground transition-[background-color,color,box-shadow] duration-200 motion-reduce:transition-none",
        "hover:bg-[var(--hub-fill)] hover:text-[var(--hub-on)] hover:shadow-[var(--shadow-card-lift)]",
        "focus-visible:bg-[var(--hub-fill)] focus-visible:text-[var(--hub-on)] focus-visible:shadow-[var(--shadow-card-lift)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hub-fill)]"
      )}
    >
      {/* ── Icon, cropped by the right edge ─────────────────── */}
      <Icon
        size={180}
        weight="fill"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-10 top-1/2 -translate-y-[58%] transform-gpu",
          "text-muted-foreground/20 transition-[color,transform] duration-300 motion-reduce:transition-none",
          "group-hover:-translate-x-1 group-hover:text-[color-mix(in_srgb,var(--hub-on)_28%,transparent)]",
          "group-focus-visible:-translate-x-1 group-focus-visible:text-[color-mix(in_srgb,var(--hub-on)_28%,transparent)]"
        )}
      />

      {/* ── Status badges (top-left, away from the icon) ────── */}
      {(hubHasNotice || hubHasBulk) && (
        <div className="absolute left-5 top-5 z-10 flex items-center gap-2">
          {hubHasNotice && (
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--card)", color: TOKEN.warningBg }}
              role="img"
              aria-label="Notice for some services in this hub"
            >
              <WarningCircle size={16} weight="fill" aria-hidden="true" />
            </span>
          )}
          {hubHasBulk && (
            <span
              className="rounded-full border px-3 py-1 text-[0.68rem] font-medium whitespace-nowrap"
              style={{ backgroundColor: "var(--bulk-ribbon-bg)", color: "var(--bulk-ribbon-text)", borderColor: "var(--border)" }}
            >
              Bulk pricing
            </span>
          )}
        </div>
      )}

      {/* ── Copy ─────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[62%]">
        <h3 className="mb-1.5 break-words font-sans text-[1.3rem] font-black leading-tight">{hub.title}</h3>
        <p className="mb-4 text-[0.85rem] leading-snug text-muted-foreground transition-colors duration-200 group-hover:text-[var(--hub-on)] group-focus-visible:text-[var(--hub-on)] motion-reduce:transition-none">
          {hub.desc}
        </p>
        <span className="inline-flex items-center gap-1 text-[0.82rem] font-black">
          Explore
          <ArrowUpRight
            size={14}
            weight="bold"
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
          />
        </span>
      </div>
    </button>
  )
}
