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
        "relative flex items-center justify-end group/calc pointer-events-auto",
        "transition-all duration-200 ease-out motion-reduce:transition-none transform-gpu",
        !visible ? "hidden" : dimmed ? "opacity-30 scale-100 pointer-events-auto" : "opacity-100 scale-100 pointer-events-auto"
      )}
    >
      <button
        onClick={onOpen}
        className={cn(
            "-mr-3 flex items-center gap-2 pl-3 pr-3.5 py-2 rounded-full bg-transparent text-foreground shadow-none active:scale-95 transition-all duration-250 ease-out origin-right motion-reduce:transition-none transform-gpu overflow-hidden whitespace-nowrap",
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
        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">R{total}</span>
        <span className="text-[0.6rem] font-medium uppercase tracking-widest text-muted-foreground">View quote</span>
      </button>

      <div className="relative flex items-center justify-end gap-2">
        <span
          className={cn(
            "text-[0.65rem] font-medium uppercase tracking-widest whitespace-nowrap pointer-events-none overflow-hidden",
            "bg-transparent text-foreground px-2.5 py-1 rounded-full shadow-none",
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
          className="abh-press relative flex size-11 items-center justify-center rounded-full bg-transparent text-foreground shadow-none transition-transform duration-150 ease-out hover:-translate-y-0.5 motion-reduce:transition-none"
        >
          <Calculator
            size={25}
            weight="regular"
            style={{ color: fabColor }}
          />
        </button>

        {itemCount > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleMini() }}
            aria-label={miniExpanded ? "Hide quote total" : "Show quote total"}
            className="abh-badge-circle abh-press absolute -top-2 -right-2 size-6 rounded-full bg-transparent text-brand-orange text-[0.65rem] font-black border-0 shadow-none"
          >
            {itemCount}
          </button>
        )}
      </div>
    </div>
  )
             } 
