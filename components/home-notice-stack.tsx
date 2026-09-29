// components/home-notice-stack.tsx
"use client"

import { useEffect, useId, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "@phosphor-icons/react"
import { TOKEN } from "@/lib/brand"

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
    <div className="rounded-[14px] bg-secondary px-4 py-4">
      <div className="flex items-start gap-3">
        <notice.Icon size={20} weight="bold" style={{ color }} className="shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-[0.78rem] font-black uppercase tracking-widest" style={{ color }}>
            {notice.header}
          </h3>
          {notice.date && (
            <p className="text-[0.72rem] font-bold text-zinc-500 dark:text-zinc-400">{notice.date}</p>
          )}
          <p className="text-[0.9rem] font-semibold leading-snug abh-body text-zinc-700 dark:text-zinc-200">
            {notice.body}
          </p>
          {notice.sourceUrl && notice.sourceLabel && (
            <a
              href={notice.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 w-fit text-[0.72rem] italic font-medium text-zinc-500 underline decoration-dotted underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
export function HomeNoticeStack({ notices }: { notices: HomeNotice[] }) {
  const [dismissed, setDismissed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
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

  const handlePillClick = () => setModalOpen(true)

  const collapsedColor = isMulti ? TOKEN.orangeText : VARIANT_TEXT[first.variant]
  const collapsedLabel = isMulti ? `${notices.length} Updates` : first.header

  return (
    <>
      <motion.div layout className="w-full flex justify-center" transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="inline-flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-full bg-background shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        >
          <button
            type="button"
            onClick={handlePillClick}
            aria-haspopup="dialog"
            aria-expanded={modalOpen}
            aria-label={`Open ${notices.length} update${notices.length === 1 ? "" : "s"}`}
            className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-400"
          >
            <first.Icon size={16} weight="bold" style={{ color: collapsedColor }} aria-hidden="true" />
            <span className="text-[0.92rem] font-bold whitespace-nowrap" style={{ color: collapsedColor }}>
              {collapsedLabel}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss notices"
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
              className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-[3px] dark:bg-black/80 flex items-center justify-center p-4"
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
                transition={{ duration: 0.18, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="transform-gpu will-change-transform relative w-full max-w-md max-h-[80vh] overflow-y-auto rounded-[18px] border border-white/20 bg-background p-5 flex flex-col gap-3 ring-1 ring-black/10 dark:ring-white/10"
                style={{ boxShadow: "0 16px 38px -18px rgba(0,0,0,0.42), 0 5px 14px -8px rgba(0,0,0,0.24)" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <h2 id={titleId} className="text-[0.78rem] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    Updates ({notices.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    aria-label="Close updates"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-400"
                  >
                    <X size={14} weight="bold" aria-hidden="true" />
                  </button>
                </div>

                {notices.map((notice) => (
                  <NoticeCard key={notice.id} notice={notice} />
                ))}

                <button
                  type="button"
                  onClick={() => { setModalOpen(false); setDismissed(true) }}
                  className="mt-1 text-[0.8rem] font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors underline self-center"
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
