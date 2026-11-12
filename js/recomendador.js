// ============================================================
// recomendador.js — El algoritmo "Para ti"
// ------------------------------------------------------------
// Funciona parecido a TikTok, pero en chiquito:
// 1. Cada producto tiene tags de estilo (minimal, urbano, comfy, flow).
// 2. Le damos puntos: +2 por cada tag que coincide con tu estilo del
//    quiz y +1 por cada tag que coincide con lo que compraste hace poco.
// 3. La lista final es 80% lo de más puntos y 20% cosas al azar con
//    pocos puntos ("Descubre algo distinto"), para que no te quedes
//    encerrado viendo siempre lo mismo.
// 4. Si no sabemos nada de ti (sin quiz ni compras), van los destacados.
// ============================================================

import { PRODUCTOS } from "./data/productos.js";
import { getQuiz, getPedidos } from "./storage.js";

const PEDIDOS_RECIENTES = 2; // cuántos pedidos cuentan como "compras recientes"
const PORCENTAJE_SORPRESA = 0.2;

// Tags de lo que compró en sus últimos pedidos (sin repetir)
function tagsCompradosRecientes() {
  const recientes = getPedidos().slice(-PEDIDOS_RECIENTES);
  const tags = new Set();
  recientes.forEach((pedido) =>
    pedido.items.forEach((item) => {
      const producto = PRODUCTOS.find((p) => p.id === item.id);
      producto?.tags.forEach((tag) => tags.add(tag));
    })
  );
  return tags;
}

// Lo que el recomendador sabe de la persona
function perfilDeGustos() {
  const quiz = getQuiz();
  return {
    estilo: quiz?.estilo ?? null,
    tagsCompras: tagsCompradosRecientes(),
  };
}

export function hayDatos() {
  const { estilo, tagsCompras } = perfilDeGustos();
  return Boolean(estilo) || tagsCompras.size > 0;
}

// Puntaje de UN producto. Se exporta para que el catálogo pueda
// ordenar por "Recomendado" con la misma lógica.
export function puntajeProducto(producto, gustos = perfilDeGustos()) {
  let puntos = 0;
  producto.tags.forEach((tag) => {
    if (tag === gustos.estilo) puntos += 2;
    if (gustos.tagsCompras.has(tag)) puntos += 1;
  });
  return puntos;
}

// Barajar una lista (algoritmo de Fisher-Yates: como barajar cartas
// de verdad, cada carta tiene la misma probabilidad de quedar en
// cualquier puesto).
function barajar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Devuelve [{ producto, descubre }] y el "modo" para saber qué
// subtítulo mostrar: "quiz", "compras" o "destacados".
export function recomendarParaTi(cantidad = 8) {
  const gustos = perfilDeGustos();

  if (!gustos.estilo && gustos.tagsCompras.size === 0) {
    const destacados = PRODUCTOS.filter((p) => p.destacado).slice(0, cantidad);
    return { modo: "destacados", lista: destacados.map((producto) => ({ producto, descubre: false })) };
  }

  // Barajamos antes de ordenar: así, entre productos con el mismo
  // puntaje, el orden cambia cada vez y la sección se siente viva.
  const conPuntaje = barajar(PRODUCTOS)
    .map((producto) => ({ producto, puntos: puntajeProducto(producto, gustos) }))
    .sort((a, b) => b.puntos - a.puntos);

  const cuantasSorpresas = Math.max(1, Math.round(cantidad * PORCENTAJE_SORPRESA));
  const principales = conPuntaje.slice(0, cantidad - cuantasSorpresas);
  // Las sorpresas salen de la mitad de abajo (los de menos puntos)
  const resto = conPuntaje.slice(principales.length);
  const mitadBaja = resto.slice(Math.floor(resto.length / 2));
  const sorpresas = barajar(mitadBaja).slice(0, cuantasSorpresas);

  // Metemos una sorpresa cada 4 recomendaciones, para que no
  // queden todas amontonadas al final
  const lista = [];
  principales.forEach(({ producto }, i) => {
    lista.push({ producto, descubre: false });
    if ((i + 1) % 4 === 0 && sorpresas.length) lista.push({ producto: sorpresas.shift().producto, descubre: true });
  });
  sorpresas.forEach(({ producto }) => lista.push({ producto, descubre: true }));
  return { modo: gustos.estilo ? "quiz" : "compras", estilo: gustos.estilo, lista };
}
