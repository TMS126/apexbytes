// components/ui/json-ld.tsx
import Script from 'next/script'
import { BIZ } from '@/lib/brand'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexbytes.vercel.app'

export function LocalBusinessJsonLd({ nonce }: { nonce?: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    name: BIZ.name,
    // Do not publish alternate brand spellings; ApexBytesHub is canonical.
    image: `${SITE_URL}/logo.png`,
    '@id': SITE_URL,
    url: SITE_URL,
    telephone: BIZ.callPhoneE164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BIZ.address,
      addressLocality: 'Bothaville',
      addressRegion: 'Free State',
      postalCode: '9660',
      addressCountry: 'ZA',
    },
    // FIX: was hardcoded to an "Approximate for Bothaville" placeholder
    // that didn't match BIZ.lat/BIZ.lng. Now derives from the one real
    // source of truth.
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BIZ.lat,
      longitude: BIZ.lng,
    },
    areaServed: [
      { '@type': 'Place', name: 'Kgotsong' },
      { '@type': 'Place', name: 'Mpumalanga Section' },
      { '@type': 'Place', name: 'Bothaville' },
      { '@type': 'AdministrativeArea', name: 'Nala Local Municipality' },
      { '@type': 'AdministrativeArea', name: 'Lejweleputswa District Municipality' },
      { '@type': 'AdministrativeArea', name: 'Free State' },
    ],
    sameAs: [
      `https://wa.me/${BIZ.whatsappPhoneE164.replace('+', '')}`,
      BIZ.facebookUrl,
      BIZ.mapsUrl,
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'ApexBytesHub Services',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Print Hub',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Printing & Photocopying' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Design Hub',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Graphic & Logo Design' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Document Hub',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Scanning, Typing, Laminating & Binding' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'CV Writing' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'E-Service Hub',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SASSA Applications' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SARS eFiling Assistance' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Online Application Assistance' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Tech Hub',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Computer & Laptop Repairs' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Tech Support' } },
          ],
        },
      ],
    },
  }

  return (
    <Script
      id="local-business-jsonld"
      type="application/ld+json"
      strategy="afterInteractive"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
