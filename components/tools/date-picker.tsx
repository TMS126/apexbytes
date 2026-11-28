// components/tools/date-picker.tsx
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { createPortal } from "react-dom"
import { CalendarBlank, CaretLeft, CaretRight } from "@phosphor-icons/react"

export type DatePickerMode = "day" | "month"

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

type Parts = { year: number; month: number; day: number }

const pad = (value: number) => String(value).padStart(2, "0")

function parseValue(value: string, mode: DatePickerMode): Parts | null {
  const pattern = mode === "month" ? /^(\d{4})-(\d{2})$/ : /^(\d{4})-(\d{2})-(\d{2})$/
  const match = pattern.exec(value)
  if (!match) return null
  const month = Number(match[2]) - 1
  if (month < 0 || month > 11) return null
  return { year: Number(match[1]), month, day: mode === "month" ? 1 : Number(match[3]) }
}

function toValue(parts: Parts, mode: DatePickerMode): string {
  const base = `${String(parts.year).padStart(4, "0")}-${pad(parts.month + 1)}`
  return mode === "month" ? base : `${base}-${pad(parts.day)}`
}

/** Today as "YYYY-MM-DD" (day) or "YYYY-MM" (month), using the device's local date. */
export function todayValue(mode: DatePickerMode = "day"): string {
  const now = new Date()
  return toValue({ year: now.getFullYear(), month: now.getMonth(), day: now.getDate() }, mode)
}

/** "2024-03" -> "Mar 2024", "2024-03-09" -> "9 Mar 2024". Empty string if the value is not valid. */
export function formatPickerValue(value: string, mode: DatePickerMode = "day"): string {
  const parts = parseValue(value, mode)
  if (!parts) return ""
  return mode === "month"
    ? `${MONTHS_SHORT[parts.month]} ${parts.year}`
    : `${parts.day} ${MONTHS_SHORT[parts.month]} ${parts.year}`
}

type DatePickerProps = {
  id: string
  value: string
  onChange: (value: string) => void
  mode?: DatePickerMode
  placeholder?: string
  /** Same format as value. */
  min?: string
  max?: string
  /** "YYYY-MM" month shown first when there is no value yet. */
  initialView?: string
  variant?: "box" | "line"
  invalid?: boolean
  ariaLabel?: string
  accent?: string
  onAccent?: string
  minYear?: number
  maxYear?: number
}

export function DatePicker({
  id,
  value,
  onChange,
  mode = "day",
  placeholder = "Choose a date",
  min,
  max,
  initialView,
  variant = "box",
  invalid = false,
  ariaLabel,
  accent = "var(--brand-orange)",
  onAccent = "var(--on-brand-orange)",
  minYear,
  maxYear,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => ({ year: new Date().getFullYear(), month: new Date().getMonth() }))
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const selected = parseValue(value, mode)
  const display = formatPickerValue(value, mode)

  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  const openPicker = () => {
    const now = new Date()
    const base =
      parseValue(value, mode) ??
      parseValue(initialView ?? "", "month") ?? { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() }
    setView({ year: base.year, month: base.month })
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation()
        close()
      }
    }
    window.addEventListener("keydown", onKey, true)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialogRef.current?.focus()
    return () => {
      window.removeEventListener("keydown", onKey, true)
      document.body.style.overflow = previousOverflow
    }
  }, [open, close])

  const isBlocked = (candidate: string) => (min ? candidate < min : false) || (max ? candidate > max : false)

  const choose = (year: number, month: number, day: number) => {
    onChange(toValue({ year, month, day }, mode))
    close()
  }

  const shiftMonth = (delta: number) =>
    setView((current) => {
      const next = new Date(current.year, current.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  const shiftYear = (delta: number) => setView((current) => ({ ...current, year: current.year + delta }))

  const thisYear = new Date().getFullYear()
  const lowYear = minYear ?? (min ? Number(min.slice(0, 4)) : thisYear - 80)
  const highYear = maxYear ?? (max ? Number(max.slice(0, 4)) : thisYear + 10)
  const years: number[] = []
  if (open) {
    for (let year = Math.min(lowYear, view.year); year <= Math.max(highYear, view.year); year += 1) years.push(year)
  }

  const today = todayValue(mode)
  const firstWeekday = (new Date(view.year, view.month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]

  const selectedStyle: CSSProperties = { backgroundColor: accent, color: onAccent }

  const frame: CSSProperties =
    variant === "box"
      ? {
          border: `1px solid ${invalid ? "#dc2626" : "color-mix(in srgb, var(--foreground) 22%, transparent)"}`,
          borderRadius: 14,
          background: "color-mix(in srgb, var(--background) 70%, var(--card))",
          padding: "0 0.875rem",
        }
      : { borderBottom: `1px solid ${invalid ? "#dc2626" : "var(--foreground)"}` }

  const dialog = (
    <div
      className="fixed inset-0 z-[100000] flex items-end justify-center bg-black/55 p-3 sm:items-center"
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? (mode === "month" ? "Choose month and year" : "Choose a date")}
        tabIndex={-1}
        className="w-full max-w-[21rem] rounded-[14px] bg-card p-4 text-card-foreground shadow-2xl outline-none"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <button
            type="button"
            data-no-lift
            aria-label={mode === "month" ? "Previous year" : "Previous month"}
            onClick={() => (mode === "month" ? shiftYear(-1) : shiftMonth(-1))}
            className="flex size-9 shrink-0 items-center justify-center text-foreground"
          >
            <CaretLeft size={18} weight="bold" aria-hidden="true" />
          </button>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
            {mode === "day" && (
              <select
                aria-label="Month"
                value={view.month}
                onChange={(event) => setView((current) => ({ ...current, month: Number(event.target.value) }))}
                className="min-w-0 bg-transparent py-1 text-sm font-semibold text-foreground"
              >
                {MONTHS_LONG.map((name, index) => (
                  <option key={name} value={index}>{name}</option>
                ))}
              </select>
            )}
            <select
              aria-label="Year"
              value={view.year}
              onChange={(event) => setView((current) => ({ ...current, year: Number(event.target.value) }))}
              className="bg-transparent py-1 text-sm font-semibold text-foreground"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            data-no-lift
            aria-label={mode === "month" ? "Next year" : "Next month"}
            onClick={() => (mode === "month" ? shiftYear(1) : shiftMonth(1))}
            className="flex size-9 shrink-0 items-center justify-center text-foreground"
          >
            <CaretRight size={18} weight="bold" aria-hidden="true" />
          </button>
        </div>

        {mode === "day" ? (
          <>
            <div className="grid grid-cols-7 text-center text-[0.7rem] font-semibold uppercase text-muted-foreground">
              {WEEKDAYS.map((day) => (
                <span key={day} className="py-1">{day}</span>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-y-1">
              {cells.map((day, index) => {
                if (day === null) return <span key={`blank-${index}`} />
                const candidate = toValue({ year: view.year, month: view.month, day }, "day")
                const isSelected = selected?.year === view.year && selected.month === view.month && selected.day === day
                const isToday = candidate === today
                return (
                  <button
                    key={candidate}
                    type="button"
                    data-no-lift
                    disabled={isBlocked(candidate)}
                    aria-pressed={isSelected}
                    aria-label={`${day} ${MONTHS_LONG[view.month]} ${view.year}`}
                    onClick={() => choose(view.year, view.month, day)}
                    className="mx-auto flex size-9 items-center justify-center text-sm font-medium text-foreground disabled:opacity-30"
                    style={isSelected ? selectedStyle : isToday ? { boxShadow: `inset 0 0 0 1.5px ${accent}` } : undefined}
                  >
                    <span>{day}</span>
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {MONTHS_SHORT.map((name, month) => {
              const candidate = toValue({ year: view.year, month, day: 1 }, "month")
              const isSelected = selected?.year === view.year && selected.month === month
              return (
                <button
                  key={name}
                  type="button"
                  data-no-lift
                  disabled={isBlocked(candidate)}
                  aria-pressed={isSelected}
                  aria-label={`${MONTHS_LONG[month]} ${view.year}`}
                  onClick={() => choose(view.year, month, 1)}
                  className="flex min-h-11 items-center justify-center text-sm font-medium text-foreground disabled:opacity-30"
                  style={isSelected ? selectedStyle : candidate === today ? { boxShadow: `inset 0 0 0 1.5px ${accent}` } : undefined}
                >
                  <span>{name}</span>
                </button>
              )
            })}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between gap-2 pt-3 text-sm font-semibold" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            type="button"
            data-no-lift
            disabled={!value}
            onClick={() => {
              onChange("")
              close()
            }}
            className="px-2 py-2 text-muted-foreground disabled:opacity-40"
          >
            <span>Clear</span>
          </button>
          <button
            type="button"
            data-no-lift
            disabled={isBlocked(today)}
            onClick={() => { onChange(today); close() }}
            className="px-2 py-2 text-foreground disabled:opacity-40"
          >
            <span>{mode === "month" ? "This month" : "Today"}</span>
          </button>
          <button type="button" data-no-lift onClick={close} className="px-2 py-2 text-foreground">
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div style={frame}>
        <button
          ref={triggerRef}
          id={id}
          type="button"
          data-no-lift
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={ariaLabel}
          onClick={openPicker}
          className={`flex min-h-11 w-full items-center justify-between gap-2 py-2 text-left text-sm text-foreground ${variant === "line" ? "px-1" : ""}`}
        >
          <span className={display ? "text-foreground" : "text-muted-foreground"}>{display || placeholder}</span>
          <CalendarBlank size={18} aria-hidden="true" className="shrink-0 text-muted-foreground" />
        </button>
      </div>
      {open && typeof document !== "undefined" ? createPortal(dialog, document.body) : null}
    </>
  )
}
