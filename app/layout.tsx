import type React from "react"
import type { Metadata, Viewport } from "next"
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { UmamiAnalytics } from "@/components/umami-analytics"
import {
  PERSON_NAME,
  SITE_DESCRIPTION,
  SITE_TITLE_DEFAULT,
  SITE_TITLE_TEMPLATE,
} from "@/lib/identity"
import { getPersonJsonLd } from "@/lib/json-ld"
import { getSiteUrl, getSiteUrlObject } from "@/lib/site"
import { getSiteVerification } from "@/lib/site-verification"
import "./globals.css"

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
})

const siteUrl = getSiteUrl()
const siteVerification = getSiteVerification()

export const viewport: Viewport = {
  themeColor: "#0d1d40",
  colorScheme: "dark light",
}

export const metadata: Metadata = {
  metadataBase: getSiteUrlObject(),
  title: {
    default: SITE_TITLE_DEFAULT,
    template: SITE_TITLE_TEMPLATE,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "backend engineer",
    "Node.js",
    "TypeScript",
    "NestJS",
    "PostgreSQL",
    "AWS",
    "LLM",
    "RAG",
  ],
  applicationName: `${PERSON_NAME} Portfolio`,
  category: "technology",
  creator: PERSON_NAME,
  authors: [{ name: PERSON_NAME, url: siteUrl }],
  publisher: PERSON_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: siteUrl,
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    siteName: PERSON_NAME,
    images: [
      {
        url: "/1764558900283.png",
        width: 1200,
        height: 1200,
        type: "image/png",
        alt: SITE_TITLE_DEFAULT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
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
  ...(siteVerification ? { verification: siteVerification } : {}),
  referrer: "strict-origin-when-cross-origin",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const personJsonLd = getPersonJsonLd()

  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd),
          }}
        />
      </head>
      <body className={`${plexSans.variable} ${plexMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="andres-coello-theme"
          disableTransitionOnChange
        >
          {children}
          <UmamiAnalytics />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
