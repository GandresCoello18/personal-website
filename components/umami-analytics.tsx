import Script from "next/script"

const UMAMI_WEBSITE_ID = "42ed3351-4781-49f7-949f-c7898dd667ad"

export function UmamiAnalytics() {
  return (
    <Script
      defer
      src="https://cloud.umami.is/script.js"
      data-website-id={UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
    />
  )
}
