"use client"

import { useState } from "react"
import { CaretDown } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { BRAND } from "@/lib/brand"
import { getContrastText } from "@/lib/color"
import { ROW_ORDER, HubId, playClickSound } from "@/lib/gallery-helpers"
import { useBackButtonDismiss } from "@/hooks/use-back-button-dismiss"
import { HubIcon } from "@/components/services-page/shared"

export function FilterDropdown({
  activeFilter, onSelect, getAccent,
}: {
  activeFilter: HubId | "all"
  onSelect: (f: HubId | "all") => void
  getAccent: (id: HubId) => string
}) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const blueColor = isDark ? BRAND.lightBlue : BRAND.blue
  const [open, setOpen] = useState(false)
  const closeDropdown = useBackButtonDismiss(open, setOpen)

  const handleToggleClick = () => {
    playClickSound()
    if (open) closeDropdown()
    else setOpen(true)
  }

  const handleSelect = (id: HubId | "all") => {
    playClickSound()
    onSelect(id)
    setOpen(false)
  }

  const options: { id: HubId | "all"; label: string }[] = [{ id: "all", label: "All hubs" }, ...ROW_ORDER.map((r) => ({ id: r.id, label: r.label }))]
  const displayedLabel = activeFilter === "all" ? "Select a Hub" : options.find((o) => o.id === activeFilter)?.label ?? "Select a Hub"

  return (
    <>
      {/* Desktop pill row */}
      <div className="hidden md:flex justify-center flex-wrap gap-2 mb-10">
        {options.map((opt) => {
          const accent = opt.id !== "all" ? getAccent(opt.id as HubId) : undefined
          const isActive = activeFilter === opt.id
          const activeBg = accent ?? blueColor
          const activeText = getContrastText(activeBg)

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              aria-pressed={isActive}
              className={cn(
                "abh-underline-button px-3 py-2 text-base font-medium whitespace-nowrap transition-colors duration-150 active:scale-95",
                "shadow-none",
                "outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              )}
              style={
                isActive
                  ? { color: activeText, ["--card-rule" as unknown as keyof import("react").CSSProperties]: activeBg, ["--tw-ring-color" as unknown as keyof import("react").CSSProperties]: activeBg }
                  : { color: isDark ? "#e4e4e7" : "#3f3f46", ["--tw-ring-color" as unknown as keyof import("react").CSSProperties]: accent ?? blueColor }
              }
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Mobile — collapsed trigger is now always neutral (border-only,
          never filled with the hub's accent color), and hides itself
          entirely while the option list is open, reappearing only once
          the list is dismissed (click outside, Escape, or a selection). */}
      <div className="md:hidden relative flex justify-center mb-10 z-40">
        {!open && (
          <button
            onClick={handleToggleClick}
            aria-expanded={open}
            aria-haspopup="listbox"
            className={cn(
              "abh-underline-button flex items-center gap-2 px-1.5 py-1.5 bg-transparent",
              "text-[0.94rem] font-medium whitespace-nowrap transition-all duration-150 active:scale-95",
              "shadow-none",
              "outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "text-zinc-700 dark:text-zinc-200"
            )}
            style={{ ["--tw-ring-color" as unknown as keyof import("react").CSSProperties]: blueColor }}
          >
            <span className="sr-only">Current filter:</span>
            {displayedLabel}
            <CaretDown size={13} weight="bold" aria-hidden="true" className="transition-transform duration-200 shrink-0" />
          </button>
        )}

        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={closeDropdown} aria-hidden="true" />
            <AnimatePresence>
              <motion.div
                role="listbox"
                aria-label="Filter by hub"
                initial={{ opacity: 0, y: -14, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.94 }}
                transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.6 }}
                className="relative z-50 w-[calc(100vw-2rem)] max-w-sm"
                style={{ isolation: "isolate" }}
              >
                <div className="flex flex-wrap justify-center gap-2 rounded-[14px] bg-card p-2.5 shadow-none">
                  {options.map((opt) => {
                    const accent = opt.id !== "all" ? getAccent(opt.id as HubId) : undefined
                    const isActive = activeFilter === opt.id
                    const activeBg = accent ?? blueColor
                    const activeText = getContrastText(activeBg)

                    return (
                      <button
                        key={opt.id}
                        role="option"
                        aria-selected={isActive}
                        onClick={() => handleSelect(opt.id)}
                        className={cn(
                          "abh-underline-button w-full flex items-center justify-center gap-1.5 px-3 py-2.5",
                          "text-sm font-medium whitespace-nowrap transition-all duration-150 active:scale-95",
                          "shadow-none",
                          "outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        )}
                        style={
                          isActive
                            ? { color: activeText, ["--card-rule" as unknown as keyof import("react").CSSProperties]: activeBg, ["--tw-ring-color" as unknown as keyof import("react").CSSProperties]: activeBg }
                            : { color: accent ?? (isDark ? "#e4e4e7" : "#3f3f46"), ["--tw-ring-color" as unknown as keyof import("react").CSSProperties]: accent ?? blueColor }
                        }
                      >
                        {opt.id !== "all" && <HubIcon id={opt.id as HubId} size={13} weight={isActive ? "fill" : "regular"} color={isActive ? activeText : accent} />}
                        <span className="truncate">{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </>
  )
}
