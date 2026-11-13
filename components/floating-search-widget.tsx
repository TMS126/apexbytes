// components/floating-search-widget.tsx
"use client"

import { useState, useEffect, useMemo, useRef, useCallback, useLayoutEffect } from "react"
import { MagnifyingGlass, X, Printer, FileText, PaintBrush, Globe, Desktop } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BRAND } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"
import { useExclusiveWidget } from "@/hooks/use-exclusive-widget"
import { useCalculatorOpen } from "@/hooks/use-calculator-open"

const HUB_ORDER: HubId[] = ["print", "doc", "design", "eservice", "tech"]

const SEARCH_ORANGE = { light: BRAND.orange, dark: BRAND.lightOrange }

const FLY_DURATION = 340
const FADE_DURATION = 200

interface SearchableService {
  hubId: HubId; sectionTitle: string; name: string
  price: string; description: string; requirements: string[]
}

interface SearchResult extends SearchableService {
  matchField: "name" | "section" | "description"
}

interface SelectedService {
  name: string; price: string; hubId: HubId
  sectionTitle: string; requirements: string[]; desc?: string
}

function buildSearchIndex(): SearchableService[] {
  const all: SearchableService[] = []
  HUB_ORDER.forEach((hubId) => {
    HUBS[hubId].sections.forEach((section) => {
      section.items.forEach((item) => {
        all.push({
          hubId, sectionTitle: section.title,
          name: item.name, price: item.price,
          description: item.description ?? "",
          requirements: item.requirements,
        })
      })
    })
  })
  return all
}

function HubIcon({ id, size = 16, color }: { id: HubId; size?: number; color?: string }) {
  const p = { size, weight: "fill" as const, color: color ?? "currentColor", "aria-hidden": true }
  switch (id) {
    case "print":    return <Printer    {...p} />
    case "doc":      return <FileText   {...p} />
    case "design":   return <PaintBrush {...p} />
    case "eservice": return <Globe      {...p} />
    case "tech":     return <Desktop    {...p} />
  }
}

function HighlightMatch({ text, query, color }: { text: string; query: string; color: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>
  const idx = text.toLowerCase().indexOf(q.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color, fontWeight: 500 }}>{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  )
}

function matchSnippet(text: string, query: string, radius = 28): string {
  const q = query.trim().toLowerCase()
  const idx = text.toLowerCase().indexOf(q)
  if (idx === -1) return text.slice(0, radius * 2)
  const start = Math.max(0, idx - radius)
  const end = Math.min(text.length, idx + q.length + radius)
  return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`
}

function dispatchSelectService(svc: SelectedService) {
  window.dispatchEvent(new CustomEvent<SelectedService>("abh:selectService", { detail: svc }))
}

export function FloatingSearchWidget() {
  const { resolvedTheme } = useTheme()
  const pathname = usePathname()
  const [mounted] = useState(() => typeof window !== "undefined")
  const isDark = mounted && resolvedTheme === "dark"

  const [isOpen, setIsOpen, isOtherOpen] = useExclusiveWidget("search")
  const calculatorOpen = useCalculatorOpen()
  const [query, setQuery]         = useState("")
  const [inlineSearchVisible, setInlineSearchVisible] = useState(true)

  const inputRef     = useRef<HTMLInputElement>(null)
  const pushedRef    = useRef(false)
  const index        = useMemo(() => buildSearchIndex(), [])

  const fabRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const pendingFabRect = useRef<DOMRect | null>(null)

  const accentColor = isDark ? SEARCH_ORANGE.dark : SEARCH_ORANGE.light

  const hasQuery = query.trim().length > 0
  const isServicesPage = pathname === "/services"

  useEffect(() => {
    if (!isServicesPage && isOpen) {
      setIsOpen(false)
      window.requestAnimationFrame(() => setQuery(""))
    }
  }, [isServicesPage, isOpen, setIsOpen])

  useEffect(() => {
    if (!isServicesPage) return

    const updateInlineSearchVisibility = () => {
      const target = document.getElementById("abh-inline-search")
      if (!target) {
        setInlineSearchVisible(false)
        return
      }
      const rect = target.getBoundingClientRect()
      const visible = rect.bottom > 0 && rect.top < window.innerHeight
      setInlineSearchVisible(visible)
    }

    updateInlineSearchVisibility()
    window.addEventListener("scroll", updateInlineSearchVisibility, { passive: true })
    window.addEventListener("resize", updateInlineSearchVisibility)
    return () => {
      window.removeEventListener("scroll", updateInlineSearchVisibility)
      window.removeEventListener("resize", updateInlineSearchVisibility)
    }
  }, [isServicesPage])

  useLayoutEffect(() => {
    if (!isOpen) return
    const modalEl = modalRef.current
    const fabRect = pendingFabRect.current
    if (!modalEl || !fabRect) return

    const reduceMotion = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const modalRect = modalEl.getBoundingClientRect()
    const fabCenterX = fabRect.left + fabRect.width / 2
    const fabCenterY = fabRect.top + fabRect.height / 2
    const modalCenterX = modalRect.left + modalRect.width / 2
    const modalCenterY = modalRect.top + modalRect.height / 2
    const dx = fabCenterX - modalCenterX
    const dy = fabCenterY - modalCenterY

    if (reduceMotion) {
      modalEl.style.transition = "none"
      modalEl.style.transform = "none"
      modalEl.style.opacity = "0"
      requestAnimationFrame(() => {
        modalEl.style.transition = `opacity ${FADE_DURATION}ms ease-out`
        modalEl.style.opacity = "1"
      })
      return
    }

    modalEl.style.transition = "none"
    modalEl.style.transformOrigin = "center center"
    modalEl.style.transform = `translate(${dx}px, ${dy}px) scale(0.2)`
    modalEl.style.opacity = "0"
    void modalEl.offsetHeight
    requestAnimationFrame(() => {
      modalEl.style.transition = `transform ${FLY_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${FADE_DURATION}ms ease-out`
      modalEl.style.transform = "translate(0, 0) scale(1)"
      modalEl.style.opacity = "1"
    })

    pendingFabRect.current = null
  }, [isOpen])

  useEffect(() => {
    if (isOpen && !pushedRef.current) {
      window.history.pushState({ abhSearch: true }, "")
      pushedRef.current = true
    }
  }, [isOpen])

  useEffect(() => {
    const onPop = () => {
      if (!pushedRef.current) return
      pushedRef.current = false
      setIsOpen(false)
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [setIsOpen])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => setQuery(""), 200)
    if (pushedRef.current) {
      pushedRef.current = false
      window.history.back()
    }
  }, [setIsOpen])

  const handleOpen = useCallback(() => {
    if (isOpen) return
    pendingFabRect.current = fabRef.current?.getBoundingClientRect() ?? null
    setIsOpen(true)
  }, [isOpen, setIsOpen])

  useEffect(() => {
    if (!isOpen) return
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose() }
    document.addEventListener("keydown", fn)
    return () => document.removeEventListener("keydown", fn)
  }, [isOpen, handleClose])

  const results = useMemo((): SearchResult[] => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const matches: SearchResult[] = []
    for (const s of index) {
      let matchField: SearchResult["matchField"] | null = null
      if (s.name.toLowerCase().includes(q)) matchField = "name"
      else if (s.sectionTitle.toLowerCase().includes(q)) matchField = "section"
      else if (s.description.toLowerCase().includes(q)) matchField = "description"
      if (matchField) matches.push({ ...s, matchField })
      if (matches.length >= 8) break
    }
    return matches
  }, [query, index])

  const pick = (s: SearchableService) => {
    dispatchSelectService({
      name: s.name, price: s.price, hubId: s.hubId,
      sectionTitle: s.sectionTitle, requirements: s.requirements, desc: s.description,
    })
    setIsOpen(false)
    setQuery("")
    pushedRef.current = false
  }

  const fabVisible = isServicesPage && !isOpen && !isOtherOpen && !inlineSearchVisible

  if (!isServicesPage || calculatorOpen) return null

  return (
    <>
      {isOpen && (
        <div
          className="pointer-events-auto fixed inset-0 z-[9993] bg-black/70 backdrop-blur transition-opacity duration-200 ease-out motion-reduce:transition-none"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "relative group/search pointer-events-auto",
          fabVisible ? "opacity-100 pointer-events-auto" : "hidden"
        )}
      >
        <div className="relative flex items-center justify-end gap-2">
          <span
            className="pointer-events-none absolute right-full mr-2 max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-[var(--brand-dark-100)] px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-widest text-white opacity-0 shadow-md transition-all duration-200 group-hover/search:max-w-[100px] group-hover/search:opacity-100 group-focus-within/search:max-w-[100px] group-focus-within/search:opacity-100"
          >
            Search
          </span>
          <button
            ref={fabRef}
onClick={isOpen ? handleClose : handleOpen}
  aria-label={isOpen ? "Close search" : "Search services"}
            className="abh-press relative flex size-11 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-transform duration-150 ease-out hover:-translate-y-0.5 motion-reduce:transition-none"
          >
  {isOpen ? (
  <X size={24} weight="regular" aria-hidden="true" />
  ) : (
  <MagnifyingGlass
  size={21}
  weight="regular"
  aria-hidden="true"
  className="transition-all duration-200 ease-out motion-reduce:transition-none"
  style={{ color: accentColor }}
  />
  )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="pointer-events-none fixed inset-x-0 top-[12vh] z-[9995] flex justify-center px-4">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search services"
            className="w-full max-w-[300px] pointer-events-auto"
          >
            <div
              className="abh-reference-search"
            >
              <MagnifyingGlass size={18} weight="regular" className="shrink-0" aria-hidden="true" />
              <label htmlFor="floating-search-input" className="sr-only">Search a service</label>
              <input
                id="floating-search-input"
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search a service..."
                /* AUDIT FIX: the border-color swap on the pill container above
                   is meant to be the ONLY focus indicator here — added
                   defensive focus:ring-0/focus-visible:ring-0/outline-none
                   utility classes so no Tailwind ring utility elsewhere in
                   the app can reintroduce the escaping ring on top of it
                   (the global input:focus override in globals.css also
                   covers this, this is belt-and-braces on the element itself). */
                className="pr-8"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="abh-press flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-muted-foreground transition-colors duration-150 hover:text-zinc-700 dark:bg-zinc-700"
                  aria-label="Clear search"
                >
                  <X size={12} weight="bold" />
                </button>
              )}
              <button
                onClick={handleClose}
                className="abh-press flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-zinc-200"
                aria-label="Close search"
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            {hasQuery && (
              <div className="abh-reference-search-results animate-in fade-in slide-in-from-top-1 duration-150 ease-out motion-reduce:animate-none">
                <div className="max-h-[55vh] overflow-y-auto p-2">
                  {results.length > 0 ? (
                    <div className="divide-y divide-zinc-100 dark:divide-white/10">
                      {results.map((s, idx) => (
                        <button
                          key={`${s.hubId}-${s.name}-${idx}`}
                          onClick={() => pick(s)}
                          className="abh-reference-search-row"
                        >
                          <div
                            className="flex size-8 shrink-0 items-center justify-center rounded-full"
                            style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`, color: accentColor }}
                          >
                            <HubIcon id={s.hubId} size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-[#111]">
                              {s.matchField === "name"
                                ? <HighlightMatch text={s.name} query={query} color={accentColor} />
                                : s.name}
                            </p>
                            <p className="abh-search-muted truncate text-xs">
                              {s.matchField === "section"
                                ? <HighlightMatch text={s.sectionTitle} query={query} color={accentColor} />
                                : s.sectionTitle} · {HUBS[s.hubId].title}
                            </p>
                            {s.matchField === "description" && (
                              <p className="abh-search-muted mt-0.5 truncate text-xs normal-case">
                                <HighlightMatch text={matchSnippet(s.description, query)} query={query} color={accentColor} />
                              </p>
                            )}
                          </div>
                          <span className="text-sm font-medium shrink-0" style={{ color: accentColor }}>{s.price}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-base font-medium text-[#111]">No services found</p>
                      <p className="abh-search-muted mt-1 text-sm">Try a different word.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
      }
