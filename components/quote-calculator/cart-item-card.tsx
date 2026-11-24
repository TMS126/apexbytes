// components/quote-calculator/cart-item-card.tsx
"use client"

/* AUDIT: added abh-press to the remove/decrease/increase icon buttons
   so they give the same haptic-style press feedback as the rest of the
   calculator's icons — nothing else in this file changed, expand-view
   card sizing is unaffected. */

import { Trash, Minus, Plus } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { HUBS } from "@/lib/data"
import { CartItem, getDisplayName, getEffectiveRate, getBulkHint, getBulkProgress } from "./lib"

interface CartItemCardProps {
  item: CartItem
  embedded?: boolean
  accent: string
  isHighlighted: boolean
  cardRef?: (el: HTMLDivElement | null) => void
  onRemove: (id: string) => void
  onSetQty?: (id: string, qty: number) => void
  onClickStep: (id: string, delta: number) => void
  onPressStart: (id: string, delta: number) => void
  onPressEnd: (id: string) => void
}

export function CartItemCard({
  item, embedded = false, accent, isHighlighted, cardRef,
  onRemove, onSetQty, onClickStep, onPressStart, onPressEnd,
}: CartItemCardProps) {
  const qty = item.qty || 1
  const effRate = getEffectiveRate(item.id, item.name, qty, item.unitPrice)
  const lineTotal = effRate * qty
  const discounted = effRate < item.unitPrice
  const hint = getBulkHint(item.id, item.name, qty, effRate, item.unitPrice, item.unit)
  const progress = getBulkProgress(item.id, item.name, qty)
  const displayName = getDisplayName(item.sectionTitle, item.name)
  const hubLabel = HUBS[item.hubId].title

  return (
    <div
      ref={cardRef}
      role="listitem"
      className={cn(
        "relative shrink-0 bg-card p-3.5 space-y-2 transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
        embedded ? "w-full rounded-none border-b border-border/70 md:grid md:grid-cols-[minmax(0,2.2fr)_minmax(6rem,1fr)_minmax(8rem,1fr)_minmax(6rem,.8fr)] md:items-center md:gap-4 md:space-y-0 md:px-4" : "w-[250px] rounded-[14px] snap-start",
        "focus-within:ring-1 focus-within:ring-[var(--hub-accent)]"
      )}
      style={{
        ...(isHighlighted ? { ["--tw-ring-color" as unknown as keyof import("react").CSSProperties]: accent } : {}),
      }}
    >
      <div className={cn("flex items-start justify-between gap-2", embedded && "md:col-start-1")}>
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-base font-medium text-zinc-800 dark:text-zinc-200 leading-tight"><span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: accent }} />{displayName}</p>
          <p className="text-sm font-medium mt-0.5" style={{ color: accent }}>{hubLabel}</p>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${displayName} from quote`}
          className="abh-press text-muted-foreground hover:text-red-500 shrink-0 transition-colors duration-150"
        >
          <Trash size={14} weight="bold" aria-hidden="true" />
        </button>
      </div>

      <div className={cn("flex items-center gap-2 text-base", embedded && "md:col-start-2 md:block md:text-sm")}>
        {discounted && <span className="text-red-400 line-through">R{item.unitPrice}{item.unit ? `/${item.unit}` : ""}</span>}
        <span className="font-medium text-zinc-700 dark:text-zinc-200" style={{ color: discounted ? accent : undefined }}>R{effRate}{item.unit ? `/${item.unit}` : ""}</span>
      </div>

      <div className={cn("flex items-center justify-between gap-3", embedded && "md:col-start-3 md:justify-self-start")}>
        <div className="flex items-center rounded-full overflow-hidden bg-black/5 dark:bg-white/10">
          <button
            onClick={() => onClickStep(item.id, -1)}
            onPointerDown={() => onPressStart(item.id, -1)}
            onPointerUp={() => onPressEnd(item.id)}
            onPointerLeave={() => onPressEnd(item.id)}
            onPointerCancel={() => onPressEnd(item.id)}
            aria-label={`Decrease quantity for ${displayName}`}
            className="abh-press w-9 h-9 flex items-center justify-center active:bg-black/10 dark:active:bg-white/20 transition-colors duration-150 select-none touch-none"
          >
            <Minus size={13} weight="bold" aria-hidden="true" />
          </button>
          <input
            aria-label={`Quantity for ${displayName}`}
            inputMode="numeric"
            type="number"
            min={1}
            value={qty}
            onChange={(event) => onSetQty?.(item.id, Math.max(1, Number(event.target.value) || 1))}
            className="abh-quote-quantity-input w-8 border-0 border-b border-foreground/20 bg-transparent p-0 text-center text-base font-medium text-zinc-800 outline-none dark:text-zinc-100"
          />
          <button
            onClick={() => onClickStep(item.id, 1)}
            onPointerDown={() => onPressStart(item.id, 1)}
            onPointerUp={() => onPressEnd(item.id)}
            onPointerLeave={() => onPressEnd(item.id)}
            onPointerCancel={() => onPressEnd(item.id)}
            aria-label={`Increase quantity for ${displayName}`}
            className="abh-press w-9 h-9 flex items-center justify-center active:bg-black/10 dark:active:bg-white/20 transition-colors duration-150 select-none touch-none"
          >
            <Plus size={13} weight="bold" aria-hidden="true" />
          </button>
        </div>
        <span className={cn("text-base font-medium text-zinc-900 dark:text-zinc-50", embedded && "md:hidden")}>R{lineTotal}</span>
      </div>

      {embedded && <span className="hidden text-right text-base font-medium text-zinc-900 dark:text-zinc-50 md:col-start-4 md:block">R{lineTotal}</span>}

      <div className={cn("space-y-1", embedded && "md:col-span-4 md:flex md:items-center md:justify-between md:gap-4 md:space-y-0")}>
        {progress?.showDots && (
        <div className="flex items-center gap-1" aria-hidden="true">
          {Array.from({ length: progress.target }).map((_, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: i < progress.current ? accent : `color-mix(in srgb, ${accent} 19%, transparent)` }}
            />
          ))}
          <span className="text-xs font-medium ml-1" style={{ color: accent }}>
            {progress.current}/{progress.target}
          </span>
        </div>
        )}

      {hint && (
        <p className={cn("text-xs font-medium leading-snug", discounted ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")} role="status">
          {hint}
        </p>
      )}
      </div>
    </div>
  )
}
