// app/api/og/service/route.tsx
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { HUBS, type HubId } from '@/lib/data'
import { BIZ } from '@/lib/brand'

export const runtime = 'edge'

const HUB_ORDER: HubId[] = ['print', 'doc', 'design', 'eservice', 'tech']

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const hubParam = searchParams.get('hub')
  const sectionParam = searchParams.get('section')
  const serviceParam = searchParams.get('service')

let title: string = BIZ.name
let subtitle: string = BIZ.tagline
let price: string = ''
let bg: string = 'linear-gradient(135deg, #0F3F66 0%, #15537D 55%, #1E6FA8 100%)'
  if (hubParam && HUB_ORDER.includes(hubParam as HubId) && sectionParam && serviceParam) {
    const hub = HUBS[hubParam as HubId]
    const section = hub.sections.find((s) => s.title === sectionParam)
    const item = section?.items.find((i) => i.name === serviceParam)
    if (item) {
      title = item.name
      subtitle = `${hub.title} — ${BIZ.name}`
      price = item.price
      bg = hub.tagStyleDark ? `linear-gradient(135deg, ${hub.tagStyle.color} 0%, ${hub.tagStyleDark.color === '#ffffff' ? '#1a1a1a' : hub.tagStyleDark.color} 100%)` : bg
    }
  }

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
          backgroundImage: bg,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '64px',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            maxWidth: '1000px',
          }}
        >
          {title}
        </div>
        {price && (
          <div style={{ display: 'flex', fontSize: '44px', fontWeight: 800, color: '#ffffff', marginTop: '14px' }}>
            {price}
          </div>
        )}
        <div style={{ display: 'flex', fontSize: '28px', fontWeight: 500, color: '#D7E6F0', marginTop: '20px' }}>
          {subtitle}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
