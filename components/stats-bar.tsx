// components/stats-bar.tsx
"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { PlusCircle, Gear, Wrench, CalendarCheck } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { BIZ, pickHex } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"
import { getReadableTextColor } from "@/lib/color-utils"

export function StatsBar() {
  const { resolvedTheme } = useTheme()
  const [mounted] = useState(() => typeof window !== "undefined")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
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
        <p className="text-center text-[0.78rem] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-2">By the Numbers</p>
        <h2 className="text-center font-sans font-black text-2xl md:text-3xl text-foreground mb-8">What We Bring to the Table</h2>
      </ScrollBounce>
      <div className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-[900px] mx-auto border-y border-border" role="list" aria-label="Key stats">
        {stats.map((stat, i) => {
          const isHov = hoveredCard === i
          const Icon = stat.icon
          const textOnColor = getReadableTextColor(stat.color)
          return (
            <ScrollBounce key={stat.label} delay={i * 0.08} className="h-full">
              <div
                role="listitem"
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setHoveredCard(isHov ? null : i)}
                aria-label={`${stat.value} ${stat.label}`}
                className={cn(
                  "flex min-h-[150px] flex-col items-center justify-center gap-2 px-3 py-6 text-center transition-colors duration-300",
                  i % 2 !== 0 && "border-l border-border",
                  i >= 2 && "border-t border-border sm:border-t-0",
                  i > 0 && "sm:border-l sm:border-border"
                )}
                style={{ color: isHov ? textOnColor : undefined, backgroundColor: isHov ? stat.color : "transparent" }}
              >
                <Icon size={24} weight="regular" aria-hidden="true" className="mb-0.5 transition-colors duration-300" />
                <div className="text-2xl font-black transition-colors duration-300">{stat.value}</div>
                <div className="text-[0.72rem] font-black uppercase tracking-widest transition-colors duration-300">{stat.label}</div>
              </div>
            </ScrollBounce>
          )
        })}
      </div>
    </section>
  )
}
