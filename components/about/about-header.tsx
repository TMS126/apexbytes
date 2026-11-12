// components/about/about-header.tsx
"use client"

import { ScrollBounce } from "@/components/scroll-bounce"
import { BIZ } from "@/lib/brand"

export function AboutHeader() {
  return (
    <>
      <section className="abh-editorial-hero">
        <div className="max-w-[1248px] mx-auto flex flex-col items-center">
          <ScrollBounce>
            <h1 className="abh-page-title mb-3">About Us</h1>
          </ScrollBounce>

          <p className="abh-tagline max-w-xl mx-auto">
            A local business built on community, trust, and real help — right here in Kgotsong.
          </p>

          <div className="abh-divider" />
        </div>
      </section>

      <ScrollBounce delay={0.1}>
        <section className="mx-auto mt-10 w-full max-w-[560px] px-4" aria-label="About statistics">
          <div className="grid grid-cols-3 divide-x divide-zinc-200 overflow-hidden rounded-[14px] shadow-lg dark:divide-zinc-700">
            {[
              { value: BIZ.hubCount, label: "Service Hubs" },
              { value: BIZ.serviceCount, label: "Services" },
              { value: "Since 2023", label: "Est. Kgotsong" },
            ].map((stat) => (
              <div key={stat.label} className="flex cursor-default flex-col items-center justify-center px-3 py-5">
                <p className="abh-stat-value text-foreground">{stat.value}</p>
                <p className="abh-eyebrow mt-1.5 text-center text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollBounce>
    </>
  )
}
