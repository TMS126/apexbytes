// components/services-page/hub-finder-card.tsx
"use client"

import { useState } from "react"
import { Compass, ArrowRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { HUB_COLORS, HUB_ON_COLOR, BIZ } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"
import { HUB_ICON } from "./mobile-hub-card"

// ============================================================
// DATA — plain-language needs mapped to the hub that handles them
// ============================================================
const NEEDS: { label: string; hubId: HubId }[] = [
  { label: "Print or copy", hubId: "print" },
  { label: "CV or typing", hubId: "doc" },
  { label: "Logo or flyer", hubId: "design" },
  { label: "SASSA / SARS / NSFAS", hubId: "eservice" },
  { label: "Fix my PC", hubId: "tech" },
]

interface HubFinderCardProps {
  onSelectHub: (hubId: HubId) => void
}

// ============================================================
// HUB FINDER — 6th card. "What do you need?" → recommended hub,
// its three headline services, and a one-tap open button.
// ============================================================
export function HubFinderCard({ onSelectHub }: HubFinderCardProps) {
  const [picked, setPicked] = useState<HubId | null>(null)
  const hub = picked ? HUBS[picked] : null
  const Icon = picked ? HUB_ICON[picked] : Compass

  return (
    <div className="relative flex h-full min-h-[240px] w-full flex-col overflow-hidden rounded-[14px] bg-card p-6 text-foreground">
      <div className="mb-1 flex items-center gap-2">
        <Compass size={22} weight="bold" aria-hidden="true" className="text-muted-foreground" />
        <h3 className="font-sans text-[1.15rem] font-black leading-tight">Not sure where to start?</h3>
      </div>
      <p className="mb-3 text-[0.82rem] leading-snug text-muted-foreground">
        Tell us what you need and we&apos;ll point you to the right hub.
      </p>

      <div role="group" aria-label="What do you need?" className="mb-3 flex flex-wrap gap-2">
        {NEEDS.map((need) => {
          const isOn = picked === need.hubId
          return (
            <button
              key={need.hubId}
              type="button"
              aria-pressed={isOn}
              onClick={() => setPicked(isOn ? null : need.hubId)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[0.78rem] font-bold transition-colors duration-150 active:scale-95 motion-reduce:transition-none",
                !isOn && "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              style={
                isOn
                  ? { backgroundColor: HUB_COLORS[need.hubId].primary, borderColor: HUB_COLORS[need.hubId].primary, color: HUB_ON_COLOR[need.hubId] }
                  : undefined
              }
            >
              {need.label}
            </button>
          )
        })}
      </div>

      {/* ── Result (announced to screen readers when it changes) ── */}
      <div aria-live="polite" className="mt-auto">
        {picked && hub ? (
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-[0.95rem] font-black" style={{ color: HUB_COLORS[picked].primary }}>
                <Icon size={18} weight="fill" aria-hidden="true" />
                {hub.title}
              </p>
              <p className="mt-0.5 text-[0.78rem] leading-snug text-muted-foreground">{hub.previews.join(" · ")}</p>
            </div>
            <button
              type="button"
              onClick={() => onSelectHub(picked)}
              className="inline-flex shrink-0 items-center gap-1 rounded-[10px] px-3.5 py-2 text-[0.8rem] font-black transition-transform duration-150 active:scale-95"
              style={{ backgroundColor: HUB_COLORS[picked].primary, color: HUB_ON_COLOR[picked] }}
            >
              Open
              <ArrowRight size={13} weight="bold" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <p className="text-[0.76rem] text-muted-foreground">Walk-ins welcome · {BIZ.location}</p>
        )}
      </div>
    </div>
  )
}
