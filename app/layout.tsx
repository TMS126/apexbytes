// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Manrope, DM_Sans, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { InstanceGuardProvider } from '@/hooks/use-instance-guard'
import { BIZ } from '@/lib/brand'
import { LocalBusinessJsonLd } from '@/components/ui/json-ld'
import { FloatingSearchWidget } from '@/components/floating-search-widget'
import { QuoteCalculatorWidget } from "@/components/quote-calculator"
import { WhatsAppFAB } from '@/components/whatsapp-fab'
import { MaintenanceBanner } from '@/components/maintenance-banner'
import { headers } from 'next/headers'
import './globals.css'

// The middleware generates a per-request CSP nonce and forwards it to Next.js.
// Request-time rendering is required so inline bootstrap/flight scripts receive that nonce.
export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexbytes.vercel.app'
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-3FJ8QET6RE'

const manropeHeading = Manrope({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const dmSansBody = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BIZ.name} — ${BIZ.tagline}`,
  description: `We make technology and important services accessible to everyone — no jargon, no stress. Right here in ${BIZ.address}.`,
  keywords: ['printing Bothaville','printing Kgotsong','CV writing Kgotsong','SASSA help Kgotsong','ApexbytesHub'],
  authors: [{ name: BIZ.name }],
  
openGraph: {
  type: 'website', locale: 'en_ZA', url: SITE_URL, siteName: BIZ.name,
  title: `${BIZ.name} — ${BIZ.tagline}`,
  description: `Printing, CVs, design, SASSA/SARS help, and tech support in ${BIZ.location}.`,
  images: [{ url: '/api/og', width: 1200, height: 630, alt: BIZ.name }],
},
twitter: { card: 'summary_large_image', title: `${BIZ.name} — ${BIZ.tagline}`, images: ['/api/og'] },
  
  icons: {
    icon: [
      { url: '/favicon-light-32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-light-16.png', sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark-32.png', sizes: '32x32', type: 'image/png', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon-dark-16.png', sizes: '16x16', type: 'image/png', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon-1.ico', type: 'image/ico' },
    ],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
    shortcut: [{ url: '/logo.png', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F1F1EC' },
    { media: '(prefers-color-scheme: dark)', color: '#25283E' },
  ],
  width: 'device-width', initialScale: 1,
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined
  const isProd = process.env.NODE_ENV === 'production'

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manropeHeading.variable} ${dmSansBody.variable} ${monoFont.variable}`}
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground transition-colors duration-300 text-[17px] leading-relaxed">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:bg-white focus:text-brand-blue focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none">
          Skip to main content
        </a>

        <MaintenanceBanner />

        <ThemeProvider nonce={nonce} attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
          <LocalBusinessJsonLd />
          <InstanceGuardProvider><main id="main-content">{children}</main></InstanceGuardProvider>
          <FloatingSearchWidget />
          <QuoteCalculatorWidget />
          <WhatsAppFAB />
        </ThemeProvider>

        {isProd && (
          <>
            <Analytics />
            <SpeedInsights />
            <Script nonce={nonce} src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
            <Script nonce={nonce} id="ga4-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}</Script>
          </>
        )}
      </body>
    </html>
  )
} 
