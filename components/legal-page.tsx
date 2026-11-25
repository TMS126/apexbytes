// components/legal-page.tsx
import type { ReactNode } from "react"
import { BIZ, waChatLink } from "@/lib/brand"

/**
 * Shared shell for the legal documents (Privacy Policy, Terms & Service
 * Policies). Keeping the header, intro card, typography and contact block
 * here means both pages stay visually identical as their copy changes.
 */
export function LegalPage({
  title,
  lastUpdated,
  intro,
  children,
}: {
  title: string
  lastUpdated: string
  intro: ReactNode
  children: ReactNode
}) {
  return (
    // The fixed header grows to 118px (via --nav-h) whenever the maintenance
    // banner is showing, so the hero tracks that live variable rather than a
    // hardcoded header height.
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 md:px-8 pb-24">
        <div className="abh-editorial-hero mb-12">
          <span className="abh-eyebrow">Legal</span>
          <h1 className="abh-page-title mt-4">{title}</h1>
          <p className="abh-tagline mt-3 max-w-xl">
            {BIZ.name} &mdash; Last updated {lastUpdated}
          </p>
          <p className="mt-6 text-[1.08rem] leading-relaxed text-zinc-600 dark:text-muted-foreground p-4 rounded-[14px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            {intro}
          </p>
        </div>

        <div className="space-y-10 text-[1.08rem] text-zinc-600 dark:text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-medium text-xl text-zinc-900 dark:text-zinc-50 mb-3">{title}</h2>
      {children}
    </section>
  )
}

export function LegalContactCard() {
  return (
    <div className="mt-3 p-4 rounded-[14px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-1">
      <p>
        <strong className="text-zinc-700 dark:text-zinc-300">{BIZ.name}</strong>
      </p>
      <p>{BIZ.addressFull}</p>
      <p>
        Email:{" "}
        <a href={`mailto:${BIZ.email}`} className="text-brand-blue underline underline-offset-2">
          {BIZ.email}
        </a>
      </p>
      <p>
        Phone:{" "}
        <a href={`tel:${BIZ.callPhoneE164}`} className="text-brand-blue underline underline-offset-2">
          {BIZ.callPhone}
        </a>
      </p>
      <p>
        WhatsApp:{" "}
        <a href={waChatLink()} className="text-brand-blue underline underline-offset-2">
          {BIZ.whatsappPhone}
        </a>
      </p>
    </div>
  )
}
