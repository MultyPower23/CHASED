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

// Por ahora el avatar NO muestra fotos: cada zona es gris claro si
// está vacía y gris oscuro con borde blanco si tiene una prenda
// puesta. data-zona sirve para iluminarla al pasar por una carta.
function zona(nombre, d, puesta) {
  return `<path d="${d}" class="avatar__zona ${puesta ? "avatar__zona--puesta" : ""}" data-zona="${nombre}"/>`;
}

export function htmlAvatar(outfit) {
  return `
    <svg class="avatar-svg" viewBox="0 0 200 420" role="img" aria-label="${M.vestidor}">
      <circle cx="100" cy="46" r="26" class="avatar__cabeza"/>
      <rect x="90" y="68" width="20" height="18" rx="6" class="avatar__cabeza"/>
      ${zona("abajo", ZONAS.piernas, outfit.abajo)}
      ${zona("arriba", ZONAS.torso + " " + ZONAS.brazos, outfit.arriba)}
      ${outfit.extra ? zona("extra", ZONAS.capa, true) : `<path d="${ZONAS.capa}" class="avatar__capa-vacia" data-zona="extra"/>`}
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

// Un conjunto tiene DOS marcas independientes: "guardado" (en tu
// closet) y "publicado" (en Comunidad). Si es la misma ropa, es UN
// solo conjunto con las dos marcas, no dos tarjetas repetidas.
// { id, nombre, prendas, guardado, publicado, outfitId, fecha }

const huella = (prendas) => idsDelOutfit(prendas).sort().join("|");

// Arregla datos viejos (antes no existía "guardado") y junta los
// conjuntos repetidos con la misma ropa en uno solo
export function misConjuntos() {
  const unidos = [];
  getConjuntos().forEach((c) => {
    const conjunto = { guardado: true, publicado: false, outfitId: null, ...c };
    const igual = unidos.find((u) => huella(u.prendas) === huella(conjunto.prendas));
    if (!igual) return unidos.push(conjunto);
    igual.guardado ||= conjunto.guardado;
    igual.publicado ||= conjunto.publicado;
    igual.outfitId ||= conjunto.outfitId;
    igual.nombre ||= conjunto.nombre;
  });
  const vivos = unidos.filter((c) => c.guardado || c.publicado);
  guardarConjuntos(vivos);
  return vivos;
}

// Crea el conjunto o, si ya hay uno con la misma ropa, lo actualiza
export function upsertConjunto(nombre, outfit, cambios = {}) {
  const lista = misConjuntos();
  let conjunto = lista.find((c) => huella(c.prendas) === huella(outfit));
  if (conjunto) {
    Object.assign(conjunto, cambios);
    if (nombre) conjunto.nombre = nombre;
  } else {
    conjunto = {
      id: `cj-${Date.now()}`,
      nombre: nombre || "",
      prendas: { ...outfit },
      guardado: false,
      publicado: false,
      outfitId: null,
      fecha: new Date().toISOString(),
      ...cambios,
    };
    lista.push(conjunto);
  }
  guardarConjuntos(lista);
  return conjunto;
}

export const guardarConjunto = (nombre, outfit) => upsertConjunto(nombre, outfit, { guardado: true });

// Cambia una marca; si se queda sin ninguna de las dos, desaparece
export function actualizarConjunto(id, cambios) {
  const lista = misConjuntos().map((c) => (c.id === id ? { ...c, ...cambios } : c));
  guardarConjuntos(lista.filter((c) => c.guardado || c.publicado));
}

// ============================================================
// Borrador del catálogo: el conjunto que se va armando en el panel
// (se guarda para que, al ir a Mi closet, siga ahí)
// ============================================================

export const getBorrador = () => getPreferencia("borradorConjunto", { arriba: null, abajo: null, extra: null });
export const guardarBorrador = (outfit) => guardarPreferencia("borradorConjunto", outfit);
