// components/stats-bar.tsx
"use client"

import { PlusCircle, Gear, Wrench, CalendarCheck } from "@phosphor-icons/react"
import { BIZ } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"

export function StatsBar() {
  const stats = [
    { icon: PlusCircle, value: BIZ.hubCount, label: "Service hubs" },
    { icon: Gear, value: BIZ.serviceCount, label: "Services" },
    { icon: Wrench, value: "Fast", label: "Turnaround" },
    { icon: CalendarCheck, value: `${new Date().getFullYear() - Number(BIZ.yearFounded)}+ yrs`, label: "Experience" },
  ]

  return (
    <section aria-label="Key stats" className="px-4 md:px-8 py-12 md:py-16 transition-colors duration-300">
      <ScrollBounce>
        <p className="abh-eyebrow text-center mb-2">By the numbers</p>
        <h2 className="abh-section-heading text-center mb-8">What We Bring to the Table</h2>
      </ScrollBounce>

      <ScrollBounce delay={0.08}>
        <div className="w-full max-w-[880px] mx-auto border-y border-[var(--border)] grid grid-cols-2 sm:grid-cols-4" role="list" aria-label="Key stats">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                role="listitem"
                className={[
                  "flex flex-col items-center justify-center gap-2 px-4 py-6 text-center",
                  index > 1 ? "border-t border-[var(--border)] sm:border-t-0" : "",
                  index > 0 ? "sm:border-l sm:border-[var(--border)]" : "",
                ].join(" ")}
              >
                <Icon size={22} weight="regular" className="text-muted-foreground" aria-hidden="true" />
                <span className="font-heading font-bold text-2xl text-foreground tracking-[-0.03em]">{stat.value}</span>
                <span className="font-sans font-bold text-[0.72rem] uppercase tracking-[0.13em] text-muted-foreground">{stat.label}</span>
              </div>
            )
          })}
        </div>
      </ScrollBounce>
    </section>
  )
}
