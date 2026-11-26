// app/contact/page.tsx
import { ContactPage } from "@/components/contact-page"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageNoticeBell } from "@/components/page-notice-bell"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Contact Us",
  description: "WhatsApp, call, email or visit us in Kgotsong. We're here to help.",
  path: "/contact",
})

export default function ContactRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageNoticeBell page="contact" />
      <main id="main-content">
        <ContactPage />
      </main>
      <Footer />
    </div>
  )
} 
