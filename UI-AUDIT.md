# UI/UX Audit — Andres Coello Personal Website

**Fecha:** 9 de julio de 2026  
**Referencia:** [`.cursor/rules/design-system.md`](.cursor/rules/design-system.md)  
**Rol:** Senior Product Designer — auditoría sin cambios de código  
**Alcance:** Home (`app/page.tsx`), componentes de marketing, blog/videos, header, footer, tokens globales

---

## Resumen ejecutivo

El sitio tiene una base sólida (tokens OKLCH, `section-title`, `card-elevated`, tema claro/oscuro, secciones premium como Charlas/Blog/Testimonios). Sin embargo, **la narrativa y el peso visual están orientados a mentoría/tutoría**, no a contratación senior. Hay **inconsistencias de sistema** (Classgap fuera de tokens, espaciados mixtos, headers sin eyebrow) y **fricción de conversión** (home muy larga, CTAs duplicados, prueba social no alineada con recruiters/CTOs).

**Hallazgos:** 32  
**Alta:** 12 · **Media:** 14 · **Baja:** 6

---

## Leyenda de prioridad

| Prioridad | Criterio |
|-----------|----------|
| **Alta** | Afecta confianza profesional, conversión principal o viola reglas core del design system |
| **Media** | Degrada consistencia, escaneo o percepción de calidad sin bloquear por completo |
| **Baja** | Pulido, deuda menor o impacto localizado |

---

## 1. Inconsistencias visuales

### 1.1 Classgap usa paleta `slate`/`blue` fuera del design system

| Campo | Detalle |
|-------|---------|
| **Problema** | `classgap-section.tsx` depende de `slate-*`, `blue-*`, `amber-*`, `green-*` y `bg-white` en lugar de tokens (`bg-card`, `text-foreground`, `text-accent`, `border-border`). |
| **Impacto en usuario** | La sección se percibe como un bloque pegado de otra plantilla; en dark mode el salto visual rompe la sensación premium y unificada. |
| **Recomendación** | Migrar a `card-elevated`, eyebrow `text-accent`, fondo `bg-muted/30` o `border-y border-border`, iconos con `bg-accent/10 text-accent`. |
| **Prioridad** | **Alta** |

### 1.2 Headers de sección inconsistentes (con vs sin eyebrow)

| Campo | Detalle |
|-------|---------|
| **Problema** | Charlas, Blog, Videos y Testimonios usan label `tracking-[0.2em] text-accent`; Experiencia, Proyectos, Servicios, Clases, Métodos de pago y CTA no. |
| **Impacto en usuario** | Ritmo visual irregular; el usuario no reconoce un patrón de sección y la página parece ensamblada por fases distintas. |
| **Recomendación** | Adoptar el patrón eyebrow + `section-title` + `section-subtitle` en todas las secciones de marketing. |
| **Prioridad** | **Media** |

### 1.3 Espaciado vertical inconsistente entre secciones

| Campo | Detalle |
|-------|---------|
| **Problema** | Coexisten `py-10` (hero, servicios), `py-16 md:py-24` (classgap), `py-20 md:py-32` (mayoría) sin criterio documentado. |
| **Impacto en usuario** | Algunas secciones se sienten apretadas (servicios) y otras muy separadas; el scroll pierde cadencia. |
| **Recomendación** | Estandarizar `py-20 md:py-32` salvo hero compacto; documentar excepciones en design system. |
| **Prioridad** | **Media** |

### 1.4 Contenedor inconsistente (`max-w-6xl` vs `container mx-auto`)

| Campo | Detalle |
|-------|---------|
| **Problema** | `classes-gallery.tsx` usa `container mx-auto` mientras el resto usa `max-w-6xl mx-auto`. |
| **Impacto en usuario** | Anchos ligeramente distintos entre secciones adyacentes; sensación de desalineación en desktop. |
| **Recomendación** | Unificar en `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`. |
| **Prioridad** | **Media** |

### 1.5 Dos familias de card sin criterio claro al usuario

| Campo | Detalle |
|-------|---------|
| **Problema** | Marketing usa `.card-elevated` (`rounded-lg`); blog/videos usan `ui/card` (`rounded-xl`, otra sombra). Testimonios usan `rounded-xl border` manual. |
| **Impacto en usuario** | Micro-diferencias de radio y sombra reducen percepción de sistema de diseño único. |
| **Recomendación** | Definir: marketing → `card-elevated`; contenido editorial → `Card` shadcn; testimonios → alinear radio/sombra a uno de los dos. |
| **Prioridad** | **Media** |

### 1.6 Hero badge con `bg-white` / `dark:bg-slate-950`

| Campo | Detalle |
|-------|---------|
| **Problema** | Pill del hero viola regla de tokens (`hero.tsx` línea 97). |
| **Impacto en usuario** | En tema oscuro el contraste con el resto de superficies (`bg-card`) es sutil pero notable. |
| **Recomendación** | Usar `bg-card/90 backdrop-blur border border-border`. |
| **Prioridad** | **Media** |

### 1.7 Estados de formulario con colores `green-*` / `red-*` hardcodeados

| Campo | Detalle |
|-------|---------|
| **Problema** | `contact-form.tsx` no usa `destructive`, Alert shadcn ni tokens semánticos para éxito/error. |
| **Impacto en usuario** | Mensajes de feedback se ven genéricos y desconectados del resto de la UI. |
| **Recomendación** | Usar `@/components/ui/alert` con variantes o tokens `--destructive` + superficie `bg-muted`. |
| **Prioridad** | **Media** |

### 1.8 Imágenes de perfil inconsistentes

| Campo | Detalle |
|-------|---------|
| **Problema** | Header/footer usan `/1764558900283.png`; hero usa `/profile.jpeg`. |
| **Impacto en usuario** | Identidad visual fragmentada; menor reconocimiento de marca personal. |
| **Recomendación** | Definir una imagen principal de marca y una secundaria (perfil formal) con uso documentado. |
| **Prioridad** | **Media** |

### 1.9 Métodos de pago con emojis como iconografía

| Campo | Detalle |
|-------|---------|
| **Problema** | `payment-methods.tsx` usa banderas y emojis (`🇪🇨`, `🅿️`) en lugar de `lucide-react` o logos SVG. |
| **Impacto en usuario** | Rompe el tono SaaS premium; puede verse informal frente a un CTO o empresa. |
| **Recomendación** | Iconos Lucide consistentes o logos monocromáticos discretos. |
| **Prioridad** | **Media** |

### 1.10 Subpáginas blog/videos con tipografía distinta al home

| Campo | Detalle |
|-------|---------|
| **Problema** | `/blog` y `/videos` usan `text-3xl sm:text-4xl` en H1, no `section-title` ni eyebrow. |
| **Impacto en usuario** | Al navegar desde home, blog/videos parecen otro producto. |
| **Recomendación** | Reutilizar header de sección del design system en índices de contenido. |
| **Prioridad** | **Baja** |

---

## 2. Problemas de jerarquía

### 2.1 Hero: H1 no comunica rol senior de forma inmediata

| Campo | Detalle |
|-------|---------|
| **Problema** | Título centrado en “Creacion de productos digitales con Impacto”; subtítulo mezcla SRE con “enseño a la próxima generación”. Errores ortográficos: “Creacion”, “Enginner”. |
| **Impacto en usuario** | Recruiter/CTO tarda en entender seniority y foco; los typos reducen confianza profesional en los primeros 3 segundos. |
| **Recomendación** | H1 orientado a outcome: “Software Engineer & CTO — productos escalables con impacto”. Subtítulo con stack de valor (SRE, arquitectura, producto). Corregir copy. |
| **Prioridad** | **Alta** |

### 2.2 Métricas del hero priorizan mentoría sobre ingeniería

| Campo | Detalle |
|-------|---------|
| **Problema** | Stats: 7+ años, **150+ estudiantes**, 30+ proyectos. “Estudiantes” compite visualmente con experiencia técnica. |
| **Impacto en usuario** | Un hiring manager clasifica el perfil como tutor antes que como engineer senior. |
| **Recomendación** | Reordenar o sustituir por métricas de producto (usuarios, uptime, equipos liderados, escala). Mantener educación en sección dedicada. |
| **Prioridad** | **Alta** |

### 2.3 Experiencia: bloques de texto largos sin jerarquía interna

| Campo | Detalle |
|-------|---------|
| **Problema** | Cards de experiencia con párrafos densos (Meniuz, MIMS, Novacomp); sin bullets de impacto, rol o resultado. |
| **Impacto en usuario** | Escaneo lento; recruiters abandonan antes de extraer logros. |
| **Recomendación** | Formato fijo: Rol · Empresa · Periodo → 2–3 bullets de impacto → tecnologías secundarias. |
| **Prioridad** | **Alta** |

### 2.4 Educación compite con Experiencia al mismo nivel visual

| Campo | Detalle |
|-------|---------|
| **Problema** | Segundo `section-title` completo (“Educación”) dentro de la misma sección `#experience`. |
| **Impacto en usuario** | Diluye la jerarquía; experiencia laboral senior no destaca suficientemente. |
| **Recomendación** | Sub-sección con H3, eyebrow “Formación” o bloque colapsable; menor peso visual que empleos. |
| **Prioridad** | **Media** |

### 2.5 Testimonios: stats arriba del título de sección

| Campo | Detalle |
|-------|---------|
| **Problema** | Grid 4 métricas aparece **antes** del eyebrow “Testimonios” y “Qué dicen”. |
| **Impacto en usuario** | El usuario ve números sin contexto; rompe el patrón header → contenido del resto del sitio. |
| **Recomendación** | Mover stats debajo del header o integrar una sola fila de prueba social bajo el subtítulo. |
| **Prioridad** | **Media** |

### 2.6 Habilidades técnicas como muro de chips al final de Experiencia

| Campo | Detalle |
|-------|---------|
| **Problema** | Tres columnas con listas largas (React, Meteor, AWS…) sin contexto de aplicación. |
| **Impacto en usuario** | Percepción “CV keyword stuffing”; contradice regla de narrativa de impacto del design system. |
| **Recomendación** | Reducir a 6–8 capacidades core o vincular chips a roles/proyectos concretos. |
| **Prioridad** | **Alta** |

---

## 3. Problemas de conversión

### 3.1 CTA principal del hero apunta a proyectos, no a contacto

| Campo | Detalle |
|-------|---------|
| **Problema** | Botón primario: “Ver Proyectos”; “Descargar CV” es secundario (accent). No hay “Agendar llamada” o “Contactar” en hero. |
| **Impacto en usuario** | Visitantes con intención de contratar deben hacer scroll o buscar nav; se pierden leads calientes. |
| **Recomendación** | CTA primario `/#contact` o Calendly; secundarios: CV y proyectos. |
| **Prioridad** | **Alta** |

### 3.2 Calendly duplicado (tarjeta + badge flotante)

| Campo | Detalle |
|-------|---------|
| **Problema** | `cta.tsx` incluye card “Agendar Llamada” y `CalendlyBadge` flotante global en la misma sección. |
| **Impacto en usuario** | Dos puntos de entrada redundantes compiten por atención; el badge puede tapar contenido en mobile. |
| **Recomendación** | Un solo punto principal de agendado; badge solo si no hay CTA inline visible. |
| **Prioridad** | **Media** |

### 3.3 Home excesivamente larga antes del CTA

| Campo | Detalle |
|-------|---------|
| **Problema** | 14 bloques entre hero y `#contact` (incluye blog, videos, galería de clases, classgap, testimonios, pagos). |
| **Impacto en usuario** | Fatiga de scroll; usuarios con intención comercial no llegan al formulario. |
| **Recomendación** | Reordenar: credenciales → proyectos → charlas → servicios → CTA temprano → contenido secundario (clases/blog) o anclas resumidas. |
| **Prioridad** | **Alta** |

### 3.4 Métodos de pago inmediatamente antes del contacto

| Campo | Detalle |
|-------|---------|
| **Problema** | `PaymentMethods` precede a `CTA` en `page.tsx`. |
| **Impacto en usuario** | Introduce fricción comercial (“¿cuánto cuesta / cómo pago?”) antes de iniciar conversación; puede asustar consultas exploratorias de empresas. |
| **Recomendación** | Mover pagos dentro de Servicios o FAQ post-contacto; mantener CTA como penúltimo bloque fuerte. |
| **Prioridad** | **Media** |

### 3.5 Servicios: CTA por card pero sin diferenciación employer vs estudiante

| Campo | Detalle |
|-------|---------|
| **Problema** | Todos los servicios usan “Solicitar Información” con el mismo peso; mezcla mentoría $7.99 con desarrollo “Contactar”. |
| **Impacto en usuario** | CTO no identifica rápido la vía para contratación de producto vs tutoría. |
| **Recomendación** | Agrupar en “Para empresas” y “Para profesionales”; CTAs distintos (brief de proyecto vs sesión). |
| **Prioridad** | **Alta** |

### 3.6 Footer con enlaces placeholder (`#`)

| Campo | Detalle |
|-------|---------|
| **Problema** | Recursos y Legal apuntan a `#` sin destino. |
| **Impacto en usuario** | Dead clicks; percepción de sitio incompleto o poco profesional. |
| **Recomendación** | Eliminar columnas vacías o enlazar a blog, CV, privacidad real. |
| **Prioridad** | **Media** |

### 3.7 Formulario sin labels visibles (solo placeholders)

| Campo | Detalle |
|-------|---------|
| **Problema** | Inputs usan placeholder como única etiqueta. |
| **Impacto en usuario** | Accesibilidad reducida; al escribir, el contexto del campo desaparece. |
| **Recomendación** | Usar `@/components/ui/label` + `Input`/`Textarea` shadcn. |
| **Prioridad** | **Media** |

### 3.8 Nav saturada en desktop (`md`)

| Campo | Detalle |
|-------|---------|
| **Problema** | 6 enlaces + Contactar + theme toggle en una fila desde `md`. |
| **Impacto en usuario** | En tablets landscape el header puede sentirse apretado; CTA pierde prominencia. |
| **Recomendación** | Colapsar Blog/Videos en “Contenido” o mostrar menos ítems hasta `lg`. |
| **Prioridad** | **Baja** |

---

## 4. Secciones que no comunican seniority

### 4.1 Posicionamiento global: “Mentor & Tutor” domina sobre “Software Engineer / CTO”

| Campo | Detalle |
|-------|---------|
| **Problema** | Metadata, hero, footer y múltiples secciones enfatizan mentoría; audiencia objetivo del design system incluye CTOs y founders. |
| **Impacto en usuario** | El sitio vende educación, no liderazgo técnico ni construcción de producto a escala. |
| **Recomendación** | Narrativa dual pero priorizada: ingeniería senior + producto primero; mentoría como línea secundaria. |
| **Prioridad** | **Alta** |

### 4.2 `ClassesGallery` — enfoque en sesiones de enseñanza

| Campo | Detalle |
|-------|---------|
| **Problema** | Título “Mis Clases en Acción”, copy de metodología educativa, títulos con banderas y ejercicios básicos (HTML, CRUD). |
| **Impacto en usuario** | Refuerza percepción de tutor junior; poco relevante para contratación senior. |
| **Recomendación** | Reubicar bajo Servicios/Mentoría o renombrar a “Talleres y workshops” con filtro de charlas enterprise. |
| **Prioridad** | **Alta** |

### 4.3 `ClassgapSection` — prueba social de tutor marketplace

| Campo | Detalle |
|-------|---------|
| **Problema** | Badge “Classgap Verified Tutor”, métricas de reseñas de estudiantes, CTA a perfil de tutor. |
| **Impacto en usuario** | Válido para mentoría; resta señal de consultoría B2B o rol CTO (Meniuz). |
| **Recomendación** | Acortar y mover después de servicios de mentoría; destacar en paralelo logos Meniuz / Novacomp / MIMS. |
| **Prioridad** | **Alta** |

### 4.4 Testimonios exclusivamente de estudiantes

| Campo | Detalle |
|-------|---------|
| **Problema** | Todos los testimonios son “Estudiante”, “Junior Developer”, “Practicante”. |
| **Impacto en usuario** | Un CTO no ve pares ni clientes empresariales; la prueba social no califica para hiring. |
| **Recomendación** | Añadir 2–3 testimonios de clientes, compañeros senior o founders; etiquetar segmento. |
| **Prioridad** | **Alta** |

### 4.5 Proyectos sin narrativa problema → decisión → resultado

| Campo | Detalle |
|-------|---------|
| **Problema** | Descripciones tipo feature list (“Meniuz es una aplicación que permite…”) sin arquitectura, rol ni impacto de negocio. |
| **Impacto en usuario** | No demuestra pensamiento de ingeniería senior pese a tener `stats` en algunos proyectos. |
| **Recomendación** | Plantilla de caso: Contexto · Rol · Decisión técnica · Resultado medible; tags al final. |
| **Prioridad** | **Alta** |

### 4.6 Servicios titulados “Impulsemos tu Carrera y Proyectos”

| Campo | Detalle |
|-------|---------|
| **Problema** | Encabezado orientado a individuos en crecimiento, no a empresas que contratan desarrollo. |
| **Impacto en usuario** | Founders/CTOs no se sienten interpelados. |
| **Recomendación** | Título dual: “Desarrollo de producto y consultoría técnica” + subtítulo para equipos. |
| **Prioridad** | **Alta** |

### 4.7 Meniuz (rol CTO) no tiene protagonismo above-the-fold

| Campo | Detalle |
|-------|---------|
| **Problema** | La experiencia CTO más fuerte está en card #2 del grid de experiencia, después de scroll y mezclada con muchas entradas. |
| **Impacto en usuario** | Se pierde la señal más diferenciadora para seniority. |
| **Recomendación** | Destacar Meniuz en hero o bloque “Featured role”; case study dedicado en proyectos. |
| **Prioridad** | **Alta** |

---

## 5. Oportunidades de mejora (UX/UI)

### 5.1 Rutas de imágenes en Experiencia y ClassesGallery posiblemente rotas

| Campo | Detalle |
|-------|---------|
| **Problema** | `experience.tsx` usa `image: "meniuz.jpeg"` sin `/`; `classes-gallery` igual. `next/image` espera rutas desde `public/`. |
| **Impacto en usuario** | Logos de empresas no cargan → credibilidad cae en la sección más importante para hiring. |
| **Recomendación** | Auditar en runtime; normalizar a `/meniuz.jpeg` o `getPublicUrl()` helper. |
| **Prioridad** | **Alta** |

### 5.2 Animación `hover:scale-105` en cards de proyectos

| Campo | Detalle |
|-------|---------|
| **Problema** | `ProjectCard` escala toda la card + blur en transición de imágenes cada 3s. |
| **Impacto en usuario** | Movimiento elevado en grid grande; puede distraer o molestar (`prefers-reduced-motion` no cubre hover). |
| **Recomendación** | Limitar a `hover:shadow-xl` y `border-accent`; quitar scale en card completa. |
| **Prioridad** | **Baja** |

### 5.3 Blobs del hero con `mix-blend-multiply`

| Campo | Detalle |
|-------|---------|
| **Problema** | Tres blobs animados en hero; en dark mode el blend puede producir manchas irregulares. |
| **Impacto en usuario** | Efecto decorativo puede restar pulido en tema oscuro. |
| **Recomendación** | Reducir opacidad en `.dark` o usar gradiente estático del design system. |
| **Prioridad** | **Baja** |

### 5.4 Redundancia de métricas (hero, classgap, testimonios)

| Campo | Detalle |
|-------|---------|
| **Problema** | “150+”, “5+ años”, “4.9/5” repetidos en múltiples secciones. |
| **Impacto en usuario** | Sensación de relleno; reduce credibilidad por repetición. |
| **Recomendación** | Una sola barra de prueba social global o métricas únicas por sección. |
| **Prioridad** | **Media** |

### 5.5 Charlas y blog demuestran thought leadership — buen activo subutilizado

| Campo | Detalle |
|-------|---------|
| **Problema** | Charlas fuertes (DevFest, UNEMI, IA) están mid-page pero no se enlazan desde hero ni experiencia. |
| **Impacto en usuario** | Señal de seniority existe pero requiere mucho scroll. |
| **Recomendación** | Mencionar charlas en hero; enlace “Ver conferencias” junto a proyectos. |
| **Prioridad** | **Media** |

### 5.6 Calendly badge: colores hex fuera de tokens OKLCH

| Campo | Detalle |
|-------|---------|
| **Problema** | `#92baee` / `#1c4e5a` hardcodeados en `calendly-badge.tsx`, no derivados de `--accent`/`--primary`. |
| **Impacto en usuario** | Ligero desajuste cromático respecto al resto de la marca. |
| **Recomendación** | Leer CSS variables en runtime o documentar hex como extensión oficial de marca. |
| **Prioridad** | **Baja** |

### 5.7 Metadata `generator: v0.app`

| Campo | Detalle |
|-------|---------|
| **Problema** | `layout.tsx` expone generador v0 en metadata. |
| **Impacto en usuario** | Señal indirecta de plantilla automatizada (inspección HTML/SEO tools). |
| **Recomendación** | Eliminar o reemplazar por identidad propia. |
| **Prioridad** | **Baja** |

### 5.8 Falta bloque de “Empresas / clientes” o logos de confianza

| Campo | Detalle |
|-------|---------|
| **Problema** | No hay franja de logos (Meniuz, Novacomp, MIMS, GDG) visible tras el hero. |
| **Impacto en usuario** | Recruiters y founders buscan validación social B2B en los primeros segundos. |
| **Recomendación** | Añadir “Han confiado en mí” con logos monocromáticos bajo hero o experiencia. |
| **Prioridad** | **Media** |

### 5.9 Copy y ortografía en varias secciones

| Campo | Detalle |
|-------|---------|
| **Problema** | Typos en hero, proyectos (“castronomia”, “dintintas”), clases (“Reat Native”, “Despligue”), experiencia (“Metero”, “rapdias”). |
| **Impacto en usuario** | Daña percepción de atención al detalle — crítica para perfiles senior. |
| **Recomendación** | Pasada de copy editing antes de próximo release visual. |
| **Prioridad** | **Media** |

### 5.10 `enableSystem: false` en tema

| Campo | Detalle |
|-------|---------|
| **Problema** | Solo toggle manual claro/oscuro (por diseño actual). |
| **Impacto en usuario** | Usuarios con preferencia OS pueden ver flash o tema no deseado en primera visita. |
| **Recomendación** | Valorar `enableSystem: true` respetando override manual. |
| **Prioridad** | **Baja** |

---

## 6. Matriz de cumplimiento del design system

| Regla del design system | Estado | Notas |
|-------------------------|--------|-------|
| Tokens semánticos (no slate/blue) | ⚠️ Parcial | Classgap, hero pill, form alerts |
| Eyebrow + section-title | ⚠️ Parcial | ~50% de secciones |
| `py-20 md:py-32` | ⚠️ Parcial | Hero, servicios, classgap |
| Narrativa impacto > tech list | ❌ Débil | Skills, proyectos, classgap |
| Audiencia recruiters/CTOs | ❌ Débil | Tono mentoría predominante |
| Tema claro/oscuro | ✅ Bueno | Toggle + tokens .dark |
| Animaciones con propósito | ⚠️ Parcial | Project scale, blobs hero |
| Conversión sin fricción | ⚠️ Parcial | Home larga, CTA tardío |
| Reutilizar shadcn en forms | ❌ No | Contact form custom |
| Pregunta guía de confianza | ⚠️ Mixto | Charlas/blog sí; clases/classgap no |

---

## 7. Roadmap sugerido (sin implementar aún)

### Fase 1 — Confianza y conversión (Alta)
1. Reescribir hero (rol, métricas, CTA, ortografía)
2. Reordenar home y acercar CTA
3. Migrar Classgap a tokens
4. Corregir rutas de imágenes en experiencia
5. Reformatear experiencia + proyectos como casos de impacto
6. Segmentar servicios (empresas vs profesionales)

### Fase 2 — Consistencia visual (Media)
7. Unificar headers con eyebrow
8. Estandarizar espaciado y contenedores
9. Testimonios + logos de clientes
10. Footer y formulario (labels, alerts shadcn)
11. Reducir redundancia de métricas

### Fase 3 — Pulido (Baja)
12. Animaciones hover proyectos
13. Blog/videos headers alineados
14. Calendly/colores/metadata menores

---

## 8. Conclusión

El sitio **ya tiene infraestructura de design system** suficiente para verse premium, pero **el contenido y la arquitectura de información están optimizados para estudiantes**, no para la audiencia principal definida en las reglas (recruiters, founders, CTOs). Las mayores ganancias no requieren rehacer el stack: requieren **reordenar la narrativa**, **unificar patrones visuales** y **elevar la prueba social técnica** (Meniuz, charlas, casos de producto) sobre la prueba social educativa.

---

*Documento generado como auditoría estática del código y componentes. Validar hallazgos de imágenes rotas y comportamiento mobile con prueba en navegador antes de implementar.*
