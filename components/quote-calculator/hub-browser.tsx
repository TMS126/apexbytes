// components/quote-calculator/hub-browser.tsx
"use client"

/* ============================================================
   AUDIT PASS (this edit):
   - Hub-specific accent color (one of the 5 per-hub hues) was
     showing permanently in several spots that had no hover or
     selected-state logic backing them: the CaretDown icon, the
     section title once ANY sibling section was open, the
     section-level bulk/count pills, and the connecting tree
     lines. None of those are "hover" or "selected" states — they
     were just always tinted. All switched to a neutral default;
     hub color now only appears via :hover / group-hover, or in
     the two states that legitimately mean "this is the active
     one" (an open hub tile, an open section pill) — matching the
     hub-tile row, which already had this right.
   - Purely decorative, cross-hub accents (the small "bulk
     available" tag icon on a hub tile, the per-item "Bulk"
     ribbon) switched from hub-accent to seal orange
     (var(--brand-orange) / var(--on-brand-orange)) — these
     aren't tied to any one hub's identity, so they now use the
     site's one shared accent color instead, applied minimally
     (small icon + small ribbon only), same way the rest of the
     site uses it.
   - Connecting tree lines (the thin hub→section→item guide
     lines) were tinted with the hub accent at all times — purely
     decorative, not a hover/selected state — so they're now a
     flat neutral border tone instead.
   - Add "+" button: was solidAccent (hub color) at all times.
     Now neutral at rest, hub accent only on hover/focus — done
     via CSS custom properties + Tailwind arbitrary hover
     selectors so no extra JS state is needed.
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
        // Compact icon row — already correct: neutral by default, hub
        // color only on hover (group-hover), solid only while selected.
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
                  // AUDIT: was hub-accent-tinted; switched to seal orange —
                  // "bulk available" is a cross-hub feature flag, not part
                  // of any one hub's own identity color.
                  <span
                    className="absolute top-1 left-1 flex items-center justify-center w-4 h-4 rounded-full"
                    style={{ backgroundColor: "color-mix(in srgb, var(--brand-orange) 15%, transparent)" }}
                    aria-hidden="true"
                  >
                    <Tag size={9} weight="fill" style={{ color: "var(--brand-orange)" }} />
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

      {/* Expanded content for whichever hub is selected */}
      {activeHub && openHub && (
        <div
          id={`hub-panel-${openHub}`}
          className={cn(
            "rounded-[14px] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 ease-out motion-reduce:animate-none",
            GLASS.section
          )}
        >
          {/* Panel header: the open hub's name is a legitimate "this is the
              active one" state (not decoration), so it keeps its hub
              color — same logic as the selected hub tile above. A small
              seal-orange tick sits next to it, mirroring the thin orange
              dividers used elsewhere on the site, so the shared accent
              still shows up here in a minimal way. */}
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
                    // AUDIT: was color-mix(accent) — a permanent hub tint
                    // on a purely decorative guide line. Neutral border
                    // tone now; nothing here is a hover or selected state.
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
                          // AUDIT: was hub-accent-tinted; seal orange now —
                          // same reasoning as the hub-tile bulk tag above.
                          <span
                            className="flex items-center gap-0.5 text-[0.58rem] font-black px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: "color-mix(in srgb, var(--brand-orange) 12%, transparent)", color: "var(--brand-orange-text)" }}
                            aria-label="Bulk pricing available in this section"
                          >
                            <Tag size={9} weight="fill" aria-hidden="true" /> Bulk
                          </span>
                        )}

                        {!isSectionOpen && secSub && (
                          // AUDIT: was hub-accent-tinted at all times.
                          // Neutral by default; hub color only while
                          // hovering this row (group-hover).
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
                                  // AUDIT: was hub-accent-tinted; seal
                                  // orange ribbon now — a generic "bulk"
                                  // flag, same as the tag icon/pill above.
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
                                    // AUDIT: was hub-accent-tinted at all
                                    // times. Neutral by default; hub color
                                    // only while hovering this item row.
                                    <span
                                      className="flex items-center gap-0.5 text-[0.6rem] font-black px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground transition-colors duration-150 group-hover:[color:var(--hub-accent)]"
                                      aria-label={`${itemQty} already in your quote`}
                                    >
                                      <ShoppingBagOpen size={10} weight="fill" aria-hidden="true" />
                                      {itemQty}
                                    </span>
                                  )}
                                  {/* AUDIT: was solidAccent at all times —
                                      hub color now only shows on
                                      hover/focus; neutral otherwise. */}
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
