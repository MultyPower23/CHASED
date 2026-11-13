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
  cuponesDisponibles,
  crearCupon,
  nivelesConPremioEntre,
  formatoFecha,
  totalPrendasCompradas,
  nivelPorPrendas,
  estadoInsignia,
  nivelDaDescuento,
  htmlIconoInsignia,
  htmlBarraInsignia,
  mostrarAviso,
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
  getCupones,
  guardarCupones,
  restaurarEnCarrito,
} from "./storage.js";
import { mostrarCarga, entrarEnCascada, llenarBloques, salirDeslizando, aparecer } from "./animaciones.js";

const T = TEXTOS;
const contenido = document.getElementById("contenido");

// Mientras se muestra la carga de la compra, el carrito no se debe
// volver a pintar (si no, la animación se borraría a la mitad)
let procesandoCompra = false;

// Junta cada ítem del carrito con su producto (precio, foto, nombre).
// Si un producto ya no existe en productos.js, lo ignoramos.
function itemsConProducto() {
  return getCarrito()
    .map((item) => ({ ...item, producto: buscarProducto(item.id) }))
    .filter((item) => item.producto);
}

// ¿Qué descuento eligió usar en ESTE pedido? (solo uno por pedido)
//   null                       → ninguno (por defecto: lo usa cuando quiera)
//   { tipo: "guardado", id }   → un cupón que ya tenía
//   { tipo: "nuevo" }          → el que gana con este mismo pedido
let seleccion = null;

const contarPrendas = (items) => items.reduce((suma, i) => suma + i.cantidad, 0);

// Niveles con premio que este carrito haría alcanzar
function premiosDeEsteCarrito(items) {
  const antes = totalPrendasCompradas();
  return nivelesConPremioEntre(antes, antes + contarPrendas(items));
}

// Si cambió el carrito (o venció algo), la selección puede quedar
// inválida: por ejemplo, eligió "canjear ahora" y luego quitó prendas.
function validarSeleccion(items) {
  if (seleccion?.tipo === "nuevo" && !premiosDeEsteCarrito(items).length) seleccion = null;
  if (seleccion?.tipo === "guardado" && !cuponesDisponibles().some((c) => c.id === seleccion.id)) seleccion = null;
}

function porcentajeSeleccionado() {
  if (!seleccion) return 0;
  if (seleccion.tipo === "nuevo") return CONFIG.descuentoPorNivel;
  return cuponesDisponibles().find((c) => c.id === seleccion.id)?.pct ?? 0;
}

// Toda la plata se calcula en un solo lugar para que el resumen y
// el pedido guardado nunca muestren números distintos.
function calcularTotales(items) {
  validarSeleccion(items);
  const subtotal = items.reduce((suma, i) => suma + i.producto.precio * i.cantidad, 0);
  const descuentoPct = porcentajeSeleccionado();
  const descuento = Math.round((subtotal * descuentoPct) / 100);
  return { subtotal, descuentoPct, descuento, total: subtotal - descuento, prendas: contarPrendas(items) };
}

// ---------- Pintar ----------
function htmlItem(item) {
  const p = item.producto;
  const datos = `data-id="${p.id}" data-talla="${item.talla}"`;
  return `
    <li class="item" data-fila="${p.id}|${item.talla}">
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

// La insignia se muestra ANTES de comprar: así la persona ve que
// cada prenda cuenta. La barra muestra cómo quedaría CON este pedido.
function htmlInsigniaCarrito(totales) {
  const prendasAntes = totalPrendasCompradas();
  const ahora = estadoInsignia(prendasAntes);
  const despues = estadoInsignia(prendasAntes + totales.prendas);
  const pct = CONFIG.descuentoPorNivel;

  let mensaje;
  if (despues.indice > ahora.indice) {
    // Primera insignia (bienvenida) o subida con descuento
    mensaje = `<strong>${
      nivelDaDescuento(despues.indice)
        ? T.carrito.conEstePedido(despues.nombre, pct)
        : T.carrito.conEstePedidoPrimera(despues.nombre)
    }</strong>`;
  } else if (ahora.esMaximo) mensaje = T.carrito.nivelMaximo;
  else mensaje = T.carrito.llevas(despues.faltan, despues.siguiente);

  return `
    <div class="insignia">
      <p class="insignia__nivel">
        ${htmlIconoInsignia(ahora.indice, "icono-insignia--chico")}
        <span>${T.carrito.tuInsignia}: <strong>${ahora.nombre ?? T.insignias.sinInsignia}</strong></span>
      </p>
      <div class="bloques" aria-hidden="true">${htmlBloques(despues, llenaUnNivel(ahora, despues))}</div>
      <p class="insignia__texto">${mensaje}</p>
      <p class="texto-suave">${T.carrito.reglaInsignia(CONFIG.prendasPorNivel, pct)}</p>
    </div>`;
}

// ¿Este pedido llena un nivel completo? Rookie NO cuenta: es la
// insignia de bienvenida y se gana con 1 sola prenda, así que si
// pintábamos los 4 bloques llenos, después de confirmar "bajaba" a
// 1 de 4 y parecía un error. Ahí mostramos los bloques reales.
function llenaUnNivel(ahora, despues) {
  return despues.indice > ahora.indice && nivelDaDescuento(despues.indice);
}

// Solo los cuadritos de la barra (para el carrito, donde el texto es otro)
// "completo" = este pedido llena el nivel: se ven todos llenos
function htmlBloques(estado, completo = false) {
  return Array.from(
    { length: estado.meta },
    (_, i) => `<span class="${completo || i < estado.enEsteNivel || estado.esMaximo ? "lleno" : ""}"></span>`
  ).join("");
}

// Botón que activa/desactiva un descuento. aria-pressed le dice al
// lector de pantalla (y al CSS) si está puesto o no.
function htmlBotonCupon(activo, datos, textoUsar) {
  const boton = `<button class="boton ${activo ? "" : "boton--claro"} boton--cupon" type="button"
    aria-pressed="${activo}" ${datos}>${activo ? T.carrito.cuponAplicado : textoUsar}</button>`;
  // Si ya está aplicado, damos la salida clara para no usarlo todavía
  const guardar = activo
    ? `<button class="boton-texto" type="button" ${datos}>${T.carrito.noUsarCupon}</button>`
    : "";
  return boton + guardar;
}

// Los descuentos que puede usar: el que ya tenía guardado (el que
// vence primero) y/o el que gana con este mismo carrito.
function htmlDescuentos(items) {
  const guardados = cuponesDisponibles();
  const premios = premiosDeEsteCarrito(items);
  if (!guardados.length && !premios.length) return "";

  let bloques = "";

  if (guardados.length) {
    const cupon = guardados[0];
    const activo = seleccion?.tipo === "guardado" && seleccion.id === cupon.id;
    bloques += `
      <div class="cupon ${activo ? "cupon--activo" : ""}">
        <p class="cupon__titulo">${T.carrito.cupon(cupon.pct, cupon.nivel)}</p>
        <p class="cupon__vence">${T.carrito.venceEl(formatoFecha(cupon.vence))}</p>
        ${htmlBotonCupon(activo, `data-accion="cupon-guardado" data-cupon="${cupon.id}"`, T.carrito.usarCupon)}
        ${guardados.length > 1 ? `<p class="texto-suave">${T.carrito.otrosCupones(guardados.length - 1)}</p>` : ""}
      </div>`;
  }

  if (premios.length) {
    // Si cruza varios niveles de una (ej. 8 prendas), gana varios cupones
    const nivel = T.insignias.niveles[premios[premios.length - 1]];
    const pct = CONFIG.descuentoPorNivel;
    const mensaje = premios.length > 1
      ? T.carrito.ganasVarios(nivel, premios.length, pct)
      : T.carrito.ganasYa(nivel, pct);
    const activo = seleccion?.tipo === "nuevo";
    // Si ya está usando uno guardado, el nuevo no se puede usar (uno por pedido)
    const ocupado = seleccion?.tipo === "guardado";
    bloques += `
      <div class="cupon cupon--nuevo ${activo ? "cupon--activo" : ""}">
        <p class="cupon__titulo">${mensaje}</p>
        ${ocupado
          ? `<p class="texto-suave">${T.carrito.unoPorPedido}</p>`
          : htmlBotonCupon(activo, `data-accion="cupon-nuevo"`, T.carrito.canjearAhora(pct))}
      </div>`;
  }

  return `
    <div class="descuentos">
      <p class="descuentos__titulo">${T.carrito.tusDescuentos}</p>
      ${bloques}
      <p class="texto-suave">${T.carrito.vigencia(CONFIG.diasVigenciaDescuento)}</p>
    </div>`;
}

function htmlResumen(totales, items) {
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
      ${htmlDescuentos(items)}
      ${htmlInsigniaCarrito(totales)}
      <button class="boton boton--ancho" type="button" data-accion="confirmar">${T.carrito.confirmar}</button>
      <p class="texto-suave">${T.carrito.simulado}</p>
      <p class="texto-suave">${T.carrito.beta}</p>
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
        ${htmlResumen(calcularTotales(items), items)}
      </div>
    </section>`;
}

function renderConfirmacion(pedido) {
  // Si subió de nivel, lo celebramos en grande; si no, le contamos
  // cuánto le falta para el siguiente (para que quiera volver).
  const insignia = estadoInsignia();
  let celebracion = "";
  if (pedido.subioNivel) {
    const pct = CONFIG.descuentoPorNivel;
    let texto = T.carrito.primeraInsignia(pedido.nivel);
    if (pedido.cuponesGanados > 0) {
      texto = pedido.canjeoAlInstante
        ? T.carrito.subisteYCanjeaste(pedido.nivel, pct)
        : T.carrito.subisteNivel(pedido.nivel, pct);
    }
    celebracion = `
      <div class="confirmacion__nivel">
        ${htmlIconoInsignia(insignia.indice, "icono-insignia--grande")}
        <p>${texto}</p>
      </div>`;
  }
  const mensajeNivel = `
    ${celebracion}
    <div class="confirmacion__progreso">
      <p>${T.carrito.tuInsignia}: <strong>${insignia.nombre}</strong></p>
      ${htmlBarraInsignia(insignia)}
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
        <p class="texto-suave">${T.carrito.beta}</p>
        <p class="texto-suave">${T.carrito.prendas(pedido.prendas)} · ${T.carrito.total} ${formatearPrecio(pedido.total)}</p>
        ${mensajeNivel}
        <div class="confirmacion__acciones">
          <a class="boton" href="perfil.html">${T.carrito.verPerfil}</a>
          <a class="boton-texto" href="catalogo.html">${T.carrito.seguirComprando}</a>
        </div>
      </div>
    </section>`;

  // Cada parte entra una tras otra, y después los bloques de la
  // insignia se llenan de a uno (para que se sienta el progreso)
  entrarEnCascada(".confirmacion > *");
  llenarBloques(".confirmacion .bloques span.lleno", 900);
}

function frasesDeCompra() {
  const frases = [...T.carrito.cargando];
  const usuario = getUsuario();
  if (usuario) frases[1] = T.carrito.cargandoNombre(usuario.nombre); // toque personal
  return frases;
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
  // Un número corto basado en la hora: suficiente para un prototipo
  const idPedido = String(Date.now()).slice(-6);

  // Cupones: se crean los que gana con este pedido y se marca como
  // usado el que haya elegido (uno guardado o el recién ganado)
  const cupones = getCupones();
  const nuevos = nivelesConPremioEntre(prendasAntes, prendasAntes + totales.prendas).map((i) => crearCupon(i));
  if (seleccion?.tipo === "nuevo" && nuevos.length) nuevos[0].usadoEn = idPedido;
  if (seleccion?.tipo === "guardado") {
    const usado = cupones.find((c) => c.id === seleccion.id);
    if (usado) usado.usadoEn = idPedido;
  }
  guardarCupones([...cupones, ...nuevos]);

  const pedido = {
    id: idPedido,
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
    // La primera insignia es de bienvenida; los cupones llegan desde Runner
    cuponesGanados: nuevos.length,
    canjeoAlInstante: seleccion?.tipo === "nuevo",
    estado: "confirmado",
  };

  guardarPedido(pedido);
  seleccion = null;
  procesandoCompra = true;
  vaciarCarrito();
  // Unos segundos de "estamos empacando tu pedido" y luego la confirmación
  await mostrarCarga(contenido, frasesDeCompra());
  renderConfirmacion(pedido);
  window.scrollTo(0, 0);
}

// ---------- Quitar con "Deshacer" ----------
// Quitar algo sin querer da rabia. Por eso guardamos lo que se quitó
// unos segundos y ofrecemos devolverlo (como la papelera del PC).
const MS_DESHACER = 6000;
let temporizadorDeshacer;

async function quitarConDeshacer(id, talla) {
  const carrito = getCarrito();
  const posicion = carrito.findIndex((i) => i.id === id && i.talla === talla);
  if (posicion < 0) return;
  const quitado = { ...carrito[posicion] };

  // Primero la prenda sale deslizándose, luego sí se quita de verdad
  const fila = contenido.querySelector(`[data-fila="${id}|${talla}"]`);
  if (fila) await salirDeslizando(fila);
  quitarDelCarrito(id, talla);
  mostrarDeshacer(quitado, posicion);
}

function mostrarDeshacer(item, posicion) {
  document.querySelector(".deshacer")?.remove();
  clearTimeout(temporizadorDeshacer);
  const nombre = buscarProducto(item.id)?.nombre ?? "";

  const barra = document.createElement("div");
  barra.className = "deshacer";
  barra.setAttribute("role", "status");
  barra.innerHTML = `
    <span>${escaparHTML(T.carrito.quitado(nombre))}</span>
    <button type="button">${T.carrito.deshacer}</button>`;
  document.body.append(barra);
  aparecer(barra, 20);

  barra.querySelector("button").addEventListener("click", () => {
    clearTimeout(temporizadorDeshacer);
    barra.remove();
    restaurarEnCarrito(item, posicion);
    mostrarAviso(T.carrito.restaurado(nombre));
  });
  temporizadorDeshacer = setTimeout(() => barra.remove(), MS_DESHACER);
}

// ---------- Eventos ----------
// Un solo oyente para todo el contenido (delegación): sirve aunque
// la lista se vuelva a pintar cada vez que cambia una cantidad.
contenido.addEventListener("click", (e) => {
  const boton = e.target.closest("button");
  if (!boton) return;
  const { id, talla, cambio, accion } = boton.dataset;

  if (cambio) {
    // Bajar de 1 a 0 es lo mismo que quitar: también ofrece "Deshacer"
    const item = getCarrito().find((i) => i.id === id && i.talla === talla);
    if (Number(cambio) < 0 && item?.cantidad === 1) quitarConDeshacer(id, talla);
    else cambiarCantidad(id, talla, Number(cambio));
  } else if (accion === "quitar") quitarConDeshacer(id, talla);
  else if (accion === "confirmar") confirmarPedido();
  // Tocar un descuento lo pone; tocarlo otra vez lo quita (vuelve a guardarse)
  else if (accion === "cupon-guardado") {
    const yaEstaba = seleccion?.tipo === "guardado" && seleccion.id === boton.dataset.cupon;
    seleccion = yaEstaba ? null : { tipo: "guardado", id: boton.dataset.cupon };
    renderCarrito();
  } else if (accion === "cupon-nuevo") {
    seleccion = seleccion?.tipo === "nuevo" ? null : { tipo: "nuevo" };
    renderCarrito();
  }
});

// Cada vez que el carrito cambia, se vuelve a pintar (salvo si ya
// estamos mostrando la confirmación del pedido)
window.addEventListener("carrito-cambio", () => {
  if (!procesandoCompra && !contenido.querySelector(".confirmacion")) renderCarrito();
});

renderCarrito();
