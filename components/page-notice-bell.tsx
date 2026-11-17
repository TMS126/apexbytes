"use client"

import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Buildings, ChatCircleText, FilePdf, Image as ImageIcon, Lightning, Megaphone, SealPercent, Wrench } from "@phosphor-icons/react"
import { ADD_ONS_EFFECTIVE_DATE } from "@/lib/add-ons"
import { TOKEN } from "@/lib/brand"
import { cn } from "@/lib/utils"
import { AnnouncementIconChip } from "@/components/announcement-icon-chip"
import { HOME_NOTICES } from "@/lib/home-notices"

export type NoticeVariant = "success" | "info" | "warning" | "error"
export type NoticePage = "home" | "services" | "gallery" | "contact" | "about" | "pricing" | "tools" | "jpg-to-pdf"

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
}

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
  tools: "Tools",
  "jpg-to-pdf": "JPG to PDF",
}

const PAGE_NOTICES: Record<Exclude<NoticePage, "home">, HomeNotice[]> = {
  services: [
    {
      id: "services-addons",
      variant: "warning",
      Icon: Megaphone,
      category: "Add-ons",
      header: "Add-ons and minor price adjustments",
      date: ADD_ONS_EFFECTIVE_DATE,
      body: "A few optional extras are now available when you need a little more from your service. Thank you for your continued support.",
    },
    {
      id: "services-bulk-deals",
      variant: "info",
      Icon: SealPercent,
      category: "Bulk Deals",
      header: "Better rates at qualifying quantities",
      body: "Selected printing and service items have lower rates at qualifying quantities. Look for the Bulk deals marker on each relevant hub and service.",
    },
  ],
  gallery: [{
    id: "portfolio-context",
    variant: "info",
    Icon: ImageIcon,
    category: "Portfolio",
    header: "Examples of our work",
    body: "This gallery brings together client work, samples, and practice projects to show the kinds of design and print work we can help with.",
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
    category: "About ApexbytesHub",
    header: "Local, practical support",
    body: "ApexbytesHub brings print, design, digital services, and tech support together for the Bothaville community.",
  }],
  pricing: [
    {
      id: "pricing-rush-fee",
      variant: "warning",
      Icon: Lightning,
      category: "Rush Fee",
      header: "Urgent turnaround",
      body: "A 50% surcharge applies when same-session or urgent turnaround is required.",
    },
    {
      id: "pricing-bulk-pricing",
      variant: "info",
      Icon: SealPercent,
      category: "Bulk Pricing",
      header: "Better rates for larger quantities",
      body: "Look for the Bulk tag — larger quantities get a better rate.",
    },
  ],
  tools: [{
    id: "tools-privacy",
    variant: "info",
    Icon: Wrench,
    category: "Privacy",
    header: "Browser-based tools",
    body: "The JPG to PDF converter processes images in your browser. Your files stay on your device unless you choose to share them.",
  }],
  "jpg-to-pdf": [{
    id: "jpg-to-pdf-limits",
    variant: "info",
    Icon: FilePdf,
    category: "File limits",
    header: "Supported images",
    body: "Convert JPG, JPEG, PNG, or WEBP images up to 15 MB each, with a maximum of 20 images per conversion. Processing happens in your browser.",
  }],
}

function NoticeCard({ notice }: { notice: HomeNotice }) {
  const color = VARIANT_TEXT[notice.variant]
  return (
    <article className="rounded-xl border border-border/70 bg-card/55 px-4 py-3.5">
      <div className="flex items-start gap-3">
        <notice.Icon size={19} weight="bold" style={{ color }} className="mt-0.5 shrink-0" aria-hidden="true" />
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color }}>
            {notice.header}
          </h3>
          {notice.date && <p className="text-xs font-medium text-muted-foreground">{notice.date}</p>}
          <p className="text-sm leading-relaxed text-foreground/90">{notice.body}</p>
          {notice.sourceUrl && notice.sourceLabel && (
            <a
              href={notice.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 w-fit text-xs text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Source: {notice.sourceLabel}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export function PageNoticeBell({ page, className }: { page: NoticePage; className?: string }) {
  const notices = page === "home" ? HOME_NOTICES : PAGE_NOTICES[page]
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const panelId = useId()

  const groups = notices.reduce<Array<{ label: string; notices: HomeNotice[] }>>((result, notice) => {
    const label = notice.category ?? VARIANT_LABEL[notice.variant]
    const group = result.find((item) => item.label === label)
    if (group) group.notices.push(notice)
    else result.push({ label, notices: [notice] })
    return result
  }, [])

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

  if (!notices.length) return null

  const toggle = () => {
    const nextOpen = !open
    setOpen(nextOpen)
    if (nextOpen) setUnread(false)
  }

  return (
    <>
      <div className={cn("fixed right-3 top-[calc(var(--nav-h,74px)+0.65rem)] z-[9998] md:right-5", className)}>
        <button
          ref={buttonRef}
          type="button"
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`Open ${PAGE_LABEL[page]} notifications (${notices.length})`}
          className="flex size-11 items-center justify-center text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <AnnouncementIconChip unread={unread} />
        </button>
      </div>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-labelledby={titleId}
              initial={{ opacity: 0, y: -5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="fixed right-3 top-[calc(var(--nav-h,74px)+4.1rem)] z-[9999] max-h-[min(70svh,36rem)] w-[min(24rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border border-border/80 bg-background p-4 shadow-xl md:right-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 id={titleId} className="text-base font-semibold text-foreground">{PAGE_LABEL[page]} notices</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{notices.length} update{notices.length === 1 ? "" : "s"} for this page</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close notifications"
                  className="inline-flex size-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {groups.map((group) => (
                  <section key={group.label} aria-label={group.label}>
                    <h3 className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{group.label}</h3>
                    <div className="flex flex-col gap-2">
                      {group.notices.map((notice) => <NoticeCard key={notice.id} notice={notice} />)}
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
