// components/core-hub-grid.tsx
// Landing-page "What We Can Help With" section: five hub cards stacked in
// one vertical column on every screen size. Cards alternate layout:
// text left / icon right, then icon left / text right, and so on.
// Display only — not clickable. Hub colour on hover only.

import { ScrollBounce } from "@/components/scroll-bounce"
import { HomeHubCard } from "@/components/home-hub-card"
import { HUB_ORDER } from "@/components/services-page/lib"

// ============================================================
// SECTION
// ============================================================
export function CoreHubGrid() {
  return (
    <section className="px-4 md:px-8 py-14 md:py-20" aria-labelledby="core-hubs-title">
      <div className="max-w-[1240px] mx-auto">
        <ScrollBounce>
          <div className="text-center mb-10 md:mb-12">
            <h2 id="core-hubs-title" className="abh-section-heading text-center mt-0">
              What We Can Help With
            </h2>
            <p className="abh-tagline max-w-lg mx-auto mt-3">
              Five hubs, one place to sort it all out.
            </p>
          </div>
        </ScrollBounce>

        <ul className="flex flex-col gap-4 md:gap-6">
          {HUB_ORDER.map((hubId, index) => (
            <li key={hubId}>
              <ScrollBounce delay={index * 0.06}>
                <HomeHubCard hubId={hubId} flip={index % 2 === 1} />
              </ScrollBounce>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
