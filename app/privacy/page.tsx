// app/privacy/page.tsx
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PrivacyPage } from "@/components/privacy-page"
import { PageScrollControls } from "@/components/page-scroll-controls"

export const metadata = {
  title:       "Privacy Policy — ApexbytesHub",
  description: "How Apexbytes Hub collects, uses, and protects your personal information in accordance with POPIA.",
}

export default function PrivacyRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div>
        <PrivacyPage />
      </div>
      <PageScrollControls />
      <Footer />
    </div>
  )
} 
