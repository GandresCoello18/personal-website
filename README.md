# Portafolio Personal - Andres Coello

Portafolio web personal que presenta mis servicios como **Software Engineer, SRE, Mentor y Tutor**, especializado en desarrollo full-stack y enseñanza de programación.

<img width="1005" height="483" alt="image" src="https://github.com/user-attachments/assets/61131f8e-cf87-44bd-b92a-4e7a324bba9f" />

## Propósito

Este sitio web sirve como:

- **Portafolio profesional**: Muestra mi experiencia, proyectos y habilidades técnicas
- **Plataforma de servicios**: Ofrece mentoría personalizada, cursos, consultoría técnica y desarrollo de software
- **Punto de contacto**: Facilita la comunicación con estudiantes, clientes y colaboradores

## Servicios Ofrecidos

### Mentoría y Educación

- Mentoría 1-on-1 personalizada
- Cursos intensivos y bootcamps
- Consultoría técnica
- Workshops grupales

### Desarrollo de Software

- Aplicaciones web full-stack
- Desarrollo móvil multiplataforma (React Native/Flutter)
- Desarrollo móvil nativo (iOS/Android)

## Tecnologías

- **Framework**: Next.js 16
- **UI**: React 19, Tailwind CSS
- **TypeScript**: Para type safety
- **Deployment**: Vercel
- **Gestor de paquetes**: pnpm (Node ≥ 22.6)

## Variables de entorno

Copia `.env.example` a `.env.local`. En Vercel (Production y Preview) hay que definir al menos:

| Variable               | Obligatoria        | Cómo generarla / de dónde sale                                                             |
| ---------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `APPLY_ACCESS_SECRET`  | Sí                 | Clave que escribes en `/apply`. `openssl rand -base64 32`                                  |
| `APPLY_SESSION_SECRET` | Sí (nueva)         | Firma HMAC de la cookie de sesión. **Distinta** de la de acceso. `openssl rand -base64 32` |
| `GMAIL_USER`           | Sí                 | Cuenta Gmail que envía                                                                     |
| `GMAIL_APP_PASSWORD`   | Sí                 | App Password de Google                                                                     |
| `GMAIL_RECIPIENT`      | Sí                 | Buzón que recibe el formulario de contacto                                                 |
| `GEMINI_API_KEY`       | Sí (para `/apply`) | Google AI Studio                                                                           |
| `NEXT_PUBLIC_SITE_URL` | Recomendada        | `https://andrescoellog.com`                                                                |

Sin `APPLY_SESSION_SECRET` el desbloqueo de `/apply` falla cerrado. Tras rotar ese secreto hay que volver a entrar con la clave de acceso (la cookie anterior deja de valer).

El rate limit de contacto y de unlock es en memoria (best-effort en cada isolate de Vercel) hasta que exista Upstash Redis.

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
