// components/quote-calculator/hub-browser.tsx
"use client"

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
                  "group relative flex items-center justify-center rounded-full w-12 h-12 shrink-0 abh-press",
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
                  <span
                    className="abh-badge-circle absolute -top-1 -right-1 min-w-[18px] text-[0.56rem] font-black shadow-md"
                    style={{ backgroundColor: solidAccent, color: onSolid }}
                    aria-label={`${hubSub.count} item${hubSub.count === 1 ? "" : "s"} from ${hub.title}`}
                  >
                    {hubSub.count}
                  </span>
                )}
                <span
                  className={cn(
                    "transition-colors duration-150",
                    isSelected ? "" : "text-muted-foreground group-hover:[color:var(--hub-accent)]"
                  )}
                  style={isSelected ? { color: solidAccent } : undefined}
                >
                  <HubIcon id={hubId} size={30} color="currentColor" />
                </span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
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
                  "group relative flex flex-col items-center justify-center gap-1.5 rounded-[18px] p-3 w-[30%] min-w-[92px] aspect-square abh-press",
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
                  <span
                    className="abh-badge-circle absolute -top-1.5 -right-1.5 min-w-[22px] text-[0.6rem] font-black shadow-md"
                    style={{ backgroundColor: solidAccent, color: onSolid }}
                    aria-label={`${hubSub.count} item${hubSub.count === 1 ? "" : "s"} from ${hub.title}`}
                  >
                    {hubSub.count}
                  </span>
                )}
                {hubBulk && (
                  <span
                    className="absolute top-1 left-1 flex items-center justify-center w-4 h-4 rounded-full"
                    style={{ backgroundColor: `color-mix(in srgb, ${accent} 15%, transparent)` }}
                    aria-hidden="true"
                  >
                    <Tag size={9} weight="fill" style={{ color: accent }} />
                  </span>
                )}

                <span
                  className={cn(
                    "flex items-center justify-center rounded-full transition-all duration-150",
                    !isSelected && "w-14 h-14 bg-black/[0.04] dark:bg-white/[0.07] group-hover:bg-[color-mix(in_srgb,var(--hub-accent)_12%,transparent)]"
                  )}
                >
                  <span
                    className={cn(
                      "transition-colors duration-150",
                      isSelected ? "" : "text-muted-foreground group-hover:[color:var(--hub-accent)]"
                    )}
                    style={isSelected ? { color: solidAccent } : undefined}
                  >
                    <HubIcon id={hubId} size={42} color="currentColor" />
                  </span>
                </span>

                <span
                  className={cn(
                    "text-[0.68rem] font-black text-center leading-tight transition-colors duration-150",
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
      )}

      {activeHub && openHub && (
        <div
          id={`hub-panel-${openHub}`}
          className={cn(
            "rounded-[14px] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 ease-out motion-reduce:animate-none",
            GLASS.section
          )}
        >
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-100 dark:border-white/10">
            <span className="text-[0.95rem] font-black" style={{ color: getAccent(openHub) }}>
              {activeHub.title}
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
              const anySectionOpen = openSections[hubId] != null
              const secSub = sectionSubtotal(hubId, section.title)
              const sectionBulk = sectionHasBulk(hubId, section.title, section.items)
              const sectionPanelId = `section-panel-${hubId}-${sIdx}`
              const isLastSection = sIdx === activeHub.sections.length - 1

              return (
                <div key={sIdx} className="relative">
                  {!isLastSection && (
                    <span
                      className="absolute left-3 top-5 bottom-0 w-0.5 pointer-events-none"
                      style={{ backgroundColor: `color-mix(in srgb, ${accent} 31%, transparent)` }}
                      aria-hidden="true"
                    />
                  )}

                  <div className="relative">
                    <button
                      onClick={() => toggleSection(hubId, sIdx)}
                      aria-expanded={isSectionOpen}
                      aria-controls={sectionPanelId}
                      className="w-full flex items-center justify-between pl-8 pr-3 py-2 min-h-[2.5rem] transition-colors duration-150 hover:bg-zinc-100/70 dark:hover:bg-white/5"
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "text-[0.78rem] font-black uppercase tracking-[0.15em] transition-colors duration-200",
                            isSectionOpen ? "px-2.5 py-1 rounded-full" : "px-0 py-1",
                            !isSectionOpen && !anySectionOpen && "text-muted-foreground dark:text-muted-foreground"
                          )}
                          style={
                            isSectionOpen
                              ? { backgroundColor: solidAccent, color: onSolid }
                              : anySectionOpen
                                ? { color: accent }
                                : undefined
                          }
                        >
                          {section.title}
                        </span>

                        {!isSectionOpen && sectionBulk && (
                          <span
                            className="flex items-center gap-0.5 text-[0.58rem] font-black px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: `color-mix(in srgb, ${accent} 10%, transparent)`, color: accent }}
                            aria-label="Bulk pricing available in this section"
                          >
                            <Tag size={9} weight="fill" aria-hidden="true" /> Bulk
                          </span>
                        )}

                        {!isSectionOpen && secSub && (
                          <span
                            className="flex items-center gap-0.5 text-[0.6rem] font-black px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: `color-mix(in srgb, ${accent} 10%, transparent)`, color: accent }}
                            aria-label={`${secSub.count} item${secSub.count === 1 ? "" : "s"} in cart from ${section.title}`}
                          >
                            <ShoppingBagOpen size={10} weight="fill" aria-hidden="true" />
                            {secSub.count}
                          </span>
                        )}
                      </span>
                      <CaretDown
                        size={12}
                        className="mr-1 transition-transform duration-200 ease-out motion-reduce:transition-none"
                        style={{ color: accent, transform: isSectionOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      />
                    </button>

                    <span
                      className="absolute left-3 top-0 h-5 w-0.5 pointer-events-none"
                      style={{ backgroundColor: `color-mix(in srgb, ${accent} 31%, transparent)` }}
                      aria-hidden="true"
                    />
                    <span
                      className="absolute left-3 top-5 -translate-y-1/2 w-2.5 h-0.5 pointer-events-none"
                      style={{ backgroundColor: `color-mix(in srgb, ${accent} 31%, transparent)` }}
                      aria-hidden="true"
                    />
                    <span
                      className="absolute left-[1.4rem] top-5 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                      style={{ backgroundColor: accent }}
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
                                  style={{ backgroundColor: `color-mix(in srgb, ${accent} 44%, transparent)` }}
                                  aria-hidden="true"
                                />
                              )}
                              <span
                                className="absolute left-3 top-0 h-[22px] w-0.5 pointer-events-none"
                                style={{ backgroundColor: `color-mix(in srgb, ${accent} 44%, transparent)` }}
                                aria-hidden="true"
                              />
                              <span
                                className="absolute left-3 top-[22px] -translate-y-1/2 w-2 h-0.5 pointer-events-none"
                                style={{ backgroundColor: `color-mix(in srgb, ${accent} 44%, transparent)` }}
                                aria-hidden="true"
                              />
                              <span
                                className="absolute left-[1.15rem] top-[22px] -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                                style={{ backgroundColor: accent }}
                                aria-hidden="true"
                              />

                              <div
                                className={cn("relative overflow-hidden ml-6 flex items-center gap-2 p-2 rounded-[10px] shadow-sm transition-colors duration-150", GLASS.item)}
                                style={{ backgroundColor: `color-mix(in srgb, ${accent} 3%, transparent)` }}
                              >
                                {hasBulk && (
                                  <span
                                    className="absolute -right-7 top-1.5 rotate-45 text-[0.55rem] font-black uppercase tracking-wider px-7 py-0.5"
                                    style={{ backgroundColor: solidAccent, color: onSolid }}
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
                                      className="flex items-center gap-0.5 text-[0.6rem] font-black px-1.5 py-0.5 rounded-full"
                                      style={{ backgroundColor: `color-mix(in srgb, ${accent} 10%, transparent)`, color: accent }}
                                      aria-label={`${itemQty} already in your quote`}
                                    >
                                      <ShoppingBagOpen size={10} weight="fill" aria-hidden="true" />
                                      {itemQty}
                                    </span>
                                  )}
                                  <button
                                    onClick={() => onAddItem(hubId, section.title, item.name, item.price)}
                                    className="abh-press w-7 h-7 rounded-full flex items-center justify-center shadow-sm"
                                    style={{ backgroundColor: solidAccent, color: onSolid }}
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
