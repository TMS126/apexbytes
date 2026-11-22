"use client"

import { useState } from "react"
import { useMounted } from "@/hooks/use-mounted"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { WhatsappLogo, EnvelopeSimple, FacebookLogo, Phone } from "@phosphor-icons/react"
import { BIZ, WA, FOOTER_NAV } from "@/lib/brand"
import { BusinessStatusFull } from "@/components/business-status"
import { ScrollBounce } from "@/components/scroll-bounce"
import { TermsGateModal } from "@/components/footer/terms-gate-modal"
import { FaqAccordion } from "@/components/footer/faq-accordion"

function FooterContent() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const mounted = useMounted()
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const showFaq = pathname !== "/contact"

  return (
    <div className="border-t border-border/50 bg-background pt-16 pb-12">
      {showFaq && (
        <ScrollBounce>
          <div className="px-6 md:px-10 lg:px-12 xl:px-16 mb-14 flex justify-center">
            <FaqAccordion />
          </div>
        </ScrollBounce>
      )}

      <div className="mx-4 md:mx-8">
      <div className="mx-auto max-w-[1280px] rounded-[14px] bg-[var(--footer-bg)] px-6 py-10 md:px-10">
      <ScrollBounce>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 select-none">
              <div
                className="relative w-6 h-6 overflow-hidden rounded-[10px] shrink-0"
                aria-hidden="true"
              >
                <Image
                  src="/logo.png"
                  alt=""
                  fill
                  className={`object-contain transition-[filter] duration-300 ${mounted && theme === "dark" ? "brightness-0 invert" : ""}`}
                />
              </div>
              <h2 className="font-sans font-medium text-lg tracking-tight text-zinc-900 dark:text-white">
                ApexbytesHub
              </h2>
            </div>
            <p className="text-base leading-relaxed text-zinc-600 dark:text-muted-foreground max-w-xs">
{BIZ.hubCount} hubs and {BIZ.serviceCount} services, all in one friendly place.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="text-[0.84rem] font-medium uppercase tracking-widest mb-8 text-muted-foreground">Quick Links</h3>
            <ul className="flex flex-col gap-4">
              {FOOTER_NAV.map((page) => {
                const isActive = pathname === page.path || pathname.startsWith(`${page.path}/`)

                return (
                  <li key={page.path}>
                    <Link
                      href={page.path}
                      aria-current={isActive ? "page" : undefined}
                      className={`text-base transition-all duration-200 inline-block hover:translate-x-1 hover:text-brand-blue ${
                        isActive
                          ? "font-medium text-zinc-900 dark:text-white"
                          : "font-medium text-zinc-600 dark:text-zinc-300"
                      }`}
                    >
                      {page.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex flex-col items-end text-right">
            <h3 className="mb-5 text-[0.84rem] font-medium uppercase tracking-widest text-muted-foreground">Connect With us:</h3>
            <div className="flex items-center justify-end gap-4">
              <a href={WA.general} target="_blank" rel="noopener noreferrer" aria-label={`Contact ${BIZ.name} on WhatsApp`} title="WhatsApp" className="abh-footer-icon-link hover:!text-[#25D366]"><WhatsappLogo weight="regular" size={25} /></a>
              <a href={`mailto:${BIZ.email}`} aria-label={`Email ${BIZ.name}`} title="Email" className="abh-footer-icon-link hover:!text-brand-blue"><EnvelopeSimple weight="regular" size={25} /></a>
              <a href={BIZ.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit ApexbytesHub on Facebook" title="Facebook" className="abh-footer-icon-link hover:!text-[#1877F2]"><FacebookLogo weight="regular" size={25} /></a>
              <a href={`tel:${BIZ.phoneE164}`} aria-label={`Call ${BIZ.name}`} title="Phone" className="abh-footer-icon-link hover:!text-brand-blue"><Phone weight="regular" size={25} /></a>
            </div>
            <div className="mt-7"><BusinessStatusFull /></div>
          </div>
        </div>
      </ScrollBounce>

      <ScrollBounce>
        <div className="mt-8 border-t border-border/50">
          <div className="max-w-[1280px] mx-auto pt-8 pb-8 px-6 md:px-10 flex flex-col md:grid md:grid-cols-3 items-center gap-4 text-center md:text-left">
            <p className="text-[0.78rem] font-medium text-muted-foreground md:text-left text-center">
              © {new Date().getFullYear()} {BIZ.name}. All rights reserved.
            </p>

            <div className="flex items-center justify-center gap-4 relative z-10">
              <button
                type="button"
                onClick={() => setIsTermsOpen(true)}
                style={{ fontSize: "0.78rem", lineHeight: "1.1rem" }}
                className="font-medium text-muted-foreground hover:text-brand-blue transition-colors py-2 px-1"
              >
                Terms
              </button>
              <span className="text-zinc-200 dark:text-zinc-700" aria-hidden="true">
                ·
              </span>
              <Link
                href="/privacy"
                prefetch
                className="text-[0.78rem] font-medium text-muted-foreground hover:text-brand-blue transition-colors py-2 px-1"
              >
                Privacy Policy
              </Link>
            </div>

            <span aria-hidden="true" />
          </div>
        </div>
      </ScrollBounce>
      </div>
      </div>

      <TermsGateModal open={isTermsOpen} onAgree={() => setIsTermsOpen(false)} />
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-background text-foreground">
      <FooterContent />
    </footer>
  )
}
