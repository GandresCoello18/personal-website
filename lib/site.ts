/** Canonical site URL for metadata and JSON-LD (matches `app/layout.tsx`). */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://andres-coello-goyes.vercel.app"
}
