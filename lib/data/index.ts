// lib/data/index.ts

import type { HubId, Hub } from './types'
import { printHub } from './hubs/print'
import { docHub } from './hubs/doc'
import { designHub } from './hubs/design'
import { eserviceHub } from './hubs/eservice'
import { techHub } from './hubs/tech'

export * from './types'
export * from './turnaround'
export * from './projects'

export const HUBS: Record<HubId, Hub> = {
  print: printHub,
  doc: docHub,
  design: designHub,
  eservice: eserviceHub,
  tech: techHub,
}

export const CURRENCY_SYMBOL = 'R'

export type PriceUnit = 'flat' | 'page' | 'hr'

export interface PriceEntry {
  rate: number
  unit: PriceUnit
}

const PRICE_PATTERN = /^R\s*(\d+(?:\.\d+)?)\s*(?:\/\s*(page|hr))?$/i

function parsePrice(raw: string): PriceEntry {
  const match = raw.trim().match(PRICE_PATTERN)
  if (!match) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[lib/data] Could not parse price "${raw}" — expected formats like "R20", "R5/page", or "R150/hr". Defaulting to rate 0.`
      )
    }
    return { rate: 0, unit: 'flat' }
  }
  const rate = parseFloat(match[1])
  const unit = (match[2]?.toLowerCase() as PriceUnit) || 'flat'
  return { rate, unit }
}

// Formats a PriceEntry back into display text, e.g. { rate: 5, unit: 'page' } -> "R5/page"
export function formatPrice(entry: PriceEntry): string {
  const suffix = entry.unit === 'flat' ? '' : `/${entry.unit}`
  return `${CURRENCY_SYMBOL}${entry.rate}${suffix}`
}

// NEW — public, numeric-only price parser. Exists so any component that
// just needs a plain sortable/comparable number (e.g. components/
// pricing-page/lib.ts's search-result sort) shares this exact parsing
// logic instead of maintaining its own separate regex. Before this
// existed, that pricing-page file had its own weaker local parser
// (/\d+/, which truncates decimals — "R99.50" would become 99, silently
// dropping the .50) — exactly the kind of two-sources-of-truth drift
// that already caused a real bug once in this codebase (see the SASSA
// item-name mismatch that motivated deriving PRICING from HUBS below).
export function parseRate(price: string): number {
  return parsePrice(price).rate
}

// ── SINGLE SOURCE OF TRUTH ────────────────────────────────────────────────
// PRICING is derived, not hand-typed. It walks HUBS — the same data every
// hub page, modal, and quote calculator already reads from — and parses
// each ServiceItem.price string into a structured entry. There is no
// second place to edit a price: change it on the ServiceItem inside the
// relevant lib/data/hubs/*.ts file, and this updates automatically.
//
// Keyed by [hubId][sectionTitle][itemName] rather than a flat
// [hubId][itemName] — item names are NOT unique within a hub across
// sections (confirmed: Print Hub's "Black & White"/"Colour" both appear
// under "Printing" AND separately under "Copying" at different prices —
// a flat lookup would let one silently overwrite the other).
//
// CONFIRMED SAFE: repo-wide search found zero other imports of the old
// hand-typed PRICING/formatPrice — components/pricing-page/lib.ts (the
// only place that could plausibly need pricing data outside the hub
// pages themselves) reads directly from HUBS already, not from PRICING.
function derivePricing(hubs: Record<HubId, Hub>): Record<HubId, Record<string, Record<string, PriceEntry>>> {
  const result = {} as Record<HubId, Record<string, Record<string, PriceEntry>>>
  for (const hubId of Object.keys(hubs) as HubId[]) {
    const bySection: Record<string, Record<string, PriceEntry>> = {}
    for (const section of hubs[hubId].sections) {
      const byItem: Record<string, PriceEntry> = {}
      for (const item of section.items) {
        byItem[item.name] = parsePrice(item.price)
      }
      bySection[section.title] = byItem
    }
    result[hubId] = bySection
  }
  return result
}

/**
 * The live pricing table, generated fresh from HUBS at module load.
 * Shape: PRICING[hubId][sectionTitle][itemName] -> { rate, unit }
 */
export const PRICING = derivePricing(HUBS)

/**
 * Convenience lookup: "what does this exact service cost". Pass
 * sectionTitle to disambiguate if the same item name exists in more than
 * one section of the hub — without it, the first match is returned and a
 * dev-mode warning is logged so the ambiguity is visible.
 */
export function getServicePrice(hubId: HubId, itemName: string, sectionTitle?: string): PriceEntry | undefined {
  const hub = PRICING[hubId]
  if (!hub) return undefined

  if (sectionTitle) return hub[sectionTitle]?.[itemName]

  const matches = Object.entries(hub).filter(([, items]) => itemName in items)
  if (matches.length > 1 && process.env.NODE_ENV !== 'production') {
    console.warn(
      `[lib/data] getServicePrice("${hubId}", "${itemName}") is ambiguous — found in sections: ${matches.map(([title]) => title).join(', ')}. Pass sectionTitle to disambiguate.`
    )
  }
  return matches[0]?.[1]?.[itemName]
} 
