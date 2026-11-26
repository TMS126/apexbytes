// app/pricing/page.tsx
import { headers } from 'next/headers'
import PricingPage from '@/components/pricing-page'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: "Pricing",
  description: "Browse instant pricing across Print, Document, Design, E-Service, and Tech — every service, one price list, no hidden fees.",
  path: "/pricing",
})

export default async function Page() {
  const nonce = (await headers()).get('x-nonce') ?? undefined
  return <PricingPage nonce={nonce} />
}
