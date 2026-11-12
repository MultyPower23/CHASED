// ============================================================
// storage.js — La única puerta al localStorage
// ------------------------------------------------------------
// El localStorage es como la mochila del navegador: guarda cosas
// aunque cierres la página. Pero si cada archivo mete la mano en
// la mochila a su manera, termina hecha un desorden. Por eso
// TODO pasa por aquí: el resto del código solo llama funciones
// como getCarrito() o guardarPedido() y no sabe cómo se guardan.
// (Si mañana usamos Google Sheets, solo se cambia este archivo).
// ============================================================

const PREFIJO = "chased_";

// Lee y escribe JSON. El try/catch es por si el navegador está en
// modo privado o el dato quedó dañado: mejor devolver algo vacío
// que romper toda la página.
function leer(clave, porDefecto) {
  try {
    const valor = localStorage.getItem(PREFIJO + clave);
    return valor === null ? porDefecto : JSON.parse(valor);
  } catch {
    return porDefecto;
  }
}

function escribir(clave, valor) {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
  } catch (error) {
    console.warn("No se pudo guardar en localStorage:", error);
  }
}

// ---------- Usuario (registro simulado) ----------
export function getUsuario() {
  return leer("usuario", null);
}

export function guardarUsuario(usuario) {
  escribir("usuario", usuario);
}

export function cerrarSesion() {
  localStorage.removeItem(PREFIJO + "usuario");
}

// ---------- Carrito ----------
// Cada ítem es { id, talla, cantidad }. Solo guardamos el id del
// producto, no el producto entero, para no duplicar datos de
// productos.js (si cambia un precio, el carrito se entera solo).
export function getCarrito() {
  return leer("carrito", []);
}

function guardarCarrito(carrito) {
  escribir("carrito", carrito);
  // Avisamos a la página que el carrito cambió (para el contador del header)
  window.dispatchEvent(new CustomEvent("carrito-cambio"));
}

export function agregarAlCarrito(id, talla) {
  const carrito = getCarrito();
  // Misma prenda y misma talla = sumamos cantidad en vez de repetir fila
  const existente = carrito.find((item) => item.id === id && item.talla === talla);
  if (existente) existente.cantidad += 1;
  else carrito.push({ id, talla, cantidad: 1 });
  guardarCarrito(carrito);
}

export function cambiarCantidad(id, talla, cambio) {
  const carrito = getCarrito();
  const item = carrito.find((i) => i.id === id && i.talla === talla);
  if (!item) return;
  item.cantidad += cambio;
  // Si baja a 0, la prenda sale del carrito
  guardarCarrito(carrito.filter((i) => i.cantidad > 0));
}

export function quitarDelCarrito(id, talla) {
  guardarCarrito(getCarrito().filter((i) => !(i.id === id && i.talla === talla)));
}

// Para el "Deshacer": devuelve la fila tal como estaba y en el mismo
// puesto de la lista (si ya hay una igual, solo suma la cantidad)
export function restaurarEnCarrito(item, posicion) {
  const carrito = getCarrito();
  const existente = carrito.find((i) => i.id === item.id && i.talla === item.talla);
  if (existente) existente.cantidad += item.cantidad;
  else carrito.splice(Math.min(posicion, carrito.length), 0, { ...item });
  guardarCarrito(carrito);
}

export function vaciarCarrito() {
  guardarCarrito([]);
}

export function contarPrendasCarrito() {
  return getCarrito().reduce((total, item) => total + item.cantidad, 0);
}

// ---------- Pedidos ----------
export function getPedidos() {
  return leer("pedidos", []);
}

export function guardarPedido(pedido) {
  const pedidos = getPedidos();
  pedidos.push(pedido);
  escribir("pedidos", pedidos);
}

// ---------- Cupones de descuento ----------
// Cada vez que la persona llega a un nivel con premio gana un cupón:
// { id, nivel, pct, ganado, vence, usadoEn }. "usadoEn" es el número
// del pedido donde lo canjeó (null = todavía sin usar).
export function getCupones() {
  return leer("cupones", []);
}

export function guardarCupones(cupones) {
  escribir("cupones", cupones);
}

// ---------- Comunidad ----------
// Participantes del concurso, diseños y outfits que publica la gente.
// (Los de ejemplo viven en js/data/comunidad.js, no aquí.)
export function getParticipantes() {
  return leer("participantes", []);
}

export function guardarParticipante(participante) {
  escribir("participantes", [...getParticipantes(), participante]);
}

export function getDisenos() {
  return leer("disenos", []);
}

export function guardarDiseno(diseno) {
  escribir("disenos", [...getDisenos(), diseno]);
}

export function getOutfits() {
  return leer("outfits", []);
}

export function guardarOutfit(outfit) {
  escribir("outfits", [...getOutfits(), outfit]);
}

// Votos: se guardan POR CORREO, así cada persona tiene su propio voto
// aunque usen el mismo computador (útil en las pruebas con usuarios).
// { "correo@x.com": { concurso: "p-ej-1", disenos: ["d-ej-2", ...] } }
export function getVotos() {
  return leer("votos", {});
}

export function guardarVotos(votos) {
  escribir("votos", votos);
}

// ---------- Resultado del quiz ----------
// Se guarda aunque la persona no esté registrada: el quiz es opcional
// y no queremos ponerle trabas. { estilo, puntajes, respuestas, fecha }
export function getQuiz() {
  return leer("quiz", null);
}

export function guardarQuiz(resultado) {
  escribir("quiz", resultado);
}

// ---------- Preferencias pequeñas ----------
// Ej: si la persona dijo "Ahora no" al quiz, no se lo volvemos a
// poner en la cara en el inicio.
export function getPreferencia(clave, porDefecto = null) {
  return leer("pref_" + clave, porDefecto);
}

export function guardarPreferencia(clave, valor) {
  escribir("pref_" + clave, valor);
}
