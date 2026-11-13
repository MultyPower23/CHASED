# Chased — Chasing Your Style 🏃‍♂️

Prototipo web para **Chased_med**, marca de ropa oversize de Medellín.
Es un proyecto del reto **"Chasing Your Style"** para la **Expo InnvEm 2026** (Colegio UPB Marinilla, 10°1).

> La idea en una línea: una página donde comprar ropa oversize sea **cómodo** y donde el cliente sienta que hace **parte de una comunidad**, con quiz de estilo, insignias, concursos de baile, diseños votados y un closet virtual.

## Equipo
- Juan Esteban Ciro Gallego: página web
- Sebastián Hernández Muñoz
- Simón Andrés Páez Villalobos

## Cómo correrlo
1. Clona el repo y ábrelo en **VS Code**.
2. Instala la extensión **Live Server**.
3. Clic derecho en `index.html` → **Open with Live Server**.

No hay que instalar nada más: es HTML, CSS y JS puro. Los datos se guardan en el `localStorage` del navegador, así que son simulados.

### Modo demo (para la presentación)
Abre `demo.html` (también hay un link discreto "Modo demo" en el footer):
- **Cargar datos de ejemplo:** crea una usuaria con quiz, pedidos (insignia Runner), un descuento disponible, una caja escaneada, un conjunto publicado y un voto.
- **Reiniciar todo:** borra lo guardado para que alguien pruebe desde cero.

## Qué tiene
| Página | Qué hace |
|---|---|
| Inicio | Frase motivacional, destacados, evento activo e invitación al quiz |
| Catálogo | Filtros, orden y recomendaciones "Para ti" con un toque de variedad |
| Carrito | Pedido dentro de la página, con descuento por insignia |
| Perfil | Datos, estilo, insignia y progreso, pedidos y closet |
| Quiz | "Queremos conocerte": opcional, sin preguntas invasivas y repetible |
| Comunidad | Concurso de baile, postulación de diseños, votos y outfits |
| Mi closet | Closet y maniquí virtual (beta) |

## Dónde cambiar cosas
- **Textos y frases:** `js/textos.js`
- **Productos, precios e insignias:** `js/data/productos.js`
- **Colores y fuentes:** variables en `css/styles.css` (siempre según el manual de marca)

## Documentación
- `docs/CONTEXTO.md`: todo el contexto del reto, la empresa y las decisiones
- `docs/PLAN.md`: plan de trabajo por fases
- `docs/PRUEBAS.md`: guía para las pruebas con usuarios
- `CLAUDE.md`: reglas para trabajar con Claude Code

---
Prototipo académico. Fotos de producto tomadas del Instagram de [@chased_med](https://www.instagram.com/chased_med/).
