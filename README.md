# Portafolio Personal - Andres Coello

Portafolio de **Andrés Coello Goyes — Backend Engineer**. APIs y plataformas SaaS en Node.js, TypeScript, NestJS, PostgreSQL, AWS y LLM/RAG.

<img width="1005" height="483" alt="image" src="https://github.com/user-attachments/assets/61131f8e-cf87-44bd-b92a-4e7a324bba9f" />

## Propósito

Este sitio web sirve como:

- **Portafolio profesional**: experiencia, proyectos y stack backend
- **Plataforma de servicios**: consultoría, desarrollo y docencia
- **Punto de contacto**: para empresas, reclutadores y estudiantes

## Mentoría

La página `/mentoria` (fuera del menú principal) reúne clases, precios, testimonios y pagos. El menú principal es Sobre mí · Experiencia · Proyectos · Escritos · Contacto. `/sobre-mi` resume hechos de identidad para buscadores y motores de IA.

## Tecnologías

- **Framework**: Next.js 16
- **UI**: React 19, Tailwind CSS
- **TypeScript**: Para type safety
- **Deployment**: Vercel
- **Gestor de paquetes**: pnpm (Node ≥ 22.6)

## Variables de entorno

Copia `.env.example` a `.env.local`. En Vercel (Production y Preview) hay que definir al menos:

| Variable                                              | Obligatoria        | Cómo generarla / de dónde sale                                                                                         |
| ----------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `APPLY_ACCESS_SECRET`                                 | Sí                 | Clave que escribes en `/apply`. `openssl rand -base64 32`                                                              |
| `APPLY_SESSION_SECRET`                                | Sí (nueva)         | Firma HMAC de la cookie de sesión. **Distinta** de la de acceso. `openssl rand -base64 32`                             |
| `GMAIL_USER`                                          | Sí                 | Cuenta Gmail que envía                                                                                                 |
| `GMAIL_APP_PASSWORD`                                  | Sí                 | App Password de Google                                                                                                 |
| `GMAIL_RECIPIENT`                                     | Sí                 | Buzón que recibe el formulario de contacto                                                                             |
| `GEMINI_API_KEY`                                      | Sí (para `/apply`) | Google AI Studio                                                                                                       |
| `GEMINI_MODEL` / `GEMINI_FALLBACK_MODELS`             | Opcional           | Solo IDs free-tier (ver abajo). Pro u otros se descartan. Default: `gemini-3.1-flash-lite` → `gemini-3.5-flash-lite`   |
| `BLOB_READ_WRITE_TOKEN`                               | Opcional           | Blob store de Vercel. Solo hace falta si una captura de vacante supera ~700 KB y hay que encolarla                     |
| `NEXT_PUBLIC_SITE_URL`                                | Recomendada        | `https://andrescoellog.com`                                                                                            |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`                | Opcional           | Token de Google Search Console (meta `google-site-verification`). Vacío: no se emite la etiqueta                       |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION`                  | Opcional           | Token de Bing Webmaster Tools (meta `msvalidate.01`). Vacío: no se emite la etiqueta                                   |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Sí (historial)     | Redis de Upstash creado a mano. Sin ellas `/apply` avisa «historial no disponible» y pide confirmación antes de enviar |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN`               | Respaldo           | Solo si Vercel Marketplace las inyecta. El código mira **UPSTASH primero**                                             |
| `RADAR_TIMEZONE`                                      | Opcional           | Por defecto `America/Guayaquil`                                                                                        |
| `TELEGRAM_BOT_TOKEN`                                  | Fase 2             | @BotFather                                                                                                             |
| `TELEGRAM_CHAT_ID`                                    | Fase 2             | `getUpdates` **antes** de registrar el webhook                                                                         |
| `TELEGRAM_WEBHOOK_SECRET`                             | Fase 2             | `openssl rand -hex 32`. Sin esto el webhook responde 503                                                               |
| `CASE_DRAFT_PREVIEW`                                  | No                 | `1` para ver bloques `TODO(Andrés)` de casos en un build de producción. No definir en la producción pública            |

Sin `APPLY_SESSION_SECRET` el desbloqueo de `/apply` falla cerrado. Tras rotar ese secreto hay que volver a entrar con la clave de acceso (la cookie anterior deja de valer).

El rate limit de contacto y de unlock sigue en memoria (best-effort por isolate). El historial de postulaciones y la cola de `/apply` usan Redis.

### Gemini (free tier)

`/apply` y `/interview` solo usan modelos de texto con free tier en [AI Studio](https://ai.google.dev/gemini-api/docs/pricing) (consultado 17 Oct 2026). El default sigue siendo `gemini-3.1-flash-lite`. Si `GEMINI_MODEL` o un fallback no está en la lista, se ignora.

| ID                       | Uso                  |
| ------------------------ | -------------------- |
| `gemini-3.1-flash-lite`  | Default              |
| `gemini-3.5-flash-lite`  | Fallback por defecto |
| `gemini-3.5-flash`       | Fallback opcional    |
| `gemini-3-flash-preview` | Fallback opcional    |
| `gemini-2.5-flash-lite`  | Fallback opcional    |
| `gemini-2.5-flash`       | Fallback opcional    |

Quedan fuera Pro, imagen, TTS, Live y embeddings.

### Cola de `/apply` (Gemini saturado)

Si analyze/draft agota los reintentos in-request (2 retries, ~1 s y ~3 s, con jitter y `Retry-After` tope 8 s) por 429/503/sobrecarga/red, el trabajo se guarda en Redis y se encola en el topic `apply-jobs`. La UI recibe **202** y muestra «En cola, se reintentará». El envío por Gmail sigue siendo manual.

Reintentos en cola: **+10 / +30 / +60 / +90 min** desde que se encoló (4 intentos). Al 4.º fallo o a un 4xx no reintentable: estado `failed` y Telegram. Si el borrador o el análisis termina en cola: Telegram con enlace a `/apply?job=…`.

**Qué tienes que hacer tú (el código no puede activarlo):**

1. **Vercel Queues** (beta pública, vale Hobby): desplegar este commit. El trigger vive en `vercel.json` (`app/api/queues/apply-jobs/route.ts` → topic `apply-jobs`). En el dashboard, Queues / Observability debe listar el topic tras el deploy. No hay env var extra en producción: el SDK usa OIDC de Vercel.
2. **Local:** `vercel link` y `vercel env pull` para el token OIDC. CLI reciente (`vercel dev` o `next dev` según [quickstart](https://vercel.com/docs/queues/quickstart)). Sin OIDC, `send()` falla: el job queda en Redis y la API responde 503 con el id.
3. **Telegram** (`TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`): es el canal de aviso de esta cola. Sin ellos, el job igual corre; el mensaje se omite.
4. **Blob** (`BLOB_READ_WRITE_TOKEN`): solo si vas a encolar capturas grandes. Crear un Blob store en el proyecto y pegar el token. Redis aguanta capturas chicas.

Cómo probar: vacante de texto en `/apply` con Gemini saturado (o `GEMINI_API_KEY` inválida no sirve: eso es 4xx y no se encola). Un 429/503 de verdad, o cortar red a mitad, debe devolver 202, listar el job y, si Queues está vivo, Telegram al terminar. `pnpm test` cubre clasificación de reintentos, backoff, saludo (`Hola Juan,` / `Hola equipo de {Empresa},`) y transiciones pending → running → ready/failed.

## Calidad

```bash
pnpm install
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm build
```

Requiere Node ≥ 22.6 (ver `.nvmrc`). El build no necesita secretos reales.

## Cursor (skills y reglas)

- **Impeccable** (Paul Bakaus, Apache 2.0): `.cursor/skills/impeccable` — oficio de UI/UX.
- **anti-slop** (Miqdad Badjuber, MIT, `antislop-ai@3.2.20`): `.cursor/skills/antislop*` — filtro de slop. Toda tarea de UI/UX usa Impeccable + anti-slop.
- Dirección visual: `DESIGN.md` (plano técnico). Stack y componentes vigentes: `.cursor/rules/design-system.md`.
- **Vercel React Best Practices** (MIT): `.cursor/skills/vercel-react-best-practices` — rendimiento de React/Next.js.
- Reglas: `.cursor/rules/ui-impeccable.mdc`, `.cursor/rules/ui-antislop.mdc` (UI/contenido) y `.cursor/rules/quality-gate.mdc` (lint/format/typecheck/test).

## 👨‍💻 Autores ✒️

- **Andrés Coello Goyes** - _SOFTWARE ENGINEER_ - [Andres Coello](https://linktr.ee/gandrescoello)

#### 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://andres-coello-goyes.vercel.app/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andrescoellogoyes/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/acoellogoyes)

## 🙏 Expresiones de Gratitud 🎁

- Pásate por mi perfil para ver algún otro proyecto 📢
- Desarrollemos alguna app juntos, puedes escribirme en mis redes
- Muchas gracias por pasarte por este proyecto 🤓

---

⌨️ con ❤️ por [Andres Coello Goyes](https://linktr.ee/gandrescoello) 😊

<img width="400" height="400" alt="1764558900283" src="https://github.com/user-attachments/assets/cde88968-7856-49ec-bdb1-53a82bf9caa3" />
