// app/api/og/service/route.tsx
/* eslint-disable @next/next/no-img-element -- ImageResponse requires a plain img element. */
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { HUBS, type HubId } from '@/lib/data'
import { BIZ } from '@/lib/brand'

export const runtime = 'edge'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexbytes.vercel.app'
const HUB_ORDER: HubId[] = ['print', 'doc', 'design', 'eservice', 'tech']

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const hubParam = searchParams.get('hub')
  const sectionParam = searchParams.get('section')
  const serviceParam = searchParams.get('service')

let title: string = BIZ.name
let subtitle: string = BIZ.tagline
let price: string = ''
let bg: string = '#2D314B'
  if (hubParam && HUB_ORDER.includes(hubParam as HubId) && sectionParam && serviceParam) {
    const hub = HUBS[hubParam as HubId]
    const section = hub.sections.find((s) => s.title === sectionParam)
    const item = section?.items.find((i) => i.name === serviceParam)
    if (item) {
      title = item.name
      subtitle = `${hub.title} — ${BIZ.name}`
      price = item.price
      bg = '#FA5215'
    }
  }

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
          backgroundColor: bg,
        }}
      >
        {/* NEW — logo watermark, ported over from the generic /api/og
            route. This route (og/service) is the one actually used for
            shared per-service links, and previously had no watermark at
            all. Dimensions computed from logo.png's real 1240×674 size
            (ratio ≈1.84:1) so it doesn't stretch/distort — the generic
            route's original 420×420 forced-square was doing exactly that. */}
        <img
          src={`${SITE_URL}/logo.png`}
          alt=""
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
