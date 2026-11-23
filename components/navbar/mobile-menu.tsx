// components/navbar/mobile-menu.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { CaretDown, CaretRight, CaretUp, WhatsappLogo, X } from "@phosphor-icons/react"
import { NAV_ITEMS, BIZ, HUB_NAMES } from "@/lib/brand"
import { HUB_ORDER, hubRouteFor } from "@/components/services-page/lib"
import { cn } from "@/lib/utils"

const SERVICE_LABELS: Record<string, string> = {
  print: "Print",
  doc: "Documents",
  design: "Design",
  eservice: "E-Services",
  tech: "Tech",
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
  const [servicesOpen, setServicesOpen] = useState(true)

  useEffect(() => {
    if (!menuOpen) return
    const html = document.documentElement
    const previousScrollLock = html.getAttribute("data-scroll-locked")
    html.setAttribute("data-scroll-locked", "true")
    previouslyFocused.current = document.activeElement as HTMLElement
    requestAnimationFrame(() => {
      setServicesOpen(true)
      containerRef.current?.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
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
  }, [menuOpen, setMenuOpen])

  const isActive = (path: string) =>
    pathname === path || (path === "/services" && pathname.startsWith("/services")) || (path === "/tools" && pathname.startsWith("/tools"))

  const close = () => setMenuOpen(false)

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      aria-hidden={!menuOpen}
      tabIndex={-1}
      className={cn(
        "fixed inset-0 z-[10005] h-[100dvh] w-screen overflow-y-auto overscroll-contain bg-background text-foreground md:hidden outline-none transition-[opacity,transform] duration-300",
        menuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "pointer-events-none -translate-y-2 opacity-0"
      )}
    >
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[680px] flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
        <header className="flex items-center justify-between border-b border-border/70 pb-5">
          <Link href="/" onClick={close} tabIndex={menuOpen ? 0 : -1} className="font-heading text-[1.65rem] font-semibold tracking-[-0.04em] text-foreground">
            ApexBytesHub
          </Link>
          <button type="button" onClick={close} tabIndex={menuOpen ? 0 : -1} aria-label="Close menu" className="flex size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <X size={28} weight="regular" aria-hidden="true" />
          </button>
        </header>

        <nav className="flex-1" aria-label="Mobile navigation">
          {NAV_ITEMS.filter((item) => !item.isCta).map((item) => {
            const active = isActive(item.path)
            const hasSubmenu = item.id === "services"
            const submenu = hasSubmenu
              ? HUB_ORDER.map((hubId) => ({ id: hubId, label: SERVICE_LABELS[hubId] ?? HUB_NAMES[hubId], path: hubRouteFor(hubId) }))
              : item.id === "tools"
                ? [{ id: "jpg-to-pdf", label: "JPG to PDF", path: "/tools/jpg-to-pdf" }]
                : []

            return (
              <div key={item.id} className="border-b border-border/70">
                <div className="flex min-h-[76px] items-center justify-between gap-4">
                  <Link href={item.path} onClick={close} aria-current={active ? "page" : undefined} tabIndex={menuOpen ? 0 : -1} className={cn("flex-1 py-5 font-heading text-[1.55rem] font-semibold tracking-[-0.035em] transition-colors", active ? "text-brand-blue" : "text-foreground hover:text-brand-blue")}>
                    {item.label}
                  </Link>
                  {hasSubmenu ? (
                    <button type="button" onClick={() => setServicesOpen((open) => !open)} aria-expanded={servicesOpen} aria-label={`${servicesOpen ? "Collapse" : "Expand"} services`} tabIndex={menuOpen ? 0 : -1} className="flex size-11 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {servicesOpen ? <CaretUp size={24} aria-hidden="true" /> : <CaretDown size={24} aria-hidden="true" />}
                    </button>
                  ) : (
                    <CaretRight size={24} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                </div>

                {hasSubmenu && (
                  <div className={cn("grid transition-[grid-template-rows,opacity] duration-200 motion-reduce:transition-none", servicesOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0")}>
                    <div className="min-h-0 overflow-hidden">
                      <div className="flex flex-wrap gap-2">
                        {submenu.map((subitem) => {
                          const selected = pathname === subitem.path || pathname.startsWith(`${subitem.path}/`)
                          return (
                            <Link key={subitem.id} href={subitem.path} onClick={close} aria-current={selected ? "page" : undefined} tabIndex={menuOpen && servicesOpen ? 0 : -1} className={cn("rounded-full bg-[var(--mobile-service-pill)] px-4 py-2.5 text-base font-medium text-[var(--mobile-service-pill-text)] transition-colors hover:bg-[var(--mobile-service-pill-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", selected && "bg-[var(--mobile-service-pill-active)] font-semibold")}>
                              {subitem.label}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {item.id === "tools" && submenu.length > 0 && (
                  <div className="pb-4">
                    <Link href={submenu[0].path} onClick={close} tabIndex={menuOpen ? 0 : -1} className="inline-flex rounded-full bg-[var(--mobile-service-pill)] px-4 py-2 text-sm font-medium text-[var(--mobile-service-pill-text)] hover:bg-[var(--mobile-service-pill-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {submenu[0].label}
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <aside className="mt-5 rounded-[18px] bg-[var(--mobile-whatsapp-surface)] p-5 text-foreground">
          <p className="font-heading text-lg font-semibold">Need it done today?</p>
          <a href={`https://wa.me/${BIZ.phoneE164.replace("+", "")}?text=${encodeURIComponent("Hi ApexBytesHub! I'd like to get help today.")}`} onClick={close} tabIndex={menuOpen ? 0 : -1} className="mt-4 flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[var(--brand-whatsapp-accessible)] px-5 text-lg font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <WhatsappLogo size={26} weight="regular" aria-hidden="true" />
            Chat on WhatsApp
          </a>
          <p className="mt-3 text-center text-sm text-muted-foreground">Mon–Fri 08:00–17:00</p>
        </aside>
      </div>
    </div>
  )
}
