// components/pricing-page/search.tsx
// (Assuming this path based on the relative imports "./lib" and "./shared" —
// flag me if the actual file lives elsewhere and I'll re-anchor.)
"use client"

import { Broom, MagnifyingGlass } from '@phosphor-icons/react'
import { Check, PlusCircle } from '@phosphor-icons/react'
import { HubIcon } from '@/components/services-page/shared'
import { Result } from './lib'

export function PricingSearchInput({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div data-hover-border="" className="abh-reference-search">
        <MagnifyingGlass size={18} weight="regular" className="shrink-0" aria-hidden="true" />
        <label htmlFor="pricing-search" className="sr-only">Search any service or price</label>
        <input
          id="pricing-search"
          type="text"
          placeholder="Search any service or price…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="abh-search-input"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="flex size-7 shrink-0 items-center justify-center rounded-[14px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Broom size={15} weight="regular" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

// ── Search results list — unchanged ──
export function PricingSearchResults({
  results, justAdded, onAdd,
}: {
  results: Result[]
  justAdded: string | null
  onAdd: (hubId: Result['hubId'], section: string, name: string, price: string) => void
}) {
  return (
    <div className="space-y-3">
      <p className="text-[0.9rem] text-muted-foreground pb-1">
        {results.length} result{results.length !== 1 ? 's' : ''} — lowest first
      </p>
      {results.map((r, i) => {
        const key = `${r.hubId}-${r.section}-${r.name}`
        return (
          <div key={i} className="abh-card flex items-center gap-3 px-4 py-4 transition-shadow duration-200 hover:shadow-md">
            <HubIcon id={r.hubId} size={20} color={r.accent} />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-[1.05rem] font-medium text-foreground">
                <span className="truncate">{r.name}</span>
              </p>
              <p className="text-[0.9rem] text-muted-foreground mt-0.5">{r.hubTitle} · {r.section}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium" style={{ backgroundColor: `color-mix(in srgb, ${r.accent} 12%, transparent)`, color: r.accent }}>{r.price}</span>
              <button
                onClick={() => onAdd(r.hubId, r.section, r.name, r.price)}
                aria-label={`Add ${r.name} to quote`}
                className="group flex size-9 items-center justify-center rounded-[14px] transition-transform duration-150 active:scale-90 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--card-rule)]/40"
                style={{ color: justAdded === key ? '#16a34a' : r.accent }}
              >
                {justAdded === key ? <Check size={20} weight="bold" /> : <PlusCircle size={20} weight="regular" className="transition-all duration-150 group-hover:fill-current group-focus-visible:fill-current" />}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
} 
