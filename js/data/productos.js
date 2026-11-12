// ============================================================
// productos.js — El catálogo de Chased
// ------------------------------------------------------------
// Sacado de las fotos de Instagram de @chased_med.
// ⚠️ PRECIOS: en su WhatsApp hay 3 camisetas a $65.000, pero no
// sabemos CUÁLES son. Por eso todas las camisetas van a $65.000
// como referencia y TODO tiene precioConfirmado: false hasta que
// Chased lo confirme. En la página se muestran como "referencial".
// ⚠️ TALLAS: aún no tenemos las reales, así que son referenciales.
//
// tags = estilos del quiz (minimal, urbano, comfy, flow). Con ellos
// el recomendador decide qué mostrarte, como cuando TikTok aprende
// qué videos te gustan.
//
// imagen = guarda la foto de Instagram con ESTE nombre exacto en
// assets/img/productos/. Si falta, la página pone un placeholder.
// ============================================================

export const CONFIG = {
  moneda: "COP",
  prendasPorNivel: 4, // definido por el equipo: cada 4 prendas subes de nivel
  descuentoPorNivel: 10, // % — TODO confirmar con el equipo/Chased
  tallas: ["S", "M", "L", "XL"], // TODO confirmar tallas reales
};

export const PRODUCTOS = [
  // --- Camisetas (precio real) ---
  { id: "cam-owg-negra", nombre: "Camiseta Only With God", tipo: "camiseta", color: "negro", genero: "unisex",
    precio: 65000, precioConfirmado: false, tags: ["urbano"], destacado: true,
    descripcion: "Oversize con la serpiente Chased en la espalda.", imagen: "assets/img/productos/cam-owg-negra.jpg" },
  { id: "cam-owg-blanca", nombre: "Camiseta Only With God", tipo: "camiseta", color: "blanco hueso", genero: "unisex",
    precio: 65000, precioConfirmado: false, tags: ["urbano", "minimal"], destacado: true,
    descripcion: "Oversize blanca hueso con estampado trasero.", imagen: "assets/img/productos/cam-owg-blanca.jpg" },
  { id: "cam-logo-blanca", nombre: "Camiseta Logo Pecho", tipo: "camiseta", color: "blanco hueso", genero: "unisex",
    precio: 65000, precioConfirmado: false, tags: ["minimal"], destacado: false,
    descripcion: "Oversize blanca con 'Chased' al pecho.", imagen: "assets/img/productos/cam-logo-blanca.jpg" },
  { id: "cam-ch-negra", nombre: "Camiseta Símbolo CH", tipo: "camiseta", color: "negro", genero: "unisex",
    precio: 65000, precioConfirmado: false, tags: ["minimal", "urbano"], destacado: true,
    descripcion: "Negra con el monograma CH al pecho.", imagen: "assets/img/productos/cam-ch-negra.jpg" },
  { id: "cam-stencil-blanca", nombre: "Camiseta CHASED Stencil", tipo: "camiseta", color: "blanco", genero: "unisex",
    precio: 65000, precioConfirmado: false, tags: ["minimal"], destacado: false,
    descripcion: "Blanca con CHASED stencil en rojo al pecho.", imagen: "assets/img/productos/cam-stencil-blanca.jpg" },
  { id: "cam-angel-negra", nombre: "Camiseta Ángel", tipo: "camiseta", color: "negro", genero: "unisex",
    precio: 65000, precioConfirmado: false, tags: ["urbano"], destacado: false,
    descripcion: "Negra con gráfico de ángel en la espalda.", imagen: "assets/img/productos/cam-angel-negra.jpg" },
  { id: "cam-change-blanca", nombre: "Camiseta The Change Is In You", tipo: "camiseta", color: "blanco hueso", genero: "unisex",
    precio: 65000, precioConfirmado: false, tags: ["urbano", "comfy"], destacado: false,
    descripcion: "Blanca con CHASED y frase en la espalda.", imagen: "assets/img/productos/cam-change-blanca.jpg" },
  // TODO: confirmar cuáles son las 3 camisetas de $65.000 y el precio de las demás

  // --- Hoodies y buzos (precio referencial) ---
  { id: "hoodie-chased-blanco", nombre: "Hoodie Chased", tipo: "hoodie", color: "blanco hueso", genero: "unisex",
    precio: 120000, precioConfirmado: false, tags: ["comfy", "minimal"], destacado: true,
    descripcion: "Hoodie oversize con 'chased' bordado.", imagen: "assets/img/productos/hoodie-chased-blanco.jpg" },
  { id: "hoodie-nov-azul", nombre: "Hoodie NOV. 2024", tipo: "hoodie", color: "azul celeste", genero: "unisex",
    precio: 120000, precioConfirmado: false, tags: ["comfy", "flow"], destacado: false,
    descripcion: "Hoodie azul celeste edición NOV. 2024.", imagen: "assets/img/productos/hoodie-nov-azul.jpg" },
  { id: "hoodie-grafico-azul", nombre: "Hoodie Chased Espalda", tipo: "hoodie", color: "azul celeste", genero: "unisex",
    precio: 120000, precioConfirmado: false, tags: ["urbano"], destacado: false,
    descripcion: "Hoodie con gráfico grande en la espalda.", imagen: "assets/img/productos/hoodie-grafico-azul.jpg" },
  { id: "buzo-nov-beige", nombre: "Buzo NOV. 2024", tipo: "buzo", color: "beige", genero: "unisex",
    precio: 110000, precioConfirmado: false, tags: ["comfy", "minimal"], destacado: true,
    descripcion: "Buzo cuello redondo beige con bordado.", imagen: "assets/img/productos/buzo-nov-beige.jpg" },

  { id: "hoodie-rosa-blanco", nombre: "Hoodie Rosa Chased", tipo: "hoodie", color: "blanco hueso", genero: "unisex",
    precio: 120000, precioConfirmado: false, tags: ["urbano", "comfy"], destacado: false,
    descripcion: "Hoodie con CHASED y rosa en la espalda.", imagen: "assets/img/productos/hoodie-rosa-blanco.jpg" },
  { id: "hoodie-time-negro", nombre: "Hoodie The Time Is Now", tipo: "hoodie", color: "negro", genero: "unisex",
    precio: 120000, precioConfirmado: false, tags: ["urbano", "flow"], destacado: false,
    descripcion: "Hoodie negro con frase en la espalda.", imagen: "assets/img/productos/hoodie-time-negro.jpg" },

  // --- Joggers (precio referencial) ---
  { id: "jogger-negro", nombre: "Jogger Chased", tipo: "jogger", color: "negro", genero: "unisex",
    precio: 95000, precioConfirmado: false, tags: ["urbano", "flow"], destacado: true,
    descripcion: "Jogger con 'chased' en la pierna.", imagen: "assets/img/productos/jogger-negro.jpg" },
  { id: "jogger-beige", nombre: "Jogger Chased", tipo: "jogger", color: "beige", genero: "unisex",
    precio: 95000, precioConfirmado: false, tags: ["comfy"], destacado: false,
    descripcion: "Jogger beige, combina con el buzo NOV.", imagen: "assets/img/productos/jogger-beige.jpg" },
  { id: "jogger-blanco", nombre: "Jogger Chased", tipo: "jogger", color: "blanco hueso", genero: "unisex",
    precio: 95000, precioConfirmado: false, tags: ["minimal", "comfy"], destacado: false,
    descripcion: "Jogger blanco hueso.", imagen: "assets/img/productos/jogger-blanco.jpg" },
  { id: "jogger-azul", nombre: "Jogger Chased", tipo: "jogger", color: "azul celeste", genero: "unisex",
    precio: 95000, precioConfirmado: false, tags: ["flow", "comfy"], destacado: false,
    descripcion: "Jogger azul celeste, set con el hoodie.", imagen: "assets/img/productos/jogger-azul.jpg" },
  { id: "jogger-gris", nombre: "Jogger Chased", tipo: "jogger", color: "gris", genero: "unisex",
    precio: 95000, precioConfirmado: false, tags: ["comfy", "urbano"], destacado: false,
    descripcion: "Jogger gris.", imagen: "assets/img/productos/jogger-gris.jpg" },

  // --- Crop, bodies y shorts (precio referencial) ---
  { id: "crop-hoodie-azul", nombre: "Crop Hoodie", tipo: "crop", color: "azul celeste", genero: "mujer",
    precio: 90000, precioConfirmado: false, tags: ["flow", "urbano"], destacado: false,
    descripcion: "Crop hoodie azul celeste.", imagen: "assets/img/productos/crop-hoodie-azul.jpg" },
  { id: "crop-top-negro", nombre: "Crop Top Chased", tipo: "crop", color: "negro", genero: "mujer",
    precio: 60000, precioConfirmado: false, tags: ["flow", "urbano"], destacado: false,
    descripcion: "Crop top negro con logo.", imagen: "assets/img/productos/crop-top-negro.jpg" },
  { id: "body-negro", nombre: "Body Hombros Descubiertos", tipo: "body", color: "negro", genero: "mujer",
    precio: 70000, precioConfirmado: false, tags: ["urbano", "minimal"], destacado: false,
    descripcion: "Body negro manga larga.", imagen: "assets/img/productos/body-negro.jpg" },
  { id: "tank-blanco", nombre: "Tank Top Chased", tipo: "crop", color: "blanco", genero: "mujer",
    precio: 60000, precioConfirmado: false, tags: ["minimal", "flow"], destacado: false,
    descripcion: "Esqueleto blanco con logo rojo.", imagen: "assets/img/productos/tank-blanco.jpg" },
  { id: "short-negro", nombre: "Short Chased", tipo: "short", color: "negro", genero: "unisex",
    precio: 60000, precioConfirmado: false, tags: ["flow"], destacado: false,
    descripcion: "Short negro con 'chased' lateral.", imagen: "assets/img/productos/short-negro.jpg" },
];

// Géneros: la mayoría de la ropa es unisex, así que cuenta tanto
// para Hombre como para Mujer (y además tiene su propia sección).
// Así no inventamos géneros que Chased no ha definido: solo
// agrupamos lo que ya está.
export const GENEROS = {
  hombre: ["hombre", "unisex"],
  mujer: ["mujer", "unisex"],
  unisex: ["unisex"],
};

// Colecciones / temáticas del inicio. No son datos nuevos: son
// "filtros guardados" sobre los productos de arriba (por tipo, color,
// tag o id). portada = id del producto cuya foto se usa de portada.
export const COLECCIONES = [
  { clave: "camisetas", filtro: { tipo: ["camiseta"] }, portada: "cam-owg-negra" },
  { clave: "abrigo", filtro: { tipo: ["hoodie", "buzo"] }, portada: "hoodie-chased-blanco" },
  { clave: "joggers", filtro: { tipo: ["jogger", "short"] }, portada: "jogger-negro" },
  { clave: "bailar", filtro: { tags: ["flow"] }, portada: "crop-hoodie-azul" },
  { clave: "negro", filtro: { color: ["negro"] }, portada: "hoodie-time-negro" },
  // Edición con nombre propio (sale de las prendas "NOV. 2024")
  { clave: "nov2024", filtro: { id: ["hoodie-nov-azul", "buzo-nov-beige"] }, portada: "buzo-nov-beige", edicion: true },
];

// Para el maniquí: qué casilla ocupa cada tipo de prenda
export const CASILLA_POR_TIPO = {
  camiseta: "arriba", hoodie: "arriba", buzo: "arriba", crop: "arriba", body: "arriba",
  jogger: "abajo", short: "abajo",
};
