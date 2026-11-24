// app/tools/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { FilePdf, FileText, ClipboardText, CurrencyDollar } from "@phosphor-icons/react/dist/ssr"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScrollBounce } from "@/components/scroll-bounce"
import { BIZ, WA } from "@/lib/brand"
import { CtaBar } from "@/components/strip-section"
import { PageScrollControls } from "@/components/page-scroll-controls"
import { PageNoticeBell } from "@/components/page-notice-bell"

export const metadata: Metadata = {
  title: `Tools — ${BIZ.name}`,
  description: "Free tools from ApexBytesHub: convert JPG to PDF, prepare a CV, and send service intake details."
}

const TOOLS = [
  { id: "jpg-to-pdf", name: "JPG to PDF", href: "/tools/jpg-to-pdf", Icon: FilePdf },
  { id: "cv-writing", name: "CV Writing / CV Typing", href: "/tools/cv-writing", Icon: FileText },
  { id: "intake-form", name: "Intake Form Filling", href: "/tools/intake-form", Icon: ClipboardText },
  { id: "quote", name: "Quote Calculator", href: "/tools/quote", Icon: CurrencyDollar },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageNoticeBell page="tools" />
      <main id="main-content">
      <section className="abh-editorial-hero">
        <div className="max-w-[720px] mx-auto text-center">
          <ScrollBounce>
            <h1 className="abh-page-title">Tools</h1>
          </ScrollBounce>
        </div>
      </section>

      <div className="px-6 md:px-8 pb-24">
        <div className="max-w-[720px] mx-auto">
          <div className="grid grid-cols-2 items-stretch gap-3 md:grid-cols-4">
            {TOOLS.map((tool) => (
              <ScrollBounce key={tool.id}>
                <Link
                    href={tool.href}
                    className="group flex min-h-32 w-full items-center justify-center rounded-[16px] bg-card/70 p-5 text-center shadow-[var(--ui-shadow-popup)] transition-transform duration-150 hover:-translate-y-1 active:translate-y-px"
                    aria-label={tool.name}
                  >
                    <span className="flex flex-col items-center gap-2 text-center">
                      <span className="flex size-12 items-center justify-center text-primary transition-colors group-hover:text-foreground">
                        <tool.Icon weight="regular" className="size-7" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-medium text-foreground">{tool.name}</span>
                    </span>
                  </Link>
              </ScrollBounce>
            ))}
          </div>

        </div>
      </div>
      <CtaBar
        badgeText="Need a hand?"
        title="Simple tools, helpful people."
        buttonText="Get in Touch"
        buttonHref={WA.general}
      />
      <PageScrollControls />
      </main>
      <Footer />
    </div>
  )
} 
