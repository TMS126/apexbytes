// app/page.tsx
"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { HomeNoticeStack } from "@/components/home-notice-stack"
import { CoreHubGrid } from "@/components/core-hub-grid"
import { HowItWorks } from "@/components/how-it-works"
import { StatsBar } from "@/components/stats-bar"
import { TestimonialsSection } from "@/components/testimonials-section"
import { StripSection, CtaBar } from "@/components/strip-section"
import { Footer } from "@/components/footer"
import { BIZ } from "@/lib/brand"
import { HOME_NOTICES } from "@/lib/home-notices"

export default function HomeRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div>
        <div className="animate-fade-up">
          <HeroSection />
          <div className="flex w-full justify-center px-4 py-4 md:px-8">
            <HomeNoticeStack notices={HOME_NOTICES} />
          </div>
          <CoreHubGrid />
          <HowItWorks />
          <StatsBar />
          <TestimonialsSection />
          <StripSection />
          <CtaBar
            title="Ready to get started?"
            description={`WhatsApp us or visit us in ${BIZ.location} — we're always happy to help.`}
            buttonText="WhatsApp Us Now"
            buttonHref={`https://wa.me/${BIZ.phoneE164.replace("+", "")}`}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}
