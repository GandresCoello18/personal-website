import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  CONTACT_NAV_ITEM,
  PRIMARY_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
  getMobileMenuLabel,
  isNavItemActive,
  isSecondaryGroupActive,
  pathnameMatchesNavHref,
  resolveHomeSectionId,
} from "./nav.ts"

describe("nav information architecture", () => {
  it("keeps the primary menu to three destinations", () => {
    assert.equal(PRIMARY_NAV_ITEMS.length, 3)
    assert.deepEqual(
      PRIMARY_NAV_ITEMS.map((item) => item.name),
      ["Experiencia", "Proyectos", "Servicios"],
    )
  })

  it("moves talks, blog and videos behind the secondary group", () => {
    assert.deepEqual(
      SECONDARY_NAV_ITEMS.map((item) => item.name),
      ["Charlas", "Blog", "Videos"],
    )
  })
})

describe("pathnameMatchesNavHref", () => {
  it("matches nested blog and video routes", () => {
    assert.equal(pathnameMatchesNavHref("/blog/foo", "/blog"), true)
    assert.equal(pathnameMatchesNavHref("/videos/bar", "/videos"), true)
  })

  it("does not treat the home path as an always-active match", () => {
    assert.equal(pathnameMatchesNavHref("/", "/#experience"), false)
    assert.equal(pathnameMatchesNavHref("/blog", "/"), false)
  })
})

describe("isNavItemActive", () => {
  it("activates blog on article routes", () => {
    const blog = SECONDARY_NAV_ITEMS.find((item) => item.name === "Blog")
    assert.ok(blog)
    assert.equal(isNavItemActive(blog, "/blog/mi-post"), true)
    assert.equal(isNavItemActive(blog, "/videos"), false)
  })

  it("activates home sections from the observed section id", () => {
    const projects = PRIMARY_NAV_ITEMS.find((item) => item.sectionId === "projects")
    assert.ok(projects)
    assert.equal(isNavItemActive(projects, "/", "projects"), true)
    assert.equal(isNavItemActive(projects, "/", "experience"), false)
    assert.equal(isNavItemActive(projects, "/blog", "projects"), false)
  })

  it("does not mark Contactar as a primary/secondary active sibling", () => {
    assert.equal(isNavItemActive(CONTACT_NAV_ITEM, "/", "contact"), true)
    assert.equal(isSecondaryGroupActive("/", "contact"), false)
  })
})

describe("isSecondaryGroupActive", () => {
  it("lights the overflow trigger on blog or talks", () => {
    assert.equal(isSecondaryGroupActive("/blog"), true)
    assert.equal(isSecondaryGroupActive("/", "talks"), true)
    assert.equal(isSecondaryGroupActive("/", "projects"), false)
  })
})

describe("getMobileMenuLabel", () => {
  it("exposes a distinct open and close name for the toggle", () => {
    assert.equal(getMobileMenuLabel(false), "Abrir menú")
    assert.equal(getMobileMenuLabel(true), "Cerrar menú")
  })
})

describe("resolveHomeSectionId", () => {
  it("picks the most visible section near the top of the viewport", () => {
    const id = resolveHomeSectionId(
      ["experience", "projects", "services"],
      [
        { id: "experience", ratio: 0.2, top: -40 },
        { id: "projects", ratio: 0.55, top: 80 },
        { id: "services", ratio: 0.1, top: 640 },
      ],
    )
    assert.equal(id, "projects")
  })

  it("returns null when nothing is intersecting", () => {
    assert.equal(resolveHomeSectionId(["experience"], [{ id: "footer", ratio: 1, top: 0 }]), null)
  })
})
