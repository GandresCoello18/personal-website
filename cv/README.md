# CV software

Fuente Harvard del PDF que descarga el hero:

`/pdf/Andres_Coello_Goyes_full_stack_developer_2026.pdf`

No cambies el nombre ni la ruta pública: Andrés reutiliza ese link.

## Regenerar

```bash
# sobrescribe el PDF público (mismo filename)
node cv/build-software-cv.mjs

# o a otra ruta:
node cv/build-software-cv.mjs /tmp/Andres_Coello_Goyes_full_stack_developer_2026.pdf
```

Requiere Google Chrome o Chromium (`CHROME_PATH`) y las fuentes Liberation
(`fonts-liberation`). Comprueba ATS con:

```bash
pdftotext -layout public/pdf/Andres_Coello_Goyes_full_stack_developer_2026.pdf -
pdfinfo public/pdf/Andres_Coello_Goyes_full_stack_developer_2026.pdf
```

El CV docente (`Andres_Coello_Goyes_educator_full_stack_developer_2026.pdf`)
es otra ruta y no se toca desde aquí.
