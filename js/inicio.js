// ============================================================
// inicio.js — La portada
// ------------------------------------------------------------
// Es lo primero que ve quien llega desde Instagram, así que va
// directo al grano: una frase que motive, lo más perseguido del
// catálogo, el concurso de baile y (solo si quiere) el quiz.
// Nada de registro aquí: primero que se enamore de la ropa.
// ============================================================

import { htmlTarjeta } from "./app.js";
import { TEXTOS } from "./textos.js";
import { PRODUCTOS } from "./data/productos.js";
import { getPreferencia, guardarPreferencia } from "./storage.js";

const T = TEXTOS;

// Una frase distinta cada vez que entras: así la portada se siente viva
function fraseAleatoria() {
  const frases = T.frasesMotivacionales;
  return frases[Math.floor(Math.random() * frases.length)];
}

function htmlHero() {
  return `
    <section class="hero">
      <div class="contenedor">
        <h1 class="hero__frase">${fraseAleatoria()}</h1>
        <p class="hero__eslogan">${T.marca.eslogan}</p>
        <a class="boton" href="catalogo.html">${T.inicio.verCatalogo}</a>
      </div>
    </section>`;
}

function htmlDestacados() {
  const destacados = PRODUCTOS.filter((p) => p.destacado);
  return `
    <section class="seccion contenedor">
      <div class="titulo-seccion">
        <h2>${T.inicio.destacadosTitulo}</h2>
        <a href="catalogo.html" class="texto-suave">${T.inicio.verCatalogo}</a>
      </div>
      <div class="grilla">${destacados.map(htmlTarjeta).join("")}</div>
    </section>`;
}

function htmlBannerEvento() {
  return `
    <section class="contenedor">
      <div class="banner-evento">
        <h2>${T.inicio.eventoBanner}</h2>
        <a class="boton boton--invertido" href="comunidad.html">${T.inicio.eventoBoton}</a>
      </div>
    </section>`;
}

// El quiz es una invitación, no una obligación. Si dice "Ahora no",
// guardamos esa decisión y no volvemos a insistir en el inicio
// (igual lo puede hacer después desde su perfil).
function htmlInvitacionQuiz() {
  if (getPreferencia("quizOculto", false)) return "";
  return `
    <section class="seccion contenedor" id="bloque-quiz">
      <div class="invitacion-quiz">
        <h2>${T.quiz.titulo}</h2>
        <p>${T.inicio.quizInvitacion}</p>
        <div class="invitacion-quiz__acciones">
          <a class="boton" href="quiz.html">${T.inicio.quizBoton}</a>
          <button class="boton-texto" type="button" data-accion="ocultar-quiz">${T.quiz.saltar}</button>
        </div>
      </div>
    </section>`;
}

function renderInicio() {
  const contenido = document.getElementById("contenido");
  contenido.innerHTML = htmlHero() + htmlDestacados() + htmlBannerEvento() + htmlInvitacionQuiz();

  contenido.querySelector('[data-accion="ocultar-quiz"]')?.addEventListener("click", () => {
    guardarPreferencia("quizOculto", true);
    document.getElementById("bloque-quiz").remove();
  });
}

renderInicio();
