// components/quote-calculator/saved-quotes-panel.tsx
"use client"

/* ============================================================
   SAVED QUOTES — collapsible list of previously saved carts
   ============================================================ */

import { BookmarkSimple, CaretDown, Trash } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { GLASS } from "./shared"
import { SavedQuote, quoteTotals } from "./lib"

interface SavedQuotesPanelProps {
  savedQuotes: SavedQuote[]
  showSavedList: boolean
  setShowSavedList: (fn: (v: boolean) => boolean) => void
  fabColor: string
  fabTextColor: string
  onLoad: (q: SavedQuote) => void
  onDelete: (id: string) => void
}

export function SavedQuotesPanel({
  savedQuotes, showSavedList, setShowSavedList, fabColor, fabTextColor, onLoad, onDelete,
}: SavedQuotesPanelProps) {
  if (savedQuotes.length === 0) return null

  return (
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
                    <button onClick={() => onLoad(q)} className="abh-press px-2.5 py-1 rounded-[8px] text-[0.65rem] font-black" style={{ backgroundColor: fabColor, color: fabTextColor }}>Load</button>
                    <button onClick={() => onDelete(q.id)} aria-label={`Delete saved quote ${q.name}`} className="abh-press w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"><Trash size={12} weight="bold" aria-hidden="true" /></button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
