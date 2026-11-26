// app/tools/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { FilePdf, FileText, ClipboardText, CurrencyDollar } from "@phosphor-icons/react/dist/ssr"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BIZ, WA } from "@/lib/brand"
import { CtaBar } from "@/components/strip-section"
import { ScrollBounce } from "@/components/scroll-bounce"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Tools",
  description: "Free tools from ApexBytesHub: convert JPG to PDF, prepare a CV, and send service intake details.",
  path: "/tools",
})

const TOOLS = [
  { id: "jpg-to-pdf", name: "JPG to PDF", href: "/tools/jpg-to-pdf", Icon: FilePdf },
  { id: "cv-writing", name: "CV Writer", href: "/tools/cv-writing", Icon: FileText },
  { id: "intake-form", name: "Intake Form", href: "/tools/intake-form", Icon: ClipboardText },
  { id: "quote", name: "Quote Calc", href: "/tools/quote", Icon: CurrencyDollar },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
      <section className="abh-editorial-hero">
        <div className="max-w-[720px] mx-auto text-center">
          <ScrollBounce>
            <h1 className="abh-page-title mb-3">Tools</h1>
          </ScrollBounce>
          <p className="abh-tagline mx-auto max-w-md">
            Free, browser-based tools from {BIZ.name} — no sign-up, nothing leaves your device unless you choose to send it.
          </p>
          <div className="abh-divider mx-auto" />
        </div>
      </section>

      <div className="px-6 md:px-8 pb-24">
        <div className="max-w-[720px] mx-auto">
          <div id="tool-grid" className="grid scroll-mt-28 grid-cols-2 items-stretch gap-3 md:grid-cols-4">
            {TOOLS.map((tool) => (
              <ScrollBounce key={tool.id}>
                <Link
                    href={tool.href}
                    className="group flex min-h-32 w-full items-center justify-center rounded-[14px] bg-card/70 p-5 text-center shadow-[var(--ui-shadow-popup)] transition-transform duration-150 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-px"
                    aria-label={tool.name}
                  >
                    <span className="flex flex-col items-center gap-2 text-center">
                      <span className="abh-tool-icon flex size-10 items-center justify-center text-primary transition-colors group-hover:text-foreground">
                        <tool.Icon size={24} weight="regular" aria-hidden="true" />
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
      </main>
      <Footer />
    </div>
  )
} 
