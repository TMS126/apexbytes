// components/page-edge-glow.tsx
"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { BRAND } from "@/lib/brand"

type GlowColorPair = { light: string; dark: string }

// Route → glow color pair. Home ("/") is intentionally left out — no glow
// on landing, only on the four hub-style pages that have a dedicated
// brand color. Kept in sync with the Navbar's MOBILE_NAV_COLORS so every
// page reads the same accent everywhere in the app — nav pill, logo,
// hamburger, and now this edge glow all agree.
const PAGE_GLOW_COLORS: Record<string, GlowColorPair> = {
  "/services": { light: BRAND.green,   dark: BRAND.lightGreen  },
  "/gallery":  { light: BRAND.orange,  dark: BRAND.lightOrange },
  "/about":    { light: BRAND.orange, dark: BRAND.lightOrange },
  "/contact":  { light: BRAND.dark100, dark: BRAND.techGreyDark }, // Tech Hub grey identity
}

export function PageEdgeGlow() {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const [mounted] = useState(() => typeof window !== "undefined")

  // The pathname key remounts the glow on every route change, replaying the
  // animation on both in-app navigation and direct page loads.

  const pair = PAGE_GLOW_COLORS[pathname]
  if (!pair) return null

  const isDark = mounted && resolvedTheme === "dark"
  const color  = isDark ? pair.dark : pair.light

  return (
    <div
      key={pathname}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[9999] pointer-events-none h-[320px] overflow-hidden abh-edge-glow"
      style={{ ["--glow-color" as unknown as keyof import("react").CSSProperties]: color }}
    >
      <style>{`
        @keyframes abh-edge-glow-kf {
          0%   { opacity: 0; }
          8%   { opacity: 1; }
          32%  { opacity: 0; }
          48%  { opacity: 1; }
          74%  { opacity: 0; }
          100% { opacity: 0; }
        }
        .abh-edge-glow {
          animation: abh-edge-glow-kf 2.4s ease-in-out forwards;
        }
      `}</style>

      {/* Thin bright line along the very top edge */}
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ backgroundColor: "var(--glow-color)" }}
      />

      {/* Soft top wash, ties the corner glows together across the middle */}
      <div
        className="absolute inset-x-0 top-0 h-[180px] blur-2xl opacity-60"
        style={{ background: "linear-gradient(to bottom, var(--glow-color) 0%, transparent 100%)" }}
      />

      {/* Left edge — curves down from the top-left corner, fading out
          toward the bottom of the glow zone (mask-image), approximating
          the device-edge lighting look from the reference screenshot. */}
      <div
        className="absolute left-0 top-0 w-[110px] h-full blur-2xl opacity-70"
        style={{
          background: "linear-gradient(to right, var(--glow-color) 0%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
        }}
      />

      {/* Right edge — mirror of the left */}
      <div
        className="absolute right-0 top-0 w-[110px] h-full blur-2xl opacity-70"
        style={{
          background: "linear-gradient(to left, var(--glow-color) 0%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
        }}
      />

      {/* Rounded corner blobs — where the top bar meets the side edges,
          so the transition into the side glow reads as one curved shape
          rather than a hard corner. */}
      <div
        className="absolute -left-10 -top-10 w-[200px] h-[200px] rounded-full blur-3xl opacity-60"
        style={{ backgroundColor: "var(--glow-color)" }}
      />
      <div
        className="absolute -right-10 -top-10 w-[200px] h-[200px] rounded-full blur-3xl opacity-60"
        style={{ backgroundColor: "var(--glow-color)" }}
      />
    </div>
  )
      } 
