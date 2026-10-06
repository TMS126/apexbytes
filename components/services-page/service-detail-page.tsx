"use client"

import { ServiceDetailModal } from "./service-detail-modal"
import type { SelectedService } from "./lib"

export function ServiceDetailPage({ service }: { service: SelectedService }) {
  return <ServiceDetailModal svc={service} onClose={() => window.history.back()} />
}
