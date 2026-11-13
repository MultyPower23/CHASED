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
  buscarProducto,
  capitalizar,
  formatearPrecio,
  mostrarAviso,
  escaparHTML,
  coincideGenero,
  buscarColeccion,
  productoEnColeccion,
} from "./app.js";
import { TEXTOS } from "./textos.js";
import { PRODUCTOS, CONFIG, GENEROS } from "./data/productos.js";
import { agregarAlCarrito, contarPrendasCarrito } from "./storage.js";
import { aparecer, rebotar } from "./animaciones.js";
import {
  htmlAvatar,
  ponerEn,
  idsDelOutfit,
  CASILLAS,
  getBorrador,
  guardarBorrador,
  guardarConjunto,
  outfitCompleto,
} from "./conjuntos.js";
import { recomendarParaTi, puntajeProducto } from "./recomendador.js";

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
    // de mujer antes que lo unisex), luego lo que va con tus gustos
    // (quiz y compras, según el recomendador) y por último los destacados.
    const puntos = (p) =>
      (p.genero === estado.genero ? 10 : 0) + puntajeProducto(p) * 2 + (p.destacado ? 1 : 0);
    lista.sort((a, b) => puntos(b) - puntos(a));
  }
  return lista;
}

// ---------- "Para ti" ----------
// Se calcula UNA vez al abrir la página (tiene algo de azar, y si
// cambiara con cada filtro se sentiría como que salta).
const paraTi = recomendarParaTi(8);

const SUBTITULOS_PARA_TI = {
  quiz: () => T.catalogo.paraTiEstilo(T.quiz.estilos[paraTi.estilo]?.nombre ?? ""),
  compras: () => T.catalogo.paraTiCompras,
  destacados: () => T.catalogo.paraTiSinDatos,
};

function hayFiltros() {
  return ["tipo", "color", "talla", "genero", "coleccion"].some((campo) => estado[campo]);
}

function htmlParaTi() {
  const tarjetas = paraTi.lista
    .map(
      ({ producto, descubre }) => `
      <div class="para-ti__item">
        ${descubre ? `<span class="etiqueta etiqueta--sobre">${T.catalogo.descubre}</span>` : ""}
        ${htmlTarjeta(producto)}
      </div>`
    )
    .join("");
  const linkQuiz = paraTi.modo === "destacados"
    ? ` <a href="quiz.html">${T.inicio.quizBoton}</a>`
    : "";
  return `
    <div class="para-ti">
      <h2 class="titulo-ch"><img src="assets/logo/simbolo-ch-negro.png" alt="">${T.catalogo.paraTi}</h2>
      <p class="texto-suave">${SUBTITULOS_PARA_TI[paraTi.modo]()}${linkQuiz}</p>
      <div class="fila-scroll">${tarjetas}</div>
    </div>`;
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
      <div id="para-ti"></div>
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
  // "Para ti" solo se muestra cuando está viendo todo: si ya filtró,
  // sabe lo que busca y no le estorbamos.
  document.getElementById("para-ti").innerHTML = hayFiltros() ? "" : htmlParaTi();
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
        <button class="boton boton--claro boton--ancho boton--separado" type="button" data-accion="probar">${T.conjunto.probar}</button>
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
    mostrarAgregado(producto, tallaElegida);
  });

  // "Probar en conjunto": no compra nada, solo lo pone en el panel
  modal.querySelector('[data-accion="probar"]').addEventListener("click", () => {
    const borrador = getBorrador();
    ponerEn(borrador, producto.id);
    guardarBorrador(borrador);
    modal.close();
    renderBarraConjunto();
    rebotar(document.querySelector(".barra-conjunto"));
    mostrarAviso(T.conjunto.agregado(producto.nombre));
  });

  // Mientras el detalle está abierto, el producto queda en la URL;
  // al cerrar lo quitamos pero dejamos los filtros como estaban.
  actualizarURL(producto.id);
  modal.addEventListener("close", () => actualizarURL());
}

// ---------- Panel "¡Quedó en tu carrito!" ----------
// En vez de un avisito que se va solo, le preguntamos qué quiere
// hacer: ir a pagar o seguir mirando. Como en una tienda física,
// cuando el vendedor te pregunta "¿te lo llevo a caja o sigues viendo?".
function mostrarAgregado(producto, talla) {
  const panel = abrirModal(
    `<div class="agregado">
      <div class="agregado__producto">
        ${htmlFoto(producto)}
        <div>
          <p class="agregado__titulo">${T.carrito.agregadoTitulo}</p>
          <h2>${escaparHTML(producto.nombre)}</h2>
          <p class="texto-suave">${escaparHTML(capitalizar(producto.color))} · ${T.carrito.talla} ${talla}</p>
          ${htmlPrecio(producto)}
        </div>
      </div>
      <div class="agregado__acciones">
        <a class="boton boton--ancho boton--grande" href="carrito.html">${T.carrito.irAlCarrito(contarPrendasCarrito())}</a>
        <button class="boton boton--claro boton--ancho" type="button" data-accion="seguir">${T.carrito.seguirNavegando}</button>
      </div>
    </div>`,
    { chico: true }
  );
  panel.classList.add("modal--hoja");
  panel.querySelector('[data-accion="seguir"]').addEventListener("click", () => panel.close());
  aparecer(panel, 60);
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
  contenido.addEventListener("click", (e) => {
    const tarjeta = e.target.closest(".tarjeta");
    if (!tarjeta) return;
    e.preventDefault();
    abrirDetalle(tarjeta.dataset.id);
  });
}

// ---------- Panel "Armar conjunto" ----------
// Un botón flotante abajo abre un panel (como un menú que se
// despliega) donde se ve el conjunto en el avatar ANTES de comprar.
// Se puede comprar todo junto o solo lo que guste.
function renderBarraConjunto() {
  let barra = document.querySelector(".barra-conjunto");
  if (!barra) {
    barra = document.createElement("button");
    barra.type = "button";
    barra.className = "barra-conjunto";
    barra.addEventListener("click", abrirPanelConjunto);
    document.body.append(barra);
  }
  const n = idsDelOutfit(getBorrador()).length;
  barra.textContent = T.conjunto.abrir(n);
  barra.classList.toggle("barra-conjunto--llena", n > 0);
  // Solo se muestra cuando ya hay algo en el conjunto (menos ruido)
  barra.classList.toggle("oculto", n === 0);
  document.body.classList.toggle("con-barra-conjunto", n > 0);
}

function htmlPiezaConjunto(casilla, id) {
  const p = buscarProducto(id);
  const tallas = tallasDe(p).map((t) => `<option>${t}</option>`).join("");
  return `
    <li class="pieza" data-casilla="${casilla}">
      ${htmlFoto(p)}
      <div>
        <span class="slot__casilla">${T.maniqui.casillas[casilla]}</span>
        <h3>${escaparHTML(p.nombre)}</h3>
        ${htmlPrecio(p)}
        <div class="pieza__fila">
          <select aria-label="${T.catalogo.elegirTalla}" data-talla-de="${id}">
            <option value="">${T.catalogo.filtros.talla}</option>${tallas}
          </select>
          <button class="boton-texto" type="button" data-sacar="${casilla}">${T.maniqui.quitar}</button>
        </div>
      </div>
    </li>`;
}

function abrirPanelConjunto() {
  const panel = abrirModal(`<div class="modal__cuerpo panel-conjunto"></div>`);
  panel.classList.add("modal--hoja");
  const cuerpo = panel.querySelector(".panel-conjunto");

  const pintar = () => {
    const borrador = getBorrador();
    const piezas = CASILLAS.filter((c) => borrador[c]);
    const total = piezas.reduce((suma, c) => suma + buscarProducto(borrador[c]).precio, 0);
    cuerpo.innerHTML = `
      <h2>${T.conjunto.titulo}</h2>
      <p class="texto-suave">${T.conjunto.ayuda}</p>
      <div class="panel-conjunto__layout">
        <div class="panel-conjunto__avatar">${htmlAvatar(borrador, "catalogo")}</div>
        <div>
          ${piezas.length
            ? `<ul class="piezas">${piezas.map((c) => htmlPiezaConjunto(c, borrador[c])).join("")}</ul>
               <div class="resumen__fila resumen__fila--total">
                 <span>${T.conjunto.total}</span>
                 <strong>${formatearPrecio(total)} <span class="precio__nota">· ${T.general.referencial}</span></strong>
               </div>
               <p class="error" aria-live="polite"></p>
               <div class="panel-conjunto__botones">
                 <button class="boton boton--grande" type="button" data-panel="todo">${T.conjunto.agregarTodo}</button>
                 <button class="boton boton--claro" type="button" data-panel="guardar">${T.maniqui.guardar}</button>
                 <a class="boton-texto" href="maniqui.html">${T.conjunto.abrirCloset}</a>
               </div>`
            : `<p class="aviso-borde">${T.conjunto.vacio}</p>`}
        </div>
      </div>`;
  };

  cuerpo.addEventListener("click", (e) => {
    const borrador = getBorrador();
    const sacar = e.target.closest("[data-sacar]");
    if (sacar) {
      borrador[sacar.dataset.sacar] = null;
      guardarBorrador(borrador);
      renderBarraConjunto();
      return pintar();
    }
    const accion = e.target.closest("[data-panel]")?.dataset.panel;
    if (accion === "todo") {
      // Cada prenda necesita su talla antes de ir al carrito
      const selects = [...cuerpo.querySelectorAll("[data-talla-de]")];
      if (selects.some((s) => !s.value)) return (cuerpo.querySelector(".error").textContent = T.conjunto.faltanTallas);
      selects.forEach((s) => agregarAlCarrito(s.dataset.tallaDe, s.value));
      panel.close();
      mostrarAviso(T.conjunto.agregadoTodo(selects.length));
    }
    if (accion === "guardar") {
      if (!outfitCompleto(borrador)) return (cuerpo.querySelector(".error").textContent = T.maniqui.errorIncompleto);
      guardarConjunto("", borrador);
      mostrarAviso(T.maniqui.guardado);
    }
  });

  pintar();
  aparecer(cuerpo, 40);
}

renderEstructura();
renderProductos();
conectarEventos();
renderBarraConjunto();

// Si venimos del inicio con un producto en la URL, abrimos su detalle de una
const idEnUrl = parametros.get("producto");
if (idEnUrl) abrirDetalle(idEnUrl);
