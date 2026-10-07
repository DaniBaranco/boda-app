# Almu & Dani · Web de la boda

Web de la boda (3 de julio de 2027), pensada primero para móvil, interactiva y con usabilidad verificada automáticamente en todas las pantallas.

## Stack

- **[Astro](https://astro.build) + TypeScript**: genera HTML estático, sin framework en cliente. Solo se carga un poco de JS para la cuenta atrás, el scrollspy, la galería, el confeti y compartir.
- **CSS moderno sin librerías**: `light-dark()`, `@container`, animaciones ligadas al scroll, `popover`, `<details name>` y `scroll-snap`.
- **Imágenes optimizadas** con `astro:assets` (AVIF/WebP con respaldo JPG y tamaños responsive).
- **Confirmaciones con Google Forms**: no hace falta backend.
- **Despliegue en Vercel**.

## Scripts

```bash
npm install
npm run dev        # desarrollo en http://localhost:4321
npm run build      # build estático en dist/
npm run preview    # sirve dist/
npm run check      # tipos y diagnóstico de Astro
npm test           # tests unitarios (vitest)
npm run test:e2e   # usabilidad + accesibilidad (Playwright + axe) en 360, 390, 768 y 1280 px
```

Para sacar capturas de página completa en claro y oscuro (se guardan en `test-results/shots/`):

```powershell
$env:SHOTS='1'; npx playwright test -g captura
```

## Editar contenido

Todo el contenido está en [`src/data/wedding.ts`](src/data/wedding.ts): fechas, horarios, lugares, autobús, preboda, preguntas frecuentes, galería y contactos.

Antes de publicar, rellena:

- `formUrl`: URL del Google Form de confirmación. Mientras siga con el valor de ejemplo (`REEMPLAZAR…`), el botón aparece desactivado y muestra un aviso de "próximamente".
- `busFormUrl` (opcional): formulario aparte para el autobús. Si se deja vacío, se usa el general.
- `contacts`: teléfonos reales. Ahora mismo son de ejemplo.

## Qué verifican los tests e2e

En cada viewport (360, 390, 768 y 1280 px):

- No hay violaciones WCAG 2.2 AA (axe), ni en modo claro ni en oscuro.
- No hay scroll horizontal.
- Las áreas táctiles miden al menos 44×44 px.
- La navegación lleva a cada sección, la marca como activa y no tapa el contenido.
- La cuenta atrás, el menú de calendario (.ics), el acordeón de dudas y la galería funcionan.
- El CTA queda desactivado mientras no haya formulario.
- El favicon y el manifest existen.

## Despliegue

Vercel detecta Astro automáticamente: build `npm run build` y salida `dist`. Cada push a `main` se despliega solo.
