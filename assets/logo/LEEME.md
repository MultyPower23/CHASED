# Logos oficiales (sacados del manual de marca)

Todos son PNG con fondo transparente, **sin deformar** (se conserva la proporción original) y con el **espacio de respeto ya incluido**. Según el manual, ese espacio es **1X en todos los lados, donde X = altura de la letra "C"**. Por eso cada imagen trae su margen transparente alrededor.

| Archivo | Qué es | Cuándo usarlo |
|---|---|---|
| `logo-chased-negro.png` / `-blanco.png` | **Principal**: CHASED serif con el CH debajo | Header, inicio, footer |
| `logo-horizontal-negro.png` / `-blanco.png` | Versión con el corredor | Banners anchos (en el manual viene en baja resolución, así que úsalo pequeño) |
| `simbolo-ch-negro.png` / `-blanco.png` | Solo el monograma CH | Espacios pequeños, insignias, sellos |
| `logo-stencil-negro.png` / `-blanco.png` | CHASED stencil (portada y página de colores del manual) | Solo si el equipo decide usarlo |
| `favicon.png` | CH cuadrado de 64×64 | **Solo** para el ícono de la pestaña del navegador |

- Negro → sobre fondos claros. Blanco → sobre fondos negros u oscuros (es la versión negativa del manual).

## Reglas al usarlos en el código
- Ajusta **solo** `height` **o** `width`, nunca los dos a la vez, para no deformarlo.
- No uses `object-fit: cover` ni recortes: eso se come el espacio de respeto.
- Prohibido rotar, recolorear, ponerle sombra, filtros o efectos.
- No pongas otros elementos encima del margen transparente.
