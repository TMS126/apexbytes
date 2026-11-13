// components/ui/simple-dropdown.tsx
"use client"

import { useState, useRef, useEffect, useLayoutEffect, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import { CaretDown, Check } from "@phosphor-icons/react"

export interface DropdownOption {
  value: string
  label: string
}

// Portaled straight into document.body via createPortal. This is the
// real fix for the overlap bug: any ancestor with a CSS transform
// (Framer Motion sets these inline, and these dropdowns sit inside
// ScrollBounce) becomes the containing block for position:fixed
// descendants instead of the viewport — so the old fixed-positioned
// list was anchoring to the wrong box. Portaling to <body> sidesteps
// that entirely, regardless of what wraps the trigger.
export function SimpleDropdown({
  label, value, options, onChange, accentColor,
}: {
  label: string
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  accentColor: string
}) {
  const [open, setOpen] = useState(false)
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const current = options.find((o) => o.value === value)

  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false)

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return
    const frame = requestAnimationFrame(() => {
      if (!btnRef.current) return
      const r = btnRef.current.getBoundingClientRect()
      const menuWidth = 220
      const left = Math.min(Math.max(8, r.left), Math.max(8, window.innerWidth - menuWidth - 8))
      setRect({ top: r.bottom + 8, left, width: Math.max(r.width, menuWidth) })
    })
    return () => cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false) }
    function onScroll() { setOpen(false) } // avoid a stale-position popover
    function onResize() { setOpen(false) }
    document.addEventListener("keydown", onKey)
    window.addEventListener("scroll", onScroll, true)
    window.addEventListener("resize", onResize)
    return () => {
      document.removeEventListener("keydown", onKey)
      window.removeEventListener("scroll", onScroll, true)
      window.removeEventListener("resize", onResize)
    }
  }, [open])

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex min-h-12 max-w-full items-center gap-3 rounded-[14px] border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700"
      >
        <span className="shrink-0 font-medium text-muted-foreground">{label}:</span>
        <span className="min-w-0 truncate">{current?.label}</span>
        <CaretDown weight="regular" className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && rect && mounted && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} aria-hidden="true" />
          <ul
            role="listbox"
            style={{ position: "fixed", top: rect.top, left: rect.left, minWidth: rect.width }}
            className="z-[9999] w-max max-w-[min(220px,calc(100vw-1rem))] rounded-[14px] border border-zinc-100 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className="flex min-h-10 w-full items-center justify-between gap-3 rounded-[10px] px-3.5 py-2.5 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  {opt.label}
                  {opt.value === value && <Check weight="bold" className="w-4 h-4" style={{ color: accentColor }} aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        </>,
        document.body
      )}
    </>
  )
} 
