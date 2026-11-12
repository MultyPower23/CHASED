// ============================================================
// maniqui.js — Mi closet y el maniquí (BOCETO / beta)
// ------------------------------------------------------------
// Es una versión sencilla de lo que haría una IA: hoy el maniquí
// son 3 casillas (arriba, abajo, extra) y "Armar por mí" funciona
// con palabras clave y los tags de estilo de cada prenda. Suficiente
// para mostrar la idea en la demo sin prometer magia.
// ============================================================

import { htmlFoto, buscarProducto, escaparHTML, capitalizar, mostrarAviso, pedirRegistro } from "./app.js";
import { TEXTOS } from "./textos.js";
import { PRODUCTOS, CASILLA_POR_TIPO } from "./data/productos.js";
import { getUsuario, getPedidos, getClosetManual, agregarAlCloset, getQuiz, guardarOutfit } from "./storage.js";
import { aparecer, rebotar } from "./animaciones.js";

const T = TEXTOS;
const M = T.maniqui;
const contenido = document.getElementById("contenido");
const CASILLAS = ["arriba", "abajo", "extra"];

// Lo que tiene puesto el maniquí ahora: { arriba: id, abajo: id, extra: id }
const outfit = { arriba: null, abajo: null, extra: null };
let pestana = "closet";

// ---------- El closet ----------
// Lo comprado (sale de los pedidos) + lo que agregó a mano, sin repetir
function idsComprados() {
  return getPedidos().flatMap((p) => p.items.map((i) => i.id));
}

function prendasDelCloset() {
  const ids = [...new Set([...idsComprados(), ...getClosetManual()])];
  return ids.map(buscarProducto).filter(Boolean);
}

// ---------- Poner prendas en el maniquí ----------
// Cada tipo tiene su casilla. Si "arriba" ya está ocupada y llega otra
// prenda de arriba, va a "extra" como segunda capa (ej. hoodie encima).
function ponerPrenda(id) {
  const producto = buscarProducto(id);
  let casilla = CASILLA_POR_TIPO[producto.tipo] ?? "extra";
  if (casilla === "arriba" && outfit.arriba && outfit.arriba !== id) casilla = "extra";
  outfit[casilla] = id;
  renderManiqui();
  rebotar(document.querySelector(`[data-casilla="${casilla}"]`));
}

// ---------- "Armar por mí" ----------
// 1) Del plan que escribió sacamos un estilo (bailar → flow...).
//    Si no dice nada conocido, usamos su estilo del quiz o "minimal".
// 2) Buscamos la mejor prenda de arriba y de abajo con ese estilo,
//    PRIMERO en su closet y, si no hay, en el catálogo.
function estiloDelPlan(texto) {
  const plan = texto.toLowerCase();
  const encontrado = Object.entries(M.palabrasClave).find(([, palabras]) =>
    palabras.some((p) => plan.includes(p))
  );
  return encontrado?.[0] ?? getQuiz()?.estilo ?? "minimal";
}

function mejorPrenda(casilla, estilo, excluir = []) {
  const sirve = (p) => CASILLA_POR_TIPO[p.tipo] === casilla && !excluir.includes(p.id);
  const conEstilo = (lista) => lista.filter((p) => sirve(p) && p.tags.includes(estilo));
  const delCloset = conEstilo(prendasDelCloset());
  const delCatalogo = conEstilo(PRODUCTOS);
  const opciones = delCloset.length ? delCloset : delCatalogo.length ? delCatalogo : PRODUCTOS.filter(sirve);
  // Un poquito de azar para que no salga siempre lo mismo
  return opciones[Math.floor(Math.random() * opciones.length)]?.id ?? null;
}

function armarPorMi(plan) {
  const estilo = estiloDelPlan(plan);
  outfit.arriba = mejorPrenda("arriba", estilo);
  outfit.abajo = mejorPrenda("abajo", estilo);
  outfit.extra = null;
  renderManiqui();
  renderPrendas();
  mostrarAviso(M.armado);
  document.querySelectorAll(".casilla").forEach((c, i) => setTimeout(() => rebotar(c), i * 120));
}

// Recomendaciones: prendas del catálogo que comparten estilo con lo
// que lleva puesto y que todavía no están en el outfit
function recomendaciones() {
  const puestos = CASILLAS.map((c) => outfit[c]).filter(Boolean);
  if (!puestos.length) return [];
  const tags = new Set(puestos.flatMap((id) => buscarProducto(id).tags));
  return PRODUCTOS.filter((p) => !puestos.includes(p.id) && p.tags.some((t) => tags.has(t))).slice(0, 4);
}

// ---------- Publicar en la comunidad ----------
async function publicar() {
  if (!outfit.arriba || !outfit.abajo) return mostrarAviso(M.errorPublicar);
  const usuario = getUsuario() ?? (await pedirRegistro(M.registroPublicar));
  if (!usuario) return;
  guardarOutfit({
    id: `o-${Date.now()}`,
    autor: usuario.nombre,
    correo: usuario.correo,
    prendas: CASILLAS.map((c) => outfit[c]).filter(Boolean),
  });
  document.getElementById("publicado").innerHTML = `
    <p>${M.publicado}</p>
    <a class="boton boton--invertido" href="comunidad.html#outfits">${M.verComunidad}</a>`;
  document.getElementById("publicado").classList.remove("oculto");
  aparecer(document.getElementById("publicado"));
}

// ---------- Pintar ----------
function htmlCasilla(casilla) {
  const producto = outfit[casilla] ? buscarProducto(outfit[casilla]) : null;
  return `
    <div class="casilla ${producto ? "casilla--llena" : ""} casilla--${casilla}" data-casilla="${casilla}">
      <span class="casilla__nombre">${M.casillas[casilla]}</span>
      ${producto
        ? `${htmlFoto(producto)}
           <div class="casilla__info">
             <span>${escaparHTML(producto.nombre)}</span>
             <button class="boton-texto" type="button" data-quitar="${casilla}">${M.quitar}</button>
           </div>`
        : `<p class="casilla__vacia">${M.casillaVacia}</p>`}
    </div>`;
}

function renderManiqui() {
  document.getElementById("maniqui").innerHTML = CASILLAS.map(htmlCasilla).join("");
  const recos = recomendaciones();
  document.getElementById("recos").innerHTML = recos.length
    ? `<h3>${M.recomendacion}</h3>
       <div class="recos">${recos.map((p) => htmlMiniPrenda(p)).join("")}</div>`
    : "";
}

function htmlMiniPrenda(producto, comprada = false) {
  const puesto = CASILLAS.some((c) => outfit[c] === producto.id);
  return `
    <button class="mini-prenda ${puesto ? "mini-prenda--puesta" : ""}" type="button" data-poner="${producto.id}">
      ${htmlFoto(producto)}
      <span class="mini-prenda__nombre">${escaparHTML(producto.nombre)}</span>
      <span class="texto-suave">${escaparHTML(capitalizar(producto.color))}${comprada ? ` · ${M.deCompra}` : ""}</span>
    </button>`;
}

function renderPrendas() {
  document.querySelectorAll("[data-pestana]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.pestana === pestana));
  const lugar = document.getElementById("prendas");
  if (pestana === "catalogo") {
    lugar.innerHTML = `<div class="mini-grilla">${PRODUCTOS.map((p) => htmlMiniPrenda(p)).join("")}</div>`;
    return;
  }
  const comprados = idsComprados();
  const closet = prendasDelCloset();
  const opciones = PRODUCTOS.map((p) => `<option value="${p.id}">${escaparHTML(p.nombre)} · ${escaparHTML(p.color)}</option>`).join("");
  lugar.innerHTML = `
    ${closet.length
      ? `<div class="mini-grilla">${closet.map((p) => htmlMiniPrenda(p, comprados.includes(p.id))).join("")}</div>`
      : `<p class="aviso-borde">${M.closetVacio}</p>`}
    <form class="agregar-closet" id="form-closet">
      <label class="campo">${M.agregarPrenda}
        <select name="prenda"><option value="">${M.elegirPrenda}</option>${opciones}</select>
      </label>
      <button class="boton boton--claro" type="submit">${M.agregar}</button>
    </form>`;
}

function render() {
  contenido.innerHTML = `
    <section class="seccion contenedor">
      <div class="maniqui-cabecera">
        <h1>${M.titulo}</h1>
        <p class="beta"><strong>${M.beta}</strong><span>${M.betaTexto}</span></p>
      </div>

      <div class="maniqui-layout">
        <div>
          <h2>${M.maniqui}</h2>
          <div class="maniqui" id="maniqui"></div>
          <form class="armar" id="form-armar">
            <label class="campo">${M.peticion}
              <input name="plan" type="text" maxlength="60">
            </label>
            <button class="boton" type="submit">${M.armarPorMi}</button>
          </form>
          <div class="maniqui-acciones">
            <button class="boton boton--grande boton--ancho" type="button" data-accion="publicar">${M.publicar}</button>
            <button class="boton-texto" type="button" data-accion="limpiar">${M.limpiar}</button>
          </div>
          <div class="publicado oculto" id="publicado"></div>
        </div>

        <div>
          <div class="pestanas">
            <button class="pestana" type="button" data-pestana="closet">${M.pestanas.closet}</button>
            <button class="pestana" type="button" data-pestana="catalogo">${M.pestanas.catalogo}</button>
          </div>
          <div id="prendas"></div>
          <div class="recos-bloque" id="recos"></div>
        </div>
      </div>
    </section>`;
  renderManiqui();
  renderPrendas();
}

// ---------- Eventos ----------
contenido.addEventListener("click", (e) => {
  const poner = e.target.closest("[data-poner]");
  if (poner) {
    ponerPrenda(poner.dataset.poner);
    renderPrendas(); // para marcar cuál está puesta
    return;
  }
  const quitar = e.target.closest("[data-quitar]");
  if (quitar) {
    outfit[quitar.dataset.quitar] = null;
    renderManiqui();
    renderPrendas();
    return;
  }
  const tab = e.target.closest("[data-pestana]");
  if (tab) {
    pestana = tab.dataset.pestana;
    renderPrendas();
    return;
  }
  const accion = e.target.closest("[data-accion]")?.dataset.accion;
  if (accion === "publicar") publicar();
  if (accion === "limpiar") {
    CASILLAS.forEach((c) => (outfit[c] = null));
    document.getElementById("publicado").classList.add("oculto");
    renderManiqui();
    renderPrendas();
  }
});

contenido.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.id === "form-armar") armarPorMi(e.target.plan.value);
  if (e.target.id === "form-closet") {
    const id = e.target.prenda.value;
    if (!id) return;
    agregarAlCloset(id);
    mostrarAviso(M.agregadaCloset(buscarProducto(id).nombre));
    renderPrendas();
  }
});

render();
