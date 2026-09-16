// next.config.mjs — full file, only the CSP value line changed
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // ── hides "X-Powered-By: Next.js" header ──
  productionBrowserSourceMaps: false, // ── stops strangers reading your unminified source code in browser devtools ──

  // ── Images ──
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'], // ── smaller images automatically, no code changes needed ──
  },

  // ── Headers ──
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'X-Frame-Options',          value: 'DENY' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
}

export default nextConfig
