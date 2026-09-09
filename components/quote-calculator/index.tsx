// components/quote-calculator/index.tsx
"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calculator, X, WhatsappLogo, CaretDown, SealPercent, ArrowCounterClockwise, FloppyDisk, FilePdf, BookmarkSimple, Trash, ArrowsOutSimple, ArrowsInSimple, Sun, Moon } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { HUB_COLORS, HubKey, BIZ, waLink } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"
import { useExclusiveWidget } from "@/hooks/use-exclusive-widget"
import { useScrollHide } from "@/hooks/use-scroll-hide"
import { GLASS, HOME_BLUE, getReadableTextColor } from "./shared"
import {
  CartItem, SavedQuote, STORAGE_KEY, STORAGE_KEY_SAVED,
  getDisplayName, getEffectiveRate, parsePrice, quoteTotals,
} from "./lib"
import { CartItemChip } from "./cart-item-chip"
import { CartItemCard } from "./cart-item-card"
import { HubBrowser } from "./hub-browser"
import { exportQuotePdf } from "./pdf-export"
import { announceCalculatorState } from "@/hooks/use-calculator-open"

const VIEW_KEY = "apexbytes-quote-view"

export function QuoteCalculatorWidget() {
  const { resolvedTheme, setTheme } = useTheme(); const isDark = resolvedTheme === "dark"
  const [isOpen, setIsOpen] = useExclusiveWidget("calculator")
  const isScrolling = useScrollHide()
  const fabVisible = !isOpen
  const [openHub, setOpenHub]   = useState<HubId | null>(null)
  const [openSections, setOpenSections] = useState<Record<HubId, number | null>>({} as Record<HubId, number | null>)
  const [cart, setCart]         = useState<CartItem[]>([])
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

  // Small live clock in the header — device time only, no location.
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])
  const clockLabel = now
    ? now.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" })
    : ""

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
    return () => {
      document.body.style.overflow = ""
      announceCalculatorState(false)
    }
  }, [isOpen])

  const toggleCalculatorTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
    document.documentElement.classList.add("abh-theme-switching")
    window.setTimeout(() => document.documentElement.classList.remove("abh-theme-switching"), 350)
    // next-themes exposes setTheme through the provider; use the same hook state setter below.
    setTheme(nextTheme)
  }

  const wasOpenRef = useRef(false)
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      window.history.pushState({ abhCalc: true }, "")
    }
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
      if (el) {
        el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
      } else {
        raf2 = requestAnimationFrame(tryScroll)
      }
    }
    const raf1 = requestAnimationFrame(tryScroll)
    const clearT = setTimeout(() => setHighlightId(null), 900)
    return () => {
      cancelAnimationFrame(raf1)
      if (raf2 !== undefined) cancelAnimationFrame(raf2)
      clearTimeout(clearT)
    }
  }, [highlightId])

  useEffect(() => {
    const pressStateSnapshot = pressState.current
    return () => {
      Object.values(pressStateSnapshot).forEach(s => {
        if (s.timeout) clearTimeout(s.timeout)
        if (s.interval) clearInterval(s.interval)
      })
    }
  }, [])

  const getAccent     = (id: HubId) => { const c = HUB_COLORS[id as HubKey]; return isDark ? c.accentDark : c.accentLight }
  const getSolid      = (id: HubId) => HUB_COLORS[id as HubKey].accentLight
  const titleAccent   = isDark ? HUB_COLORS.design.accentDark : HUB_COLORS.design.accentLight
  const fabColor      = isDark ? HOME_BLUE.dark : HOME_BLUE.light
  const fabTextColor  = useMemo(() => getReadableTextColor(fabColor), [fabColor])

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
    setCart(prev => {
      const next = [...prev]
      next.splice(Math.min(undoStack.index, next.length), 0, undoStack.item)
      return next
    })
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
    const handler = (e: Event) => {
      const { hubId, sectionTitle, name, price } = (e as CustomEvent).detail
      addItem(hubId, sectionTitle, name, price)
    }
    window.addEventListener("abh:add-to-quote", handler)
    return () => window.removeEventListener("abh:add-to-quote", handler)
  }, [addItem])

  useEffect(() => {
    const handler = (e: Event) => {
      const { hubId, sectionTitle, name } = (e as CustomEvent).detail
      const id = `${hubId}-${sectionTitle}-${name}`
      stepQty(id, -1)
    }
    window.addEventListener("abh:remove-from-quote", handler)
    return () => window.removeEventListener("abh:remove-from-quote", handler)
  }, [stepQty])

  useEffect(() => {
    const handler = (e: Event) => {
      const { id, delta } = (e as CustomEvent).detail
      stepQty(id, delta)
    }
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

  const hubSubtotal = (hubId: HubId) => {
    const items = cart.filter(i => i.hubId === hubId)
    if (items.length === 0) return null
    return quoteTotals(items)
  }
  const sectionSubtotal = (hubId: HubId, sectionTitle: string) => {
    const items = cart.filter(i => i.hubId === hubId && i.sectionTitle === sectionTitle)
    if (items.length === 0) return null
    return quoteTotals(items)
  }
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

  const toggleSection = (hubId: HubId, sIdx: number) => {
    setOpenSections(prev => ({ ...prev, [hubId]: prev[hubId] === sIdx ? null : sIdx }))
  }

  const confirmSaveQuote = () => {
    if (cart.length === 0) return
    const name = saveNameDraft.trim() || `Quote — ${new Date().toLocaleDateString()}`
    setSavedQuotes(prev => [{ id: `q-${Date.now()}`, name, savedAt: Date.now(), items: cart }, ...prev])
    setSaveNameDraft("")
    setShowSaveForm(false)
  }
  const loadSavedQuote = (q: SavedQuote) => {
    setCart(q.items)
    setShowSavedList(false)
  }
  const deleteSavedQuote = (id: string) => setSavedQuotes(prev => prev.filter(q => q.id !== id))

  // The FAB now also hides whenever another exclusive widget (e.g. the
  // WhatsApp panel) is open, and vice versa in whatsapp-fab.tsx — no more
  // floating buttons stacking up behind an open sheet.
  const showMiniBar = cart.length > 0 && fabVisible

  return (
    <>
      <span className="sr-only" role="status" aria-live="polite">{announce}</span>

      <style>{`
        @keyframes abh-calc-grow {
          0% { opacity: 0; transform: scale(0.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes abh-calc-slide-up {
          0% { opacity: 0; transform: translateY(28px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .abh-calc-anim {
          animation: abh-calc-slide-up 260ms cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: bottom center;
        }
        @media (min-width: 768px) {
          .abh-calc-anim {
            animation: abh-calc-grow 280ms cubic-bezier(0.16, 1, 0.3, 1);
            transform-origin: calc(100% - 26px) 100%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .abh-calc-anim { animation: none; }
        }
        .abh-chip-strip { scrollbar-width: none; -ms-overflow-style: none; }
        .abh-chip-strip::-webkit-scrollbar { display: none; }
      `}</style>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9989] bg-black/70 backdrop-blur transition-opacity duration-200 ease-out motion-reduce:transition-none md:backdrop-blur-none"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed z-[9992] right-4 md:right-6 bottom-[10rem] flex items-center justify-end group/calc",
          "transition-all duration-200 ease-out motion-reduce:transition-none transform-gpu",
          fabVisible
            ? isScrolling
              ? "opacity-30 scale-100 pointer-events-auto"
              : "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 pointer-events-none scale-90"
        )}
      >
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "-mr-3 flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-full shadow-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 active:scale-95 transition-all duration-250 ease-out origin-right motion-reduce:transition-none transform-gpu overflow-hidden whitespace-nowrap",
            showMiniBar && miniExpanded
              ? "opacity-100 max-w-[220px] scale-100"
              : "opacity-0 max-w-0 scale-95 pl-0 pr-0 pointer-events-none"
          )}
        >
          {hubsInCart.length > 0 && (
            <span className="flex items-center gap-1 shrink-0">
              {hubsInCart.map(hubId => (
                <span
                  key={hubId}
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: getAccent(hubId) }}
                  aria-hidden="true"
                />
              ))}
            </span>
          )}
          <span className="text-xs font-black text-zinc-700 dark:text-zinc-200">R{total}</span>
          <span className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">View quote</span>
        </button>

        <div className="relative flex items-center justify-end gap-2">
          <span
            className={cn(
              "text-[0.65rem] font-black uppercase tracking-widest whitespace-nowrap pointer-events-none overflow-hidden",
              "bg-white dark:bg-zinc-900",
              "px-2.5 py-1 rounded-full shadow-md border border-zinc-100 dark:border-zinc-800",
              "transition-all duration-200 ease-out origin-right motion-reduce:transition-none transform-gpu",
              "max-w-0 opacity-0 scale-x-0 group-hover/calc:max-w-[100px] group-hover/calc:opacity-100 group-hover/calc:scale-x-100 group-focus-within/calc:max-w-[100px] group-focus-within/calc:opacity-100 group-focus-within/calc:scale-x-100"
            )}
            style={{ color: fabColor }}
          >
            Quote
          </span>

          <button
          onClick={() => setIsOpen(true)}

            aria-label="Open quotation calculator"
            aria-haspopup="dialog"
            className="relative size-14 rounded-full bg-card border border-border shadow-md flex items-center justify-center active:scale-90 hover:scale-105 transition-transform duration-150 ease-out motion-reduce:transition-none transform-gpu"
          >
            <Calculator
              size={34}
              weight="fill"
              className="transition-all duration-200 ease-out motion-reduce:transition-none"
              style={{ color: fabColor, filter: `drop-shadow(0 4px 10px color-mix(in srgb, ${fabColor} 12%, transparent)) drop-shadow(0 2px 4px rgba(0,0,0,0.3))` }}
            />
          </button>

          {itemCount > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setMiniExpanded(v => !v) }}
              aria-label={miniExpanded ? "Hide quote total" : "Show quote total"}
              className="absolute -top-0.5 -right-0.5 min-w-[22px] h-[22px] px-1 rounded-full bg-brand-orange text-white text-[0.65rem] font-black flex items-center justify-center border-2 border-white dark:border-zinc-950 shadow-md active:scale-90 transition-transform duration-150"
            >
              {itemCount}
            </button>
          )}
        </div>
      </div>

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

          {/* Header: ApexbytesHub wordmark + small live clock. No close
              button here anymore — it lives at the bottom, per the sketch. */}
          <div
            className="flex items-center justify-between px-5 pb-2 shrink-0"
            style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
          >
            <span className="font-sans font-black text-sm tracking-tight" style={{ color: fabColor }}>
              {BIZ.name}
            </span>
            <div className="flex items-center gap-2">
              {clockLabel && (
                <span className="text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground tabular-nums" aria-label="Current time">
                  {clockLabel}
                </span>
              )}
              <button
                type="button"
                onClick={toggleCalculatorTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--surface-modal-control)] text-foreground hover:bg-[var(--surface-modal-control-hover)] transition-colors"
              >
                {isDark ? <Sun size={16} weight="bold" aria-hidden="true" /> : <Moon size={16} weight="bold" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Friendly title + subtitle, inviting a choice rather than
              instructing one. Copy shifts once there's something in the cart. */}
          <div className="px-5 pb-3 text-center shrink-0 border-b border-zinc-100 dark:border-white/10">
            <h3 className="font-sans font-black text-xl leading-snug" style={{ color: titleAccent }}>
              {cart.length > 0 ? "Looking good so far" : "What can we help you with today?"}
            </h3>
            <p className="text-[0.78rem] font-medium text-muted-foreground mt-1">
              {cart.length > 0
                ? "Add more, or send it through whenever you're ready 🙂"
                : "Tap a hub below and let's put your quote together ✨"}
            </p>
          </div>

          <div
            className="flex-1 overflow-y-auto overscroll-contain min-h-0"
            style={{ WebkitOverflowScrolling: "touch" }}
          >

            {undoStack && (
              <div className="sticky top-0 z-20 p-3 border-b border-zinc-100 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur">
                <div className="flex items-center justify-between gap-3 p-2.5 rounded-[12px] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg animate-in fade-in slide-in-from-top-1 duration-200">
                  <span className="text-[0.7rem] font-bold truncate">{getDisplayName(undoStack.item.sectionTitle, undoStack.item.name)} removed</span>
                  <button
                    onClick={undoRemove}
                    className="shrink-0 flex items-center gap-1.5 text-[0.65rem] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 dark:bg-black/10 hover:bg-white/25 dark:hover:bg-black/20 transition-colors"
                  >
                    <ArrowCounterClockwise size={12} weight="bold" aria-hidden="true" /> Undo
                  </button>
                </div>
              </div>
            )}

            {cart.length > 0 && (
              <div
                className="sticky top-0 z-10 border-b border-zinc-100 dark:border-white/10 shadow-[0_4px_10px_-6px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_10px_-6px_rgba(0,0,0,0.4)]"
                style={{
                  background: isDark
                    ? `linear-gradient(180deg, color-mix(in srgb, ${fabColor} 8%, transparent) 0%, rgba(24,24,27,0.97) 70%)`
                    : `linear-gradient(180deg, color-mix(in srgb, ${fabColor} 12%, transparent) 0%, rgba(255,255,255,0.97) 70%)`,
                  backdropFilter: "blur(6px)",
                }}
              >
                <div className="p-4 space-y-2.5">

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.72rem] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-200">
                      Your Quote · {itemCount} item{itemCount === 1 ? "" : "s"} · R{total}
                    </span>

                    <div className="flex items-center gap-1 p-1 rounded-full bg-zinc-100/80 dark:bg-white/5 shrink-0">
                      <button
                        onClick={() => setExpandView(v => !v)}
                        aria-pressed={expandView}
                        aria-label={expandView ? "Switch to compact view" : "Switch to expanded view"}
                        title={expandView ? "Compact view" : "Expand view"}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-white/10 transition-colors"
                      >
                        {expandView
                          ? <ArrowsInSimple size={14} weight="bold" aria-hidden="true" />
                          : <ArrowsOutSimple size={14} weight="bold" aria-hidden="true" />}
                      </button>
                      <button
                        onClick={() => setShowSaveForm(v => !v)}
                        aria-label="Save quote"
                        title="Save quote"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-white/10 transition-colors"
                      >
                        <FloppyDisk size={14} weight="bold" aria-hidden="true" />
                      </button>
                      <button
                        onClick={clearCart}
                        aria-label="Clear quote"
                        title="Clear quote"
                        className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground dark:text-zinc-300 hover:text-red-500 hover:bg-white dark:hover:bg-white/10 transition-colors"
                      >
                        <Trash size={14} weight="bold" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {showSaveForm && (
                    <div className="flex items-center gap-2 p-2 rounded-[12px] bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 animate-in fade-in slide-in-from-top-1 duration-150">
                      <label htmlFor="save-quote-name" className="sr-only">Name this quote (optional)</label>
                      <input
                        id="save-quote-name"
                        autoFocus
                        value={saveNameDraft}
                        onChange={e => setSaveNameDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") confirmSaveQuote() }}
                        placeholder="Name this quote (optional)"
                        className="flex-1 min-w-0 px-2.5 py-1.5 rounded-[8px] bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-800 dark:text-zinc-200 outline-none border border-zinc-100 dark:border-zinc-800"
                      />
                      <button
                        onClick={confirmSaveQuote}
                        className="shrink-0 px-3 py-1.5 rounded-[8px] text-xs font-black"
                        style={{ backgroundColor: fabColor, color: fabTextColor }}
                      >
                        Save
                      </button>
                    </div>
                  )}

                  <div
                    role="list"
                    aria-label="Items in your quote"
                    className="abh-chip-strip flex gap-2.5 overflow-x-auto overscroll-x-contain snap-x snap-mandatory pb-1"
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    <AnimatePresence initial={false} mode="popLayout">
                      {cart.map(item => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={{ duration: 0.18 }}
                          className="shrink-0 snap-start"
                        >
                          {expandView ? (
                            <CartItemCard
                              item={item}
                              accent={getAccent(item.hubId)}
                              isHighlighted={highlightId === item.id}
                              cardRef={(el) => { chipRefs.current[item.id] = el }}
                              onRemove={removeItem}
                              onClickStep={handleClickStep}
                              onPressStart={handlePressStart}
                              onPressEnd={handlePressEnd}
                            />
                          ) : (
                            <CartItemChip
                              item={item}
                              accent={getAccent(item.hubId)}
                              isHighlighted={highlightId === item.id}
                              chipRef={(el) => { chipRefs.current[item.id] = el }}
                              onRemove={removeItem}
                              onClickStep={handleClickStep}
                              onPressStart={handlePressStart}
                              onPressEnd={handlePressEnd}
                            />
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )}

            {savedQuotes.length > 0 && (
              <div className="px-4 pt-4">
                <button
                  onClick={() => setShowSavedList(v => !v)}
                  aria-expanded={showSavedList}
                  aria-controls="saved-quotes-panel"
                  className="w-full flex items-center justify-between gap-2 text-[0.65rem] font-black uppercase tracking-widest text-muted-foreground dark:text-zinc-300 px-1 mb-2"
                >
                  <span className="flex items-center gap-1.5"><BookmarkSimple size={13} weight="bold" aria-hidden="true" /> Saved Quotes ({savedQuotes.length})</span>
                  <CaretDown size={12} className={cn("transition-transform duration-200", showSavedList ? "rotate-180" : "rotate-0")} aria-hidden="true" />
                </button>
                <div id="saved-quotes-panel" className={cn("grid transition-[grid-template-rows] duration-250 ease-out motion-reduce:transition-none", showSavedList ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <div className="space-y-1.5 pb-3">
                      {savedQuotes.map(q => {
                        const t = quoteTotals(q.items)
                        return (
                          <div key={q.id} className={cn("flex items-center justify-between gap-2 p-2.5 rounded-[10px]", GLASS.item)}>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate">{q.name}</p>
                              <p className="text-[0.62rem] font-medium text-muted-foreground">{t.count} item{t.count === 1 ? "" : "s"} · R{t.total}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button onClick={() => loadSavedQuote(q)} className="px-2.5 py-1 rounded-[8px] text-[0.65rem] font-black" style={{ backgroundColor: fabColor, color: fabTextColor }}>Load</button>
                              <button onClick={() => deleteSavedQuote(q.id)} aria-label={`Delete saved quote ${q.name}`} className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"><Trash size={12} weight="bold" aria-hidden="true" /></button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

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

          {cart.length > 0 && (
            <div className="px-4 pt-3 shrink-0 border-t border-zinc-100 dark:border-white/10 space-y-3 shadow-[0_-6px_14px_-6px_rgba(0,0,0,0.15)] dark:shadow-[0_-6px_14px_-6px_rgba(0,0,0,0.5)]">
              {totalSavings > 0 && (
                <div className="flex items-center gap-1.5 text-[0.7rem] font-bold text-emerald-600 dark:text-emerald-400">
                  <SealPercent size={14} weight="fill" aria-hidden="true" />
                  Saving R{totalSavings} with bulk pricing
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-muted-foreground">Total</span>
                <span className="text-2xl font-black" style={{ color: fabColor }}>R{total}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportQuotePdf(cart)}
                  className={cn("shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center transition-all duration-150 active:scale-95 shadow-md hover:shadow-lg transform-gpu", GLASS.btn)}
                  aria-label="Download or print quote as PDF"
                  title="Download / print as PDF"
                >
                  <FilePdf size={20} weight="bold" className="text-zinc-600 dark:text-zinc-300" aria-hidden="true" />
                </button>
                <button
                  onClick={sendQuote}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[14px] font-black text-sm text-emerald-950 active:scale-95 transition-transform duration-150 shadow-lg transform-gpu"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <WhatsappLogo size={20} weight="fill" aria-hidden="true" /> Send Quote via WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* Close button, moved down here per the sketch — a single
              shadowed circular X, always reachable at the bottom. */}
          <div
            className="shrink-0 flex justify-center py-3 border-t border-zinc-100 dark:border-white/10"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close quotation calculator"
              className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center text-muted-foreground hover:text-zinc-800 dark:hover:text-zinc-200 transition-all duration-150 active:scale-90 shadow-md",
                GLASS.btn
              )}
            >
              <X size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  )
                                                   } 
