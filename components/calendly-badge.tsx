"use client"

import Script from "next/script"
import { useTheme } from "next-themes"
import { useCallback, useEffect, useMemo, useState } from "react"

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

function cleanupCalendlyBadge() {
  if (typeof document === "undefined") return
  document.querySelectorAll(".calendly-badge-widget").forEach((el) => el.remove())
  document.querySelectorAll("iframe[src*=\"calendly.com\"]").forEach((el) => {
    const parent = el.parentElement
    const looksLikeBadge =
      parent?.classList.contains("calendly-overlay") ||
      parent?.classList.contains("calendly-badge-widget") ||
      el.getAttribute("title")?.toLowerCase().includes("calendly")
    if (looksLikeBadge) el.remove()
  })
}

export function CalendlyBadge() {
  const { resolvedTheme } = useTheme()
  const [scriptReady, setScriptReady] = useState(false)

  const badgeColors = useMemo(() => {
    const isDark = resolvedTheme === "dark"
    return {
      color: isDark ? "#1c4e5a" : "#92baee",
      textColor: "#ffffff",
    }
  }, [resolvedTheme])

  const init = useCallback(() => {
    if (typeof window === "undefined") return
    if (!window.Calendly?.initBadgeWidget) return

    cleanupCalendlyBadge()
    window.Calendly.initBadgeWidget({
      url: CALENDLY_URL,
      text: "Programe una reunión conmigo",
      color: badgeColors.color,
      textColor: badgeColors.textColor,
      branding: true,
    })
  }, [badgeColors.color, badgeColors.textColor])

  useEffect(() => {
    ensureCalendlyCss()
  }, [])

  useEffect(() => {
    if (!scriptReady) return
    init()
  }, [init, scriptReady])

  return (
    <Script
      src={CALENDLY_JS}
      strategy="afterInteractive"
      onLoad={() => {
        setScriptReady(true)
      }}
    />
  )
}

