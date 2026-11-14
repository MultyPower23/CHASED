# Chased — Chasing Your Style 🏃‍♂️

Prototipo web para **Chased_med**, marca de ropa oversize de Medellín, creado para el reto **"Chasing Your Style"** de la **Expo InnvEm 2026**.

> La idea en una línea: una página donde comprar ropa oversize sea **cómodo** y donde el cliente sienta que hace **parte de una comunidad**, con quiz de estilo, insignias, concursos de baile, diseños votados y un closet virtual.

---

## Ficha rápida (para la hoja de vida)

| | |
|---|---|
| **Proyecto** | Prototipo web de e-commerce con enfoque de comunidad para Chased_med |
| **Evento** | Expo InnvEm 2026 · Línea Creadores · Reto 2 "Chasing Your Style" |
| **Lugar y fecha** | Colegio UPB Marinilla (grado 10°1) · viernes 13 de noviembre de 2026 |
| **Docente** | Juan Guillermo Osorio Patiño |
| **Mi rol** | Desarrollo de la página web (diseño de la experiencia, front-end y lógica del prototipo) |
| **Equipo** | Juan Esteban Ciro Gallego (web) · Sebastián Hernández Muñoz · Simón Andrés Páez Villalobos (marketing y demás responsabilidades) |
| **Tecnologías** | HTML5, CSS3, JavaScript (módulos ES), `localStorage`, Anime.js, Git/GitHub, VS Code |
| **Resultado** | Segundo lugar entre los dos equipos del reto. Prototipo funcional de 8 páginas, con catálogo de 23 productos y modo demo. Lo más destacado: el avatar del closet virtual |

### Frases listas para copiar

- Desarrollé el prototipo web de una marca de ropa oversize de Medellín (Chased_med) para la Expo InnvEm 2026, con catálogo dinámico, quiz de estilo, sistema de insignias y descuentos, concurso de comunidad y closet virtual.
- Diseñé la solución a partir del problema real de la marca: vendía por Instagram y WhatsApp, y propuse pasar de "solo vender" a **crear comunidad**.
- Construí un sitio multipágina de ~9.000 líneas en HTML, CSS y JavaScript puro, sin frameworks ni backend, respetando al 100 % el manual de marca (paleta, tipografías y logo).
- Implementé un recomendador "Para ti" basado en el quiz y en las compras, con un porcentaje de variedad inspirado en los algoritmos de recomendación de redes sociales.
- Presenté la solución en la Expo InnvEm 2026 con demo en vivo y obtuve el segundo lugar entre los equipos del reto, con retroalimentación directa de la marca sobre cómo pulir la propuesta.

---

## El reto

**Chased_med** es una empresa emergente de ropa **oversize / streetwear** con presencia en Medellín y el Valle de Aburrá. Su diferencial es la atención cercana y personalizada. Hoy vende por **Instagram (@chased_med) con link a WhatsApp**.

La guía del reto planteaba problemas como: a la gente le cuesta saber qué prendas van con su estilo, asesorar uno a uno no escala, el cliente quiere explorar y combinar antes de comprar, hacen falta datos de preferencias y experiencias que fidelicen.

**Lo que pidió el jefe de la marca:** crecer y ganar visibilidad.

**Lo que concluimos como equipo:** más que visibilidad, la marca necesita **crear comunidad**: clientes que sientan que hacen parte de algo y que se queden.

## Nuestra solución

Una estrategia de comunidad en dos frentes:

1. **Marketing:** campañas en redes y eventos como **concursos de baile**. La ropa oversize es cómoda y la usan mucho los bailarines, y el baile es una tendencia en crecimiento.
2. **Página web (este repo):** el "anzuelo" que engancha a quienes llegan por las campañas y los mantiene dentro de la comunidad. **Los pedidos se manejan dentro de la página, no por WhatsApp.**

Prioridades del diseño: **comodidad para el cliente** y **sentido de pertenencia**.

## Qué tiene

| Página | Qué hace |
|---|---|
| **Inicio** | Frase motivacional, destacados, concurso activo e invitación al quiz |
| **Catálogo** | 23 productos con filtros (tipo, color, talla, género), orden y recomendaciones "Para ti" con un toque de variedad |
| **Carrito** | Pedido dentro de la página, con descuento por insignia y estado del pedido |
| **Perfil** | Datos, estilo del quiz, insignia y progreso, pedidos, cupones y closet |
| **Quiz** | "Queremos conocerte": opcional, sin preguntas invasivas (nada de peso ni altura) y repetible |
| **Comunidad** | Concurso de baile, postulación de diseños, votos (3 por persona) y outfits publicados |
| **Mi closet** | Vestidor con avatar, casillas por tipo de prenda, combinaciones, conjuntos guardados y "escanear" el QR de la caja (simulado). Es una versión beta de lo que sería con IA |
| **Demo** | Cargar datos de ejemplo y reiniciar todo, para la presentación y las pruebas |

### Cómo funcionan las piezas clave

- **Registro simulado:** no aparece de primeras; se pide solo al comprar, votar, inscribirse o publicar.
- **Insignias:** el nivel sube según las prendas compradas (Rookie → Runner → Chaser → Leyenda Chased). Subir de nivel da un cupón de descuento con vencimiento.
- **Recomendador "Para ti":** cada producto tiene tags de estilo (minimal, urbano, comfy, flow). Se suman puntos por coincidir con el resultado del quiz y con las compras recientes. La lista final mezcla lo de mayor puntaje con algunas prendas distintas ("Descubre algo distinto"), al estilo del algoritmo de TikTok.
- **Comunidad:** el concurso de baile y la votación de diseños sostienen la idea de "no solo vender". El premio propuesto son prendas exclusivas y, para el diseño ganador, su propia camiseta.

## Decisiones técnicas

- **HTML, CSS y JavaScript puro** con módulos ES. Sitio de varias páginas, sin frameworks, sin bundlers y sin backend.
- **Datos simulados en `localStorage`**, con una sola puerta de acceso (`js/storage.js`).
- **Mobile-first**, porque la gente llega desde Instagram en el celular, pero pensado para verse bien en computador en la demo.
- **Todos los textos** en `js/textos.js` y **todos los productos** en `js/data/productos.js`, para cambiarlos sin tocar la lógica.
- **Manual de marca intacto:** solo negro, blanco y grises (`#000000`, `#FFFFFF`, `#4F4F4F`, `#787878`, `#D9D9D9`), tipografías **Corbel** y **Libre Baskerville** (esta última local en `assets/fonts/`, para que funcione sin internet) y logo oficial sin modificaciones.
- **Anime.js** copiado en `js/vendor/` (no por CDN) para las animaciones, respetando la preferencia de "reducir movimiento" del sistema.
- **Auditoría antes de la presentación:** revisé el sitio en celular y PC, y corregí errores de la lista (modal en celular, botón atrás, fuentes locales, estado del pedido, orden del inicio, entre otros).

## Cómo se construyó

- Planeación por fases con prioridad (base y compra → perfil/quiz/insignias → comunidad → closet → pulido → pruebas), recortando desde el final si no alcanzaba el tiempo.
- Trabajo en **Git y GitHub** con ramas y pull requests.
- Desarrollo apoyado con **Claude Code**, con un `CLAUDE.md` que fija las reglas del proyecto (stack, manual de marca y no inventar datos del negocio).

## Cómo correrlo

1. Clona el repo y ábrelo en **VS Code**.
2. Instala la extensión **Live Server**.
3. Clic derecho en `index.html` → **Open with Live Server**.

No hay que instalar nada más. (Abrirlo con doble clic no funciona: los módulos ES necesitan un servidor.)

### Modo demo
Abre `demo.html` (también hay un link discreto "Modo demo" en el footer):
- **Cargar datos de ejemplo:** crea una usuaria con quiz, pedidos (insignia Runner), un descuento disponible, una caja escaneada, un conjunto publicado y un voto.
- **Reiniciar todo:** borra lo guardado para que alguien pruebe desde cero.

## Dónde cambiar cosas
- **Textos y frases:** `js/textos.js`
- **Productos, precios e insignias:** `js/data/productos.js`
- **Colores y fuentes:** variables en `css/styles.css` (siempre según el manual de marca)

## Lo que es de ejemplo (y lo que falta)

Para ser claros con los datos de la marca:
- Los **precios** son referenciales, salvo las camisetas ($65.000 COP según su WhatsApp). Las **tallas**, el **porcentaje de descuento** y los **premios y fechas del concurso** están por confirmar con Chased.
- Los participantes, votos y diseños de la comunidad son **de ejemplo**.
- Las fotos de producto salen del Instagram de @chased_med.

**Proyección de implementación** (lo que no entra en un prototipo): backend y base de datos reales, pagos y envíos reales, IA para el maniquí y las recomendaciones, y un panel para que la marca vea pedidos, estilos más comunes y diseños más votados.

## Resultado en la Expo

- **Presentación:** viernes 13 de noviembre de 2026, con diapositivas y demo en vivo de la página.
- **Puesto:** segundo lugar entre los dos equipos que trabajaron con Chased_med. No hubo premio.
- **Lo que más gustó:** el **avatar** del closet virtual.
- **Retroalimentación recibida:** llevar las ideas más pulidas y completas; el prototipo se sintió todavía "verde".
- **Pruebas con usuarios:** informales, con unos 3 amigos, que dijeron que la página les pareció muy chévere y bonita. No alcanzaron para un análisis formal (la guía completa quedó en `docs/PRUEBAS.md`).

### Qué aprendí / qué mejoraría
- Probar con más personas y registrar los resultados antes de presentar, para tener evidencia real de validación.
- Pulir menos funciones y dejarlas más completas, en vez de abarcar mucho en poco tiempo.
- Apostar por lo que mejor funcionó (el avatar y el closet virtual) como parte central de la propuesta.
- Cerrar con la marca los datos pendientes (precios, tallas, fechas y premios del concurso) antes de la demo.

## Documentación
- `docs/CONTEXTO.md`: contexto del reto, la empresa y las decisiones
- `docs/PLAN.md`: plan de trabajo por fases
- `docs/PRUEBAS.md`: guía y tabla para las pruebas con usuarios
- `CLAUDE.md`: reglas para trabajar con Claude Code

---
Prototipo académico. Fotos de producto tomadas del Instagram de [@chased_med](https://www.instagram.com/chased_med/).
