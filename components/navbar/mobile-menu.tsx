// components/navbar/mobile-menu.tsx
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { NAV_ITEMS, TOKEN, HUB_NAMES } from "@/lib/brand"
import { HUB_ORDER, hubRouteFor } from "@/components/services-page/lib"
import { CaretDown } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const HOVER_TEXT = TOKEN.orangeText

function isNavPathActive(pathname: string, path: string): boolean {
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`)
}

interface MobileMenuProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  pathname: string
  neutralColor: string
}

export function MobileMenu({ menuOpen, setMenuOpen, pathname, neutralColor }: MobileMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const closeMenu = useCallback(() => {
    setOpenSubmenu(null)
    setMenuOpen(false)
  }, [setMenuOpen])

  useEffect(() => {
    if (!menuOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement
    containerRef.current?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu()
        return
      }
      if (e.key !== "Tab" || !containerRef.current) return
      const focusable = Array.from(containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )).filter((element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden")
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      previouslyFocused.current?.focus?.()
    }
  }, [menuOpen, closeMenu])

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      aria-hidden={!menuOpen}
      tabIndex={-1}
      className={cn(
        "fixed inset-0 z-[9998] md:hidden outline-none transition-[visibility,opacity] duration-200",
        menuOpen ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0 pointer-events-none"
      )}
    >
      <div
        className="absolute inset-0 bg-black/20 dark:bg-black/45"
        onClick={closeMenu}
        aria-hidden="true"
      />

      <div className="relative z-10 mt-[calc(var(--nav-h,4.5rem)+var(--banner-h,0px))] max-h-[calc(100dvh-var(--nav-h,4.5rem)-var(--banner-h,0px))] overflow-y-auto border-t border-border/70 bg-background px-5 pb-8 pt-4 shadow-2xl">
        <nav className="mx-auto flex w-full max-w-[440px] flex-col gap-2" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item, idx) => {
            const isActive = isNavPathActive(pathname, item.path)
            const submenu = item.id === "services"
              ? HUB_ORDER.map((hubId) => ({ label: HUB_NAMES[hubId], path: hubRouteFor(hubId) }))
              : item.id === "tools"
                ? [{ label: "All tools", path: "/tools" }, { label: "JPG to PDF", path: "/tools/jpg-to-pdf" }]
                : null
            const submenuIsOpen = openSubmenu === item.id

            if (item.isCta) {
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={closeMenu}
                  style={{ transitionDelay: menuOpen ? `${idx * 35}ms` : "0ms", backgroundColor: "var(--surface-accent)", color: "var(--text-on-accent)" }}
                  className={cn("w-full rounded-[14px] px-6 py-3 text-center font-sans text-base font-semibold transition-all duration-200 active:scale-[0.98]", menuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}
                >
                  {item.label}
                </Link>
              )
            }

            return (
              <div
                key={item.id}
                className={cn("flex w-full flex-col gap-1 transition-all duration-200", menuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}
                style={{ transitionDelay: menuOpen ? `${idx * 35}ms` : "0ms" }}
              >
                <div className="flex w-full items-stretch gap-1">
                  <Link
                    href={item.path}
                    aria-current={isActive ? "page" : undefined}
                    tabIndex={menuOpen ? 0 : -1}
                    onClick={closeMenu}
                    style={{ color: isActive ? HOVER_TEXT : neutralColor, borderColor: isActive ? HOVER_TEXT : "var(--border)" }}
                    className={cn("flex min-h-12 flex-1 items-center rounded-[14px] border bg-card/70 px-5 py-3 text-left font-sans text-base font-semibold transition-colors hover:bg-card active:scale-[0.99]", isActive && "bg-card")}
                  >
                    {item.label}
                  </Link>
                  {submenu && (
                    <button
                      type="button"
                      aria-label={`${submenuIsOpen ? "Collapse" : "Expand"} ${item.label.toLowerCase()} options`}
                      aria-expanded={submenuIsOpen}
                      aria-controls={`mobile-submenu-${item.id}`}
                      tabIndex={menuOpen ? 0 : -1}
                      onClick={() => setOpenSubmenu(submenuIsOpen ? null : item.id)}
                      className="flex min-h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-border bg-card/70 text-foreground transition-colors hover:bg-card"
                    >
                      <CaretDown size={18} weight="regular" className={cn("transition-transform duration-200", submenuIsOpen && "rotate-180")} aria-hidden="true" />
                    </button>
                  )}
                </div>

                {submenu && submenuIsOpen && (
                  <div id={`mobile-submenu-${item.id}`} className="ml-3 flex flex-col gap-1 border-l-2 border-border px-2 py-1" role="region" aria-label={`${item.label} options`}>
                    {submenu.map((subitem) => {
                      const subActive = isNavPathActive(pathname, subitem.path)
                      return (
                        <Link
                          key={subitem.path}
                          href={subitem.path}
                          tabIndex={menuOpen ? 0 : -1}
                          aria-current={subActive ? "page" : undefined}
                          onClick={closeMenu}
                          className={cn("rounded-[10px] px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted hover:text-foreground", subActive ? "bg-muted font-semibold text-foreground" : "font-medium text-muted-foreground")}
                        >
                          {subitem.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      <div className={cn("pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 select-none transition-opacity duration-300", menuOpen ? "opacity-20" : "opacity-0")} aria-hidden="true">
        <Image src="/logo.png" alt="" width={32} height={32} className="h-8 w-8 shrink-0 object-contain" style={{ filter: "brightness(0) invert(1) contrast(0.6)" }} />
      </div>
    </div>
  )
}
