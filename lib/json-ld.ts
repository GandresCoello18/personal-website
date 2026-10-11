import { getSiteUrl } from "@/lib/site"

export function getPersonJsonLd() {
  const siteUrl = getSiteUrl()

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Andrés Coello",
    jobTitle: "Backend Engineer",
    url: siteUrl,
    image: `${siteUrl}/1764558900283.png`,
    sameAs: [
      "https://www.linkedin.com/in/andrescoellogoyes/",
      "https://github.com/GandresCoello18",
      "https://www.youtube.com/@andrescoellogoyes",
    ],
    description:
      "Backend Engineer. APIs y plataformas SaaS en Node.js, TypeScript, NestJS, PostgreSQL, AWS y LLM/RAG.",
    knowsAbout: [
      "Node.js",
      "TypeScript",
      "NestJS",
      "PostgreSQL",
      "AWS",
      "LLM",
      "RAG",
      "Express",
      "Fastify",
      "Prisma",
    ],
    areaServed: "Global",
    offers: [
      {
        "@type": "Offer",
        name: "Desarrollo backend y arquitectura",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/#contact`,
      },
    ],
  }
}

export function getWebSiteJsonLd() {
  const siteUrl = getSiteUrl()

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Andrés Coello",
    inLanguage: "es",
    publisher: { "@id": `${siteUrl}/#person` },
  }
}

export function getBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  const siteUrl = getSiteUrl()

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  }
}
