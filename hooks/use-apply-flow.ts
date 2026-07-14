"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { AnalyzeResult } from "@/services/apply/result"
import type { CvKey } from "@/lib/apply/cv"
import { CV_FILES } from "@/lib/apply/cv"
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
  const [drafting, setDrafting] = useState(false)
  const [analyzeError, setAnalyzeError] = useState("")
  const [draftError, setDraftError] = useState("")
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

  const hydratePreview = useCallback(
    (extract: JobExtract, draft: EmailDraft | null, cvFilename: string | null) => {
      setPreview((prev) => ({
        company: extract.company,
        position: extract.position,
        email: extract.email ?? prev?.email ?? "",
        category: extract.category,
        confidence: extract.confidence,
        cvFilename: cvFilename ?? prev?.cvFilename ?? "",
        subject: draft?.subject ?? prev?.subject ?? "",
        body: draft?.body ?? prev?.body ?? "",
      }))
    },
    [],
  )

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
    setDraftError("")
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
      hydratePreview(analyzed.extract, null, analyzed.cvFilename)
      if (analyzed.extract.category !== "unknown") {
        setCategoryOverride(analyzed.extract.category)
      }
    } catch {
      setAnalyzeError("Error de red al analizar")
    } finally {
      setAnalyzing(false)
    }
  }, [mode, text, imageFile, categoryOverride, manualCv, hydratePreview])

  const generateDraft = useCallback(async () => {
    if (!result?.extract) {
      setDraftError("Primero analiza la vacante.")
      return
    }

    setDrafting(true)
    setDraftError("")
    try {
      const category =
        categoryOverride ||
        preview?.category ||
        result.extract.category
      const cvKey: CvKey | "" =
        manualCv ||
        (preview?.cvFilename === CV_FILES.software
          ? "software"
          : preview?.cvFilename === CV_FILES.education
            ? "education"
            : "")

      const res = await fetch("/api/apply/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extract: {
            ...result.extract,
            company: preview?.company ?? result.extract.company,
            position: preview?.position ?? result.extract.position,
            email: preview?.email || result.extract.email,
            category,
          },
          categoryOverride: category || undefined,
          manualCv: cvKey || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setDraftError(data.error || "Error al generar el correo")
        return
      }

      const drafted = data as AnalyzeResult
      setResult(drafted)
      hydratePreview(drafted.extract, drafted.draft, drafted.cvFilename)
    } catch {
      setDraftError("Error de red al generar el correo")
    } finally {
      setDrafting(false)
    }
  }, [result, categoryOverride, manualCv, preview, hydratePreview])

  const canSend = useMemo(() => {
    if (!preview) return false
    if (!preview.email.trim()) return false
    if (!preview.cvFilename) return false
    if (!preview.subject.trim() || !preview.body.trim()) return false
    return true
  }, [preview])

  const canDraft = useMemo(() => {
    if (!result?.extract) return false
    if (analyzing || drafting) return false
    const category = preview?.category || categoryOverride || result.extract.category
    if (category === "software" || category === "education") return true
    if (manualCv) return true
    if (preview?.cvFilename) return true
    return false
  }, [result, analyzing, drafting, preview, categoryOverride, manualCv])

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
    drafting,
    analyzeError,
    draftError,
    analyze,
    generateDraft,
    canDraft,
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
