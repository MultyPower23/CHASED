// ============================================================
// conjuntos.js — Lo que comparten el vestidor y el catálogo
// ------------------------------------------------------------
// El avatar, el closet (comprado o escaneado), el "¿con qué
// combino esto?", el nombre sugerido y los conjuntos guardados.
// Vive aparte para que Mi closet y el catálogo dibujen el MISMO
// avatar y usen las mismas reglas (una sola fuente de verdad).
// ============================================================

import { buscarProducto } from "./app.js";
import { TEXTOS } from "./textos.js";
import { PRODUCTOS, CASILLA_POR_TIPO } from "./data/productos.js";
import { CAJAS_DEMO, COMBINA_COLOR, COMPLEMENTO } from "./data/closet.js";
import {
  getPedidos,
  getClosetManual,
  agregarAlCloset,
  getCajasEscaneadas,
  registrarCaja,
  getConjuntos,
  guardarConjuntos,
  getPreferencia,
  guardarPreferencia,
} from "./storage.js";

const M = TEXTOS.maniqui;
export const CASILLAS = ["arriba", "abajo", "extra"];

// ============================================================
// Closet: SOLO lo comprado en la página o lo que traía una caja
// ============================================================

function idsComprados() {
  return getPedidos().flatMap((p) => p.items.map((i) => i.id));
}

// [{ producto, origen: "compra" | "caja" }] sin repetir
export function prendasDelCloset() {
  const comprados = new Set(idsComprados());
  const ids = [...new Set([...comprados, ...getClosetManual()])];
  return ids
    .map((id) => ({ producto: buscarProducto(id), origen: comprados.has(id) ? "compra" : "caja" }))
    .filter((p) => p.producto);
}

export const idsDelCloset = () => prendasDelCloset().map((p) => p.producto.id);

// "Escanear" el QR de la caja (simulado): el código trae sus prendas.
// Devuelve { ok, mensaje } para que la página muestre qué pasó.
export function escanearCaja(codigoEscrito) {
  const codigo = codigoEscrito.trim().toUpperCase();
  const prendas = CAJAS_DEMO[codigo];
  if (!prendas) return { ok: false, mensaje: M.qrNoExiste };
  if (getCajasEscaneadas().includes(codigo)) return { ok: false, mensaje: M.qrYaUsado };
  registrarCaja(codigo);
  prendas.forEach(agregarAlCloset);
  return { ok: true, mensaje: M.qrOk(prendas.length) };
}

export const codigosDemo = () => Object.keys(CAJAS_DEMO).join(", ");

// ============================================================
// Casillas: dónde va cada prenda
// ============================================================

export const casillaDe = (producto) => CASILLA_POR_TIPO[producto.tipo] ?? "extra";

// Pone una prenda en el outfit. Si arriba ya tiene otra cosa y llega
// otra de arriba, va a "extra" como segunda capa (ej. hoodie encima).
export function ponerEn(outfit, id) {
  const producto = buscarProducto(id);
  let casilla = casillaDe(producto);
  if (casilla === "arriba" && outfit.arriba && outfit.arriba !== id) casilla = "extra";
  outfit[casilla] = id;
  return casilla;
}

export const idsDelOutfit = (outfit) => CASILLAS.map((c) => outfit[c]).filter(Boolean);

// ============================================================
// Avatar (silueta en SVG). Las prendas "puestas" rellenan su zona
// del cuerpo con la foto del producto, como en el vestidor de un
// videojuego. Nada de librerías: es un dibujo hecho con trazos.
// ============================================================

const ZONAS = {
  // torso (arriba)
  torso: "M60 92 Q100 78 140 92 L148 206 Q100 216 52 206 Z",
  // brazos (van con "arriba" o con la capa "extra")
  brazos: "M60 92 L38 196 L52 200 L70 118 Z M140 92 L162 196 L148 200 L130 118 Z",
  // capa extra: hombros + brazos (como una chaqueta abierta)
  capa: "M56 90 Q100 76 144 90 L166 198 L148 204 L134 124 L130 206 L112 208 L112 100 L88 100 L88 208 L70 206 L66 124 L52 204 L34 198 Z",
  // piernas (abajo)
  piernas: "M54 204 L146 204 L141 404 L107 404 L100 262 L93 404 L59 404 Z",
};

function zonaConFoto(prefijo, nombre, d, producto) {
  const id = `${prefijo}-${nombre}`;
  return `
    <clipPath id="${id}"><path d="${d}"/></clipPath>
    <image href="${producto.imagen}" x="20" y="70" width="160" height="350"
      preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>
    <path d="${d}" class="avatar__borde"/>`;
}

export function htmlAvatar(outfit, prefijo = "av") {
  const arriba = outfit.arriba && buscarProducto(outfit.arriba);
  const abajo = outfit.abajo && buscarProducto(outfit.abajo);
  const extra = outfit.extra && buscarProducto(outfit.extra);
  return `
    <svg class="avatar-svg" viewBox="0 0 200 420" role="img" aria-label="${M.vestidor}">
      <!-- La silueta base, en gris -->
      <circle cx="100" cy="46" r="26" class="avatar__base"/>
      <rect x="90" y="68" width="20" height="18" rx="6" class="avatar__base"/>
      <path d="${ZONAS.torso} ${ZONAS.brazos}" class="avatar__base"/>
      <path d="${ZONAS.piernas}" class="avatar__base"/>
      <!-- Las prendas puestas encima -->
      ${abajo ? zonaConFoto(prefijo, "piernas", ZONAS.piernas, abajo) : ""}
      ${arriba ? zonaConFoto(prefijo, "torso", ZONAS.torso + " " + ZONAS.brazos, arriba) : ""}
      ${extra ? zonaConFoto(prefijo, "capa", ZONAS.capa, extra) : ""}
    </svg>`;
}

// ============================================================
// "¿Con qué combino esto?"
// Primero lo decimos en palabras (tipo + color); luego, suave, un
// ejemplo de la marca. Así se siente como un consejo, no un anuncio.
// ============================================================

function unirConO(lista) {
  if (lista.length <= 1) return lista.join("");
  return `${lista.slice(0, -1).join(", ")} ${M.o} ${lista[lista.length - 1]}`;
}

const conArticulo = (tipo) => `${tipo === "camiseta" ? M.una : M.un} ${M.tipos[tipo] ?? tipo}`;

export function sugerenciaPara(idBase) {
  const base = buscarProducto(idBase);
  const objetivo = COMPLEMENTO[casillaDe(base)];
  const colores = (COMBINA_COLOR[base.color] ?? ["negro", "blanco hueso"]).slice(0, 3);
  const candidatos = PRODUCTOS.filter((p) => casillaDe(p) === objetivo);
  const tipos = [...new Set(candidatos.map((p) => p.tipo))].slice(0, 2);

  const texto = M.combinarTexto(base.nombre, unirConO(tipos.map(conArticulo)), unirConO(colores));

  // El ejemplo: del color recomendado, mejor si comparte estilo y si
  // NO lo tiene ya en su closet (si no, sería recomendarle lo mismo)
  const tiene = new Set(idsDelCloset());
  const puntaje = (p) =>
    (colores.includes(p.color) ? 4 - colores.indexOf(p.color) : 0) +
    p.tags.filter((t) => base.tags.includes(t)).length * 2 +
    (tiene.has(p.id) ? -10 : 0);
  const ejemplo = [...candidatos].sort((a, b) => puntaje(b) - puntaje(a))[0] ?? null;
  return { texto, ejemplo };
}

// ============================================================
// Nombre sugerido ("beta de IA"): estilo dominante + color
// ============================================================

export function sugerirNombre(outfit) {
  const prendas = idsDelOutfit(outfit).map(buscarProducto);
  if (!prendas.length) return "";
  // Estilo que más se repite entre las prendas
  const conteo = {};
  prendas.forEach((p) => p.tags.forEach((t) => (conteo[t] = (conteo[t] ?? 0) + 1)));
  const estilo = Object.keys(conteo).sort((a, b) => conteo[b] - conteo[a])[0];
  const palabras = M.nombres[estilo] ?? M.nombres.minimal;
  const palabra = palabras[Math.floor(Math.random() * palabras.length)];
  // Si todo es negro, "Total black"; si no, el color de la parte de arriba
  const todoNegro = prendas.every((p) => p.color === "negro");
  const color = todoNegro ? M.totalNegro : M.colorNombre[(prendas[0]).color] ?? "";
  return todoNegro ? `${palabra} · ${color}` : `${palabra} ${color}`.trim();
}

// ============================================================
// Mis conjuntos (guardados y publicados)
// ============================================================

export function guardarConjunto(nombre, outfit) {
  const conjunto = {
    id: `cj-${Date.now()}`,
    nombre: nombre || "",
    prendas: { ...outfit },
    publicado: false,
    fecha: new Date().toISOString(),
  };
  guardarConjuntos([...getConjuntos(), conjunto]);
  return conjunto;
}

export function marcarPublicado(id) {
  guardarConjuntos(getConjuntos().map((c) => (c.id === id ? { ...c, publicado: true } : c)));
}

export function eliminarConjunto(id) {
  guardarConjuntos(getConjuntos().filter((c) => c.id !== id));
}

// ============================================================
// Borrador del catálogo: el conjunto que se va armando en el panel
// (se guarda para que, al ir a Mi closet, siga ahí)
// ============================================================

export const getBorrador = () => getPreferencia("borradorConjunto", { arriba: null, abajo: null, extra: null });
export const guardarBorrador = (outfit) => guardarPreferencia("borradorConjunto", outfit);
