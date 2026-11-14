"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { X, Info } from "@phosphor-icons/react"
import { BIZ } from "@/lib/brand"
import { TERMS_SECTIONS, ICON_COMPONENTS } from "./terms-data"

export function TermsGateModal({ open, onAgree }: { open: boolean; onAgree: () => void }) {
  const guardActive  = useRef(false)
  const closeBtnRef  = useRef<HTMLButtonElement>(null)
  const triggerRef   = useRef<HTMLElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const BUFFER = 5
  const { theme } = useTheme()
  const [mounted] = useState(() => typeof window !== "undefined")


  const resolveColor = (s: { colorLight: string; colorDark: string }) =>
    mounted && theme === "dark" ? s.colorDark : s.colorLight

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement
      const id = setTimeout(() => closeBtnRef.current?.focus(), 50)
      return () => clearTimeout(id)
    } else {
      triggerRef.current?.focus()
    }
  }, [open])

  // ── Accessibility: Tab focus trap. This gate is intentionally
  // non-dismissible (no backdrop click, no Escape — see the history-buffer
  // guard below), so without this a keyboard user could Tab straight past
  // the gate into background content that's still technically in the DOM. ──
  useEffect(() => {
    if (!open) return
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !containerRef.current) return
      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]; const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener("keydown", handleTab)
    return () => document.removeEventListener("keydown", handleTab)
  }, [open])

  useEffect(() => {
    document.documentElement.classList.toggle("scroll-locked", open)
    document.body.classList.toggle("scroll-locked", open)
    return () => {
      document.documentElement.classList.remove("scroll-locked")
      document.body.classList.remove("scroll-locked")
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    guardActive.current = true
    for (let i = 0; i < BUFFER; i++) window.history.pushState({ termsGate: true }, "")
    const onPop = () => {
      if (!guardActive.current) return
      for (let i = 0; i < BUFFER; i++) window.history.pushState({ termsGate: true }, "")
    }
    window.addEventListener("popstate", onPop)
    return () => {
      guardActive.current = false
      window.removeEventListener("popstate", onPop)
    }
  }, [open])

  const handleClose = () => {
    guardActive.current = false
    window.history.go(-BUFFER)
    onAgree()
  }

  if (!open) return null

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Terms & Service Policies"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-white dark:bg-zinc-950 md:bg-black/55 md:dark:bg-black/70 md:p-8 md:backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-background md:h-[85vh] md:max-w-4xl md:rounded-[14px] md:shadow-2xl animate-in md:zoom-in-95 duration-300">

        <div className="relative z-10 flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 pb-5 pt-8 md:px-10">
          <div>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Terms &amp; Service Policies</h2>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              {BIZ.name} · Updated {BIZ.year}
            </p>
          </div>
          <button
            ref={closeBtnRef}
            onClick={handleClose}
            aria-label="Close Terms & Service Policies"
            className="flex size-8 shrink-0 items-center justify-center rounded-[14px] bg-muted text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
          >
            <X size={14} weight="bold" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 md:px-10 py-6 md:py-10">
          <div className="mx-auto max-w-3xl space-y-9">
            <div className="rounded-[14px] border border-border bg-card px-5 py-5">
              <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-foreground">
                <Info weight="fill" className="w-4 h-4" aria-hidden="true" /> Operational Rule
              </h3>
              <p className="text-base leading-7 text-muted-foreground">
                By tapping &ldquo;I Agree&rdquo; below, you confirm full agreement with all operational rules and terms listed here.
              </p>
            </div>

            {TERMS_SECTIONS.map((s, i) => {
              const IconComp = ICON_COMPONENTS[s.icon]
              const color = resolveColor(s)
              return (
                <div key={i} className="space-y-3">
                  <h3 className="flex items-center gap-2 text-base font-semibold" style={{ color }}>
                    <IconComp weight="fill" className="w-4 h-4 shrink-0" aria-hidden="true" style={{ color }} />
                    {s.title}
                  </h3>
                  <ul className="space-y-2 list-disc list-inside pl-1">
                    {s.points.map((p, j) => (
                      <li key={j} className="text-base leading-7 text-muted-foreground">
                        <strong className="text-zinc-700 dark:text-zinc-300">{p.label}:</strong> {p.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex shrink-0 justify-center border-t border-border bg-background px-6 py-6 md:px-10">
          <button
            onClick={handleClose}
            className="rounded-[14px] bg-[var(--brand-blue-dark)] px-10 py-3 text-base font-semibold text-[var(--background)] shadow-sm transition-transform active:scale-[0.98]"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  )
}
