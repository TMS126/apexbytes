// components/business-status.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Clock } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { getBusinessStatus, type BusinessStatus } from "@/lib/sa-time"

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
    <div className="flex flex-col gap-1.5 text-sm font-medium tracking-normal text-muted-foreground dark:text-muted-foreground">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
        <span className="font-medium">{status.label}</span>
        <span className="font-normal opacity-70">{status.open ? "Open" : "Closed"}</span>
        <span className="opacity-40" aria-hidden="true">·</span>
        <span>{status.nextEvent}</span>
      </div>
      {status.holidayNote && <p className="ml-3 text-xs font-medium leading-relaxed opacity-70">{status.holidayNote}</p>}
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
    <div className="rounded-[18px] border border-border/70 bg-card/35 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <Clock size={22} weight="regular" className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current hours</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Business hours</h3>
        </div>
      </div>
      <div className="mt-4 divide-y divide-border/70">
        <div className="py-3 first:pt-0"><StatusLine status={printDoc} /></div>
        <div className="py-3 last:pb-0"><StatusLine status={techEtc} /></div>
      </div>
    </div>
  )
}
