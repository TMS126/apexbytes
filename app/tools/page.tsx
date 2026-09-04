// app/tools/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { FilePdf, Wrench } from "@phosphor-icons/react/dist/ssr"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ScrollBounce } from "@/components/scroll-bounce"
import { BIZ } from "@/lib/brand"
import { ComingSoonTool } from "@/components/coming-soon-tool"

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
          <div className="grid grid-cols-2 items-stretch gap-4">
            {TOOLS.map((tool) => (
              <ScrollBounce key={tool.id}>
                {tool.id === "coming-soon" ? (
                  <ComingSoonTool />
                ) : (
                  <Link
                    href={tool.href}
                    className="group flex min-h-24 w-full items-center justify-center rounded-[14px] p-5 text-center transition-transform duration-150 active:translate-y-px"
                    aria-label={tool.name}
                  >
                    <span className="flex flex-col items-center gap-2 text-center">
                      <span className="flex size-12 items-center justify-center rounded-[14px] bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <tool.Icon weight="regular" className="size-7" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-bold text-foreground">{tool.name}</span>
                    </span>
                  </Link>
                )}
              </ScrollBounce>
            ))}
          </div>

          <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
            More focused utilities are being built for this workspace.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
} 
