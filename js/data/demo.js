// ============================================================
// demo.js (datos) — Datos de EJEMPLO para la presentación
// ------------------------------------------------------------
// Una usuaria ficticia con todo "andando": así en la demo no hay que
// comprar 4 prendas en vivo para mostrar la insignia. Todo esto se
// carga desde demo.html y se borra con "Reiniciar todo".
// Los precios salen de productos.js (referenciales), no se inventan.
// ============================================================

export const USUARIA_DEMO = {
  nombre: "Valentina",
  correo: "valentina@ejemplo.com",
  foto: null,
};

// Resultado de quiz de ejemplo
export const QUIZ_DEMO = { estilo: "urbano", puntajes: { minimal: 1, urbano: 4, comfy: 1, flow: 2 }, respuestas: [1, 0, 1, 0, 1] };

// Dos pedidos: el primero da Rookie (1 prenda) y el segundo sube a
// Runner (4 en total), lo que deja un cupón de descuento sin usar.
// diasAtras = hace cuántos días fue el pedido
export const PEDIDOS_DEMO = [
  { diasAtras: 12, items: [{ id: "cam-owg-negra", talla: "M", cantidad: 1 }] },
  {
    diasAtras: 3,
    items: [
      { id: "jogger-negro", talla: "M", cantidad: 1 },
      { id: "hoodie-time-negro", talla: "L", cantidad: 1 },
      { id: "cam-ch-negra", talla: "M", cantidad: 1 },
    ],
  },
];

// Caja escaneada de ejemplo (código de demo de data/closet.js)
export const CAJA_DEMO = "CH-CAJA-02";

// Conjunto guardado y publicado
export const CONJUNTO_DEMO = {
  nombre: "Noche · Total black",
  prendas: { arriba: "cam-ch-negra", abajo: "jogger-negro", extra: "hoodie-time-negro" },
};

// Votó por un participante de ejemplo del concurso
export const VOTO_DEMO = "p-ej-2";
