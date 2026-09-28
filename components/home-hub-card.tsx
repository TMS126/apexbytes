// components/home-hub-card.tsx
"use client"

import Link from "next/link"
import { ArrowUpRight } from "@phosphor-icons/react"
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
// STATE CLASSES
// ============================================================
// Neutral at rest. The hub colour appears only on hover (mouse), press
// (touch — there is no hover on phones) and keyboard focus. Tailwind wraps
// hover: in (hover: hover), so touch devices never get a stuck hover state.
const CARD_ACCENT =
  "hover:bg-[var(--hub-fill)] hover:text-[var(--hub-on)] hover:shadow-[var(--shadow-card-lift)] " +
  "active:bg-[var(--hub-fill)] active:text-[var(--hub-on)] " +
  "focus-visible:bg-[var(--hub-fill)] focus-visible:text-[var(--hub-on)]"

const TEXT_FLIP =
  "group-hover:text-[var(--hub-on)] group-active:text-[var(--hub-on)] group-focus-visible:text-[var(--hub-on)]"

const ICON_ACCENT =
  "group-hover:-translate-x-1 group-hover:text-[color-mix(in_srgb,var(--hub-on)_28%,transparent)] " +
  "group-active:text-[color-mix(in_srgb,var(--hub-on)_28%,transparent)] " +
  "group-focus-visible:text-[color-mix(in_srgb,var(--hub-on)_28%,transparent)]"

// ============================================================
// HOME HUB CARD — one card, every screen size.
// Text on the left, oversized hub icon bleeding off the right edge
// (overflow-hidden crops it). Text column is capped so it never runs
// under the icon.
// ============================================================
export function HomeHubCard({ hubId }: { hubId: HubId }) {
  const hub = HUBS[hubId]
  const Icon = HUB_ICON[hubId]
  const serviceCount = hub.sections.reduce((total, section) => total + section.items.length, 0)

  return (
    <Link
      href={`/services/${hubId}`}
      style={{
        ["--hub-fill" as string]: HUB_COLORS[hubId].primary,
        ["--hub-on" as string]: HUB_ON_COLOR[hubId],
      }}
      className={cn(
        "group relative flex w-full flex-col justify-center overflow-hidden rounded-[14px] bg-card text-foreground",
        "min-h-[140px] py-6 pl-6 pr-[40%] md:min-h-[200px] md:pl-10 md:pr-[45%]",
        "transition-[background-color,color,box-shadow,transform] duration-200 active:scale-[0.98] motion-reduce:transition-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hub-fill)]",
        CARD_ACCENT
      )}
    >
      {/* ── Icon, cropped by the right edge ─────────────────── */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2 transform-gpu leading-none md:-right-12",
          "text-[150px] md:text-[240px] text-muted-foreground/20",
          "transition-[color,transform] duration-300 motion-reduce:transition-none",
          ICON_ACCENT
        )}
      >
        <Icon size="1em" weight="fill" />
      </span>

      {/* ── Copy ─────────────────────────────────────────────── */}
      <div className="relative z-10">
        <p className="mb-1 flex items-baseline gap-1.5">
          <span className="font-sans text-[1.9rem] font-black leading-none md:text-[2.4rem]">{serviceCount}</span>
          <span className={cn("text-[0.78rem] font-bold text-muted-foreground md:text-[0.85rem]", TEXT_FLIP)}>
            services
          </span>
        </p>
        <h3 className="break-words font-sans text-[1.3rem] font-black leading-tight md:text-[1.6rem]">{hub.title}</h3>
        <p className={cn("mt-1 text-[0.82rem] leading-snug text-muted-foreground md:text-[0.95rem]", TEXT_FLIP)}>
          {BLURB[hubId]}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-[0.8rem] font-black md:text-[0.88rem]">
          Explore
          <ArrowUpRight
            size={14}
            weight="bold"
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
          />
        </span>
      </div>
    </Link>
  )
}
