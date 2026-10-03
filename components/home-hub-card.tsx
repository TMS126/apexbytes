// components/home-hub-card.tsx
"use client"

import { cn } from "@/lib/utils"
import { HUB_COLORS, HUB_ON_COLOR } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"
import { HUB_ICON } from "@/components/services-page/mobile-hub-card"

// ============================================================
// COPY — one-line pitch per hub. No prices on the home page.
// ============================================================
const BLURB: Record<HubId, string> = {
  print: "Fast printing, copying and photo prints — ready while you wait.",
  doc: "CVs, typing, scanning and laminating — sorted the same day.",
  design: "Logos, business cards, flyers and social media — custom-made.",
  eservice: "SASSA, SARS, NSFAS and other official applications — done for you.",
  tech: "PC setup, virus removal and Windows installs — sorted properly.",
}

// ============================================================
// HOVER CLASSES — colour only. No movement, no shadow, no scale.
// ============================================================
const CARD_HOVER = "hover:bg-[var(--hub-fill)] hover:text-[var(--hub-on)]"

const TEXT_HOVER = "group-hover:text-[var(--hub-on)]"

const ICON_HOVER =
  "group-hover:text-[color-mix(in_srgb,var(--hub-on)_28%,transparent)]"

// ============================================================
// HOME HUB CARD — display only, not clickable.
// flip = false → text left, icon right
// flip = true  → icon left, text right
// ============================================================
export function HomeHubCard({ hubId, flip = false }: { hubId: HubId; flip?: boolean }) {
  const hub = HUBS[hubId]
  const Icon = HUB_ICON[hubId]
  const serviceCount = hub.sections.reduce((total, section) => total + section.items.length, 0)

  return (
    <div
      style={{
        ["--hub-fill" as string]: HUB_COLORS[hubId].primary,
        ["--hub-on" as string]: HUB_ON_COLOR[hubId],
      }}
      className={cn(
        "group relative flex w-full flex-col justify-center overflow-hidden rounded-[14px] bg-card text-foreground",
        "min-h-[140px] py-6 md:min-h-[200px]",
        flip ? "pl-[40%] pr-6 md:pl-[45%] md:pr-10" : "pl-6 pr-[40%] md:pl-10 md:pr-[45%]",
        "transition-[background-color,color] duration-200 motion-reduce:transition-none",
        CARD_HOVER
      )}
    >
      {/* ── Icon, cropped by the card edge ──────────────────── */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 leading-none",
          flip ? "-left-8 md:-left-12" : "-right-8 md:-right-12",
          "text-[150px] md:text-[240px] text-muted-foreground/20",
          "transition-colors duration-300 motion-reduce:transition-none",
          ICON_HOVER
        )}
      >
        <Icon size="1em" weight="fill" />
      </span>

      {/* ── Copy ─────────────────────────────────────────────── */}
      <div className="relative z-10">
        <p className="mb-1 flex items-baseline gap-1.5">
          <span className="font-sans text-[1.9rem] font-black leading-none md:text-[2.4rem]">{serviceCount}</span>
          <span className={cn("text-[0.78rem] font-bold text-muted-foreground md:text-[0.85rem]", TEXT_HOVER)}>
            services
          </span>
        </p>
        <h3 className="break-words font-sans text-[1.3rem] font-black leading-tight md:text-[1.6rem]">{hub.title}</h3>
        <p className={cn("mt-1 text-[0.82rem] leading-snug text-muted-foreground md:text-[0.95rem]", TEXT_HOVER)}>
          {BLURB[hubId]}
        </p>
      </div>
    </div>
  )
}
