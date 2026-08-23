// components/pricing-page/lib.ts
import { HUBS, type HubId, parseRate } from '@/lib/data'
import { BRAND } from '@/lib/brand'

// ── Constants ──
export const HUB_ORDER: HubId[] = ['print', 'doc', 'design', 'eservice', 'tech']

// FIX: was a hardcoded local `const ADOBE_PDF_RED = '#EC1C24'`. Moved to
// BRAND.adobePdfRed in lib/brand.ts, following the same pattern already
// used for BRAND.whatsapp (a fixed, real-world third-party brand color
// exempt from the theme-token system). Re-exported here under the same
// name so nothing else importing ADOBE_PDF_RED from this file needs to change.
export const ADOBE_PDF_RED = BRAND.adobePdfRed

// ── Price parsing ──
// FIX: previously its own local implementation using /\d+/, which
// truncates decimals ("R99.50" → 99, silently dropping the .50). Now
// delegates to the shared, decimal-safe parseRate() in lib/data/index.ts
// instead of maintaining a second, weaker copy of the same logic.
export function parsePrice(price: string): number {
  return parseRate(price)
}

// ── Quote calculator bridge ──
export function dispatchAddToQuote(hubId: HubId, sectionTitle: string, name: string, price: string) {
  window.dispatchEvent(new CustomEvent('abh:add-to-quote', { detail: { hubId, sectionTitle, name, price } }))
}

// FIX: new — mirrors dispatchAddToQuote. Wire a matching listener for
// 'abh:remove-from-quote' wherever 'abh:add-to-quote' is currently handled
// (the quote calculator widget) so the minus button actually removes the line.
export function dispatchRemoveFromQuote(hubId: HubId, sectionTitle: string, name: string, price: string) {
  window.dispatchEvent(new CustomEvent('abh:remove-from-quote', { detail: { hubId, sectionTitle, name, price } }))
}

// ── Bulk discount lookup ──
export function bulkDiscountPercent(
  hubId: HubId, sectionTitle: string, itemName: string, baseAmount: number,
  bulkTiers: Record<string, { rate: number }[]>, isScanItem: (n: string) => boolean, scanBulkRate: number
): number | null {
  if (baseAmount <= 0) return null
  const itemId = `${hubId}-${sectionTitle}-${itemName}`
  const tiers = bulkTiers[itemId]
  if (tiers && tiers.length > 0) {
    const bestRate = Math.min(...tiers.map(t => t.rate))
    // FIX: clamped to 0 — if a bulk tier's rate is ever accidentally
    // configured higher than the base price (a data-entry mistake), the
    // unclamped math would produce a negative "% off" and display a
    // broken-looking badge on the live site. This has no effect on any
    // correctly-configured tier.
    return Math.max(0, Math.round(((baseAmount - bestRate) / baseAmount) * 100))
  }
  if (isScanItem(itemName)) {
    return Math.max(0, Math.round(((baseAmount - scanBulkRate) / baseAmount) * 100))
  }
  return null
}

// ── Search ──
export type Result = {
  hubId: HubId
  hubTitle: string
  section: string
  name: string
  price: string
  accent: string
}

export function searchHubs(query: string, accentFor: (id: HubId) => string): Result[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const out: Result[] = []
  HUB_ORDER.forEach(hubId => {
    const hub = HUBS[hubId]
    hub.sections.forEach(section => {
      section.items.forEach(item => {
        if (
          item.name.toLowerCase().includes(q) ||
          item.price.toLowerCase().includes(q) ||
          section.title.toLowerCase().includes(q) ||
          hub.title.toLowerCase().includes(q)
        ) {
          out.push({ hubId, hubTitle: hub.title, section: section.title, name: item.name, price: item.price, accent: accentFor(hubId) })
        }
      })
    })
  })
  return out.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
} 
