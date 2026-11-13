// components/services-page/search-bar.tsx
"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { MagnifyingGlass, X } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { HUB_COLORS, HubKey } from "@/lib/brand"
import { HUBS } from "@/lib/data"
import { HubIcon } from "./shared"
import { buildSearchIndex, SearchableService, SelectedService } from "./lib"

export function InlineSearchBar({ onSelect }: { onSelect: (svc: SelectedService) => void }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const index = useMemo(() => buildSearchIndex(), [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return index.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)).slice(0, 8)
  }, [query, index])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const pick = (s: SearchableService) => {
    onSelect({ name: s.name, price: s.price, hubId: s.hubId, sectionTitle: s.sectionTitle, requirements: s.requirements, desc: s.description, turnaround: s.turnaround })
    setQuery("")
    setFocused(false)
  }

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-[300px]">
      <div className="abh-reference-search">
        <MagnifyingGlass size={18} weight="regular" className="shrink-0" aria-hidden="true" />
        <label htmlFor="inline-search-input" className="sr-only">Find a service</label>
        <input
          id="inline-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Find a service…"
          className="pr-8"
        />
      </div>
      {query && (
        <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-white/10">
          <X size={12} weight="bold" aria-hidden="true" />
        </button>
      )}
      {focused && query.trim().length > 0 && (
        <div className="abh-reference-search-results absolute left-0 right-0 top-full z-30 animate-in fade-in zoom-in-95 duration-150">
          {results.length > 0 ? (
            <div className="max-h-[320px] overflow-y-auto p-2">
              {results.map((s, idx) => {
                const colors = HUB_COLORS[s.hubId as HubKey]
                const accent = isDark ? colors.accentDark : colors.accentLight
                return (
                  <button key={`${s.hubId}-${s.name}-${idx}`} onClick={() => pick(s)} className="abh-reference-search-row">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `color-mix(in srgb, ${accent} 12%, #fff)`, color: accent }}>
                      <HubIcon id={s.hubId} size={17} color="currentColor" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-[#111]">{s.name}</p>
                      <p className="abh-search-muted truncate text-xs">{s.sectionTitle} · {HUBS[s.hubId].title}</p>
                    </div>
                    <span className="text-sm font-medium shrink-0" style={{ color: accent }}>{s.price}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="p-5 text-center">
              <p className="text-base font-medium text-muted-foreground dark:text-muted-foreground">No services found</p>
              <p className="text-sm font-medium text-muted-foreground dark:text-muted-foreground mt-1">Try a different word, or WhatsApp us directly.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 
