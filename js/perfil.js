// ============================================================
// perfil.js — Tu perfil en la familia Chased
// ------------------------------------------------------------
// Es el "carné" de la persona: quién es, cuál es su estilo, en qué
// nivel de insignia va y qué ha comprado. La idea es que dé ganas de
// volver: ver la barra llenándose engancha más que cualquier anuncio.
// ============================================================

import {
  htmlFoto,
  formatearPrecio,
  buscarProducto,
  escaparHTML,
  pedirRegistro,
  estadoInsignia,
  descuentoDisponible,
  totalPrendasCompradas,
} from "./app.js";
import { TEXTOS } from "./textos.js";
import { CONFIG } from "./data/productos.js";
import { getUsuario, getPedidos, getQuiz } from "./storage.js";

const T = TEXTOS;
const P = T.perfil;
const contenido = document.getElementById("contenido");

const formatoFecha = (iso) =>
  new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });

// Título con el sello CH, igual que en el inicio
const titulo = (texto) => `
  <h2 class="titulo-ch"><img src="assets/logo/simbolo-ch-negro.png" alt="">${texto}</h2>`;

// ---------- Sin registro ----------
function renderSinRegistro() {
  contenido.innerHTML = `
    <section class="seccion contenedor vacio">
      <img class="quiz__ch" src="assets/logo/simbolo-ch-negro.png" alt="">
      <h1>${P.titulo}</h1>
      <p>${P.sinRegistro}</p>
      <button class="boton" type="button" data-accion="registro">${T.nav.registrate}</button>
    </section>`;
}

// ---------- Bloques del perfil ----------

// Si no subió foto, ponemos la inicial del nombre en un círculo negro
function htmlAvatar(usuario) {
  return usuario.foto
    ? `<img class="avatar" src="${usuario.foto}" alt="">`
    : `<span class="avatar avatar--inicial" aria-hidden="true">${escaparHTML(usuario.nombre.charAt(0).toUpperCase())}</span>`;
}

function htmlCabecera(usuario) {
  return `
    <div class="perfil-cabecera">
      ${htmlAvatar(usuario)}
      <div>
        <h1>${escaparHTML(usuario.nombre)}</h1>
        <p class="texto-suave">${escaparHTML(usuario.correo)}</p>
        <p class="texto-suave">${P.miembroDesde(formatoFecha(usuario.fechaRegistro))}</p>
      </div>
    </div>`;
}

function htmlEstilo() {
  const quiz = getQuiz();
  if (!quiz) {
    return `
      <article class="tarjeta-perfil">
        <h2>${P.estilo}</h2>
        <p>${P.sinQuiz}</p>
        <a class="boton" href="quiz.html">${P.hacerQuiz}</a>
      </article>`;
  }
  const estilo = T.quiz.estilos[quiz.estilo];
  // El quiz se puede repetir: el estilo de una persona cambia, y está bien
  return `
    <article class="tarjeta-perfil">
      <h2>${P.estilo}</h2>
      <p class="perfil-estilo">${estilo.nombre}</p>
      <p>${estilo.descripcion}</p>
      <a class="boton boton--claro" href="quiz.html">${T.quiz.repetir}</a>
    </article>`;
}

// Los 4 niveles en fila: los que ya alcanzó van en negro
function htmlNiveles(indiceActual) {
  return `
    <ol class="niveles" aria-label="${P.niveles}">
      ${T.insignias.niveles
        .map(
          (nombre, i) => `
          <li class="${i <= indiceActual ? "alcanzado" : ""} ${i === indiceActual ? "actual" : ""}">
            <span class="niveles__punto"></span>${nombre}
          </li>`
        )
        .join("")}
    </ol>`;
}

function htmlInsignia() {
  const prendas = totalPrendasCompradas();
  const insignia = estadoInsignia(prendas);
  const pct = descuentoDisponible();
  const porcentaje = insignia.esMaximo ? 100 : Math.round((insignia.enEsteNivel / insignia.meta) * 100);

  return `
    <article class="tarjeta-perfil">
      <h2>${P.insignia}</h2>
      <div class="insignia-grande">
        <img src="assets/logo/simbolo-ch-negro.png" alt="">
        <div>
          <p class="perfil-estilo">${insignia.nombre}</p>
          <p class="texto-suave">${P.prendasCompradas(prendas)}</p>
        </div>
      </div>
      ${htmlNiveles(insignia.indice)}
      <div class="barra"><span style="width:${porcentaje}%"></span></div>
      <p>${insignia.esMaximo ? T.carrito.nivelMaximo : P.progreso(insignia.faltan)}</p>
      ${pct ? `<p class="insignia__descuento">${P.descuentoDisponible(pct)}</p>` : `<p class="texto-suave">${P.sinDescuento}</p>`}
      <p class="texto-suave">${T.carrito.reglaInsignia(CONFIG.prendasPorNivel, CONFIG.descuentoPorNivel)}</p>
    </article>`;
}

function htmlPedido(pedido) {
  const items = pedido.items
    .map((i) => `<li>${escaparHTML(i.nombre)} · ${T.carrito.talla} ${i.talla} × ${i.cantidad}</li>`)
    .join("");
  return `
    <li class="pedido">
      <div class="pedido__cabecera">
        <strong>${T.carrito.numeroPedido(pedido.id)}</strong>
        <span class="texto-suave">${formatoFecha(pedido.fecha)}</span>
      </div>
      <ul class="pedido__items">${items}</ul>
      <div class="pedido__cabecera">
        <span class="texto-suave">${pedido.descuentoPct ? P.conDescuento(pedido.descuentoPct) : T.carrito.prendas(pedido.prendas)}</span>
        <strong>${formatearPrecio(pedido.total)}</strong>
      </div>
    </li>`;
}

function htmlPedidos() {
  // Los más recientes primero
  const pedidos = [...getPedidos()].reverse();
  const cuerpo = pedidos.length
    ? `<ul class="pedidos">${pedidos.map(htmlPedido).join("")}</ul>`
    : `<p>${P.sinPedidos}</p><a class="boton" href="catalogo.html">${P.irCatalogo}</a>`;
  return `<section class="seccion contenedor">${titulo(P.pedidos)}${cuerpo}</section>`;
}

// Adelanto del closet: las prendas que ya compró (sin repetir).
// En la Fase 4 esto se conecta con el maniquí.
function htmlCloset() {
  const ids = [...new Set(getPedidos().flatMap((p) => p.items.map((i) => i.id)))];
  const productos = ids.map(buscarProducto).filter(Boolean);
  const cuerpo = productos.length
    ? `<div class="closet">
         ${productos
           .map(
             (p) => `<a class="closet__prenda" href="catalogo.html?producto=${p.id}">
                       ${htmlFoto(p)}<span>${escaparHTML(p.nombre)}</span>
                     </a>`
           )
           .join("")}
       </div>
       <p class="texto-suave">${P.closetNota}</p>`
    : `<p>${P.closetVacio}</p>`;
  return `<section class="seccion contenedor">${titulo(P.closet)}${cuerpo}</section>`;
}

// ---------- Pintar ----------
function renderPerfil() {
  const usuario = getUsuario();
  if (!usuario) return renderSinRegistro();

  contenido.innerHTML = `
    <section class="seccion contenedor">
      ${htmlCabecera(usuario)}
      <div class="perfil-tarjetas">
        ${htmlEstilo()}
        ${htmlInsignia()}
      </div>
    </section>
    ${htmlPedidos()}
    ${htmlCloset()}`;
}

contenido.addEventListener("click", (e) => {
  if (e.target.closest('[data-accion="registro"]')) pedirRegistro();
});

// Si entra o cierra sesión desde el header, el perfil se actualiza solo
window.addEventListener("sesion-cambio", renderPerfil);

renderPerfil();
