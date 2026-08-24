// app/services/page.tsx
import { Suspense } from "react"
import type { Metadata } from "next"
import { ServicesPage } from "@/components/services-page"
import { CtaBar } from "@/components/strip-section"
import { Navbar } from "@/components/navbar"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"
import { HUBS, type HubId } from "@/lib/data"
import { BIZ } from "@/lib/brand"

export const dynamic = 'force-dynamic'
const HUB_ORDER: HubId[] = ["print", "doc", "design", "eservice", "tech"]

// FIX: same SITE_URL fallback pattern used everywhere else in the
// codebase — needed to build a full, explicit canonical URL below.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexbytes.vercel.app'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const params = await searchParams
  const hubParam = typeof params.hub === "string" ? params.hub : undefined
  const sectionParam = typeof params.section === "string" ? params.section : undefined
  const serviceParam = typeof params.service === "string" ? params.service : undefined

  if (hubParam && HUB_ORDER.includes(hubParam as HubId) && sectionParam && serviceParam) {
    const hub = HUBS[hubParam as HubId]
    const section = hub.sections.find((s) => s.title === sectionParam)
    const item = section?.items.find((i) => i.name === serviceParam)

    if (item) {
      const title = `${item.name} — ${item.price} at ${BIZ.name}`
      const description = item.description || `${item.name} from the ${hub.title} at ${BIZ.name}. ${item.price}.`
      const ogUrl = `/api/og/service?hub=${encodeURIComponent(hubParam)}&section=${encodeURIComponent(sectionParam)}&service=${encodeURIComponent(serviceParam)}`

      // FIX — the actual root cause: this is the full, exact URL of the
      // specific service page being shared. Every OTHER metadata block in
      // this codebase (root layout.tsx) sets openGraph.url explicitly —
      // this per-service branch never did. Without an explicit og:url,
      // Facebook/WhatsApp's crawler has no reliable canonical identity to
      // key its cache against, which is very likely why every shared
      // service link was resolving to the same cached preview regardless
      // of which service was actually shared. alternates.canonical is
      // added too, as a second, standards-level signal pointing at the
      // same URL for any crawler/tool that reads that instead.
      const pageUrl = `${SITE_URL}/services?hub=${encodeURIComponent(hubParam)}&section=${encodeURIComponent(sectionParam)}&service=${encodeURIComponent(serviceParam)}`

      return {
        title,
        description,
        alternates: { canonical: pageUrl },
        openGraph: { title, description, url: pageUrl, images: [{ url: ogUrl, width: 1200, height: 630, alt: title }] },
        twitter: { card: "summary_large_image", title, images: [ogUrl] },
      }
    }
  }

  return {
    title: "Services — ApexbytesHub",
    description: "Printing, documents, design, government services and tech support — all in one place.",
    alternates: { canonical: `${SITE_URL}/services` },
    openGraph: { url: `${SITE_URL}/services` },
  }
}

export default function ServicesRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div>
        <Suspense fallback={null}>
          <ServicesPage />
        </Suspense>
        <TestimonialsSection />
        <CtaBar
          title="Not sure what you need?"
          description="Just WhatsApp us and we'll guide you in the right direction."
          buttonText="Chat With Us"
          buttonHref="https://wa.me/27753338260"
        />
      </div>
      <Footer />
    </div>
  )
} 
