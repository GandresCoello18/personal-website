import type { MDXComponents } from "mdx/types"
import Image from "next/image"
import Link from "next/link"
import type { ComponentPropsWithoutRef } from "react"
import { YouTubeEmbed } from "@/components/mdx/YouTubeEmbed"
import { Callout } from "@/components/mdx/Callout"
import { cn } from "@/lib/utils"

type ImgProps = ComponentPropsWithoutRef<"img">

/** Ancho máximo del cuerpo (~768px): la portada en `BlogLayout` sigue usando todo `max-w-6xl`. */
const BODY_IMG_MAX_W_PX = 768

function MdxImage({ src, alt, width, height }: ImgProps) {
  if (!src || typeof src !== "string") return null
  const intrinsicW = typeof width === "number" ? width : Number(width) || 1200
  const intrinsicH = typeof height === "number" ? height : Number(height) || 630
  return (
    <span className="blog-mdx-image mx-auto my-8 block w-full max-w-3xl">
      <span className="block overflow-hidden rounded-xl border border-border bg-muted/30">
        <Image
          src={src}
          alt={alt ?? ""}
          width={intrinsicW}
          height={intrinsicH}
          className="h-auto max-h-[min(75vh,680px)] w-full object-contain"
          sizes={`(max-width: 768px) 100vw, ${BODY_IMG_MAX_W_PX}px`}
        />
        {alt ? (
          <span className="block px-3 py-2 text-center text-sm text-muted-foreground">{alt}</span>
        ) : null}
      </span>
    </span>
  )
}

function MdxLink({ href, children, ...rest }: ComponentPropsWithoutRef<"a">) {
  const h = href ?? ""
  if (h.startsWith("/") && !h.startsWith("//")) {
    return (
      <Link href={h} className="text-primary underline underline-offset-4 hover:text-primary/80" {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={h}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-4 hover:text-primary/80"
      {...rest}
    >
      {children}
    </a>
  )
}

/**
 * Fences sin Shiki (p. ej. sin idioma) o HTML pre suelto.
 * Los bloques con resaltado pasan por `rehype-pretty-code` → `figure` + `pre.shiki`.
 */
function MdxPre({ children, className, ...props }: ComponentPropsWithoutRef<"pre">) {
  return (
    <pre
      className={cn(
        "my-8 overflow-x-auto rounded-xl border border-border bg-[var(--blog-code-bg)] p-5 text-[13px] leading-6 shadow-sm",
        "[&_code]:font-mono [&_code]:text-[13px]",
        className,
      )}
      {...props}
    >
      {children}
    </pre>
  )
}

function MdxFigure({ children, className, ...props }: ComponentPropsWithoutRef<"figure">) {
  return (
    <figure
      className={cn(
        "blog-code-figure my-8 overflow-hidden rounded-xl border border-border shadow-md",
        /* Bloque claro legible también sobre fondo oscuro (estilo Medium / documentación). */
        "bg-[var(--blog-code-figure-bg)]",
        className,
      )}
      {...props}
    >
      {children}
    </figure>
  )
}

function MdxCode({ className, children, ...props }: ComponentPropsWithoutRef<"code">) {
  const cls = typeof className === "string" ? className : ""
  const isHighlightedBlock =
    cls.includes("shiki") || cls.includes("language-") || cls.includes("hljs")

  if (isHighlightedBlock) {
    return (
      <code className={cls} {...props}>
        {children}
      </code>
    )
  }

  return (
    <code
      className="rounded-md bg-[var(--blog-code-inline-bg)] px-1.5 py-0.5 font-mono text-[0.875em] text-foreground [box-decoration-break:clone]"
      {...props}
    >
      {children}
    </code>
  )
}

/**
 * Maps MDX elements to styled components + shortcodes (`YouTube`, `Callout`).
 * Passed to `compileMDX` from next-mdx-remote (RSC).
 */
export function getMdxComponents(): MDXComponents {
  return {
    img: MdxImage,
    a: MdxLink,
    pre: MdxPre,
    code: MdxCode,
    figure: MdxFigure,
    YouTube: YouTubeEmbed,
    Callout,
  }
}
