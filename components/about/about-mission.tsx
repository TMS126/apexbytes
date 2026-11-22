// components/about/about-mission.tsx
"use client"

import Link from "next/link"
import { BRAND } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"

// Card minimization: DROPPED. This was a singleton CTA banner in an
// abh-card — nothing else on the page looks like it. Plain spacing + a
// soft background tint now, no border/shadow shell.
export function AboutMission() {
  return (
    <section
      className="px-4 md:px-8 py-16 md:py-20 text-center relative overflow-hidden transition-colors duration-300"
      aria-labelledby="mission-title"
      style={{ backgroundColor: `color-mix(in srgb, ${BRAND.blue} 4%, transparent)` }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue rounded-full blur-[100px] opacity-10 -mr-32 -mt-32" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-blue rounded-full blur-[100px] opacity-[0.06] -ml-28 -mb-28" aria-hidden="true" />

      <ScrollBounce className="max-w-[750px] mx-auto relative z-10">
        <span className="abh-eyebrow mb-6">
          Our Mission
        </span>

        <h2 id="mission-title" className="abh-section-heading text-3xl mb-4">
          Bridging the digital gap — one person at a time.
        </h2>
        <p className="abh-body text-xl max-w-[500px] mx-auto mb-10">
          ApexbytesHub is that bridge — printing, design, IT support, and government services brought to people
          who need them most, in a community that deserves better access.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/services" className="abh-site-cta group/mission-cta relative inline-flex h-12 w-full items-center justify-center rounded-full px-7 text-base font-medium focus-visible:outline-none sm:w-[184px]">
            See All Services
            <span aria-hidden="true" className="absolute inset-x-7 bottom-1 h-0.5 origin-left scale-x-0 bg-current transition-transform duration-250 ease-out group-hover/mission-cta:scale-x-100 group-focus-visible/mission-cta:scale-x-100" />
          </Link>
          <Link href="/contact" className="abh-site-cta group/mission-cta relative inline-flex h-12 w-full items-center justify-center rounded-full px-7 text-base font-medium focus-visible:outline-none sm:w-[184px]">
            Get in Touch
            <span aria-hidden="true" className="absolute inset-x-7 bottom-1 h-0.5 origin-left scale-x-0 bg-current transition-transform duration-250 ease-out group-hover/mission-cta:scale-x-100 group-focus-visible/mission-cta:scale-x-100" />
          </Link>
        </div>
      </ScrollBounce>
    </section>
  )
} 
