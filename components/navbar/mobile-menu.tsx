// components/navbar/mobile-menu.tsx
"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { NAV_ITEMS, TOKEN, HUB_NAMES } from "@/lib/brand"
import { HUB_ORDER, hubRouteFor } from "@/components/services-page/lib"
import { CaretDown } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

// FIX: was a hardcoded "#F4A261" duplicated from navbar.tsx via a
// "keep in sync" comment. That hex is the OLD, WCAG-failing --brand-orange
// value (documented in globals.css as "was #F4A261 at 2.06:1") — still
// failing here as both text color AND border color (border also needs
// ≥3:1 for non-text UI components, which 2.06:1 fails too). Now imports
// the same verified TOKEN.orangeText used in navbar.tsx directly, so
// there's a real single source of truth instead of a manually-synced copy.
const HOVER_TEXT = TOKEN.orangeText

interface MobileMenuProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  pathname: string
  neutralColor: string
}

export function MobileMenu({ menuOpen, setMenuOpen, pathname, neutralColor }: MobileMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    previouslyFocused.current = document.activeElement as HTMLElement
    containerRef.current?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        return
      }
      if (e.key !== "Tab" || !containerRef.current) return
      const focusable = Array.from(containerRef.current.querySelectorAll<HTMLElement>(
        'button, summary, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
  }, [menuOpen, setMenuOpen])

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      aria-hidden={!menuOpen}
      tabIndex={-1}
      className={cn(
        "fixed inset-0 z-[9998] md:hidden transition-opacity duration-300 outline-none",
        menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className="absolute inset-0 bg-background/95 backdrop-blur-xl"
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">
        <nav className="flex w-full max-w-[380px] flex-col items-center gap-4" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item, idx) => {
            const isActive =
              pathname === item.path || (item.path === "/services" && pathname.startsWith("/services")) || (item.path === "/tools" && pathname.startsWith("/tools"))
            const submenu = item.id === "services"
              ? HUB_ORDER.map((hubId) => ({ label: HUB_NAMES[hubId], path: hubRouteFor(hubId) }))
              : item.id === "tools"
                ? [{ label: "All tools", path: "/tools" }, { label: "JPG to PDF", path: "/tools/jpg-to-pdf" }]
                : null

            if (item.isCta) {
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={menuOpen ? 0 : -1}
                  style={{
                    transitionDelay: menuOpen ? `${idx * 60}ms` : "0ms",
                    backgroundColor: "var(--surface-accent)",
                    color: "var(--text-on-accent)",
                  }}
                  className={cn(
                    "w-full rounded-[14px] px-8 py-3.5 text-center font-sans text-[1.15rem] font-semibold transition-all duration-300 active:scale-95",
                    menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  )}
                >
                  {item.label}
                </Link>
              )
            }

            return (
              <div
                key={item.id}
                className={cn("flex w-full flex-col items-center gap-1 transition-all duration-300", menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}
                style={{ transitionDelay: menuOpen ? `${idx * 60}ms` : "0ms" }}
              >
                <Link
                  href={item.path}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={menuOpen ? 0 : -1}
                  style={{ color: isActive ? HOVER_TEXT : neutralColor, borderColor: isActive ? HOVER_TEXT : "transparent" }}
                  className="w-full rounded-[14px] border-2 bg-transparent px-8 py-3.5 text-center font-sans text-[1.15rem] font-semibold transition-colors active:scale-95"
                >
                  {item.label}
                </Link>
                {submenu && (
                  <details className="w-full">
                    <summary
                      tabIndex={menuOpen ? 0 : -1}
                      className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 rounded-[14px] border border-border/60 bg-card/60 px-4 py-2.5 text-base font-semibold text-foreground [&::-webkit-details-marker]:hidden"
                    >
                      Browse {item.label.toLowerCase()}
                      <CaretDown size={16} aria-hidden="true" />
                    </summary>
                    <div className="mt-2 flex flex-col items-stretch gap-1 border-t border-border/60 bg-card/50 p-2 pt-3">
                      {submenu.map((subitem) => (
                        <Link
                          key={subitem.path}
                          href={subitem.path}
                          tabIndex={menuOpen ? 0 : -1}
                          aria-current={pathname === subitem.path ? "page" : undefined}
                          className="w-full rounded-[14px] px-5 py-3 text-left text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )
          })}
        </nav>
      </div>

      <div
        className={cn(
          "absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center select-none transition-all duration-500 z-10",
          menuOpen ? "opacity-30" : "opacity-0"
        )}
        aria-hidden="true"
      >
        <Image
          src="/logo.png"
          alt=""
          width={32}
          height={32}
          className="relative w-8 h-8 shrink-0 object-contain transition-[filter] duration-300"
          style={{ filter: "brightness(0) invert(1) contrast(0.6)" }}
        />
      </div>
    </div>
  )
}
