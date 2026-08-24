// app/api/og/route.tsx
import { ImageResponse } from 'next/og'
import { BIZ } from '@/lib/brand'

export const runtime = 'edge'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexbytes.vercel.app'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#0F3F66',
          backgroundImage:
            'linear-gradient(135deg, #0F3F66 0%, #15537D 55%, #1E6FA8 100%)',
        }}
      >
        {/* FIX: was width=420 height=420 forcing the real 1240×674 logo
            (ratio ≈1.84:1) into a square — visibly stretched/squashed.
            Height now computed to preserve the actual aspect ratio. */}
        <img
          src={`${SITE_URL}/logo.png`}
          width={420}
          height={228}
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-40px',
            opacity: 0.12,
            filter: 'brightness(0) invert(1)',
          }}
        />
        <div style={{ display: 'flex', gap: '14px', marginBottom: '36px' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '5px', backgroundColor: '#4A8011' }} />
          <div style={{ width: '18px', height: '18px', borderRadius: '5px', backgroundColor: '#B9590D' }} />
          <div style={{ width: '18px', height: '18px', borderRadius: '5px', backgroundColor: '#ffffff' }} />
        </div>
        <div style={{ display: 'flex', fontSize: '76px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          {BIZ.name}
        </div>
        <div style={{ display: 'flex', fontSize: '32px', fontWeight: 500, color: '#D7E6F0', marginTop: '20px' }}>
          {BIZ.tagline}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
} 
