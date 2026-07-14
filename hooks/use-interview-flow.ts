"use client"

import { useCallback, useEffect, useState } from "react"
import type { InterviewAnswerItem } from "@/lib/interview/types"

export function useInterviewFlow() {
  const [unlocked, setUnlocked] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [secret, setSecret] = useState("")
  const [unlockError, setUnlockError] = useState("")
  const [unlocking, setUnlocking] = useState(false)

  const [questions, setQuestions] = useState("")
  const [answers, setAnswers] = useState<InterviewAnswerItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copyStatus, setCopyStatus] = useState("")

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

  const submit = useCallback(async () => {
    setLoading(true)
    setError("")
    setCopyStatus("")
    try {
      const res = await fetch("/api/interview/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Error al responder")
        return
      }
      setAnswers(Array.isArray(data.answers) ? data.answers : [])
    } catch {
      setError("Error de red al responder")
    } finally {
      setLoading(false)
    }
  }, [questions])

  const updateAnswer = useCallback((index: number, answer: string) => {
    setAnswers((prev) => prev.map((item, i) => (i === index ? { ...item, answer } : item)))
  }, [])

  const copyAll = useCallback(async () => {
    if (!answers.length) return
    const text = answers
      .map((a, i) => `${i + 1}. ${a.question}\n${a.answer}`)
      .join("\n\n")
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus("Copiado al portapapeles")
      setTimeout(() => setCopyStatus(""), 2500)
    } catch {
      setCopyStatus("No se pudo copiar")
    }
  }, [answers])

  const copyOne = useCallback(async (answer: string) => {
    try {
      await navigator.clipboard.writeText(answer)
      setCopyStatus("Respuesta copiada")
      setTimeout(() => setCopyStatus(""), 2000)
    } catch {
      setCopyStatus("No se pudo copiar")
    }
  }, [])

  return {
    unlocked,
    checkingSession,
    secret,
    setSecret,
    unlockError,
    unlocking,
    unlock,
    questions,
    setQuestions,
    answers,
    loading,
    error,
    submit,
    updateAnswer,
    copyAll,
    copyOne,
    copyStatus,
  }
}
