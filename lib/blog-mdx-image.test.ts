import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  BLOG_LANDSCAPE_MAX_WIDTH_PX,
  BLOG_PORTRAIT_MAX_WIDTH_PX,
  blogMdxImageMaxWidthPx,
  blogMdxImageOrientation,
} from "./blog-mdx-image.ts"

describe("blog MDX image sizing", () => {
  it("treats 1080x1350 diagrams as portraits capped at 480px", () => {
    assert.equal(blogMdxImageOrientation(1080, 1350), "portrait")
    assert.equal(blogMdxImageMaxWidthPx(1080, 1350), BLOG_PORTRAIT_MAX_WIDTH_PX)
    assert.equal(BLOG_PORTRAIT_MAX_WIDTH_PX, 480)
  })

  it("keeps landscape photos on the wider article measure", () => {
    assert.equal(blogMdxImageOrientation(1200, 675), "landscape")
    assert.equal(blogMdxImageMaxWidthPx(1200, 900), BLOG_LANDSCAPE_MAX_WIDTH_PX)
    assert.equal(BLOG_LANDSCAPE_MAX_WIDTH_PX, 768)
  })

  it("falls back to landscape when dimensions are missing", () => {
    assert.equal(blogMdxImageOrientation(0, 0), "landscape")
    assert.equal(blogMdxImageMaxWidthPx(Number.NaN, 900), BLOG_LANDSCAPE_MAX_WIDTH_PX)
  })
})
