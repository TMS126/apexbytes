// components/page-notice-bell.tsx
"use client"

// ─── IMPORTS ───────────────────────────────────────────────────────────────
import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useMounted } from "@/hooks/use-mounted"
import { Buildings, ChatCircleText, Image as ImageIcon, Lightning, SealPercent } from "@phosphor-icons/react"
import { TOKEN } from "@/lib/brand"
import { cn } from "@/lib/utils"
import { AnnouncementIconChip } from "@/components/announcement-icon-chip"
import { HOME_NOTICES, OFFICIAL_NOTICES } from "@/lib/home-notices"

// ─── TYPES ─────────────────────────────────────────────────────────────────
export type NoticeVariant = "success" | "info" | "warning" | "error"
export type NoticePage = "home" | "services" | "gallery" | "contact" | "about" | "pricing"

export interface HomeNotice {
  id: string
  variant: NoticeVariant
  Icon: React.ElementType
  header: string
  body: string
  category?: string
  sourceLabel?: string
  sourceUrl?: string
  date?: string
  closingDate?: string
}

// ─── LOOKUP TABLES ─────────────────────────────────────────────────────────
const VARIANT_TEXT: Record<NoticeVariant, string> = {
  success: TOKEN.greenText,
  info: TOKEN.blueText,
  warning: TOKEN.orangeText,
  error: TOKEN.errorText,
}

const VARIANT_LABEL: Record<NoticeVariant, string> = {
  success: "Good news",
  info: "Information",
  warning: "Important",
  error: "Action needed",
}

const PAGE_LABEL: Record<NoticePage, string> = {
  home: "Home",
  services: "Services",
  gallery: "Gallery",
  contact: "Contact",
  about: "About",
  pricing: "Pricing",
}

// ─── PER-PAGE NOTICE CONTENT ───────────────────────────────────────────────
const PAGE_NOTICES: Record<Exclude<NoticePage, "home">, HomeNotice[]> = {
  services: [
    ...OFFICIAL_NOTICES,
    {
      id: "services-bulk-deals",
      variant: "info",
      Icon: SealPercent,
      category: "Bulk Deals",
      header: "Bulk service markers",
      body: "Look for the Bulk pricing ribbon on a hub or the Bulk tag on a service to see when a quantity-based option is available.",
    },
  ],
  gallery: [{
    id: "portfolio-context",
    variant: "info",
    Icon: ImageIcon,
    category: "Portfolio",
    header: "Examples of our work",
    body: "This gallery brings together client work, samples, and practice projects to show the kinds of design and print work we can help with.",
  }, {
    id: "gallery-photo-note",
    variant: "info",
    Icon: ImageIcon,
    category: "Photography",
    header: "How to read this gallery",
    body: "Some images are representative examples rather than photos of finished client work. Each project is labelled Real Client Work, Representative Example or Practice Project so you know what you are looking at.",
  }],
  contact: [{
    id: "contact-before-visit",
    variant: "info",
    Icon: ChatCircleText,
    category: "Before you visit",
    header: "Check availability",
    body: "If you’re planning a visit or need a specific service, message us first so we can confirm the right team is available.",
  }],
  about: [{
    id: "about-local-business",
    variant: "info",
    Icon: Buildings,
    category: "About ApexBytesHub",
    header: "Local, practical support",
    body: "ApexBytesHub brings print, document, design, e-service and tech support together for the Kgotsong community in Bothaville.",
  }],
  pricing: [
    {
      id: "pricing-rush-fee",
      variant: "warning",
      Icon: Lightning,
      category: "Rush Fee",
      header: "Check turnaround early",
      body: "If you have a deadline, ask about the Rush 30-Minutes add-on when you request a quote so we can confirm it fits the current queue.",
    },
  ],
}

// ─── NOTICE CARD ───────────────────────────────────────────────────────────
function NoticeCard({ notice, onDismiss }: { notice: HomeNotice; onDismiss: (id: string) => void }) {
  const color = VARIANT_TEXT[notice.variant]
  return (
    <article className="rounded-[14px] border border-border/70 bg-card/55 px-4 py-3.5">
      <div className="flex items-start gap-3">
        <notice.Icon size={19} weight="bold" className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color }}>
            {notice.header}
          </h3>
          {notice.date && <p className="text-sm font-medium text-muted-foreground">{notice.date}</p>}
          {notice.closingDate && <span className="abh-closing-chip mt-1 inline-flex w-fit rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground transition-colors">Closes {notice.closingDate}</span>}
          <p className="text-base leading-relaxed text-foreground/90">{notice.body}</p>
          {notice.sourceUrl && notice.sourceLabel && (
            <a
              href={notice.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 w-fit text-sm text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Source: {notice.sourceLabel}
            </a>
          )}
          <button
            type="button"
            onClick={() => onDismiss(notice.id)}
            className="mt-2 w-fit text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Dismiss this update
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── PAGE NOTICE BELL ──────────────────────────────────────────────────────
export function PageNoticeBell({ page, className }: { page: NoticePage; className?: string }) {
  // ── State & refs ──
  const notices = page === "home" ? HOME_NOTICES : PAGE_NOTICES[page]
  const [open, setOpen] = useState(false)
  const mounted = useMounted()
  const [unread, setUnread] = useState(true)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => new Set())
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const panelId = useId()
  const reduceMotion = useReducedMotion()

  // ── Derived data ──
  const visibleNotices = notices.filter((notice) => !dismissedIds.has(notice.id))
  const groups = visibleNotices.reduce<Array<{ label: string; notices: HomeNotice[] }>>((result, notice) => {
    const label = notice.category ?? VARIANT_LABEL[notice.variant]
    const group = result.find((item) => item.label === label)
    if (group) group.notices.push(notice)
    else result.push({ label, notices: [notice] })
    return result
  }, [])

  // ── Close helper: returns focus to the bell (used by Escape and ×) ──
  const closeAndRestoreFocus = () => {
    setOpen(false)
    buttonRef.current?.focus()
  }

  // ── Effects (all hooks stay above the early return below) ──
  // Portal target only exists on the client; gating on `mounted` avoids a
  // hydration mismatch from rendering a portal during server hydration.

  // Escape closes (focus returns to the bell); clicking outside closes
  // without stealing focus from wherever the person clicked.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!buttonRef.current?.contains(target) && !panelRef.current?.contains(target)) setOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open])

  // Move focus into the panel on open. The panel is portaled to the end of
  // <body>, so without this a keyboard user pressing Tab after opening it
  // would land on whatever follows the bell in the page, not on the notices.
  useEffect(() => {
    if (open) panelRef.current?.focus({ preventScroll: true })
  }, [open])

  if (!visibleNotices.length) return null

  // ── Handlers ──
  const dismissNotice = (id: string) => {
    const next = new Set(dismissedIds)
    next.add(id)
    setDismissedIds(next)
    if (next.size >= notices.length) {
      setOpen(false)
      setUnread(false)
    }
  }

  const toggle = () => {
    const nextOpen = !open
    setOpen(nextOpen)
    if (nextOpen) setUnread(false)
  }

  // ── Motion (opacity-only when the visitor prefers reduced motion) ──
  const panelMotion = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.1 } }
    : {
        initial: { opacity: 0, y: -5, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -4, scale: 0.98 },
        transition: { duration: 0.16, ease: "easeOut" as const },
      }

  // ── Render ──
  return (
    <>
      <div className={cn("abh-page-notice-bell fixed right-3 top-[calc(var(--nav-h,74px)+0.65rem)] z-[9998] md:right-5", className)}>
        <button
          ref={buttonRef}
          type="button"
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-label={`Open ${PAGE_LABEL[page]} notifications (${visibleNotices.length})`}
          className="flex size-11 items-center justify-center text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <AnnouncementIconChip unread={unread} />
        </button>
      </div>

      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-labelledby={titleId}
              tabIndex={-1}
              {...panelMotion}
              className="fixed right-3 top-[calc(var(--nav-h,74px)+4.1rem)] z-[9999] max-h-[calc(100dvh-var(--nav-h,74px)-5.5rem)] w-[min(26rem,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain rounded-[14px] border border-border/80 bg-background p-4 shadow-xl outline-none md:right-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 id={titleId} className="text-lg font-semibold text-foreground">{PAGE_LABEL[page]} notices</h2>
                  <p className="mt-0.5 text-base text-muted-foreground">{visibleNotices.length} update{visibleNotices.length === 1 ? "" : "s"} remaining</p>
                </div>
                <button
                  type="button"
                  onClick={closeAndRestoreFocus}
                  aria-label="Close notifications"
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-[14px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {groups.map((group) => (
                  <section key={group.label} aria-label={group.label}>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">{group.label}</h3>
                    <div className="flex flex-col gap-2">
                      {group.notices.map((notice) => <NoticeCard key={notice.id} notice={notice} onDismiss={dismissNotice} />)}
                    </div>
                  </section>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
      }
