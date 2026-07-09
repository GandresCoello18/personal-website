---
description: Design system y reglas de UI/UX para el sitio personal de Andres Coello. Fuente de verdad para cambios visuales.
alwaysApply: true
---

# Design System — Andres Coello Personal Website

> **Alcance:** Cualquier cambio visual, de UX o de componentes en este repositorio debe respetar este documento.
> **Audiencia objetivo del sitio:** recruiters de software engineering, founders, CTOs, CEOs y empresas que contratan desarrollo o consultoría técnica.
> **Idioma de la interfaz:** español (`lang="es"`).

---

## Stack detectado (referencia obligatoria)

| Capa | Tecnología | Versión / nota |
|------|------------|----------------|
| Framework | Next.js App Router | `^16.0.7` |
| UI runtime | React | `19.2.0` |
| Lenguaje | TypeScript | `^5` |
| Estilos | Tailwind CSS v4 (CSS-first) | `^4.1.9` + `@tailwindcss/postcss` |
| Animaciones CSS | `tw-animate-css`, `tailwindcss-animate` | `1.3.3`, `^1.0.7` |
| Componentes base | shadcn/ui **new-york** + Radix UI | ver `components.json` |
| Iconos | `lucide-react` | `^0.454.0` |
| Utilidades CSS | `clsx`, `tailwind-merge`, `class-variance-authority` | `cn()` en `lib/utils.ts` |
| Temas | `next-themes` | `^0.4.6`, `attribute="class"`, `defaultTheme="light"` |
| Fuentes | Geist + Geist Mono (next/font) | definidas en `app/layout.tsx` y `@theme` en `globals.css` |
| Formularios | `react-hook-form`, `zod`, `@hookform/resolvers` | contacto y futuros forms |
| Blog | `next-mdx-remote`, `gray-matter`, `rehype-pretty-code`, `shiki` | rutas `/blog` |
| Analytics | `@vercel/analytics` | en `app/layout.tsx` |
| Package manager | Yarn | `yarn@1.22` |

**No hay** `tailwind.config.js`. Los tokens viven en `app/globals.css` (`:root`, `.dark`, `@theme inline`).

**Imágenes:** `next.config.mjs` tiene `images.unoptimized: true`. Usar `<img>` o `next/image` según patrón del componente existente (blog usa `Image`, marketing suele usar `<img>`).

---

## 1. Design Philosophy

### Principios visuales

1. **Confianza técnica senior** — La UI debe leerse como producto SaaS profesional, no como portfolio genérico de plantilla.
2. **Claridad sobre decoración** — Cada bloque responde: quién soy, qué resuelvo, qué he construido, cómo contactarme.
3. **Consistencia por tokens** — Colores, radios y espaciados salen de variables CSS (`background`, `foreground`, `primary`, `accent`, etc.), no de paletas ad hoc.
4. **Dual tema real** — Claro y oscuro deben funcionar por igual. El toggle está en `components/theme-toggle.tsx`; la clase `.dark` en `<html>` activa tokens en `globals.css`.
5. **Conversión sin fricción** — CTAs visibles (`Contactar`, Calendly, formulario), rutas claras y secciones escaneables.

### Sensación esperada

- Premium, moderna, sobria, con acentos teal/azul.
- Pensamiento de producto e ingeniería, no solo lista de herramientas.
- Ritmo visual calmado: mucho aire, jerarquía tipográfica fuerte, cards con bordes sutiles.

### Evitar

- Estética “developer hobby” (gradientes neón, glassmorphism excesivo, fuentes display).
- Saturación de badges, iconos o animaciones.
- Colores hardcodeados (`slate-*`, `blue-*`, `bg-white`) cuando existen tokens semánticos.
- Nuevas librerías UI/animación sin justificación y sin alinearse con shadcn/Radix.
- Copiar bloques de v0 sin adaptarlos al sistema existente (`section-title`, `card-elevated`, etc.).

### Pregunta guía (aplicar siempre)

> **¿Esto aumenta la confianza de un potencial contratante (recruiter, founder, CTO)?**

---

## 2. Visual Language

### Paleta (OKLCH en `app/globals.css`)

| Token | Rol | Uso |
|-------|-----|-----|
| `background` / `foreground` | Base de página | `bg-background`, `text-foreground` |
| `card` / `card-foreground` | Superficies elevadas | cards, footer, paneles |
| `primary` | Azul profundo (CTA principal) | botones primarios, métricas hero |
| `secondary` | Cyan secundario | acentos alternos, iconografía servicios |
| `accent` | Teal (marca, highlights) | eyebrows, links hover, bordes activos |
| `muted` / `muted-foreground` | Fondos suaves y texto secundario | subtítulos, metadata |
| `border` / `input` / `ring` | Estructura y focus | bordes, inputs, focus visible |
| `destructive` | Errores | formularios, alertas |

**Tema oscuro:** `.dark` redefine todos los tokens. Usar clases semánticas (`text-accent`), no `dark:text-slate-300` salvo migración pendiente.

**Meta theme color:** `#1c4e5a` (alineado con marca teal/azul).

### Uso correcto de color

- **Un acento por bloque:** `accent` para énfasis; `primary` para acción principal; `secondary` para variación en grids de servicios.
- **Fondos de sección alternados:** `bg-background`, `bg-muted/30`, `border-y border-border`, `hero-gradient` — ya usados en home.
- **Iconos en contenedores:** `bg-{token}/10` + `text-{token}` + `group-hover:bg-{token}/20` (ver `components/cta.tsx`, `services.tsx`).
- **Tags de tecnología:** `px-2 py-1 bg-accent/10 text-accent text-xs rounded font-medium` (proyectos) o `rounded-full` con `primary`/`accent`/`secondary` (experiencia).

### Bordes, sombras, radios

- **Radio base:** `--radius: 0.75rem` → `rounded-lg` en marketing; shadcn `Card` usa `rounded-xl`.
- **Cards marketing:** clase global `.card-elevated` — `rounded-lg bg-card border border-border shadow-lg hover:shadow-xl hover:border-accent/50`.
- **Acento lateral (timeline):** `border-l-4 border-l-accent` en experiencia.
- **Sombras:** preferir `shadow-lg` / `shadow-md` en hover; evitar sombras de color.

### Espaciado

- **Padding horizontal de sección:** `px-4 sm:px-6 lg:px-8`
- **Padding vertical estándar:** `py-20 md:py-32` (servicios usa `py-10` — excepción más compacta)
- **Gap en grids:** `gap-6` o `gap-8`; cards internas `p-6 md:p-8`

---

## 3. Typography System

### Fuentes

- **Sans:** Geist — `font-sans` en `body` (`app/layout.tsx`)
- **Mono:** Geist Mono — bloques de código blog (`--font-mono` en `@theme`)

### Clases globales (usar en lugar de tamaños arbitrarios)

```css
.section-title    → text-4xl md:text-5xl font-bold text-balance
.section-subtitle → text-lg md:text-xl text-muted-foreground leading-relaxed
```

### Jerarquía recomendada

| Elemento | Clases / patrón | Ejemplo en proyecto |
|----------|-----------------|---------------------|
| Eyebrow / label de sección | `text-xs font-semibold uppercase tracking-[0.2em] text-accent` | `blog-section`, `talks-section`, `testimonials` |
| Hero H1 | `section-title` + span `text-accent` | `components/hero.tsx` |
| Título de sección | `section-title` | experiencia, proyectos, servicios |
| Subtítulo de sección | `section-subtitle max-w-2xl mx-auto` | centrado en headers |
| Título de card | `text-lg md:text-xl font-bold text-foreground` o `text-xl font-bold` | proyectos, experiencia |
| Cuerpo | `text-muted-foreground leading-relaxed` | descripciones |
| Caption / meta | `text-sm text-muted-foreground` o `text-xs` | fechas blog, roles testimonios |
| Precio servicio | `text-2xl font-bold text-primary` | `services.tsx` |
| Stats hero | `text-3xl font-bold text-primary` / `text-accent` | métricas 7+, 150+, 30+ |

### Reglas

- Priorizar **lectura rápida**: párrafos cortos, `text-balance` en títulos.
- No introducir nuevas familias tipográficas.
- Blog: títulos de índice `text-3xl sm:text-4xl font-bold tracking-tight` (`app/blog/page.tsx`).

---

## 4. Layout Rules

### Contenedores

| Contexto | Max width | Clase |
|----------|-----------|-------|
| Secciones principales | 1152px | `max-w-6xl mx-auto` |
| Contacto / CTA estrecho | 896px | `max-w-4xl mx-auto` |
| Blog índice / artículo | 1152px | `max-w-6xl` |

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

| Tipo | Cuándo usar | Implementación |
|------|-------------|----------------|
| CTA marketing | Secciones públicas, header | `.btn-primary` / `.btn-secondary` en `globals.css` |
| UI interactiva | Forms, dialogs, toggles | `@/components/ui/button` + CVA variants |
| Enlace con icono | Cards, blog | `Link` + `btn-primary inline-flex items-center gap-2` |

Estados: `hover:bg-primary/90`, `transition-colors`, focus ring en shadcn (`focus-visible:ring-ring/50`).

### Cards

| Variante | Uso |
|----------|-----|
| `.card-elevated` | Marketing: proyectos, experiencia, servicios, CTA |
| `@/components/ui/card` | Blog (`BlogCard`), layouts editoriales |
| Charlas / testimonios | `card-elevated` o `border border-border bg-card` con variaciones documentadas en su archivo |

### Navigation (`components/header.tsx`)

- Sticky: `sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border`
- Links: `text-sm font-medium text-muted-foreground hover:text-foreground transition-colors`
- CTA: `btn-primary` → `/#contact`
- Mobile: menú absoluto bajo header; `ThemeToggle` siempre visible
- Anchors internos: `/#section` o rutas `/blog`, `/videos`

### Hero (`components/hero.tsx`)

- Clase `hero-gradient` + blobs `animate-blob` (fondo decorativo permitido aquí)
- Grid 2 cols desktop; foto circular `border-4 border-accent`
- Métricas en grid 3 columnas
- CTAs: primario + accent (`bg-accent text-accent-foreground`)

### Project showcases (`components/projects.tsx`)

- Datos en array tipado en el mismo archivo (o extraer a `lib/` si crece)
- `ProjectCard`: carrusel de imágenes con crossfade, tags, stats opcionales, links externos
- Featured vs resto con `showAll` + scroll suave
- Comunicar **problema → solución → stack → resultado** en `description` (ver sección 8)

### Timeline / Experience (`components/experience.tsx`)

- Server Component; imágenes con `next/image`
- Card con `border-l-4 border-l-accent`
- Bloque skills al final — **preferir narrativa de impacto** en nuevas iteraciones

### Contact (`components/cta.tsx` + `contact-form.tsx`)

- `id="contact"` + `hero-gradient`
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
- Respetar `prefers-reduced-motion` (ver testimonial marquee en `globals.css`)

---

## 6. UX Principles

### Los 5 mensajes en < 30 segundos

1. **Quién soy** — Hero: Software Engineer, SRE, mentor
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

| Animación | Ubicación | Notas |
|-----------|-----------|-------|
| `animate-blob` | Hero background | Lento, 7s, decorativo aceptable |
| Carrusel imágenes | `projects.tsx`, `talks-section.tsx` | Crossfade ~600ms, auto-rotate |
| `testimonial-marquee` | `testimonials.tsx` | 50s linear, pausa en hover |
| `transition-colors` / `transition-all` | Cards, links | 300ms estándar |
| `group-hover:translate-x-1` | Flecha CTA hero | microinteracción |
| `group-hover:scale-[1.02]` | Cards charlas | sutil |
| Blog image scale | `BlogCard` | `duration-300 ease-out` |

### Evitar

- Parallax, scroll-jacking, animaciones de entrada en cada elemento
- Más de una animación llamativa por sección
- Ignorar `prefers-reduced-motion` en nuevos carruseles

### Plantilla reduced-motion

Al crear marquee o auto-scroll, seguir patrón de `.testimonial-marquee-track` en `globals.css`.

---

## 8. Content Presentation Rules

### Proyectos como casos de estudio

Cada proyecto debe comunicar (en copy o estructura futura):

1. **Problema / contexto** — mercado, usuario, restricción
2. **Rol y decisiones** — arquitectura, trade-offs
3. **Implementación** — stack como soporte, no como protagonista
4. **Resultado** — métricas (`stats` en `Project`), impacto de negocio

**Evitar** descripciones que solo listen tecnologías.

**Preferir** narrativa como en experiencia Meniuz (CTO, escala, AWS, CI/CD) o MIMS (RLS, multi-tenant, LegalTech).

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

- `typescript.ignoreBuildErrors: true` está activo — no empeorar deuda; tipar componentes nuevos correctamente

---

## 11. AI Implementation Rules

Antes de generar UI nueva:

1. **Buscar componente similar** — ej. nueva sección tipo charlas → leer `talks-section.tsx`; blog → `BlogCard.tsx`
2. **Reutilizar** — `section-title`, `card-elevated`, `btn-primary`, `Header`/`Footer`
3. **Respetar tema** — solo tokens semánticos; probar mentalmente light + dark
4. **No añadir librerías** (Motion, Chakra, MUI, etc.) sin justificación explícita
5. **Server vs Client** — default Server; client solo si necesario
6. **Scripts terceros** — patrón `next/script` como `calendly-badge.tsx`
7. **Contenido** — español, tono profesional, orientado a contratación
8. **Íconos** — solo `lucide-react`, tamaños `size-4` / `size-5` / `size={24}` según contexto

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

- Landings SaaS B2B modernas (claras, aireadas, confianza)
- Portfolios senior de ingeniería (impacto > stack)
- Componentes shadcn/new-york (limpio, accesible)

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

*Última sincronización con el codebase: Next.js 16, React 19, Tailwind 4, shadcn new-york, tema claro/oscuro vía next-themes.*
