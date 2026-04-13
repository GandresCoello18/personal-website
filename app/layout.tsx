import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://andres-coello-goyes.vercel.app"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Andres Coello",
  jobTitle: "Software Developer, Mentor y Tutor",
  url: siteUrl,
  image: `${siteUrl}/1764558900283.png`,
  sameAs: [
    "https://www.linkedin.com/in/andrescoellogoyes/",
    "https://github.com/GandresCoello18",
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
    "GitLab CI/CD",
    "GitLab CI/CD",
    "Mentoría tecnológica",
    "Tutorías personalizadas",
  ],
  areaServed: "Global",
  offers: [
    {
      "@type": "Offer",
      name: "Mentoría personalizada en desarrollo web",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}#services`,
    },
    {
      "@type": "Offer",
      name: "Tutorías 1:1 para desarrolladores",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}#services`,
    },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Andres Coello - Software Developer, Mentor & Tutor",
    template: "%s | Andres Coello",
  },
  description:
    "Andres Coello es Software Developer, Mentor y Tutor especializado en crear experiencias digitales y acompañar a desarrolladores a nivel profesional.",
  keywords: [
    "software developer",
    "full stack developer",
    "mentor tecnológico",
    "tutorías de programación",
    "consultoría tecnológica",
    "desarrollo web",
  ],
  generator: "v0.app",
  applicationName: "Andres Coello Portfolio",
  category: "technology",
  creator: "Andres Coello",
  authors: [{ name: "Andres Coello", url: siteUrl }],
  publisher: "Andres Coello",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    title: "Andres Coello - Software Developer, Mentor & Tutor",
    description:
      "Servicios profesionales de desarrollo de software, mentorías y tutorías para impulsar tu carrera tecnológica.",
    siteName: "Andres Coello",
    images: [
      {
        url: "/1764558900283.png",
        width: 1200,
        height: 1200,
        type: "image/png",
        alt: "Andres Coello en DevFest — Software Developer, mentor y tutor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andres Coello - Software Developer, Mentor & Tutor",
    description:
      "Mentorías, tutorías y desarrollo de software a medida con Andres Coello.",
    creator: "@acoellogoyes",
    images: ["/1764558900283.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: "index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large",
  },
  icons: {
    icon: [{ url: "/1764558900283.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/1764558900283.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/1764558900283.png",
  },
  manifest: "/site.webmanifest",
  themeColor: "#1c4e5a",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  },
  referrer: "strict-origin-when-cross-origin",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
