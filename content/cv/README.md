# CV text for Gemini (Apply assistant)

Plain-text exports of the PDFs in `public/pdf/`.

Used at runtime instead of `pdf-parse` so Vercel serverless does not need canvas/`DOMMatrix`.

| Key | Text | PDF attachment |
|-----|------|----------------|
| software | `software.txt` | `Andres_Coello_Goyes_full_stack_developer_2026.pdf` |
| education | `education.txt` | `Andres_Coello_Goyes_educator_full_stack_developer_2026.pdf` |

When you update a PDF, refresh the matching `.txt` (copy/paste or a local extract script) and redeploy.
