// app/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { BIZ } from '@/lib/brand'

export const runtime = 'edge'
export const alt = `${BIZ.name} — ${BIZ.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
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
    { ...size }
  )
} 
