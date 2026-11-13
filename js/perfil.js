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
  cuponesDisponibles,
  estadoCupon,
  formatoFecha,
  totalPrendasCompradas,
  htmlTarjetaEstilo,
  htmlIconoInsignia,
  htmlBarraInsignia,
  htmlCaminoInsignias,
} from "./app.js";
import { TEXTOS } from "./textos.js";
import { CONFIG } from "./data/productos.js";
import { prendasDelCloset } from "./conjuntos.js";
import { getUsuario, getPedidos, getQuiz, getCupones } from "./storage.js";

const T = TEXTOS;
const P = T.perfil;
const contenido = document.getElementById("contenido");


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
      <article class="tarjeta-perfil tarjeta-perfil--negra">
        <h2>${P.estilo}</h2>
        <p class="perfil-estilo">?</p>
        <p>${P.sinQuiz}</p>
        <a class="boton boton--invertido" href="quiz.html">${P.hacerQuiz}</a>
      </article>`;
  }
  // El quiz se puede repetir: el estilo de una persona cambia, y está bien
  return htmlTarjetaEstilo(quiz.estilo, {
    etiqueta: P.estilo,
    acciones: `<a class="boton boton--invertido" href="quiz.html">${T.quiz.repetir}</a>`,
  });
}

function htmlInsignia() {
  const prendas = totalPrendasCompradas();
  const insignia = estadoInsignia(prendas);
  const listos = cuponesDisponibles().length;

  return `
    <article class="tarjeta-perfil">
      <h2>${P.insignia}</h2>
      <div class="insignia-grande">
        ${htmlIconoInsignia(insignia.indice, "icono-insignia--grande")}
        <div>
          <p class="perfil-estilo">${insignia.nombre ?? T.insignias.sinInsignia}</p>
          <p class="texto-suave">${P.prendasCompradas(prendas)}</p>
        </div>
      </div>
      ${htmlBarraInsignia(insignia)}
      ${htmlCaminoInsignias(insignia.indice)}
      ${listos ? `<p class="insignia__descuento">${P.cuponesListos(listos)}</p>` : `<p class="texto-suave">${P.sinDescuento}</p>`}
      <p class="texto-suave">${T.carrito.reglaInsignia(CONFIG.prendasPorNivel, CONFIG.descuentoPorNivel)}</p>
    </article>`;
}

// ---------- Descuentos (cupones) ----------
// Cada cupón muestra si está disponible, usado o vencido. Los
// disponibles van primero; así la persona ve de una lo que puede usar.
function htmlCupon(cupon) {
  const estado = estadoCupon(cupon);
  let detalle;
  if (estado === "usado") detalle = P.usadoEn(cupon.usadoEn);
  else if (estado === "vencido") detalle = P.vencioEl(formatoFecha(cupon.vence));
  else detalle = T.carrito.venceEl(formatoFecha(cupon.vence));
  const etiqueta = estado === "usado" ? P.usadoEn(cupon.usadoEn) : P.estadoCupon[estado];

  return `
    <li class="cupon-perfil cupon-perfil--${estado}">
      <span class="cupon-perfil__pct">${cupon.pct}%</span>
      <div>
        <p class="cupon-perfil__titulo">${T.carrito.cupon(cupon.pct, cupon.nivel)}</p>
        <p class="texto-suave">${P.ganadoEl(formatoFecha(cupon.ganado))} · ${detalle}</p>
      </div>
      ${estado === "usado" ? "" : `<span class="cupon-perfil__estado">${etiqueta}</span>`}
    </li>`;
}

function htmlDescuentos() {
  const orden = { disponible: 0, usado: 1, vencido: 2 };
  const cupones = [...getCupones()].sort((a, b) => orden[estadoCupon(a)] - orden[estadoCupon(b)]);
  const cuerpo = cupones.length
    ? `<ul class="cupones-perfil">${cupones.map(htmlCupon).join("")}</ul>
       <p class="texto-suave">${T.carrito.vigencia(CONFIG.diasVigenciaDescuento)}</p>`
    : `<p>${P.sinCupones}</p>`;
  return `<section class="seccion contenedor">${titulo(P.descuentosTitulo)}${cuerpo}</section>`;
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
  // Mismo closet que Mi closet: lo comprado + lo de las cajas escaneadas
  const productos = prendasDelCloset().map((p) => p.producto);
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
    ${htmlDescuentos()}
    ${htmlPedidos()}
    ${htmlCloset()}`;
}

contenido.addEventListener("click", (e) => {
  if (e.target.closest('[data-accion="registro"]')) pedirRegistro();
});

// Si entra o cierra sesión desde el header, el perfil se actualiza solo
window.addEventListener("sesion-cambio", renderPerfil);

renderPerfil();
