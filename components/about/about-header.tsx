// components/about/about-header.tsx
"use client"

import { ScrollBounce } from "@/components/scroll-bounce"

export function AboutHeader() {
  return (
    <section className="abh-editorial-hero">
      <div className="max-w-[1248px] mx-auto flex flex-col items-center">
        <ScrollBounce>
          <h1 className="abh-page-title mb-3">About Us</h1>
        </ScrollBounce>

        <p className="abh-tagline max-w-xl mx-auto">
          A local business built on community, trust, and real help — right here in Kgotsong.
        </p>

        <div className="abh-divider" />

      </div>
    </section>
  )
} 
