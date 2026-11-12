// ============================================================
// quiz.js — "Queremos conocerte"
// ------------------------------------------------------------
// Una pregunta por pantalla, como una conversación y no como un
// formulario del colegio. Nada de peso, altura ni temas raros: solo
// cómo te gusta verte y sentirte. Es opcional (se puede salir en
// cualquier momento) y no pide registro.
// ============================================================

import { htmlTarjeta, htmlTarjetaEstilo } from "./app.js";
import { TEXTOS } from "./textos.js";
import { guardarQuiz, guardarPreferencia, getUsuario } from "./storage.js";
// La carga de cuadritos (Anime.js) es compartida con la compra
import { mostrarCarga } from "./animaciones.js";
import { recomendarParaTi } from "./recomendador.js";

const T = TEXTOS;
const Q = T.quiz;
const contenido = document.getElementById("contenido");

// respuestas[i] = índice de la opción elegida en la pregunta i
let respuestas = [];
let preguntaActual = 0;
// Mientras una pregunta se está yendo, ignoramos clics (si no, un
// doble clic rápido se saltaría una pregunta)
let animando = false;

// ---------- Calcular el estilo ----------
// Cada opción trae tags. Sumamos un punto por tag y gana el que más
// tenga. En empate gana el que aparece primero en Q.estilos (así el
// resultado siempre es el mismo con las mismas respuestas).
function calcularResultado() {
  const puntajes = Object.fromEntries(Object.keys(Q.estilos).map((e) => [e, 0]));
  respuestas.forEach((opcion, i) => {
    Q.preguntas[i].opciones[opcion].tags.forEach((tag) => (puntajes[tag] += 1));
  });
  const estilo = Object.keys(puntajes).reduce((ganador, e) => (puntajes[e] > puntajes[ganador] ? e : ganador));
  return { estilo, puntajes, respuestas: [...respuestas], fecha: new Date().toISOString() };
}

// ---------- Pantallas ----------
function botonSaltar() {
  return `<a class="boton-texto" href="index.html" data-accion="saltar">${Q.saltar}</a>`;
}

function renderIntro() {
  contenido.innerHTML = `
    <section class="seccion contenedor quiz">
      <img class="quiz__ch" src="assets/logo/simbolo-ch-negro.png" alt="">
      <h1>${Q.titulo}</h1>
      <p class="quiz__intro">${Q.intro}</p>
      <div class="quiz__acciones">
        <button class="boton" type="button" data-accion="empezar">${Q.empezar}</button>
        ${botonSaltar()}
      </div>
    </section>`;
}

// El esqueleto de las preguntas se arma UNA vez; luego solo se
// cambia lo de adentro. Así la barra de arriba puede crecer con
// una transición suave en vez de aparecer de golpe.
function montarPreguntas() {
  contenido.innerHTML = `
    <section class="seccion contenedor quiz">
      <p class="texto-suave" id="quiz-contador"></p>
      <div class="barra barra--quiz"><span id="quiz-barra"></span></div>
      <div class="quiz__marco"><div class="quiz__panel" id="quiz-panel"></div></div>
      <div class="quiz__navegacion">
        <button class="boton-texto" type="button" data-accion="atras" id="quiz-atras">${Q.atras}</button>
        <button class="boton" type="button" data-accion="siguiente" id="quiz-siguiente">${Q.siguiente}</button>
      </div>
      <div class="quiz__saltar">${botonSaltar()}</div>
    </section>`;
}

const LETRAS = ["A", "B", "C", "D", "E", "F"];

function htmlPregunta() {
  const pregunta = Q.preguntas[preguntaActual];
  const elegida = respuestas[preguntaActual];
  const opciones = pregunta.opciones
    .map(
      (op, i) => `
      <button class="opcion" type="button" data-opcion="${i}" aria-pressed="${elegida === i}">
        <span class="opcion__letra">${LETRAS[i]}</span>
        <span>${op.texto}</span>
      </button>`
    )
    .join("");
  return `
    <h1 class="quiz__pregunta">${pregunta.texto}</h1>
    <div class="opciones">${opciones}</div>`;
}

// Actualiza contador, barra y botones según la pregunta actual
function actualizarControles() {
  const total = Q.preguntas.length;
  document.getElementById("quiz-contador").textContent = Q.pregunta(preguntaActual + 1, total);
  document.getElementById("quiz-barra").style.width = `${Math.round(((preguntaActual + 1) / total) * 100)}%`;
  document.getElementById("quiz-atras").style.visibility = preguntaActual > 0 ? "visible" : "hidden";
  const siguiente = document.getElementById("quiz-siguiente");
  siguiente.disabled = respuestas[preguntaActual] === undefined;
  siguiente.textContent = preguntaActual === total - 1 ? Q.verResultado : Q.siguiente;
}

// Cambio de pregunta con animación: la actual se va hacia un lado
// y la nueva entra desde el otro (como pasar páginas). direccion:
// 1 = adelante, -1 = atrás, 0 = sin animación (la primera vez).
const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;

function pintarPregunta(direccion = 0) {
  const panel = document.getElementById("quiz-panel");
  const entrar = () => {
    panel.innerHTML = htmlPregunta();
    actualizarControles();
    if (direccion && !sinMovimiento) {
      panel.className = "quiz__panel " + (direccion > 0 ? "entra-derecha" : "entra-izquierda");
      panel.addEventListener("animationend", () => (animando = false), { once: true });
    } else {
      animando = false;
    }
  };

  if (!direccion || sinMovimiento) return entrar();
  animando = true;
  panel.className = "quiz__panel " + (direccion > 0 ? "sale-izquierda" : "sale-derecha");
  // Cuando termina la animación de salida, pintamos la nueva pregunta
  panel.addEventListener("animationend", entrar, { once: true });
}

// ---------- Pantalla de "carga" ----------
// Es una carga de mentiritas: el resultado ya está calculado. Pero
// esos segundos hacen que se sienta que alguien de verdad está
// pensando en ti, como cuando el vendedor dice "déjame ver qué
// tengo para ti" y se va a la bodega. (La animación vive en animaciones.js)
function frasesDeCarga() {
  const frases = [...Q.cargando];
  const usuario = getUsuario();
  if (usuario) frases[1] = Q.cargandoNombre(usuario.nombre); // toque personal
  return frases;
}

function renderResultado(resultado) {
  // Ya guardamos el quiz, así que el recomendador ya "sabe" el estilo
  const sugeridas = recomendarParaTi(8)
    .lista.filter((r) => !r.descubre)
    .slice(0, 4)
    .map((r) => r.producto);

  const acciones = `
    <div class="quiz__acciones quiz__acciones--izq">
      <a class="boton boton--invertido" href="catalogo.html">${Q.verParaTi}</a>
      <a class="boton boton--borde" href="perfil.html">${Q.irPerfil}</a>
      <button class="boton-texto boton-texto--claro" type="button" data-accion="repetir">${Q.repetir}</button>
    </div>`;

  contenido.innerHTML = `
    <section class="seccion contenedor quiz--resultado">
      ${htmlTarjetaEstilo(resultado.estilo, { etiqueta: Q.resultado, acciones, grande: true })}
      <p class="texto-suave quiz__guardado">${Q.guardado}</p>
    </section>
    <section class="seccion contenedor">
      <h2>${Q.leVa}</h2>
      <div class="grilla">${sugeridas.map(htmlTarjeta).join("")}</div>
    </section>`;
}

// ---------- Eventos ----------
// Elegir solo marca la respuesta; para avanzar está "Siguiente"
// (así puede cambiar de opinión antes de pasar).
function elegirOpcion(boton) {
  respuestas[preguntaActual] = Number(boton.dataset.opcion);
  document.querySelectorAll(".opcion").forEach((b) => b.setAttribute("aria-pressed", b === boton));
  actualizarControles();
}

function avanzar() {
  if (animando || respuestas[preguntaActual] === undefined) return;
  if (preguntaActual < Q.preguntas.length - 1) {
    preguntaActual += 1;
    pintarPregunta(1);
  } else {
    const resultado = calcularResultado();
    guardarQuiz(resultado);
    animando = true; // que nadie toque nada mientras "carga"
    mostrarCarga(contenido, frasesDeCarga()).then(() => {
      animando = false;
      renderResultado(resultado);
      window.scrollTo(0, 0);
    });
  }
}

function retroceder() {
  if (animando || preguntaActual === 0) return;
  preguntaActual -= 1;
  pintarPregunta(-1);
}

function empezar() {
  respuestas = [];
  preguntaActual = 0;
  montarPreguntas();
  pintarPregunta(0);
  window.scrollTo(0, 0);
}

contenido.addEventListener("click", (e) => {
  const opcion = e.target.closest("[data-opcion]");
  if (opcion) return elegirOpcion(opcion);

  const accion = e.target.closest("[data-accion]")?.dataset.accion;
  if (accion === "empezar" || accion === "repetir") empezar();
  if (accion === "siguiente") avanzar();
  if (accion === "atras") retroceder();
  // "Ahora no": respetamos la decisión y no volvemos a invitarlo en el inicio
  if (accion === "saltar") guardarPreferencia("quizOculto", true);
});

renderIntro();
