import {
  PERSON_ALTERNATE_NAMES,
  PERSON_ALUMNI_OF,
  PERSON_COUNTRY_CODE,
  PERSON_FAMILY_NAME,
  PERSON_GIVEN_NAME,
  PERSON_JOB_TITLE,
  PERSON_KNOWS_ABOUT,
  PERSON_KNOWS_LANGUAGE,
  PERSON_LOCALITY,
  PERSON_NAME,
  PERSON_SAME_AS,
  PERSON_SCHEMA_DESCRIPTION,
  PERSON_WORKS_FOR,
} from "./identity.ts"
import { getSiteUrl } from "./site.ts"

export function getPersonId(): string {
  return `${getSiteUrl()}/#person`
}

export function getPersonJsonLd() {
  const siteUrl = getSiteUrl()

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": getPersonId(),
    name: PERSON_NAME,
    alternateName: [...PERSON_ALTERNATE_NAMES],
    givenName: PERSON_GIVEN_NAME,
    familyName: PERSON_FAMILY_NAME,
    jobTitle: PERSON_JOB_TITLE,
    worksFor: {
      "@type": "Organization",
      name: PERSON_WORKS_FOR,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: PERSON_LOCALITY,
      addressCountry: PERSON_COUNTRY_CODE,
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: PERSON_ALUMNI_OF,
    },
    knowsLanguage: PERSON_KNOWS_LANGUAGE,
    url: siteUrl,
    image: `${siteUrl}/1764558900283.png`,
    sameAs: PERSON_SAME_AS.map((profile) => profile.href),
    description: PERSON_SCHEMA_DESCRIPTION,
    knowsAbout: [...PERSON_KNOWS_ABOUT],
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

export function getPersonAuthorJsonLd() {
  return {
    "@type": "Person",
    "@id": getPersonId(),
    name: PERSON_NAME,
    url: getSiteUrl(),
  }
}

export function getWebSiteJsonLd() {
  const siteUrl = getSiteUrl()

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: PERSON_NAME,
    inLanguage: "es",
    publisher: { "@id": getPersonId() },
  }
}

export function getProfilePageJsonLd() {
  const siteUrl = getSiteUrl()
  const person = getPersonJsonLd()
  const personNode = Object.fromEntries(
    Object.entries(person).filter(([key]) => key !== "@context"),
  )

  return {
    "@context": "https://schema.org",
    "@graph": [
      personNode,
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/sobre-mi#profilepage`,
        url: `${siteUrl}/sobre-mi`,
        name: `Sobre ${PERSON_NAME}`,
        inLanguage: "es",
        mainEntity: { "@id": getPersonId() },
      },
    ],
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
