"use client"

import Script from "next/script"
import { useEffect, useRef } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          action: string
          theme: "light" | "dark" | "auto"
          callback: (token: string) => void
          "expired-callback": () => void
          "error-callback": () => void
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
    }
  }
}

type TurnstileWidgetProps = {
  siteKey: string
  theme: "light" | "dark"
  resetKey: number
  onToken: (token: string | null) => void
}

export function TurnstileWidget({ siteKey, theme, resetKey, onToken }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const renderedForTheme = useRef<string | null>(null)

  useEffect(() => {
    const render = () => {
      if (!window.turnstile || !containerRef.current) return

      if (widgetIdRef.current) window.turnstile.remove(widgetIdRef.current)
      containerRef.current.replaceChildren()
      onToken(null)
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: "document_upload",
        theme,
        callback: onToken,
        "expired-callback": () => onToken(null),
        "error-callback": () => onToken(null),
      })
      renderedForTheme.current = theme
    }

    if (window.turnstile && renderedForTheme.current !== theme) render()
    window.addEventListener("turnstile-ready", render)
    return () => window.removeEventListener("turnstile-ready", render)
  }, [onToken, siteKey, theme])

  useEffect(() => {
    if (widgetIdRef.current && window.turnstile) {
      onToken(null)
      window.turnstile.reset(widgetIdRef.current)
    }
  }, [onToken, resetKey])

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => window.dispatchEvent(new Event("turnstile-ready"))}
      />
      <div ref={containerRef} className="flex justify-center" aria-label="Upload verification" />
    </>
  )
}
