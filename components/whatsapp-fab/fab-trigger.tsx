// components/whatsapp-fab/fab-trigger.tsx
"use client"

/* ============================================================
   CLOSED-STATE FAB — hidden completely (not just faded) whenever
   another exclusive widget (Search, Calculator) is open, so it
   can never sit over another widget's controls.
   ============================================================ */

import { usePathname } from "next/navigation"
import { WhatsappLogo, X } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { BIZ } from "@/lib/brand"
import { WA, TXT } from "./wa-theme"

interface FabTriggerProps {
  visible: boolean
  dimmed: boolean
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export function FabTrigger({ visible, dimmed, isOpen, onOpen, onClose }: FabTriggerProps) {
  const pathname = usePathname()
  const onContactPage = pathname === "/contact" || pathname.startsWith("/contact/")

  return (
    <div
      data-widget="whatsapp-fab"
      className={cn(
        "relative group/wa pointer-events-auto",
        onContactPage && "hidden",
        "transition-all duration-200 ease-out motion-reduce:transition-none transform-gpu",
        !visible ? "hidden" : dimmed ? "opacity-30 scale-100 pointer-events-auto" : "opacity-100 scale-100 pointer-events-auto"
      )}
    >
      <div className="flex items-center justify-end gap-2">
        <span className={cn(
          TXT.hint,
          "font-medium uppercase tracking-widest whitespace-nowrap pointer-events-none overflow-hidden",
          "bg-[var(--brand-dark-100)] text-[#25D366]",
          "px-2.5 py-1 rounded-full shadow-md",
          "transition-all duration-200 ease-out origin-right motion-reduce:transition-none transform-gpu",
          "max-w-0 group-hover/wa:max-w-[100px] opacity-0 scale-x-0 group-hover/wa:opacity-100 group-hover/wa:scale-x-100 group-focus-within/wa:max-w-[100px] group-focus-within/wa:opacity-100 group-focus-within/wa:scale-x-100"
        )}>
          {isOpen ? "Close" : "Chat"}
        </span>
        <button
          onClick={isOpen ? onClose : onOpen}
          aria-label={isOpen ? "Close WhatsApp chat" : `Chat with ${BIZ.name} on WhatsApp`}
          className="abh-press relative flex size-11 items-center justify-center rounded-full border border-border/80 bg-background/90 text-foreground shadow-md backdrop-blur-sm transition-transform duration-150 ease-out hover:-translate-y-0.5 motion-reduce:transition-none"
        >
          {isOpen ? (
            <X size={24} weight="regular" aria-hidden="true" />
          ) : (
            <WhatsappLogo
              size={25}
              weight="regular"
              style={{ color: WA.accent }}
            />
          )}
        </button>
      </div>
    </div>
  )
}
