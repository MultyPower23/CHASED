// ============================================================
// carrito.js — Carrito y confirmación del pedido
// ------------------------------------------------------------
// Aquí pasa lo que hoy se hace por WhatsApp, pero sin escribir ni
// esperar: revisas, ajustas cantidades y confirmas. Recién en ese
// momento pedimos el registro (no antes: nadie quiere llenar
// formularios solo para mirar ropa).
// ============================================================

import {
  htmlFoto,
  formatearPrecio,
  buscarProducto,
  capitalizar,
  escaparHTML,
  pedirRegistro,
  descuentoDisponible,
  totalPrendasCompradas,
  nivelPorPrendas,
  estadoInsignia,
} from "./app.js";
import { CONFIG } from "./data/productos.js";
import { TEXTOS } from "./textos.js";
import {
  getCarrito,
  getUsuario,
  cambiarCantidad,
  quitarDelCarrito,
  vaciarCarrito,
  guardarPedido,
} from "./storage.js";

const T = TEXTOS;
const contenido = document.getElementById("contenido");

// Junta cada ítem del carrito con su producto (precio, foto, nombre).
// Si un producto ya no existe en productos.js, lo ignoramos.
function itemsConProducto() {
  return getCarrito()
    .map((item) => ({ ...item, producto: buscarProducto(item.id) }))
    .filter((item) => item.producto);
}

// Toda la plata se calcula en un solo lugar para que el resumen y
// el pedido guardado nunca muestren números distintos.
function calcularTotales(items) {
  const subtotal = items.reduce((suma, i) => suma + i.producto.precio * i.cantidad, 0);
  const descuentoPct = descuentoDisponible();
  const descuento = Math.round((subtotal * descuentoPct) / 100);
  const prendas = items.reduce((suma, i) => suma + i.cantidad, 0);
  return { subtotal, descuentoPct, descuento, total: subtotal - descuento, prendas };
}

// ---------- Pintar ----------
function htmlItem(item) {
  const p = item.producto;
  const datos = `data-id="${p.id}" data-talla="${item.talla}"`;
  return `
    <li class="item">
      ${htmlFoto(p)}
      <div>
        <h3>${escaparHTML(p.nombre)}</h3>
        <p class="texto-suave">${escaparHTML(capitalizar(p.color))} · ${T.carrito.talla} ${item.talla}</p>
        <div class="item__fila">
          <div class="cantidad">
            <button type="button" ${datos} data-cambio="-1" aria-label="${T.carrito.menos}">−</button>
            <span>${item.cantidad}</span>
            <button type="button" ${datos} data-cambio="1" aria-label="${T.carrito.mas}">+</button>
          </div>
          <span>${formatearPrecio(p.precio * item.cantidad)}</span>
        </div>
        <button class="boton-texto" type="button" ${datos} data-accion="quitar">${T.carrito.quitar}</button>
      </div>
    </li>`;
}

// Barra de progreso hacia el siguiente nivel
function htmlBarra(actual, meta) {
  const porcentaje = Math.min(100, Math.round((actual / meta) * 100));
  return `<div class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="${meta}"
    aria-valuenow="${actual}"><span style="width:${porcentaje}%"></span></div>`;
}

// La insignia se muestra ANTES de comprar: así la persona ve que
// cada prenda cuenta, y que si llega a 4 sube de nivel.
function htmlInsigniaCarrito(totales) {
  const prendasAntes = totalPrendasCompradas();
  const ahora = estadoInsignia(prendasAntes);
  const despues = estadoInsignia(prendasAntes + totales.prendas);
  const pct = CONFIG.descuentoPorNivel;

  let mensaje;
  if (despues.indice > ahora.indice) mensaje = `<strong>${T.carrito.conEstePedido(despues.nombre, pct)}</strong>`;
  else if (ahora.esMaximo) mensaje = T.carrito.nivelMaximo;
  else mensaje = T.carrito.llevas(despues.enEsteNivel, despues.meta, despues.siguiente);

  const barra = despues.indice > ahora.indice || ahora.esMaximo
    ? htmlBarra(1, 1)
    : htmlBarra(despues.enEsteNivel, despues.meta);

  const avisoDescuento = totales.descuentoPct
    ? `<p class="insignia__descuento">${T.carrito.descuentoActivo(ahora.nombre, totales.descuentoPct)}</p>`
    : "";

  return `
    <div class="insignia">
      <p class="insignia__nivel">
        <img src="assets/logo/simbolo-ch-negro.png" alt="">
        <span>${T.carrito.tuInsignia}: <strong>${ahora.nombre}</strong></span>
      </p>
      ${avisoDescuento}
      ${barra}
      <p class="insignia__texto">${mensaje}</p>
      <p class="texto-suave">${T.carrito.reglaInsignia(CONFIG.prendasPorNivel, pct)}</p>
    </div>`;
}

function htmlResumen(totales) {
  const filaDescuento = totales.descuentoPct
    ? `<div class="resumen__fila">
         <span>${T.carrito.descuento} (${totales.descuentoPct}% ${T.general.referencial})</span>
         <span>− ${formatearPrecio(totales.descuento)}</span>
       </div>`
    : "";
  return `
    <aside class="resumen">
      <div class="resumen__fila">
        <span>${T.carrito.subtotal} · ${T.carrito.prendas(totales.prendas)}</span>
        <span>${formatearPrecio(totales.subtotal)}</span>
      </div>
      ${filaDescuento}
      <div class="resumen__fila resumen__fila--total">
        <span>${T.carrito.total}</span>
        <strong>${formatearPrecio(totales.total)}</strong>
      </div>
      ${htmlInsigniaCarrito(totales)}
      <button class="boton boton--ancho" type="button" data-accion="confirmar">${T.carrito.confirmar}</button>
      <p class="texto-suave">${T.carrito.simulado}</p>
    </aside>`;
}

function renderCarrito() {
  const items = itemsConProducto();

  if (!items.length) {
    contenido.innerHTML = `
      <section class="seccion contenedor vacio">
        <h1>${T.carrito.titulo}</h1>
        <p>${T.carrito.vacio}</p>
        <a class="boton" href="catalogo.html">${T.inicio.verCatalogo}</a>
      </section>`;
    return;
  }

  contenido.innerHTML = `
    <section class="seccion contenedor">
      <h1>${T.carrito.titulo}</h1>
      <div class="carrito">
        <ul class="lista-items">${items.map(htmlItem).join("")}</ul>
        ${htmlResumen(calcularTotales(items))}
      </div>
    </section>`;
}

function renderConfirmacion(pedido) {
  // Si subió de nivel, lo celebramos en grande; si no, le contamos
  // cuánto le falta para el siguiente (para que quiera volver).
  const insignia = estadoInsignia();
  const mensajeNivel = pedido.subioNivel
    ? `<p class="confirmacion__nivel">${T.carrito.subisteNivel(pedido.nivel)}</p>`
    : `<div class="confirmacion__progreso">
         <p>${T.carrito.tuInsignia}: <strong>${insignia.nombre}</strong></p>
         ${insignia.esMaximo ? "" : htmlBarra(insignia.enEsteNivel, insignia.meta)}
         <p class="texto-suave">${insignia.esMaximo ? T.carrito.nivelMaximo : T.perfil.progreso(insignia.faltan)}</p>
       </div>`;
  contenido.innerHTML = `
    <section class="seccion contenedor">
      <div class="confirmacion">
        <figure class="confirmacion__gracias">
          <img src="assets/img/comunidad/gracias-familia.jpg" alt="" onerror="this.remove()">
          <figcaption>${T.carrito.gracias}</figcaption>
        </figure>
        <h1>${T.carrito.numeroPedido(pedido.id)}</h1>
        <p>${T.carrito.confirmado}</p>
        <p class="texto-suave">${T.carrito.prendas(pedido.prendas)} · ${T.carrito.total} ${formatearPrecio(pedido.total)}</p>
        ${mensajeNivel}
        <div class="confirmacion__acciones">
          <a class="boton" href="perfil.html">${T.carrito.verPerfil}</a>
          <a class="boton-texto" href="catalogo.html">${T.carrito.seguirComprando}</a>
        </div>
      </div>
    </section>`;
}

// ---------- Confirmar pedido ----------
async function confirmarPedido() {
  // El registro aparece justo aquí, cuando de verdad hace falta
  if (!getUsuario()) {
    const usuario = await pedirRegistro(T.carrito.registroAntes);
    if (!usuario) return; // cerró el modal: no pasa nada, su carrito sigue intacto
  }

  const items = itemsConProducto();
  if (!items.length) return;
  const totales = calcularTotales(items);

  // ¿Este pedido lo hace subir de nivel? Comparamos antes vs. después
  const prendasAntes = totalPrendasCompradas();
  const nivelAntes = nivelPorPrendas(prendasAntes);
  const nivelDespues = nivelPorPrendas(prendasAntes + totales.prendas);

  const pedido = {
    // Un número corto basado en la hora: suficiente para un prototipo
    id: String(Date.now()).slice(-6),
    fecha: new Date().toISOString(),
    // Guardamos nombre y precio del momento, como en un recibo de verdad
    items: items.map((i) => ({
      id: i.id,
      nombre: i.producto.nombre,
      talla: i.talla,
      cantidad: i.cantidad,
      precio: i.producto.precio,
    })),
    prendas: totales.prendas,
    subtotal: totales.subtotal,
    descuentoPct: totales.descuentoPct,
    total: totales.total,
    subioNivel: nivelDespues > nivelAntes,
    nivel: T.insignias.niveles[nivelDespues],
    estado: "confirmado",
  };

  guardarPedido(pedido);
  vaciarCarrito();
  renderConfirmacion(pedido);
  window.scrollTo(0, 0);
}

// ---------- Eventos ----------
// Un solo oyente para todo el contenido (delegación): sirve aunque
// la lista se vuelva a pintar cada vez que cambia una cantidad.
contenido.addEventListener("click", (e) => {
  const boton = e.target.closest("button");
  if (!boton) return;
  const { id, talla, cambio, accion } = boton.dataset;

  if (cambio) cambiarCantidad(id, talla, Number(cambio));
  else if (accion === "quitar") quitarDelCarrito(id, talla);
  else if (accion === "confirmar") confirmarPedido();
});

// Cada vez que el carrito cambia, se vuelve a pintar (salvo si ya
// estamos mostrando la confirmación del pedido)
window.addEventListener("carrito-cambio", () => {
  if (!contenido.querySelector(".confirmacion")) renderCarrito();
});

renderCarrito();
