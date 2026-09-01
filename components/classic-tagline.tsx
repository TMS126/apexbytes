"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { HEX } from "@/lib/brand"
import { ensureAccessible } from "@/lib/color"

const WORDS = [
  { text: "Design.",  key: "orange" as const },
  { text: "Print.",   key: "blue"   as const },
  { text: "Upgrade.", key: "green"  as const },
]

export function ClassicTagline() {
  const { resolvedTheme } = useTheme()
  const [mounted] = useState(() => typeof window !== "undefined")
  const [hovered, setHovered] = useState(false)

  const isDark  = mounted && resolvedTheme === "dark"
  const pageBg = isDark ? HEX.dark.page : HEX.light.page
  const palette = {
    orange: ensureAccessible(isDark ? HEX.dark.lightOrange : HEX.light.orange, pageBg, 4.5),
    blue: ensureAccessible(isDark ? HEX.dark.lightBlue : HEX.light.blue, pageBg, 4.5),
    green: ensureAccessible(isDark ? HEX.dark.lightGreen : HEX.light.green, pageBg, 4.5),
  }
  const mutedColor = isDark ? "var(--brand-neutral-400)" : "var(--brand-neutral-500)"

  return (
    <p
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      className="mt-3 text-[1.05rem] md:text-[1.2rem] font-semibold italic tracking-normal cursor-default select-none outline-none"
    >
      {WORDS.map((w, i) => (
        <span
          key={w.text}
          className="transition-colors duration-300"
          style={{ color: hovered ? palette[w.key] : mutedColor }}
        >
          {w.text}
          {i < WORDS.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  )
} 
