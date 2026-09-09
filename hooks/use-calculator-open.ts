"use client"

import { useEffect, useState } from "react"

const EVENT_NAME = "abh:calculator-state"

export function useCalculatorOpen() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const sync = () => setIsOpen(document.body.dataset.abhCalculatorOpen === "true")
    sync()
    window.addEventListener(EVENT_NAME, sync)
    return () => window.removeEventListener(EVENT_NAME, sync)
  }, [])

  return isOpen
}

export function announceCalculatorState(isOpen: boolean) {
  if (typeof document === "undefined") return
  document.body.dataset.abhCalculatorOpen = isOpen ? "true" : "false"
  window.dispatchEvent(new Event(EVENT_NAME))
}
