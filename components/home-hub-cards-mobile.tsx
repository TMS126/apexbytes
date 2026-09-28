// components/home-hub-cards-mobile.tsx
"use client"

import Link from "next/link"
import { ArrowUpRight } from "@phosphor-icons/react"
import { HUB_COLORS, HUB_ON_COLOR, HUB_NAMES } from "@/lib/brand"
import { HubId } from "@/lib/data"
import { HUB_ICON } from "@/components/services-page/mobile-hub-card"
import { HUB_ORDER } from "@/components/services-page/lib"
import { ScrollBounce } from "@/components/scroll-bounce"

// ============================================================
// COPY — one-line ad per hub. No prices on purpose.
// ============================================================
const TAGLINE: Record<HubId, string> = {
  print: "Print, copy & photos — ready while you wait.",
  doc: "CVs, typing & laminating, sorted same day.",
  design: "Logos, flyers & invites that get noticed.",
  eservice: "SASSA, SARS & NSFAS — done for you.",
  tech: "PC setup, virus removal & Windows installs.",
}

// ============================================================
// MOBILE HOME HUB CARDS
// Full-width cards: hub colour fill, name + one-line pitch on the left,
// oversized hub icon bleeding off the right edge (overflow-hidden crops it).
// Text uses each hub's verified --on-hub-* pair (light + dark themes).
// ============================================================
export function HomeHubCardsMobile() {
  return (
    <ul className="flex flex-col gap-4 md:hidden">
      {HUB_ORDER.map((hubId, index) => {
        const Icon = HUB_ICON[hubId]
        const fill = HUB_COLORS[hubId].primary
        const on = HUB_ON_COLOR[hubId]

        return (
          <li key={hubId}>
            <ScrollBounce delay={index * 0.06}>
              <Link
                href={`/services/${hubId}`}
                aria-label={`${HUB_NAMES[hubId]} — ${TAGLINE[hubId]}`}
                className="group relative flex min-h-[124px] w-full flex-col justify-center overflow-hidden rounded-[14px] py-5 pl-5 pr-[38%] transition-transform duration-150 active:scale-[0.98] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  background: `linear-gradient(135deg, ${fill} 0%, color-mix(in srgb, ${fill} 84%, black) 100%)`,
                  color: on,
                  outlineColor: fill,
                }}
              >
                <Icon
                  size={150}
                  weight="fill"
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 top-1/2 -translate-y-1/2"
                  style={{ color: `color-mix(in srgb, ${on} 30%, transparent)` }}
                />

                <h3 className="relative z-10 font-sans text-[1.35rem] font-black leading-tight">{HUB_NAMES[hubId]}</h3>
                <p className="relative z-10 mt-1 text-[0.82rem] font-medium leading-snug">{TAGLINE[hubId]}</p>
                <span className="relative z-10 mt-3 inline-flex items-center gap-1 text-[0.8rem] font-black">
                  Explore
                  <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                </span>
              </Link>
            </ScrollBounce>
          </li>
        )
      })}
    </ul>
  )
}
