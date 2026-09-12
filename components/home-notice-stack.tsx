// components/home-notice-stack.tsx
"use client"

import { useEffect, useId, useState } from "react"
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

// Only icon + header carry severity color. Body stays neutral — same
// convention as the shared NoticePill used on Services/Gallery.
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

// Single notice: behaves exactly like the shared NoticePill (collapsed
// pill -> expands inline into one card). More than one notice: the pill
// shows a count and opens a modal instead, with one card per notice —
// each card keeps its own header/icon color per its own severity.
export function HomeNoticeStack({ notices }: { notices: HomeNotice[] }) {
  const [dismissed, setDismissed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [singleExpanded, setSingleExpanded] = useState(false)
  const titleId = useId()

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
    if (isMulti) setModalOpen(true)
    else setSingleExpanded((v) => !v)
  }

  const collapsedColor = isMulti ? TOKEN.orangeText : VARIANT_TEXT[first.variant]
  const collapsedLabel = isMulti ? `${notices.length} Updates` : first.header

  return (
    <>
      <motion.div layout className="w-full flex justify-center" transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}>
        <AnimatePresence mode="wait" initial={false}>
          {!singleExpanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="inline-flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-full bg-background shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
            >
              <button
                type="button"
                onClick={handlePillClick}
                aria-haspopup={isMulti ? "dialog" : undefined}
                aria-expanded={isMulti ? modalOpen : singleExpanded}
                aria-label={isMulti ? `Open ${notices.length} updates` : `Expand: ${first.header}`}
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
          ) : (
            <motion.div
              key="expanded"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-[440px] rounded-[14px] bg-background shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
            >
              <button
                type="button"
                onClick={() => setSingleExpanded(false)}
                aria-expanded={true}
                aria-label={`Collapse: ${first.header}`}
                className="flex items-start gap-3 text-left w-full pl-4 py-4 pr-10 rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-400"
              >
                <first.Icon size={20} weight="bold" style={{ color: collapsedColor }} className="shrink-0 mt-0.5" aria-hidden="true" />
                <span className="flex flex-col gap-1">
                  <span className="text-[0.75rem] font-black uppercase tracking-widest" style={{ color: collapsedColor }}>
                    {first.header}
                  </span>
                  <span className="text-[0.95rem] font-semibold leading-snug abh-body text-zinc-700 dark:text-zinc-200">
                    {first.body}
                  </span>
                  {first.sourceUrl && first.sourceLabel && (
                    <a
                      href={first.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="mt-1 w-fit text-[0.72rem] italic font-medium text-zinc-500 underline decoration-dotted underline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Source: {first.sourceLabel}
                    </a>
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label="Dismiss notice"
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-zinc-400"
              >
                <X size={14} weight="bold" aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isMulti && modalOpen && (
          <motion.div
            key="notice-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/70 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md max-h-[80vh] overflow-y-auto rounded-[14px] bg-background p-5 flex flex-col gap-3"
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
      </AnimatePresence>
    </>
  )
}
