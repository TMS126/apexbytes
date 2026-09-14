// lib/data/index.ts

import type { HubId, Hub } from './types'
import { printHub, docHub, designHub, eserviceHub, techHub } from './hubs'

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

export function formatPrice(entry: PriceEntry): string {
  const suffix = entry.unit === 'flat' ? '' : `/${entry.unit}`
  return `${CURRENCY_SYMBOL}${entry.rate}${suffix}`
}

export function parseRate(price: string): number {
  return parsePrice(price).rate
}

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

export const PRICING = derivePricing(HUBS)

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
