import type { MetadataRoute } from "next"

import { getSiteUrl } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/apply", "/api/apply", "/interview", "/api/interview"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
