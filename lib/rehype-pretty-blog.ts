import rehypePrettyCode from "rehype-pretty-code"
import type { Options } from "rehype-pretty-code"

/**
 * Shiki + rehype-pretty-code: resaltado tipo editor para fences ```.
 * `bypassInlineCode`: el código entre comillas sigue siendo estilo Medium (fondo suave).
 */
export const rehypePrettyBlogOptions: Options = {
  theme: "github-light",
  keepBackground: true,
  /** Sin rejilla de líneas: bloques más limpios, estilo editorial. */
  grid: false,
  defaultLang: "plaintext",
  bypassInlineCode: true,
}

export const rehypePrettyBlogPlugin: [typeof rehypePrettyCode, Options] = [
  rehypePrettyCode,
  rehypePrettyBlogOptions,
]
