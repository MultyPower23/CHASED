// ============================================================
// app.js — Lo que comparten TODAS las páginas
// ------------------------------------------------------------
// Header, footer, modal de registro, avisos y unas funciones
// ayudantes (precio, fotos, insignias). Cada página importa este
// archivo y con eso ya tiene su "marco" puesto, como un cuadro
// que siempre trae el mismo marco aunque cambie la pintura.
// ============================================================

import { TEXTOS } from "./textos.js";
import { PRODUCTOS, CONFIG } from "./data/productos.js";
import {
  getUsuario,
  guardarUsuario,
  cerrarSesion,
  contarPrendasCarrito,
  getPedidos,
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

export function nivelPorPrendas(prendas) {
  const ultimo = T.insignias.niveles.length - 1;
  return Math.min(Math.floor(prendas / CONFIG.prendasPorNivel), ultimo);
}

// El descuento no se guarda aparte: se deduce del último pedido.
// Si ese pedido te hizo subir de nivel, tienes descuento ahora;
// apenas haces otra compra, se "gasta" solo. Menos datos = menos errores.
export function descuentoDisponible() {
  const pedidos = getPedidos();
  const ultimo = pedidos[pedidos.length - 1];
  return ultimo && ultimo.subioNivel ? CONFIG.descuentoPorNivel : 0;
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
function leerFotoReducida(archivo) {
  return new Promise((resolve) => {
    if (!archivo) return resolve(null);
    const lector = new FileReader();
    lector.onerror = () => resolve(null);
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => resolve(null);
      img.onload = () => {
        const escala = Math.min(1, 160 / Math.max(img.width, img.height));
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
      }
      resolve(usuarioNuevo);
    });

    form.nombre.focus();
  });
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
          <img src="assets/logo/logo-chased-negro.png" alt="${T.marca.nombre}">
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
        <p>${T.footer.texto}</p>
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
