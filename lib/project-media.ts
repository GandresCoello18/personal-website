const DIAGRAM_HINT = /diagram|fluj|architecture|aws/i
const CLI_HINT = /cli|result-cli|test-cli/i
const CONTAIN_HINT = /odoo-app|unnamed/i

export type ProjectImageFit = "cover" | "contain"
export type ProjectImagePosition = "top" | "center"

export function getProjectImageFit(src: string): ProjectImageFit {
  if (DIAGRAM_HINT.test(src) || CLI_HINT.test(src) || CONTAIN_HINT.test(src)) return "contain"
  return "cover"
}

export function getProjectImagePosition(src: string): ProjectImagePosition {
  if (getProjectImageFit(src) === "contain") return "center"
  return "top"
}

export function getProjectImageAlt(title: string, src: string, index: number): string {
  const file =
    src
      .split("/")
      .pop()
      ?.replace(/\.[^.]+$/, "") ?? ""
  const readable = file
    .replace(/[-_]+/g, " ")
    .replace(/\(\d+\)/g, "")
    .replace(/\d{10,}/g, "")
    .replace(/\s+/g, " ")
    .trim()

  if (DIAGRAM_HINT.test(src)) {
    return `${title}: diagrama de arquitectura`
  }
  if (CLI_HINT.test(src)) {
    return `${title}: captura de la interfaz de línea de comandos`
  }
  if (readable && readable.toLowerCase() !== title.toLowerCase()) {
    return `${title}: ${readable}`
  }
  return index === 0 ? `Captura de ${title}` : `Captura ${index + 1} de ${title}`
}

export function shouldEagerLoadProjectImage(projectIndex: number, imageIndex: number): boolean {
  return projectIndex === 0 && imageIndex === 0
}

export function getProjectImageSizes(featured: boolean): string {
  return featured
    ? "(max-width: 768px) 100vw, (max-width: 1152px) 50vw, 560px"
    : "(max-width: 768px) 100vw, (max-width: 1152px) 50vw, 480px"
}

export function visibleProjectTags(
  tags: readonly string[],
  limit = 6,
): {
  shown: string[]
  extra: number
} {
  if (tags.length <= limit) {
    return { shown: [...tags], extra: 0 }
  }
  return { shown: tags.slice(0, limit), extra: tags.length - limit }
}
