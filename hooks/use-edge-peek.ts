// hooks/use-edge-peek.ts
"use client"

// Shared "sticky edge" behavior for floating action buttons that rest
// half-hidden against the screen edge until touched.
//
// Touch: first tap slides the FAB fully into view (does NOT open it). A
// second tap within RETRACT_MS opens it. No second tap -> auto-retracts
// back to half-hidden.
// Mouse: hovering reveals it immediately; a click opens it straight away.

import { useCallback, useEffect, useRef, useState } from "react"

const RETRACT_MS = 3200

export function useEdgePeek(onOpen: () => void) {
  const [peeking, setPeeking] = useState(false)
  const retractTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchHandledRef = useRef(false)

  const clearRetractTimer = useCallback(() => {
    if (retractTimer.current) {
      clearTimeout(retractTimer.current)
      retractTimer.current = null
    }
  }, [])

  const armRetractTimer = useCallback(() => {
    clearRetractTimer()
    retractTimer.current = setTimeout(() => setPeeking(false), RETRACT_MS)
  }, [clearRetractTimer])

  useEffect(() => clearRetractTimer, [clearRetractTimer])

  // Touch: handles the two-tap sequence directly on pointerdown so the
  // first tap never reaches onClick.
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "touch") return
    touchHandledRef.current = true
    if (!peeking) {
      e.preventDefault()
      setPeeking(true)
      armRetractTimer()
    } else {
      clearRetractTimer()
      setPeeking(false)
      onOpen()
    }
  }, [peeking, armRetractTimer, clearRetractTimer, onOpen])

  // Mouse/pen: click opens directly (hover already revealed it below).
  // Guard against the synthetic click that follows a touch pointerdown.
  const handleClick = useCallback(() => {
    if (touchHandledRef.current) { touchHandledRef.current = false; return }
    onOpen()
  }, [onOpen])

  const handleMouseEnter = useCallback(() => {
    clearRetractTimer()
    setPeeking(true)
  }, [clearRetractTimer])

  const handleMouseLeave = useCallback(() => setPeeking(false), [])

  return { peeking, handlePointerDown, handleClick, handleMouseEnter, handleMouseLeave }
}
