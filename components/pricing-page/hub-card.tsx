// components/pricing-page/hub-card.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { CaretDown, CaretUp, Plus, Check, SealPercent, Clock } from '@phosphor-icons/react'
import { HUBS, type HubId } from '@/lib/data'
import { HubIcon } from '@/components/services-page/shared'
import { PdfPillButton } from './shared'
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
            style={{ backgroundColor: `color-mix(in srgb, ${accent} 8%, transparent)`, color: accent }}
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
            backgroundColor: added ? accent : `color-mix(in srgb, ${accent} 10%, transparent)`,
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

// ── HubCompactCard — desktop 5-column selector card ───────────────────────────
//   Idle              → floating pill, muted icon, full (never-truncated) description
//   Hovered, unselected → floating pill, colored icon, preview bullets — still no border
//   Selected (clicked)  → icon-only, filling the card, hub-colored border — the ONLY
//                         card in this row that ever shows a border

interface HubCompactCardProps {
  hubId: HubId
  isSelected: boolean
  isActive: boolean
  isDark: boolean
  hubHasBulk: boolean
  onSelect: () => void
  onHover: () => void
}

export function HubCompactCard({
  hubId,
  isSelected,
  isActive,
  isDark,
  hubHasBulk,
  onSelect,
  onHover,
}: HubCompactCardProps) {
  const hub = HUBS[hubId]
  const hubColor = isDark ? hub.tagStyleDark.color : hub.tagStyle.color
  const total = hub.sections.reduce((n, s) => n + s.items.length, 0)

  if (isSelected) {
    // ── Pinned/selected: icon only, fills the card, hub-colored border ──
    return (
      <button
        onClick={onSelect}
        onMouseEnter={onHover}
        aria-pressed
        className="h-full w-full rounded-[14px] bg-white dark:bg-zinc-900 shadow-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center"
        style={{ border: `1.5px solid ${hubColor}` }}
      >
        <HubIcon id={hubId} size={40} color={hubColor} />
        <span className="sr-only">{hub.title} — selected</span>
      </button>
    )
  }

  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      aria-pressed={false}
      className="h-full w-full text-left rounded-[14px] px-6 py-6 transition-all duration-200 active:scale-[0.98] bg-white/60 dark:bg-zinc-900/40 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-sm flex flex-col"
    >
      {/* Icon + name row — icon only picks up hub color on hover */}
      <div className="flex items-center gap-2 mb-2.5">
        <HubIcon id={hubId} size={16} color={isActive ? hubColor : '#a1a1aa'} />
        <p
          className="text-sm font-bold truncate transition-colors duration-200"
          style={{ color: isActive ? hubColor : undefined }}
        >
          {hub.title}
        </p>
      </div>

      {/* Hovered: preview bullets. Idle: full description, never truncated. */}
      {isActive ? (
        <ul className="space-y-1 mb-3">
          {hub.previews.slice(0, 3).map(p => (
            <li key={p} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
              <span className="text-sm text-muted-foreground dark:text-muted-foreground">{p}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground dark:text-muted-foreground leading-snug mb-3">
          {hub.desc}
        </p>
      )}

      {/* Footer — service count accented on hover */}
      <div className="flex items-center justify-between mt-auto">
        <span
          className="text-[10px] font-bold transition-colors duration-200"
          style={{ color: isActive ? hubColor : '#a1a1aa' }}
        >
          {total} services
        </span>
        {hubHasBulk && (
          <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
            <SealPercent size={10} weight="fill" aria-hidden="true" />
            Bulk
          </span>
        )}
      </div>
    </button>
  )
}

// ── HubExpandedPanel — desktop: identity + services, one shared footer ─────────
//   Fully separate card now (no fusing with the selector row above), full
//   rounding on every corner, hub-colored border around the whole panel

interface HubExpandedPanelProps {
  hubId: HubId
  accent: string
  isDark: boolean
  justAdded: string | null
  onAdd: (section: string, name: string, price: string) => void
  onDownload: () => void
  hasBulk: (section: string, name: string) => boolean
}

export function HubExpandedPanel({
  hubId,
  accent,
  isDark,
  justAdded,
  onAdd,
  onDownload,
  hasBulk,
}: HubExpandedPanelProps) {
  const hub = HUBS[hubId]
  const hubColor = isDark ? hub.tagStyleDark.color : hub.tagStyle.color
  const total = hub.sections.reduce((n, s) => n + s.items.length, 0)
  const turnaround = TURNAROUND[hubId]

  const [visible, setVisible] = useState(false)
  const prevHub = useRef<HubId | null>(null)

  useEffect(() => {
    if (prevHub.current !== hubId) {
      setVisible(false)
      const t = setTimeout(() => setVisible(true), 30)
      prevHub.current = hubId
      return () => clearTimeout(t)
    }
  }, [hubId])

  return (
    <div
      className="mt-3 rounded-[14px] bg-white dark:bg-zinc-900 overflow-hidden shadow-sm"
      style={{ border: `1.5px solid ${hubColor}` }}
    >
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 220ms ease, transform 220ms ease',
        }}
        aria-live="polite"
      >
        <div className="grid grid-cols-[280px_1fr] gap-0 items-stretch">
          {/* ── Left: Hub identity ── */}
          <div className="px-6 pt-6 pb-6">
            <h2
              className="text-2xl font-black tracking-tight mb-1 leading-tight"
              style={{ color: hubColor }}
            >
              {hub.title}
            </h2>

            <p className="text-sm font-bold mb-4" style={{ color: hubColor, opacity: 0.7 }}>
              {total} services
            </p>

            {/* All sections served */}
            <ul className="space-y-1.5 mb-6">
              {hub.sections.map(s => (
                <li key={s.title} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: hubColor, opacity: 0.5 }}
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">{s.title}</span>
                </li>
              ))}
            </ul>

            <PdfPillButton
              label={hub.title}
              onClick={onDownload}
              size="sm"
              color={hubColor}
            />
          </div>

          {/* ── Right: Services list ── */}
          <div className="overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[460px]">
            {hub.sections.map(section => {
              const sorted = [...section.items].sort(
                (a, b) => parsePrice(a.price) - parsePrice(b.price)
              )
              return (
                <div key={section.title} className="px-6 py-4">
                  <SectionHeader title={section.title} color={hubColor} />
                  {sorted.map(item => (
                    <ServiceRow
                      key={item.name}
                      hubId={hubId}
                      section={section.title}
                      item={item}
                      accent={accent}
                      justAdded={justAdded}
                      isBulk={hasBulk(section.title, item.name)}
                      onAdd={onAdd}
                      alwaysShowAdd={false}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── One shared footer, spanning both columns ── */}
        <div className="flex items-center justify-between gap-4 px-6 py-3.5 bg-zinc-50/80 dark:bg-zinc-800/30">
          <div className="flex items-start gap-2 min-w-0">
            <Clock size={13} weight="bold" style={{ color: hubColor }} className="shrink-0 mt-0.5" aria-hidden="true" />
            <div className="min-w-0">
              <span className="text-xs font-black" style={{ color: hubColor }}>{turnaround.label}</span>
              <span className="text-xs text-muted-foreground ml-1.5">{turnaround.detail}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground shrink-0">No hidden fees.</p>
        </div>
      </div>
    </div>
  )
}

// ── HubAccordionCard — mobile full-width accordion (unchanged from before) ─────

interface HubAccordionCardProps {
  hubId: HubId
  accent: string
  isDark: boolean
  isOpen: boolean
  onToggle: () => void
  justAdded: string | null
  onAdd: (section: string, name: string, price: string) => void
  onRemove: (section: string, name: string, price: string) => void
  onDownload: () => void
  hasBulk: (section: string, name: string) => boolean
  hubHasBulk: boolean
  cardRef: (el: HTMLDivElement | null) => void
}

export function HubAccordionCard({
  hubId,
  accent,
  isDark,
  isOpen,
  onToggle,
  justAdded,
  onAdd,
  onDownload,
  hasBulk,
  hubHasBulk,
  cardRef,
}: HubAccordionCardProps) {
  const hub = HUBS[hubId]
  const hubColor = isDark ? hub.tagStyleDark.color : hub.tagStyle.color
  const total = hub.sections.reduce((n, s) => n + s.items.length, 0)

  return (
    <div
      ref={cardRef}
      className="rounded-[14px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-shadow duration-200"
      style={isOpen ? { borderColor: hubColor } : undefined}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-200"
      >
        <div className="flex items-center gap-3 min-w-0">
          <HubIcon id={hubId} size={18} color={isOpen ? hubColor : '#a1a1aa'} />
          <div className="min-w-0">
            <p className="text-base font-bold text-zinc-900 dark:text-white truncate">
              {hub.title}
            </p>
            <p className="text-sm mt-0.5" style={{ color: isOpen ? hubColor : '#a1a1aa' }}>
              <span className="font-bold">{total} services</span>
              {hubHasBulk ? ' · Bulk deals available' : ''}
            </p>
          </div>
        </div>
        {isOpen
          ? <CaretUp size={14} className="text-muted-foreground shrink-0 transition-transform duration-200" aria-hidden="true" />
          : <CaretDown size={14} className="text-muted-foreground shrink-0 transition-transform duration-200" aria-hidden="true" />
        }
      </button>

      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? '9999px' : '0px' }}
        aria-hidden={!isOpen}
      >
        {isOpen && (
          <div className="border-t border-zinc-100 dark:border-zinc-800">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {hub.sections.map(section => {
                const sorted = [...section.items].sort(
                  (a, b) => parsePrice(a.price) - parsePrice(b.price)
                )
                return (
                  <div key={section.title} className="px-4 py-3">
                    <SectionHeader title={section.title} color={hubColor} />
                    {sorted.map(item => (
                      <ServiceRow
                        key={item.name}
                        hubId={hubId}
                        section={section.title}
                        item={item}
                        accent={accent}
                        justAdded={justAdded}
                        isBulk={hasBulk(section.title, item.name)}
                        onAdd={onAdd}
                        alwaysShowAdd={true}
                      />
                    ))}
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30">
              <p className="text-xs text-muted-foreground">No hidden fees.</p>
              <PdfPillButton label={hub.title} onClick={onDownload} size="sm" color={hubColor} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
  } 
