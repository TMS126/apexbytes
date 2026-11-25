// components/terms-page.tsx
import Link from "next/link"
import { BIZ } from "@/lib/brand"
import { LegalContactCard, LegalPage, LegalSection } from "@/components/legal-page"
import { TERMS_SECTIONS } from "@/lib/terms-data"

export function TermsPage() {
  return (
    <LegalPage
      title="Terms & Service Policies"
      lastUpdated={BIZ.year}
      intro={
        <>
          These Terms & Service Policies set out the rules that apply when you use{" "}
          <strong className="text-zinc-800 dark:text-zinc-200">{BIZ.name}</strong>&apos;s print, document, design,
          e-service, and tech services — including payments, turnaround times, and responsibilities. By requesting or
          using a service, you agree to the terms below. They should be read together with our{" "}
          <Link href="/privacy" className="text-brand-blue underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </>
      }
    >
      {TERMS_SECTIONS.map((section, index) => (
        <LegalSection key={section.title} title={`${index + 1}. ${section.title}`}>
          <ul className="space-y-2 list-disc list-inside pl-1">
            {section.points.map((point) => (
              <li key={point.label}>
                <strong className="text-zinc-700 dark:text-zinc-300">{point.label}:</strong> {point.text}
              </li>
            ))}
          </ul>
        </LegalSection>
      ))}

      <LegalSection title={`${TERMS_SECTIONS.length + 1}. Contact Us`}>
        <p>Questions about these terms or how they apply to your service?</p>
        <LegalContactCard />
      </LegalSection>
    </LegalPage>
  )
}
