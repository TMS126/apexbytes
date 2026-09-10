// components/quote-calculator/cart-summary-bar.tsx
"use client"

/* ============================================================
   CART SUMMARY BAR — sticky undo toast, view/save/clear controls,
   and the horizontally-scrolling item chip strip
   ============================================================ */

import { AnimatePresence, motion } from "framer-motion"
import { ArrowCounterClockwise, ArrowsOutSimple, ArrowsInSimple, FloppyDisk, Trash } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { HubId } from "@/lib/data"
import { CartItem, getDisplayName } from "./lib"
import { CartItemChip } from "./cart-item-chip"
import { CartItemCard } from "./cart-item-card"

interface UndoStack { item: CartItem; index: number }

interface CartSummaryBarProps {
  isDark: boolean
  fabColor: string
  fabTextColor: string
  itemCount: number
  total: number
  cart: CartItem[]
  expandView: boolean
  setExpandView: (fn: (v: boolean) => boolean) => void
  showSaveForm: boolean
  setShowSaveForm: (fn: (v: boolean) => boolean) => void
  saveNameDraft: string
  setSaveNameDraft: (v: string) => void
  confirmSaveQuote: () => void
  clearCart: () => void
  undoStack: UndoStack | null
  undoRemove: () => void
  highlightId: string | null
  chipRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  getAccent: (id: HubId) => string
  removeItem: (id: string) => void
  handleClickStep: (id: string, delta: number) => void
  handlePressStart: (id: string, delta: number) => void
  handlePressEnd: (id: string) => void
}

export function CartSummaryBar({
  isDark, fabColor, fabTextColor, itemCount, total, cart, expandView, setExpandView,
  showSaveForm, setShowSaveForm, saveNameDraft, setSaveNameDraft, confirmSaveQuote, clearCart,
  undoStack, undoRemove, highlightId, chipRefs, getAccent,
  removeItem, handleClickStep, handlePressStart, handlePressEnd,
}: CartSummaryBarProps) {
  return (
    <>
      {undoStack && (
        <div className="sticky top-0 z-20 p-3 border-b border-zinc-100 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur">
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-[12px] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-[0.7rem] font-bold truncate">
              {getDisplayName(undoStack.item.sectionTitle, undoStack.item.name)} removed
            </span>
            <button
              onClick={undoRemove}
              className="abh-press shrink-0 flex items-center gap-1.5 text-[0.65rem] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 dark:bg-black/10 hover:bg-white/25 dark:hover:bg-black/20 transition-colors"
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
                  className="abh-press w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                  {expandView ? <ArrowsInSimple size={14} weight="bold" aria-hidden="true" /> : <ArrowsOutSimple size={14} weight="bold" aria-hidden="true" />}
                </button>
                <button
                  onClick={() => setShowSaveForm(v => !v)}
                  aria-label="Save quote"
                  title="Save quote"
                  className="abh-press w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                  <FloppyDisk size={14} weight="bold" aria-hidden="true" />
                </button>
                <button
                  onClick={clearCart}
                  aria-label="Clear quote"
                  title="Clear quote"
                  className="abh-press w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground dark:text-zinc-300 hover:text-red-500 hover:bg-white dark:hover:bg-white/10 transition-colors"
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
                  className="abh-press shrink-0 px-3 py-1.5 rounded-[8px] text-xs font-black"
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
    </>
  )
}
