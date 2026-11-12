// ============================================================
// quiz.js — "Queremos conocerte"
// ------------------------------------------------------------
// Una pregunta por pantalla, como una conversación y no como un
// formulario del colegio. Nada de peso, altura ni temas raros: solo
// cómo te gusta verte y sentirte. Es opcional (se puede salir en
// cualquier momento) y no pide registro.
// ============================================================

import { htmlTarjeta } from "./app.js";
import { TEXTOS } from "./textos.js";
import { guardarQuiz, guardarPreferencia } from "./storage.js";
import { recomendarParaTi } from "./recomendador.js";

const T = TEXTOS;
const Q = T.quiz;
const contenido = document.getElementById("contenido");

// respuestas[i] = índice de la opción elegida en la pregunta i
let respuestas = [];
let preguntaActual = 0;

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

function renderPregunta() {
  const total = Q.preguntas.length;
  const pregunta = Q.preguntas[preguntaActual];
  const elegida = respuestas[preguntaActual];
  const porcentaje = Math.round((preguntaActual / total) * 100);

  const opciones = pregunta.opciones
    .map(
      (op, i) => `
      <button class="opcion" type="button" data-opcion="${i}" aria-pressed="${elegida === i}">
        ${op.texto}
      </button>`
    )
    .join("");

  contenido.innerHTML = `
    <section class="seccion contenedor quiz">
      <p class="texto-suave">${Q.pregunta(preguntaActual + 1, total)}</p>
      <div class="barra"><span style="width:${porcentaje}%"></span></div>
      <h1 class="quiz__pregunta">${pregunta.texto}</h1>
      <div class="opciones">${opciones}</div>
      <div class="quiz__acciones quiz__acciones--fila">
        ${preguntaActual > 0 ? `<button class="boton-texto" type="button" data-accion="atras">${Q.atras}</button>` : "<span></span>"}
        ${botonSaltar()}
      </div>
    </section>`;
}

function renderResultado(resultado) {
  const estilo = Q.estilos[resultado.estilo];
  // Ya guardamos el quiz, así que el recomendador ya "sabe" el estilo
  const sugeridas = recomendarParaTi(8)
    .lista.filter((r) => !r.descubre)
    .slice(0, 4)
    .map((r) => r.producto);

  contenido.innerHTML = `
    <section class="seccion contenedor quiz quiz--resultado">
      <img class="quiz__ch" src="assets/logo/simbolo-ch-negro.png" alt="">
      <p class="texto-suave">${Q.resultado}</p>
      <h1 class="quiz__estilo">${estilo.nombre}</h1>
      <p class="quiz__intro">${estilo.descripcion}</p>
      <p class="texto-suave">${Q.guardado}</p>
      <div class="quiz__acciones">
        <a class="boton" href="catalogo.html">${Q.verParaTi}</a>
        <a class="boton boton--claro" href="perfil.html">${Q.irPerfil}</a>
        <button class="boton-texto" type="button" data-accion="repetir">${Q.repetir}</button>
      </div>
    </section>
    <section class="seccion contenedor">
      <h2>${Q.leVa}</h2>
      <div class="grilla">${sugeridas.map(htmlTarjeta).join("")}</div>
    </section>`;
}

// ---------- Eventos ----------
function elegirOpcion(indice) {
  respuestas[preguntaActual] = indice;
  if (preguntaActual < Q.preguntas.length - 1) {
    preguntaActual += 1;
    renderPregunta();
  } else {
    const resultado = calcularResultado();
    guardarQuiz(resultado);
    renderResultado(resultado);
  }
  window.scrollTo(0, 0);
}

function empezar() {
  respuestas = [];
  preguntaActual = 0;
  renderPregunta();
}

contenido.addEventListener("click", (e) => {
  const opcion = e.target.closest("[data-opcion]");
  if (opcion) return elegirOpcion(Number(opcion.dataset.opcion));

  const accion = e.target.closest("[data-accion]")?.dataset.accion;
  if (accion === "empezar" || accion === "repetir") empezar();
  if (accion === "atras") {
    preguntaActual -= 1;
    renderPregunta();
  }
  // "Ahora no": respetamos la decisión y no volvemos a invitarlo en el inicio
  if (accion === "saltar") guardarPreferencia("quizOculto", true);
});

renderIntro();
