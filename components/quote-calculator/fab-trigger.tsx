// components/quote-calculator/fab-trigger.tsx
"use client"

import { Calculator } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { HubId } from "@/lib/data"

interface FabTriggerProps {
  visible: boolean
  dimmed: boolean
  miniExpanded: boolean
  hubsInCart: HubId[]
  total: number
  itemCount: number
  fabColor: string
  getAccent: (id: HubId) => string
  onOpen: () => void
  onToggleMini: () => void
}

export function FabTrigger({
  visible, dimmed, miniExpanded, hubsInCart, total, itemCount, fabColor, getAccent, onOpen, onToggleMini,
}: FabTriggerProps) {
  const showMiniBar = itemCount > 0 && visible

  return (
    <div
      className={cn(
        "fixed z-[9992] right-4 md:right-6 bottom-24 flex items-center justify-end group/calc",
        "transition-all duration-200 ease-out motion-reduce:transition-none transform-gpu",
        !visible ? "hidden" : dimmed ? "opacity-30 scale-100 pointer-events-auto" : "opacity-100 scale-100 pointer-events-auto"
      )}
    >
      <button
        onClick={onOpen}
        className={cn(
          "-mr-3 flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-full shadow-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 active:scale-95 transition-all duration-250 ease-out origin-right motion-reduce:transition-none transform-gpu overflow-hidden whitespace-nowrap",
          showMiniBar && miniExpanded ? "opacity-100 max-w-[220px] scale-100" : "opacity-0 max-w-0 scale-95 pl-0 pr-0 pointer-events-none"
        )}
      >
        {hubsInCart.length > 0 && (
          <span className="flex items-center gap-1 shrink-0">
            {hubsInCart.map(hubId => (
              <span key={hubId} className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getAccent(hubId) }} aria-hidden="true" />
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
            "bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-full shadow-md border border-zinc-100 dark:border-zinc-800",
            "transition-all duration-200 ease-out origin-right motion-reduce:transition-none transform-gpu",
            "max-w-0 opacity-0 scale-x-0 group-hover/calc:max-w-[100px] group-hover/calc:opacity-100 group-hover/calc:scale-x-100 group-focus-within/calc:max-w-[100px] group-focus-within/calc:opacity-100 group-focus-within/calc:scale-x-100"
          )}
          style={{ color: fabColor }}
        >
          Quote
        </span>

        <button
          onClick={onOpen}
          aria-label="Open quotation calculator"
          aria-haspopup="dialog"
          className="abh-press relative size-14 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:scale-105 transition-transform duration-150 ease-out motion-reduce:transition-none transform-gpu"
        >
          <Calculator
            size={34}
            weight="fill"
            style={{ color: fabColor, filter: `drop-shadow(0 4px 10px color-mix(in srgb, ${fabColor} 12%, transparent)) drop-shadow(0 2px 4px rgba(0,0,0,0.3))` }}
          />
        </button>

        {itemCount > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleMini() }}
            aria-label={miniExpanded ? "Hide quote total" : "Show quote total"}
            className="abh-press abh-badge-circle abh-on-orange absolute -top-0.5 -right-0.5 min-w-[22px] h-[22px] bg-brand-orange text-[0.65rem] font-black border-2 border-white dark:border-zinc-950 shadow-md"
          >
            {itemCount}
          </button>
        )}
      </div>
    </div>
  )
             } 
