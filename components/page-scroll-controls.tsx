"use client"

import { BackToTopButton, useBackToTop } from "@/components/back-to-top-button"

export function PageScrollControls() {
  const visible = useBackToTop()
  return <BackToTopButton visible={visible} />
}
