"use client"

import { BackToTopButton, useBackToTop } from "@/components/back-to-top-button"
import { ScrollToBottomButton, useScrollToBottom } from "@/components/scroll-to-bottom-button"

/**
 * Shared page navigation controls. Only one arrow is visible at a time,
 * matching the Contact page: down until the user is near the bottom, then up.
 */
export function PageScrollControls() {
  const showBackToTop = useBackToTop()
  const showScrollToBottom = useScrollToBottom()
  const bottomClass = "bottom-24 md:bottom-6"

  return (
    <>
      <ScrollToBottomButton
        visible={showScrollToBottom && !showBackToTop}
        bottomClass={bottomClass}
        className="no-print"
      />
      <BackToTopButton
        visible={showBackToTop}
        bottomClass={bottomClass}
        className="no-print"
      />
    </>
  )
}
