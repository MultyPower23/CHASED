// ============================================================
// app.js — Lo que comparten TODAS las páginas
// ------------------------------------------------------------
// Header, footer, modal de registro, avisos y unas funciones
// ayudantes (precio, fotos, insignias). Cada página importa este
// archivo y con eso ya tiene su "marco" puesto, como un cuadro
// que siempre trae el mismo marco aunque cambie la pintura.
// ============================================================

import { TEXTOS } from "./textos.js";
import { PRODUCTOS, CONFIG, COLECCIONES, GENEROS } from "./data/productos.js";
import { ICONOS_INSIGNIAS, ICONO_RESPALDO, ESTILOS_VISUALES } from "./data/apariencia.js";
import {
  getUsuario,
  guardarUsuario,
  cerrarSesion,
  contarPrendasCarrito,
  getPedidos,
  getCupones,
} from "./storage.js";

const T = TEXTOS;

// ---------- Ayudantes pequeños ----------

// Cualquier texto que escriba la persona (su nombre, por ejemplo)
// pasa por aquí antes de meterlo en el HTML, para que un "<" no
// rompa la página.
export function escaparHTML(texto = "") {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 65000 → "$ 65.000" con el formato colombiano
const formato = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: CONFIG.moneda,
  maximumFractionDigits: 0,
});

export function formatearPrecio(valor) {
  return formato.format(valor);
}

export function buscarProducto(id) {
  return PRODUCTOS.find((p) => p.id === id);
}

// ¿El producto cuenta para "hombre" o "mujer"? Lo unisex cuenta para ambos.
export function coincideGenero(producto, genero) {
  if (!genero) return true;
  return (GENEROS[genero] ?? [genero]).includes(producto.genero);
}

export function buscarColeccion(clave) {
  return COLECCIONES.find((c) => c.clave === clave);
}

// Una colección es un "filtro guardado": el producto entra si cumple
// TODAS las condiciones (tipo, color, tags o id) de la colección.
export function productoEnColeccion(producto, coleccion) {
  return Object.entries(coleccion.filtro).every(([campo, valores]) =>
    campo === "tags"
      ? producto.tags.some((tag) => valores.includes(tag))
      : valores.includes(producto[campo])
  );
}

export function productosDeColeccion(clave) {
  const coleccion = buscarColeccion(clave);
  return coleccion ? PRODUCTOS.filter((p) => productoEnColeccion(p, coleccion)) : [];
}

// Pone la primera letra en mayúscula: "azul celeste" → "Azul celeste"
export function capitalizar(texto = "") {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// Foto del producto con su "plan B": detrás va un fondo gris con el
// nombre. Si la imagen falla, el onerror la quita y queda el gris.
export function htmlFoto(producto) {
  return `
    <div class="foto">
      <span class="foto__nombre">${escaparHTML(producto.nombre)}</span>
      <img src="${producto.imagen}" alt="${escaparHTML(producto.nombre)}" loading="lazy" onerror="this.remove()">
    </div>`;
}

// Mientras Chased no confirme precios, se dice claramente que son referenciales
export function htmlPrecio(producto, notaLarga = false) {
  const nota = notaLarga ? T.catalogo.precioReferencial : T.general.referencial;
  return `
    <p class="precio">${formatearPrecio(producto.precio)}
      ${producto.precioConfirmado ? "" : `<span class="precio__nota">· ${nota}</span>`}
    </p>`;
}

// Tarjeta de producto. Es un enlace al catálogo con el producto en
// la URL: así desde el inicio también se puede abrir el detalle.
export function htmlTarjeta(producto) {
  return `
    <a class="tarjeta" href="catalogo.html?producto=${producto.id}" data-id="${producto.id}">
      ${htmlFoto(producto)}
      <div class="tarjeta__info">
        <h3 class="tarjeta__nombre">${escaparHTML(producto.nombre)}</h3>
        <p class="tarjeta__detalle">${escaparHTML(producto.color)}</p>
        ${htmlPrecio(producto)}
      </div>
    </a>`;
}

// ---------- Insignias ----------
// Regla del equipo: cada 4 prendas compradas subes de nivel, y al
// subir ganas descuento SOLO para la siguiente compra.

export function totalPrendasCompradas() {
  return getPedidos().reduce((total, pedido) => total + pedido.prendas, 0);
}

// Cuántas prendas pide cada nivel: Rookie se gana con la primera
// compra (1 prenda) y los demás cada 4 prendas (4, 8, 12).
export function prendasParaNivel(indice) {
  return indice === 0 ? 1 : indice * CONFIG.prendasPorNivel;
}

// -1 = todavía sin insignia (no ha comprado nada)
export function nivelPorPrendas(prendas) {
  if (prendas < 1) return -1;
  const ultimo = T.insignias.niveles.length - 1;
  return Math.min(Math.floor(prendas / CONFIG.prendasPorNivel), ultimo);
}

// Todo lo que hay que saber de la insignia a partir de las prendas:
// en qué nivel vas, cuál sigue, cuánto te falta y cómo va la barra.
export function estadoInsignia(prendas = totalPrendasCompradas()) {
  const niveles = T.insignias.niveles;
  const meta = CONFIG.prendasPorNivel;
  const indice = nivelPorPrendas(prendas);
  const esMaximo = indice === niveles.length - 1;
  const objetivo = esMaximo ? prendas : prendasParaNivel(indice + 1);
  return {
    indice,
    nombre: indice >= 0 ? niveles[indice] : null,
    siguiente: esMaximo ? null : niveles[indice + 1],
    esMaximo,
    prendas,
    objetivo, // prendas totales que pide el siguiente nivel
    faltan: esMaximo ? 0 : objetivo - prendas,
    meta,
    // Bloques llenos de la barra (de 4 en 4). Sin insignia: 0.
    enEsteNivel: esMaximo ? meta : indice < 0 ? 0 : prendas % meta,
  };
}

// ¿Este cambio de nivel da descuento? Rookie es la bienvenida (sin
// descuento); de Runner en adelante sí.
export function nivelDaDescuento(indice) {
  return indice >= 1;
}

// ---------- Cupones de descuento ----------
// Un cupón es como un bono de regalo: se gana al llegar a un nivel
// con premio, se usa UNA sola vez, cuando la persona quiera, y tiene
// fecha de vencimiento (como los bonos del supermercado).

const MS_POR_DIA = 24 * 60 * 60 * 1000;

// Fecha bonita: "12 de diciembre de 2026"
export function formatoFecha(iso) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

export function crearCupon(indiceNivel, fecha = new Date()) {
  return {
    id: `c${Date.now()}${indiceNivel}`,
    nivel: T.insignias.niveles[indiceNivel],
    pct: CONFIG.descuentoPorNivel,
    ganado: fecha.toISOString(),
    vence: new Date(fecha.getTime() + CONFIG.diasVigenciaDescuento * MS_POR_DIA).toISOString(),
    usadoEn: null,
  };
}

// "disponible", "usado" o "vencido"
export function estadoCupon(cupon, ahora = new Date()) {
  if (cupon.usadoEn) return "usado";
  return new Date(cupon.vence) < ahora ? "vencido" : "disponible";
}

// Los que se pueden usar, primero el que vence antes (para que no se pierda)
export function cuponesDisponibles() {
  return getCupones()
    .filter((c) => estadoCupon(c) === "disponible")
    .sort((a, b) => new Date(a.vence) - new Date(b.vence));
}

// Índices de los niveles con premio que se cruzan al pasar de
// "antes" a "despues" prendas. Normalmente es uno, pero si alguien
// compra 8 prendas de una, cruza Runner y Chaser: gana dos cupones.
export function nivelesConPremioEntre(prendasAntes, prendasDespues) {
  const desde = nivelPorPrendas(prendasAntes);
  const hasta = nivelPorPrendas(prendasDespues);
  const niveles = [];
  for (let i = desde + 1; i <= hasta; i++) if (nivelDaDescuento(i)) niveles.push(i);
  return niveles;
}

// ---------- Piezas visuales de la insignia ----------
// Las usan el carrito, la confirmación y el perfil, para que se
// vean igual en todos lados.

// Círculo con el icono del nivel. Si no hay icono custom en
// assets/img/insignias/, el onerror pone el CH oficial.
export function htmlIconoInsignia(indice, clase = "") {
  if (indice < 0) return `<span class="icono-insignia icono-insignia--vacia ${clase}"></span>`;
  return `
    <span class="icono-insignia ${clase}">
      <img src="${ICONOS_INSIGNIAS[indice] ?? ICONO_RESPALDO}" alt=""
        onerror="this.onerror=null;this.src='${ICONO_RESPALDO}'">
    </span>`;
}

// Barra por bloques: un bloque por prenda, de 4 en 4. Se lee de un
// vistazo ("me faltan 2 cuadritos") mejor que una barra lisa.
export function htmlBarraInsignia(estado) {
  const bloques = Array.from(
    { length: estado.meta },
    (_, i) => `<span class="${i < estado.enEsteNivel ? "lleno" : ""}"></span>`
  ).join("");
  const texto = estado.esMaximo
    ? T.carrito.nivelMaximo
    : estado.indice < 0
      ? T.insignias.primeraCompra
      : T.insignias.faltanPara(estado.faltan, estado.siguiente);
  return `
    <div class="progreso-insignia">
      <div class="bloques" role="progressbar" aria-valuemin="0" aria-valuemax="${estado.meta}"
        aria-valuenow="${estado.enEsteNivel}">${bloques}</div>
      <p class="progreso-insignia__texto">${texto}</p>
    </div>`;
}

// ---------- Tarjeta de estilo ----------
// Foto del estilo de fondo y el texto sobre una franja negra sólida
// (nada de degradados: se lee perfecto y se ve limpio). La usan el
// perfil y el resultado del quiz. "acciones" = botones extra.
export function htmlTarjetaEstilo(clave, { etiqueta = "", acciones = "", grande = false } = {}) {
  const estilo = T.quiz.estilos[clave];
  const visual = ESTILOS_VISUALES[clave] ?? {};
  return `
    <article class="tarjeta-estilo ${grande ? "tarjeta-estilo--grande" : ""}">
      ${visual.fondo ? `<img class="tarjeta-estilo__fondo" src="${visual.fondo}" alt="" onerror="this.remove()">` : ""}
      <div class="tarjeta-estilo__franja">
        ${visual.icono ? `<img class="tarjeta-estilo__icono" src="${visual.icono}" alt="" onerror="this.remove()">` : ""}
        ${etiqueta ? `<p class="tarjeta-estilo__etiqueta">${etiqueta}</p>` : ""}
        <p class="tarjeta-estilo__nombre">${estilo.nombre}</p>
        <p class="tarjeta-estilo__descripcion">${estilo.descripcion}</p>
        ${acciones}
      </div>
    </article>`;
}

// Camino de los 4 niveles conectados (como paradas de metro)
export function htmlCaminoInsignias(indiceActual) {
  const pasos = T.insignias.niveles
    .map(
      (nombre, i) => `
      <li class="${i <= indiceActual ? "alcanzado" : ""} ${i === indiceActual ? "actual" : ""}">
        ${htmlIconoInsignia(i <= indiceActual ? i : -1, "icono-insignia--chico")}
        <strong>${nombre}</strong>
        <span>${T.insignias.requisito(i, prendasParaNivel(i))}</span>
      </li>`
    )
    .join("");
  return `<ol class="camino">${pasos}</ol>`;
}

// ---------- Modo noche mientras se ve una sección ----------
// Un "vigilante" (IntersectionObserver) mira la sección. Mientras se
// vea buena parte de ella, la página está en modo noche (header y
// fondo negros); al bajar se quita la clase y el CSS hace la
// transición a blanco. Lo usan la portada del inicio y el vestidor.
export function nocheMientrasSeVea(seccion, umbral = 0.35) {
  if (!seccion) return;
  document.body.classList.add("noche");
  const vigilante = new IntersectionObserver(
    ([entrada]) => document.body.classList.toggle("noche", entrada.intersectionRatio > umbral),
    { threshold: [0, umbral, 1] }
  );
  vigilante.observe(seccion);
}

// ---------- Avisos (toast) ----------
let temporizadorAviso;

export function mostrarAviso(texto) {
  let aviso = document.querySelector(".toast");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.className = "toast";
    aviso.setAttribute("role", "status");
    document.body.append(aviso);
  }
  aviso.textContent = texto;
  aviso.classList.add("visible");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove("visible"), 2800);
}

// ---------- Modal genérico ----------
// Usamos <dialog> porque el navegador ya nos regala el fondo oscuro,
// cerrar con Esc y no poder hacer clic detrás.
export function abrirModal(contenidoHTML, { chico = false } = {}) {
  const modal = document.createElement("dialog");
  modal.className = "modal" + (chico ? " modal--chico" : "");
  modal.innerHTML = `
    <button class="modal__cerrar" type="button" aria-label="${T.general.cerrar}">&times;</button>
    ${contenidoHTML}`;
  document.body.append(modal);

  modal.querySelector(".modal__cerrar").addEventListener("click", () => modal.close());
  // Clic en el fondo oscuro (fuera de la cajita) también cierra
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });
  // Al cerrarse, lo sacamos del DOM para no acumular modales escondidos
  modal.addEventListener("close", () => modal.remove());

  modal.showModal();
  return modal;
}

// ---------- Registro simulado ----------

// Reduce la foto de perfil a 160px antes de guardarla. Una foto del
// celular pesa megas y el localStorage solo aguanta ~5 MB en total.
// "lado" = tamaño máximo en px (160 para avatar, más grande para diseños)
export function leerFotoReducida(archivo, lado = 160) {
  return new Promise((resolve) => {
    if (!archivo) return resolve(null);
    const lector = new FileReader();
    lector.onerror = () => resolve(null);
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => resolve(null);
      img.onload = () => {
        const escala = Math.min(1, lado / Math.max(img.width, img.height));
        const lienzo = document.createElement("canvas");
        lienzo.width = Math.round(img.width * escala);
        lienzo.height = Math.round(img.height * escala);
        lienzo.getContext("2d").drawImage(img, 0, 0, lienzo.width, lienzo.height);
        resolve(lienzo.toDataURL("image/jpeg", 0.8));
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });
}

// Abre el registro y devuelve una promesa: se resuelve con el usuario
// si se registró, o con null si cerró el modal. Así quien lo llama
// (por ejemplo el carrito) puede esperar con "await" y seguir.
export function pedirRegistro(subtitulo = T.registro.subtitulo) {
  return new Promise((resolve) => {
    const modal = abrirModal(
      `<div class="modal__cuerpo">
        <h2>${T.registro.titulo}</h2>
        <p class="texto-suave">${subtitulo}</p>
        <form class="formulario" novalidate>
          <label class="campo">${T.registro.nombre}
            <input name="nombre" type="text" autocomplete="given-name" maxlength="40" required>
          </label>
          <label class="campo">${T.registro.correo}
            <input name="correo" type="email" autocomplete="email" maxlength="80" required>
          </label>
          <label class="campo">${T.registro.foto}
            <input name="foto" type="file" accept="image/*">
          </label>
          <p class="error" aria-live="polite"></p>
          <button class="boton boton--ancho" type="submit">${T.registro.boton}</button>
          <p class="texto-suave">${T.registro.nota}</p>
        </form>
      </div>`,
      { chico: true }
    );

    let usuarioNuevo = null;
    const form = modal.querySelector("form");
    const error = modal.querySelector(".error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre = form.nombre.value.trim();
      const correo = form.correo.value.trim();
      if (!nombre) return (error.textContent = T.registro.errorNombre);
      if (!/^\S+@\S+\.\S+$/.test(correo)) return (error.textContent = T.registro.errorCorreo);

      const foto = await leerFotoReducida(form.foto.files[0]);
      usuarioNuevo = { nombre, correo, foto, fechaRegistro: new Date().toISOString() };
      guardarUsuario(usuarioNuevo);
      modal.close();
    });

    modal.addEventListener("close", () => {
      if (usuarioNuevo) {
        renderHeader();
        mostrarAviso(T.registro.bienvenida(usuarioNuevo.nombre));
        avisarCambioSesion();
      }
      resolve(usuarioNuevo);
    });

    form.nombre.focus();
  });
}

// Cuando alguien entra o sale, avisamos a la página (por ejemplo, el
// perfil se vuelve a pintar sin tener que recargar)
function avisarCambioSesion() {
  window.dispatchEvent(new CustomEvent("sesion-cambio"));
}

// ---------- Header ----------
const PAGINAS_MENU = [
  { clave: "inicio", url: "index.html" },
  { clave: "catalogo", url: "catalogo.html" },
  { clave: "comunidad", url: "comunidad.html" },
  { clave: "maniqui", url: "maniqui.html" },
];

function paginaActual() {
  return document.body.dataset.pagina;
}

function htmlEnlacesMenu() {
  return PAGINAS_MENU.map(
    ({ clave, url }) =>
      `<a href="${url}" class="${paginaActual() === clave ? "activo" : ""}">${T.nav[clave]}</a>`
  ).join("");
}

// El registro NO se le tira encima a nadie: solo vive aquí, en el
// header, como un botón tranquilo. Si ya hay sesión, saludamos.
function htmlZonaUsuario() {
  const usuario = getUsuario();
  if (!usuario) {
    return `<button class="boton nav__registro" type="button" data-accion="registro">${T.nav.registrate}</button>`;
  }
  return `
    <a href="perfil.html" class="${paginaActual() === "perfil" ? "activo" : ""}">${escaparHTML(T.general.hola(usuario.nombre))}</a>
    <button type="button" data-accion="salir">${T.nav.salir}</button>`;
}

export function actualizarContador() {
  const contador = document.querySelector(".contador");
  if (!contador) return;
  const total = contarPrendasCarrito();
  contador.textContent = total;
  contador.classList.toggle("contador--vacio", total === 0);
}

export function renderHeader() {
  const lugar = document.getElementById("header");
  if (!lugar) return;
  lugar.innerHTML = `
    <header class="header">
      <div class="contenedor header__interior">
        <a class="header__logo" href="index.html">
          <!-- Dos versiones oficiales: negra para fondo blanco y blanca para
               fondo negro. El CSS muestra la que toca según el modo. -->
          <img class="logo-negro" src="assets/logo/logo-chased-negro.png" alt="${T.marca.nombre}">
          <img class="logo-blanco" src="assets/logo/logo-chased-blanco.png" alt="">
        </a>
        <nav class="nav" id="menu-principal">
          ${htmlEnlacesMenu()}
          ${htmlZonaUsuario()}
        </nav>
        <div class="header__acciones">
          <a class="header__carrito" href="carrito.html">${T.nav.carrito} <span class="contador"></span></a>
          <button class="header__menu-btn" type="button" aria-label="${T.general.menu}"
            aria-expanded="false" aria-controls="menu-principal">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>`;

  const nav = lugar.querySelector(".nav");
  const botonMenu = lugar.querySelector(".header__menu-btn");
  botonMenu.addEventListener("click", () => {
    const abierto = nav.classList.toggle("abierto");
    botonMenu.setAttribute("aria-expanded", abierto);
  });

  lugar.querySelector('[data-accion="registro"]')?.addEventListener("click", () => pedirRegistro());
  lugar.querySelector('[data-accion="salir"]')?.addEventListener("click", () => {
    cerrarSesion();
    renderHeader();
    mostrarAviso(T.general.sesionCerrada);
    avisarCambioSesion();
  });

  actualizarContador();
}

// ---------- Footer ----------
function renderFooter() {
  const lugar = document.getElementById("footer");
  if (!lugar) return;
  lugar.innerHTML = `
    <footer class="footer">
      <div class="contenedor">
        <img class="footer__logo" src="assets/logo/logo-chased-blanco.png" alt="${T.marca.nombre}">
        <p><a href="${T.marca.instagramUrl}" target="_blank" rel="noopener">${T.footer.instagram} ${T.marca.instagram}</a></p>
        <p class="footer__prototipo">${T.footer.prototipo}</p>
      </div>
    </footer>`;
}

// ---------- Título de la pestaña ----------
const TITULOS = {
  inicio: T.marca.eslogan,
  catalogo: T.catalogo.titulo,
  carrito: T.carrito.titulo,
  perfil: T.perfil.titulo,
  quiz: T.quiz.titulo,
  comunidad: T.comunidad.titulo,
  maniqui: T.maniqui.titulo,
};

function ponerTitulo() {
  const titulo = TITULOS[paginaActual()];
  document.title = titulo ? `${titulo} · ${T.marca.nombre}` : T.marca.nombre;
}

// Arranca apenas se importa el archivo: cada página queda con su marco
ponerTitulo();
renderHeader();
renderFooter();
// Si el carrito cambia (aquí o en otra pestaña), el contador se actualiza
window.addEventListener("carrito-cambio", actualizarContador);
window.addEventListener("storage", actualizarContador);
