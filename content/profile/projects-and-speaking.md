# Projects & speaking — Andres Coello

Fuente de verdad para productos propios, mentoría a startups y actividad como speaker/voluntariado técnico.
Usar solo cuando aporte evidencia concreta a una vacante o pregunta. No inventar métricas ni roles no listados aquí.

Cada proyecto implica **industria + aprendizajes técnicos** reutilizables al redactar correos o responder reclutadores (solo con hechos de este archivo y los CVs).

## Productos / startups / clientes

### Tayos (DevLokos) — industria automotriz / aftermarket
- Plataforma digital para un negocio de **repuestos automotrices**.
- **Odoo** como única fuente de verdad del negocio (inventario, precios, catálogo base).
- **Backend for Frontend (BFF)** con API REST (Fastify) que conecta Odoo con:
  - App móvil **React Native + Expo**
  - Web **Next.js**
- **MongoDB** para características y flujos que Odoo no cubre de forma nativa, sin romper la integridad de Odoo.
- **Integración event-driven con webhooks de Odoo** (además de REST):
  - Odoo notifica a nuestra API **qué cambió y cuándo** (p.ej. órdenes de venta).
  - El BFF ejecuta lógica de negocio y **notifica a clientes** en web y apps móviles.
  - Evita **polling** continuo a Odoo: más óptimo, escalable y mantenible.
  - Refuerza el BFF como capa de orquestación entre ERP y canales de cliente.
- **Asistentes de IA** con **Gemini** (LLM de pago, modelo compacto para razonar) sobre manuales y documentación técnica de productos automotrices.
- **Arquitectura RAG**:
  - Subida de documentos: Markdown, PDF, Word, Excel.
  - Procesamiento asíncrono con **workers**.
  - Indexación en **Qdrant**, seccionando el documento por fragmentos.
  - Si el PDF trae imágenes, diagramas o ilustraciones: intervención de LLM para **describir y razonar** el contenido visual (no se “responde con la imagen”; se extrae el conocimiento técnico).
  - El chat responde **solo desde el corpus RAG** (no inventa, no busca en internet).
- Ejemplo de consulta real: medida de rosca de un filtro de aceite para un Aveo Family 2015.
- **Aprendizajes / señales de industria:** aftermarket automotriz, integración ERP (Odoo), BFF, webhooks event-driven vs polling, mobile (Expo), RAG productivo, embeddings, Qdrant, workers, grounding de LLM.

### TechLocos — e-commerce modular (MVP) · 2026
- Cliente/empresa: **TechLocos**.
- E-commerce pensado para **escalar**: arquitectura **hexagonal** + **monolito modular** con **NestJS** y **TypeScript**.
- MVP para validar producto; dominio desacoplado para poder **migrar a otra nube** más adelante sin reescribir el core.
- **Backend** desplegado en **Railway**, incluyendo servicios de **mensajería de correo**.
- **Back office** (dueños / empleados): SPA en **React** — categorías, subcategorías, productos e imágenes.
- **Storefront público** (cliente): **Next.js** por SEO y renderizado.
- Imágenes en **Cloudflare** (almacenamiento).
- Pagos con **Payphone** (integración).
- Construcción **Spec-Driven** con IA (Cursor): PRD, specs, tests, reglas, contexto y agentes; buenas prácticas de punta a punta.
- **Aprendizajes / señales de industria:** e-commerce, catálogo/admin, SEO storefront, pasarela de pagos (Ecuador), hexagonal architecture, modular monolith, Railway, Cloudflare, Spec-Driven / AI-assisted delivery.

### La Casa del Turbo (TechLocos) — automotriz / turbos · 2026 · desplegado
- Comercio que vende **turbos** según marca/motor del vehículo.
- Problema: operación completa en **Excel** / hojas de cálculo (propensa a errores y difícil de escalar).
- Solución: sistema a medida, modular y sistemático (módulos reutilizables, buenas prácticas).
- **Migración de datos** desde Excel existente para no empezar de cero.
- **Usuarios, roles** y **cálculos** de negocio requeridos.
- **Facturación electrónica SRI** (Ecuador) vía **proveedor externo**: integración de su API (documentada en Swagger) con la API propia para **factura, comprobante y nota de crédito**.
- Valor: sacar a pequeños negocios del “solo Excel” hacia un **sistema real**, a medida (ni más ni menos de lo que necesitan).
- **Aprendizajes / señales de industria:** aftermarket turbos/automotriz, digitalización de PyME, migración Excel → app, RBAC, facturación electrónica SRI, Swagger/OpenAPI, APIs de terceros, sistemas a medida.

### Meniuz — industria gastronómica
- Ayuda en la toma de decisiones gastronómicas en ciudades de Ecuador.
- Recopila una gran base de datos de menús de restaurantes, cafeterías, heladerías y licorerías reconocidas en distintas ciudades.
- Analiza puntos destacados de cada establecimiento y recomienda lugares mediante lenguaje natural interpretado con IA.
- SaaS multi-tenant que procesa operaciones de más de 1000 establecimientos activos (evolución de MVP a producto).
- Forma parte de las startups que necesitan impulso: mentorías personalizadas para hacerse más conocidas, conseguir primeros clientes, y crecer con sostenibilidad tecnológica.
- **Aprendizajes / señales de industria:** foodtech, multi-tenant, recomendaciones con IA, operaciones de restaurantes, OCR, embeddings.

### Padel Track — industria deportiva / fitness
- Entrena con programas 100% personalizados, diseñados por entrenadores reales según nivel y objetivos.
- Center Coach: análisis en juego de encuentros; aciertos y errores de partidos amistosos o de torneo; resumen del coach para convertir datos en mejoras concretas.
- Más que una app: aliado para entrenar con método, jugar con estrategia y progresar en cada punto.
- **Aprendizajes / señales de industria:** sports tech, suscripciones, contenido de video, experiencia coach–jugador.

## Speaking / voluntariado técnico (reciente y continuo)

### TsáchiTalk #21 — GDG Santo Domingo de los Tsáchilas (2026) · online · ~1 h
- Invitado por **Google Developer Groups (GDG) Tsáchilas** (Santo Domingo), modalidad **online**.
- Charla educativa (~1 hora): **Embeddings, LLMs y Qdrant** — cómo las aplicaciones entienden el **significado / la intención** de lo que preguntamos (no solo palabras exactas). Uniendo estos tres pilares se construye un **RAG**.
- Contenido abordado:
  - Representación vectorial: por qué importa y operaciones matemáticas detrás de los embeddings.
  - Visión espacial (p.ej. 2D): cercanía entre palabras/conceptos.
  - **Búsqueda tradicional vs búsqueda por significado**: no son rivales; se usan en situaciones distintas (exactitud vs intención).
  - **Qdrant** como base de datos **100% vectorial** vs bases mixtas que pueden guardar vectores pero no están diseñadas igual para semántica.
  - Caso práctico: **asistente inteligente automotriz** (qué comprar, cómo usar/instalar) respondiendo desde contexto RAG, sin inventar ni depender solo de un humano para cada consulta.
- Video (YouTube): [Embeddings y Búsqueda Semántica con LLMs y Qdrant | TsáchilTalks #021](https://www.youtube.com/watch?v=-ma95I0r7XI)
- Resumen en el sitio: [`/videos/embeddings-busqueda-semantica-llm-qdrant`](/videos/embeddings-busqueda-semantica-llm-qdrant)
- Artículo: [`/blog/embeddings-busqueda-semantica-llm-qdrant`](/blog/embeddings-busqueda-semantica-llm-qdrant)
- Evento: [TsáchiTalk #21](https://gdg.community.dev/events/details/google-gdg-santo-domingo-de-los-tsachilas-presents-tsachitalk-21-embeddings-y-busqueda-semantica-con-llms-y-qdrant/).
- **Señal para apply/interview:** speaker comunitario en IA aplicada (embeddings, LLM, vector DB, RAG); enseña conceptos difíciles con caso de producto real (asistente automotriz / Tayos).
### Pitch Meniuz — sistema operativo de la gastronomía (2026)
- Video pitch: qué hace Meniuz, cómo funciona y hacia dónde apunta.
- Partners, establecimientos gastronómicos y público general para descubrir y fidelizarse.
- Ver resumen en `/videos/meniuz-pitch-sistema-operativo-gastronomia`.

### Speaker — Universidad Estatal de Milagro
- Charla sobre cómo Meniuz transforma la gastronomía en Ecuador, experiencia de calidad para usuarios y turistas, y apoyo a establecimientos con buen servicio y mejores procesos internos.

### Charla virtual — IEEE ESPOL Student Branch
- Desarrollo web para quienes empiezan en el área.
- Evolución del desarrollo web en las últimas décadas.
- Cómo usar la IA a favor del desarrollador, no como reemplazo.

### PerfOps & SecArchitect — Pawify
- Identificación de problemas críticos de seguridad, rendimiento y tiempo de respuesta al usuario.
- Comunicación efectiva entre Frontend y Backend.
- Uso de la IA como guía/ayuda, no como reemplazo de developers.

### Speaker — Google Developer Groups (DevFest y capítulos)
- DevFest: evento anual de conocimiento, experiencia y networking.
- Invitado en 2025 para taller de Meteor.js.
- Invitado desde 2023 con charlas/talleres: Embedding, LLM, Qdrant, DevTools, entre otros.
- Continuidad en 2026 con TsáchiTalk sobre embeddings + Qdrant (arriba).

### Orador invitado — Codings Academy
- Webinar gratuito de front-end con React: qué es, cómo funciona y por qué aprenderlo, con ejemplos de la vida real.
- También mentoría / bootcamp Front-end (grupos +40 estudiantes; React + API Flask + Vercel).

### Orador invitado — Platzi Live
- “Cómo trabajar de full stack developer en la industria de videojuegos”.
- Audiencia de +300 personas.
- Día a día como desarrollador de plataformas de videojuegos sport en Madrid, España.

### Docencia reciente (ver también CV education)
- **Crack The Code** (2026): IA + ciclo de vida de software; embeddings, context window, Cursor, agentes, LLM, RAG, prompts, Qdrant.
- **ClassGap** (desde 2023): mentoría internacional; formar pensamiento de ingeniero senior.
- **Codings Academy** (2025): bootcamp Front-end práctico.
