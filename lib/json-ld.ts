import { getSiteUrl } from "@/lib/site"

export function getPersonJsonLd() {
  const siteUrl = getSiteUrl()

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Andres Coello",
    jobTitle: "Software Engineer, CTO, SRE y Mentor",
    url: siteUrl,
    image: `${siteUrl}/1764558900283.png`,
    sameAs: [
      "https://www.linkedin.com/in/andrescoellogoyes/",
      "https://github.com/GandresCoello18",
      "https://www.youtube.com/@andrescoellogoyes",
    ],
    description:
      "Mentorías y tutorías personalizadas en desarrollo web, programación moderna y buenas prácticas de software.",
    knowsAbout: [
      "Desarrollo Full Stack",
      "Next.js",
      "React",
      "Node.js",
      "Python",
      "Docker",
      "Git",
      "GraphQL",
      "Mentoría tecnológica",
      "Tutorías personalizadas",
    ],
    areaServed: "Global",
    offers: [
      {
        "@type": "Offer",
        name: "Mentoría personalizada en desarrollo web",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/#services`,
      },
      {
        "@type": "Offer",
        name: "Tutorías 1:1 para desarrolladores",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/#services`,
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
    name: "Andres Coello",
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
