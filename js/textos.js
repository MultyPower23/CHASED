// ============================================================
// textos.js — EL DICCIONARIO DE TODA LA PÁGINA
// ------------------------------------------------------------
// ¿Por qué todo aquí? Porque si mañana Chased quiere cambiar una
// frase, un botón o una pregunta del quiz, se toca SOLO este
// archivo. Es como el tablero de anuncios de la casa: si cambias
// el aviso ahí, todos lo leen actualizado, sin buscar papelitos
// regados por cada cuarto.
//
// Las frases y nombres marcados con "BORRADOR" son inventados por
// ahora, y se cambian cuando el equipo o Chased lo definan.
// ============================================================

export const TEXTOS = {
  marca: {
    nombre: "Chased",
    instagram: "@chased_med",
    instagramUrl: "https://www.instagram.com/chased_med/",
    eslogan: "Tu estilo, tu identidad, tu experiencia.", // del reto "Chasing Your Style"
  },

  // Frases motivacionales del inicio — BORRADOR, inspiradas en el concepto "perseguir" del manual
  frasesMotivacionales: [
    "Lo que persigues también te está buscando.",
    "No sigas el ritmo. Créalo.",
    "Cómodo para moverte, firme para avanzar.",
    "Cada paso cuenta cuando sabes a dónde vas.",
    "Tu estilo no se explica, se vive.",
    "Persigue lo tuyo. Sin pedir permiso.",
    "Hoy no es para quedarse quieto.",
    "La meta no se espera, se persigue.",
  ],

  // Textos sueltos que se usan en varias páginas
  general: {
    cerrar: "Cerrar",
    menu: "Abrir menú",
    referencial: "referencial",
    agregado: (nombre) => `${nombre} quedó en tu carrito`,
    proximamente: "Estamos terminando esta sección. Muy pronto la vas a ver aquí.",
    volverInicio: "Volver al inicio",
    hola: (nombre) => `Hola, ${nombre}`,
    sesionCerrada: "Cerraste sesión. ¡Vuelve pronto!",
  },

  nav: {
    inicio: "Inicio",
    catalogo: "Catálogo",
    comunidad: "Comunidad",
    maniqui: "Mi closet",
    perfil: "Perfil",
    carrito: "Carrito",
    registrate: "Regístrate",
    salir: "Cerrar sesión",
  },

  inicio: {
    destacadosTitulo: "Lo más perseguido",
    verCatalogo: "Ver catálogo",
    eventoBanner: "Concurso de baile Chased: muéstranos cómo te mueves",
    eventoBoton: "Quiero participar",
    quizInvitacion: "¿Te ayudamos a encontrar tu estilo? Son 5 preguntas, y si no quieres, no pasa nada.",
    quizBoton: "Hagámoslo",
  },

  registro: {
    titulo: "Únete a la familia Chased",
    subtitulo: "Para comprar, votar y guardar tus outfits necesitamos saber quién eres.",
    nombre: "¿Cómo te llamas?",
    correo: "Tu correo",
    foto: "Foto de perfil (opcional)",
    boton: "Entrar a la comunidad",
    bienvenida: (nombre) => `¡Bienvenid@, ${nombre}! Ya haces parte de Chased.`,
    errorNombre: "Escribe tu nombre para seguir.",
    errorCorreo: "Revisa el correo, parece que le falta algo.",
    nota: "Prototipo: tus datos solo se guardan en este navegador.",
  },

  catalogo: {
    titulo: "Catálogo",
    paraTi: "Para ti",
    descubre: "Descubre algo distinto",
    filtros: { tipo: "Tipo", color: "Color", talla: "Talla", genero: "Género", todos: "Todos" },
    ordenar: { label: "Ordenar", relevancia: "Recomendado", menor: "Precio: menor a mayor", mayor: "Precio: mayor a menor" },
    precioReferencial: "Precio referencial",
    agregar: "Agregar al carrito",
    elegirTalla: "Elige tu talla",
    guiaTallas: "Guía de tallas (referencial)",
    sinResultados: "Nada por aquí con esos filtros. Prueba otra combinación.",
    limpiarFiltros: "Limpiar filtros",
    resultados: (n) => (n === 1 ? "1 prenda" : `${n} prendas`),
    color: "Color",
    errorTalla: "Primero elige tu talla.",
    guiaTallasNota: "Las medidas reales las estamos confirmando con Chased. Por ahora las tallas son referenciales.",
  },

  carrito: {
    titulo: "Tu carrito",
    vacio: "Tu carrito está vacío. Ve al catálogo y persigue algo que te guste.",
    subtotal: "Subtotal",
    descuento: "Descuento por insignia",
    total: "Total",
    confirmar: "Confirmar pedido",
    confirmado: "¡Pedido confirmado! Chased se pondrá en contacto para coordinar la entrega.",
    subisteNivel: (nivel) => `¡Subiste a ${nivel}! Tu próxima compra tiene descuento.`,
    talla: "Talla",
    quitar: "Quitar",
    menos: "Una menos",
    mas: "Una más",
    seguirComprando: "Seguir comprando",
    verPerfil: "Ver mi perfil",
    numeroPedido: (id) => `Pedido #${id}`,
    registroAntes: "Antes de confirmar, cuéntanos quién eres.",
    simulado: "Pedido simulado: no se hace ningún cobro. Precios y descuento son referenciales.",
    prendas: (n) => (n === 1 ? "1 prenda" : `${n} prendas`),
  },

  // Quiz — sin peso, sin altura, sin temas polémicos. BORRADOR.
  quiz: {
    titulo: "Queremos conocerte",
    intro: "Nada de medidas ni preguntas raras: solo cómo te gusta verte y sentirte. Puedes saltarlo o repetirlo cuando quieras.",
    saltar: "Ahora no",
    repetir: "Repetir quiz",
    resultado: "Tu estilo Chased es",
    preguntas: [
      {
        texto: "Un día perfecto para ti es…",
        opciones: [
          { texto: "Tranqui, en casa o con amigos", tags: ["comfy"] },
          { texto: "Calle, planes y salir a ver qué pasa", tags: ["urbano"] },
          { texto: "Moviéndome: baile, deporte, lo que sea", tags: ["flow"] },
          { texto: "Organizado y sin complicaciones", tags: ["minimal"] },
        ],
      },
      {
        texto: "¿Qué colores te representan más?",
        opciones: [
          { texto: "Negro, siempre negro", tags: ["urbano", "minimal"] },
          { texto: "Blanco y tonos claros", tags: ["minimal"] },
          { texto: "Tierra: beige, café, arena", tags: ["comfy"] },
          { texto: "Algo de color, como el azul", tags: ["flow"] },
        ],
      },
      {
        texto: "¿Cómo te gusta que te quede la ropa?",
        opciones: [
          { texto: "Bien suelta, que no se sienta", tags: ["comfy", "flow"] },
          { texto: "Oversize pero con forma", tags: ["urbano"] },
          { texto: "Limpia, sin mucho detalle", tags: ["minimal"] },
          { texto: "Que me deje moverme libre", tags: ["flow"] },
        ],
      },
      {
        texto: "¿Logos y estampados?",
        opciones: [
          { texto: "Entre más grande, mejor", tags: ["urbano"] },
          { texto: "Pequeño y elegante", tags: ["minimal"] },
          { texto: "Me da igual mientras sea cómodo", tags: ["comfy"] },
          { texto: "Depende del plan", tags: ["flow"] },
        ],
      },
      {
        texto: "¿Para qué buscas ropa ahora?",
        opciones: [
          { texto: "Para el día a día", tags: ["comfy"] },
          { texto: "Para salir y que me vean", tags: ["urbano"] },
          { texto: "Para bailar o entrenar", tags: ["flow"] },
          { texto: "Algo básico que combine con todo", tags: ["minimal"] },
        ],
      },
    ],
    // Perfiles de estilo — BORRADOR
    estilos: {
      minimal: { nombre: "Minimal", descripcion: "Limpio, básico y seguro. Menos es más, y lo sabes." },
      urbano: { nombre: "Urbano", descripcion: "La calle es tu pasarela. Logos grandes y actitud." },
      comfy: { nombre: "Comfy", descripcion: "La comodidad primero, sin perder el estilo." },
      flow: { nombre: "Flow", descripcion: "Ropa que se mueve contigo. Hecho para bailar." },
    },
  },

  perfil: {
    titulo: "Tu perfil",
    estilo: "Tu estilo",
    sinQuiz: "Aún no sabemos tu estilo.",
    hacerQuiz: "Hacer el quiz",
    insignia: "Tu insignia",
    progreso: (faltan) => `Te faltan ${faltan} prendas para el siguiente nivel`,
    descuentoDisponible: (pct) => `Tienes ${pct}% de descuento en tu próxima compra`,
    pedidos: "Tus pedidos",
    sinPedidos: "Todavía no has hecho pedidos.",
    closet: "Tu closet",
  },

  // Insignias — nombres BORRADOR (TODO confirmar con el equipo)
  insignias: {
    niveles: ["Rookie", "Runner", "Chaser", "Leyenda Chased"],
  },

  comunidad: {
    titulo: "Comunidad Chased",
    intro: "Aquí no solo compras: participas, votas y te ven.",
    evento: {
      titulo: "Concurso de baile Chased",
      descripcion: "Baila con tu outfit Chased, sube tu video aquí o publícalo en redes etiquetando a @chased_med. La comunidad vota.",
      premio: "Premio: prendas exclusivas Chased",
      inscribirse: "Inscribirme",
      presencial: "También puedes inscribirte en el evento presencial.",
      pasados: "Eventos pasados",
      participantes: "Participantes",
      votar: "Votar",
      yaVotaste: "Ya votaste ✓",
    },
    disenos: {
      titulo: "Diseña la próxima prenda",
      descripcion: "Propón tu diseño. Si la comunidad lo elige, ganas insignia, descuentos y tu propia camiseta.",
      subir: "Postular mi diseño",
      nombreDiseno: "Nombre del diseño",
      descripcionDiseno: "Cuéntanos la idea",
      imagen: "Imagen del diseño",
    },
    outfits: {
      titulo: "Outfits de la comunidad",
      vacio: "Nadie ha publicado outfits aún. ¡Sé el primero desde Mi closet!",
    },
  },

  maniqui: {
    titulo: "Mi closet",
    beta: "Versión beta: así funcionará con IA",
    closet: "Tus prendas",
    agregarPrenda: "Agregar prenda a mi closet",
    casillas: { arriba: "Arriba", abajo: "Abajo", extra: "Extra" },
    armarPorMi: "Armar por mí",
    peticion: "¿Qué plan tienes? (ej: salir a bailar)",
    publicar: "Publicar outfit",
    publicado: "¡Outfit publicado en Comunidad!",
    recomendacion: "Esto le quedaría bien a tu outfit",
  },

  footer: {
    texto: "Gracias por formar parte de la familia Chased.",
    instagram: "Síguenos en Instagram",
    prototipo: "Prototipo académico — Expo InnvEm 2026 · Colegio UPB Marinilla",
  },
};
