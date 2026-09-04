// app/tools/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { FilePdf, Wrench } from "@phosphor-icons/react/dist/ssr"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScrollBounce } from "@/components/scroll-bounce"
import { BRAND, BIZ } from "@/lib/brand"

export const metadata: Metadata = {
  title: `Tools — ${BIZ.name}`,
  description: "Free browser-based tools from ApexbytesHub — starting with JPG to PDF conversion, with more on the way.",
}

const TOOLS = [
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    desc: "Convert images into a PDF right in your browser — nothing is uploaded.",
    href: "/tools/jpg-to-pdf",
    Icon: FilePdf,
  },
  {
    id: "coming-soon",
    name: "Coming soon",
    desc: "Another focused utility is on the way.",
    href: "#coming-soon",
    Icon: Wrench,
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="px-4 md:px-8 pt-[calc(var(--nav-h)+2rem)] pb-6">
        <div className="max-w-[720px] mx-auto text-center">
          <ScrollBounce>
            <h1 className="abh-page-title mb-3">Tools</h1>
          </ScrollBounce>
          <p className="abh-tagline max-w-md mx-auto">
            Free, browser-based tools from {BIZ.name} — no sign-up, nothing leaves your device unless you choose to send it.
          </p>
          <div className="abh-divider mx-auto" />
        </div>
      </section>

      <div className="px-6 md:px-8 pb-24">
        <div className="max-w-[720px] mx-auto">
          <div className="flex flex-wrap justify-start gap-3">
            {TOOLS.map((tool) => (
              <ScrollBounce key={tool.id}>
                <Link
                  href={tool.href}
                  className="group flex items-center gap-3 pl-4 pr-5 py-3 rounded-[4px] border border-border bg-card hover:border-foreground/40 hover:shadow-md transition-shadow duration-150 active:scale-[0.98] abh-shadow-card"
                >
                  <span
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `color-mix(in srgb, ${BRAND.blue} 8%, transparent)` }}
                  >
                    <tool.Icon weight="fill" className="w-5 h-5" style={{ color: BRAND.blue }} />
                  </span>
                  <span className="text-left">
                    <span className="block text-[0.95rem] font-black text-zinc-900 dark:text-white">{tool.name}</span>
                    <span className="block text-[0.78rem] text-muted-foreground dark:text-muted-foreground max-w-[220px]">{tool.desc}</span>
                  </span>
                </Link>
              </ScrollBounce>
            ))}
          </div>

          <p className="mt-8 text-left text-sm font-semibold text-muted-foreground">
            More focused utilities are being built for this workspace.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
} 
