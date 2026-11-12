// ============================================================
// comunidad.js (datos) — Concurso, diseños y outfits de EJEMPLO
// ------------------------------------------------------------
// Para que la demo no se vea vacía, arrancamos con unos cuantos
// participantes, diseños y outfits DE EJEMPLO (nombres genéricos,
// marcados con "Ejemplo" en la página). Lo que la gente agrega de
// verdad se guarda en el localStorage y se suma a esto.
// Para dejar la comunidad "limpia", basta con vaciar estas listas.
// ============================================================

// Datos del concurso: aún no confirmados por Chased
export const CONCURSO = {
  fecha: null, // TODO confirmar con Chased (se muestra "Por confirmar")
  lugar: null, // TODO confirmar con Chased
};

// votosBase = votos de ejemplo con los que arranca cada uno
export const PARTICIPANTES_EJEMPLO = [
  { id: "p-ej-1", nombre: "Crew Norte", estilo: "Hip hop", votosBase: 21, video: null },
  { id: "p-ej-2", nombre: "Dúo Ritmo", estilo: "Dancehall", votosBase: 17, video: null },
  { id: "p-ej-3", nombre: "Flow Libre", estilo: "Freestyle", votosBase: 12, video: null },
  { id: "p-ej-4", nombre: "Paso Firme", estilo: "Breaking", votosBase: 8, video: null },
];

// Diseños de ejemplo: sin imagen, se muestran como tarjeta tipográfica
export const DISENOS_EJEMPLO = [
  { id: "d-ej-1", nombre: "Persigue lo tuyo", descripcion: "La frase en la espalda, grande, en serif.", autor: "Familia Chased", likesBase: 14, imagen: null },
  { id: "d-ej-2", nombre: "CH en movimiento", descripcion: "El monograma repetido como si corriera por la manga.", autor: "Familia Chased", likesBase: 9, imagen: null },
  { id: "d-ej-3", nombre: "Medellín de noche", descripcion: "Siluetas de la ciudad en gris sobre negro.", autor: "Familia Chased", likesBase: 6, imagen: null },
];

// Outfits de ejemplo armados con prendas reales del catálogo (ids de productos.js)
export const OUTFITS_EJEMPLO = [
  { id: "o-ej-1", autor: "Familia Chased", prendas: ["hoodie-time-negro", "jogger-negro"] },
  { id: "o-ej-2", autor: "Familia Chased", prendas: ["buzo-nov-beige", "jogger-beige"] },
  { id: "o-ej-3", autor: "Familia Chased", prendas: ["crop-hoodie-azul", "jogger-azul"] },
];

// Fotos de las sesiones de la familia Chased (NO son eventos)
export const FOTOS_FAMILIA = [
  "assets/img/comunidad/familia-01.jpg",
  "assets/img/comunidad/familia-02.jpg",
  "assets/img/comunidad/familia-03.jpg",
  "assets/img/comunidad/familia-04.jpg",
  "assets/img/comunidad/familia-05.jpg",
];
