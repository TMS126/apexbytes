// components/pricing-page/hub-card.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { CaretDown, CaretUp, DownloadSimple, Plus, Check, SealPercent, Clock } from '@phosphor-icons/react'
import { HUBS, type HubId } from '@/lib/data'
import { parsePrice } from './lib'

// ── Turnaround times per hub ──────────────────────────────────────────────────

const TURNAROUND: Record<HubId, { label: string; detail: string }> = {
  print: {
    label: 'Ready while you wait',
    detail: 'B&W & colour prints done on the spot. Photos may take 5–10 min.',
  },
  doc: {
    label: '15 min – 1 hour',
    detail: 'Typing, CVs and letters done same session. Laminating is instant.',
  },
  design: {
    label: '1–3 business days',
    detail: 'Logos take 2–3 days. Flyers, posts and cards are usually 1 day.',
  },
  eservice: {
    label: 'Same session',
    detail: 'Most applications and checks done while you wait. Complex cases may vary.',
  },
  tech: {
    label: '30 min – same day',
    detail: 'Software installs are quick. Virus removal and OS installs may take a few hours.',
  },
}

// ── Shared section header ──────────────────────────────────────────────────────

function SectionHeader({ title, color }: { title: string; color: string }) {
  return (
    <div className="mb-2.5">
      <p className="text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-200">
        {title}
      </p>
      <span
        className="block w-8 h-[3px] rounded-full mt-1.5 transition-colors duration-200"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
    </div>
  )
}

// ── Shared round download button ───────────────────────────────────────────────

function DownloadPill({ onClick, size = 36 }: { onClick: () => void; size?: number }) {
  return (
    <button
      onClick={onClick}
      aria-label="Download hub PDF"
      className="rounded-full flex items-center justify-center border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 transition-all duration-200 hover:bg-red-500 hover:border-red-500 hover:text-white active:scale-90 shrink-0"
      style={{ width: size, height: size }}
    >
      <DownloadSimple size={Math.round(size * 0.48)} weight="bold" aria-hidden="true" />
    </button>
  )
}

// ── Shared item row ───────────────────────────────────────────────────────────

function ServiceRow({
  hubId,
  section,
  item,
  accent,
  justAdded,
  isBulk,
  onAdd,
  alwaysShowAdd = false,
}: {
  hubId: HubId
  section: string
  item: { name: string; price: string }
  accent: string
  justAdded: string | null
  isBulk: boolean
  onAdd: (section: string, name: string, price: string) => void
  alwaysShowAdd?: boolean
}) {
  const key = `${hubId}-${section}-${item.name}`
  const added = justAdded === key

  return (
    <div className="flex items-center justify-between gap-4 py-3.5 group border-b border-zinc-50 dark:border-zinc-800/50 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-base text-zinc-700 dark:text-zinc-300 truncate">
          {item.name}
        </span>
        {isBulk && (
          <span
            className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 transition-colors duration-200"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            <SealPercent size={9} weight="fill" aria-hidden="true" />
            Bulk
          </span>
        )}
      </div>
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="text-base font-black text-zinc-900 dark:text-white tabular-nums">
          {item.price}
        </span>
        <button
          onClick={() => onAdd(section, item.name, item.price)}
          aria-label={added ? 'Added to quote' : `Add ${item.name} to quote`}
          className={[
            'w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90',
            alwaysShowAdd
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
          ].join(' ')}
          style={{
            backgroundColor: added ? accent : `${accent}18`,
            color: added ? 'white' : accent,
          }}
        >
          {added
            ? <Check size={11} weight="bold" aria-hidden="true" />
            : <Plus size={11} weight="bold" aria-hidden="true" />
          }
        </button>
      </div>
    </div>
  )
}

// ── Turnaround footer strip ───────────────────────────────────────────────────

function TurnaroundStrip({ hubId, hubColor }: { hubId: HubId; hubColor: string }) {
  const t = TURNAROUND[hubId]
  return (
    <div className="flex items-start gap-2.5 px-5 py-3.5 bg-zinc-50/80 dark:bg-zinc-800/30 border-t border-zinc-100 dark:border-zinc-800">
      <Clock
        size={14}
        className="shrink-0 mt-0.5"
        style={{ color: hubColor }}
        aria-hidden="true"
        weight="bold"
      />
      <div className="min-w-0">
        <span className="text-xs font-black" style={{ color: hubColor }}>
          {t.label}
        </span>
        <span className="text-xs text-zinc-400 ml-1.5">{t.detail}</span>
      </div>
    </div>
  )
}

// ── HubCompactCard — desktop 5-column selector card ───────────────────────────

interface HubCompactCardProps {
  hubId: HubId
  isSelected: boolean
  isDark: boolean
  accent: string
  hubHasBulk: boolean
  onSelect: () => void
}

export function HubCompactCard({
  hubId,
  isSelected,
  isDark,
  accent,
  hubHasBulk,
  onSelect,
}: HubCompactCardProps) {
  const hub = HUBS[hubId]
  const hubColor = isDark ? hub.tagStyleDark.color : hub.tagStyle.color
  const total = hub.sections.reduce((n, s) => n + s.items.length, 0)

  return (
    <button
      onClick={onSelect}
      aria-pressed={isSelected}
      className={[
        'w-full text-left rounded-2xl border px-4 py-4 transition-all duration-200',
        'bg-white dark:bg-zinc-900 active:scale-[0.98]',
        isSelected
          ? 'shadow-sm ring-1 rounded-b-none border-b-0 relative z-10'
          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm',
      ].join(' ')}
      style={
        isSelected
          ? { borderColor: hubColor, ['--tw-ring-color' as string]: hubColor }
          : undefined
      }
    >
      {/* Hub name */}
      <p
        className="text-sm font-bold mb-2.5 truncate transition-colors duration-200"
        style={{ color: hubColor }}
      >
        {hub.title}
      </p>

      {/* Preview bullets */}
      <ul className="space-y-1 mb-3">
        {hub.previews.slice(0, 3).map(p => (
          <li key={p} className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
            <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{p}</span>
          </li>
        ))}
      </ul>

      {/* Footer — service count accented when selected */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] font-bold transition-colors duration-200"
          style={isSelected ? { color: hubColor } : { color: '#a1a1aa' }}
        >
          {total} services
        </span>
        {hubHasBulk && (
          <span className="inline-flex items-center gap-0.5 text-[10px] text-zinc-400">
            <SealPercent size={10} weight="fill" aria-hidden="true" />
            Bulk
          </span>
        )}
      </div>
    </button>
  )
}

// ── HubExpandedPanel — desktop: two separate cards showing relation ────────────
//   Left card  = hub ident 
