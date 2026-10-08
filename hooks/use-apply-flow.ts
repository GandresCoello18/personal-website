"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { AnalyzeResult } from "@/services/apply/result"
import type { CvKey } from "@/lib/apply/cv"
import { CV_FILES } from "@/lib/apply/cv"
import type { ApplyCheckResult } from "@/lib/radar/types"
import type { JobCategory, JobExtract, EmailDraft } from "@/lib/apply/types"

export type SourceMode = "text" | "image"

export type PreviewState = {
  company: string
  position: string
  email: string
  recruiterName: string
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
  const [recruiterProfileText, setRecruiterProfileText] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [drafting, setDrafting] = useState(false)
  const [analyzeError, setAnalyzeError] = useState("")
  const [draftError, setDraftError] = useState("")
  const [result, setResult] = useState<AnalyzeResult | null>(null)

  const [categoryOverride, setCategoryOverride] = useState<JobCategory | "">("")
  const [manualCv, setManualCv] = useState<CvKey | "">("")

  const [preview, setPreview] = useState<PreviewState | null>(null)
  const [jobUrl, setJobUrl] = useState("")
  const [history, setHistory] = useState<ApplyCheckResult | null>(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState("")
  const [sendSuccess, setSendSuccess] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [registerError, setRegisterError] = useState("")
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const sendingLock = useRef(false)

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
        recruiterName: extract.recruiterName || prev?.recruiterName || "",
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
    setRegisterSuccess(false)
    setRegisterError("")
    setHistory(null)
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
      const category = categoryOverride || preview?.category || result.extract.category
      const cvKey: CvKey | "" =
        manualCv ||
        (preview?.cvFilename === CV_FILES.software
          ? "software"
          : preview?.cvFilename === CV_FILES.education
            ? "education"
            : "")

      const recruiterName = preview?.recruiterName ?? result.extract.recruiterName
      const recruiterConfidence =
        recruiterName.trim() &&
        (result.extract.recruiterConfidence === "none" || !result.extract.recruiterConfidence)
          ? "medium"
          : result.extract.recruiterConfidence

      const res = await fetch("/api/apply/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extract: {
            ...result.extract,
            company: preview?.company ?? result.extract.company,
            position: preview?.position ?? result.extract.position,
            email: preview?.email || result.extract.email,
            recruiterName,
            recruiterConfidence,
            category,
          },
          categoryOverride: category || undefined,
          manualCv: cvKey || undefined,
          recruiterProfileText: recruiterProfileText.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setDraftError(data.error || "Error al generar el correo")
        return
      }

      const drafted = data as AnalyzeResult
      setResult({
        ...drafted,
        match: drafted.match ?? result.match,
      })
      hydratePreview(drafted.extract, drafted.draft, drafted.cvFilename)
    } catch {
      setDraftError("Error de red al generar el correo")
    } finally {
      setDrafting(false)
    }
  }, [result, categoryOverride, manualCv, preview, recruiterProfileText, hydratePreview])

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

  const canRegister = useMemo(() => {
    if (registering || registerSuccess) return false
    if (jobUrl.trim()) return true
    if (preview?.company.trim() && preview?.position.trim()) return true
    return false
  }, [jobUrl, preview, registering, registerSuccess])

  const checkHistory = useCallback(async () => {
    const company = preview?.company ?? ""
    const position = preview?.position ?? ""
    const email = preview?.email ?? ""
    if (!jobUrl.trim() && !company.trim() && !position.trim() && !email.trim()) {
      setHistory(null)
      return
    }

    setHistoryLoading(true)
    try {
      const res = await fetch("/api/apply/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          position,
          email: email || undefined,
          url: jobUrl.trim() || undefined,
        }),
      })
      const data = (await res.json()) as ApplyCheckResult
      setHistory({
        status: data.status ?? "unknown",
        match: data.match ?? null,
        record: data.record ?? null,
        softWarnings: data.softWarnings ?? [],
        identityWeak: Boolean(data.identityWeak),
        historyUnavailable: Boolean(data.historyUnavailable) || !res.ok,
      })
    } catch {
      setHistory({
        status: "unknown",
        match: null,
        record: null,
        softWarnings: [],
        identityWeak: true,
        historyUnavailable: true,
      })
    } finally {
      setHistoryLoading(false)
    }
  }, [jobUrl, preview?.company, preview?.email, preview?.position])

  useEffect(() => {
    if (!unlocked) return
    const handle = window.setTimeout(() => {
      void checkHistory()
    }, 400)
    return () => window.clearTimeout(handle)
  }, [unlocked, checkHistory])

  const confirmIfNeeded = useCallback(() => {
    if (history?.historyUnavailable) {
      return window.confirm("El historial no está disponible. ¿Quieres continuar de todos modos?")
    }
    if (history?.status === "applied" && history.record) {
      const when = history.record.appliedAt
      return window.confirm(
        `Ya hay un registro de esta vacante (${when}). ¿Continuar de todos modos?`,
      )
    }
    if (history?.status === "in_progress") {
      return window.confirm("Hay otro envío en curso. ¿Reintentar ahora?")
    }
    return true
  }, [history])

  const send = useCallback(async () => {
    if (!preview || !canSend) return
    if (sendingLock.current || sending) return
    if (!confirmIfNeeded()) return

    sendingLock.current = true
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
          url: jobUrl.trim() || undefined,
          confirmDuplicate: history?.status === "applied" || Boolean(history?.historyUnavailable),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSendError(data.error || "Error al enviar")
        if (data.record || data.code === "history_unavailable") {
          void checkHistory()
        }
        return
      }
      setSendSuccess(true)
      void checkHistory()
    } catch {
      setSendError("Error de red al enviar")
    } finally {
      sendingLock.current = false
      setSending(false)
    }
  }, [preview, canSend, sending, confirmIfNeeded, jobUrl, history, checkHistory])

  const register = useCallback(async () => {
    if (!canRegister || registering) return
    const ok = window.confirm(
      "¿Registrar esta vacante como ya aplicada, sin enviar correo? Úsalo si aplicaste en LinkedIn, Easy Apply u otro ATS.",
    )
    if (!ok) return
    if (!confirmIfNeeded()) return

    setRegistering(true)
    setRegisterError("")
    setRegisterSuccess(false)
    try {
      const res = await fetch("/api/apply/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: preview?.company ?? "",
          position: preview?.position ?? "",
          email: preview?.email || undefined,
          url: jobUrl.trim() || undefined,
          confirmDuplicate: history?.status === "applied",
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setRegisterError(data.error || "Error al registrar")
        return
      }
      setRegisterSuccess(true)
      void checkHistory()
    } catch {
      setRegisterError("Error de red al registrar")
    } finally {
      setRegistering(false)
    }
  }, [canRegister, registering, confirmIfNeeded, preview, jobUrl, history, checkHistory])

  const clear = useCallback(() => {
    const hasContent =
      Boolean(text.trim()) ||
      Boolean(recruiterProfileText.trim()) ||
      Boolean(imageFile) ||
      Boolean(jobUrl.trim()) ||
      Boolean(result) ||
      Boolean(preview) ||
      Boolean(sendSuccess) ||
      Boolean(registerSuccess)

    if (hasContent && typeof window !== "undefined") {
      const ok = window.confirm(
        "¿Limpiar esta postulación? Se borrarán la vacante, el análisis, el correo y los resultados.",
      )
      if (!ok) return
    }

    setMode("text")
    setText("")
    setRecruiterProfileText("")
    setImageFile(null)
    setJobUrl("")
    setHistory(null)
    setAnalyzing(false)
    setDrafting(false)
    setAnalyzeError("")
    setDraftError("")
    setResult(null)
    setCategoryOverride("")
    setManualCv("")
    setPreview(null)
    setSending(false)
    setSendError("")
    setSendSuccess(false)
    setRegistering(false)
    setRegisterError("")
    setRegisterSuccess(false)
  }, [text, recruiterProfileText, imageFile, jobUrl, result, preview, sendSuccess, registerSuccess])

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
    recruiterProfileText,
    setRecruiterProfileText,
    imageFile,
    setImageFile,
    jobUrl,
    setJobUrl,
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
    history,
    historyLoading,
    canSend,
    sending,
    sendError,
    sendSuccess,
    send,
    canRegister,
    registering,
    registerError,
    registerSuccess,
    register,
    clear,
  }
}
