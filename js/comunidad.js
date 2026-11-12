// ============================================================
// comunidad.js — El corazón de la propuesta
// ------------------------------------------------------------
// Aquí Chased deja de ser "una tienda" y se vuelve "una familia":
// la gente se inscribe al concurso de baile, vota, propone diseños
// y muestra sus outfits. Todo lo que hace la gente se guarda en el
// localStorage y se suma a los datos de ejemplo de data/comunidad.js.
// ============================================================

import {
  abrirModal,
  mostrarAviso,
  pedirRegistro,
  escaparHTML,
  buscarProducto,
  htmlFoto,
  leerFotoReducida,
} from "./app.js";
import { TEXTOS } from "./textos.js";
import {
  CONCURSO,
  PARTICIPANTES_EJEMPLO,
  DISENOS_EJEMPLO,
  OUTFITS_EJEMPLO,
  FOTOS_FAMILIA,
} from "./data/comunidad.js";
import {
  getUsuario,
  getParticipantes,
  guardarParticipante,
  getDisenos,
  guardarDiseno,
  getOutfits,
  getVotos,
  guardarVotos,
} from "./storage.js";
import { contarHasta, revelarAlBajar, rebotar, aparecer } from "./animaciones.js";

const T = TEXTOS;
const C = T.comunidad;
const contenido = document.getElementById("contenido");

// ============================================================
// Datos: ejemplo + lo que agregó la gente
// ============================================================

const todosLosParticipantes = () => [
  ...PARTICIPANTES_EJEMPLO.map((p) => ({ ...p, ejemplo: true })),
  ...getParticipantes(),
];

const todosLosDisenos = () => [...DISENOS_EJEMPLO.map((d) => ({ ...d, ejemplo: true })), ...getDisenos()];

const todosLosOutfits = () => [...OUTFITS_EJEMPLO.map((o) => ({ ...o, ejemplo: true })), ...getOutfits()];

// Los votos de UNA persona (por su correo)
function votosDe(correo) {
  return getVotos()[correo] ?? { concurso: null, disenos: [] };
}

function guardarVotosDe(correo, votosPersona) {
  guardarVotos({ ...getVotos(), [correo]: votosPersona });
}

// Votos de un participante = los de ejemplo + los que dio la gente
function votosDeParticipante(participante) {
  const deLaGente = Object.values(getVotos()).filter((v) => v.concurso === participante.id).length;
  return (participante.votosBase ?? 0) + deLaGente;
}

function likesDeDiseno(diseno) {
  const deLaGente = Object.values(getVotos()).filter((v) => v.disenos?.includes(diseno.id)).length;
  return (diseno.likesBase ?? 0) + deLaGente;
}

function totalVotos() {
  const concurso = todosLosParticipantes().reduce((suma, p) => suma + votosDeParticipante(p), 0);
  const disenos = todosLosDisenos().reduce((suma, d) => suma + likesDeDiseno(d), 0);
  return concurso + disenos;
}

// Votar, inscribirse y publicar piden registro (regla de oro #5).
// Si ya está registrad@, sigue de una; si no, abre el registro.
async function asegurarRegistro(mensaje) {
  return getUsuario() ?? (await pedirRegistro(mensaje));
}

// Etiquetas pequeñitas ("Ejemplo", "Tú", "Va ganando")
const etiqueta = (texto, clase = "") => `<span class="etiqueta ${clase}">${texto}</span>`;

const tituloSeccion = (texto) =>
  `<h2 class="titulo-ch"><img src="assets/logo/simbolo-ch-negro.png" alt="">${texto}</h2>`;

// Iniciales para la tarjeta del participante ("Crew Norte" → "CN")
const iniciales = (nombre) =>
  nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0).toUpperCase())
    .join("");

// ============================================================
// Portada negra con contadores
// ============================================================

function htmlPortada() {
  const atajos = Object.entries(C.ir)
    .map(([id, texto]) => `<a href="#${id}">${texto}</a>`)
    .join("");
  return `
    <section class="portada-comunidad">
      <div class="contenedor">
        <img class="portada-comunidad__logo" src="assets/logo/logo-stencil-blanco.png" alt="${T.marca.nombre}">
        <h1>${C.titulo}</h1>
        <p class="portada-comunidad__intro">${C.intro}</p>
        <div class="stats" id="stats"></div>
        <nav class="atajos" aria-label="${C.titulo}">${atajos}</nav>
      </div>
    </section>`;
}

function renderStats(animar = false) {
  const datos = [
    { n: todosLosParticipantes().length, texto: C.stats.participantes },
    { n: totalVotos(), texto: C.stats.votos },
    { n: todosLosDisenos().length, texto: C.stats.disenos },
  ];
  const lugar = document.getElementById("stats");
  lugar.innerHTML = datos
    .map((d) => `<div class="stat"><strong data-n="${d.n}">${animar ? 0 : d.n}</strong><span>${d.texto}</span></div>`)
    .join("");
  // Los números suben contando, como un marcador de estadio
  if (animar) lugar.querySelectorAll("[data-n]").forEach((el) => contarHasta(el, Number(el.dataset.n)));
}

// ============================================================
// Concurso de baile
// ============================================================

function htmlConcurso() {
  const E = C.evento;
  const pasos = E.pasos
    .map(
      (paso, i) => `
      <li class="paso">
        <span class="paso__numero">0${i + 1}</span>
        <div><h3>${paso.titulo}</h3><p>${paso.texto}</p></div>
      </li>`
    )
    .join("");

  return `
    <section class="seccion contenedor" id="concurso">
      <div class="revelar">
        ${tituloSeccion(E.titulo)}
        <div class="concurso">
          <div class="concurso__info">
            <p class="concurso__descripcion">${E.descripcion}</p>
            <p class="concurso__premio">${E.premio}</p>
            <dl class="concurso__datos">
              <div><dt>${E.fecha}</dt><dd>${CONCURSO.fecha ?? E.porConfirmar}</dd></div>
              <div><dt>${E.lugar}</dt><dd>${CONCURSO.lugar ?? E.porConfirmar}</dd></div>
            </dl>
            <div class="concurso__acciones" id="acciones-concurso"></div>
            <p class="texto-suave">${E.presencial}</p>
          </div>
          <ol class="pasos">${pasos}</ol>
        </div>
      </div>

      <div class="revelar">
        <h3 class="subtitulo-seccion">${E.participantes}</h3>
        <div class="participantes" id="participantes"></div>
      </div>

      <div class="revelar">
        <h3 class="subtitulo-seccion">${E.pasados}</h3>
        <p class="aviso-borde">${E.pasadosVacio}</p>
      </div>
    </section>`;
}

// El botón de inscripción cambia si ya está inscrit@
function renderAccionesConcurso() {
  const usuario = getUsuario();
  const inscrito = usuario && getParticipantes().some((p) => p.correo === usuario.correo);
  document.getElementById("acciones-concurso").innerHTML = `
    ${inscrito
      ? `<button class="boton" type="button" disabled>${C.evento.yaInscrito}</button>`
      : `<button class="boton" type="button" data-accion="inscribirse">${C.evento.inscribirse}</button>`}
    <a class="boton boton--claro" href="${T.marca.instagramUrl}" target="_blank" rel="noopener">${C.evento.etiquetar}</a>`;
}

function htmlParticipante(participante, puesto, miVoto, correo) {
  const votos = votosDeParticipante(participante);
  const esLider = puesto === 1;
  const esMio = correo && participante.correo === correo;
  const votePorEste = miVoto === participante.id;

  let boton;
  if (votePorEste) boton = `<button class="boton boton--voto" type="button" disabled>${C.evento.tuVoto} ✓</button>`;
  else if (miVoto) boton = `<button class="boton boton--claro boton--voto" type="button" data-accion="votar" data-id="${participante.id}">${C.evento.votar}</button>`;
  else boton = `<button class="boton boton--voto" type="button" data-accion="votar" data-id="${participante.id}">${C.evento.votar}</button>`;

  const video = participante.video
    ? `<a class="participante__ver" href="${escaparHTML(participante.video)}" target="_blank" rel="noopener">${C.evento.verVideo}</a>`
    : `<span class="participante__ver participante__ver--sin">${C.evento.sinVideo}</span>`;

  return `
    <article class="participante ${esLider ? "participante--lider" : ""} ${votePorEste ? "participante--votado" : ""}"
      data-participante="${participante.id}">
      <div class="participante__video">
        <span class="participante__puesto">#${puesto}</span>
        <span class="participante__iniciales">${escaparHTML(iniciales(participante.nombre))}</span>
        <span class="participante__play" aria-hidden="true"></span>
        ${video}
      </div>
      <div class="participante__info">
        <div class="participante__etiquetas">
          ${esLider ? etiqueta(C.evento.lider, "etiqueta--negra") : ""}
          ${esMio ? etiqueta(C.tu, "etiqueta--negra") : ""}
          ${participante.ejemplo ? etiqueta(C.ejemplo) : ""}
        </div>
        <h4>${escaparHTML(participante.nombre)}</h4>
        <p class="texto-suave">${escaparHTML(participante.estilo)}</p>
        <p class="participante__votos" data-votos="${votos}">${C.evento.votos(votos)}</p>
        ${boton}
      </div>
    </article>`;
}

// Ranking: el que más votos tiene va primero
function renderParticipantes() {
  const usuario = getUsuario();
  const miVoto = usuario ? votosDe(usuario.correo).concurso : null;
  const ordenados = todosLosParticipantes().sort((a, b) => votosDeParticipante(b) - votosDeParticipante(a));
  document.getElementById("participantes").innerHTML = ordenados
    .map((p, i) => htmlParticipante(p, i + 1, miVoto, usuario?.correo))
    .join("");
}

async function votarParticipante(id) {
  const usuario = await asegurarRegistro(C.evento.registroVotar);
  if (!usuario) return;

  const misVotos = votosDe(usuario.correo);
  // Un solo voto por persona: si ya votó, se lo recordamos con cariño
  if (misVotos.concurso) {
    mostrarAviso(C.evento.unVoto);
    return renderParticipantes();
  }

  const participante = todosLosParticipantes().find((p) => p.id === id);
  const antes = votosDeParticipante(participante);
  guardarVotosDe(usuario.correo, { ...misVotos, concurso: id });

  renderParticipantes();
  renderStats();
  // El número sube y la tarjeta da un saltico: se siente que el voto contó
  const tarjeta = document.querySelector(`[data-participante="${id}"]`);
  contarHasta(tarjeta.querySelector(".participante__votos"), antes + 1, C.evento.votos, antes);
  rebotar(tarjeta.querySelector(".participante__votos"));
  mostrarAviso(C.evento.votoGracias(participante.nombre));
}

async function abrirInscripcion() {
  const usuario = await asegurarRegistro(C.evento.registroInscribir);
  if (!usuario) return;
  const E = C.evento;
  const opciones = E.estilosBaile.map((e) => `<option>${e}</option>`).join("");

  const modal = abrirModal(
    `<div class="modal__cuerpo">
      <h2>${E.formTitulo}</h2>
      <form class="formulario" novalidate>
        <label class="campo">${E.nombreArtistico}
          <input name="nombre" type="text" maxlength="30" required>
        </label>
        <label class="campo">${E.estiloBaile}
          <select name="estilo">${opciones}</select>
        </label>
        <label class="campo">${E.linkVideo}
          <input name="video" type="url" placeholder="https://" maxlength="200">
        </label>
        <p class="texto-suave">${E.linkAyuda}</p>
        <p class="error" aria-live="polite"></p>
        <button class="boton boton--ancho" type="submit">${E.enviarInscripcion}</button>
      </form>
    </div>`,
    { chico: true }
  );

  const form = modal.querySelector("form");
  form.nombre.focus();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    if (!nombre) return (modal.querySelector(".error").textContent = E.errorNombre);
    // Solo aceptamos links que empiecen por http(s), por seguridad
    const video = /^https?:\/\//i.test(form.video.value.trim()) ? form.video.value.trim() : null;

    const id = `p-${Date.now()}`;
    guardarParticipante({ id, nombre, estilo: form.estilo.value, video, correo: usuario.correo, votosBase: 0 });
    modal.close();
    renderAccionesConcurso();
    renderParticipantes();
    renderStats();
    mostrarAviso(E.inscritoOk);
    const tarjeta = document.querySelector(`[data-participante="${id}"]`);
    tarjeta?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (tarjeta) aparecer(tarjeta);
  });
}

// ============================================================
// Diseños de la comunidad
// ============================================================

function htmlDisenosSeccion() {
  const D = C.disenos;
  const premios = D.premios
    .map((p, i) => `<li><span class="premio__numero">0${i + 1}</span><h3>${p.titulo}</h3><p>${p.texto}</p></li>`)
    .join("");
  return `
    <section class="seccion-negra" id="disenos">
      <div class="contenedor revelar">
        <h2 class="titulo-ch"><img src="assets/logo/simbolo-ch-blanco.png" alt="">${D.titulo}</h2>
        <p class="seccion-negra__intro">${D.descripcion}</p>
        <ol class="premios">${premios}</ol>
        <button class="boton boton--invertido" type="button" data-accion="postular">${D.subir}</button>
      </div>
      <div class="contenedor revelar">
        <div class="disenos" id="lista-disenos"></div>
      </div>
    </section>`;
}

function htmlDiseno(diseno, misLikes, correo) {
  const D = C.disenos;
  const likes = likesDeDiseno(diseno);
  const meGusta = misLikes.includes(diseno.id);
  // Sin imagen (los de ejemplo): tarjeta tipográfica con el nombre
  const imagen = diseno.imagen
    ? `<img src="${diseno.imagen}" alt="${escaparHTML(diseno.nombre)}">`
    : `<span class="diseno__tipografico">${escaparHTML(diseno.nombre)}</span>`;
  return `
    <article class="diseno" data-diseno="${diseno.id}">
      <div class="diseno__imagen">${imagen}</div>
      <div class="diseno__info">
        <div class="participante__etiquetas">
          ${correo && diseno.correo === correo ? etiqueta(C.tu, "etiqueta--clara") : ""}
          ${diseno.ejemplo ? etiqueta(C.ejemplo, "etiqueta--borde-claro") : ""}
        </div>
        <h3>${escaparHTML(diseno.nombre)}</h3>
        <p class="diseno__autor">${D.por(escaparHTML(diseno.autor))}</p>
        ${diseno.descripcion ? `<p>${escaparHTML(diseno.descripcion)}</p>` : ""}
        <div class="diseno__pie">
          <span class="diseno__likes">${C.evento.votos(likes)}</span>
          <button class="boton ${meGusta ? "boton--invertido" : "boton--borde"} boton--voto" type="button"
            data-accion="like" data-id="${diseno.id}" aria-pressed="${meGusta}">${meGusta ? D.teGusta : D.meGusta}</button>
        </div>
      </div>
    </article>`;
}

function renderDisenos() {
  const usuario = getUsuario();
  const misLikes = usuario ? votosDe(usuario.correo).disenos ?? [] : [];
  // Los más nuevos de la gente primero, luego los de ejemplo por likes
  const lista = [
    ...getDisenos().reverse(),
    ...DISENOS_EJEMPLO.map((d) => ({ ...d, ejemplo: true })).sort((a, b) => likesDeDiseno(b) - likesDeDiseno(a)),
  ];
  document.getElementById("lista-disenos").innerHTML = lista.length
    ? lista.map((d) => htmlDiseno(d, misLikes, usuario?.correo)).join("")
    : `<p>${C.disenos.vacio}</p>`;
}

// "Me gusta" se puede poner y quitar (no es un voto único como el concurso)
async function alternarLike(id) {
  const usuario = await asegurarRegistro(C.disenos.registroLike);
  if (!usuario) return;
  const misVotos = votosDe(usuario.correo);
  const disenos = misVotos.disenos ?? [];
  const yaLeGusta = disenos.includes(id);
  guardarVotosDe(usuario.correo, {
    ...misVotos,
    disenos: yaLeGusta ? disenos.filter((d) => d !== id) : [...disenos, id],
  });
  renderDisenos();
  renderStats();
  if (!yaLeGusta) rebotar(document.querySelector(`[data-diseno="${id}"] .diseno__likes`));
}

async function abrirPostulacion() {
  const D = C.disenos;
  const usuario = await asegurarRegistro(D.registroPublicar);
  if (!usuario) return;

  const modal = abrirModal(
    `<div class="modal__cuerpo">
      <h2>${D.titulo}</h2>
      <form class="formulario" novalidate>
        <label class="campo">${D.nombreDiseno}
          <input name="nombre" type="text" maxlength="40" required>
        </label>
        <label class="campo">${D.descripcionDiseno}
          <textarea name="descripcion" rows="3" maxlength="200"></textarea>
        </label>
        <label class="campo">${D.imagen}
          <input name="imagen" type="file" accept="image/*">
        </label>
        <p class="texto-suave">${D.imagenAyuda}</p>
        <div class="vista-previa oculto">
          <p class="texto-suave">${D.vistaPrevia}</p>
          <img alt="">
        </div>
        <p class="error" aria-live="polite"></p>
        <button class="boton boton--ancho" type="submit">${D.enviar}</button>
      </form>
    </div>`,
    { chico: true }
  );

  const form = modal.querySelector("form");
  const error = modal.querySelector(".error");
  const previa = modal.querySelector(".vista-previa");
  let imagen = null;

  // Vista previa: la imagen se reduce (600px) para que quepa en el localStorage
  form.imagen.addEventListener("change", async () => {
    imagen = await leerFotoReducida(form.imagen.files[0], 600);
    previa.classList.toggle("oculto", !imagen);
    if (imagen) {
      previa.querySelector("img").src = imagen;
      aparecer(previa, 12);
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = form.nombre.value.trim();
    if (!nombre) return (error.textContent = D.errorNombre);
    if (!imagen) return (error.textContent = D.errorImagen);
    const id = `d-${Date.now()}`;
    guardarDiseno({
      id,
      nombre,
      descripcion: form.descripcion.value.trim(),
      imagen,
      autor: usuario.nombre,
      correo: usuario.correo,
      likesBase: 0,
    });
    modal.close();
    renderDisenos();
    renderStats();
    mostrarAviso(D.publicado);
    const tarjeta = document.querySelector(`[data-diseno="${id}"]`);
    tarjeta?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (tarjeta) aparecer(tarjeta);
  });
}

// ============================================================
// Outfits y familia
// ============================================================

function htmlOutfit(outfit) {
  const prendas = outfit.prendas.map(buscarProducto).filter(Boolean);
  const fotos = prendas
    .map((p) => `<a href="catalogo.html?producto=${p.id}" title="${escaparHTML(p.nombre)}">${htmlFoto(p)}</a>`)
    .join("");
  const nombres = prendas.map((p) => escaparHTML(p.nombre)).join(" + ");
  return `
    <article class="outfit">
      <div class="outfit__fotos">${fotos}</div>
      <div class="outfit__info">
        ${outfit.ejemplo ? etiqueta(C.ejemplo) : ""}
        <p class="outfit__prendas">${nombres}</p>
        <p class="texto-suave">${C.outfits.por(escaparHTML(outfit.autor))}</p>
      </div>
    </article>`;
}

function htmlOutfits() {
  const O = C.outfits;
  const outfits = [...getOutfits().reverse(), ...OUTFITS_EJEMPLO.map((o) => ({ ...o, ejemplo: true }))];
  return `
    <section class="seccion contenedor" id="outfits">
      <div class="revelar">
        ${tituloSeccion(O.titulo)}
        <p class="texto-suave subtitulo">${O.descripcion}</p>
      </div>
      <div class="revelar outfits">
        ${outfits.length ? outfits.map(htmlOutfit).join("") : `<p>${O.vacio}</p>`}
      </div>
      <div class="revelar centrado">
        <a class="boton" href="maniqui.html">${O.armar}</a>
      </div>
    </section>`;
}

// Fotos de las SESIONES de la familia Chased (no son eventos)
function htmlFamilia() {
  const F = C.familia;
  const fotos = FOTOS_FAMILIA.map(
    (src) => `
    <figure class="familia__foto">
      <img src="${src}" alt="" loading="lazy" onerror="this.parentElement.remove()">
      <figcaption>${F.sesion}</figcaption>
    </figure>`
  ).join("");
  return `
    <section class="seccion contenedor" id="familia">
      <div class="revelar">
        ${tituloSeccion(F.titulo)}
        <p class="texto-suave subtitulo">${F.descripcion}</p>
      </div>
      <div class="revelar familia">${fotos}</div>
      <div class="revelar centrado">
        <a class="boton boton--claro" href="${T.marca.instagramUrl}" target="_blank" rel="noopener">${F.seguir} ${T.marca.instagram}</a>
      </div>
    </section>`;
}

// ============================================================
// Pintar todo y escuchar clics
// ============================================================

function renderComunidad() {
  contenido.innerHTML = htmlPortada() + htmlConcurso() + htmlDisenosSeccion() + htmlOutfits() + htmlFamilia();
  renderStats(true);
  renderAccionesConcurso();
  renderParticipantes();
  renderDisenos();
  revelarAlBajar(document.querySelectorAll(".revelar"));

  // Si llegó con #concurso (desde el inicio), lo llevamos ahí. El
  // navegador no lo hace solo porque el contenido se pinta con JS.
  if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
}

// Un solo oyente para todos los botones (delegación)
contenido.addEventListener("click", (e) => {
  const boton = e.target.closest("[data-accion]");
  if (!boton) return;
  const { accion, id } = boton.dataset;
  if (accion === "votar") votarParticipante(id);
  if (accion === "inscribirse") abrirInscripcion();
  if (accion === "like") alternarLike(id);
  if (accion === "postular") abrirPostulacion();
});

// Si entra o sale de la sesión, sus votos y su "Tú" cambian
window.addEventListener("sesion-cambio", () => {
  renderAccionesConcurso();
  renderParticipantes();
  renderDisenos();
});

renderComunidad();
