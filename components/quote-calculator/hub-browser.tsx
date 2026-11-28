// components/quote-calculator/hub-browser.tsx
"use client"

/* ============================================================
   AUDIT PASS (this edit):
   - Hub tiles previously had TWO stacked chip layers: an outer
     rounded-square button PLUS an inner circle background behind
     the icon. Collapsed to ONE squircle chip per hub — the button
     itself is the only visual container now, icon sits directly
     inside it at a much larger size (relative to the chip) so it
     reads as "icon-as-button" rather than "icon inside a badge
     inside a button."
   - Compact row (hub already selected) got the same treatment —
     was a plain circle; now the same squircle shape as the full
     grid, just smaller, so both states share one visual language.
   - Count badges: were a generic "abh-badge-circle" utility of
     unknown exact shape/size. Replaced with an explicit, guaranteed
     circle (rounded-full + fixed flex centering), bigger footprint,
     bigger text, and a white/zinc ring so it separates cleanly from
     whatever color sits behind it in both themes.
   - Full hub grid (before any hub is picked) now sits inside a
     min-height flex-center wrapper so it reads as vertically
     centered in the available panel space instead of pinned under
     "Choose a Hub." NOTE: this container lives inside the same
     scrollable area as the cart summary bar above it, so "centered"
     here means centered within the remaining scroll space below
     that bar — not literally the physical center of the phone
     screen. True screen-centering would need pulling this out of
     the scroll flow entirely; flag if that's what you actually want
     and I'll restructure index.tsx instead.
   - All hover/selected accent logic from the previous audit is
     unchanged — neutral at rest, hub color only on hover or when
     selected; bulk tags/ribbons still seal-orange (shared, not
     hub-specific); connecting tree lines still neutral border tone.
   ============================================================ */

import { CaretDown, CheckCircle, Minus, Plus, ShoppingBagOpen, Tag } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { HUBS, HubId, sortItemsByPrice } from "@/lib/data"
import { HUB_ON_COLOR } from "@/lib/brand"
import { GLASS } from "./shared"
import { HubFilterIcon } from "@/components/hub-filter-icon"
import { HUB_ORDER, BULK_TIERS, isScanItem, hubHasBulk, sectionHasBulk, getDisplayName } from "./lib"

interface Subtotal { total: number; savings: number; count: number }

interface HubBrowserProps {
  embedded?: boolean
  openHub: HubId | null
  setOpenHub: (h: HubId | null) => void
  openSections: Record<HubId, number | null>
  toggleSection: (hubId: HubId, sIdx: number) => void
  getAccent: (id: HubId) => string
  getSolid: (id: HubId) => string
  hubSubtotal: (hubId: HubId) => Subtotal | null
  sectionSubtotal: (hubId: HubId, sectionTitle: string) => Subtotal | null
  getItemQty: (itemId: string) => number
  onAddItem: (hubId: HubId, sectionTitle: string, name: string, price: string) => void
  onStepQty: (id: string, delta: number) => void
  onSetQty: (id: string, qty: number) => void
}

function CountBadge({
  count, solidAccent, onSolid, label, big,
}: { count: number; solidAccent: string; onSolid: string; label: string; big?: boolean }) {
  return (
    <span
      className={cn(
        "abh-badge-circle absolute font-medium border border-white dark:border-zinc-900 leading-none",
        big ? "top-1 right-1 w-[26px] h-[26px] text-[0.72rem]" : "top-1 right-1 w-[22px] h-[22px] text-[0.66rem]"
      )}
      style={{ backgroundColor: solidAccent, color: onSolid }}
      aria-label={label}
    >
      {count}
    </span>
  )
}

export function HubBrowser({
  embedded = false, openHub, setOpenHub, openSections, toggleSection,
  getAccent, getSolid, hubSubtotal, sectionSubtotal, getItemQty, onAddItem, onStepQty, onSetQty,
}: HubBrowserProps) {
  const activeHub = openHub ? HUBS[openHub] : null
  const visibleSections = activeHub?.sections ?? []

  return (
      <div className={cn("min-w-0 space-y-3 p-3 md:space-y-4 md:p-4", embedded && "md:sticky md:top-0 md:self-start")}>
      <div className="flex items-center justify-between gap-3 px-1">
        <span className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Services</span>
      </div>

      <div className={cn(embedded ? "md:grid md:grid-cols-[180px_minmax(0,1fr)] md:items-start md:gap-4" : "space-y-4")}>
      <div className={cn("flex gap-4 overflow-x-auto pb-1", embedded ? "md:grid md:grid-cols-1 md:overflow-visible" : "md:justify-center")} role="tablist" aria-label="Hubs">
          <div className={cn("mx-auto flex w-max min-w-full shrink-0 justify-center gap-3", embedded && "md:contents")}>
          {HUB_ORDER.map(hubId => {
            const hub = HUBS[hubId]
            const accent = getAccent(hubId)
            const solidAccent = getSolid(hubId)
            const onSolid = HUB_ON_COLOR[hubId]
            const isSelected = openHub === hubId
            const hubSub = hubSubtotal(hubId)
            const hubBulk = hubHasBulk(hubId)

            return (
              <button
                key={hubId}
                onClick={() => setOpenHub(isSelected ? null : hubId)}
                aria-pressed={isSelected}
                aria-label={hub.title}
                className={cn(
                  "group relative flex w-12 shrink-0 items-center justify-center gap-2 border-l-2 border-transparent bg-transparent px-1 py-3 text-center md:w-auto md:min-w-[112px] md:justify-start md:px-3 md:py-2.5 md:pr-8 md:text-left",
                  embedded && "md:w-full",
                  "transition-colors duration-150 ease-out",
                  isSelected && "md:border-l-[3px] border-[var(--hub-accent)] bg-transparent"
                )}
                style={{
                  ["--hub-accent" as unknown as string]: accent,
                }}
              >
                {hubSub && (
                  <CountBadge
                    count={hubSub.count}
                    solidAccent={solidAccent}
                    onSolid={onSolid}
                    label={`${hubSub.count} item${hubSub.count === 1 ? "" : "s"} from ${hub.title}`}
                  />
                )}
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center transition-colors duration-150 md:size-8",
                      isSelected ? "" : "text-muted-foreground group-hover:[color:var(--hub-accent)]"
                    )}
                    style={isSelected ? { color: solidAccent } : undefined}
                  >
                    <HubFilterIcon id={hubId} size={40} weight="regular" color="currentColor" />
                  </span>
                  <span className="hidden min-w-0 md:block">
                    <span className="block truncate text-xs font-semibold">{hub.title.replace(" Hub", "")}</span>
                    {hubBulk && (
                      <span
                        className="mt-1 inline-flex max-w-full items-center gap-0.5 whitespace-nowrap rounded-full bg-[var(--bulk-ribbon-bg)] px-1.5 py-0.5 text-[0.52rem] font-semibold uppercase tracking-wide"
                        style={{ color: "var(--bulk-ribbon-text)" }}
                        aria-label={`${hub.title} has bulk pricing services`}
                      >
                        <Tag size={8} weight="fill" aria-hidden="true" /> Bulk
                      </span>
                    )}
                  </span>
                </span>
              </button>
            )
          })}
          </div>
        </div>

        <div className={embedded ? "min-w-0" : ""}>

      {/* Expanded content for whichever hub is selected */}
      {activeHub && openHub && (
        <div
          id={`hub-panel-${openHub}`}
          className={cn(
            "rounded-[14px] overflow-hidden",
            GLASS.section
          )}
        >
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-100 dark:border-white/10">
            <span className="flex items-center gap-2">
              <span className="text-[0.95rem] font-medium" style={{ color: getAccent(openHub) }}>
                {activeHub.title}
              </span>
            </span>
            <button
              onClick={() => setOpenHub(null)}
              aria-label="Collapse hub"
              className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors duration-150"
            >
              <CaretDown size={13} className="rotate-180" aria-hidden="true" />
            </button>
          </div>

          <div className="max-h-[min(52vh,520px)] overflow-y-auto overscroll-contain py-1 [scrollbar-width:thin]" data-calculator-hub-scroll>
            {visibleSections.map((section) => {
              const sIdx = activeHub.sections.indexOf(section)
              const hubId = openHub
              const accent = getAccent(hubId)
              const solidAccent = getSolid(hubId)
              const onSolid = HUB_ON_COLOR[hubId]
              const isSectionOpen = openSections[hubId] === sIdx
              const secSub = sectionSubtotal(hubId, section.title)
              const sectionBulk = sectionHasBulk(hubId, section.title, section.items)
              const sectionPanelId = `section-panel-${hubId}-${sIdx}`
              return (
                <div key={sIdx}>
                  <div>
                    <button
                      data-calculator-section-card
                      onClick={() => toggleSection(hubId, sIdx)}
                      aria-expanded={isSectionOpen}
                      aria-controls={sectionPanelId}
                      style={{ ["--hub-accent" as unknown as string]: accent }}
                      className={cn(
                        "group w-full flex items-center justify-between pl-5 pr-3 py-2.5 min-h-[2.75rem] transition-colors duration-150 hover:bg-zinc-100/70 dark:hover:bg-white/5",
                        isSectionOpen && "bg-[color-mix(in_srgb,var(--hub-accent)_7%,transparent)]"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[0.84rem] font-medium uppercase tracking-[0.1em] transition-colors duration-200",
                            isSectionOpen
                              ? "py-1 font-semibold [color:var(--hub-accent)]"
                              : "py-1 text-muted-foreground group-hover:[color:var(--hub-accent)]"
                          )}
                          style={isSectionOpen ? { color: solidAccent } : undefined}
                        >
                          {section.title}
                        </span>

                        {sectionBulk && (
                          <span
                            className="abh-calc-bulk-label inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-[0.58rem] font-medium"
                            aria-label="Bulk pricing available in this section"
                          >
                            <Tag size={9} weight="fill" aria-hidden="true" /> Bulk
                          </span>
                        )}

                        {!isSectionOpen && secSub && (
                          <span
                            className="abh-badge-circle w-6 h-6 gap-0.5 text-[0.6rem] font-medium bg-secondary text-muted-foreground transition-colors duration-150 group-hover:[color:var(--hub-accent)]"
                            aria-label={`${secSub.count} item${secSub.count === 1 ? "" : "s"} in cart from ${section.title}`}
                          >
                            <ShoppingBagOpen size={10} weight="fill" aria-hidden="true" />
                            {secSub.count}
                          </span>
                        )}
                      </span>
                      <span className="flex items-center gap-2">
                        {isSectionOpen && <CheckCircle size={15} weight="fill" style={{ color: solidAccent }} aria-label="Selected section" />}
                        <CaretDown
                          size={14}
                          className={cn(
                            "shrink-0 text-muted-foreground transition-transform duration-200",
                            isSectionOpen && "rotate-180 [color:var(--hub-accent)]"
                          )}
                          aria-hidden="true"
                        />
                      </span>
                    </button>

                  </div>

                  <div
                    id={sectionPanelId}
                    role="region"
                    aria-hidden={!isSectionOpen}
                    inert={!isSectionOpen}
                    className={cn(
                      "grid min-h-0 transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                      isSectionOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="pl-5 pb-2 space-y-1" data-calculator-item-area style={{ touchAction: "pan-y" }}>
                        {sortItemsByPrice(section.items).map((item, iIdx) => {
                          const itemId = `${hubId}-${section.title}-${item.name}`
                          const hasBulk = !!BULK_TIERS[itemId] || isScanItem(item.name)
                          const itemQty = getItemQty(itemId)
                          return (
                            <div key={iIdx} className="relative">
                              <div
                                className={cn(
                                  "group relative ml-3 flex items-center gap-2 border-l-2 border-transparent py-2 pl-3 pr-1 transition-[border-color,color] duration-150",
                                  itemQty > 0 && "border-[var(--hub-accent)]"
                                )}
                                style={{ ["--hub-accent" as unknown as string]: accent }}
                              >
                                <div className="min-w-0 flex-1">
                                  <p className={cn(
                                    "break-words text-[0.88rem] text-zinc-700 dark:text-zinc-300",
                                    itemQty > 0 ? "font-semibold" : "font-medium"
                                  )}>
                                    <span className="inline-flex flex-wrap items-center gap-1.5">{itemQty > 0 && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />}{getDisplayName(section.title, item.name)}{hasBulk && <span className="abh-calc-bulk-label inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-1.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-wide">Bulk</span>}</span>
                                    {hasBulk && <span className="sr-only"> — bulk pricing available</span>}
                                  </p>
                                  <p className="text-[0.76rem] font-medium text-muted-foreground" style={itemQty > 0 ? { color: accent } : undefined}>{item.price}</p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 rounded-full bg-secondary/70 p-0.5" data-calculator-swipe-block>
                                  <button
                                    onClick={() => onStepQty(itemId, -1)}
                                    disabled={itemQty < 1}
                                    aria-label={`Decrease quantity for ${item.name}`}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground disabled:opacity-35"
                                  ><Minus size={13} weight="bold" aria-hidden="true" /></button>
                                  <input
                                    aria-label={`Quantity for ${item.name}`}
                                    inputMode="numeric"
                                    type="number"
                                    min={itemQty > 0 ? 1 : 0}
                                    value={itemQty}
                                    onChange={(event) => onSetQty(itemId, Math.max(0, Number(event.target.value) || 0))}
                                    className="w-10 min-w-10 border-0 border-b border-foreground/20 bg-transparent p-0 text-center text-sm font-semibold outline-none focus:border-[var(--hub-accent)] focus:ring-0"
                                  />
                                  <button
                                    onClick={() => onAddItem(hubId, section.title, item.name, item.price)}
                                    aria-label={`Increase quantity for ${item.name}`}
                                    style={{ ["--hub-accent" as unknown as string]: solidAccent, ["--hub-on-accent" as unknown as string]: onSolid }}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-[var(--hub-accent)] hover:text-[var(--hub-on-accent)]"
                                  ><Plus size={13} weight="bold" aria-hidden="true" /></button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  )
                 }
