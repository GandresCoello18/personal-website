import type { Metadata } from "next"
import Link from "next/link"
import { getAllCases } from "@/lib/cases"
import { getSiteUrl } from "@/lib/site"

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Casos de estudio: Tayos, Meniuz y Order Lifecycle.",
  alternates: { canonical: "/proyectos" },
  openGraph: {
    title: "Proyectos | Andrés Coello",
    description: "Casos de estudio: Tayos, Meniuz y Order Lifecycle.",
    url: `${siteUrl}/proyectos`,
    type: "website",
  },
}

export default function ProyectosIndexPage() {
  const cases = getAllCases()

  return (
    <main
      id="contenido-principal"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <header className="mb-12 max-w-2xl">
        <h1 className="section-title">Proyectos</h1>
        <p className="section-subtitle mt-4">Tayos, Meniuz y el ciclo de una orden.</p>
      </header>
      <ul className="divide-y divide-border border-y border-border">
        {cases.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/proyectos/${item.slug}`}
              className="flex min-h-11 flex-col gap-1 py-5 hover:text-foreground"
            >
              <span className="font-medium text-foreground">{item.title}</span>
              <span className="text-sm text-muted-foreground">{item.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
