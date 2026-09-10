// components/whatsapp-fab/fab-trigger.tsx
"use client"

/* ============================================================
   CLOSED-STATE FAB — hidden completely (not just faded) whenever
   another exclusive widget (Search, Calculator) is open, so it
   can never sit over another widget's controls.
   ============================================================ */

import { usePathname } from "next/navigation"
import { WhatsappLogo } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { BIZ } from "@/lib/brand"
import { WA, TXT } from "./wa-theme"

interface FabTriggerProps {
  visible: boolean
  dimmed: boolean
  onOpen: () => void
}

export function FabTrigger({ visible, dimmed, onOpen }: FabTriggerProps) {
  const pathname = usePathname()
  const onContactPage = pathname === "/contact" || pathname.startsWith("/contact/")

  return (
    <div
      data-widget="whatsapp-fab"
      className={cn(
        "fixed z-[9992] right-4 md:right-6 bottom-6 group/wa",
        onContactPage && "hidden",
        "transition-all duration-200 ease-out motion-reduce:transition-none transform-gpu",
        !visible ? "hidden" : dimmed ? "opacity-30 scale-100 pointer-events-auto" : "opacity-100 scale-100 pointer-events-auto"
      )}
    >
      <div className="flex items-center justify-end gap-2">
        <span className={cn(
          TXT.hint,
          "font-black uppercase tracking-widest whitespace-nowrap pointer-events-none overflow-hidden",
          "bg-white dark:bg-zinc-900 text-[#25D366]",
          "px-2.5 py-1 rounded-full shadow-md border border-zinc-100 dark:border-zinc-800",
          "transition-all duration-200 ease-out origin-right motion-reduce:transition-none transform-gpu",
          "max-w-0 group-hover/wa:max-w-[100px] opacity-0 scale-x-0 group-hover/wa:opacity-100 group-hover/wa:scale-x-100 group-focus-within/wa:max-w-[100px] group-focus-within/wa:opacity-100 group-focus-within/wa:scale-x-100"
        )}>
          Chat
        </span>
        <button
          onClick={onOpen}
          aria-label={`Chat with ${BIZ.name} on WhatsApp`}
          className="abh-press relative size-14 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:scale-105 transition-transform duration-150 ease-out motion-reduce:transition-none transform-gpu"
        >
          <WhatsappLogo
            size={32}
            weight="fill"
            style={{ color: WA.accent, filter: `drop-shadow(0 4px 10px color-mix(in srgb, ${WA.accent} 12%, transparent)) drop-shadow(0 2px 4px rgba(0,0,0,0.3))` }}
          />
        </button>
      </div>
    </div>
  )
}
