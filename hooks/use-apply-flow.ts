"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { AnalyzeResult } from "@/services/apply/analyze"
import type { CvKey } from "@/lib/apply/cv"
import type { JobCategory, JobExtract, EmailDraft } from "@/lib/apply/types"

export type SourceMode = "text" | "image"

export type PreviewState = {
  company: string
  position: string
  email: string
  category: JobCategory
  confidence: number
  cvFilename: string
  subject: string
  body: string
}

export function useApplyFlow() {
  const [unlocked, setUnlocked] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [secret, setSecret] = useState("")
  const [unlockError, setUnlockError] = useState("")
  const [unlocking, setUnlocking] = useState(false)

  const [mode, setMode] = useState<SourceMode>("text")
  const [text, setText] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState("")
  const [result, setResult] = useState<AnalyzeResult | null>(null)

  const [categoryOverride, setCategoryOverride] = useState<JobCategory | "">("")
  const [manualCv, setManualCv] = useState<CvKey | "">("")

  const [preview, setPreview] = useState<PreviewState | null>(null)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState("")
  const [sendSuccess, setSendSuccess] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/apply/session")
        const data = await res.json()
        if (!cancelled) setUnlocked(Boolean(data.unlocked))
      } catch {
        if (!cancelled) setUnlocked(false)
      } finally {
        if (!cancelled) setCheckingSession(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const hydratePreview = useCallback((extract: JobExtract, draft: EmailDraft | null, cvFilename: string | null) => {
    setPreview({
      company: extract.company,
      position: extract.position,
      email: extract.email ?? "",
      category: extract.category,
      confidence: extract.confidence,
      cvFilename: cvFilename ?? "",
      subject: draft?.subject ?? "",
      body: draft?.body ?? "",
    })
  }, [])

  const unlock = useCallback(async () => {
    setUnlocking(true)
    setUnlockError("")
    try {
      const res = await fetch("/api/apply/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      })
      const data = await res.json()
      if (!res.ok) {
        setUnlockError(data.error || "Acceso denegado")
        return
      }
      setUnlocked(true)
      setSecret("")
    } catch {
      setUnlockError("No se pudo validar el acceso")
    } finally {
      setUnlocking(false)
    }
  }, [secret])

  const analyze = useCallback(async () => {
    setAnalyzing(true)
    setAnalyzeError("")
    setSendSuccess(false)
    setSendError("")
    try {
      const form = new FormData()
      form.set("mode", mode)
      if (categoryOverride) form.set("categoryOverride", categoryOverride)
      if (manualCv) form.set("manualCv", manualCv)

      if (mode === "text") {
        form.set("text", text)
      } else {
        if (!imageFile) {
          setAnalyzeError("Selecciona una imagen PNG o JPG.")
          return
        }
        form.set("image", imageFile)
      }

      const res = await fetch("/api/apply/analyze", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) {
        setAnalyzeError(data.error || "Error al analizar")
        return
      }

      const analyzed = data as AnalyzeResult
      setResult(analyzed)
      hydratePreview(analyzed.extract, analyzed.draft, analyzed.cvFilename)
      if (analyzed.extract.category !== "unknown") {
        setCategoryOverride(analyzed.extract.category)
      }
    } catch {
      setAnalyzeError("Error de red al analizar")
    } finally {
      setAnalyzing(false)
    }
  }, [mode, text, imageFile, categoryOverride, manualCv, hydratePreview])

  const canSend = useMemo(() => {
    if (!preview) return false
    if (!preview.email.trim()) return false
    if (!preview.cvFilename) return false
    if (!preview.subject.trim() || !preview.body.trim()) return false
    return true
  }, [preview])

  const send = useCallback(async () => {
    if (!preview || !canSend) return
    setSending(true)
    setSendError("")
    setSendSuccess(false)
    try {
      const res = await fetch("/api/apply/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: preview.company,
          position: preview.position,
          email: preview.email,
          category: preview.category,
          confidence: preview.confidence,
          cvFilename: preview.cvFilename,
          subject: preview.subject,
          body: preview.body,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSendError(data.error || "Error al enviar")
        return
      }
      setSendSuccess(true)
    } catch {
      setSendError("Error de red al enviar")
    } finally {
      setSending(false)
    }
  }, [preview, canSend])

  return {
    unlocked,
    checkingSession,
    secret,
    setSecret,
    unlockError,
    unlocking,
    unlock,
    mode,
    setMode,
    text,
    setText,
    imageFile,
    setImageFile,
    analyzing,
    analyzeError,
    analyze,
    result,
    categoryOverride,
    setCategoryOverride,
    manualCv,
    setManualCv,
    preview,
    setPreview,
    canSend,
    sending,
    sendError,
    sendSuccess,
    send,
  }
}
