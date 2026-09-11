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

import { CaretDown, Plus, ShoppingBagOpen, Tag } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { HUBS, HubId } from "@/lib/data"
import { HUB_ON_COLOR } from "@/lib/brand"
import { GLASS, HubIcon } from "./shared"
import { HUB_ORDER, BULK_TIERS, isScanItem, hubHasBulk, sectionHasBulk, getDisplayName } from "./lib"

interface Subtotal { total: number; savings: number; count: number }

interface HubBrowserProps {
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
}

function CountBadge({
  count, solidAccent, onSolid, label, big,
}: { count: number; solidAccent: string; onSolid: string; label: string; big?: boolean }) {
  return (
    <span
      className={cn(
        "absolute flex items-center justify-center rounded-full font-black shadow-md border-2 border-white dark:border-zinc-900 leading-none",
        big ? "-top-2 -right-2 min-w-[26px] h-[26px] px-1.5 text-[0.72rem]" : "-top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 text-[0.66rem]"
      )}
      style={{ backgroundColor: solidAccent, color: onSolid }}
      aria-label={label}
    >
      {count}
    </span>
  )
}

export function HubBrowser({
  openHub, setOpenHub, openSections, toggleSection,
  getAccent, getSolid, hubSubtotal, sectionSubtotal, getItemQty, onAddItem,
}: HubBrowserProps) {
  const activeHub = openHub ? HUBS[openHub] : null

  return (
    <div className="p-4 space-y-4">
      <span className="text-[0.78rem] font-black uppercase tracking-widest text-muted-foreground px-1">
        Choose a Hub
      </span>

      {openHub ? (
        // Compact row — same squircle language as the full grid, smaller.
        <div className="flex items-center justify-center flex-wrap gap-2" role="tablist" aria-label="Hubs">
          {HUB_ORDER.map(hubId => {
            const hub = HUBS[hubId]
            const accent = getAccent(hubId)
            const solidAccent = getSolid(hubId)
            const onSolid = HUB_ON_COLOR[hubId]
            const isSelected = openHub === hubId
            const hubSub = hubSubtotal(hubId)

            return (
              <button
                key={hubId}
                onClick={() => setOpenHub(isSelected ? null : hubId)}
                aria-pressed={isSelected}
                aria-label={hub.title}
                className={cn(
                  "group relative flex items-center justify-center rounded-[18px] w-14 h-14 shrink-0 abh-press",
                  "transition-all duration-150 ease-out transform-gpu shadow-sm hover:shadow-md",
                  GLASS.item
                )}
                style={{
                  ["--hub-accent" as unknown as string]: accent,
                  boxShadow: isSelected ? `0 0 0 2px ${accent}` : undefined,
                  backgroundColor: isSelected ? `color-mix(in srgb, ${accent} 10%, transparent)` : undefined,
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
                <span
                  className={cn(
                    "transition-colors duration-150",
                    isSelected ? "" : "text-muted-foreground group-hover:[color:var(--hub-accent)]"
                  )}
                  style={isSelected ? { color: solidAccent } : undefined}
                >
                  <HubIcon id={hubId} size={36} color="currentColor" />
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        // Full grid, pre-selection — vertically centered in the remaining
        // scroll space (see note above on what "centered" means here).
        <div className="flex items-center justify-center min-h-[42vh]">
          <div className="flex flex-wrap justify-center gap-3 max-w-[360px]">
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
                  aria-expanded={isSelected}
                  aria-controls={`hub-panel-${hubId}`}
                  className={cn(
                    "group relative flex flex-col items-center justify-center gap-1.5 rounded-[26px] p-2 w-[30%] min-w-[96px] aspect-square abh-press",
                    "transition-all duration-150 ease-out transform-gpu shadow-sm hover:shadow-md",
                    GLASS.item
                  )}
                  style={{
                    ["--hub-accent" as unknown as string]: accent,
                    boxShadow: isSelected ? `0 0 0 2px ${accent}` : undefined,
                    backgroundColor: isSelected ? `color-mix(in srgb, ${accent} 10%, transparent)` : undefined,
                  }}
                >
                  {hubSub && (
                    <CountBadge
                      count={hubSub.count}
                      solidAccent={solidAccent}
                      onSolid={onSolid}
                      label={`${hubSub.count} item${hubSub.count === 1 ? "" : "s"} from ${hub.title}`}
                      big
                    />
                  )}
                  {hubBulk && (
                    <span
                      className="absolute top-1.5 left-1.5 flex items-center justify-center w-5 h-5 rounded-full"
                      style={{ backgroundColor: "color-mix(in srgb, var(--brand-orange) 15%, transparent)" }}
                      aria-hidden="true"
                    >
                      <Tag size={10} weight="fill" style={{ color: "var(--brand-orange)" }} />
                    </span>
                  )}

                  {/* Single squircle chip — icon sits directly in the button,
                      no inner background circle, sized to nearly fill it. */}
                  <span
                    className={cn(
                      "transition-colors duration-150",
                      isSelected ? "" : "text-muted-foreground group-hover:[color:var(--hub-accent)]"
                    )}
                    style={isSelected ? { color: solidAccent } : undefined}
                  >
                    <HubIcon id={hubId} size={48} color="currentColor" />
                  </span>

                  <span
                    className={cn(
                      "text-[0.7rem] font-black text-center leading-tight transition-colors duration-150",
                      isSelected ? "" : "text-muted-foreground group-hover:[color:var(--hub-accent)]"
                    )}
                    style={isSelected ? { color: solidAccent } : undefined}
                  >
                    {hub.title.replace(" Hub", "")}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Expanded content for whichever hub is selected */}
      {activeHub && openHub && (
        <div
          id={`hub-panel-${openHub}`}
          className={cn(
            "rounded-[14px] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 ease-out motion-reduce:animate-none",
            GLASS.section
          )}
        >
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-100 dark:border-white/10">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--brand-orange)" }} aria-hidden="true" />
              <span className="text-[0.95rem] font-black" style={{ color: getAccent(openHub) }}>
                {activeHub.title}
              </span>
            </span>
            <button
              onClick={() => setOpenHub(null)}
              aria-label="Collapse hub"
              className="abh-press w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors duration-150"
            >
              <CaretDown size={13} className="rotate-180" aria-hidden="true" />
            </button>
          </div>

          <div className="py-1">
            {activeHub.sections.map((section, sIdx) => {
              const hubId = openHub
              const accent = getAccent(hubId)
              const solidAccent = getSolid(hubId)
              const onSolid = HUB_ON_COLOR[hubId]
              const isSectionOpen = openSections[hubId] === sIdx
              const secSub = sectionSubtotal(hubId, section.title)
              const sectionBulk = sectionHasBulk(hubId, section.title, section.items)
              const sectionPanelId = `section-panel-${hubId}-${sIdx}`
              const isLastSection = sIdx === activeHub.sections.length - 1

              return (
                <div key={sIdx} className="relative">
                  {!isLastSection && (
                    <span
                      className="absolute left-3 top-5 bottom-0 w-0.5 pointer-events-none"
                      style={{ backgroundColor: "var(--border)" }}
                      aria-hidden="true"
                    />
                  )}

                  <div className="relative">
                    <button
                      onClick={() => toggleSection(hubId, sIdx)}
                      aria-expanded={isSectionOpen}
                      aria-controls={sectionPanelId}
                      style={{ ["--hub-accent" as unknown as string]: accent }}
                      className="group w-full flex items-center justify-between pl-8 pr-3 py-2 min-h-[2.5rem] transition-colors duration-150 hover:bg-zinc-100/70 dark:hover:bg-white/5"
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "text-[0.78rem] font-black uppercase tracking-[0.15em] transition-colors duration-200",
                            isSectionOpen
                              ? "px-2.5 py-1 rounded-full"
                              : "px-0 py-1 text-muted-foreground group-hover:[color:var(--hub-accent)]"
                          )}
                          style={isSectionOpen ? { backgroundColor: solidAccent, color: onSolid } : undefined}
                        >
                          {section.title}
                        </span>

                        {!isSectionOpen && sectionBulk && (
                          <span
                            className="flex items-center gap-0.5 text-[0.58rem] font-black px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: "color-mix(in srgb, var(--brand-orange) 12%, transparent)", color: "var(--brand-orange-text)" }}
                            aria-label="Bulk pricing available in this section"
                          >
                            <Tag size={9} weight="fill" aria-hidden="true" /> Bulk
                          </span>
                        )}

                        {!isSectionOpen && secSub && (
                          <span
                            className="flex items-center gap-0.5 text-[0.6rem] font-black px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground transition-colors duration-150 group-hover:[color:var(--hub-accent)]"
                            aria-label={`${secSub.count} item${secSub.count === 1 ? "" : "s"} in cart from ${section.title}`}
                          >
                            <ShoppingBagOpen size={10} weight="fill" aria-hidden="true" />
                            {secSub.count}
                          </span>
                        )}
                      </span>
                      <CaretDown
                        size={12}
                        className={cn(
                          "mr-1 transition-transform duration-200 ease-out motion-reduce:transition-none",
                          isSectionOpen ? "" : "text-muted-foreground group-hover:[color:var(--hub-accent)]"
                        )}
                        style={{ color: isSectionOpen ? accent : undefined, transform: isSectionOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </button>

                    <span
                      className="absolute left-3 top-0 h-5 w-0.5 pointer-events-none"
                      style={{ backgroundColor: "var(--border)" }}
                      aria-hidden="true"
                    />
                    <span
                      className="absolute left-3 top-5 -translate-y-1/2 w-2.5 h-0.5 pointer-events-none"
                      style={{ backgroundColor: "var(--border)" }}
                      aria-hidden="true"
                    />
                    <span
                      className="absolute left-[1.4rem] top-5 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                      style={{ backgroundColor: "var(--muted-foreground)" }}
                      aria-hidden="true"
                    />
                  </div>

                  <div
                    id={sectionPanelId}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-250 ease-out motion-reduce:transition-none",
                      isSectionOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="pl-8 pb-2 space-y-1">
                        {section.items.map((item, iIdx) => {
                          const itemId = `${hubId}-${section.title}-${item.name}`
                          const hasBulk = !!BULK_TIERS[itemId] || isScanItem(item.name)
                          const itemQty = getItemQty(itemId)
                          const isLastItem = iIdx === section.items.length - 1
                          return (
                            <div key={iIdx} className="relative">
                              {!isLastItem && (
                                <span
                                  className="absolute left-3 top-[22px] bottom-0 w-0.5 pointer-events-none"
                                  style={{ backgroundColor: "var(--border)" }}
                                  aria-hidden="true"
                                />
                              )}
                              <span
                                className="absolute left-3 top-0 h-[22px] w-0.5 pointer-events-none"
                                style={{ backgroundColor: "var(--border)" }}
                                aria-hidden="true"
                              />
                              <span
                                className="absolute left-3 top-[22px] -translate-y-1/2 w-2 h-0.5 pointer-events-none"
                                style={{ backgroundColor: "var(--border)" }}
                                aria-hidden="true"
                              />
                              <span
                                className="absolute left-[1.15rem] top-[22px] -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                                style={{ backgroundColor: "var(--muted-foreground)" }}
                                aria-hidden="true"
                              />

                              <div
                                className={cn(
                                  "group relative overflow-hidden ml-6 flex items-center gap-2 p-2 rounded-[10px] shadow-sm transition-colors duration-150",
                                  GLASS.item
                                )}
                                style={{ ["--hub-accent" as unknown as string]: accent }}
                              >
                                {hasBulk && (
                                  <span
                                    className="absolute -right-7 top-1.5 rotate-45 text-[0.55rem] font-black uppercase tracking-wider px-7 py-0.5"
                                    style={{ backgroundColor: "var(--brand-orange)", color: "var(--on-brand-orange)" }}
                                    aria-hidden="true"
                                  >
                                    Bulk
                                  </span>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-[0.9rem] font-bold text-zinc-700 dark:text-zinc-300 truncate">
                                    {getDisplayName(section.title, item.name)}
                                    {hasBulk && <span className="sr-only"> — bulk pricing available</span>}
                                  </p>
                                  <p className="text-[0.78rem] font-medium text-muted-foreground">{item.price}</p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {itemQty > 0 && (
                                    <span
                                      className="flex items-center gap-0.5 text-[0.6rem] font-black px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground transition-colors duration-150 group-hover:[color:var(--hub-accent)]"
                                      aria-label={`${itemQty} already in your quote`}
                                    >
                                      <ShoppingBagOpen size={10} weight="fill" aria-hidden="true" />
                                      {itemQty}
                                    </span>
                                  )}
                                  <button
                                    onClick={() => onAddItem(hubId, section.title, item.name, item.price)}
                                    style={{
                                      ["--hub-accent" as unknown as string]: solidAccent,
                                      ["--hub-on-accent" as unknown as string]: onSolid,
                                    }}
                                    className="abh-press w-7 h-7 rounded-full flex items-center justify-center shadow-sm bg-secondary text-foreground transition-colors duration-150 hover:bg-[var(--hub-accent)] hover:text-[var(--hub-on-accent)] focus-visible:bg-[var(--hub-accent)] focus-visible:text-[var(--hub-on-accent)]"
                                    aria-label={`Add ${item.name}`}
                                  >
                                    <Plus size={13} weight="bold" aria-hidden="true" />
                                  </button>
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
  )
                 }
