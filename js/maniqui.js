// ============================================================
// maniqui.js — Mi closet y el vestidor (BOCETO / beta)
// ------------------------------------------------------------
// Tres partes:
// 1) El vestidor: avatar al centro, casillas a un lado y tarjetas de
//    prendas al otro, como cuando te equipas algo en un videojuego.
// 2) Tu closet: solo lo comprado o lo que traía tu caja (QR), con el
//    "¿Con qué combino esto?".
// 3) Mis conjuntos: los que guardaste y publicaste.
// Lo de "IA" es simulado con reglas sencillas (estilos y colores).
// ============================================================

import {
  htmlFoto,
  buscarProducto,
  escaparHTML,
  capitalizar,
  mostrarAviso,
  pedirRegistro,
  abrirModal,
  formatoFecha,
  nocheMientrasSeVea,
} from "./app.js";
import { TEXTOS } from "./textos.js";
import { PRODUCTOS } from "./data/productos.js";
import { getUsuario, getQuiz, guardarOutfit, quitarOutfits } from "./storage.js";
import { aparecer, rebotar } from "./animaciones.js";
import {
  CASILLAS,
  prendasDelCloset,
  idsDelCloset,
  escanearCaja,
  codigosDemo,
  casillaDe,
  ponerEn,
  idsDelOutfit,
  htmlAvatar,
  sugerenciaPara,
  sugerirNombre,
  guardarConjunto,
  misConjuntos,
  upsertConjunto,
  actualizarConjunto,
  getBorrador,
  guardarBorrador,
} from "./conjuntos.js";

const T = TEXTOS;
const M = T.maniqui;
const contenido = document.getElementById("contenido");

// Si viene del catálogo con un conjunto armado, arrancamos con ese
const outfit = { ...getBorrador() };
let modo = "mezcla"; // "mio" | "mezcla" | "nuevo"
let nombreOutfit = "";

// ============================================================
// Qué prendas se ofrecen según el modo
// ============================================================

function prendasDisponibles() {
  const mias = idsDelCloset();
  if (modo === "mio") return mias.map(buscarProducto);
  if (modo === "nuevo") return PRODUCTOS.filter((p) => !mias.includes(p.id));
  // Mezclar: lo tuyo primero y luego el resto del catálogo
  return [...mias.map(buscarProducto), ...PRODUCTOS.filter((p) => !mias.includes(p.id))];
}

// ============================================================
// "Armar por mí": plan → estilo → la mejor prenda para cada casilla
// ============================================================

function estiloDelPlan(texto) {
  const plan = texto.toLowerCase();
  const encontrado = Object.entries(M.palabrasClave).find(([, palabras]) => palabras.some((p) => plan.includes(p)));
  return encontrado?.[0] ?? getQuiz()?.estilo ?? "minimal";
}

function elegir(casilla, estilo) {
  const opciones = prendasDisponibles().filter((p) => casillaDe(p) === casilla);
  const conEstilo = opciones.filter((p) => p.tags.includes(estilo));
  const lista = conEstilo.length ? conEstilo : opciones;
  // En "Mezclar", si tiene algo suyo que sirva, lo preferimos
  const mias = idsDelCloset();
  const suyas = lista.filter((p) => mias.includes(p.id));
  const final = modo === "mezcla" && suyas.length ? suyas : lista;
  return final[Math.floor(Math.random() * final.length)]?.id ?? null;
}

function armarPorMi(plan) {
  const estilo = estiloDelPlan(plan);
  const arriba = elegir("arriba", estilo);
  const abajo = elegir("abajo", estilo);
  if (!arriba || !abajo) return mostrarAviso(M.faltaParaArmar);
  Object.assign(outfit, { arriba, abajo, extra: null });
  nombreOutfit = "";
  cambioDeOutfit();
  mostrarAviso(M.armado);
}

// ============================================================
// Vestidor
// ============================================================

function htmlSlot(casilla) {
  const producto = outfit[casilla] && buscarProducto(outfit[casilla]);
  return `
    <div class="slot ${producto ? "slot--lleno" : ""}" data-slot="${casilla}">
      <div class="slot__foto">${producto ? htmlFoto(producto) : ""}</div>
      <div class="slot__texto">
        <span class="slot__casilla">${M.casillas[casilla]}</span>
        <span class="slot__nombre">${producto ? escaparHTML(producto.nombre) : M.casillaVacia}</span>
        ${producto ? `<button class="slot__quitar" type="button" data-quitar="${casilla}">${M.quitar}</button>` : ""}
      </div>
    </div>`;
}

// Tarjeta "de videojuego": foto, nombre, color y los estilos como "stats"
function htmlCarta(producto, mias) {
  const puesta = idsDelOutfit(outfit).includes(producto.id);
  const esMia = mias.includes(producto.id);
  return `
    <button class="carta ${puesta ? "carta--puesta" : ""}" type="button" data-poner="${producto.id}">
      <span class="carta__sello ${esMia ? "carta__sello--mia" : ""}">${puesta ? M.equipada : esMia ? M.tuya : M.nueva}</span>
      ${htmlFoto(producto)}
      <span class="carta__nombre">${escaparHTML(producto.nombre)}</span>
      <span class="carta__color">${escaparHTML(capitalizar(producto.color))} · ${M.casillas[casillaDe(producto)]}</span>
      <span class="carta__stats">${producto.tags.map((t) => `<i>${T.quiz.estilos[t]?.nombre ?? t}</i>`).join("")}</span>
    </button>`;
}

function renderVestidor() {
  document.getElementById("slots").innerHTML = CASILLAS.map(htmlSlot).join("");
  document.getElementById("avatar").innerHTML = htmlAvatar(outfit, "vestidor");
  const mias = idsDelCloset();
  const prendas = prendasDisponibles();
  document.getElementById("cartas").innerHTML = prendas.length
    ? prendas.map((p) => htmlCarta(p, mias)).join("")
    : `<p class="vestidor__vacio">${M.sinPrendas}</p>`;
  document.querySelectorAll("[data-modo]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.modo === modo));
  document.getElementById("modo-ayuda").textContent = M.modosAyuda[modo];
  const campoNombre = document.getElementById("nombre-outfit");
  if (campoNombre.value !== nombreOutfit) campoNombre.value = nombreOutfit;
}

// Cada vez que cambia el outfit: repintar y recordar el borrador
function cambioDeOutfit() {
  guardarBorrador(outfit);
  renderVestidor();
  aparecer(document.querySelector(".avatar-svg"), 8);
}

// ============================================================
// Guardar y publicar
// ============================================================

const outfitCompleto = () => outfit.arriba && outfit.abajo;

function guardar() {
  if (!outfitCompleto()) return mostrarAviso(M.errorIncompleto);
  guardarConjunto(nombreOutfit.trim(), outfit);
  mostrarAviso(M.guardado);
  renderConjuntos();
}

async function publicarConjunto(conjunto) {
  const usuario = getUsuario() ?? (await pedirRegistro(M.registroPublicar));
  if (!usuario) return false;
  // Guardamos el id del outfit publicado para poder quitarlo después
  const outfitId = `o-${Date.now()}`;
  guardarOutfit({
    id: outfitId,
    nombre: conjunto.nombre,
    autor: usuario.nombre,
    correo: usuario.correo,
    prendas: idsDelOutfit(conjunto.prendas),
  });
  actualizarConjunto(conjunto.id, { publicado: true, outfitId });
  renderConjuntos();
  return true;
}

// Quita el outfit de Comunidad. Los publicados antes de este cambio
// no tienen outfitId, así que también buscamos por la misma ropa.
function quitarDeComunidad(conjunto) {
  const ropa = idsDelOutfit(conjunto.prendas).sort().join("|");
  const correo = getUsuario()?.correo;
  quitarOutfits(
    (o) => o.id === conjunto.outfitId || (o.correo === correo && [...o.prendas].sort().join("|") === ropa)
  );
  actualizarConjunto(conjunto.id, { publicado: false, outfitId: null });
}

async function publicarActual() {
  if (!outfitCompleto()) return mostrarAviso(M.errorIncompleto);
  // Si ya existe ese conjunto (misma ropa), se publica ESE; no se duplica
  const conjunto = upsertConjunto(nombreOutfit.trim(), outfit);
  if (conjunto.publicado) return mostrarAviso(M.publicado);
  if (!(await publicarConjunto(conjunto))) return;
  const aviso = document.getElementById("publicado");
  aviso.innerHTML = `<p>${M.publicado}</p><a class="boton boton--invertido" href="comunidad.html#outfits">${M.verComunidad}</a>`;
  aviso.classList.remove("oculto");
  aparecer(aviso);
}

// ============================================================
// Tu closet + "¿Con qué combino esto?"
// ============================================================

function renderCloset() {
  const prendas = prendasDelCloset();
  document.getElementById("closet").innerHTML = prendas.length
    ? prendas
        .map(
          ({ producto, origen }) => `
          <article class="prenda-closet">
            ${htmlFoto(producto)}
            <div class="prenda-closet__info">
              <span class="carta__sello carta__sello--mia">${origen === "compra" ? M.deCompra : M.deCaja}</span>
              <h3>${escaparHTML(producto.nombre)}</h3>
              <p class="texto-suave">${escaparHTML(capitalizar(producto.color))}</p>
              <button class="boton boton--claro boton--chico" type="button" data-combinar="${producto.id}">${M.combinarBoton}</button>
            </div>
          </article>`
        )
        .join("")
    : `<p class="aviso-borde">${M.sinPrendas}</p>`;
}

function mostrarCombinacion(id) {
  const { texto, ejemplo } = sugerenciaPara(id);
  const lugar = document.getElementById("combinacion");
  lugar.innerHTML = `
    <div class="consejo">
      <p class="consejo__texto">${escaparHTML(texto)}</p>
      ${ejemplo
        ? `<p class="texto-suave">${M.ejemploStock}</p>
           <div class="consejo__ejemplo">
             ${htmlFoto(ejemplo)}
             <div>
               <h3>${escaparHTML(ejemplo.nombre)}</h3>
               <p class="texto-suave">${escaparHTML(capitalizar(ejemplo.color))}</p>
               <div class="consejo__botones">
                 <button class="boton boton--chico" type="button" data-probar="${id}|${ejemplo.id}">${M.probarAvatar}</button>
                 <a class="boton-texto" href="catalogo.html?producto=${ejemplo.id}">${T.catalogo.titulo}</a>
               </div>
             </div>
           </div>`
        : ""}
    </div>`;
  aparecer(lugar.firstElementChild, 14);
  lugar.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// QR de la caja (simulado): visor de cámara + campo para el código
function abrirEscaner() {
  const modal = abrirModal(
    `<div class="modal__cuerpo escaner">
      <h2>${M.qrTitulo}</h2>
      <p>${M.qrTexto}</p>
      <div class="visor" aria-hidden="true"><span class="visor__linea"></span></div>
      <p class="texto-suave">${M.qrSimulado}</p>
      <form class="formulario" novalidate>
        <label class="campo">${M.qrCodigo}
          <input name="codigo" type="text" autocomplete="off" placeholder="CH-CAJA-01">
        </label>
        <p class="error" aria-live="polite"></p>
        <button class="boton boton--ancho" type="submit">${M.qrAgregar}</button>
        <p class="texto-suave">${M.qrDemo(codigosDemo())}</p>
      </form>
    </div>`,
    { chico: true }
  );
  const form = modal.querySelector("form");
  form.codigo.focus();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const resultado = escanearCaja(form.codigo.value);
    if (!resultado.ok) return (modal.querySelector(".error").textContent = resultado.mensaje);
    modal.close();
    mostrarAviso(resultado.mensaje);
    renderCloset();
    renderVestidor();
  });
}

// ============================================================
// Mis conjuntos
// ============================================================

// Una sola tarjeta por conjunto, con sus dos marcas (Guardado /
// Publicado) y los botones que tengan sentido según cada una
function htmlConjunto(c) {
  const prendas = idsDelOutfit(c.prendas).map(buscarProducto).filter(Boolean);
  const marcas = [
    c.guardado ? `<span class="etiqueta">${M.estadoGuardado}</span>` : "",
    c.publicado ? `<span class="etiqueta etiqueta--negra">${M.estadoPublicado}</span>` : "",
  ].join("");
  const botones = [
    `<button class="boton boton--chico" type="button" data-cargar="${c.id}">${M.cargar}</button>`,
    c.publicado
      ? `<button class="boton-texto" type="button" data-quitar-pub="${c.id}">${M.quitarPublicacion}</button>`
      : `<button class="boton boton--claro boton--chico" type="button" data-publicar="${c.id}">${M.publicar}</button>`,
    c.guardado
      ? `<button class="boton-texto" type="button" data-quitar-guardado="${c.id}">${M.quitarGuardado}</button>`
      : `<button class="boton boton--claro boton--chico" type="button" data-guardar-cj="${c.id}">${M.guardarCorto}</button>`,
  ].join("");
  return `
    <article class="conjunto">
      <div class="conjunto__fotos">${prendas.map(htmlFoto).join("")}</div>
      <div class="conjunto__info">
        <div class="conjunto__marcas">${marcas}</div>
        <h3>${escaparHTML(c.nombre || M.sinNombre)}</h3>
        <p class="texto-suave">${prendas.map((p) => escaparHTML(p.nombre)).join(" + ")} · ${formatoFecha(c.fecha)}</p>
        <div class="conjunto__botones">${botones}</div>
      </div>
    </article>`;
}

function renderConjuntos() {
  const conjuntos = [...misConjuntos()].reverse();
  document.getElementById("conjuntos").innerHTML = conjuntos.length
    ? conjuntos.map(htmlConjunto).join("")
    : `<p class="aviso-borde">${M.misConjuntosVacio}</p>`;
}

// ============================================================
// Página
// ============================================================

function render() {
  const modos = Object.entries(M.modos)
    .map(([clave, texto]) => `<button type="button" class="segmento" data-modo="${clave}">${texto}</button>`)
    .join("");

  contenido.innerHTML = `
    <section class="vestidor-seccion">
      <div class="contenedor">
        <div class="vestidor-cabecera">
          <h1>${M.titulo}</h1>
          <p class="beta"><strong>${M.beta}</strong><span>${M.betaTexto}</span></p>
        </div>

        <div class="vestidor">
          <aside class="vestidor__slots" id="slots"></aside>
          <div class="vestidor__centro">
            <div class="vestidor__avatar" id="avatar"></div>
            <label class="campo campo--oscuro">${M.nombreOutfit}
              <span class="nombre-fila">
                <input id="nombre-outfit" type="text" maxlength="40">
                <button class="boton boton--borde boton--chico" type="button" data-accion="sugerir">${M.sugerirNombre}</button>
              </span>
            </label>
            <p class="texto-suave oculto" id="nombre-ayuda">${M.nombreSugerido}</p>
            <div class="vestidor__botones">
              <button class="boton boton--invertido" type="button" data-accion="guardar">${M.guardar}</button>
              <button class="boton boton--borde" type="button" data-accion="publicar">${M.publicar}</button>
              <button class="boton-texto boton-texto--claro" type="button" data-accion="limpiar">${M.limpiar}</button>
            </div>
            <div class="publicado oculto" id="publicado"></div>
          </div>
          <div class="vestidor__panel">
            <div class="segmentos" role="group">${modos}</div>
            <p class="texto-suave" id="modo-ayuda"></p>
            <form class="armar" id="form-armar">
              <input name="plan" type="text" maxlength="60" placeholder="${M.peticion}" aria-label="${M.peticion}">
              <button class="boton boton--invertido boton--chico" type="submit">${M.armarPorMi}</button>
            </form>
            <div class="cartas" id="cartas"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="seccion contenedor" id="tu-closet">
      <div class="titulo-seccion">
        <h2 class="titulo-ch"><img src="assets/logo/simbolo-ch-negro.png" alt="">${M.closet}</h2>
        <button class="boton boton--chico" type="button" data-accion="escanear">${M.escanear}</button>
      </div>
      <p class="texto-suave">${M.closetNota}</p>
      <div class="closet-layout">
        <div class="closet-lista" id="closet"></div>
        <aside class="combinar">
          <h3>${M.combinarTitulo}</h3>
          <p class="texto-suave">${M.combinarAyuda}</p>
          <div id="combinacion"></div>
        </aside>
      </div>
    </section>

    <section class="seccion contenedor" id="mis-conjuntos">
      <h2 class="titulo-ch"><img src="assets/logo/simbolo-ch-negro.png" alt="">${M.misConjuntos}</h2>
      <div class="conjuntos" id="conjuntos"></div>
    </section>`;

  renderVestidor();
  renderCloset();
  renderConjuntos();
  // Mientras se ve el vestidor, header y fondo negros (como el inicio)
  nocheMientrasSeVea(document.querySelector(".vestidor-seccion"), 0.25);
}

// Al pasar por una carta, se ilumina en el avatar la zona donde caería
function previsualizarZona(carta) {
  document.querySelectorAll(".avatar__zona--previa").forEach((z) => z.classList.remove("avatar__zona--previa"));
  if (!carta) return;
  const casilla = ponerEn({ ...outfit }, carta.dataset.poner);
  document.querySelector(`.avatar-svg [data-zona="${casilla}"]`)?.classList.add("avatar__zona--previa");
}

// ============================================================
// Eventos (un solo oyente para todo)
// ============================================================

contenido.addEventListener("click", async (e) => {
  const el = (selector) => e.target.closest(selector);

  if (el("[data-poner]")) {
    const casilla = ponerEn(outfit, el("[data-poner]").dataset.poner);
    cambioDeOutfit();
    rebotar(document.querySelector(`[data-slot="${casilla}"]`));
    return;
  }
  if (el("[data-quitar]")) {
    outfit[el("[data-quitar]").dataset.quitar] = null;
    return cambioDeOutfit();
  }
  if (el("[data-modo]")) {
    modo = el("[data-modo]").dataset.modo;
    return renderVestidor();
  }
  if (el("[data-combinar]")) return mostrarCombinacion(el("[data-combinar]").dataset.combinar);
  if (el("[data-probar]")) {
    // Pone la prenda suya + el ejemplo en el avatar y sube a verlo
    const [suya, ejemplo] = el("[data-probar]").dataset.probar.split("|");
    Object.assign(outfit, { arriba: null, abajo: null, extra: null });
    ponerEn(outfit, suya);
    ponerEn(outfit, ejemplo);
    modo = "mezcla";
    cambioDeOutfit();
    return document.querySelector(".vestidor-seccion").scrollIntoView({ behavior: "smooth" });
  }
  // Busca el conjunto de la tarjeta en la que se hizo clic
  const conjuntoDe = (atributo) => misConjuntos().find((c) => c.id === el(`[${atributo}]`).getAttribute(atributo));

  if (el("[data-cargar]")) {
    const conjunto = conjuntoDe("data-cargar");
    Object.assign(outfit, conjunto.prendas);
    nombreOutfit = conjunto.nombre;
    cambioDeOutfit();
    return document.querySelector(".vestidor-seccion").scrollIntoView({ behavior: "smooth" });
  }
  if (el("[data-publicar]")) {
    if (await publicarConjunto(conjuntoDe("data-publicar"))) mostrarAviso(M.publicado);
    return;
  }
  if (el("[data-quitar-pub]")) {
    quitarDeComunidad(conjuntoDe("data-quitar-pub"));
    renderConjuntos();
    return mostrarAviso(M.publicacionQuitada);
  }
  if (el("[data-quitar-guardado]")) {
    actualizarConjunto(conjuntoDe("data-quitar-guardado").id, { guardado: false });
    renderConjuntos();
    return mostrarAviso(M.guardadoQuitado);
  }
  if (el("[data-guardar-cj]")) {
    actualizarConjunto(conjuntoDe("data-guardar-cj").id, { guardado: true });
    renderConjuntos();
    return mostrarAviso(M.guardado);
  }

  const accion = el("[data-accion]")?.dataset.accion;
  if (accion === "sugerir") {
    nombreOutfit = sugerirNombre(outfit);
    document.getElementById("nombre-ayuda").classList.toggle("oculto", !nombreOutfit);
    renderVestidor();
  }
  if (accion === "guardar") guardar();
  if (accion === "publicar") publicarActual();
  if (accion === "escanear") abrirEscaner();
  if (accion === "limpiar") {
    Object.assign(outfit, { arriba: null, abajo: null, extra: null });
    nombreOutfit = "";
    document.getElementById("publicado").classList.add("oculto");
    cambioDeOutfit();
  }
});

contenido.addEventListener("mouseover", (e) => previsualizarZona(e.target.closest(".carta")));

contenido.addEventListener("input", (e) => {
  if (e.target.id === "nombre-outfit") nombreOutfit = e.target.value;
});

contenido.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.id === "form-armar") armarPorMi(e.target.plan.value);
});

render();
