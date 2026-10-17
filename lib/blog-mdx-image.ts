/** Desktop cap for tall diagrams so they stay secondary to the prose. */
export const BLOG_PORTRAIT_MAX_WIDTH_PX = 480

/** Desktop cap for landscape photos; still shrinks to the column on mobile. */
export const BLOG_LANDSCAPE_MAX_WIDTH_PX = 768

export type BlogMdxImageOrientation = "portrait" | "landscape"

export function blogMdxImageOrientation(width: number, height: number): BlogMdxImageOrientation {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return "landscape"
  }
  return height > width ? "portrait" : "landscape"
}

export function blogMdxImageMaxWidthPx(width: number, height: number): number {
  return blogMdxImageOrientation(width, height) === "portrait"
    ? BLOG_PORTRAIT_MAX_WIDTH_PX
    : BLOG_LANDSCAPE_MAX_WIDTH_PX
}
