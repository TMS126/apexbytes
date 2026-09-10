// components/whatsapp-fab/hub-picker-pills.tsx
"use client"

/* ============================================================
   HUB PICKER — floating pills (replaces the dropdown list)
   Five (+ "not sure") separate pills float ABOVE the selector
   row, gently scattered with their own shadows, in PDDET order.
   Neutral at rest; a hub's own colour appears only on hover, so
   the resting state stays calm and consistent.
   ============================================================ */

import { cn } from "@/lib/utils"
import { HUBS, HUB_PILL_COLOR } from "./wa-theme"

interface HubPickerPillsProps {
  selected: string
  onSelect: (id: string) => void
  textColor: string
}

// Small alternating offsets/rotations so the row reads as scattered
// rather than a rigid grid, while staying comfortable to tap.
const SCATTER = [
  { y: 0, r: -3 }, { y: 10, r: 2 }, { y: -6, r: -2 },
  { y: 8, r: 3 }, { y: -4, r: -1 }, { y: 6, r: 2 },
]

export function HubPickerPills({ selected, onSelect, textColor }: HubPickerPillsProps) {
  return (
    <div
      role="listbox"
      aria-label="Choose a hub"
      className="absolute left-0 right-0 bottom-full mb-4 z-30 flex flex-wrap justify-center gap-2 px-1 animate-in fade-in slide-in-from-bottom-2 duration-150 ease-out motion-reduce:animate-none"
    >
      {HUBS.map((h, i) => {
        const isSelected = selected === h.id
        const offset = SCATTER[i % SCATTER.length]
        return (
          <button
            key={h.id}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(h.id)}
            style={{
              transform: `translateY(${offset.y}px) rotate(${offset.r}deg)`,
              backgroundColor: "var(--wa-bubble-in)",
              boxShadow: "0 6px 16px -4px rgba(0,0,0,0.25)",
              color: isSelected ? HUB_PILL_COLOR[h.id] : textColor,
              borderColor: isSelected ? HUB_PILL_COLOR[h.id] : "transparent",
              ["--pill-hover-color" as string]: HUB_PILL_COLOR[h.id],
            }}
            className="abh-hub-pill abh-press px-3.5 py-2 rounded-full text-xs font-bold border transition-transform duration-150 ease-out hover:!scale-105 whitespace-nowrap"
          >
            {h.label}
          </button>
        )
      })}
    </div>
  )
}
