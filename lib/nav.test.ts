import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  CONTACT_NAV_ITEM,
  PRIMARY_NAV_ITEMS,
  getMobileMenuLabel,
  isNavItemActive,
  pathnameMatchesNavHref,
  resolveHomeSectionId,
  resolveLegacyHash,
} from "./nav.ts"

describe("nav information architecture", () => {
  it("keeps Sobre mí in the primary menu with the existing destinations", () => {
    assert.equal(PRIMARY_NAV_ITEMS.length, 5)
    assert.deepEqual(
      PRIMARY_NAV_ITEMS.map((item) => item.name),
      ["Sobre mí", "Experiencia", "Proyectos", "Escritos", "Contacto"],
    )
  })

  it("does not put mentoría in the primary menu", () => {
    assert.equal(
      PRIMARY_NAV_ITEMS.some((item) => /mentor|servicio/i.test(item.name + item.href)),
      false,
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
  it("activates escritos on article routes", () => {
    const escritos = PRIMARY_NAV_ITEMS.find((item) => item.name === "Escritos")
    assert.ok(escritos)
    assert.equal(isNavItemActive(escritos, "/blog/mi-post"), true)
    assert.equal(isNavItemActive(escritos, "/videos"), false)
  })

  it("activates home sections from the observed section id", () => {
    const projects = PRIMARY_NAV_ITEMS.find((item) => item.sectionId === "projects")
    assert.ok(projects)
    assert.equal(isNavItemActive(projects, "/", "projects"), true)
    assert.equal(isNavItemActive(projects, "/", "experience"), false)
    assert.equal(isNavItemActive(projects, "/blog", "projects"), false)
    assert.equal(isNavItemActive(projects, "/proyectos/meniuz"), true)
  })

  it("activates Contacto on the home contact section", () => {
    assert.equal(isNavItemActive(CONTACT_NAV_ITEM, "/", "contact"), true)
    assert.equal(isNavItemActive(CONTACT_NAV_ITEM, "/", "projects"), false)
  })

  it("activates Sobre mí on its own route", () => {
    const about = PRIMARY_NAV_ITEMS.find((item) => item.href === "/sobre-mi")
    assert.ok(about)
    assert.equal(isNavItemActive(about, "/sobre-mi"), true)
    assert.equal(isNavItemActive(about, "/"), false)
  })
})

describe("resolveLegacyHash", () => {
  it("sends old service and classgap hashes to /mentoria", () => {
    assert.equal(resolveLegacyHash("#services"), "/mentoria")
    assert.equal(resolveLegacyHash("classgap"), "/mentoria#classgap")
    assert.equal(resolveLegacyHash("#experience"), null)
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
      ["experience", "projects", "escritos"],
      [
        { id: "experience", ratio: 0.2, top: -40 },
        { id: "projects", ratio: 0.55, top: 80 },
        { id: "escritos", ratio: 0.1, top: 640 },
      ],
    )
    assert.equal(id, "projects")
  })

  it("returns null when nothing is intersecting", () => {
    assert.equal(resolveHomeSectionId(["experience"], [{ id: "footer", ratio: 1, top: 0 }]), null)
  })
})
