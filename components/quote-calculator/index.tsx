// components/quote-calculator/index.tsx
"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { HUB_COLORS, HubKey, BIZ, waLink } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"
import { useExclusiveWidget } from "@/hooks/use-exclusive-widget"
import { useScrollHide } from "@/hooks/use-scroll-hide"
import { GLASS, HOME_BLUE } from "./shared"
import {
  CartItem, SavedQuote, STORAGE_KEY, STORAGE_KEY_SAVED,
  getDisplayName, getEffectiveRate, parsePrice, quoteTotals,
} from "./lib"
import { HubBrowser } from "./hub-browser"
import { exportQuotePdf } from "./pdf-export"
import { announceCalculatorState } from "@/hooks/use-calculator-open"
import { FabTrigger } from "./fab-trigger"
import { PanelHeader } from "./panel-header"
import { CartSummaryBar } from "./cart-summary-bar"
import { SavedQuotesPanel } from "./saved-quotes-panel"
import { FooterActions } from "./footer-actions"

const VIEW_KEY = "apexbytes-quote-view"

export function QuoteCalculatorWidget() {
  const { resolvedTheme, setTheme } = useTheme(); const isDark = resolvedTheme === "dark"
  const [isOpen, setIsOpen, isOtherOpen] = useExclusiveWidget("calculator")
  const isScrolling = useScrollHide()
  const fabVisible = !isOpen && !isOtherOpen

  const [openHub, setOpenHub] = useState<HubId | null>(null)
  const [openSections, setOpenSections] = useState<Record<HubId, number | null>>({} as Record<HubId, number | null>)
  const [cart, setCart] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  const [highlightId, setHighlightId] = useState<string | null>(null)
  const chipRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [announce, setAnnounce] = useState("")

  const [undoStack, setUndoStack] = useState<{ item: CartItem; index: number } | null>(null)
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([])
  const [savedHydrated, setSavedHydrated] = useState(false)
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [saveNameDraft, setSaveNameDraft] = useState("")
  const [showSavedList, setShowSavedList] = useState(false)

  const [miniExpanded, setMiniExpanded] = useState(false)

  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])
  const clockLabel = now ? now.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" }) : ""

  const [expandView, setExpandView] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { if (localStorage.getItem(VIEW_KEY) === "expanded") setExpandView(true) } catch {}
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  useEffect(() => {
    try { localStorage.setItem(VIEW_KEY, expandView ? "expanded" : "compact") } catch {}
  }, [expandView])

  const pressState = useRef<Record<string, { timeout?: ReturnType<typeof setTimeout>; interval?: ReturnType<typeof setInterval>; longPressed?: boolean }>>({})

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { const s = localStorage.getItem(STORAGE_KEY); if (s) setCart(JSON.parse(s)) } catch {}
      setHydrated(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)) } catch {}
  }, [cart, hydrated])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { const s = localStorage.getItem(STORAGE_KEY_SAVED); if (s) setSavedQuotes(JSON.parse(s)) } catch {}
      setSavedHydrated(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  useEffect(() => {
    if (!savedHydrated) return
    try { localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedQuotes)) } catch {}
  }, [savedQuotes, savedHydrated])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    announceCalculatorState(isOpen)
    return () => { document.body.style.overflow = ""; announceCalculatorState(false) }
  }, [isOpen])

  const toggleCalculatorTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
    document.documentElement.classList.add("abh-theme-switching")
    window.setTimeout(() => document.documentElement.classList.remove("abh-theme-switching"), 350)
    setTheme(nextTheme)
  }

  const wasOpenRef = useRef(false)
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) window.history.pushState({ abhCalc: true }, "")
    wasOpenRef.current = isOpen
  }, [isOpen])

  useEffect(() => {
    const onPop = () => { if (isOpen) setIsOpen(false) }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [isOpen, setIsOpen])

  useEffect(() => {
    if (!(isOpen || cart.length === 0)) return
    const frame = requestAnimationFrame(() => setMiniExpanded(false))
    return () => cancelAnimationFrame(frame)
  }, [isOpen, cart.length])

  useEffect(() => {
    if (!highlightId) return
    const id = highlightId
    let raf2: number | undefined
    const tryScroll = () => {
      const el = chipRefs.current[id]
      if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
      else raf2 = requestAnimationFrame(tryScroll)
    }
    const raf1 = requestAnimationFrame(tryScroll)
    const clearT = setTimeout(() => setHighlightId(null), 900)
    return () => { cancelAnimationFrame(raf1); if (raf2 !== undefined) cancelAnimationFrame(raf2); clearTimeout(clearT) }
  }, [highlightId])

  useEffect(() => {
    const snapshot = pressState.current
    return () => {
      Object.values(snapshot).forEach(s => { if (s.timeout) clearTimeout(s.timeout); if (s.interval) clearInterval(s.interval) })
    }
  }, [])

  const getAccent = (id: HubId) => { const c = HUB_COLORS[id as HubKey]; return isDark ? c.accentDark : c.accentLight }
  const getSolid  = (id: HubId) => HUB_COLORS[id as HubKey].accentLight
  const titleAccent = isDark ? HUB_COLORS.design.accentDark : HUB_COLORS.design.accentLight
  const fabColor     = isDark ? HOME_BLUE.dark : HOME_BLUE.light
  // AUDIT FIX: was `useMemo(() => getReadableTextColor(fabColor), [fabColor])`
  // — fabColor is "var(--brand-blue)" / "var(--brand-light-blue)", a CSS
  // var() string, not a hex value, so the contrast calc was meaningless.
  // --home-cta-text already exists as the correct, theme-reactive on-color
  // for this exact fill (--home-cta-bg / --primary-fill lineage), so just
  // use it directly — no runtime computation needed.
  const fabTextColor = "var(--home-cta-text)"

  const hubsInCart = useMemo(() => Array.from(new Set(cart.map(i => i.hubId))), [cart])

  const addItem = useCallback((hubId: HubId, sectionTitle: string, name: string, price: string) => {
    const { amount, unit } = parsePrice(price)
    const id = `${hubId}-${sectionTitle}-${name}`
    let nextQty = 1
    setCart(prev => {
      const ex = prev.find(i => i.id === id)
      if (ex) { nextQty = ex.qty + 1; return prev.map(i => i.id === id ? { ...i, qty: nextQty } : i) }
      return [...prev, { id, hubId, sectionTitle, name, unitPrice: amount, unit, qty: 1 }]
    })
    setHighlightId(id)
    setAnnounce(`${getDisplayName(sectionTitle, name)} added — now ${nextQty} in your quote`)
  }, [])

  const removeItem = (id: string) => {
    const index = cart.findIndex(i => i.id === id)
    if (index === -1) return
    const item = cart[index]
    setCart(prev => prev.filter(i => i.id !== id))
    setUndoStack({ item, index })
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    undoTimerRef.current = setTimeout(() => setUndoStack(null), 6000)
  }

  const undoRemove = () => {
    if (!undoStack) return
    setCart(prev => { const next = [...prev]; next.splice(Math.min(undoStack.index, next.length), 0, undoStack.item); return next })
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    setUndoStack(null)
  }

  const stepQty = useCallback((id: string, delta: number) => {
    const item = cart.find(i => i.id === id)
    if (!item) return
    const newQty = (item.qty || 1) + delta
    if (newQty < 1) {
      const index = cart.findIndex(i => i.id === id)
      setCart(prev => prev.filter(i => i.id !== id))
      setUndoStack({ item, index })
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
      undoTimerRef.current = setTimeout(() => setUndoStack(null), 6000)
      return
    }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: newQty } : i))
  }, [cart])

  useEffect(() => {
    const handler = (e: Event) => { const { hubId, sectionTitle, name, price } = (e as CustomEvent).detail; addItem(hubId, sectionTitle, name, price) }
    window.addEventListener("abh:add-to-quote", handler)
    return () => window.removeEventListener("abh:add-to-quote", handler)
  }, [addItem])

  useEffect(() => {
    const handler = (e: Event) => { const { hubId, sectionTitle, name } = (e as CustomEvent).detail; stepQty(`${hubId}-${sectionTitle}-${name}`, -1) }
    window.addEventListener("abh:remove-from-quote", handler)
    return () => window.removeEventListener("abh:remove-from-quote", handler)
  }, [stepQty])

  useEffect(() => {
    const handler = (e: Event) => { const { id, delta } = (e as CustomEvent).detail; stepQty(id, delta) }
    window.addEventListener("abh:step-quote-qty", handler)
    return () => window.removeEventListener("abh:step-quote-qty", handler)
  }, [stepQty])

  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener("abh:open-quote-calculator", handler)
    return () => window.removeEventListener("abh:open-quote-calculator", handler)
  }, [setIsOpen])

  const HOLD_DELAY = 420
  const REPEAT_MS  = 90
  const clearPress = (id: string) => {
    const s = pressState.current[id]
    if (s?.timeout) clearTimeout(s.timeout)
    if (s?.interval) clearInterval(s.interval)
    if (s) { s.timeout = undefined; s.interval = undefined }
  }
  const handlePressStart = (id: string, delta: number) => {
    clearPress(id)
    pressState.current[id] = { longPressed: false }
    pressState.current[id].timeout = setTimeout(() => {
      pressState.current[id].longPressed = true
      stepQty(id, delta)
      pressState.current[id].interval = setInterval(() => stepQty(id, delta), REPEAT_MS)
    }, HOLD_DELAY)
  }
  const handlePressEnd = (id: string) => clearPress(id)
  const handleClickStep = (id: string, delta: number) => {
    const s = pressState.current[id]
    if (s?.longPressed) { s.longPressed = false; return }
    stepQty(id, delta)
  }

  const clearCart = () => setCart([])

  const { total, savings: totalSavings, count: itemCount } = useMemo(() => quoteTotals(cart), [cart])
  const hubSubtotal = (hubId: HubId) => { const items = cart.filter(i => i.hubId === hubId); return items.length === 0 ? null : quoteTotals(items) }
  const sectionSubtotal = (hubId: HubId, sectionTitle: string) => { const items = cart.filter(i => i.hubId === hubId && i.sectionTitle === sectionTitle); return items.length === 0 ? null : quoteTotals(items) }
  const getItemQty = (id: string) => cart.find(i => i.id === id)?.qty ?? 0

  const buildQuoteMessage = (items: CartItem[]) => {
    const t = quoteTotals(items)
    let msg = `Hi ${BIZ.name}! I'd like a quote for:\n\n`
    items.forEach(item => {
      const qty = item.qty || 1
      const effRate = getEffectiveRate(item.id, item.name, qty, item.unitPrice)
      const qtyLabel = item.unit ? `${qty} ${item.unit}${qty > 1 ? "s" : ""}` : `x${qty}`
      const label = `${getDisplayName(item.sectionTitle, item.name)} - ${item.sectionTitle} (${HUBS[item.hubId].title})`
      msg += `• ${label} — ${qtyLabel} @ R${effRate} = R${effRate * qty}\n`
    })
    msg += `\nTotal: R${t.total}`
    if (t.savings > 0) msg += ` (saved R${t.savings} with bulk pricing)`
    return msg
  }

  const sendQuote = () => window.open(waLink(buildQuoteMessage(cart)), "_blank")
  const toggleSection = (hubId: HubId, sIdx: number) => setOpenSections(prev => ({ ...prev, [hubId]: prev[hubId] === sIdx ? null : sIdx }))

  const confirmSaveQuote = () => {
    if (cart.length === 0) return
    const name = saveNameDraft.trim() || `Quote — ${new Date().toLocaleDateString()}`
    setSavedQuotes(prev => [{ id: `q-${Date.now()}`, name, savedAt: Date.now(), items: cart }, ...prev])
    setSaveNameDraft(""); setShowSaveForm(false)
  }
  const loadSavedQuote = (q: SavedQuote) => { setCart(q.items); setShowSavedList(false) }
  const deleteSavedQuote = (id: string) => setSavedQuotes(prev => prev.filter(q => q.id !== id))

  return (
    <>
      <span className="sr-only" role="status" aria-live="polite">{announce}</span>

      <style>{`
        @keyframes abh-calc-slide-up {
          0% { opacity: 0; transform: translateY(28px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .abh-calc-anim {
          animation: abh-calc-slide-up 260ms cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: bottom center;
        }
        @media (min-width: 768px) {
          .abh-calc-anim { animation: abh-calc-grow 280ms cubic-bezier(0.16, 1, 0.3, 1); }
        }
        @media (prefers-reduced-motion: reduce) { .abh-calc-anim { animation: none; } }
      `}</style>

      {isOpen && (
        <div className="fixed inset-0 z-[9989] bg-black/70 backdrop-blur transition-opacity duration-200 ease-out motion-reduce:transition-none md:backdrop-blur-none" onClick={() => setIsOpen(false)} aria-hidden="true" />
      )}

      <FabTrigger
        visible={fabVisible}
        dimmed={isScrolling}
        miniExpanded={miniExpanded}
        hubsInCart={hubsInCart}
        total={total}
        itemCount={itemCount}
        fabColor={fabColor}
        getAccent={getAccent}
        onOpen={() => setIsOpen(true)}
        onToggleMini={() => setMiniExpanded(v => !v)}
      />

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quotation Calculator"
          className={cn(
            "fixed inset-0 md:inset-auto md:bottom-24 md:right-5 left-auto z-[9991]",
            "w-full h-full md:h-auto md:w-[500px] md:max-w-[calc(100vw-1.5rem)] md:max-h-[75vh]",
            "rounded-none md:rounded-[14px] shadow-2xl flex flex-col overflow-hidden",
            "transform-gpu will-change-transform abh-calc-anim",
            GLASS.panel,
            "md:backdrop-blur-none"
          )}
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
        >
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-white/20 to-transparent pointer-events-none" />

          <PanelHeader clockLabel={clockLabel} isDark={isDark} onToggleTheme={toggleCalculatorTheme} hasItems={cart.length > 0} titleAccent={titleAccent} />

          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0" style={{ WebkitOverflowScrolling: "touch" }}>
            <CartSummaryBar
              isDark={isDark}
              fabColor={fabColor}
              fabTextColor={fabTextColor}
              itemCount={itemCount}
              total={total}
              cart={cart}
              expandView={expandView}
              setExpandView={setExpandView}
              showSaveForm={showSaveForm}
              setShowSaveForm={setShowSaveForm}
              saveNameDraft={saveNameDraft}
              setSaveNameDraft={setSaveNameDraft}
              confirmSaveQuote={confirmSaveQuote}
              clearCart={clearCart}
              undoStack={undoStack}
              undoRemove={undoRemove}
              highlightId={highlightId}
              chipRefs={chipRefs}
              getAccent={getAccent}
              removeItem={removeItem}
              handleClickStep={handleClickStep}
              handlePressStart={handlePressStart}
              handlePressEnd={handlePressEnd}
            />

            <SavedQuotesPanel
              savedQuotes={savedQuotes}
              showSavedList={showSavedList}
              setShowSavedList={setShowSavedList}
              fabColor={fabColor}
              fabTextColor={fabTextColor}
              onLoad={loadSavedQuote}
              onDelete={deleteSavedQuote}
            />

            <HubBrowser
              openHub={openHub}
              setOpenHub={setOpenHub}
              openSections={openSections}
              toggleSection={toggleSection}
              getAccent={getAccent}
              getSolid={getSolid}
              hubSubtotal={hubSubtotal}
              sectionSubtotal={sectionSubtotal}
              getItemQty={getItemQty}
              onAddItem={addItem}
            />
          </div>

          <FooterActions
            hasItems={cart.length > 0}
            totalSavings={totalSavings}
            total={total}
            fabColor={fabColor}
            onExportPdf={() => exportQuotePdf(cart)}
            onSendQuote={sendQuote}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </>
  )
            } 
