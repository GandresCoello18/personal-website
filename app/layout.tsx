import type React from "react"
import type { Metadata, Viewport } from "next"
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { UmamiAnalytics } from "@/components/umami-analytics"
import { getPersonJsonLd } from "@/lib/json-ld"
import { getSiteUrl, getSiteUrlObject } from "@/lib/site"
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
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const viewport: Viewport = {
  themeColor: "#0d1d40",
  colorScheme: "dark light",
}

export const metadata: Metadata = {
  metadataBase: getSiteUrlObject(),
  title: {
    default: "Andrés Coello — Backend Engineer",
    template: "%s | Andrés Coello",
  },
  description:
    "Andrés Coello, Backend Engineer. APIs y plataformas SaaS en Node.js, TypeScript, NestJS, PostgreSQL, AWS y LLM/RAG.",
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
  applicationName: "Andrés Coello Portfolio",
  category: "technology",
  creator: "Andrés Coello",
  authors: [{ name: "Andrés Coello", url: siteUrl }],
  publisher: "Andrés Coello",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    title: "Andrés Coello — Backend Engineer",
    description:
      "Backend Engineer. APIs y plataformas SaaS en Node.js, TypeScript, NestJS, PostgreSQL, AWS y LLM/RAG.",
    siteName: "Andrés Coello",
    images: [
      {
        url: "/1764558900283.png",
        width: 1200,
        height: 1200,
        type: "image/png",
        alt: "Andrés Coello — Backend Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrés Coello — Backend Engineer",
    description: "Backend Engineer. Node.js, TypeScript, NestJS, PostgreSQL, AWS y LLM/RAG.",
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
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
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
