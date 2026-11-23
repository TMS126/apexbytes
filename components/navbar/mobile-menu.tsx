// components/navbar/mobile-menu.tsx
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Archive,
  CaretRight,
  CaretUp,
  ClipboardText,
  CreditCard,
  EnvelopeSimple,
  FileText,
  Gear,
  Globe,
  Image,
  Laptop,
  PenNib,
  Printer,
  Scan,
  ShareNetwork,
  WhatsappLogo,
  Wrench,
  X,
} from "@phosphor-icons/react"
import type { Icon } from "@phosphor-icons/react"
import { NAV_ITEMS, BIZ, HUB_NAMES } from "@/lib/brand"
import { HUBS, type HubId } from "@/lib/data"
import { HUB_ORDER, hubRouteFor, serviceRouteFor } from "@/components/services-page/lib"
import { cn } from "@/lib/utils"

const SERVICE_LABELS: Record<HubId, string> = {
  print: "Print",
  doc: "Documents",
  design: "Design",
  eservice: "E-Services",
  tech: "Tech",
}

const TOOL_LINKS = [
  { id: "quote", label: "Quote Calculator", path: "/tools/quote" },
  { id: "jpg-to-pdf", label: "JPG to PDF", path: "/tools/jpg-to-pdf" },
  { id: "cv-writing", label: "CV Writing / CV Typing", path: "/tools/cv-writing" },
  { id: "intake-form", label: "Intake Form Filling", path: "/tools/intake-form" },
] as const

const SERVICE_ICONS: Record<string, Icon> = {
  Printing: Printer,
  Copying: ClipboardText,
  "Photo Printing": Image,
  "Typing + Printing": FileText,
  Scanning: Scan,
  Laminating: Archive,
  "Business Cards": CreditCard,
  "Flyers & Posters": FileText,
  "Social Media": ShareNetwork,
  Invitations: EnvelopeSimple,
  "Business Profile": Globe,
  Revisions: PenNib,
  SASSA: ClipboardText,
  SARS: FileText,
  PSIRA: ClipboardText,
  "Online Applications": Globe,
  "Email Services": EnvelopeSimple,
  "Business Services": Gear,
  Software: Gear,
  Hardware: Wrench,
  Support: Wrench,
  "Windows & Office": Laptop,
}

interface MobileMenuProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  pathname: string
  neutralColor: string
}

export function MobileMenu({ menuOpen, setMenuOpen, pathname }: MobileMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [expandedHub, setExpandedHub] = useState<HubId | null>(null)

  const close = useCallback(() => {
    setServicesOpen(false)
    setToolsOpen(false)
    setExpandedHub(null)
    setMenuOpen(false)
  }, [setMenuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const html = document.documentElement
    const previousScrollLock = html.getAttribute("data-scroll-locked")
    html.setAttribute("data-scroll-locked", "true")
    previouslyFocused.current = document.activeElement as HTMLElement
    requestAnimationFrame(() => containerRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close()
        return
      }
      if (event.key !== "Tab" || !containerRef.current) return
      const focusable = Array.from(containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter((element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden")
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      if (previousScrollLock === null) html.removeAttribute("data-scroll-locked")
      else html.setAttribute("data-scroll-locked", previousScrollLock)
      previouslyFocused.current?.focus?.()
    }
  }, [menuOpen, close])

  const isActive = (path: string) =>
    pathname === path || (path === "/services" && pathname.startsWith("/services")) || (path === "/tools" && pathname.startsWith("/tools"))

  const toggleServices = () => {
    setServicesOpen((open) => !open)
    setToolsOpen(false)
  }
  const toggleTools = () => {
    setToolsOpen((open) => !open)
    setServicesOpen(false)
  }

  const renderServiceLinks = (hubId: HubId) => (
    <div className="grid gap-0.5 border-l border-border/70 pl-3">
      {HUBS[hubId].sections.flatMap((section) =>
        section.items.map((service) => {
          const IconComponent = SERVICE_ICONS[section.title] ?? FileText
          const servicePath = serviceRouteFor(hubId, section.title, service.name)
          const selected = pathname === servicePath
          return (
            <Link
              key={servicePath}
              href={servicePath}
              onClick={close}
              aria-current={selected ? "page" : undefined}
              tabIndex={menuOpen && servicesOpen && expandedHub === hubId ? 0 : -1}
              className={cn(
                "group flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 text-[0.98rem] text-foreground transition-[background-color,color,transform] duration-180 ease-out hover:bg-muted hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.985] motion-reduce:transition-none",
                selected && "bg-muted font-semibold text-brand-blue"
              )}
            >
              <IconComponent size={21} weight="regular" className="shrink-0 text-brand-blue" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{service.name}</span>
              <CaretRight size={17} className="shrink-0 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
            </Link>
          )
        })
      )}
    </div>
  )

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      aria-hidden={!menuOpen}
      tabIndex={-1}
      className={cn(
        "abh-mobile-nav fixed inset-0 z-[10005] h-[100dvh] w-screen overflow-y-auto overscroll-contain bg-background text-foreground xl:hidden outline-none transition-[opacity,transform] duration-300",
        menuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "pointer-events-none -translate-y-2 opacity-0"
      )}
    >
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[680px] flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
        <header className="flex items-center justify-between border-b border-border/70 pb-5">
          <Link href="/" onClick={close} tabIndex={menuOpen ? 0 : -1} className="font-heading text-[1.7rem] font-bold tracking-[-0.045em] text-foreground transition-colors duration-150 hover:text-brand-blue active:scale-[0.985] motion-reduce:transition-none">
            ApexBytesHub
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/tools/quote" onClick={close} tabIndex={menuOpen ? 0 : -1} className="rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-[var(--ui-shadow-popup)] transition-[transform,box-shadow] duration-160 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] motion-reduce:transition-none">
              Get a quote
            </Link>
            <button type="button" onClick={close} tabIndex={menuOpen ? 0 : -1} aria-label="Close menu" className="flex size-11 items-center justify-center rounded-full text-foreground transition-[background-color,transform] duration-160 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.94] motion-reduce:transition-none">
              <X size={28} weight="regular" aria-hidden="true" />
            </button>
          </div>
        </header>

        <nav className="flex-1" aria-label="Mobile navigation">
          {NAV_ITEMS.filter((item) => !item.isCta).map((item) => {
            const active = isActive(item.path)
            const hasSubmenu = item.id === "services" || item.id === "tools"
            const parentOpen = item.id === "services" ? servicesOpen : toolsOpen

            return (
              <div key={item.id} className="border-b border-border/70">
                <div className="flex min-h-[76px] items-center gap-3">
                  <Link
                    href={item.path}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    tabIndex={menuOpen ? 0 : -1}
                    className={cn(
                      "flex-1 py-5 font-heading text-[1.55rem] font-semibold tracking-[-0.035em] transition-[color,transform] duration-160 hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.985] motion-reduce:transition-none",
                      active ? "text-brand-blue" : "text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                  {hasSubmenu ? (
                    <button
                      type="button"
                      onClick={item.id === "services" ? toggleServices : toggleTools}
                      aria-expanded={parentOpen}
                      aria-controls={`${item.id}-submenu`}
                      aria-label={`${parentOpen ? "Collapse" : "Expand"} ${item.label.toLowerCase()}`}
                      tabIndex={menuOpen ? 0 : -1}
                      className="flex size-11 shrink-0 items-center justify-center rounded-full text-foreground transition-[background-color,transform] duration-160 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.9] motion-reduce:transition-none"
                    >
                      {parentOpen ? <CaretUp size={24} aria-hidden="true" /> : <CaretRight size={24} aria-hidden="true" />}
                    </button>
                  ) : null}
                </div>

                {item.id === "services" && (
                  <div id="services-submenu" aria-hidden={!servicesOpen} className={cn("grid transition-[grid-template-rows,opacity,transform] duration-220 ease-out motion-reduce:transition-none", servicesOpen ? "grid-rows-[1fr] pb-5 opacity-100 translate-y-0" : "pointer-events-none grid-rows-[0fr] opacity-0 -translate-y-1")}>
                    <div className="min-h-0 overflow-hidden">
                      <div className="grid gap-1">
                        {HUB_ORDER.map((hubId) => {
                          const hubOpen = expandedHub === hubId
                          const hubSelected = pathname.startsWith(hubRouteFor(hubId))
                          return (
                            <div key={hubId} className="rounded-xl">
                              <div className="flex items-center gap-2">
                                <Link href={hubRouteFor(hubId)} onClick={close} aria-current={hubSelected ? "page" : undefined} tabIndex={menuOpen && servicesOpen ? 0 : -1} className={cn("flex-1 px-3 py-3 text-base font-medium transition-[color,transform] duration-160 hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.985] motion-reduce:transition-none", hubSelected && "font-semibold text-brand-blue")}>
                                  {SERVICE_LABELS[hubId] ?? HUB_NAMES[hubId]}
                                </Link>
                                <button type="button" onClick={() => setExpandedHub((current) => current === hubId ? null : hubId)} aria-expanded={hubOpen} aria-controls={`hub-${hubId}-services`} aria-label={`${hubOpen ? "Collapse" : "Expand"} ${SERVICE_LABELS[hubId]} services`} tabIndex={menuOpen && servicesOpen ? 0 : -1} className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-[background-color,transform] duration-160 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.9] motion-reduce:transition-none">
                                  {hubOpen ? <CaretUp size={19} aria-hidden="true" /> : <CaretRight size={19} aria-hidden="true" />}
                                </button>
                              </div>
                              <div id={`hub-${hubId}-services`} aria-hidden={!hubOpen} className={cn("grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none", hubOpen ? "grid-rows-[1fr] pb-2 opacity-100" : "grid-rows-[0fr] opacity-0")}>
                                <div className="min-h-0 overflow-hidden">{renderServiceLinks(hubId)}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {item.id === "tools" && (
                  <div id="tools-submenu" aria-hidden={!toolsOpen} className={cn("grid transition-[grid-template-rows,opacity,transform] duration-220 ease-out motion-reduce:transition-none", toolsOpen ? "grid-rows-[1fr] pb-5 opacity-100 translate-y-0" : "pointer-events-none grid-rows-[0fr] opacity-0 -translate-y-1")}>
                    <div className="min-h-0 overflow-hidden">
                      <div className="grid gap-1 border-l border-border/70 pl-3">
                        {TOOL_LINKS.map((tool) => {
                          const selected = pathname === tool.path
                          return <Link key={tool.id} href={tool.path} onClick={close} aria-current={selected ? "page" : undefined} tabIndex={menuOpen && toolsOpen ? 0 : -1} className={cn("flex min-h-12 items-center justify-between rounded-xl px-3 py-2 text-base text-foreground transition-[background-color,color,transform] duration-160 hover:bg-muted hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.985] motion-reduce:transition-none", selected && "bg-muted font-semibold text-brand-blue")}><span className="truncate">{tool.label}</span><CaretRight size={17} className="shrink-0 text-muted-foreground" aria-hidden="true" /></Link>
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <aside className="mt-5 rounded-[18px] bg-[#10251b] p-5 text-white shadow-[var(--ui-shadow-popup)]">
          <p className="font-heading text-lg font-semibold">Need it done today?</p>
          <a href={`https://wa.me/${BIZ.phoneE164.replace("+", "")}?text=${encodeURIComponent("Hi ApexBytesHub! I'd like to get help today.")}`} onClick={close} tabIndex={menuOpen ? 0 : -1} className="mt-4 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[var(--brand-whatsapp-accessible)] px-5 text-lg font-semibold text-white transition-[transform,box-shadow] duration-160 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] motion-reduce:transition-none">
            <WhatsappLogo size={26} weight="regular" aria-hidden="true" />
            Chat on WhatsApp
          </a>
        </aside>
      </div>
    </div>
  )
}
