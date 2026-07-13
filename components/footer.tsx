"use client"

import { Github, Linkedin, Youtube, Mail, ExternalLink } from "lucide-react"
import Link from "next/link"
import { TrackedAnchor, TrackedLink } from "@/components/tracked-link"
import { UmamiEvents } from "@/lib/umami"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    producto: [
      { label: "Sobre Meniuz", href: "https://meniuz.com/about/" },
      { label: "Sobre Classgap", href: "https://classgap.com/about/" },
    ],
    recursos: [
      { label: "Blog", href: "/blog" },
      { label: "Videos", href: "/videos" },
      { label: "Servicios", href: "/#services" },
    ],
  }

  const social = [
    { icon: Github, href: "https://github.com/GandresCoello18", label: "GitHub", network: "github" },
    { icon: Linkedin, href: "https://linkedin.com/in/andrescoellogoyes/", label: "LinkedIn", network: "linkedin" },
    { icon: Mail, href: "mailto:goyeselcoca@gmail.com", label: "Email", network: "email" },
    { icon: Youtube, href: "https://www.youtube.com/@andrescoellogoyes", label: "Youtube", network: "youtube" },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                <img src="/1764558900283.png" alt="Andres Coello" className="w-full h-full rounded-full object-cover" />
              </div>
              <span className="font-bold text-foreground">Andres Coello</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Developer, Mentor y Creador. Ayudando a desarrolladores a crecer profesionalmente.
            </p>
            <div className="flex gap-3">
              {social.map((item) => {
                const Icon = item.icon
                const event =
                  item.network === "email" ? UmamiEvents.contactEmail : UmamiEvents.socialClick
                return (
                  <TrackedAnchor
                    key={item.label}
                    href={item.href}
                    event={event}
                    eventData={{ network: item.network, source: "footer" }}
                    className="w-10 h-10 rounded-lg border border-border hover:border-accent hover:bg-accent/10 flex items-center justify-center text-muted-foreground hover:text-accent transition-colors"
                    title={item.label}
                  >
                    <Icon size={18} />
                  </TrackedAnchor>
                )
              })}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Producto</h4>
            <ul className="space-y-3">
              {links.producto.map((link) => (
                <li key={link.label}>
                  <TrackedLink
                    href={link.href}
                    event={UmamiEvents.socialClick}
                    eventData={{ network: link.label, source: "footer" }}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 group"
                  >
                    {link.label}
                    {link.href.startsWith("http") && (
                      <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-foreground mb-4">Recursos</h4>
            <ul className="space-y-3">
              {links.recursos.map((link) => (
                <li key={link.label}>
                  <TrackedLink
                    href={link.href}
                    event={
                      link.href.includes("blog")
                        ? UmamiEvents.blogCta
                        : link.href.includes("videos")
                          ? UmamiEvents.videosCta
                          : UmamiEvents.navServices
                    }
                    eventData={{ source: "footer" }}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </TrackedLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Andres Coello.
            </p>
            <p className="text-sm text-muted-foreground">
              Diseñado y desarrollado con
              <span className="text-accent mx-1">❤️</span>
              por Andres Coello
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
