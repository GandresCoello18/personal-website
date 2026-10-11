# CV text for Gemini (Apply assistant)

Plain-text exports of the PDFs in `public/pdf/`.

Used at runtime instead of `pdf-parse` so Vercel serverless does not need canvas/`DOMMatrix`.

| Key | Text | PDF attachment |
|-----|------|----------------|
| software | `software.txt` | `Andres_Coello_Goyes_full_stack_developer_2026.pdf` |
| education | `education.txt` | `Andres_Coello_Goyes_educator_full_stack_developer_2026.pdf` |

El PDF adjunto se queda como está. El `.txt` es la fuente que leen `/apply` e `/interview` y está alineado con LinkedIn (títulos, fechas y métricas confirmadas).

Keep the `.txt` readable for Gemini: clear section headers, corrected Spanish spelling, consistent tech names (NestJS, GraphQL, Gemini, Supabase, etc.).
