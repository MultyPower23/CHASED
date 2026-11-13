// ============================================================
// demo.js — Página oculta para preparar la presentación
// ------------------------------------------------------------
// Dos botones: "Cargar datos de ejemplo" (para que la demo arranque
// con un perfil lleno: insignia, pedidos, descuento, closet…) y
// "Reiniciar todo" (para que alguien del público pruebe desde cero).
// No está en el menú: se llega desde el footer o con demo.html.
// ============================================================

import {
  abrirModal,
  mostrarAviso,
  renderHeader,
  buscarProducto,
  nivelPorPrendas,
  nivelesConPremioEntre,
  crearCupon,
} from "./app.js";
import { TEXTOS } from "./textos.js";
import { CAJAS_DEMO } from "./data/closet.js";
import { USUARIA_DEMO, QUIZ_DEMO, PEDIDOS_DEMO, CAJA_DEMO, CONJUNTO_DEMO, VOTO_DEMO } from "./data/demo.js";
import {
  reiniciarTodo,
  guardarUsuario,
  guardarQuiz,
  guardarPedido,
  guardarCupones,
  registrarCaja,
  agregarAlCloset,
  guardarConjuntos,
  guardarOutfit,
  guardarVotos,
} from "./storage.js";

const T = TEXTOS;
const D = T.demo;
const contenido = document.getElementById("contenido");

const MS_POR_DIA = 24 * 60 * 60 * 1000;
const haceDias = (dias) => new Date(Date.now() - dias * MS_POR_DIA);

// ---------- Cargar datos de ejemplo ----------
// Los pedidos se arman igual que en el carrito (mismos cálculos de
// insignia y cupones), así el perfil muestra todo coherente.
function cargarPedidosDemo() {
  let prendasAntes = 0;
  const cupones = [];
  PEDIDOS_DEMO.forEach((demo, i) => {
    const fecha = haceDias(demo.diasAtras);
    const items = demo.items.map((it) => {
      const p = buscarProducto(it.id);
      return { ...it, nombre: p.nombre, precio: p.precio };
    });
    const prendas = items.reduce((suma, it) => suma + it.cantidad, 0);
    const subtotal = items.reduce((suma, it) => suma + it.precio * it.cantidad, 0);
    const nivelAntes = nivelPorPrendas(prendasAntes);
    const nivelDespues = nivelPorPrendas(prendasAntes + prendas);
    const premios = nivelesConPremioEntre(prendasAntes, prendasAntes + prendas);
    premios.forEach((nivel) => cupones.push(crearCupon(nivel, fecha)));

    guardarPedido({
      id: String(100231 + i * 417),
      fecha: fecha.toISOString(),
      items,
      prendas,
      subtotal,
      descuentoPct: 0,
      total: subtotal,
      subioNivel: nivelDespues > nivelAntes,
      nivel: T.insignias.niveles[nivelDespues],
      cuponesGanados: premios.length,
      canjeoAlInstante: false,
      estado: "confirmado",
    });
    prendasAntes += prendas;
  });
  guardarCupones(cupones); // quedan sin usar: el descuento aparece en el carrito
}

function cargarDemo() {
  reiniciarTodo(); // partimos de cero para que no se mezcle con pruebas viejas
  const usuaria = { ...USUARIA_DEMO, fechaRegistro: haceDias(15).toISOString() };
  guardarUsuario(usuaria);
  guardarQuiz({ ...QUIZ_DEMO, fecha: haceDias(14).toISOString() });
  cargarPedidosDemo();

  // Caja escaneada: sus prendas entran al closet
  registrarCaja(CAJA_DEMO);
  CAJAS_DEMO[CAJA_DEMO].forEach(agregarAlCloset);

  // Un conjunto guardado y publicado en Comunidad
  const outfitId = `o-demo-${Date.now()}`;
  guardarConjuntos([
    {
      id: `cj-demo-${Date.now()}`,
      nombre: CONJUNTO_DEMO.nombre,
      prendas: { ...CONJUNTO_DEMO.prendas },
      guardado: true,
      publicado: true,
      outfitId,
      fecha: haceDias(2).toISOString(),
    },
  ]);
  guardarOutfit({
    id: outfitId,
    nombre: CONJUNTO_DEMO.nombre,
    autor: usuaria.nombre,
    correo: usuaria.correo,
    prendas: Object.values(CONJUNTO_DEMO.prendas).filter(Boolean),
  });

  // Un voto en el concurso (le quedan 2 de 3 para mostrar en vivo)
  guardarVotos({ [usuaria.correo]: { concurso: [VOTO_DEMO], disenos: [] } });

  renderHeader(); // el header ya saluda a la usuaria de ejemplo
  mostrarAviso(D.cargado);
}

// ---------- Reiniciar todo (con confirmación) ----------
function confirmarReinicio() {
  const modal = abrirModal(
    `<div class="modal__cuerpo confirmar">
      <h2>${D.reiniciarTitulo}</h2>
      <p>${D.confirmar}</p>
      <div class="confirmar__acciones">
        <button class="boton boton--grande" type="button" data-respuesta="si">${D.reiniciar}</button>
        <button class="boton boton--claro" type="button" data-respuesta="no">${T.comunidad.evento.confirmarNo}</button>
      </div>
    </div>`,
    { chico: true }
  );
  modal.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-respuesta]");
    if (!boton) return;
    if (boton.dataset.respuesta === "si") {
      reiniciarTodo();
      renderHeader();
      mostrarAviso(D.reiniciado);
    }
    modal.close();
  });
}

// ---------- Página ----------
function render() {
  contenido.innerHTML = `
    <section class="seccion contenedor demo">
      <h1>${D.titulo}</h1>
      <p class="texto-suave">${D.intro}</p>
      <div class="demo__tarjetas">
        <article class="demo__tarjeta">
          <h2>${D.cargarTitulo}</h2>
          <p>${D.cargarTexto}</p>
          <button class="boton boton--grande boton--ancho" type="button" data-accion="cargar">${D.cargar}</button>
        </article>
        <article class="demo__tarjeta demo__tarjeta--clara">
          <h2>${D.reiniciarTitulo}</h2>
          <p>${D.reiniciarTexto}</p>
          <button class="boton boton--claro boton--grande boton--ancho" type="button" data-accion="reiniciar">${D.reiniciar}</button>
        </article>
      </div>
      <h2 class="titulo-ch"><img src="assets/logo/simbolo-ch-negro.png" alt="">${D.recorrido}</h2>
      <ol class="demo__pasos">${D.pasos.map((paso) => `<li>${paso}</li>`).join("")}</ol>
      <a class="boton" href="index.html">${D.ir}</a>
    </section>`;
}

contenido.addEventListener("click", (e) => {
  const accion = e.target.closest("[data-accion]")?.dataset.accion;
  if (accion === "cargar") cargarDemo();
  if (accion === "reiniciar") confirmarReinicio();
});

render();
