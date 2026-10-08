"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { TrackedAnchor } from "@/components/tracked-link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useActiveSection } from "@/hooks/use-active-section"
import { UmamiEvents } from "@/lib/umami"
import { cn } from "@/lib/utils"
import {
  CONTACT_NAV_ITEM,
  HOME_SECTION_IDS,
  MAIN_CONTENT_ID,
  PRIMARY_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
  SECONDARY_NAV_LABEL,
  SKIP_TO_CONTENT_LABEL,
  getMobileMenuLabel,
  isNavItemActive,
  isSecondaryGroupActive,
  type NavItem,
} from "@/lib/nav"
const navLinkClass =
  "inline-flex min-h-11 items-center rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"

const navLinkActiveClass = "text-foreground shadow-[inset_0_-2px_0_0_var(--accent)]"

function NavLink({
  item,
  pathname,
  activeSectionId,
  onNavigate,
  className,
}: {
  item: NavItem
  pathname: string
  activeSectionId?: string | null
  onNavigate?: () => void
  className?: string
}) {
  const active = isNavItemActive(item, pathname, activeSectionId)

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(navLinkClass, active && navLinkActiveClass, className)}
    >
      {item.name}
    </Link>
  )
}

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const isHome = pathname === "/"
  const activeSectionId = useActiveSection(HOME_SECTION_IDS, isHome)
  const secondaryActive = isSecondaryGroupActive(pathname, activeSectionId)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        {SKIP_TO_CONTENT_LABEL}
      </a>
      <nav
        aria-label="Principal"
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex min-h-11 min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <img
            src="/1764558900283.png"
            alt="Andres Coello"
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full object-cover object-center"
          />
          <span className="truncate text-base font-bold text-foreground sm:text-lg">
            Andres Coello
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              activeSectionId={activeSectionId}
            />
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(navLinkClass, "gap-1", secondaryActive && navLinkActiveClass)}
              aria-haspopup="menu"
            >
              {SECONDARY_NAV_LABEL}
              <ChevronDown className="size-4" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              {SECONDARY_NAV_ITEMS.map((item) => {
                const active = isNavItemActive(item, pathname, activeSectionId)
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "min-h-11 cursor-pointer",
                        active && "bg-accent/10 text-foreground",
                      )}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <TrackedAnchor
            href={CONTACT_NAV_ITEM.href}
            event={UmamiEvents.contactNav}
            eventData={{ source: "header-desktop" }}
            className="btn-primary ml-2"
          >
            {CONTACT_NAV_ITEM.name}
          </TrackedAnchor>
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
                aria-expanded={isOpen}
                aria-controls="mobile-nav"
                aria-label={getMobileMenuLabel(isOpen)}
              >
                {isOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              id="mobile-nav"
              className="z-[60] w-[min(100%,20rem)] gap-0 p-0 [&>button.absolute]:hidden"
            >
              <SheetHeader className="border-b border-border px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <SheetTitle className="text-base">Menú</SheetTitle>
                  <SheetClose
                    className="inline-flex size-11 items-center justify-center rounded-lg text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Cerrar menú"
                  >
                    <X size={22} aria-hidden />
                  </SheetClose>
                </div>
                <SheetDescription className="sr-only">
                  Navegación principal del sitio. Escape cierra el menú.
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6">
                <div className="flex flex-col gap-1">
                  {PRIMARY_NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      pathname={pathname}
                      activeSectionId={activeSectionId}
                      onNavigate={() => setIsOpen(false)}
                      className="w-full justify-start px-3"
                    />
                  ))}
                </div>

                <div>
                  <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {SECONDARY_NAV_LABEL}
                  </p>
                  <div className="mt-2 flex flex-col gap-1">
                    {SECONDARY_NAV_ITEMS.map((item) => (
                      <NavLink
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        activeSectionId={activeSectionId}
                        onNavigate={() => setIsOpen(false)}
                        className="w-full justify-start px-3"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-4">
                <TrackedAnchor
                  href={CONTACT_NAV_ITEM.href}
                  event={UmamiEvents.contactNav}
                  eventData={{ source: "header-mobile" }}
                  className="btn-primary block text-center"
                  onClick={() => setIsOpen(false)}
                >
                  {CONTACT_NAV_ITEM.name}
                </TrackedAnchor>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
