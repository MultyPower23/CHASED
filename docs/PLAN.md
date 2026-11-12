# Plan de trabajo — Página web Chased_med

**Tiempo real de código: unas 2–3 horas** (hoy jueves 12/nov). La presentación es el viernes 13/nov.
La regla es simple: si el tiempo no alcanza, se recorta desde el final del plan, nunca desde el principio.

## Estructura del sitio (varias páginas)

```
chased-web/
├── index.html          → Inicio: frase motivacional, destacados, evento activo, invitación al quiz
├── catalogo.html       → Catálogo: filtros, orden, sección "Para ti" y detalle de producto (modal)
├── carrito.html        → Carrito y confirmación de pedido (aquí se pide el registro si no lo hay)
├── perfil.html         → Registro/login simulado, datos, estilo del quiz, insignia, pedidos y closet
├── quiz.html           → Quiz "Queremos conocerte" (opcional y repetible)
├── comunidad.html      → Concurso de baile, postulación de diseños, votos y outfits publicados
├── maniqui.html        → Closet y maniquí virtual (BOCETO o versión beta)
├── css/
│   └── styles.css      → Variables de marca, base mobile-first y componentes
├── js/
│   ├── textos.js       → TODO el texto de la página (diccionario editable)
│   ├── storage.js      → Única puerta al localStorage (usuario, carrito, pedidos, votos, outfits)
│   ├── app.js          → Header y footer compartidos, frase del día, contador del carrito, modal de registro
│   ├── recomendador.js → Algoritmo "Para ti" (quiz + compras + algo de variedad)
│   ├── catalogo.js · carrito.js · perfil.js · quiz.js · comunidad.js · maniqui.js
│   └── data/
│       └── productos.js → Catálogo (de las fotos de Instagram)
├── assets/
│   ├── logo/           → PNG oficiales del manual (horizontal, vertical, símbolo)
│   └── img/{productos,eventos,comunidad}/
└── docs/               → Contexto, plan, prompt inicial y guía de pruebas
```

## Cómo funcionan las piezas clave

**Insignias.** Se cuentan las prendas compradas (la suma de cantidades en todos los pedidos). Cada 4 prendas se sube de nivel, y al subir se gana un descuento que se aplica solo en la **siguiente** compra. Los nombres de los niveles y el porcentaje están en `textos.js` y en la configuración, marcados como `TODO confirmar`.

**Recomendador "Para ti".**
1. Cada producto tiene `tags` de estilo (minimal, urbano, comfy, flow).
2. Se le da un puntaje a cada producto: +2 por cada tag que coincide con el resultado del quiz y +1 por cada tag que coincide con lo comprado recientemente.
3. La lista final es **80% lo de mayor puntaje y 20% productos al azar con puntaje bajo**, marcados como "Descubre algo distinto" (la idea es parecida al algoritmo de TikTok).
4. Si la persona no tiene quiz ni compras, se muestran los destacados.

**Registro.** Es simulado: nombre, correo y foto opcional, guardados en `localStorage`. Se abre como modal desde el header o al momento de comprar, votar, inscribirse o publicar.

## Fases

### Fase 0 — Preparación (10 min, antes de abrir Claude Code)
- [ ] Crear el repo en GitHub y clonarlo. Copiar este kit adentro.
- [x] Fotos de producto, comunidad y novedades: ya vienen en el kit (recortadas de Instagram).
- [x] Logos del manual con espacio de respeto: ya vienen en `assets/logo/`.
- [ ] Instalar la extensión Live Server en VS Code, si no la tienes.

### Fase 1 — Base y compra (≈45 min) 🔴 obligatoria
- [ ] `styles.css` con variables de marca, tipografías, header y footer.
- [ ] `storage.js` y `app.js` (header con logo, menú, botón "Regístrate", contador del carrito; footer con Instagram).
- [ ] **Inicio**: frase motivacional aleatoria tomada de `textos.js`, productos destacados, banner del evento y botón opcional al quiz.
- [ ] **Catálogo**: tarjetas, filtros (tipo, color, talla, género), orden por precio y modal de detalle con talla y "Agregar".
- [ ] **Carrito y pedido**: si no hay registro se pide en ese momento; el pedido queda guardado y aparece un mensaje de confirmación.
- 💾 Commit: `feat: base, catálogo y pedidos`

### Fase 2 — Perfil, quiz e insignias (≈40 min) 🔴 obligatoria
- [ ] **Quiz** de 5 preguntas sacadas de `textos.js`, con resultado de estilo y botones de "repetir" o "saltar".
- [ ] **Perfil**: datos, estilo, insignia con barra de progreso ("te faltan X prendas"), historial de pedidos y descuento disponible.
- [ ] **"Para ti"** en el catálogo usando `recomendador.js`.
- 💾 Commit: `feat: perfil, quiz e insignias`

### Fase 3 — Comunidad (≈40 min) 🟠 muy importante (es el corazón de la propuesta)
- [ ] **Concurso de baile**: información, inscripción, galería de eventos pasados, participantes con votos (uno por usuario) y llamado a etiquetar a @chased_med.
- [ ] **Postulación de diseños**: formulario con vista previa de la imagen, lista de diseños, votos y explicación del premio (insignia, descuento y su propia camiseta).
- [ ] **Outfits de la comunidad** (los publicados desde el maniquí).
- 💾 Commit: `feat: comunidad`

### Fase 4 — Closet y maniquí (≈20–30 min) 🟡 boceto
- [ ] **Closet**: prendas compradas más las que la persona agregue a mano.
- [ ] **Maniquí**: casillas de arriba, abajo y extra; se escoge una prenda del closet o del catálogo y se ven apiladas.
- [ ] Botón **"Armar por mí"**: arma un conjunto sencillo con el closet y lo completa con prendas de la marca.
- [ ] Botón **"Publicar outfit"**, que lo envía a Comunidad.
- [ ] Etiqueta visible de "Versión beta: así funcionará con IA".
- 💾 Commit: `feat: maniquí boceto`

### Fase 5 — Pulido para la demo (15 min)
- [ ] Revisar en celular (DevTools) y en el computador.
- [ ] Botón oculto o página para **cargar datos de ejemplo** (usuario, pedidos, votos) y otro para **reiniciar**, para que la demo arranque bonita.

### Fase 6 — Pruebas con usuarios (hoy en la tarde o mañana temprano) 🔴 lo pide la rúbrica
- Seguir `docs/PRUEBAS.md`. Con **5 a 10 personas** basta. Hay que anotar todo y tomar fotos como evidencia.

## Qué sí y qué no para la demo
- ✅ Que se pueda hacer el recorrido completo: llegar → ver frase → explorar catálogo → (quiz opcional) → comprar → ver la insignia subir → votar en comunidad.
- ✅ Que el maniquí se vea como un boceto creíble de lo que viene.
- ❌ Backend real, pagos reales, IA real o Google Sheets: quedan como **"proyección de implementación"** en la presentación.
