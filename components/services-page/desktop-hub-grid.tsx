// components/services-page/desktop-hub-grid.tsx
"use client"

import { HUBS, HubId } from "@/lib/data"
import { ScrollBounce } from "@/components/scroll-bounce"
import { sectionHasBulk } from "../quote-calculator/lib"
import { HUB_ORDER } from "./lib"
import { DesktopHubCard } from "./desktop-hub-card"
import { HubFinderCard } from "./hub-finder-card"

// ============================================================
// DESKTOP LEVEL 0 — 3 × 2 GRID
// Five hub cards + the hub-finder card as the sixth, so both rows are full.
// ============================================================
export function DesktopHubGrid({ onSelectHub }: { onSelectHub: (hubId: HubId) => void }) {
  return (
    <div className="hidden md:grid md:grid-cols-3 gap-6 pb-2 w-full">
      {HUB_ORDER.map((hubId, index) => {
        const hub = HUBS[hubId]
        const hubHasBulk = hub.sections.some((s) => sectionHasBulk(hubId, s.title, s.items))
        const hubHasNotice = hub.sections.some((s) => s.items.some((i) => !!i.notice))

        return (
          <ScrollBounce key={hubId} delay={index * 0.06} className="h-full">
            <DesktopHubCard
              hubId={hubId}
              hub={hub}
              hubHasBulk={hubHasBulk}
              hubHasNotice={hubHasNotice}
              onClick={() => onSelectHub(hubId)}
            />
          </ScrollBounce>
        )
      })}

      <ScrollBounce delay={HUB_ORDER.length * 0.06} className="h-full">
        <HubFinderCard onSelectHub={onSelectHub} />
      </ScrollBounce>
    </div>
  )
}
