export type SiteVerificationInput = {
  google?: string | undefined
  bing?: string | undefined
}

export type SiteVerificationMeta = {
  google?: string
  other?: { "msvalidate.01": string }
}

function cleanToken(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

/** Build Google/Bing verification meta only when real tokens are present. */
export function buildSiteVerification(
  input: SiteVerificationInput,
): SiteVerificationMeta | undefined {
  const google = cleanToken(input.google)
  const bing = cleanToken(input.bing)
  if (!google && !bing) return undefined

  return {
    ...(google ? { google } : {}),
    ...(bing ? { other: { "msvalidate.01": bing } } : {}),
  }
}

export function getSiteVerification(): SiteVerificationMeta | undefined {
  return buildSiteVerification({
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
  })
}
