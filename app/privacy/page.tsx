// app/privacy/page.tsx
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PrivacyPage } from "@/components/privacy-page"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title:       "Privacy Policy",
  description: "How ApexBytesHub collects, uses, and protects your personal information in accordance with POPIA.",
  path:        "/privacy",
})

export default function PrivacyRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
        <PrivacyPage />
      </main>
      <Footer />
    </div>
  )
} 
