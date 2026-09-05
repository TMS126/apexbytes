// app/pricing/page.tsx
import { headers } from 'next/headers'
import PricingPage from '@/components/pricing-page'

export const metadata = {
  title: "Pricing — ApexbytesHub",
  description: "Browse instant pricing across Print, Document, Design, E-Service, and Tech — every service, one price list, no hidden fees.",
}

export default async function Page() {
  const nonce = (await headers()).get('x-nonce') ?? undefined
  return <PricingPage nonce={nonce} />
}
