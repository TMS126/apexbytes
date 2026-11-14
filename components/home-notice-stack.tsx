// components/home-notice-stack.tsx
"use client"

import { useEffect, useId, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "@phosphor-icons/react"
import { TOKEN } from "@/lib/brand"
import { cn } from "@/lib/utils"
import { AnnouncementIconChip } from "@/components/announcement-icon-chip"

export type NoticeVariant = "success" | "info" | "warning" | "error"

export interface HomeNotice {
  id: string
  variant: NoticeVariant
  Icon: React.ElementType
  header: string
  body: string
  sourceLabel?: string
  sourceUrl?: string
  date?: string
}

const VARIANT_TEXT: Record<NoticeVariant, string> = {
  success: TOKEN.greenText,
  info: TOKEN.blueText,
  warning: TOKEN.orangeText,
  error: TOKEN.errorText,
}

function NoticeCard({ notice }: { notice: HomeNotice }) {
  const color = VARIANT_TEXT[notice.variant]
  return (
    <div className="rounded-[14px] border border-border/70 bg-card/35 px-5 py-5">
      <div className="flex items-start gap-3">
        <notice.Icon size={20} weight="bold" style={{ color }} className="shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em]" style={{ color }}>
            {notice.header}
          </h3>
          {notice.date && (
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{notice.date}</p>
          )}
          <p className="text-[1.1rem] font-medium leading-7 abh-body text-zinc-700 dark:text-zinc-200">
            {notice.body}
          </p>
          {notice.sourceUrl && notice.sourceLabel && (
            <a
              href={notice.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 w-fit text-xs italic font-medium text-zinc-500 underline decoration-dotted underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Source: {notice.sourceLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// Collapsed pill only — one notice or many, tapping it always opens the
// modal (there used to be a "single notice expands inline" branch here;
// it was dead code since the modal pattern took over, and has been
// removed). More than one notice: the pill shows a count; the modal
// lists one card per notice, each keeping its own severity color.
//
// The modal is portaled straight to document.body (see SimpleDropdown
// for the same convention elsewhere in this codebase). Any ancestor
// with a CSS transform — which Framer Motion's `layout` prop sets
// inline during animation — becomes the containing block for
// position:fixed descendants instead of the viewport. Without the
// portal, the modal was clipped into whatever stacking context its
// parent landed in and could render behind later page content (e.g.
// the hub cards below it). Portaling sidesteps that entirely.
export function HomeNoticeStack({ notices, className }: { notices: HomeNotice[]; className?: string }) {
  const [dismissed, setDismissed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const titleId = useId()

  // Hydration-safe "are we in the browser yet" check — matches the
  // pattern used by SimpleDropdown rather than a raw `typeof document`
  // check, so this component never touches document during SSR.
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)

  const isMulti = notices.length > 1
  const first = notices[0]

  useEffect(() => {
    if (!modalOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false) }
    window.addEventListener("keydown", onKey)
    const scrollY = window.scrollY
    const { style } = document.body
    style.position = "fixed"
    style.top = `-${scrollY}px`
    style.left = "0"
    style.right = "0"
    style.width = "100%"
    style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      style.position = ""
      style.top = ""
      style.left = ""
      style.right = ""
      style.width = ""
      style.overflow = ""
      window.scrollTo(0, scrollY)
    }
  }, [modalOpen])

  if (dismissed || notices.length === 0) return null

  const handlePillClick = () => {
    setUnread(false)
    setModalOpen(true)
  }

  const collapsedLabel = isMulti ? `${notices.length} Updates` : first.header

  return (
    <>
      <motion.div layout className={cn("w-full flex justify-center", className)} transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-[14px] border border-border bg-card/90 p-1.5 shadow-sm"
        >
          <button
            type="button"
            onClick={handlePillClick}
            aria-haspopup="dialog"
            aria-expanded={modalOpen}
            aria-label={`Open ${notices.length} update${notices.length === 1 ? "" : "s"}`}
            className="relative flex size-11 items-center justify-center rounded-[14px] text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--card-rule)]/40"
          >
            <AnnouncementIconChip unread={unread} />
            <span className="sr-only">{collapsedLabel}</span>
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss notices"
            title="Dismiss notices"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-400"
          >
            <X size={13} weight="bold" aria-hidden="true" />
          </button>
        </motion.div>
      </motion.div>

      {mounted && createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              key="notice-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 z-[99999] bg-black/55 transition-opacity duration-200 dark:bg-black/70 flex items-center justify-center p-4"
              style={{ perspective: 1200 }}
              onClick={() => setModalOpen(false)}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.99 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="transform-gpu will-change-transform relative max-h-[80vh] w-full max-w-[980px] overflow-y-auto bg-background px-5 py-6 sm:px-8 sm:py-8"
                style={{ boxShadow: "0 16px 38px -18px rgba(0,0,0,0.42), 0 5px 14px -8px rgba(0,0,0,0.24)" }}
              >
                <div className="mb-6 pb-5">
                  <h2 id={titleId} className="mb-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {isMulti ? `Updates (${notices.length})` : first.header}
                  </h2>
                  <div className="abh-divider !mx-0 !my-0" />
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    aria-label="Close updates"
                    title="Close updates"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-400 dark:text-zinc-400"
                  >
                    <X size={14} weight="bold" aria-hidden="true" />
                  </button>
                </div>

                <div className="mx-auto w-full max-w-[720px] space-y-4">
                  {notices.map((notice) => (
                    <NoticeCard key={notice.id} notice={notice} />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => { setModalOpen(false); setDismissed(true) }}
                  className="mt-1 text-[0.8rem] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors underline self-center"
                >
                  Dismiss all
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
      } 
