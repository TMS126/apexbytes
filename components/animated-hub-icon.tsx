"use client"

import type { CSSProperties } from "react"
import Image from "next/image"
import { Desktop, FileText, Globe, PaintBrush, Printer } from "@phosphor-icons/react"
import type { HubId } from "@/lib/data"

const ICONS: Record<HubId, React.ElementType> = {
  print: Printer,
  doc: FileText,
  design: PaintBrush,
  eservice: Globe,
  tech: Desktop,
}

export function AnimatedHubIcon({ hubId }: { hubId: HubId }) {
  const Icon = ICONS[hubId]

  return (
    <span
      className={`abh-home-hub-icon abh-home-hub-icon--${hubId}`}
      style={{ "--hub-icon-size" : "clamp(4rem, 12vw, 5rem)" } as CSSProperties}
      aria-hidden="true"
    >
      <Icon className="abh-home-hub-icon__base" weight="regular" />

      {hubId === "print" && <span className="abh-home-hub-icon__page" />}

      {hubId === "doc" && (
        <span className="abh-home-hub-icon__fold">
          <span />
        </span>
      )}

      {hubId === "design" && <span className="abh-home-hub-icon__paint-stroke" />}

      {hubId === "tech" && (
        <span className="abh-home-hub-icon__brand-flash">
          <Image src="/logo.png" alt="" width={64} height={36} />
        </span>
      )}
    </span>
  )
}
