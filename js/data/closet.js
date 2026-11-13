// ============================================================
// closet.js (datos) — Cajas con QR y reglas de combinación
// ------------------------------------------------------------
// 1) CAJAS_DEMO: cada paquete de Chased traería un QR en la caja.
//    Al escanearlo, sus prendas entran a tu closet. En el prototipo
//    el escaneo es SIMULADO y estos códigos son de demostración.
// 2) COMBINA_COLOR: qué colores van bien juntos. Es una regla
//    sencilla de moda (neutros con todo, tierra con claros…), no
//    un dato de negocio: se puede ajustar sin problema.
// ============================================================

// Códigos de caja de DEMO → prendas que traía esa caja (ids de productos.js)
export const CAJAS_DEMO = {
  "CH-CAJA-01": ["cam-ch-negra", "jogger-gris"],
  "CH-CAJA-02": ["hoodie-nov-azul", "short-negro"],
  "CH-CAJA-03": ["cam-logo-blanca", "jogger-beige"],
};

// Para cada color, con qué colores combina (en orden de preferencia)
export const COMBINA_COLOR = {
  negro: ["negro", "blanco hueso", "beige", "gris", "azul celeste"],
  blanco: ["negro", "beige", "azul celeste", "gris"],
  "blanco hueso": ["negro", "beige", "azul celeste", "gris"],
  beige: ["blanco hueso", "negro", "beige"],
  "azul celeste": ["blanco hueso", "negro", "gris", "azul celeste"],
  gris: ["negro", "blanco hueso", "azul celeste"],
};

// Qué parte complementa a cada casilla del outfit
export const COMPLEMENTO = { arriba: "abajo", abajo: "arriba", extra: "abajo" };
