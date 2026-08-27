// components/pricing-page/shared.tsx
"use client"

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { SealPercent, FilePdf } from '@phosphor-icons/react'

// ── Bulk pricing flag — plain flag, no percent ──
export function BulkBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[0.68rem] font-black uppercase tracking-wide px-2 py-0.5 rounded-full text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
      aria-label="Bulk pricing available"
    >
      <SealPercent size={11} weight="fill" aria-hidden="true" />
      Bulk
    </span>
  )
}

// ── PDF download pill ──
// FIX: the harsh fixed Adobe-red identity clashed visually against every
// hub's own color scheme. Now accepts an optional `color` — pricing-page
// call sites pass their own hub/brand accent instead. If no color is
// passed, falls back to the original Adobe red so nothing elsewhere breaks.
const ADOBE_RED_LIGHT = '#EC1C24'
const ADOBE_RED_DARK = '#F0857D'
const ADOBE_RED_HOVER_LIGHT = '#A9121A'
const ADOBE_RED_HOVER_DARK = '#C23A33'

function darken(hex: string, amount = 0.22): string {
  const n = hex.replace('#', '')
  const r = Math.max(0, Math.round(parseInt(n.slice(0, 2), 16) * (1 - amount)))
  const g = Math.max(0, Math.round(parseInt(n.slice(2, 4), 16) * (1 - amount)))
  const b = Math.max(0, Math.round(parseInt(n.slice(4, 6), 16) * (1 - amount)))
  return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`
}

export function PdfPillButton({
  label, onClick, size = 'sm', color,
}: {
  label: string
  onClick: () => void
  size?: 'sm' | 'lg'
  color?: string
}) {
  const { resolvedTheme } = useTheme()
  const [hovered, setHovered] = useState(false)
  const isDark = resolvedTheme === 'dark'
  const isLg = size === 'lg'

  const restColor = color ?? (isDark ? ADOBE_RED_DARK : ADOBE_RED_LIGHT)
  const hoverSolid = color ? darken(color) : (isDark ? ADOBE_RED_HOVER_DARK : ADOBE_RED_HOVER_LIGHT)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={label}
      title={label}
      className={`inline-flex items-center gap-2 rounded-[14px] font-black transition-all duration-150 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 active:shadow-sm active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900 ${
        isLg ? 'px-5 py-3 text-[1.05rem]' : 'px-4 py-2 text-[0.9rem]'
      }`}
      style={{
        color: hovered ? '#ffffff' : restColor,
        borderColor: hovered ? hoverSolid : `${restColor}35`,
        backgroundColor: hovered ? hoverSolid : `${restColor}12`,
        border: '1px solid',
        ['--tw-ring-color' as unknown as keyof import("react").CSSProperties]: restColor,
      }}
    >
      <FilePdf size={isLg ? 20 : 16} weight="fill" aria-hidden="true" />
      {label}
    </button>
  )
        } 
