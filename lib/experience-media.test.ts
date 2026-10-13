import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { publicExperienceImages } from "./experience-media.ts"

describe("publicExperienceImages", () => {
  it("keeps the previously published experience shots", () => {
    assert.deepEqual(
      publicExperienceImages([
        "/experiencia/devlokos/odoo-app.png",
        "/experiencia/novacomp/REFACTOR-lambda.jpg",
      ]),
      ["/experiencia/devlokos/odoo-app.png", "/experiencia/novacomp/REFACTOR-lambda.jpg"],
    )
  })

  it("drops the confidential Novacomp web capture", () => {
    assert.deepEqual(
      publicExperienceImages([
        "/experiencia/novacomp/REFACTOR-lambda.jpg",
        "/experiencia/novacomp/app_web_confidential.png",
      ]),
      ["/experiencia/novacomp/REFACTOR-lambda.jpg"],
    )
  })

  it("returns an empty list when there are no images", () => {
    assert.deepEqual(publicExperienceImages(undefined), [])
    assert.deepEqual(publicExperienceImages([]), [])
  })
})
