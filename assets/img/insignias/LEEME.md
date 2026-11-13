# Iconos de insignias (opcional)

Si el equipo diseña iconos propios para cada nivel, guárdalos aquí con **estos nombres exactos**:

| Archivo | Nivel | Se gana con |
|---|---|---|
| `rookie.png` | Rookie | La primera compra |
| `runner.png` | Runner | 4 prendas compradas |
| `chaser.png` | Chaser | 8 prendas compradas |
| `leyenda.png` | Leyenda Chased | 12 prendas compradas |

- Formato: **PNG cuadrado con fondo transparente**, de unos 256×256 px.
- Ya están los 4 escudos oficiales (con el CH en el centro). Se muestran **tal cual, sin círculo negro** (clase `icono-insignia--custom`). Si una imagen no carga, vuelve el círculo negro con el CH blanco.
- Usa solo los colores del manual (negro, blanco y grises).
- Mientras no exista el archivo, la página muestra el símbolo **CH** oficial, así que no se rompe nada.
- Las rutas se cambian en `js/data/apariencia.js` (`ICONOS_INSIGNIAS`).
