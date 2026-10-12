// components/about-page.tsx
"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { BRAND, THEME_BG } from "@/lib/brand"
import { BackToTopButton, useBackToTop } from "@/components/back-to-top-button"
import { ensureAccessible } from "@/lib/color"
import { AboutHeader } from "@/components/about/about-header"
import { AboutStory } from "@/components/about/about-story"
import { AboutTeam } from "@/components/about/about-team"
import { AboutStandards } from "@/components/about/about-standards"
import { AboutTestimonials } from "@/components/about/about-testimonials"
import { AboutMission } from "@/components/about/about-mission"

const ABOUT_NEUTRAL = { light: BRAND.dark100, dark: BRAND.techGreyDark }

export function AboutPage() {
  const showBackToTop = useBackToTop()

  const { resolvedTheme } = useTheme()
  const [mounted] = useState(() => typeof window !== "undefined")
  const isDark = mounted && resolvedTheme === "dark"

  const cardBg = isDark ? THEME_BG.dark.card : THEME_BG.light.card
  const blueColor = isDark ? BRAND.lightBlue : BRAND.blue
  const orangeColor = isDark ? BRAND.lightOrange : BRAND.orangeDark
  const neutralColor = isDark ? ABOUT_NEUTRAL.dark : ABOUT_NEUTRAL.light

  const blueOnCard = ensureAccessible(blueColor, cardBg, 4.5)
  const orangeOnCard = ensureAccessible(orangeColor, cardBg, 4.5)

  const missionBadgeBg = "var(--cta-badge-bg)"
  const missionBadgeText = "var(--cta-badge-text)"

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <AboutHeader blueColor={blueColor} />
      <AboutStory blueColor={blueColor} blueOnCard={blueOnCard} orangeOnCard={orangeOnCard} cardBg={cardBg} />
      <AboutTeam blueColor={blueColor} />
      <AboutStandards neutralColor={neutralColor} />
      <AboutTestimonials />
      <AboutMission missionBadgeBg={missionBadgeBg} missionBadgeText={missionBadgeText} />
      <BackToTopButton visible={showBackToTop} />
    </div>
  )
} 
