// components/quote-calculator/footer-actions.tsx
"use client"

/* ============================================================
   FOOTER — savings note, total, PDF export + WhatsApp send,
   and the bottom close button
   ============================================================ */

import { SealPercent, FilePdf, Eye, WhatsappLogo, X } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { GLASS } from "./shared"

interface FooterActionsProps {
  hasItems: boolean
  totalSavings: number
  total: number
  itemCount: number
  fabColor: string
  onExportPdf: () => void
  onViewQuote: () => void
  onSendQuote: () => void
  onClose: () => void
  showClose?: boolean
  embedded?: boolean
}

export function FooterActions({ hasItems, totalSavings, total, itemCount, fabColor, onExportPdf, onViewQuote, onSendQuote, onClose, showClose = true, embedded = false }: FooterActionsProps) {
  return (
    <>
      {hasItems && (
        <div className={cn("shrink-0 bg-card px-4 py-3", embedded && "sticky bottom-0 z-30")}>
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-muted-foreground">{embedded ? `${itemCount} item${itemCount === 1 ? "" : "s"} · estimate` : "Total"}</span>
                <span className="text-2xl font-semibold tracking-tight" style={{ color: fabColor }}>R{total}</span>
              </div>
              {totalSavings > 0 && (
                <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <SealPercent size={12} weight="fill" aria-hidden="true" />
                  Saving R{totalSavings} with bulk pricing
                </div>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={onViewQuote}
              className={cn("abh-press inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all duration-150", GLASS.btn)}
              aria-label="View quote as PDF"
              title="View quote as PDF"
            >
              <Eye size={17} weight="bold" aria-hidden="true" /><span className="hidden sm:inline">View</span>
            </button>
            <button
              onClick={onExportPdf}
              className={cn("abh-press inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all duration-150", GLASS.btn)}
              aria-label="Download quote as PDF"
              title="Download quote as PDF"
            >
              <FilePdf size={17} weight="bold" aria-hidden="true" /><span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={onSendQuote}
              className="abh-press flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-[var(--on-whatsapp)] transition-transform duration-150"
              style={{ backgroundColor: "var(--brand-whatsapp)" }}
            >
              <WhatsappLogo size={18} weight="fill" aria-hidden="true" /> <span>Send</span>
            </button>
            </div>
          </div>
        </div>
      )}

      {showClose && <div className="shrink-0 flex justify-center bg-card py-2" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
        <button
          onClick={onClose}
          aria-label="Close quotation calculator"
          title="Close quotation calculator"
          className={cn("abh-press abh-icon-chip size-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-zinc-800 dark:hover:text-zinc-200 transition-all duration-150", GLASS.btn)}
        >
          <X size={18} weight="bold" aria-hidden="true" />
        </button>
      </div>}
    </>
  )
}
