// components/whatsapp-fab/date-divider.tsx
"use client"

/* ============================================================
   DATE DIVIDER — "Today" / "Yesterday" / date pill
   ============================================================ */

import { cn } from "@/lib/utils"

export function DateDivider({ dateLabel, subColor }: { dateLabel: string; subColor: string }) {
  if (!dateLabel) return null
  return (
    <div className="flex justify-center mb-1">
      <span
        className={cn("text-[0.6rem] font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow-sm bg-white/70 dark:bg-white/10")}
        style={{ color: subColor }}
      >
        {dateLabel}
      </span>
    </div>
  )
}
