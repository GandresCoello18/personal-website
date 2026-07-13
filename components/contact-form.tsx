"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send, Loader } from "lucide-react"
import { trackEvent, UmamiEvents } from "@/lib/umami"

export function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  // Función para aplicar los datos del servicio al formulario
  const applyServiceData = (service: string, description: string) => {
    setFormData((prev) => ({
      ...prev,
      asunto: service ? `Información sobre: ${service}` : prev.asunto,
      mensaje: description
        ? `Estoy interesado en ${service || "este servicio"}. ${description}\n\nMe gustaría más información sobre los detalles, precios y próximos pasos.`
        : prev.mensaje,
    }))
  }

  // Función para leer y aplicar los parámetros de la URL
  const readUrlParams = () => {
    const params = new URLSearchParams(window.location.search)
    const service = params.get("service")
    const description = params.get("description")

    if (service || description) {
      applyServiceData(service || "", description || "")
      // Limpiar los query params de la URL pero mantener el hash
      const cleanUrl = `${window.location.pathname}#contact`
      window.history.replaceState({}, "", cleanUrl)
      return true
    }
    return false
  }

  useEffect(() => {
    // Leer parámetros al montar el componente
    readUrlParams()

    // Escuchar evento personalizado cuando se cambia la URL desde Services
    const handleUrlChanged = (event: Event) => {
      const customEvent = event as CustomEvent<{ service: string; description: string }>
      if (customEvent.detail) {
        applyServiceData(customEvent.detail.service, customEvent.detail.description)
        // Limpiar los query params de la URL pero mantener el hash
        const cleanUrl = `${window.location.pathname}#contact`
        window.history.replaceState({}, "", cleanUrl)
      }
    }

    // Escuchar cambios en la URL (popstate para navegación del navegador)
    const handlePopState = () => {
      readUrlParams()
    }

    window.addEventListener("urlChanged", handleUrlChanged as EventListener)
    window.addEventListener("popstate", handlePopState)

    // También verificar periódicamente si hay parámetros nuevos (fallback)
    const interval = setInterval(() => {
      if (window.location.search.includes("service=") || window.location.search.includes("description=")) {
        readUrlParams()
      }
    }, 300)

    return () => {
      window.removeEventListener("urlChanged", handleUrlChanged as EventListener)
      window.removeEventListener("popstate", handlePopState)
      clearInterval(interval)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.nombre.trim() || !formData.email.trim() || !formData.asunto.trim() || !formData.mensaje.trim()) {
      setError("Por favor completa todos los campos")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingresa un email válido")
      return
    }

    setLoading(true)
    trackEvent(UmamiEvents.contactFormSubmit, { subject: formData.asunto.slice(0, 80) })

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar el email")
      }

      trackEvent(UmamiEvents.contactFormSuccess)
      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" })
      setSubmitted(true)

      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      trackEvent(UmamiEvents.contactFormError)
      setError(err instanceof Error ? err.message : "Ocurrió un error al enviar el mensaje. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-elevated p-8 md:p-12 border-2 border-accent/20">
      <h3 className="text-2xl font-bold mb-6 text-foreground">Déjame un Mensaje</h3>

      {submitted && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-300 text-sm font-medium">
            ¡Mensaje enviado exitosamente! Te responderé pronto.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all disabled:opacity-50"
            disabled={loading}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Tu email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all disabled:opacity-50"
            disabled={loading}
            required
          />
        </div>
        <input
          type="text"
          name="asunto"
          placeholder="Asunto"
          value={formData.asunto}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all disabled:opacity-50"
          disabled={loading}
          required
        />
        <textarea
          name="mensaje"
          placeholder="Tu mensaje..."
          rows={5}
          value={formData.mensaje}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none disabled:opacity-50"
          disabled={loading}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              Enviar Mensaje
              <Send size={20} />
            </>
          )}
        </button>
        <p className="text-xs text-muted-foreground text-center">
          Respondo en máximo 24 horas. Sin spam, solo conversación profesional.
        </p>
      </form>
    </div>
  )
}
