import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  getProjectImageAlt,
  getProjectImageFit,
  getProjectImagePosition,
  getProjectImageSizes,
  shouldEagerLoadProjectImage,
  visibleProjectTags,
} from "./project-media.ts"

describe("getProjectImageFit", () => {
  it("contains diagrams and CLI captures so they are not cropped", () => {
    assert.equal(
      getProjectImageFit(
        "/proyectos/meniuz/AWS-architecture-diagram-showing-the-final-cloud-image-1.png",
      ),
      "contain",
    )
    assert.equal(getProjectImageFit("/proyectos/expense-balancer-cli/result-cli.png"), "contain")
  })

  it("contains tall phone mockups instead of cropping the device", () => {
    assert.equal(getProjectImageFit("/proyectos/odoo-app/odoo-app.png"), "contain")
  })

  it("covers product screenshots from the top chrome", () => {
    assert.equal(getProjectImageFit("/proyectos/meniuz/landing.png"), "cover")
    assert.equal(getProjectImagePosition("/proyectos/meniuz/landing.png"), "top")
  })
})

describe("getProjectImageAlt", () => {
  it("describes diagrams instead of a generic image number", () => {
    assert.equal(
      getProjectImageAlt(
        "Meniuz",
        "/proyectos/meniuz/AWS-architecture-diagram-showing-the-final-cloud-image-1.png",
        1,
      ),
      "Meniuz: diagrama de arquitectura",
    )
  })

  it("uses the file name as a useful caption for product shots", () => {
    assert.equal(
      getProjectImageAlt("Tayos App", "/proyectos/odoo-app/odoo-app.png", 0),
      "Tayos App: odoo app",
    )
  })
})

describe("shouldEagerLoadProjectImage", () => {
  it("eager-loads only the first above-the-fold shot", () => {
    assert.equal(shouldEagerLoadProjectImage(0, 0), true)
    assert.equal(shouldEagerLoadProjectImage(0, 1), false)
    assert.equal(shouldEagerLoadProjectImage(1, 0), false)
  })
})

describe("visibleProjectTags", () => {
  it("caps chips and reports the overflow count", () => {
    const tags = ["A", "B", "C", "D", "E", "F", "G"]
    assert.deepEqual(visibleProjectTags(tags, 6), {
      shown: ["A", "B", "C", "D", "E", "F"],
      extra: 1,
    })
    assert.deepEqual(visibleProjectTags(["A", "B"], 6), { shown: ["A", "B"], extra: 0 })
  })
})

describe("getProjectImageSizes", () => {
  it("emits a two-column sizes hint for the projects grid", () => {
    assert.match(getProjectImageSizes(true), /50vw/)
  })
})
