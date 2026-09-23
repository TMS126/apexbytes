// components/services-page/shared.tsx
"use client"

import { useEffect, useRef } from "react"
import type { PanInfo } from "framer-motion"
import {
  Printer, FileText, PaintBrush, Globe, Desktop,
} from "@phosphor-icons/react"
import { HubId } from "@/lib/data"
import { ServiceGlyph } from "@/lib/service-icons"
import type { SelectedService } from "./lib"

export function HubIcon({ id, size = 28, color, weight = "regular" }: { id: HubId; size?: number; color?: string; weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone" }) {
  const p = { size, weight, color: color ?? "currentColor", "aria-hidden": true }
  switch (id) {
    case "print":    return <Printer    {...p} />
    case "doc":      return <FileText   {...p} />
    case "design":   return <PaintBrush {...p} />
    case "eservice": return <Globe      {...p} />
    case "tech":     return <Desktop    {...p} />
  }
}

export function ServiceIcon({ name, size = 19 }: { name: string; size?: number }) {
  return <ServiceGlyph label={name} size={size} className="services-page-icon" />
}

export function AbhLoader({ size = 28, color }: { size?: number; color?: string }) {
  return (
    <div
      className="animate-spin rounded-full border-[3px] border-current/20 border-t-current shrink-0"
      style={{ width: size, height: size, color: color ?? "currentColor" }}
      aria-hidden="true"
    />
  )
}

export function DragHandle() {
  return (
    <div className="flex justify-center pt-2.5 pb-0.5 shrink-0" aria-hidden="true">
      <div className="w-9 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
    </div>
  )
}

export function shouldDismissOnDrag(info: PanInfo) {
  return info.offset.y > 120 || info.velocity.y > 600
}

export function useModalBackStack(
  activeHub: HubId | null,
  setActiveHub: (value: HubId | null) => void,
  selectedService: SelectedService | null,
  setSelectedService: (value: SelectedService | null) => void,
) {
  const hubPushed = useRef(false)
  const servicePushed = useRef(false)

  useEffect(() => {
    if (activeHub && !hubPushed.current) {
      if (window.history.state?.abModal !== "hub") window.history.pushState({ abModal: "hub" }, "")
      hubPushed.current = true
    }
    if (selectedService && !servicePushed.current) {
      if (window.history.state?.abModal !== "service") window.history.pushState({ abModal: "service" }, "")
      servicePushed.current = true
    }
    if (!activeHub) hubPushed.current = false
    if (!selectedService) servicePushed.current = false
  }, [activeHub, selectedService])

  useEffect(() => {
    const handlePopState = () => {
      if (selectedService) {
        setSelectedService(null)
        servicePushed.current = false
      } else if (activeHub) {
        setActiveHub(null)
        hubPushed.current = false
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [activeHub, selectedService, setActiveHub, setSelectedService])

  return {
    closeHub: () => { setActiveHub(null); if (window.history.state?.abModal === "hub") window.history.back() },
    closeService: () => { setSelectedService(null); if (window.history.state?.abModal === "service") window.history.back() },
  }
}

export function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  const previouslyFocused = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (!active) return
    previouslyFocused.current = document.activeElement as HTMLElement
    containerRef.current?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !containerRef.current) return
      const focusable = containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return
      const first = focusable[0]; const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => { document.removeEventListener("keydown", handleKeyDown); previouslyFocused.current?.focus?.() }
  }, [active, containerRef])
}
