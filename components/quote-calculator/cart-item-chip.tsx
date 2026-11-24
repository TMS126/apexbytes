// components/quote-calculator/cart-item-chip.tsx
"use client"

/* AUDIT: added abh-press to the qty +/- and remove buttons for the same
   haptic press feedback as everywhere else. Chip dimensions, padding,
   and font sizes are untouched — you asked for icons bigger but chips
   to stay the same size. */

import { X, Minus, Plus } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { CartItem, getDisplayName, getEffectiveRate } from "./lib"

interface CartItemChipProps {
  item: CartItem
  accent: string
  isHighlighted: boolean
  onRemove: (id: string) => void
  onClickStep: (id: string, delta: number) => void
  onPressStart: (id: string, delta: number) => void
  onPressEnd: (id: string) => void
  chipRef?: (el: HTMLDivElement | null) => void
}

export function CartItemChip({
  item, accent, isHighlighted, onRemove, onClickStep, onPressStart, onPressEnd, chipRef,
}: CartItemChipProps) {
  const qty = item.qty || 1
  const effRate = getEffectiveRate(item.id, item.name, qty, item.unitPrice)
  const lineTotal = effRate * qty
  const displayName = getDisplayName(item.sectionTitle, item.name)

  return (
    <div
      ref={chipRef}
      role="listitem"
      className={cn(
        "flex min-w-0 w-[min(100%,24rem)] max-w-[calc(100vw-1.5rem)] shrink-0 items-center gap-1.5 rounded-full bg-card pl-3 pr-1.5 py-2 snap-start transition-all duration-300 ease-out motion-reduce:transition-none",
        "focus-within:ring-1 focus-within:ring-[var(--hub-accent)]"
      )}
      style={{
        boxShadow: `0 4px 12px -2px color-mix(in srgb, ${accent} 25%, transparent), 0 2px 6px -1px rgba(0,0,0,0.18)`,
        ...(isHighlighted ? { ["--tw-ring-color" as unknown as keyof import("react").CSSProperties]: accent } : {}),
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="flex items-center gap-1.5 text-[0.7rem] font-medium text-zinc-800 dark:text-zinc-200 truncate"><span aria-hidden="true" className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />{displayName}</span>
        <span className="text-[0.64rem] font-medium" style={{ color: accent }}>R{lineTotal}</span>
      </div>

      <div className="flex shrink-0 items-center overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <button
          onClick={() => onClickStep(item.id, -1)}
          onPointerDown={() => onPressStart(item.id, -1)}
          onPointerUp={() => onPressEnd(item.id)}
          onPointerLeave={() => onPressEnd(item.id)}
          onPointerCancel={() => onPressEnd(item.id)}
          aria-label={`Decrease quantity for ${displayName}`}
          className="abh-press flex h-7 w-7 shrink-0 items-center justify-center active:bg-black/10 dark:active:bg-white/20 transition-colors duration-150 select-none touch-none"
        >
          <Minus size={11} weight="bold" aria-hidden="true" />
        </button>
        <span className="min-w-7 px-1.5 text-center text-[0.68rem] font-medium tabular-nums text-zinc-800 dark:text-zinc-100" aria-label={`Quantity ${qty}`}>{qty}</span>
        <button
          onClick={() => onClickStep(item.id, 1)}
          onPointerDown={() => onPressStart(item.id, 1)}
          onPointerUp={() => onPressEnd(item.id)}
          onPointerLeave={() => onPressEnd(item.id)}
          onPointerCancel={() => onPressEnd(item.id)}
          aria-label={`Increase quantity for ${displayName}`}
          className="abh-press flex h-7 w-7 shrink-0 items-center justify-center active:bg-black/10 dark:active:bg-white/20 transition-colors duration-150 select-none touch-none"
        >
          <Plus size={11} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${displayName} from quote`}
        className="abh-press w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-red-500 shrink-0 transition-colors duration-150"
      >
        <X size={12} weight="bold" aria-hidden="true" />
      </button>
    </div>
  )
        }
