// ============================================================
// catalogo.js — El catálogo con filtros, orden y detalle
// ------------------------------------------------------------
// La idea: que explorar la ropa sea tan fácil como pasar fotos en
// Instagram, pero pudiendo filtrar y comparar (lo que hoy no se
// puede hacer por WhatsApp). La sección "Para ti" llega en la Fase 2.
// ============================================================

import {
  htmlTarjeta,
  htmlFoto,
  htmlPrecio,
  abrirModal,
  mostrarAviso,
  buscarProducto,
  capitalizar,
  escaparHTML,
  coincideGenero,
  buscarColeccion,
  productoEnColeccion,
} from "./app.js";
import { TEXTOS } from "./textos.js";
import { PRODUCTOS, CONFIG, GENEROS } from "./data/productos.js";
import { agregarAlCarrito } from "./storage.js";

const T = TEXTOS;
const contenido = document.getElementById("contenido");

// Lo que la persona tiene escogido ahora mismo. "" = todos.
const ESTADO_INICIAL = { tipo: "", color: "", talla: "", genero: "", coleccion: "", orden: "relevancia" };
const estado = { ...ESTADO_INICIAL };

// Si llega desde el inicio con ?genero=hombre o ?coleccion=bailar,
// arrancamos con ese filtro ya puesto.
const parametros = new URLSearchParams(location.search);
if (GENEROS[parametros.get("genero")]) estado.genero = parametros.get("genero");
if (buscarColeccion(parametros.get("coleccion"))) estado.coleccion = parametros.get("coleccion");

// Si un producto no trae tallas propias, usamos las generales (referenciales)
const tallasDe = (producto) => producto.tallas ?? CONFIG.tallas;

// Las opciones de los filtros salen de los mismos productos: si Chased
// agrega un color nuevo en productos.js, aparece solito en el filtro.
function valoresUnicos(campo) {
  return [...new Set(PRODUCTOS.map((p) => p[campo]))];
}

const OPCIONES = {
  tipo: valoresUnicos("tipo"),
  color: valoresUnicos("color"),
  talla: CONFIG.tallas,
};

// Guardamos los filtros de género y colección en la URL: así, si
// recargas o compartes el link, ves lo mismo.
function actualizarURL(productoId = "") {
  const params = new URLSearchParams();
  if (estado.genero) params.set("genero", estado.genero);
  if (estado.coleccion) params.set("coleccion", estado.coleccion);
  if (productoId) params.set("producto", productoId);
  const query = params.toString();
  history.replaceState(null, "", "catalogo.html" + (query ? "?" + query : ""));
}

// ---------- Filtrar y ordenar ----------
function productosVisibles() {
  const coleccion = buscarColeccion(estado.coleccion);
  const filtrados = PRODUCTOS.filter(
    (p) =>
      (!estado.tipo || p.tipo === estado.tipo) &&
      (!estado.color || p.color === estado.color) &&
      coincideGenero(p, estado.genero) &&
      (!coleccion || productoEnColeccion(p, coleccion)) &&
      (!estado.talla || tallasDe(p).includes(estado.talla))
  );

  // Copiamos antes de ordenar para no desordenar la lista original
  const lista = [...filtrados];
  if (estado.orden === "menor") lista.sort((a, b) => a.precio - b.precio);
  else if (estado.orden === "mayor") lista.sort((a, b) => b.precio - a.precio);
  else {
    // Recomendado: primero lo que es exacto del género elegido (ej. lo
    // de mujer antes que lo unisex), y luego los destacados.
    const puntos = (p) => (p.genero === estado.genero ? 2 : 0) + (p.destacado ? 1 : 0);
    lista.sort((a, b) => puntos(b) - puntos(a));
  }
  return lista;
}

// ---------- Pintar ----------
function htmlSelectFiltro(campo) {
  const opciones = OPCIONES[campo]
    .map((valor) => `<option value="${valor}">${escaparHTML(capitalizar(valor))}</option>`)
    .join("");
  return `
    <label class="campo">${T.catalogo.filtros[campo]}
      <select data-filtro="${campo}">
        <option value="">${T.catalogo.filtros.todos}</option>
        ${opciones}
      </select>
    </label>`;
}

function htmlSelectOrden() {
  const o = T.catalogo.ordenar;
  return `
    <label class="campo">${o.label}
      <select data-filtro="orden">
        <option value="relevancia">${o.relevancia}</option>
        <option value="menor">${o.menor}</option>
        <option value="mayor">${o.mayor}</option>
      </select>
    </label>`;
}

// Pestañas grandes de Todo / Hombre / Mujer: es lo primero que la
// gente busca, por eso no va escondido en un select.
function htmlPestanas() {
  const opciones = ["", ...Object.keys(GENEROS)];
  return `
    <div class="pestanas">
      ${opciones
        .map(
          (g) => `<button type="button" class="pestana" data-genero="${g}"
            aria-pressed="${estado.genero === g}">${g ? T.generos[g] : T.generos.todo}</button>`
        )
        .join("")}
    </div>`;
}

function htmlChipColeccion() {
  if (!estado.coleccion) return "";
  return `
    <p class="chip">${T.catalogo.coleccion}: ${T.colecciones[estado.coleccion].nombre}
      <button type="button" data-accion="quitar-coleccion" aria-label="${T.catalogo.quitarColeccion}">&times;</button>
    </p>`;
}

function renderEstructura() {
  contenido.innerHTML = `
    <section class="seccion contenedor">
      <h1>${T.catalogo.titulo}</h1>
      <div id="pestanas"></div>
      <div id="chip-coleccion"></div>
      <div class="filtros">
        ${["tipo", "color", "talla"].map(htmlSelectFiltro).join("")}
        ${htmlSelectOrden()}
      </div>
      <div class="filtros__pie">
        <span class="texto-suave" id="conteo"></span>
        <button class="boton-texto" type="button" id="limpiar">${T.catalogo.limpiarFiltros}</button>
      </div>
      <div id="resultados"></div>
    </section>`;
}

function renderProductos() {
  document.getElementById("pestanas").innerHTML = htmlPestanas();
  document.getElementById("chip-coleccion").innerHTML = htmlChipColeccion();
  actualizarURL();
  const lista = productosVisibles();
  document.getElementById("conteo").textContent = T.catalogo.resultados(lista.length);
  document.getElementById("resultados").innerHTML = lista.length
    ? `<div class="grilla">${lista.map(htmlTarjeta).join("")}</div>`
    : `<p class="vacio">${T.catalogo.sinResultados}</p>`;
}

// ---------- Detalle del producto (modal) ----------
function abrirDetalle(id) {
  const producto = buscarProducto(id);
  if (!producto) return;

  const botonesTalla = tallasDe(producto)
    .map((t) => `<button class="talla" type="button" aria-pressed="false" data-talla="${t}">${t}</button>`)
    .join("");

  const modal = abrirModal(`
    <div class="detalle">
      ${htmlFoto(producto)}
      <div class="modal__cuerpo">
        <h2>${escaparHTML(producto.nombre)}</h2>
        ${htmlPrecio(producto, true)}
        <p class="detalle__descripcion">${escaparHTML(producto.descripcion)}</p>
        <p class="texto-suave">${T.catalogo.color}: ${escaparHTML(capitalizar(producto.color))}</p>
        <fieldset class="tallas">
          <legend>${T.catalogo.elegirTalla}</legend>
          ${botonesTalla}
        </fieldset>
        <p class="error" aria-live="polite"></p>
        <button class="boton boton--ancho" type="button" data-accion="agregar">${T.catalogo.agregar}</button>
        <details class="guia-tallas">
          <summary>${T.catalogo.guiaTallas}</summary>
          <p>${T.catalogo.guiaTallasNota}</p>
        </details>
      </div>
    </div>`);

  let tallaElegida = null;
  const error = modal.querySelector(".error");

  // Solo una talla puede estar marcada a la vez (como un radio, pero más bonito)
  modal.querySelectorAll(".talla").forEach((boton) => {
    boton.addEventListener("click", () => {
      modal.querySelectorAll(".talla").forEach((b) => b.setAttribute("aria-pressed", "false"));
      boton.setAttribute("aria-pressed", "true");
      tallaElegida = boton.dataset.talla;
      error.textContent = "";
    });
  });

  // Agregar al carrito NO pide registro: eso llega solo al confirmar el pedido
  modal.querySelector('[data-accion="agregar"]').addEventListener("click", () => {
    if (!tallaElegida) {
      error.textContent = T.catalogo.errorTalla;
      return;
    }
    agregarAlCarrito(producto.id, tallaElegida);
    modal.close();
    mostrarAviso(T.general.agregado(producto.nombre));
  });

  // Mientras el detalle está abierto, el producto queda en la URL;
  // al cerrar lo quitamos pero dejamos los filtros como estaban.
  actualizarURL(producto.id);
  modal.addEventListener("close", () => actualizarURL());
}

// ---------- Eventos ----------
function conectarEventos() {
  contenido.querySelectorAll("[data-filtro]").forEach((select) => {
    select.addEventListener("change", () => {
      estado[select.dataset.filtro] = select.value;
      renderProductos();
    });
  });

  document.getElementById("limpiar").addEventListener("click", () => {
    Object.assign(estado, ESTADO_INICIAL);
    contenido.querySelectorAll("[data-filtro]").forEach((s) => (s.value = estado[s.dataset.filtro]));
    renderProductos();
  });

  // Pestañas y chip se vuelven a pintar, así que los escuchamos desde arriba
  contenido.addEventListener("click", (e) => {
    const pestana = e.target.closest(".pestana");
    if (pestana) {
      estado.genero = pestana.dataset.genero;
      renderProductos();
    }
    if (e.target.closest('[data-accion="quitar-coleccion"]')) {
      estado.coleccion = "";
      renderProductos();
    }
  });

  // Delegación: un solo "oído" en el contenedor escucha los clics de
  // todas las tarjetas, aunque se vuelvan a pintar con cada filtro.
  document.getElementById("resultados").addEventListener("click", (e) => {
    const tarjeta = e.target.closest(".tarjeta");
    if (!tarjeta) return;
    e.preventDefault();
    abrirDetalle(tarjeta.dataset.id);
  });
}

renderEstructura();
renderProductos();
conectarEventos();

// Si venimos del inicio con un producto en la URL, abrimos su detalle de una
const idEnUrl = parametros.get("producto");
if (idEnUrl) abrirDetalle(idEnUrl);
