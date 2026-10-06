// components/quote-calculator/footer-actions.tsx
"use client"

/* ============================================================
   FOOTER — savings note, total, PDF export + WhatsApp send,
   and the bottom close button
   ============================================================ */

import { SealPercent, FilePdf, WhatsappLogo, X } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { GLASS } from "./shared"

interface FooterActionsProps {
  hasItems: boolean
  totalSavings: number
  total: number
  fabColor: string
  onExportPdf: () => void
  onSendQuote: () => void
  onClose: () => void
}

export function FooterActions({ hasItems, totalSavings, total, fabColor, onExportPdf, onSendQuote, onClose }: FooterActionsProps) {
  return (
    <>
      {hasItems && (
        <div className="shrink-0 border-t border-zinc-100 px-4 py-2.5 dark:border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-muted-foreground">Total</span>
                <span className="text-xl font-black" style={{ color: fabColor }}>R{total}</span>
              </div>
              {totalSavings > 0 && (
                <div className="mt-0.5 flex items-center gap-1 text-[0.62rem] font-bold text-emerald-600 dark:text-emerald-400">
                  <SealPercent size={12} weight="fill" aria-hidden="true" />
                  Saving R{totalSavings} with bulk pricing
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={onExportPdf}
              className={cn("abh-press abh-icon-chip size-10 rounded-full flex items-center justify-center transition-all duration-150", GLASS.btn)}
              aria-label="Download or print quote as PDF"
              title="Download / print as PDF"
            >
              <FilePdf size={20} weight="bold" className="text-zinc-600 dark:text-zinc-300" aria-hidden="true" />
            </button>
            <button
              onClick={onSendQuote}
              className="abh-press flex items-center justify-center gap-1.5 rounded-[10px] px-3 py-2 text-xs font-black text-emerald-950 transition-transform duration-150"
              style={{ backgroundColor: "var(--brand-whatsapp)" }}
            >
              <WhatsappLogo size={16} weight="fill" aria-hidden="true" /> Send
            </button>
            </div>
          </div>
        </div>
      )}

      <div className="shrink-0 flex justify-center border-t border-zinc-100 py-2 dark:border-white/10" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
        <button
          onClick={onClose}
          aria-label="Close quotation calculator"
          className={cn("abh-press abh-icon-chip size-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-zinc-800 dark:hover:text-zinc-200 transition-all duration-150", GLASS.btn)}
        >
          <X size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </>
  )
}
