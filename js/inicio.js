// ============================================================
// inicio.js — La portada
// ------------------------------------------------------------
// Arranca en negro, como entrar a un evento: logo grande, una frase
// y una "banderita" de fotos que corre de izquierda a derecha. Al
// bajar, la página se "prende la luz" y pasa a blanco para explorar
// con calma. Nada de registro aquí: primero que se enamore de la ropa.
// ============================================================

import { htmlTarjeta, buscarProducto, productosDeColeccion } from "./app.js";
import { TEXTOS } from "./textos.js";
import { PRODUCTOS, COLECCIONES } from "./data/productos.js";
import { getPreferencia, guardarPreferencia } from "./storage.js";

const T = TEXTOS;
const contenido = document.getElementById("contenido");

// Fotos de la familia Chased (sesiones de fotos, no eventos)
const FOTOS_FAMILIA = [
  "assets/img/comunidad/familia-01.jpg",
  "assets/img/comunidad/familia-03.jpg",
  "assets/img/comunidad/familia-05.jpg",
];

// Portadas de Hombre y Mujer (fotos de sesión de la familia Chased)
const PORTADAS_GENERO = {
  hombre: "assets/img/comunidad/familia-04.jpg",
  mujer: "assets/img/comunidad/familia-02.jpg",
};

// Una frase distinta cada vez que entras: así la portada se siente viva
function fraseAleatoria() {
  const frases = T.frasesMotivacionales;
  return frases[Math.floor(Math.random() * frases.length)];
}

// Título de sección con el monograma CH: es el "sello" que hace que
// cada bloque se sienta Chased y no una tienda cualquiera.
function htmlTitulo(texto, enlace = "") {
  return `
    <div class="titulo-seccion">
      <h2 class="titulo-ch">
        <img src="assets/logo/simbolo-ch-negro.png" alt="">${texto}
      </h2>
      ${enlace}
    </div>`;
}

// ---------- Portada negra + banderita ----------

// Mezcla fotos de producto destacadas con fotos de la familia.
function fotosBandera() {
  const productos = PRODUCTOS.filter((p) => p.destacado).map((p) => p.imagen);
  const mezcla = [];
  productos.forEach((foto, i) => {
    mezcla.push(foto);
    if (FOTOS_FAMILIA[i]) mezcla.push(FOTOS_FAMILIA[i]);
  });
  return mezcla;
}

// El truco de la cinta infinita: se pinta el contenido DOS veces
// seguidas y la animación mueve la pista media vuelta. Cuando
// termina, se ve exactamente igual que al inicio, así que el salto
// no se nota (como una banda transportadora).
function htmlBandera() {
  const fotos = fotosBandera()
    .map((src) => `<img src="${src}" alt="" loading="lazy" onerror="this.remove()">`)
    .join("");
  const frases = T.inicio.cinta
    .map((frase) => `<span>${frase}</span><img src="assets/logo/simbolo-ch-blanco.png" alt="">`)
    .join("");
  return `
    <div class="bandera" aria-hidden="true">
      <div class="bandera__pista">${fotos}${fotos}</div>
    </div>
    <div class="cinta" aria-hidden="true">
      <div class="cinta__pista">${frases}${frases}${frases}${frases}</div>
    </div>`;
}

function htmlPortada() {
  return `
    <section class="portada" id="portada">
      <div class="contenedor portada__centro">
        <h1 class="portada__titulo">
          <img src="assets/logo/logo-chased-blanco.png" alt="${T.marca.nombre}">
        </h1>
        <p class="portada__frase">${fraseAleatoria()}</p>
        <div class="portada__botones">
          <a class="boton boton--invertido" href="catalogo.html">${T.inicio.verCatalogo}</a>
          <a class="boton boton--borde" href="catalogo.html?genero=hombre">${T.generos.hombre}</a>
          <a class="boton boton--borde" href="catalogo.html?genero=mujer">${T.generos.mujer}</a>
        </div>
      </div>
      ${htmlBandera()}
    </section>`;
}

// ---------- Secciones blancas ----------

function htmlGeneros() {
  const tile = (genero) => `
    <a class="genero" href="catalogo.html?genero=${genero}">
      <img src="${PORTADAS_GENERO[genero]}" alt="" loading="lazy">
      <span class="genero__nombre">${T.generos[genero]}</span>
    </a>`;
  return `
    <section class="seccion contenedor">
      ${htmlTitulo(T.inicio.paraQuienTitulo)}
      <div class="generos">${tile("hombre")}${tile("mujer")}</div>
    </section>`;
}

function htmlDestacados() {
  const destacados = PRODUCTOS.filter((p) => p.destacado);
  return `
    <section class="seccion contenedor">
      ${htmlTitulo(T.inicio.destacadosTitulo, `<a href="catalogo.html" class="texto-suave">${T.inicio.verCatalogo}</a>`)}
      <div class="grilla grilla--destacados">${destacados.map(htmlTarjeta).join("")}</div>
    </section>`;
}

function htmlTarjetaColeccion(coleccion) {
  const textos = T.colecciones[coleccion.clave];
  const portada = buscarProducto(coleccion.portada);
  const cantidad = productosDeColeccion(coleccion.clave).length;
  return `
    <a class="coleccion" href="catalogo.html?coleccion=${coleccion.clave}">
      <div class="foto">
        <span class="foto__nombre">${textos.nombre}</span>
        ${portada ? `<img src="${portada.imagen}" alt="" loading="lazy" onerror="this.remove()">` : ""}
      </div>
      <h3>${textos.nombre}</h3>
      <p class="texto-suave">${textos.descripcion} · ${T.carrito.prendas(cantidad)}</p>
    </a>`;
}

function htmlColecciones() {
  // Las "ediciones" (como NOV. 2024) van aparte, en la sección de drops
  const generales = COLECCIONES.filter((c) => !c.edicion);
  return `
    <section class="seccion contenedor">
      ${htmlTitulo(T.inicio.coleccionesTitulo)}
      <p class="texto-suave subtitulo">${T.inicio.coleccionesSub}</p>
      <div class="colecciones">${generales.map(htmlTarjetaColeccion).join("")}</div>
    </section>`;
}

function htmlBannerEvento() {
  return `
    <section class="contenedor">
      <div class="banner-evento">
        <img class="banner-evento__ch" src="assets/logo/simbolo-ch-blanco.png" alt="">
        <h2>${T.inicio.eventoBanner}</h2>
        <a class="boton boton--invertido" href="comunidad.html">${T.inicio.eventoBoton}</a>
      </div>
    </section>`;
}

// GODWOVEN ya pasó (nov 2025): se muestra SOLO como ejemplo de un
// drop anterior, sin cuenta regresiva ni "próximamente".
function htmlDrops() {
  const ediciones = COLECCIONES.filter((c) => c.edicion);
  return `
    <section class="seccion contenedor">
      ${htmlTitulo(T.inicio.dropsTitulo)}
      <div class="drops">
        ${ediciones.map(htmlTarjetaColeccion).join("")}
        <article class="drop">
          <div class="foto">
            <span class="foto__nombre">${T.inicio.dropAnteriorTitulo}</span>
            <img src="assets/img/novedades/drop-godwoven.jpg" alt="" loading="lazy" onerror="this.remove()">
          </div>
          <p class="etiqueta">${T.inicio.dropAnteriorEtiqueta}</p>
          <h3>${T.inicio.dropAnteriorTitulo}</h3>
          <p class="texto-suave">${T.inicio.dropAnteriorTexto}</p>
        </article>
      </div>
      <p class="proximo-drop">${T.inicio.proximoDrop}</p>
    </section>`;
}

// El quiz es una invitación, no una obligación. Si dice "Ahora no",
// guardamos esa decisión y no volvemos a insistir en el inicio.
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

// ---------- Del negro al blanco ----------
// Un "vigilante" (IntersectionObserver) mira la portada. Mientras
// se vea buena parte de ella, la página está en modo noche; cuando
// la persona baja, se quita la clase y el CSS hace la transición.
function activarCambioDeFondo() {
  const portada = document.getElementById("portada");
  const vigilante = new IntersectionObserver(
    ([entrada]) => document.body.classList.toggle("noche", entrada.intersectionRatio > 0.35),
    { threshold: [0, 0.35, 1] }
  );
  vigilante.observe(portada);
}

function renderInicio() {
  contenido.innerHTML =
    htmlPortada() +
    htmlGeneros() +
    htmlDestacados() +
    htmlColecciones() +
    htmlBannerEvento() +
    htmlDrops() +
    htmlInvitacionQuiz();

  contenido.querySelector('[data-accion="ocultar-quiz"]')?.addEventListener("click", () => {
    guardarPreferencia("quizOculto", true);
    document.getElementById("bloque-quiz").remove();
  });

  activarCambioDeFondo();
}

renderInicio();
