// app/terms/page.tsx
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TermsPage } from "@/components/terms-page"
import { PageScrollControls } from "@/components/page-scroll-controls"

export const metadata = {
  title:       "Terms & Service Policies — ApexBytesHub",
  description: "The service, payment, and operational terms that apply to ApexBytesHub's print, document, design, e-service, and tech services.",
}

export default function TermsRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
        <TermsPage />
      </main>
      <PageScrollControls />
      <Footer />
    </div>
  )
}
