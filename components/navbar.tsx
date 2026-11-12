// components/navbar.tsx
"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Sun, Moon, CaretDown, ArrowUpRight } from "@phosphor-icons/react"
import { NAV_ITEMS, HUB_NAMES } from "@/lib/brand"
import { HUB_ORDER, hubRouteFor } from "@/components/services-page/lib"
import { cn } from "@/lib/utils"
import { useCalculatorOpen } from "@/hooks/use-calculator-open"
import { useNavVisibility, useMobileMenu, useNavContrast } from "@/hooks/use-navbar"
import { MobileMenu } from "@/components/navbar/mobile-menu"
import { DesktopMenu } from "@/components/navbar/desktop-menu"

// Shared by both the logo icon's neutral color and the nav-controls'
// neutral color — previously duplicated as two near-identical ternary
// chains; same inputs, same logic, now one function.
function resolveNeutralColor(mounted: boolean, theme: string | undefined, darkBehind: boolean): string {
  if (!mounted) return "#3f3f46"
  if (darkBehind) return "#f4f4f5"
  if (theme === "dark") return "#e4e4e7"
  return "#3f3f46"
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const calculatorOpen = useCalculatorOpen()

  // Keep theme-dependent markup deterministic during SSR and the first client
  // render. next-themes resolves the stored theme only after hydration.
  const [mounted, setMounted] = useState(false)
  const [ctaPulse, setCtaPulse] = useState(false)

  const navVisible = useNavVisibility()
  const { menuOpen, setMenuOpen } = useMobileMenu()
  const isDarkBehind = useNavContrast()
  const isLogoDarkBehind = useNavContrast(0.07)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const menuToggleRef = useRef<HTMLButtonElement>(null)

  // Closes whichever menu (mobile overlay or desktop dropdown) is open
  // whenever the route changes — including via browser back/forward,
  // which bypasses navigate()'s own setMenuOpen(false).
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMenuOpen(false))
    return () => cancelAnimationFrame(frame)
  }, [pathname, setMenuOpen])

  useEffect(() => {
    const resetFrame = requestAnimationFrame(() => setCtaPulse(false))
    if (pathname === "/contact") return () => cancelAnimationFrame(resetFrame)
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 2) {
        setCtaPulse(true)
        window.removeEventListener("scroll", onScroll)
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(resetFrame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [pathname])

  const navigate = useCallback(
    (path: string) => {
      router.push(path)
      setMenuOpen(false)
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    [router, setMenuOpen]
  )

  const handleThemeToggle = () => setTheme(theme === "dark" ? "light" : "dark")

  const glassPillClass = "py-2 pointer-events-auto"

  const neutralColor = useMemo(
    () => resolveNeutralColor(mounted, theme, isDarkBehind),
    [mounted, theme, isDarkBehind]
  )

  const useLightLogoIcon = mounted && (isLogoDarkBehind || theme === "dark")

  if (calculatorOpen) return null

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-[var(--banner-h,0px)] z-[9999] flex flex-col border-b border-border/20 bg-white/90 backdrop-blur-xl pointer-events-none transition-[top,transform,opacity] duration-300 ease-out dark:bg-background/88",
          !navVisible && !menuOpen ? "xl:-translate-y-full xl:opacity-0" : "translate-y-0 opacity-100",
        )}
      >
        <div className="flex h-[var(--nav-h)] items-center justify-center px-5 md:px-10">
          <div className="relative grid w-full max-w-[1320px] grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Logo */}
            <button
              type="button"
              aria-label="ApexbytesHub — go to homepage"
              className={cn(
                glassPillClass,
                "flex items-center gap-2 cursor-pointer select-none pointer-events-auto group transition-all duration-300 px-1", 
                menuOpen || !navVisible
                  ? "opacity-0 -translate-y-20 pointer-events-none"
                  : "opacity-100 translate-y-0 pointer-events-auto"
              )}
              style={{ transition: "opacity 300ms, transform 300ms" }}
              onClick={() => navigate("/")}
            >
              <Image
                src="/logo.png"
                alt="ApexbytesHub home"
                width={36}
                height={36}
                className="relative w-8 h-8 md:w-9 md:h-9 shrink-0 object-contain transition-[filter] duration-300"
                style={{ filter: useLightLogoIcon ? "brightness(0) invert(1)" : "brightness(0)" }}
              />
              <div
                className="flex max-w-[200px] items-center overflow-hidden font-sans text-[1.12rem] font-medium leading-none tracking-tight"
              >
                <span className="whitespace-nowrap transition-colors duration-300 abh-logo-primary">
                  Apexbytes
                </span>
                <span className="whitespace-nowrap transition-colors duration-300 abh-logo-secondary">
                  Hub
                </span>
              </div>
            </button>

            <nav aria-label="Primary navigation" className="hidden items-center gap-8 pointer-events-auto xl:flex">
              {NAV_ITEMS.filter((item) => !item.isCta).map((item) => {
                const active = pathname === item.path || (item.path !== "/" && pathname.startsWith(`${item.path}/`))
                const submenu = item.id === "services"
                  ? HUB_ORDER.map((hubId) => ({ label: HUB_NAMES[hubId], path: hubRouteFor(hubId) }))
                  : item.id === "tools"
                    ? [{ label: "All tools", path: "/tools" }, { label: "JPG to PDF", path: "/tools/jpg-to-pdf" }]
                    : null

                return (
                  <div key={item.id} className="group/nav relative flex items-center gap-1">
                    <Link
                      href={item.path}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "whitespace-nowrap text-[0.9rem] transition-colors hover:text-foreground",
                        active ? "font-semibold text-foreground" : "font-semibold text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                    {submenu && (
                      <details className="group/dropdown relative">
                        <summary
                          aria-label={`Open ${item.label} submenu`}
                          className="flex size-7 cursor-pointer list-none items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&::-webkit-details-marker]:hidden"
                        >
                          <CaretDown size={12} weight="bold" aria-hidden="true" />
                        </summary>
                        <div className="invisible pointer-events-none absolute left-1/2 top-full z-50 mt-4 flex -translate-x-1/2 flex-row items-center gap-2 whitespace-nowrap p-2 opacity-0 transition-all group-open/dropdown:visible group-open/dropdown:pointer-events-auto group-open/dropdown:opacity-100 group-hover/dropdown:visible group-hover/dropdown:pointer-events-auto group-hover/dropdown:opacity-100 group-focus-within/dropdown:visible group-focus-within/dropdown:pointer-events-auto group-focus-within/dropdown:opacity-100">
                          {submenu.map((subitem) => (
                            <Link
                              key={subitem.path}
                              href={subitem.path}
                              aria-current={pathname === subitem.path ? "page" : undefined}
                              className="rounded-full bg-background/95 px-4 py-2.5 text-sm text-muted-foreground shadow-[var(--shadow-card-lift)] backdrop-blur-xl transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

            <div
              className={cn(
                "relative col-start-3 ml-auto flex items-center gap-3 pointer-events-auto transition-all duration-300",
                !navVisible && !menuOpen ? "-translate-y-20 opacity-0" : "translate-y-0 opacity-100"
              )}
              style={{ transition: "opacity 300ms, transform 300ms" }}
            >
              <button
                type="button"
                onClick={handleThemeToggle}
                className="abh-nav-control order-1 flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:scale-95"
                aria-label={mounted ? (theme === "dark" ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
              >
                {mounted &&
                  (theme === "dark" ? (
                    <Moon size={20} weight="fill" style={{ color: neutralColor }} className="transition-colors duration-300" />
                  ) : (
                    <Sun size={20} weight="fill" style={{ color: neutralColor }} className="transition-colors duration-300" />
                  ))}
              </button>

              <button
                ref={menuToggleRef}
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="abh-nav-control order-2 flex size-10 items-center justify-center transition-colors hover:text-foreground active:scale-95 xl:hidden"
              >
                <span className="relative w-4 h-[12px] flex flex-col justify-between items-center" aria-hidden="true">
                  <span
                    className="w-full h-[2.5px] rounded-full transition-transform duration-300 ease-out"
                    style={{
                      backgroundColor: neutralColor,
                      transform: menuOpen ? "translateY(4.75px) rotate(45deg)" : "none",
                    }}
                  />
                  <span
                    className="w-full h-[2.5px] rounded-full transition-all duration-200 ease-out"
                    style={{
                      backgroundColor: neutralColor,
                      opacity: menuOpen ? 0 : 1,
                      transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
                    }}
                  />
                  <span
                    className="w-full h-[2.5px] rounded-full transition-transform duration-300 ease-out"
                    style={{
                      backgroundColor: neutralColor,
                      transform: menuOpen ? "translateY(-4.75px) rotate(-45deg)" : "none",
                    }}
                  />
                </span>
              </button>

              <DesktopMenu
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                pathname={pathname}
                navigate={navigate}
                neutralColor={neutralColor}
                triggerRef={menuToggleRef}
                ctaPulse={ctaPulse}
              />

              <Link
                href="/contact"
                className="order-3 hidden items-center gap-2 rounded-full bg-muted/80 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
              >
                Let&apos;s talk
                <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} pathname={pathname} neutralColor={neutralColor} />
    </>
  )
     } 
