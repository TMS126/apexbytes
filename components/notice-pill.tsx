// components/notice-pill.tsx — full file, paste over the current one
"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { TOKEN } from "@/lib/brand"
import { AnnouncementIconChip } from "@/components/announcement-icon-chip"

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
  announcement = false,
  dot = false,
  className,
}: {
  variant: NoticeVariant
  Icon: React.ElementType
  collapsedLabel: string
  expandedLabel: string
  children: React.ReactNode
  onDismiss?: () => void
  isDark?: boolean
  announcement?: boolean
  dot?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const [dotVisible, setDotVisible] = useState(dot)
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
    <div className={cn("w-full flex justify-center", className)}>
      <div className={cn(
        "relative abh-shadow-badge inline-flex items-center gap-2 border border-border bg-[var(--notice-surface)]",
        announcement ? "rounded-[14px] p-1.5" : "rounded-full py-1.5 pl-2.5 pr-1.5",
      )}>
        {dotVisible && <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-[var(--brand-orange)] ring-2 ring-background" aria-hidden="true" />}
        <button
          type="button"
          onClick={() => { setUnread(false); setDotVisible(false); setOpen(true) }}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={`Open: ${collapsedLabel}`}
          className={cn(
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-400",
            announcement
              ? "relative flex size-11 items-center justify-center rounded-[14px] text-foreground transition-colors hover:bg-muted"
              : "flex items-center gap-2 rounded-full",
          )}
        >
          {announcement ? (
            <>
              <AnnouncementIconChip unread={unread} />
              <span className="sr-only">{collapsedLabel}</span>
            </>
          ) : (
            <>
              <Icon size={17} weight="regular" style={{ color: iconColor }} aria-hidden="true" />
              <span className="text-[0.95rem] font-semibold whitespace-nowrap" style={{ color: headerColor }}>
                {collapsedLabel}
              </span>
            </>
          )}
        </button>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label={`Dismiss: ${collapsedLabel}`}
            title={`Dismiss: ${collapsedLabel}`}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-400"
          >
            <X size={13} weight="bold" aria-hidden="true" />
          </button>
        )}
      </div>

      {mounted && createPortal(
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/55 p-4 dark:bg-black/70"
              style={{ perspective: 1200 }}
              onClick={close}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={expandedLabel}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.99 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onClick={(event) => event.stopPropagation()}
                className="transform-gpu will-change-transform relative max-h-[80vh] w-full max-w-[980px] overflow-y-auto bg-background px-5 py-6 md:px-8 md:py-8"
                style={{
                  boxShadow: "0 16px 38px -18px rgba(0,0,0,0.42), 0 5px 14px -8px rgba(0,0,0,0.24)",
                }}
              >
                <div className="mb-6 pb-5">
                  <h2 className="abh-section-heading mb-3 text-left text-2xl sm:text-3xl">{expandedLabel}</h2>
                  <div className="abh-divider !mx-0 !my-0" />
                </div>
                <div className="abh-body mx-auto w-full max-w-[720px] text-[1.12rem] leading-8 text-zinc-700 dark:text-zinc-200">
                  {children}
                </div>
                <button type="button" onClick={close} aria-label="Close notice" title="Close notice" className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <X size={14} weight="bold" aria-hidden="true" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
      } 
