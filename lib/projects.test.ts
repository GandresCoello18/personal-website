import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import path from "node:path"
import { describe, it } from "node:test"
import {
  SITE_PROJECTS,
  getCompactProjects,
  getFeaturedProjects,
  getProjectNavLinks,
} from "./projects.ts"

const HISTORICAL_IMAGES: Record<string, string[]> = {
  meniuz: [
    "/proyectos/meniuz/apps-native.jpg",
    "/proyectos/meniuz/AWS-architecture-diagram-showing-the-final-cloud-image-1.png",
    "/proyectos/meniuz/list-business-app.png",
    "/proyectos/meniuz/landing.png",
    "/proyectos/meniuz/meniuz-list-cities.png",
  ],
  tayos: ["/proyectos/odoo-app/odoo-app.png", "/proyectos/odoo-app/odoo-app-02.png"],
  "community-ai-monitor": [
    "/proyectos/community-ai-monitor/monitor-park.png",
    "/proyectos/community-ai-monitor/diagram-fluj.png",
  ],
  "image-intelligence": [
    "/proyectos/image-intelligence-platform/image-process-inteligent.png",
    "/proyectos/image-intelligence-platform/diagram.png",
  ],
  "order-lifecycle": ["/proyectos/order-lifecycle-platform/diagram.png"],
  "bobs-corn": ["/proyectos/bob-s-corn/client.png", "/proyectos/bob-s-corn/diagram.jpeg"],
  "spotify-clone": [
    "/proyectos/spotify-clone/spotify-clone-app.png",
    "/proyectos/spotify-clone/1756679537331.jpg",
  ],
  "expense-cli": [
    "/proyectos/expense-balancer-cli/result-cli.png",
    "/proyectos/expense-balancer-cli/test-cli.png",
  ],
  chimborazo: [
    "/proyectos/chimborazo-cerca-del-sol/chimborazo-01.png",
    "/proyectos/chimborazo-cerca-del-sol/chimborazo-02.png",
    "/proyectos/chimborazo-cerca-del-sol/chimborazo-03.png",
    "/proyectos/chimborazo-cerca-del-sol/chimborazo-04.png",
  ],
  "unsplash-collage": [
    "/proyectos/unsplash-collage-astro/explore-collage-astro.png",
    "/proyectos/unsplash-collage-astro/generate-collage-astro.png",
    "/proyectos/unsplash-collage-astro/gallery-collage-astro.png",
  ],
  "ggtech-public": [
    "/proyectos/ggtech-panel-publico/ggtech-info-match.png",
    "/proyectos/ggtech-panel-publico/ggtech-bracket.png",
    "/proyectos/ggtech-panel-publico/ggtech-info-round.png",
    "/proyectos/ggtech-panel-publico/ggtech-info-tournament.png",
  ],
  "ggtech-admin": [
    "/proyectos/ggtech-panel-admin/admin-ggtech-02.png",
    "/proyectos/ggtech-panel-admin/admin-ggtech-01.png",
    "/proyectos/ggtech-panel-admin/ggtech-admin-bracket.png",
    "/proyectos/ggtech-panel-admin/ggtech-admin-suizo.png",
  ],
  "padel-track": [
    "/proyectos/padel-track/videos-cuestionario.jpeg",
    "/proyectos/padel-track/padeltrack-public.png",
    "/proyectos/padel-track/unnamed (1).webp",
    "/proyectos/padel-track/unnamed (2).webp",
    "/proyectos/padel-track/unnamed (3).webp",
  ],
}

describe("site projects catalog", () => {
  it("keeps continuous work first, then Monitor AI as the third featured card", () => {
    assert.deepEqual(
      getFeaturedProjects().map((item) => item.id),
      ["tayos", "meniuz", "community-ai-monitor"],
    )
  })

  it("moves Order Lifecycle into the compact list ahead of other recent work", () => {
    const compact = getCompactProjects()
    assert.equal(compact[0]?.id, "order-lifecycle")
    assert.equal(
      compact.some((item) => item.featured),
      false,
    )
  })

  it("restores every historical image path and keeps the files on disk", () => {
    for (const [id, historical] of Object.entries(HISTORICAL_IMAGES)) {
      const project = SITE_PROJECTS.find((item) => item.id === id)
      assert.ok(project, id)
      for (const src of historical) {
        assert.equal(project.images.includes(src), true, `${id} missing ${src}`)
        const abs = path.join(process.cwd(), "public", src.replace(/^\//, ""))
        assert.equal(existsSync(abs), true, src)
      }
    }
  })

  it("does not treat GitHub as the compact row primary action when a case exists", () => {
    const order = SITE_PROJECTS.find((item) => item.id === "order-lifecycle")
    assert.ok(order)
    assert.deepEqual(
      getProjectNavLinks(order).map((link) => link.kind),
      ["case", "github"],
    )
  })
})
