// components/contact/hub-select.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { CaretDown } from "@phosphor-icons/react"
import { BRAND, TOKEN } from "@/lib/brand"
import { cn } from "@/lib/utils"
import { FORM_HUB_KEYS, getFormHubColor } from "@/lib/contact-data"

// Bug fix: hardcoded #9A9A9A/#777777 placeholder colors → tokens. Also
// replaced direct DOM style mutation on hover (e.currentTarget.style.color)
// with real React state — mixing manual style writes with re-renders can
// leave a stale color stuck if a re-render lands mid-hover.
export function HubSelect({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted] = useState(() => typeof window !== "undefined")
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = mounted && resolvedTheme === "dark"
  const options = Object.keys(FORM_HUB_KEYS)
  const activeColor = value ? getFormHubColor(value, isDark) : undefined
  const placeholderColor = isDark ? TOKEN.neutral400 : TOKEN.neutral500

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isOpen])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select a service hub"
        className="w-full px-4 py-3 border rounded-[14px] bg-white dark:bg-background text-[1rem] font-medium transition-all flex items-center justify-between gap-3 border-zinc-100 dark:border-zinc-800"
        style={{
          borderColor: value ? activeColor : (isOpen ? BRAND.blue : undefined),
          color: value ? activeColor : placeholderColor,
        }}
      >
        <span className="truncate">{value || "Select a hub"}</span>
        <CaretDown
          weight="bold"
          aria-hidden="true"
          className={cn(
            "w-4 h-4 shrink-0 transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      {isOpen && (
        <div role="listbox" className="absolute z-50 mt-1.5 w-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-[14px] shadow-xl overflow-hidden">
          {options.map((opt) => {
            const color = getFormHubColor(opt, isDark)
            const isHovered = hoveredOption === opt
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={value === opt}
                onClick={() => { onChange(opt); setIsOpen(false) }}
                onMouseEnter={() => setHoveredOption(opt)}
                onMouseLeave={() => setHoveredOption(null)}
                className="w-full px-4 py-3 text-left text-[1rem] font-medium flex items-center gap-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                style={{ color: isHovered ? color : undefined }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
                <span className="truncate">{opt}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
                } 
