// components/quote-calculator/cart-summary-bar.tsx
"use client"

/* ============================================================
   CART SUMMARY BAR — sticky undo toast, view/save/clear controls,
   and the horizontally-scrolling item chip strip
   ============================================================ */

import { AnimatePresence, motion } from "framer-motion"
import { ArrowCounterClockwise, ArrowsOutSimple, ArrowsInSimple, FloppyDisk, Trash } from "@phosphor-icons/react"
import { HubId } from "@/lib/data"
import { cn } from "@/lib/utils"
import { CartItem, getDisplayName } from "./lib"
import { CartItemChip } from "./cart-item-chip"
import { CartItemCard } from "./cart-item-card"

interface UndoStack {
  kind: "remove" | "clear" | "saved"
  item?: CartItem
  quote?: { name: string }
}

interface CartSummaryBarProps {
  embedded?: boolean
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
  onSetQty: (id: string, qty: number) => void
  handleClickStep: (id: string, delta: number) => void
  handlePressStart: (id: string, delta: number) => void
  handlePressEnd: (id: string) => void
}

export function CartSummaryBar({
  embedded = false, fabColor, fabTextColor, itemCount, total, cart, expandView, setExpandView,
  showSaveForm, setShowSaveForm, saveNameDraft, setSaveNameDraft, confirmSaveQuote, clearCart,
  undoStack, undoRemove, highlightId, chipRefs, getAccent,
  removeItem, onSetQty, handleClickStep, handlePressStart, handlePressEnd,
}: CartSummaryBarProps) {
  return (
    <>
      {undoStack && (
        <div className="sticky top-0 z-20 border-b border-border bg-card p-3">
          <div className="flex items-center justify-between gap-3 rounded-[14px] border border-border bg-foreground p-2.5 text-background animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-[0.7rem] font-medium truncate">
              {undoStack.kind === "remove" && undoStack.item
                ? `${getDisplayName(undoStack.item.sectionTitle, undoStack.item.name)} removed`
                : undoStack.kind === "clear" ? "Quote cleared" : `${undoStack.quote?.name ?? "Saved quote"} deleted`}
            </span>
            <button
              onClick={undoRemove}
              className="abh-press shrink-0 flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 dark:bg-black/10 hover:bg-white/25 dark:hover:bg-black/20 transition-colors"
            >
              <ArrowCounterClockwise size={12} weight="bold" aria-hidden="true" /> Undo
            </button>
          </div>
        </div>
      )}

      {embedded && cart.length === 0 && (
        <div className="rounded-[14px] bg-card p-5 text-center text-sm text-muted-foreground" role="status">
          Your quote is empty. Choose a service below to add it here.
        </div>
      )}

      {cart.length > 0 && (
        <div
          className={cn("z-10 border-b border-border/40 bg-card/90 md:rounded-[18px] md:shadow-[var(--ui-shadow-popup)]", embedded ? "md:sticky md:top-0" : "sticky top-0")}
        >
          <div className="p-4 space-y-2.5 md:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[0.72rem] font-medium uppercase tracking-widest text-zinc-600 dark:text-zinc-200">
                Your Quote · {itemCount} item{itemCount === 1 ? "" : "s"} · R{total}
              </span>
              <div className="flex items-center gap-1 p-1 rounded-full bg-zinc-100/80 dark:bg-white/5 shrink-0">
                <button
                  onClick={() => setExpandView(v => !v)}
                  aria-pressed={expandView}
                  aria-label={expandView ? "Switch to compact view" : "Switch to expanded view"}
                  title={expandView ? "Compact view" : "Expand view"}
                  className="abh-press abh-icon-chip w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                  {expandView ? <ArrowsInSimple size={14} weight="bold" aria-hidden="true" /> : <ArrowsOutSimple size={14} weight="bold" aria-hidden="true" />}
                </button>
                <button
                  onClick={() => setShowSaveForm(v => !v)}
                  aria-label="Save quote"
                  title="Save quote"
                  className="abh-press abh-icon-chip w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                  <FloppyDisk size={14} weight="bold" aria-hidden="true" />
                </button>
                <button
                  onClick={clearCart}
                  aria-label="Clear quote"
                  title="Clear quote"
                  className="abh-press abh-icon-chip w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground dark:text-zinc-300 hover:text-red-500 hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                  <Trash size={14} weight="bold" aria-hidden="true" />
                </button>
              </div>
            </div>

            {showSaveForm && (
              <div className="flex items-center gap-2 rounded-[14px] border border-border bg-muted/45 p-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <label htmlFor="save-quote-name" className="sr-only">Name this quote (optional)</label>
                <input
                  id="save-quote-name"
                  autoFocus
                  value={saveNameDraft}
                  onChange={e => setSaveNameDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") confirmSaveQuote() }}
                  placeholder="Name this quote (optional)"
                  className="min-w-0 flex-1 rounded-[14px] border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-foreground outline-none focus:border-[var(--card-rule)] focus:ring-2 focus:ring-[var(--card-rule)]/20"
                />
                <button
                  onClick={confirmSaveQuote}
                  className="abh-press shrink-0 px-3 py-1.5 rounded-[8px] text-xs font-medium"
                  style={{ backgroundColor: fabColor, color: fabTextColor }}
                >
                  Save
                </button>
              </div>
            )}

            <div
              role="list"
              aria-label="Items in your quote"
              className={cn(
                "gap-2.5 pb-1",
                embedded ? "grid grid-cols-1 gap-3 overflow-visible" : "abh-chip-strip flex overflow-x-auto overscroll-x-contain snap-x snap-mandatory"
              )}
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
                    className={embedded ? "w-full" : "shrink-0 snap-start"}
                  >
                    {embedded || expandView ? (
                      <CartItemCard
                        item={item}
                        embedded={embedded}
                        accent={getAccent(item.hubId)}
                        isHighlighted={highlightId === item.id}
                        cardRef={(el) => { chipRefs.current[item.id] = el }}
                        onRemove={removeItem}
                        onSetQty={onSetQty}
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
