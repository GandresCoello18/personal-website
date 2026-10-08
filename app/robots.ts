import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/apply",
        "/api/apply",
        "/interview",
        "/api/interview",
        "/api/telegram",
        "/radar",
        "/api/radar",
        "/api/cron",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
