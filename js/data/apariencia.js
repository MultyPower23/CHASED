// ============================================================
// apariencia.js — Fotos e iconos de estilos e insignias
// ------------------------------------------------------------
// Aquí se dice QUÉ imagen usa cada estilo del quiz y cada nivel de
// insignia. Los nombres y textos siguen en textos.js; esto es solo
// "la ropa" visual. Si mañana diseñan iconos propios, se guardan
// con el nombre de abajo y aparecen solos (ver los LEEME.md).
// ============================================================

// Foto de fondo de cada estilo (sesiones de la familia Chased y
// fotos de producto) + icono custom opcional.
export const ESTILOS_VISUALES = {
  minimal: { fondo: "assets/img/comunidad/familia-01.jpg", icono: "assets/img/estilos/minimal.png" },
  urbano: { fondo: "assets/img/comunidad/familia-03.jpg", icono: "assets/img/estilos/urbano.png" },
  comfy: { fondo: "assets/img/comunidad/familia-04.jpg", icono: "assets/img/estilos/comfy.png" },
  flow: { fondo: "assets/img/productos/crop-top-negro.jpg", icono: "assets/img/estilos/flow.png" },
};

// Icono custom de cada nivel, en el mismo orden que
// TEXTOS.insignias.niveles (Rookie, Runner, Chaser, Leyenda).
// Si el archivo no existe, se muestra el símbolo CH oficial.
export const ICONOS_INSIGNIAS = [
  "assets/img/insignias/rookie.png",
  "assets/img/insignias/runner.png",
  "assets/img/insignias/chaser.png",
  "assets/img/insignias/leyenda.png",
];

// Plan B cuando no hay icono custom
export const ICONO_RESPALDO = "assets/logo/simbolo-ch-blanco.png";
