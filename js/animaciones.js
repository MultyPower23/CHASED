// ============================================================
// animaciones.js — Animaciones compartidas (con Anime.js)
// ------------------------------------------------------------
// La "carga" de cuadritos nació en el quiz y gustó, así que ahora
// vive aquí para que la compra también la use. Es como tener una
// sola licuadora en la casa: todos la usan, nadie compra otra.
// ============================================================

// Anime.js está copiado en js/vendor (funciona sin internet)
import anime from "./vendor/anime.es.js";

const MS_POR_FRASE = 900;
const LADO_GRILLA = 5; // grilla de 5x5 cuadritos

// Si la persona pidió "menos movimiento" en su sistema, lo respetamos
export const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Pantalla de carga "de mentiritas": grilla que hace la onda, frases
// que van cambiando y una barra que se llena. Devuelve una promesa
// que se cumple cuando termina, para mostrar lo que sigue.
export function mostrarCarga(contenedor, frases) {
  const total = LADO_GRILLA * LADO_GRILLA;
  // Cuadritos negros y grises intercalados: como prendas acomodándose
  const cuadritos = Array.from({ length: total }, (_, i) => `<span class="${i % 3 === 0 ? "gris" : ""}"></span>`).join("");

  contenedor.innerHTML = `
    <section class="seccion contenedor carga">
      <div class="carga__grilla" aria-hidden="true">${cuadritos}</div>
      <p class="carga__frase" id="carga-frase" aria-live="polite"></p>
      <div class="barra barra--carga" aria-hidden="true"><span id="carga-barra"></span></div>
    </section>`;
  window.scrollTo(0, 0);

  const duracion = frases.length * MS_POR_FRASE;
  const textoFrase = document.getElementById("carga-frase");

  // La onda: cada cuadrito se encoge y vuelve, empezando desde el
  // centro hacia afuera (el famoso "stagger grid" de Anime.js)
  const onda = sinMovimiento
    ? null
    : anime({
        targets: ".carga__grilla span",
        scale: [
          { value: 0.25, easing: "easeOutSine", duration: 450 },
          { value: 1, easing: "easeInOutQuad", duration: 650 },
        ],
        opacity: [
          { value: 0.35, easing: "easeOutSine", duration: 450 },
          { value: 1, easing: "easeInOutQuad", duration: 650 },
        ],
        delay: anime.stagger(110, { grid: [LADO_GRILLA, LADO_GRILLA], from: "center" }),
        loop: true,
      });

  // La barra se llena durante toda la carga
  anime({ targets: "#carga-barra", width: ["0%", "100%"], duration: duracion, easing: "easeInOutSine" });

  // Las frases van entrando una tras otra, suavecito desde abajo
  frases.forEach((frase, i) => {
    setTimeout(() => {
      textoFrase.textContent = frase;
      anime({ targets: textoFrase, opacity: [0, 1], translateY: [10, 0], duration: 400, easing: "easeOutQuad" });
    }, i * MS_POR_FRASE);
  });

  return new Promise((resolve) =>
    setTimeout(() => {
      onda?.pause();
      resolve();
    }, duracion + 300)
  );
}

// Hace que varios elementos entren uno detrás de otro desde abajo
// (como cuando reparten cartas). Se usa en la confirmación.
export function entrarEnCascada(selector) {
  if (sinMovimiento) return;
  anime({
    targets: selector,
    opacity: [0, 1],
    translateY: [24, 0],
    delay: anime.stagger(120),
    duration: 600,
    easing: "easeOutCubic",
  });
}

// Llena los bloques de la barra de insignia uno por uno
export function llenarBloques(selector, retraso = 0) {
  if (sinMovimiento) return;
  anime({
    targets: selector,
    backgroundColor: ["#D9D9D9", "#000000"], // gris claro → negro (colores del manual)
    delay: anime.stagger(180, { start: retraso }),
    duration: 350,
    easing: "easeOutQuad",
  });
}

// Saca un elemento deslizándolo a un lado y luego avisa (para quitar
// del carrito sin que la prenda "desaparezca de golpe")
export function salirDeslizando(elemento) {
  if (sinMovimiento) return Promise.resolve();
  return anime({
    targets: elemento,
    opacity: [1, 0],
    translateX: [0, -60],
    duration: 280,
    easing: "easeInQuad",
  }).finished;
}

// Un número que sube contando (ej. 0 → 58 votos), como en un marcador
export function contarHasta(elemento, hasta, formato = (n) => n, desde = 0) {
  if (sinMovimiento || hasta === desde) {
    elemento.textContent = formato(hasta);
    return;
  }
  const marcador = { n: desde };
  anime({
    targets: marcador,
    n: hasta,
    round: 1,
    duration: Math.min(1400, 300 + Math.abs(hasta - desde) * 40),
    easing: "easeOutQuad",
    update: () => (elemento.textContent = formato(marcador.n)),
  });
}

// Las secciones se "arman" cuando la persona baja hasta ellas: los
// hijos entran en cascada la primera vez que se ven en pantalla.
export function revelarAlBajar(secciones) {
  if (sinMovimiento) return;
  const vigilante = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        vigilante.unobserve(entrada.target);
        anime({
          targets: entrada.target.children,
          opacity: [0, 1],
          translateY: [28, 0],
          delay: anime.stagger(110),
          duration: 650,
          easing: "easeOutCubic",
        });
      }),
    { threshold: 0.12 }
  );
  secciones.forEach((seccion) => {
    // Escondemos los hijos ANTES de que se vean, para que no "parpadeen"
    [...seccion.children].forEach((hijo) => (hijo.style.opacity = 0));
    vigilante.observe(seccion);
  });
}

// Un "pop" corto para confirmar una acción (ej. al votar)
export function rebotar(elemento) {
  if (sinMovimiento) return;
  anime({ targets: elemento, scale: [1, 1.12, 1], duration: 450, easing: "easeOutQuad" });
}

// Entrada suave de un elemento (ej. el panel de "agregado al carrito")
export function aparecer(elemento, desde = 30) {
  if (sinMovimiento) return;
  anime({ targets: elemento, opacity: [0, 1], translateY: [desde, 0], duration: 420, easing: "easeOutCubic" });
}
