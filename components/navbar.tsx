// components/navbar.tsx
"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { Sun, Moon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useCalculatorOpen } from "@/hooks/use-calculator-open"
import { useNavVisibility, useMobileMenu, useLogoAnimation, useNavContrast } from "@/hooks/use-navbar"
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
  const { isTextExpanded, handleLogoMouseEnter, handleLogoMouseLeave } = useLogoAnimation()
  const isDarkBehind = useNavContrast()
  const isLogoDarkBehind = useNavContrast(0.07)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const logoButtonRef = useRef<HTMLButtonElement>(null)
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

  const glassPillClass = "backdrop-blur-md py-2 rounded-[14px] pointer-events-auto"

  const neutralColor = useMemo(
    () => resolveNeutralColor(mounted, theme, isDarkBehind),
    [mounted, theme, isDarkBehind]
  )

  const useLightLogoIcon = mounted && (isLogoDarkBehind || theme === "dark")

  if (calculatorOpen) return null

  return (
    <>
      <header
        className="fixed left-0 right-0 top-[var(--banner-h,0px)] z-[9999] flex flex-col pointer-events-none transition-[top] duration-300 ease-out"
      >
        <div className="flex justify-center px-6 md:px-10 lg:px-12 xl:px-16 pt-5 h-[--nav-h] items-center">
          <div className="relative flex items-center justify-between w-full max-w-[1920px]">
            {/* Logo */}
            <button
              ref={logoButtonRef}
              type="button"
              aria-label="ApexbytesHub — go to homepage"
              className={cn(
                glassPillClass,
                "flex items-center cursor-pointer select-none pointer-events-auto group transition-all duration-300",
                isTextExpanded ? "pl-3 pr-4 gap-2.5" : "px-2.5 gap-0",
                menuOpen || !navVisible
                  ? "opacity-0 -translate-y-20 pointer-events-none"
                  : "opacity-100 translate-y-0 pointer-events-auto"
              )}
              style={{ transition: "opacity 300ms, transform 300ms" }}
              onMouseEnter={handleLogoMouseEnter}
              onMouseLeave={handleLogoMouseLeave}
              onClick={() => navigate("/")}
            >
              <Image
                src="/logo.png"
                alt=""
                aria-hidden="true"
                width={36}
                height={36}
                className="relative w-8 h-8 md:w-9 md:h-9 shrink-0 object-contain transition-[filter] duration-300"
                style={{ filter: useLightLogoIcon ? "brightness(0) invert(1)" : "brightness(0)" }}
              />
              <div
                className="font-sans font-black text-[1.32rem] leading-none tracking-tight transition-all duration-500 overflow-hidden flex items-center"
                style={{ maxWidth: isTextExpanded ? "180px" : "0px" }}
              >
                <span className="whitespace-nowrap transition-colors duration-300 abh-logo-primary">
                  Apexbytes
                </span>
                <span className="whitespace-nowrap transition-colors duration-300 abh-logo-secondary">
                  Hub
                </span>
              </div>
            </button>

            {/* Controls — same pill on every breakpoint. Order of the two
                buttons swaps at md: mobile reads [theme, hamburger];
                desktop reads [hamburger, theme], both still top-right. */}
            <div
              className={cn(
                glassPillClass,
                "relative flex items-center gap-3 pl-3 pr-3 pointer-events-auto ml-4 transition-all duration-300",
                !navVisible && !menuOpen ? "-translate-y-20 opacity-0" : "translate-y-0 opacity-100"
              )}
              style={{ transition: "opacity 300ms, transform 300ms" }}
            >
              <button
                type="button"
                onClick={handleThemeToggle}
                className="order-1 md:order-2 flex items-center justify-center w-7 h-7 active:scale-90 transition-transform"
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
                className="order-2 md:order-1 flex items-center justify-center w-7 h-7 active:scale-90"
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
            </div>
          </div>
        </div>
      </header>

      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} pathname={pathname} neutralColor={neutralColor} />
    </>
  )
     } 
