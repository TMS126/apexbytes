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
        <div className="px-4 pt-3 shrink-0 border-t border-zinc-100 dark:border-white/10 space-y-3 shadow-[0_-6px_14px_-6px_rgba(0,0,0,0.15)] dark:shadow-[0_-6px_14px_-6px_rgba(0,0,0,0.5)]">
          {totalSavings > 0 && (
            <div className="flex items-center gap-1.5 text-[0.7rem] font-bold text-emerald-600 dark:text-emerald-400">
              <SealPercent size={14} weight="fill" aria-hidden="true" />
              Saving R{totalSavings} with bulk pricing
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-muted-foreground">Total</span>
            <span className="text-2xl font-black" style={{ color: fabColor }}>R{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportPdf}
              className={cn("abh-press shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center transition-all duration-150 shadow-md hover:shadow-lg transform-gpu", GLASS.btn)}
              aria-label="Download or print quote as PDF"
              title="Download / print as PDF"
            >
              <FilePdf size={20} weight="bold" className="text-zinc-600 dark:text-zinc-300" aria-hidden="true" />
            </button>
            <button
              onClick={onSendQuote}
              className="abh-press flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[14px] font-black text-sm text-emerald-950 transition-transform duration-150 shadow-lg transform-gpu"
              style={{ backgroundColor: "#25D366" }}
            >
              <WhatsappLogo size={20} weight="fill" aria-hidden="true" /> Send Quote via WhatsApp
            </button>
          </div>
        </div>
      )}

      <div className="shrink-0 flex justify-center py-3 border-t border-zinc-100 dark:border-white/10" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <button
          onClick={onClose}
          aria-label="Close quotation calculator"
          className={cn("abh-press w-11 h-11 rounded-full flex items-center justify-center text-muted-foreground hover:text-zinc-800 dark:hover:text-zinc-200 transition-all duration-150 shadow-md", GLASS.btn)}
        >
          <X size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </>
  )
}
