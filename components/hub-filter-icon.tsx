import { SquaresFour } from "@phosphor-icons/react"
import { HubIcon } from "@/components/services-page/shared"
import type { HubId } from "@/lib/data"

export function HubFilterIcon({
  id,
  size = 34,
  weight = "regular",
  color,
}: {
  id: HubId | "all"
  size?: number
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
  color?: string
}) {
  if (id === "all") return <SquaresFour size={size} weight={weight} color={color} aria-hidden="true" />
  return <HubIcon id={id} size={size} weight={weight} color={color} />
}
