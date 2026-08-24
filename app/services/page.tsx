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

const HUB_ORDER: HubId[] = ["print", "doc", "design", "eservice", "tech"]

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

      return {
        title,
        description,
        openGraph: { title, description, images: [{ url: ogUrl, width: 1200, height: 630, alt: title }] },
        twitter: { card: "summary_large_image", title, images: [ogUrl] },
      }
    }
  }

  return {
    title: "Services — ApexbytesHub",
    description: "Printing, documents, design, government services and tech support — all in one place.",
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
