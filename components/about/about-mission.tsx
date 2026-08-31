// components/about/about-mission.tsx
"use client"

import { ArrowRight, EnvelopeSimple } from "@phosphor-icons/react"
import { BRAND } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"

// Card minimization: DROPPED. This was a singleton CTA banner in an
// abh-card — nothing else on the page looks like it. Plain spacing + a
// soft background tint now, no border/shadow shell.
export function AboutMission({
  blueOnPage,
  missionBadgeBg,
  missionBadgeText,
}: {
  blueOnPage: string
  missionBadgeBg: string
  missionBadgeText: string
}) {
  return (
    <section
      className="px-4 md:px-8 py-16 md:py-20 text-center relative overflow-hidden transition-colors duration-300"
      aria-labelledby="mission-title"
      style={{ backgroundColor: `${BRAND.blue}0a` }}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue rounded-full blur-[100px] opacity-10 -mr-32 -mt-32" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-blue rounded-full blur-[100px] opacity-[0.06] -ml-28 -mb-28" aria-hidden="true" />

      <ScrollBounce className="max-w-[750px] mx-auto relative z-10">
        <span className="abh-eyebrow px-4 py-1.5 rounded-full mb-6 inline-block" style={{ backgroundColor: missionBadgeBg, color: missionBadgeText }}>
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
          <a href="/services" className="abh-btn-cta w-full sm:w-64 justify-center px-8 py-4">
            See All Services
            <ArrowRight size={16} weight="bold" />
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-64 px-8 py-4 rounded-[14px] font-medium text-base border-2 transition-all duration-300 active:scale-95 hover:-translate-y-0.5"
            style={{ borderColor: blueOnPage, color: blueOnPage }}
          >
            <EnvelopeSimple size={16} weight="bold" />
            Get in Touch
          </a>
        </div>
      </ScrollBounce>
    </section>
  )
} 
