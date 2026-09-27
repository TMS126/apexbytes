// components/notice-pill.tsx — full file, paste over the current one
"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { TOKEN } from "@/lib/brand"

export type NoticeVariant = "success" | "info" | "warning" | "error"

const VARIANT_TEXT: Record<NoticeVariant, string> = {
  success: TOKEN.greenText,
  info: TOKEN.blueText,
  warning: TOKEN.orangeText,
  error: TOKEN.errorText,
}

export function NoticePill({
  variant,
  Icon,
  collapsedLabel,
  expandedLabel,
  children,
  onDismiss,
  className,
}: {
  variant: NoticeVariant
  Icon: React.ElementType
  collapsedLabel: string
  expandedLabel: string
  children: React.ReactNode
  onDismiss?: () => void
  isDark?: boolean
  className?: string
}) {
  const [modalOpen, setModalOpen] = useState(false)

  const iconColor = VARIANT_TEXT[variant]
  // Variant accents remain identity cues, while the surface/text pair is
  // always readable in both themes.
  const headerColor = VARIANT_TEXT[variant]

  return (
    <motion.div layout className={cn("w-full flex justify-center", className)} transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}>
      <AnimatePresence mode="wait" initial={false}>
        {true ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="abh-shadow-badge inline-flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-full border border-border bg-[var(--notice-surface)]"
          >
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              aria-expanded={modalOpen}
              aria-haspopup="dialog"
              aria-label={`Open: ${collapsedLabel}`}
              className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-400"
            >
              <Icon size={16} weight="bold" style={{ color: iconColor }} aria-hidden="true" />
              <span className="text-[0.92rem] font-bold whitespace-nowrap" style={{ color: headerColor }}>
                {collapsedLabel}
              </span>
            </button>

            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                aria-label={`Dismiss: ${collapsedLabel}`}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-400"
              >
                <X size={13} weight="bold" aria-hidden="true" />
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="abh-shadow-badge relative w-full max-w-[440px] rounded-[14px] border border-border bg-[var(--notice-surface)] md:max-w-3xl lg:max-w-5xl"
          >
            <div className={cn("flex items-start gap-3 text-left w-full pl-4 pt-4", onDismiss ? "pr-10" : "pr-4")}>
              <Icon size={20} weight="bold" style={{ color: iconColor }} className="shrink-0 mt-0.5" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                aria-expanded={modalOpen}
                aria-haspopup="dialog"
                aria-label={`Open: ${expandedLabel}`}
                className="rounded-[8px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-400"
              >
                <span className="text-[0.75rem] font-black uppercase tracking-widest" style={{ color: headerColor }}>
                  {expandedLabel}
                </span>
              </button>
            </div>
            <div className="max-h-[55vh] overflow-y-auto px-4 pb-4 pt-2 pl-[3.25rem] text-[0.95rem] font-semibold leading-snug abh-body text-zinc-700 dark:text-zinc-200">
              {children}
            </div>

            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                aria-label={`Dismiss: ${expandedLabel}`}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground dark:text-muted-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-400"
              >
                <X size={14} weight="bold" aria-hidden="true" />
              </button>
            )}
          </motion.div>
        )}
        </AnimatePresence>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 dark:bg-black/70"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={expandedLabel}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-[14px] border border-border bg-background p-5 shadow-2xl"
            >
              <div className="flex items-start gap-3 pr-8">
                <Icon size={20} weight="bold" style={{ color: iconColor }} className="mt-0.5 shrink-0" aria-hidden="true" />
                <h2 className="text-[0.78rem] font-black uppercase tracking-widest" style={{ color: headerColor }}>
                  {expandedLabel}
                </h2>
              </div>
              <div className="pl-[2rem] pt-3 text-[0.95rem] font-semibold leading-snug abh-body text-zinc-700 dark:text-zinc-200">
                {children}
              </div>
              <button type="button" onClick={() => setModalOpen(false)} aria-label="Close notice" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <X size={14} weight="bold" aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

