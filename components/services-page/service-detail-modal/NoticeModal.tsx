/* components/services-page/service-detail-modal/NoticeModal.tsx */
"use client"

/**
 * ────────────────────────────────────────────────────────────────────────
 * NOTICE MODAL
 *
 * A small standalone popup, separate from TipsModal, that shows a
 * service-specific warning message (e.g. "NSFAS is under administration,
 * expect delays"). It only ever appears when the service the customer
 * is looking at has a `notice` set on it in the data file.
 *
 * Styled in brand ORANGE (not the hub's own accent color) on purpose —
 * a warning should look visually different from a hub-colored tip, so
 * customers instantly recognize it as "something to be aware of" rather
 * than a regular helpful hint.
 *
 * Portaled straight to document.body (same convention as
 * SimpleDropdown / NoticePill / HomeNoticeStack elsewhere in this
 * codebase). This popup used to render inline inside
 * ServiceDetailModal's own tree; if any ancestor there ever picks up a
 * CSS transform (Framer Motion sets one inline mid-animation), that
 * ancestor becomes the containing block for this modal's
 * position:fixed wrapper instead of the viewport, and the notice can
 * end up clipped into the wrong stacking context — rendering behind
 * later page content instead of on top of everything. Portaling
 * removes that dependency entirely, regardless of what
 * ServiceDetailModal does above it.
 * ────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { X, WarningCircle } from "@phosphor-icons/react"
import { TOKEN } from "@/lib/brand"

export function NoticeModal({
  open, onClose, notice, hubTitle,
}: {
  open: boolean          // Whether the modal should be visible at all
  onClose: () => void    // Called when the user taps the X or the backdrop
  notice: string         // The actual warning text to display
  hubTitle: string       // Used only for the accessible aria-label
}) {
  // Hydration-safe "are we in the browser yet" check — the portal
  // target (document.body) doesn't exist during SSR.
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)

  // Close on Escape key, same behavior as TipsModal
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  // Nothing renders at all when closed — no invisible leftover DOM
  if (!open || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[10300] flex items-center justify-center p-4" style={{ perspective: 1200 }}>
      {/* Backdrop — tapping it closes the modal */}
      <div className="absolute inset-0 bg-black/55 animate-in fade-in duration-150" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Notice for ${hubTitle}`}
        className="transform-gpu will-change-transform relative w-full max-w-sm bg-[var(--surface-modal)] border border-border rounded-[14px] max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        style={{
          transformStyle: "preserve-3d",
          boxShadow:
            "0 48px 110px -20px rgba(0,0,0,0.85), 0 22px 55px -14px rgba(0,0,0,0.6), 0 8px 22px -6px rgba(0,0,0,0.4)",
        }}
      >
        {/* ── Header: warning icon + "Notice" title + close button ── */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `color-mix(in srgb, ${TOKEN.orangeText} 8%, transparent)`, color: TOKEN.orangeText }}
            >
              <WarningCircle size={16} weight="fill" aria-hidden="true" />
            </div>
            <h4 className="abh-card-heading text-base truncate">Notice</h4>
          </div>
          <button
            onClick={onClose}
            aria-label="Close notice"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shrink-0"
            style={{ backgroundColor: `color-mix(in srgb, ${TOKEN.orangeText} 8%, transparent)`, color: TOKEN.orangeText }}
          >
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>

        {/* ── Body: the actual notice text, scrollable if it's long ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 min-h-0">
          <p className="abh-body text-[0.95rem] leading-relaxed">{notice}</p>
        </div>
      </div>
    </div>,
    document.body
  )
} 
