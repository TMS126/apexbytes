// components/quote-calculator/index.tsx
"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { HUB_COLORS, HubKey, BIZ, waLink } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"
import { useExclusiveWidget } from "@/hooks/use-exclusive-widget"
import { useScrollHide } from "@/hooks/use-scroll-hide"
import { useMounted } from "@/hooks/use-mounted"
import { GLASS, HOME_BLUE } from "./shared"
import {
  CartItem, SavedQuote, STORAGE_KEY, STORAGE_KEY_SAVED, HUB_ORDER,
  getDisplayName, getEffectiveRate, parsePrice, quoteTotals, normalizeCartItems,
} from "./lib"
import { HubBrowser } from "./hub-browser"
import { exportQuotePdf } from "./pdf-export"
import { announceCalculatorState } from "@/hooks/use-calculator-open"
import { FabTrigger } from "./fab-trigger"
import { PanelHeader } from "./panel-header"
import { CartSummaryBar } from "./cart-summary-bar"
import { SavedQuotesPanel } from "./saved-quotes-panel"
import { FooterActions } from "./footer-actions"
import { useFocusTrap } from "@/components/services-page/shared"

type UndoAction =
  | { kind: "remove"; item: CartItem; index: number }
  | { kind: "clear"; items: CartItem[] }
  | { kind: "saved"; quote: SavedQuote; index: number }

export function QuoteCalculatorWidget({ embedded = false }: { embedded?: boolean } = {}) {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()
  const isDark = mounted && resolvedTheme === "dark"
  const [isOpenState, setIsOpenState, isOtherOpen] = useExclusiveWidget("calculator")
  const isOpen = embedded || isOpenState
  const setIsOpen = useMemo(() => embedded ? (() => {}) : setIsOpenState, [embedded, setIsOpenState])
  const isScrolling = useScrollHide()
  const fabVisible = !embedded && !isOpen && !isOtherOpen

  const [openHub, setOpenHub] = useState<HubId | null>(null)
  const [openSections, setOpenSections] = useState<Record<HubId, number | null>>({} as Record<HubId, number | null>)
  const [cart, setCart] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  const [highlightId, setHighlightId] = useState<string | null>(null)
  const chipRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [announce, setAnnounce] = useState("")
  const calculatorRef = useRef<HTMLDivElement | null>(null)
  useFocusTrap(!embedded && isOpen, calculatorRef)

  const [undoStack, setUndoStack] = useState<UndoAction | null>(null)
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([])
  const [savedHydrated, setSavedHydrated] = useState(false)
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [saveNameDraft, setSaveNameDraft] = useState("")
  const [showSavedList, setShowSavedList] = useState(false)

  const [miniExpanded, setMiniExpanded] = useState(false)
  const hubSwipeStart = useRef<{ x: number; y: number } | null>(null)

  const pressState = useRef<Record<string, { timeout?: ReturnType<typeof setTimeout>; interval?: ReturnType<typeof setInterval>; longPressed?: boolean }>>({})

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { const s = localStorage.getItem(STORAGE_KEY); if (s) setCart(normalizeCartItems(JSON.parse(s))) } catch {}
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
    document.body.style.overflow = !embedded && isOpen ? "hidden" : ""
    if (!embedded) announceCalculatorState(isOpen)
    return () => { document.body.style.overflow = ""; if (!embedded) announceCalculatorState(false) }
  }, [embedded, isOpen])

  const wasOpenRef = useRef(false)
  useEffect(() => {
    if (!embedded && isOpen && !wasOpenRef.current) window.history.pushState({ abhCalc: true }, "")
    wasOpenRef.current = isOpen
  }, [embedded, isOpen])

  useEffect(() => {
    const onPop = () => { if (isOpen && !embedded) setIsOpen(false) }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [embedded, isOpen, setIsOpen])

  useEffect(() => {
    if (!isOpen || embedded) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setIsOpen(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [embedded, isOpen, setIsOpen])

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

  const removeItem = useCallback((id: string) => {
    const index = cart.findIndex(i => i.id === id)
    if (index === -1) return
    const item = cart[index]
    setCart(prev => prev.filter(i => i.id !== id))
    setUndoStack({ kind: "remove", item, index })
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    undoTimerRef.current = setTimeout(() => setUndoStack(null), 6000)
  }, [cart])

  const undoRemove = () => {
    if (!undoStack) return
    if (undoStack.kind === "remove") {
      setCart(prev => { const next = [...prev]; next.splice(Math.min(undoStack.index, next.length), 0, undoStack.item); return next })
    } else if (undoStack.kind === "clear") {
      setCart(undoStack.items)
    } else {
      setSavedQuotes(prev => { const next = [...prev]; next.splice(Math.min(undoStack.index, next.length), 0, undoStack.quote); return next })
    }
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
      setUndoStack({ kind: "remove", item, index })
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

  const clearCart = () => {
    if (cart.length === 0) return
    setUndoStack({ kind: "clear", items: cart })
    setCart([])
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    undoTimerRef.current = setTimeout(() => setUndoStack(null), 6000)
  }

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

  const sendQuote = () => {
    const handoff = window.open(waLink(buildQuoteMessage(cart)), "_blank", "noopener,noreferrer")
    setAnnounce(handoff ? "WhatsApp opened with your quote ready to send." : "WhatsApp was blocked. Allow pop-ups or copy the quote and contact us directly.")
  }
  const exportPdf = async (mode: "download" | "view") => {
    const successful = await exportQuotePdf(cart, mode)
    setAnnounce(successful
      ? mode === "view" ? "Quote preview opened in a new tab." : "Quote PDF downloaded."
      : mode === "view" ? "Quote preview could not open. Allow pop-ups and try again." : "Quote PDF could not be created. Please try again.")
  }
  const setQty = useCallback((id: string, qty: number) => {
    if (qty < 1) { removeItem(id); return }
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item))
  }, [removeItem])
  const toggleSection = (hubId: HubId, sIdx: number) => setOpenSections(prev => ({ ...prev, [hubId]: prev[hubId] === sIdx ? null : sIdx }))
  const handleBodyTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!openHub || (event.target as HTMLElement).closest("[data-calculator-cart-area], input, textarea, [data-calculator-swipe-block]")) {
      hubSwipeStart.current = null
      return
    }
    const touch = event.touches[0]
    hubSwipeStart.current = { x: touch.clientX, y: touch.clientY }
  }
  const handleBodyTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = hubSwipeStart.current
    hubSwipeStart.current = null
    if (!openHub || !start || (event.target as HTMLElement).closest("[data-calculator-cart-area], input, textarea, [data-calculator-swipe-block]")) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    if (Math.abs(dx) < 52 || Math.abs(dx) < Math.abs(dy) * 1.35) return
    const currentIndex = HUB_ORDER.indexOf(openHub)
    if (currentIndex < 0) return
    const nextIndex = dx < 0 ? (currentIndex + 1) % HUB_ORDER.length : (currentIndex - 1 + HUB_ORDER.length) % HUB_ORDER.length
    setOpenHub(HUB_ORDER[nextIndex])
  }

  const confirmSaveQuote = () => {
    if (cart.length === 0) return
    const name = saveNameDraft.trim() || `Quote — ${new Date().toLocaleDateString()}`
    setSavedQuotes(prev => [{ id: `q-${Date.now()}`, name, savedAt: Date.now(), items: cart }, ...prev])
    setSaveNameDraft(""); setShowSaveForm(false)
  }
  const loadSavedQuote = (q: SavedQuote) => { setCart(q.items); setShowSavedList(false) }
  const deleteSavedQuote = (id: string) => {
    const index = savedQuotes.findIndex(q => q.id === id)
    if (index === -1) return
    const quote = savedQuotes[index]
    setSavedQuotes(prev => prev.filter(q => q.id !== id))
    setUndoStack({ kind: "saved", quote, index })
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    undoTimerRef.current = setTimeout(() => setUndoStack(null), 6000)
  }

  return (
    <>
      <span className="sr-only" role="status" aria-live="polite">{announce}</span>

      {!embedded && isOpen && (
        <div className="pointer-events-auto fixed inset-0 z-[9993] bg-black/70  transition-opacity duration-200 ease-out motion-reduce:transition-none md:-none" onClick={() => setIsOpen(false)} aria-hidden="true" />
      )}

      {!embedded && cart.length > 0 && (
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
      )}

      {isOpen && (
        <div
          ref={calculatorRef}
          role="dialog"
          aria-modal="true"
          aria-label="Quotation Calculator"
          className={cn(
            embedded
              ? "abh-quote-calculator relative mx-auto min-h-[680px] w-full max-w-[1440px] rounded-[14px] flex flex-col overflow-hidden"
              : "pointer-events-auto fixed inset-0 left-auto z-[9995] md:inset-auto md:bottom-24 md:right-5 abh-quote-calculator w-full h-full md:w-[min(600px,calc(100vw-2rem))] md:max-w-[calc(100vw-2rem)] md:max-h-[82vh] rounded-none md:rounded-[14px] flex flex-col overflow-hidden",
            "transform-gpu will-change-transform abh-calc-anim",
            embedded ? "border-0 bg-background shadow-none" : GLASS.panel,
            embedded ? "" : "md:-none"
          )}
        >
          <PanelHeader hasItems={cart.length > 0} titleAccent={titleAccent} embedded={embedded} />

          <div
            className={cn(
              "flex-1 min-h-0 overscroll-contain scroll-smooth px-1 md:px-2 [scrollbar-width:thin]",
              embedded ? "overflow-visible" : "overflow-y-auto",
              embedded ? "flex flex-col md:grid md:grid-cols-[minmax(0,0.68fr)_minmax(0,0.86fr)_minmax(520px,1.55fr)] md:items-start md:gap-0" : ""
            )}
            style={{ WebkitOverflowScrolling: "touch", touchAction: openHub ? "pan-y" : "auto" }}
            onTouchStart={handleBodyTouchStart}
            onTouchEnd={handleBodyTouchEnd}
          >
            <div data-calculator-cart-area className={embedded ? "order-2 sticky bottom-0 z-20 min-w-0 bg-card md:static md:col-start-3 md:row-start-1 md:min-w-0 md:overflow-hidden md:rounded-[18px] md:shadow-[var(--ui-shadow-popup)]" : ""}>
            <CartSummaryBar
              embedded={embedded}
              isDark={isDark}
              fabColor={fabColor}
              fabTextColor={fabTextColor}
              itemCount={itemCount}
              total={total}
              cart={cart}
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
              onSetQty={setQty}
              handleClickStep={handleClickStep}
              handlePressStart={handlePressStart}
              handlePressEnd={handlePressEnd}
            />
            <FooterActions
              hasItems={cart.length > 0}
              totalSavings={totalSavings}
              total={total}
              itemCount={itemCount}
              fabColor={fabColor}
              onExportPdf={() => { void exportPdf("download") }}
              onViewQuote={() => { void exportPdf("view") }}
              onSendQuote={sendQuote}
              onClose={() => setIsOpen(false)}
              showClose={!embedded}
              embedded={embedded}
            />
            </div>

            <div className={embedded ? "order-1 min-w-0 md:col-span-2 md:col-start-1 md:row-start-1" : ""}>
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
              embedded={embedded}
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
              onStepQty={stepQty}
              onSetQty={setQty}
            />
            </div>
          </div>

        </div>
      )}
    </>
  )
      }
