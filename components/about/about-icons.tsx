// components/about/about-icons.tsx
import { Target, Heart, Lightning, Desktop, Printer, DeviceMobile } from "@phosphor-icons/react"

export function renderIcon(iconName: string, className: string) {
  switch (iconName) {
    case "Target": return <Target weight="regular" className={className} aria-hidden="true" />
    case "Heart": return <Heart weight="regular" className={className} aria-hidden="true" />
    case "Lightning": return <Lightning weight="regular" className={className} aria-hidden="true" />
    case "Desktop": return <Desktop weight="regular" className={className} aria-hidden="true" />
    case "Printer": return <Printer weight="regular" className={className} aria-hidden="true" />
    case "DeviceMobile": return <DeviceMobile weight="regular" className={className} aria-hidden="true" />
    default: return <Target weight="regular" className={className} aria-hidden="true" />
  }
}
