/** Novacomp product screenshots under this prefix stay off the public gallery. */
const BLOCKED_NOVACOMP_WEB = /novacomp\/app_web_/i

/** Drops NDA / confidential product captures from experience galleries. */
export function publicExperienceImages(images: string[] | undefined): string[] {
  return (images ?? []).filter((src) => !BLOCKED_NOVACOMP_WEB.test(src))
}
