// ============================================================
// pronto.js — Página temporal de "muy pronto"
// ------------------------------------------------------------
// Perfil, quiz, comunidad y closet se construyen en las siguientes
// fases. Mientras tanto, esta página evita que el menú lleve a un
// error 404, que en una demo se ve feo. Cuando cada página tenga
// su propio JS, este archivo se puede borrar.
// ============================================================

import "./app.js";
import { TEXTOS } from "./textos.js";

const T = TEXTOS;
const pagina = document.body.dataset.pagina;
const titulo = T[pagina]?.titulo ?? T.marca.nombre;

document.getElementById("contenido").innerHTML = `
  <section class="seccion contenedor vacio">
    <h1>${titulo}</h1>
    <p>${T.general.proximamente}</p>
    <a class="boton boton--claro" href="index.html">${T.general.volverInicio}</a>
  </section>`;
