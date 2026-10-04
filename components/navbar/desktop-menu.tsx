// components/navbar/desktop-menu.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { NAV_ITEMS, BRAND, TOKEN, HUB_NAMES } from "@/lib/brand"
import { HUB_ORDER, hubRouteFor } from "@/components/services-page/lib"
import { cn } from "@/lib/utils"

// ============================================================
// TOKENS
// ============================================================
// Same verified pairing already used by MobileMenu and the header
// controls — see navbar.tsx for the WCAG contrast history behind
// these two values.
const HOVER_TEXT = TOKEN.orangeText
const HOVER_FILL = BRAND.orangeDark

interface DesktopMenuProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  pathname: string
  navigate: (path: string) => void
  neutralColor: string
  triggerRef: React.RefObject<HTMLButtonElement | null>
  ctaPulse: boolean
}

// ============================================================
// DESKTOP DROPDOWN MENU
// ============================================================
// Anchored under the header controls pill (top-right, where the
// hamburger toggle lives) instead of centered like the mobile
// full-screen overlay. Vertical list, 14px radii + the same
// --shadow-card-lift token the services/gallery cards use
// everywhere else on the site. Hovering "Services" reveals a single
// flyout of the five hubs; nothing nests beyond that one level.
export function DesktopMenu({
  menuOpen,
  setMenuOpen,
  pathname,
  navigate,
  neutralColor,
  triggerRef,
  ctaPulse,
}: DesktopMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hubsOpen, setHubsOpen] = useState(false)
  const [contactHovered, setContactHovered] = useState(false)

  // ── Close on outside click / Escape ──────────────────────────────
  useEffect(() => {
    if (!menuOpen || window.matchMedia("(max-width: 767px)").matches) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (containerRef.current?.contains(target)) return
      if (triggerRef.current?.contains(target)) return
      setMenuOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [menuOpen, setMenuOpen, triggerRef])

  // Collapse the hubs flyout whenever the menu itself closes, so it
  // isn't already expanded the next time the menu opens.
  useEffect(() => {
    if (menuOpen) return
    const frame = window.requestAnimationFrame(() => setHubsOpen(false))
    return () => window.cancelAnimationFrame(frame)
  }, [menuOpen])

  return (
    <div
      ref={containerRef}
      role="menu"
      aria-label="Main navigation"
      aria-hidden={!menuOpen}
      className={cn(
        "hidden md:block absolute right-0 top-full mt-2 min-w-[210px] rounded-[14px] bg-card shadow-[var(--shadow-card-lift)] py-2 transition-all duration-200 ease-out origin-top-right",
        menuOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
      )}
    >
      <nav className="flex flex-col" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          // FIX (carried from the old desktop pill in navbar.tsx): exact-path
          // matching meant a hub page like /services/print never marked
          // "Services" as active. Every other item still uses exact match;
          // only the Services item's own sub-tree needs the wider check.
          const isActive =
            pathname === item.path ||
            (item.path === "/services" && pathname.startsWith("/services")) ||
            (item.path === "/tools" && pathname.startsWith("/tools"))
          const isServices = item.id === "services"

          if (item.isCta) {
            return (
              <div key={item.id} className="px-2 pt-1 pb-1">
                <button
                  type="button"
                  role="menuitem"
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => navigate(item.path)}
                  onMouseEnter={() => setContactHovered(true)}
                  onMouseLeave={() => setContactHovered(false)}
                  aria-current={isActive ? "page" : undefined}
                  style={{ backgroundColor: contactHovered ? HOVER_FILL : BRAND.blue }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-[10px] text-base font-black text-white transition-colors duration-200",
                    ctaPulse && "abh-cta-pulse"
                  )}
                >
                  {item.label}
                </button>
              </div>
            )
          }

          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => isServices && setHubsOpen(true)}
              onMouseLeave={() => isServices && setHubsOpen(false)}
            >
              <button
                type="button"
                role="menuitem"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => navigate(item.path)}
                onFocus={() => isServices && setHubsOpen(true)}
                aria-current={isActive ? "page" : undefined}
                aria-haspopup={isServices ? "true" : undefined}
                aria-expanded={isServices ? hubsOpen : undefined}
                style={{ color: isActive ? HOVER_TEXT : neutralColor }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-base whitespace-nowrap transition-colors duration-150",
                  isActive ? "font-black" : "font-medium"
                )}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = HOVER_TEXT
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.color = neutralColor
                }}
              >
                {item.label}
              </button>

              {isServices && (
                <div
                  role="menu"
                  aria-label="Hubs"
                  aria-hidden={!hubsOpen}
                  className={cn(
                    "absolute right-full top-0 mr-1.5 min-w-[190px] rounded-[14px] bg-card shadow-[var(--shadow-card-lift)] py-2 flex flex-col transition-all duration-150 ease-out origin-top-right",
                    hubsOpen ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 translate-x-1 pointer-events-none"
                  )}
                >
                  {HUB_ORDER.map((hubId) => {
                    const hubPath = hubRouteFor(hubId)
                    const isHubActive = pathname === hubPath
                    return (
                      <button
                        key={hubId}
                        type="button"
                        role="menuitem"
                        tabIndex={menuOpen && hubsOpen ? 0 : -1}
                        onClick={() => navigate(hubPath)}
                        aria-current={isHubActive ? "page" : undefined}
                        style={{ color: isHubActive ? HOVER_TEXT : neutralColor }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-base whitespace-nowrap transition-colors duration-150",
                          isHubActive ? "font-black" : "font-medium"
                        )}
                        onMouseEnter={(e) => {
                          if (!isHubActive) (e.currentTarget as HTMLElement).style.color = HOVER_TEXT
                        }}
                        onMouseLeave={(e) => {
                          if (!isHubActive) (e.currentTarget as HTMLElement).style.color = neutralColor
                        }}
                      >
                        {HUB_NAMES[hubId]}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
