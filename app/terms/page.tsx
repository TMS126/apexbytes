// app/terms/page.tsx
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TermsPage } from "@/components/terms-page"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title:       "Terms & Service Policies",
  description: "The service, payment, and operational terms that apply to ApexBytesHub's print, document, design, e-service, and tech services.",
  path:        "/terms",
})

export default function TermsRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
        <TermsPage />
      </main>
      <Footer />
    </div>
  )
}
