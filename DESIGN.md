---
name: Andrés Coello — Backend Engineer
description: Plano técnico. Un diagrama isométrico de firma sobre navy, tipografía IBM Plex, un solo acento.
colors:
  navy: "#0d1d40"
  surface: "#0f2147"
  surface-raised: "#122754"
  cream: "#efe9dc"
  accent: "#5b7fd6"
  paper: "#f2efe8"
  ink: "#13264d"
  accent-light: "#2f5bd3"
typography:
  display:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, sans-serif"
    fontWeight: 500
    letterSpacing: "-0.02em"
  body:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontWeight: 400
---

# DESIGN.md — plano técnico

Dial: ENERGY 1 / RHYTHM 2 / MOTION 1

Dirección visual normativa del sitio. El CSS vigente todavía implementa teal + Geist; esta paleta y estas fuentes se aplican en la fase de estilo, no antes. Hasta entonces no cambies `globals.css` ni componentes para “parecerse” a este archivo.

Referencia de marca: banner de LinkedIn F (navy, diagrama isométrico Queue → Gateway → Services → Postgres, wordmark “Backend Engineer”).

## Overview

El sitio se lee como un **plano técnico**: fondo navy, líneas finas, marcas “+” en las esquinas y un solo diagrama isométrico/lineal. No es un portfolio SaaS con blobs ni un dark theme genérico. Es un dibujo de infraestructura — preciso, quieto, con mucho aire.

**The Blueprint Rule.** La cuadrícula y el diagrama de plano técnico **son la identidad de marca**. No son decoración de relleno. Anti-slop marca “Background Grid” / R-07 como slop cuando el grid no tiene propósito escrito; aquí el propósito está escrito: el plano técnico es el único elemento de firma, el resto de la página permanece en silencio. Esta excepción queda documentada para `.cursor/rules/ui-antislop.mdc` y para `.cursor/skills/antislop-ui`.

Un visitante (recruiter o hiring manager de backend) debe entender en el primer viewport: nombre, rol “Backend Engineer”, y que el trabajo es sistemas (colas, gateways, servicios, Postgres). El diagrama carga esa lectura; el copy no la explica de más.

## Colors

Tema por defecto: **oscuro navy**. El tema claro es opcional y usa papel crudo, no un invertido automático.

| Rol                | Oscuro (default) | Claro (opcional)  | Uso                                      |
| ------------------ | ---------------- | ----------------- | ---------------------------------------- |
| Fondo              | `#0d1d40`        | `#f2efe8`         | Página, canvas del plano                 |
| Superficie         | `#0f2147`        | `#f2efe8`         | Secciones, header                        |
| Superficie elevada | `#122754`        | papel + borde ink | Cards, paneles                           |
| Texto              | `#efe9dc`        | `#13264d`         | Cuerpo, títulos                          |
| Acento             | `#5b7fd6`        | `#2f5bd3`         | Un solo azul: trazos, foco, un highlight |

**The Stroke Accent Rule.** `#5b7fd6` sobre `#0d1d40` queda en ~4.5:1 (límite de texto pequeño). Si no cumple 4.5:1 en el tamaño real, el acento va **solo en trazos** (líneas del diagrama, marcas “+”, underline, focus ring), nunca en párrafos ni labels de 14px. El texto de lectura es crema sobre navy (~14:1). En claro, `#2f5bd3` sobre `#f2efe8` sí pasa 4.5:1 y puede usarse en texto pequeño.

No hay segundo acento. No hay teal, no hay cian, no hay degradados entre navy y azul.

## Typography

IBM Plex Sans para interfaz y lectura. IBM Plex Mono para años, stack, metadatos y cualquier etiqueta que en un plano iría acotada.

Jerarquía corta: un display contenido (peso 500, no black), un cuerpo regular, un mono para datos. Sin display decorativa, sin tracking extremo en títulos largos.

**The Plex Pair Rule.** Sans + Mono de la misma familia. No mezclar Geist, Inter ni una mono de sistema “porque ya está cargada”. El recableado de `next/font` es trabajo de la fase de estilo.

## Layout

Canvas ancho y calmado (`max-w-6xl` o equivalente). Secciones como láminas del plano: un borde fino, aire vertical generoso, ninguna lámina compitiendo con otra.

El diagrama de firma aparece **una vez** (hero o identidad). El resto de páginas puede repetir solo las marcas “+” y la línea de cota, no otro isométrico.

Responsive: el diagrama se simplifica o se recorta con intención; no se aplasta en una columna de 320px. Listas de experiencia en una columna en móvil; años en mono, alineados.

## Elevation & Depth

Plano. Cero. La profundidad es la del dibujo isométrico, no de sombras CSS.

Sin `shadow-lg`, sin glow, sin blur de blobs, sin glassmorphism. Un borde de 1px en el color de línea (crema atenuado u acento) separa superficies. El hover puede espesar el borde o cambiar el acento; no levanta la card.

## Shapes

Radios mínimos o nulos. El plano es ortogonal: rectángulos, líneas, cruces. Si un control necesita radio (botón, input), que sea pequeño y constante — no `rounded-xl` de marketing.

Marcas “+” en las esquinas de marcos y diagramas, como cotas de taller. Grosor de línea fino (1px), nunca trazo grueso “hero”.

## Components

No hay primitivos nuevos en esta fase. Cuando se aplique el estilo:

- Botón primario: relleno navy/ink, texto crema, borde 1px; hover = borde acento. Sin sombra.
- Botón secundario: solo borde.
- Card: superficie + borde fino; sin elevación.
- Diagrama: SVG lineal/isométrico, un color de trazo, labels en Plex Mono.
- Código del blog: Plex Mono sobre superficie, sin tema de terminal inventado.

Hasta la fase de estilo, los componentes vigentes (`btn-primary`, `card-elevated`, shadcn new-york) no se reescriben.

## Do's and Don'ts

**Do**

- Un solo diagrama de firma; el resto, tipografía y listas.
- Líneas finas, marcas “+”, labels en mono.
- Cifras y cargos que existan en LinkedIn u otra fuente citada.
- Tema navy por defecto; claro como alternativa de lectura.

**Don't**

- Degradados, brillos, sombras pesadas, blobs, mesh, noise de moda.
- Carruseles y marquees.
- Un segundo acento o una paleta “tech teal”.
- Tratar la cuadrícula del plano como slop o quitarla “para limpiar”.
- Contadores tipo “30+ proyectos”, pills Beta, terminales falsos, bento de relleno.
