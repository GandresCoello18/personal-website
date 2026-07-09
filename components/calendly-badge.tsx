"use client"

import Script from "next/script"
import { useTheme } from "next-themes"
import { useCallback, useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    Calendly?: {
      initBadgeWidget: (opts: {
        url: string
        text: string
        color: string
        textColor: string
        branding?: boolean
      }) => void
    }
  }
}

const CALENDLY_URL = "https://calendly.com/goyeselcoca/30min"
const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css"
const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js"

const BADGE_COLORS = {
  light: { color: "#92baee", textColor: "#ffffff" },
  dark: { color: "#1c4e5a", textColor: "#ffffff" },
} as const

function ensureCalendlyCss() {
  if (typeof document === "undefined") return
  const id = "calendly-widget-css"
  if (document.getElementById(id)) return
  const link = document.createElement("link")
  link.id = id
  link.rel = "stylesheet"
  link.href = CALENDLY_CSS
  document.head.appendChild(link)
}

function updateBadgeColors(color: string, textColor: string) {
  if (typeof document === "undefined") return

  document.querySelectorAll<HTMLElement>(".calendly-badge-content").forEach((el) => {
    el.style.background = color
    el.style.color = textColor
  })
}

function removeCalendlyBadge() {
  if (typeof document === "undefined") return
  document.querySelectorAll(".calendly-badge-widget").forEach((el) => el.remove())
}

export function CalendlyBadge() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scriptReady, setScriptReady] = useState(false)
  const initializedRef = useRef(false)

  const getColors = useCallback(() => {
    const isDark = resolvedTheme === "dark"
    return isDark ? BADGE_COLORS.dark : BADGE_COLORS.light
  }, [resolvedTheme])

  useEffect(() => {
    setMounted(true)
    ensureCalendlyCss()
  }, [])

  useEffect(() => {
    if (!mounted || !scriptReady || !resolvedTheme) return

    const colors = getColors()

    if (!initializedRef.current) {
      if (!window.Calendly?.initBadgeWidget) return

      try {
        window.Calendly.initBadgeWidget({
          url: CALENDLY_URL,
          text: "Programe una reunión conmigo",
          color: colors.color,
          textColor: colors.textColor,
          branding: true,
        })
        initializedRef.current = true
      } catch (error) {
        console.error("Calendly badge init failed:", error)
      }
      return
    }

    updateBadgeColors(colors.color, colors.textColor)
  }, [mounted, scriptReady, resolvedTheme, getColors])

  useEffect(() => {
    return () => {
      removeCalendlyBadge()
      initializedRef.current = false
    }
  }, [])

  return (
    <Script
      src={CALENDLY_JS}
      strategy="afterInteractive"
      onLoad={() => setScriptReady(true)}
    />
  )
}
