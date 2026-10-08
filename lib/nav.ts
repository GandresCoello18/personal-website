export type NavHref = `/${string}` | `/#${string}` | `https://${string}`

export type NavItem = {
  name: string
  href: string
  /** Hash target on the home page, without `#`. */
  sectionId?: string
}

export const PRIMARY_NAV_ITEMS: readonly NavItem[] = [
  { name: "Experiencia", href: "/#experience", sectionId: "experience" },
  { name: "Proyectos", href: "/#projects", sectionId: "projects" },
  { name: "Servicios", href: "/#services", sectionId: "services" },
] as const

export const SECONDARY_NAV_ITEMS: readonly NavItem[] = [
  { name: "Charlas", href: "/#talks", sectionId: "talks" },
  { name: "Blog", href: "/blog" },
  { name: "Videos", href: "/videos" },
] as const

export const CONTACT_NAV_ITEM: NavItem = {
  name: "Contactar",
  href: "/#contact",
  sectionId: "contact",
}

export const SECONDARY_NAV_LABEL = "Más"
export const SKIP_TO_CONTENT_LABEL = "Saltar al contenido"
export const MAIN_CONTENT_ID = "contenido-principal"

export function getMobileMenuLabel(isOpen: boolean): string {
  return isOpen ? "Cerrar menú" : "Abrir menú"
}

export const ALL_NAV_ITEMS: readonly NavItem[] = [
  ...PRIMARY_NAV_ITEMS,
  ...SECONDARY_NAV_ITEMS,
  CONTACT_NAV_ITEM,
]

export const HOME_SECTION_IDS = ALL_NAV_ITEMS.map((item) => item.sectionId).filter(
  (id): id is string => Boolean(id),
)

export function pathnameMatchesNavHref(pathname: string, href: string): boolean {
  const path = href.split("#")[0] || "/"
  if (path === "/" || path === "") return false
  return pathname === path || pathname.startsWith(`${path}/`)
}

export function isNavItemActive(
  item: NavItem,
  pathname: string,
  activeSectionId?: string | null,
): boolean {
  if (pathnameMatchesNavHref(pathname, item.href)) {
    return true
  }

  const isHome = pathname === "/" || pathname === ""
  if (!isHome || !item.sectionId) {
    return false
  }

  return activeSectionId === item.sectionId
}

export function isSecondaryGroupActive(pathname: string, activeSectionId?: string | null): boolean {
  return SECONDARY_NAV_ITEMS.some((item) => isNavItemActive(item, pathname, activeSectionId))
}

export function resolveHomeSectionId(
  sectionIds: readonly string[],
  entries: Array<{ id: string; ratio: number; top: number }>,
): string | null {
  const visible = entries.filter((entry) => sectionIds.includes(entry.id) && entry.ratio > 0)
  if (visible.length === 0) return null

  const aboveFold = visible.filter((entry) => entry.top <= 120)
  const pool = aboveFold.length > 0 ? aboveFold : visible
  return pool.reduce((best, entry) => (entry.ratio > best.ratio ? entry : best)).id
}
