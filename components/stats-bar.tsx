// components/stats-bar.tsx
"use client"

import { useMounted } from "@/hooks/use-mounted"
import { useTheme } from "next-themes"
import { PlusCircle, Gear, Wrench, CalendarCheck } from "@phosphor-icons/react"
import { BIZ, pickHex } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"

export function StatsBar() {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()
  const isDark = mounted && resolvedTheme === "dark"

  const stats = [
    { icon: PlusCircle, color: pickHex("blue", isDark), value: BIZ.hubCount, label: "Service Hubs" },
    { icon: Gear, color: pickHex("green", isDark), value: BIZ.serviceCount, label: "Services" },
    { icon: Wrench, color: pickHex("orange", isDark), value: "Fast", label: "Turnaround" },
    { icon: CalendarCheck, color: pickHex("blueMid", isDark), value: `${new Date().getFullYear() - parseInt(BIZ.yearFounded)}+ yrs`, label: "Experience" },
  ]

  return (
    <section aria-label="Key stats" className="px-4 md:px-8 py-10 md:py-14 transition-colors duration-300">
      <ScrollBounce>
        <p className="abh-eyebrow mb-2 justify-center">By the Numbers</p>
        <h2 className="text-center font-sans font-medium text-2xl md:text-3xl text-foreground mb-8">What We Bring to the Table</h2>
      </ScrollBounce>
      <div className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-[900px] mx-auto" role="list" aria-label="Key stats">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <ScrollBounce key={stat.label} delay={i * 0.08} className="h-full">
              {/* data-hover-border = the ONLY element on the site allowed to show a border (hover only). */}
              <div
                role="listitem"
                aria-label={`${stat.value} ${stat.label}`}
                style={{ ["--stat-color" as string]: stat.color }}
                data-hover-border=""
                className="group relative flex min-h-[150px] flex-col items-center justify-center gap-2 border border-transparent px-3 py-6 text-center transition-colors duration-250 ease-out hover:border-[var(--stat-color)]"
              >
                <Icon size={24} weight="regular" aria-hidden="true" className="mb-0.5 text-muted-foreground transition-colors duration-250 ease-out group-hover:text-[var(--stat-color)]" />
                <div className="text-2xl font-medium text-foreground">{stat.value}</div>
                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground sm:text-sm">{stat.label}</div>
                <span className="absolute bottom-2 left-1/2 h-0.5 w-10 -translate-x-1/2 origin-left scale-x-0 rounded-full bg-[var(--stat-color)] opacity-0 transition-[transform,opacity,width] duration-250 ease-out group-hover:w-16 group-hover:scale-x-100 group-hover:opacity-100" aria-hidden="true" />
              </div>
            </ScrollBounce>
          )
        })}
      </div>
    </section>
  )
    }
