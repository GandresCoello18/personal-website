---
description: >
  Design system del sitio personal de Andres Coello. Stack, componentes y
  patrones vigentes. La dirección visual normativa está en DESIGN.md (plano
  técnico). Cargar en cualquier tarea de UI/UX, estilos o contenido visible.
alwaysApply: true
---

# Design System — Andres Coello Personal Website

> **Dirección visual:** `DESIGN.md` (plano técnico: navy `#0d1d40`, crema `#efe9dc`, acento `#5b7fd6`, IBM Plex Sans + Plex Mono, un diagrama de firma). Si este archivo y `DESIGN.md` chocan en color, tipo o motivo de marca, **gana `DESIGN.md`**.
> **Este archivo:** stack, clases vigentes, inventario de componentes, idioma y audiencia. No reescribe la identidad.
> **Implementación:** `app/globals.css` mapea navy/crema e IBM Plex. Tema oscuro por defecto (`html.dark`). No reintroduzcas teal ni Geist.
> **Audiencia:** recruiters de software engineering y empresas que contratan backend.
> **Idioma:** español (`lang="es"`).
> **Impeccable + anti-slop:** toda tarea de UI/UX usa `.cursor/skills/impeccable` y `.cursor/skills/antislop` (reglas `ui-impeccable.mdc` y `ui-antislop.mdc`). Impeccable aporta oficio; anti-slop filtra slop; ninguno reemplaza `DESIGN.md`.

---

## Stack detectado (referencia obligatoria)

| Capa             | Tecnología                                                      | Versión / nota                                       |
| ---------------- | --------------------------------------------------------------- | ---------------------------------------------------- |
| Framework        | Next.js App Router                                              | `^16.0.7`                                            |
| UI runtime       | React                                                           | `19.2.0`                                             |
| Lenguaje         | TypeScript                                                      | `^5`                                                 |
| Estilos          | Tailwind CSS v4 (CSS-first)                                     | `^4.1.9` + `@tailwindcss/postcss`                    |
| Animaciones CSS  | `tw-animate-css`, `tailwindcss-animate`                         | `1.3.3`, `^1.0.7`                                    |
| Componentes base | shadcn/ui **new-york** + Radix UI                               | ver `components.json`                                |
| Iconos           | `lucide-react`                                                  | `^0.454.0`                                           |
| Utilidades CSS   | `clsx`, `tailwind-merge`, `class-variance-authority`            | `cn()` en `lib/utils.ts`                             |
| Temas            | `next-themes`                                                   | `^0.4.6`, `attribute="class"`, `defaultTheme="dark"` |
| Fuentes          | IBM Plex Sans + IBM Plex Mono vía `next/font`                   | `--font-plex-sans` / `--font-plex-mono`              |
| Formularios      | `react-hook-form`, `zod`, `@hookform/resolvers`                 | contacto y futuros forms                             |
| Blog             | `next-mdx-remote`, `gray-matter`, `rehype-pretty-code`, `shiki` | rutas `/blog`                                        |
| Analytics        | `@vercel/analytics`                                             | en `app/layout.tsx`                                  |
| Package manager  | pnpm                                                            | `pnpm@10.33.3` (Node ≥ 22.6)                         |

**No hay** `tailwind.config.js`. Los tokens viven en `app/globals.css` (`:root`, `.dark`, `@theme inline`).

**Imágenes:** `next.config.mjs` tiene `images.unoptimized: true`. Usar `<img>` o `next/image` según patrón del componente existente (blog usa `Image`, marketing suele usar `<img>`).

---

## 1. Design Philosophy

### Principios visuales

1. **Plano técnico** — La UI se lee como un dibujo de infraestructura, no como landing SaaS ni portfolio de plantilla. Ver `DESIGN.md`.
2. **Claridad sobre decoración** — Cada bloque responde: quién soy, qué resuelvo, qué he construido, cómo contactarme.
3. **Un solo elemento de firma** — El diagrama isométrico/lineal (y su cuadrícula) es la identidad. El resto de la página está en silencio.
4. **Consistencia por tokens** — Colores, radios y espaciados salen de variables CSS, no de paletas ad hoc. El destino de esos tokens está en `DESIGN.md`.
5. **Tema navy por defecto** — El claro es opcional (`#f2efe8` / `#13264d` / `#2f5bd3`). El toggle vigente sigue en `components/theme-toggle.tsx`.

### Sensación esperada

- Preciso, quieto, con líneas finas y marcas “+”.
- Pensamiento de ingeniería de backend, no lista de herramientas.
- Ritmo calmado: mucho aire, tipografía IBM Plex, cards sin sombra.

### Evitar

- Degradados, brillos, sombras pesadas, blobs, carruseles y marquees (`DESIGN.md`).
- Saturación de badges, iconos o animaciones.
- Colores hardcodeados (`slate-*`, `teal-*`, `bg-white`) cuando existen tokens semánticos.
- Nuevas librerías UI/animación sin justificación y sin alinearse con shadcn/Radix.
- Tratar la cuadrícula del plano técnico como slop (excepción R-07 documentada en `DESIGN.md`).

### Pregunta guía (aplicar siempre)

> **¿Esto aumenta la confianza de un recruiter que contrata backend?**

---

## 2. Visual Language

### Destino (normativo — `DESIGN.md`)

| Rol        | Oscuro                | Claro         | Uso                                                             |
| ---------- | --------------------- | ------------- | --------------------------------------------------------------- |
| Fondo      | `#0d1d40`             | `#f2efe8`     | Canvas del plano                                                |
| Superficie | `#0f2147` / `#122754` | papel + borde | Secciones y cards                                               |
| Texto      | `#efe9dc`             | `#13264d`     | Lectura                                                         |
| Acento     | `#5b7fd6`             | `#2f5bd3`     | Un solo azul; si no llega a 4.5:1 en texto pequeño, solo trazos |

La cuadrícula / diagrama de plano técnico es identidad de marca, no slop.

### Tokens vigentes en CSS (hasta la fase de estilo)

Los nombres semánticos de `app/globals.css` (`background`, `foreground`, `card`, `primary`, `accent`, …) mapean la paleta de `DESIGN.md`. Usar clases semánticas (`bg-background`, `text-foreground`). El acento oscuro `#5b7fd6` no llega a AA en texto pequeño: solo trazos.

**Tema oscuro vigente:** `html` arranca con `class="dark"`. **Meta theme color:** `#0d1d40`.

### Uso correcto de color

- **Un acento:** el azul de `DESIGN.md`. No hay cian/teal de marca.
- **Fondos de sección:** `bg-background` y bordes finos. `hero-gradient` y blobs son deuda a retirar en la fase de estilo.
- **Tags de tecnología:** chips pequeños; en destino, Plex Mono.

### Bordes, sombras, radios

- **Destino:** radio mínimo o nulo, borde 1px, sin sombra. Ver `DESIGN.md` (Elevation & Depth, Shapes).
- **Vigente:** `--radius: 0.75rem`; `.card-elevated` aún usa `shadow-lg hover:shadow-xl`. No extiendas sombras ni radios en trabajo nuevo si la tarea es de estilo; si no lo es, no toques CSS.

### Espaciado

- **Padding horizontal de sección:** `px-4 sm:px-6 lg:px-8`
- **Padding vertical estándar:** `py-20 md:py-32` (servicios usa `py-10` — excepción más compacta)
- **Gap en grids:** `gap-6` o `gap-8`; cards internas `p-6 md:p-8`

---

## 3. Typography System

### Fuentes

- **Destino:** IBM Plex Sans + IBM Plex Mono (`DESIGN.md`).
- **Vigente:** IBM Plex Sans + IBM Plex Mono en `app/layout.tsx` y `@theme`.

### Clases globales (usar en lugar de tamaños arbitrarios)

```css
.section-title    → text-4xl md:text-5xl font-bold text-balance
.section-subtitle → text-lg md:text-xl text-muted-foreground leading-relaxed
```

### Jerarquía recomendada

| Elemento                   | Clases / patrón                                                      | Ejemplo en proyecto                             |
| -------------------------- | -------------------------------------------------------------------- | ----------------------------------------------- |
| Eyebrow / label de sección | `text-xs font-semibold uppercase tracking-[0.2em] text-accent`       | `blog-section`, `talks-section`, `testimonials` |
| Hero H1                    | `section-title` + span `text-accent`                                 | `components/hero.tsx`                           |
| Título de sección          | `section-title`                                                      | experiencia, proyectos, servicios               |
| Subtítulo de sección       | `section-subtitle max-w-2xl mx-auto`                                 | centrado en headers                             |
| Título de card             | `text-lg md:text-xl font-bold text-foreground` o `text-xl font-bold` | proyectos, experiencia                          |
| Cuerpo                     | `text-muted-foreground leading-relaxed`                              | descripciones                                   |
| Caption / meta             | `text-sm text-muted-foreground` o `text-xs`                          | fechas blog, roles testimonios                  |
| Precio servicio            | `text-2xl font-bold text-primary`                                    | `services.tsx`                                  |
| Stats hero                 | `text-3xl font-bold text-primary` / `text-accent`                    | métricas 7+, 150+, 30+                          |

### Reglas

- Priorizar **lectura rápida**: párrafos cortos, `text-balance` en títulos.
- No introducir familias fuera de IBM Plex Sans / IBM Plex Mono.
- Blog: títulos de índice `text-3xl sm:text-4xl font-bold tracking-tight` (`app/blog/page.tsx`).

---

## 4. Layout Rules

### Contenedores

| Contexto                | Max width | Clase               |
| ----------------------- | --------- | ------------------- |
| Secciones principales   | 1152px    | `max-w-6xl mx-auto` |
| Contacto / CTA estrecho | 896px     | `max-w-4xl mx-auto` |
| Blog índice / artículo  | 1152px    | `max-w-6xl`         |

### Grids habituales

- **2 columnas:** `grid-cols-1 md:grid-cols-2` — hero, proyectos destacados, experiencia
- **3 columnas:** `md:grid-cols-3` — CTA contacto, servicios (hasta `xl:grid-cols-4`)
- **4 columnas:** stats testimonios `grid-cols-2 md:grid-cols-4`
- **Charlas:** `md:grid-cols-2 lg:grid-cols-3`

### Espaciado entre secciones

- Header de sección: `mb-12` a `mb-16` después del bloque intro
- Separadores: `border-t border-border`, `border-y border-border`

### Breakpoints (Tailwind por defecto)

- `sm` 640px — nombre en header, grids 2 cols blog
- `md` 768px — nav desktop, grids multi-columna (`use-mobile.ts` usa 768)
- `lg` 1024px — experiencia 2 cols, padding ampliado
- `xl` 1280px — grid servicios 4 cols

### Narrativa de la home (`app/page.tsx`)

Orden intencional: identidad → credenciales → prueba → contenido → servicios → social proof → conversión.

```
Header → Hero (#about) → Experience → Projects → Talks → Blog → Videos
→ Services → ClassesGallery → Classgap → Testimonials → PaymentMethods → CTA (#contact) → Footer
```

Nuevas secciones deben insertarse sin romper este arco (credibilidad antes de conversión).

---

## 5. Component Rules

### Patrón de sección (plantilla)

```tsx
<section id="..." className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
  <div className="max-w-6xl mx-auto">
    <div className="mb-14 space-y-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Label</p>
      <h2 className="section-title">Título</h2>
      <p className="section-subtitle mx-auto max-w-2xl">Descripción</p>
    </div>
  </div>
</section>
```

### Buttons

| Tipo             | Cuándo usar                | Implementación                                        |
| ---------------- | -------------------------- | ----------------------------------------------------- |
| CTA marketing    | Secciones públicas, header | `.btn-primary` / `.btn-secondary` en `globals.css`    |
| UI interactiva   | Forms, dialogs, toggles    | `@/components/ui/button` + CVA variants               |
| Enlace con icono | Cards, blog                | `Link` + `btn-primary inline-flex items-center gap-2` |

Estados: `hover:bg-primary/90`, `transition-colors`, focus ring en shadcn (`focus-visible:ring-ring/50`).

### Cards

| Variante               | Uso                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `.card-elevated`       | Marketing: proyectos, experiencia, servicios, CTA                                           |
| `@/components/ui/card` | Blog (`BlogCard`), layouts editoriales                                                      |
| Charlas / testimonios  | `card-elevated` o `border border-border bg-card` con variaciones documentadas en su archivo |

### Navigation (`components/header.tsx`)

- Sticky: `sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border`
- Links: `text-sm font-medium text-muted-foreground hover:text-foreground transition-colors`
- CTA: `btn-primary` → `/#contact`
- Mobile: menú absoluto bajo header; `ThemeToggle` siempre visible
- Anchors internos: `/#section` o rutas `/blog`, `/videos`

### Hero (`components/hero.tsx`)

- Vigente: clase `hero-gradient` + blobs `animate-blob` (deuda; se retiran en la fase de estilo)
- Destino: un diagrama isométrico/lineal de firma, sin blobs ni halo
- Grid 2 cols desktop; foto circular `border-4 border-accent`
- CTAs: primario + secundario de borde

### Project showcases (`components/projects.tsx`)

- Datos en array tipado en el mismo archivo (o extraer a `lib/` si crece)
- `ProjectCard`: hoy carrusel de imágenes con crossfade (deuda; `DESIGN.md` prohíbe carruseles). Tags, stats opcionales, links externos
- Featured vs resto con `showAll` + scroll suave
- Comunicar **problema → solución → stack → resultado** en `description` (ver sección 8)

### Timeline / Experience (`components/experience.tsx`)

- Server Component; imágenes con `next/image`
- Card con `border-l-4 border-l-accent`
- Bloque skills al final — **preferir narrativa de impacto** en nuevas iteraciones

### Contact (`components/cta.tsx` + `contact-form.tsx`)

- `id="contact"` + `hero-gradient` (deuda de degradado; retirar en la fase de estilo)
- Grid 3 vías: email, Calendly, LinkedIn
- `ContactForm` client: estados loading/success/error; integración con query `?service=` desde servicios
- `CalendlyBadge` client: script vía `next/script`, colores según tema

### Blog / Videos

- Cards reutilizables: `BlogCard`, `VideoCard`
- Hover sutil: `group-hover:scale-[1.03]` en imagen, `hover:shadow-md`
- MDX: estilos código en `globals.css` (`--blog-code-*`, `.blog-code-figure`)

### Convenciones de archivos

- Secciones de página: `components/{nombre}.tsx` o `components/{nombre}-section.tsx`
- Reutilizables capitalizados: `BlogCard.tsx`, `BlogLayout.tsx`
- UI primitivos: solo en `components/ui/`
- `"use client"` solo si hay estado, efectos, listeners o `useTheme`

### Accesibilidad mínima

- `aria-label` en botones icono
- `aria-labelledby` en secciones con eyebrow
- `alt` descriptivo en imágenes de perfil/proyecto
- Respetar `prefers-reduced-motion`. El marquee de testimonios es deuda: `DESIGN.md` lo prohíbe.

---

## 6. UX Principles

### Los 5 mensajes en < 30 segundos

1. **Quién soy** — Hero: Backend Engineer (ver `DESIGN.md` y sync de contenido)
2. **Qué problemas resuelvo** — Servicios + experiencia (producto, escala, mentoría)
3. **Experiencia** — Timeline + charlas + blog/videos
4. **Prueba** — Proyectos con métricas, testimonios, Classgap
5. **Contacto** — Header CTA, sección contacto, Calendly

### Prioridades

- Claridad > creatividad
- Escaneo rápido > densidad de información
- Un CTA principal por viewport en momentos de conversión
- Storytelling profesional > lista de logos tech

### Flujos de conversión existentes

- Servicio → `handleServiceRequest` → URL params → `#contact` → formulario prellenado
- Calendly: tarjeta en CTA + badge flotante
- CV: descarga PDF desde hero

---

## 7. Animation Rules

### Librerías disponibles

- CSS keyframes en `globals.css` (preferido para marketing)
- `tw-animate-css` / `tailwindcss-animate` (shadcn)
- **No** Framer Motion instalado — no añadir sin aprobación

### Animaciones permitidas

| Animación                              | Ubicación                           | Notas                                  |
| -------------------------------------- | ----------------------------------- | -------------------------------------- |
| `animate-blob`                         | Hero background                     | Legado; retirar en la fase de estilo   |
| Carrusel imágenes                      | `projects.tsx`, `talks-section.tsx` | Legado; `DESIGN.md` prohíbe carruseles |
| `testimonial-marquee`                  | `testimonials.tsx`                  | Legado; `DESIGN.md` prohíbe marquees   |
| `transition-colors` / `transition-all` | Cards, links                        | 300ms estándar                         |
| `group-hover:translate-x-1`            | Flecha CTA hero                     | microinteracción                       |
| `group-hover:scale-[1.02]`             | Cards charlas                       | sutil                                  |
| Blog image scale                       | `BlogCard`                          | `duration-300 ease-out`                |

### Evitar

- Parallax, scroll-jacking, animaciones de entrada en cada elemento
- Degradados, brillos, sombras pesadas, carruseles y marquees (`DESIGN.md`)
- Más de una animación llamativa por sección
- Añadir carruseles o marquees nuevos

`animate-blob`, el carrusel de proyectos/charlas y `testimonial-marquee` son legado. No los copies. `MOTION 1` en `DESIGN.md`.

---

## 8. Content Presentation Rules

### Proyectos como casos de estudio

Cada proyecto debe comunicar (en copy o estructura futura):

1. **Problema / contexto** — mercado, usuario, restricción
2. **Rol y decisiones** — arquitectura, trade-offs
3. **Implementación** — stack como soporte, no como protagonista
4. **Resultado** — métricas (`stats` en `Project`), impacto de negocio

**Evitar** descripciones que solo listen tecnologías.

**Preferir** narrativa de decisiones e impacto verificable (LinkedIn u otra fuente citada). No cargos ni cifras que el sync de contenido haya retirado.

### Tags de tecnología

- Máximo visual: chips pequeños al pie de card
- En copy: integrar en oración ("Migración a monorepo para escalar integraciones B2B")

### Servicios

- Título claro + beneficio + precio/duración + CTA único
- Features como bullets con punto `bg-accent` (patrón actual)

### Testimonios

- Cita en primera persona, rol + empresa, sin rating visual obligatorio

---

## 9. Responsive Rules

### Desktop (lg+)

- Nav horizontal completo
- Grids multi-columna
- Hero con columna de imagen visible

### Tablet (md)

- 2 columnas en la mayoría de grids
- Nav aún colapsado hasta `md:flex`

### Mobile (default)

- Una columna; padding `px-4`
- Hero: foto centrada arriba (`md:hidden` block)
- Menú hamburguesa + theme toggle
- Testimonios: scroll horizontal si `prefers-reduced-motion`
- Touch targets ≥ 44px en CTAs (`py-3`, `size-9` icon buttons)

**Regla:** Diseñar mobile primero para nuevas secciones críticas (hero, contacto, proyectos destacados).

---

## 10. Code Quality Rules

### Arquitectura

```
app/           → rutas, layouts, metadata, API routes
components/    → secciones y composables de página
components/ui/ → primitivos shadcn (no mezclar lógica de negocio)
lib/           → utilidades, MDX, site config
hooks/         → hooks compartidos
content/       → MDX blog
public/        → assets estáticos
```

### Implementación visual

- Componer con utilidades Tailwind + tokens; extraer a `globals.css` solo patrones repetidos ≥ 3 veces
- Usar `cn()` para clases condicionales
- Tipar props con interfaces locales o compartidas (`Talk` exportado en `talks-section.tsx`)
- Metadata SEO en `layout.tsx` o `generateMetadata` por ruta
- `getSiteUrl()` de `lib/site.ts` para URLs canónicas

### Duplicación a evitar

- No crear otro botón primario si existe `.btn-primary`
- No duplicar paleta slate/blue (`classgap-section.tsx` es deuda técnica visual)
- Preferir extender `card-elevated` antes de inventar nueva card

### Calidad de build

- `pnpm typecheck` (`tsc --noEmit`) y `next build` deben pasar. No reactivar `typescript.ignoreBuildErrors`.

---

## 11. AI Implementation Rules

Antes de generar UI nueva:

1. **Leer Impeccable + anti-slop + `DESIGN.md`**. Marca y tokens destino: `DESIGN.md`. Stack y clases vigentes: este documento. Oficio: Impeccable. Filtro: anti-slop (modo during).
2. **Buscar componente similar** — ej. nueva sección tipo charlas → leer `talks-section.tsx`; blog → `BlogCard.tsx`
3. **Reutilizar** — `section-title`, `card-elevated`, `btn-primary`, `Header`/`Footer`
4. **Respetar tema** — solo tokens semánticos; probar mentalmente light + dark
5. **No añadir librerías** (Motion, Chakra, MUI, etc.) sin justificación explícita
6. **Server vs Client** — default Server; client solo si necesario
7. **Scripts terceros** — patrón `next/script` como `calendly-badge.tsx`
8. **Contenido** — español, tono profesional, orientado a contratación
9. **Íconos** — solo `lucide-react`, tamaños `size-4` / `size-5` / `size={24}` según contexto

### Checklist pre-merge visual

- [ ] Usa tokens (`bg-background`, `text-accent`, no `slate-900`)
- [ ] Funciona en dark mode
- [ ] Responsive sm/md/lg verificado
- [ ] Un CTA claro si la sección es de conversión
- [ ] Accesibilidad básica (labels, contraste, focus)
- [ ] No rompe orden narrativo de `app/page.tsx`

---

## 12. Reference Quality Bar

Alinear con:

- `DESIGN.md` y el banner de LinkedIn F (plano técnico)
- Portfolios senior de ingeniería (impacto > stack; un solo elemento de firma)
- Componentes shadcn/new-york como base, remapeados a navy/Plex en la fase de estilo

Referencias internas de mayor calidad visual en este repo:

- `blog-section.tsx`, `talks-section.tsx`, `testimonials.tsx` — headers con eyebrow + tokens consistentes
- `BlogCard.tsx` — hover y Card shadcn bien integrados
- `header.tsx` + `theme-toggle.tsx` — patrón tema

Sección a migrar al sistema: `classgap-section.tsx` (colores slate/blue fuera de tokens).

---

## Apéndice: integraciones y assets

- **Marca personal imagen:** `/1764558900283.png` — navbar, favicon, OG
- **Foto perfil hero:** `/profile.jpeg`
- **CV:** `/pdf/Andres_Coello_Goyes_full_stack_developer_2026.pdf`
- **Calendly:** `https://calendly.com/goyeselcoca/30min`
- **Email:** `goyeselcoca@gmail.com`

---

_Última sincronización: Next.js 16, React 19, Tailwind 4, shadcn new-york. Dirección visual en `DESIGN.md` (plano técnico). CSS vigente: navy/crema + IBM Plex._
