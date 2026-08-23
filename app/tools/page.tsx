// app/tools/page.tsx
import type { Metadata } from "next"
import Link from "next/link"
import { FilePdf, Wrench, Sparkle } from "@phosphor-icons/react/dist/ssr"
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
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-8">
        <div className="max-w-[720px] mx-auto">
          <ScrollBounce>
            <div className="text-center mb-12">
              <div
                className="inline-flex items-center justify-center w-14 h-14 rounded-[14px] mb-5"
                style={{ backgroundColor: `${BRAND.blue}14` }}
              >
                <Wrench weight="fill" className="w-7 h-7" style={{ color: BRAND.blue }} />
              </div>
              <h1 className="font-sans font-black text-3xl md:text-4xl tracking-tight text-zinc-900 dark:text-white mb-3">
                Tools
              </h1>
              <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                Free, browser-based tools from {BIZ.name} — no sign-up, nothing leaves your device unless you choose to send it.
              </p>
            </div>
          </ScrollBounce>

          <div className="flex flex-wrap justify-center gap-3">
            {TOOLS.map((tool) => (
              <ScrollBounce key={tool.id}>
                <Link
                  href={tool.href}
                  className="group flex items-center gap-3 pl-4 pr-5 py-3 rounded-[14px] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-brand-blue/50 transition-all duration-150 active:scale-[0.98] shadow-sm hover:shadow-md"
                >
                  <span
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${BRAND.blue}14` }}
                  >
                    <tool.Icon weight="fill" className="w-5 h-5" style={{ color: BRAND.blue }} />
                  </span>
                  <span className="text-left">
                    <span className="block text-[0.95rem] font-black text-zinc-900 dark:text-white">{tool.name}</span>
                    <span className="block text-[0.78rem] text-zinc-500 dark:text-zinc-400 max-w-[220px]">{tool.desc}</span>
                  </span>
                </Link>
              </ScrollBounce>
            ))}
          </div>

          <ScrollBounce delay={0.1}>
            <div className="mt-6 rounded-[14px] border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-5 flex items-start gap-3">
              <span
                className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${BRAND.orange}14` }}
              >
                <Sparkle weight="fill" className="w-5 h-5" style={{ color: BRAND.orange }} />
              </span>
              <div>
                <p className="text-[0.95rem] font-black text-zinc-800 dark:text-zinc-200 mb-1">More Tools — Coming Soon</p>
                <p className="text-[0.85rem] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  We're building out more free tools for this page. Check back soon, or WhatsApp us if there's something specific you'd find useful.
                </p>
              </div>
            </div>
          </ScrollBounce>
        </div>
      </div>
      <Footer />
    </div>
  )
            } 
