// components/business-status.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Clock } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { getBusinessStatus, type BusinessStatus } from "@/lib/sa-time"
import { HOURS } from "@/lib/brand"
import { NoticePill } from "@/components/notice-pill"

interface HubStatus {
  open: boolean
  label: string
  nextEvent: string
  holidayNote?: string
}

function deriveHubStatuses(status: BusinessStatus): { printDoc: HubStatus; techEtc: HubStatus } {
  const printDoc: HubStatus = {
    open: status.printAndDoc.open,
    label: "Print & Docu",
    nextEvent: status.printAndDoc.label,
    holidayNote: status.isHoliday ? `Today is ${status.holidayName} — still open as usual` : undefined,
  }
  const techEtc: HubStatus = {
    open: status.techDesignEservice.open,
    label: "Tech · Design · E-Service",
    nextEvent: status.techDesignEservice.label,
  }
  return { printDoc, techEtc }
}

// FIX: dropped the rounded/bordered pill background entirely — open and
// closed states now share one minimal treatment: a dot + label, nothing
// else. The old pl-3/-ml-3 indent-compensation trick existed only to make
// wrapped second lines align under the pill's padding; with no pill left,
// that's gone too — this is now a plain flex row, flush at the same left
// edge as "Current Status" above it.
function StatusLine({ status }: { status: HubStatus }) {
  const dotColor = status.open ? "bg-green-500 animate-pulse" : "bg-zinc-400 dark:bg-zinc-500"
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 text-sm text-muted-foreground dark:text-muted-foreground">
      <div className="flex min-w-0 items-center gap-2">
        <span className={cn("size-1.5 shrink-0 rounded-full", dotColor)} />
        <span className="truncate font-medium text-foreground">{status.label}</span>
      </div>
      <span className={cn("text-xs font-medium", status.open ? "text-green-600 dark:text-green-400" : "text-muted-foreground")}>
        {status.open ? "Open" : "Closed"}
      </span>
      <span className="col-span-2 pl-3.5 text-xs leading-relaxed text-muted-foreground/80">{status.nextEvent}</span>
      {status.holidayNote && <p className="col-span-2 pl-3.5 text-xs leading-relaxed text-muted-foreground/70">{status.holidayNote}</p>}
    </div>
  )
}

export function BusinessStatusNavbar() {
  const [status, setStatus] = useState<BusinessStatus | null>(() => getBusinessStatus())
  const [expanded, setExpanded] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  function refresh() {
    setStatus(getBusinessStatus())
  }

  useEffect(() => {
    const id = setInterval(refresh, 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!expanded) return
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setExpanded(false)
      }
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [expanded])

  if (!status) return null
  const { printDoc, techEtc } = deriveHubStatuses(status)

  const anyOpen = printDoc.open || techEtc.open
  const bothOpen = printDoc.open && techEtc.open

  const clockColor = bothOpen
    ? "text-green-500 dark:text-green-400"
    : anyOpen
      ? "text-brand-orange"
      : "text-muted-foreground dark:text-muted-foreground"

  return (
    <div ref={wrapperRef} className="hidden md:flex items-center gap-0">
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-label="Show business hours"
        className="flex items-center justify-center w-7 h-7 active:scale-90 transition-transform"
      >
        <Clock size={18} weight="fill" className={clockColor} />
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out flex items-center gap-1.5"
        style={{
          maxWidth: expanded ? "460px" : "0px",
          opacity: expanded ? 1 : 0,
          marginLeft: expanded ? "8px" : "0px",
        }}
      >
        {printDoc.open ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[0.74rem] font-medium whitespace-nowrap bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400">
            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-green-500 animate-pulse" />
            <span className="font-medium">{printDoc.label}</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-200">Open</span>
            <span className="opacity-40">·</span>
            <span>{printDoc.nextEvent}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[0.74rem] font-medium whitespace-nowrap text-muted-foreground dark:text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full shrink-0 invisible" />
            <span className="font-medium">{printDoc.label}</span>
            <span className="opacity-70 font-normal">Closed</span>
            <span className="opacity-40">·</span>
            <span>{printDoc.nextEvent}</span>
          </div>
        )}
        {techEtc.open ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full border text-[0.74rem] font-medium whitespace-nowrap bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400">
            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-green-500 animate-pulse" />
            <span className="font-medium">{techEtc.label}</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-200">Open</span>
            <span className="opacity-40">·</span>
            <span>{techEtc.nextEvent}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[0.74rem] font-medium whitespace-nowrap text-muted-foreground dark:text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full shrink-0 invisible" />
            <span className="font-medium">{techEtc.label}</span>
            <span className="opacity-70 font-normal">Closed</span>
            <span className="opacity-40">·</span>
            <span>{techEtc.nextEvent}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function BusinessStatusFull() {
  const [status, setStatus] = useState<BusinessStatus | null>(() => getBusinessStatus())

  function refresh() {
    setStatus(getBusinessStatus())
  }

  useEffect(() => {
    const id = setInterval(refresh, 60_000)
    return () => clearInterval(id)
  }, [])

  if (!status) return null
  const { printDoc, techEtc } = deriveHubStatuses(status)

  return (
    <NoticePill
      variant={printDoc.open || techEtc.open ? "success" : "info"}
      Icon={Clock}
      collapsedLabel="Business Hours"
      expandedLabel="Business Hours"
      className="justify-center"
    >
      <div className="mx-auto grid w-full max-w-[720px] gap-5 text-left">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
          <div className="rounded-[14px] border border-border/70 bg-card/35 p-4">
            <p className="text-sm font-semibold text-foreground">{HOURS.printAndDoc.label}</p>
            <p className="mt-1 text-base leading-relaxed text-muted-foreground">{HOURS.printAndDoc.hours}</p>
          </div>
          <div className="rounded-[14px] border border-border/70 bg-card/35 p-4">
            <p className="text-sm font-semibold text-foreground">{HOURS.techDesignEservice.label}</p>
            <div className="mt-1 space-y-1 text-base leading-relaxed text-muted-foreground">
              {HOURS.techDesignEservice.lines.map((line) => <p key={line}>{line}</p>)}
            </div>
          </div>
        </div>
        <div className="border-t border-border/70 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Current status</p>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
            <StatusLine status={printDoc} />
            <StatusLine status={techEtc} />
          </div>
        </div>
      </div>
    </NoticePill>
  )
}
