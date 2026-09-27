// components/notice-pill.tsx — full file, paste over the current one
"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
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

// Collapsed pill only — the old "inline expand" branch was dead code
// (the modal took over that job) and has been removed.
//
// The modal is portaled straight to document.body, same convention as
// SimpleDropdown and HomeNoticeStack elsewhere in this codebase: any
// ancestor with a CSS transform (Framer Motion's `layout` prop sets
// one inline mid-animation) becomes the containing block for
// position:fixed descendants instead of the viewport, so a
// non-portaled fixed modal can end up clipped into the wrong stacking
// context and render behind later content — e.g. the hub cards on
// Services/Gallery/Pricing. Portaling sidesteps that.
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
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const iconColor = VARIANT_TEXT[variant]
  const headerColor = VARIANT_TEXT[variant]

  // Hydration-safe "are we in the browser yet" check.
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <motion.div layout className={cn("w-full flex justify-center", className)} transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="abh-shadow-badge inline-flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-full border border-border bg-[var(--notice-surface)]"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
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

      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[3px] dark:bg-black/80"
              style={{ perspective: 1200 }}
              onClick={close}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={expandedLabel}
                initial={{ opacity: 0, y: 32, scale: 0.86, rotateX: 14 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, y: 20, scale: 0.92, rotateX: 8 }}
                transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.9 }}
                onClick={(event) => event.stopPropagation()}
                className="transform-gpu will-change-transform relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-[18px] border border-white/20 bg-background p-5 ring-1 ring-black/10 dark:ring-white/10"
                style={{
                  transformStyle: "preserve-3d",
                  boxShadow:
                    "0 48px 110px -20px rgba(0,0,0,0.85), 0 22px 55px -14px rgba(0,0,0,0.6), 0 8px 22px -6px rgba(0,0,0,0.4)",
                }}
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
                <button type="button" onClick={close} aria-label="Close notice" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <X size={14} weight="bold" aria-hidden="true" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  )
      } 
