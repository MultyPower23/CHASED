# CLAUDE.md — Reglas para trabajar en este repo

Prototipo web de **Chased_med** para la Expo InnvEm 2026 (se presenta el **viernes 13/nov/2026**).
Antes de hacer cualquier cosa, lee `docs/CONTEXTO.md` (todo el contexto) y `docs/PLAN.md` (orden de trabajo).

## Quién trabaja aquí
- Multy (Juan Esteban Ciro): estudiante de técnica en programación, usa VS Code y GitHub.
- Háblale **en español**, con tono relajado, como un compañero, sin sonar a manual técnico.
- Antes de un cambio grande, explica en 2 o 3 líneas qué vas a hacer y por qué.
- Hay poco tiempo (unas 2–3 horas de código), así que prioriza que **funcione y se vea bien** sobre que quede perfecto.

## Stack (no cambiar)
- **HTML, CSS y JavaScript puro**, con módulos ES (`<script type="module">`). Nada de frameworks, bundlers, npm ni backend.
- Es un sitio **de varias páginas** (un `.html` por sección) y se corre con **Live Server** en VS Code.
- **Datos simulados en `localStorage`**: todo el acceso pasa por `js/storage.js`, nada de `localStorage` regado por el código.
- **Mobile-first**: la gente entra desde Instagram en el celular, pero tiene que verse bien en el computador para la demo.

## Reglas de oro
1. **Todo texto visible va en `js/textos.js`**: frases motivacionales, botones, títulos, mensajes, preguntas del quiz, nombres de insignias. En el HTML y el JS no se escriben textos "quemados", se leen de `TEXTOS`.
2. **Los productos van en `js/data/productos.js`**: no se duplican datos en otros archivos.
3. **No se inventan datos de negocio**: precios, tallas, porcentajes de descuento, fechas y premios. Si hace falta uno, se usa el valor marcado en los archivos de datos o de textos con `// TODO confirmar`, y en la interfaz se muestra como "referencial".
4. **Manual de marca intocable:**
   - Colores: solo `#000000`, `#FFFFFF`, `#4F4F4F`, `#787878` y `#D9D9D9`, definidos como variables CSS en `:root`.
   - Tipografías: `Libre Baskerville` (de Google Fonts) para títulos y `Corbel` para textos, con respaldo `Corbel, Candara, "Segoe UI", sans-serif`.
   - Logo: se usa la imagen de `assets/logo/`, nunca se recrea con texto ni con CSS. Prohibido rotarlo, deformarlo, recolorearlo o ponerle sombras o efectos. Siempre con aire alrededor.
   - Estética **minimalista**: mucho espacio en blanco, nada saturado, sin efectos exagerados.
5. **El registro no aparece de primeras.** Está en el header y se pide solo al comprar, encargar, votar o publicar.
6. **El quiz es opcional y no invasivo**: nada de peso, altura ni temas polémicos, y se puede repetir desde el perfil.
7. **No hay botón de WhatsApp**: los pedidos se manejan dentro de la página. En el footer sí van los links a Instagram (@chased_med).
8. Si falta una foto, se muestra un placeholder gris (`#D9D9D9`) con el nombre del producto, para que nada se rompa.

## Estilo de código
- Comentarios **casuales y sencillos**, que expliquen el **por qué** y no solo el qué. Cuando ayude, usa analogías, por ejemplo: "el localStorage es como la mochila del navegador: guarda cosas aunque cierres la página".
- Funciones cortas y con nombres en español (`renderCatalogo`, `agregarAlCarrito`).
- Un archivo JS por página (`js/catalogo.js`, `js/perfil.js`…) más los compartidos (`app.js`, `storage.js`, `textos.js`, `recomendador.js`).
- Nada de librerías externas, salvo Google Fonts.

## Git
- Haz un commit al terminar cada fase del plan, con mensajes cortos en español, por ejemplo `feat: catálogo con filtros`.
- Antes de pasar a la siguiente fase, avisa y deja que Multy pruebe.

## Si algo no está claro
Pregunta. No asumas funcionalidades nuevas ni cambies decisiones de `docs/CONTEXTO.md` sin preguntar.
