"use client"

import { HomeNoticeStack } from "@/components/home-notice-stack"
import { HOME_NOTICES } from "@/lib/home-notices"

export function SiteNoticeMount() {
  return (
    <HomeNoticeStack
      notices={HOME_NOTICES}
      className="pointer-events-auto fixed left-4 top-20 z-[9992] md:left-6"
    />
  )
}
