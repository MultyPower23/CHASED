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
    // Cinta que corre en la portada negra — BORRADOR
    cinta: ["Chasing your style", "Persigue lo tuyo", "Oversize desde Medellín", "Familia Chased"],
    bajar: "Desliza",
    paraQuienTitulo: "Encuentra lo tuyo",
    coleccionesTitulo: "Colecciones",
    coleccionesSub: "Arma tu estilo por temática.",
    dropsTitulo: "Ediciones y drops",
    dropAnteriorEtiqueta: "Drop anterior",
    dropAnteriorTitulo: "GODWOVEN · 20/NOV/2025",
    dropAnteriorTexto: "Así lanzamos nuestro último drop. Los próximos se anuncian aquí y en @chased_med.",
    proximoDrop: "Próximo drop: muy pronto",
    verColeccion: "Ver colección",
  },

  // Colecciones del inicio. Qué productos entran se define en
  // productos.js (COLECCIONES); aquí solo van los nombres. BORRADOR
  colecciones: {
    camisetas: { nombre: "Camisetas oversize", descripcion: "La base de todo outfit Chased." },
    abrigo: { nombre: "Hoodies y buzos", descripcion: "Para las noches frías del Valle." },
    joggers: { nombre: "Joggers y shorts", descripcion: "Comodidad de la cintura para abajo." },
    bailar: { nombre: "Para bailar", descripcion: "Ropa que se mueve contigo." },
    negro: { nombre: "Todo negro", descripcion: "El color que nunca falla." },
    nov2024: { nombre: "Edición NOV. 2024", descripcion: "Hoodie y buzo de la edición NOV. 2024." },
  },

  // Nombres de los géneros para filtros y portadas
  generos: { hombre: "Hombre", mujer: "Mujer", unisex: "Unisex", todo: "Todo" },

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
    paraTiEstilo: (estilo) => `Elegido para tu estilo ${estilo}, con un par de sorpresas.`,
    paraTiCompras: "Según lo que has comprado, con un par de sorpresas.",
    paraTiSinDatos: "Lo más perseguido por ahora. Haz el quiz y esto se vuelve tuyo.",
    filtros: { tipo: "Tipo", color: "Color", talla: "Talla", genero: "Género", todos: "Todos" },
    ordenar: { label: "Ordenar", relevancia: "Recomendado", menor: "Precio: menor a mayor", mayor: "Precio: mayor a menor" },
    precioReferencial: "Precio referencial",
    agregar: "Agregar al carrito",
    elegirTalla: "Elige tu talla",
    guiaTallas: "Guía de tallas (referencial)",
    sinResultados: "Nada por aquí con esos filtros. Prueba otra combinación.",
    limpiarFiltros: "Limpiar filtros",
    coleccion: "Colección",
    quitarColeccion: "Quitar colección",
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
    subisteNivel: (nivel, pct) => `¡Subiste a ${nivel}! Ganaste ${pct}% de descuento: úsalo cuando quieras, lo tienes en tu perfil.`,
    subisteYCanjeaste: (nivel, pct) => `¡Subiste a ${nivel} y canjeaste tu ${pct}% en esta misma compra!`,
    primeraInsignia: (nivel) => `¡Ganaste tu primera insignia: ${nivel}! Ya eres parte oficial de la familia.`,
    conEstePedidoPrimera: (nivel) => `Con este pedido ganas tu primera insignia: ${nivel}.`,
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
    gracias: "Gracias por formar parte de la familia Chased.",
    // Carga al confirmar la compra — BORRADOR (misma animación del quiz)
    cargando: [
      "Confirmando tu pedido…",
      "Separando tus prendas…",
      "Revisando tallas y detalles…",
      "Contando tus prendas para la insignia…",
      "¡Listo! Ya es tuyo.",
    ],
    // Si está registrad@, la segunda frase lleva su nombre
    cargandoNombre: (nombre) => `Empacando todo con cariño para ti, ${nombre}…`,
    // Panel que aparece al agregar algo al carrito
    agregadoTitulo: "¡Quedó en tu carrito!",
    irAlCarrito: (n) => `Ir al carrito (${n})`,
    seguirNavegando: "Seguir navegando",
    // Deshacer al quitar una prenda
    quitado: (nombre) => `Quitaste ${nombre}`,
    deshacer: "Deshacer",
    restaurado: (nombre) => `${nombre} volvió a tu carrito`,
    tuInsignia: "Tu insignia",
    llevas: (faltan, siguiente) =>
      faltan === 1
        ? `Con este pedido te faltaría 1 prenda para ser ${siguiente}.`
        : `Con este pedido te faltarían ${faltan} prendas para ser ${siguiente}.`,
    conEstePedido: (nivel, pct) => `Con este pedido subes a ${nivel} y ganas ${pct}% de descuento.`,
    // Cupones de descuento en el carrito
    tusDescuentos: "Tus descuentos",
    cupon: (pct, nivel) => `${pct}% por llegar a ${nivel}`,
    venceEl: (fecha) => `Vence el ${fecha} (referencial)`,
    usarCupon: "Usar en este pedido",
    noUsarCupon: "Guardarlo para después",
    cuponAplicado: "Aplicado ✓",
    otrosCupones: (n) => (n === 1 ? "Tienes 1 descuento más guardado." : `Tienes ${n} descuentos más guardados.`),
    ganasYa: (nivel, pct) => `¡Con este pedido llegas a ${nivel} y ganas ${pct}%! Puedes canjearlo ya mismo o guardarlo para después.`,
    ganasVarios: (nivel, n, pct) =>
      `¡Con este pedido llegas a ${nivel} y ganas ${n} descuentos de ${pct}%! Canjea uno ya mismo y el resto queda guardado.`,
    canjearAhora: (pct) => `Canjear mi ${pct}% ahora`,
    unoPorPedido: "Ya estás usando un descuento: el nuevo quedará guardado en tu perfil.",
    vigencia: (dias) => `Cada descuento se usa una sola vez y vence ${dias} días después de ganarlo (referencial).`,
    nivelMaximo: "Llegaste al nivel más alto. ¡Eres leyenda!",
    reglaInsignia: (n, pct) =>
      `Tu primera compra te da la insignia Rookie. Desde ahí, cada ${n} prendas subes de nivel y ganas un ${pct}% de descuento para usar cuando quieras (referencial).`,
  },

  // Quiz — sin peso, sin altura, sin temas polémicos. BORRADOR.
  quiz: {
    titulo: "Queremos conocerte",
    intro: "Nada de medidas ni preguntas raras: solo cómo te gusta verte y sentirte. Puedes saltarlo o repetirlo cuando quieras.",
    saltar: "Ahora no",
    repetir: "Repetir quiz",
    resultado: "Tu estilo Chased es",
    siguiente: "Siguiente",
    verResultado: "Ver mi estilo",
    empezar: "Empezar",
    atras: "Atrás",
    pregunta: (n, total) => `Pregunta ${n} de ${total}`,
    leVa: "Prendas que van con tu estilo",
    verParaTi: "Ver mi \"Para ti\" en el catálogo",
    irPerfil: "Ir a mi perfil",
    guardado: "Tu resultado quedó guardado. Puedes repetir el quiz cuando quieras desde tu perfil.",
    // Pantalla de "carga" al terminar el quiz — BORRADOR. Cada frase
    // dura un momentico; la última es el cierre antes del resultado.
    cargando: [
      "Leyendo tus respuestas con calma…",
      "Personalizando nuestro catálogo para ti…",
      "Buscando las prendas que van con tu ritmo…",
      "Armando tu estilo Chased…",
      "Listo. Esto es solo para ti.",
    ],
    // Si ya está registrad@, la segunda frase lleva su nombre
    cargandoNombre: (nombre) => `Preparando todo para ti, ${nombre}…`,
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
    cuponesListos: (n) => (n === 1 ? "Tienes 1 descuento listo para usar" : `Tienes ${n} descuentos listos para usar`),
    descuentosTitulo: "Tus descuentos",
    sinCupones: "Aún no tienes descuentos. Llega a Runner para ganar el primero.",
    estadoCupon: { disponible: "Disponible", vencido: "Vencido" },
    usadoEn: (id) => `Usado en el pedido #${id}`,
    vencioEl: (fecha) => `Venció el ${fecha}`,
    ganadoEl: (fecha) => `Ganado el ${fecha}`,
    pedidos: "Tus pedidos",
    sinPedidos: "Todavía no has hecho pedidos.",
    closet: "Tu closet",
    sinRegistro: "Tu perfil guarda tu estilo, tu insignia y tus pedidos. Para verlo, únete a la familia Chased.",
    miembroDesde: (fecha) => `En la familia desde ${fecha}`,
    niveles: "Niveles",
    prendasCompradas: (n) => (n === 1 ? "1 prenda comprada" : `${n} prendas compradas`),
    sinDescuento: "Sube de nivel para ganar un descuento que puedes usar cuando quieras.",
    conDescuento: (pct) => `Con ${pct}% de descuento`,
    irCatalogo: "Ir al catálogo",
    closetVacio: "Aquí aparecerán las prendas que compres.",
    probarAyuda: "Pruébala en tu vestidor y arma un conjunto con ella.",
    closetNota: "Pronto podrás armar outfits con ellas en Mi closet.",
  },

  // Insignias — nombres BORRADOR (TODO confirmar con el equipo)
  insignias: {
    niveles: ["Rookie", "Runner", "Chaser", "Leyenda Chased"],
    sinInsignia: "Sin insignia todavía",
    primeraCompra: "Haz tu primera compra y gana tu primera insignia: Rookie.",
    // Lo que pide cada nivel: el primero es por comprar una vez, el resto por prendas
    requisito: (indice, prendas) => (indice === 0 ? "1.ª compra" : `${prendas} prendas`),
    faltanPara: (faltan, siguiente) =>
      faltan === 1 ? `Te falta 1 prenda para ${siguiente}` : `Te faltan ${faltan} prendas para ${siguiente}`,
  },

  comunidad: {
    titulo: "Comunidad Chased",
    intro: "Aquí no solo compras: participas, votas y te ven.",
    // Contadores de la portada
    stats: { participantes: "participantes", votos: "votos", disenos: "diseños" },
    ir: { concurso: "Concurso", disenos: "Diseños", outfits: "Outfits", familia: "Familia" },
    ejemplo: "Ejemplo",
    tu: "Tú",
    evento: {
      titulo: "Concurso de baile Chased",
      descripcion: "Baila con tu outfit Chased, sube tu video aquí o publícalo en redes etiquetando a @chased_med. La comunidad vota.",
      premio: "Premio: prendas exclusivas Chased",
      inscribirse: "Inscribirme",
      yaInscrito: "Ya estás inscrit@ ✓",
      presencial: "También puedes inscribirte en el evento presencial.",
      fecha: "Fecha",
      lugar: "Lugar",
      porConfirmar: "Por confirmar",
      etiquetar: "Publícalo en Instagram",
      pasos: [
        { titulo: "Inscríbete", texto: "Aquí en la página o en el evento presencial." },
        { titulo: "Baila con tu outfit Chased", texto: "Sube tu video o publícalo etiquetando a @chased_med." },
        { titulo: "La comunidad vota", texto: "Reparte tus votos entre tus favoritos. Las prendas exclusivas son para quien más mueva a la familia." },
      ],
      pasados: "Eventos pasados",
      pasadosVacio: "Este es nuestro primer concurso. Aquí vamos a guardar los mejores momentos, y los tuyos pueden ser los primeros.",
      participantes: "Participantes",
      votar: "Votar",
      yaVotaste: "Ya votaste ✓",
      tuVoto: "Tu voto",
      votos: (n) => (n === 1 ? "1 voto" : `${n} votos`),
      lider: "Va ganando",
      sinVotos: (total) => `Ya usaste tus ${total} votos. ¡Gracias por mover a la familia!`,
      sinVotosBoton: "Sin votos",
      votosRestantes: (quedan, total) =>
        quedan === 0 ? `Usaste tus ${total} votos` : quedan === 1 ? `Te queda 1 de ${total} votos` : `Te quedan ${quedan} de ${total} votos`,
      votosAyuda: "Puedes votar por varios participantes, pero solo una vez por cada uno.",
      votosSinCuenta: (total) => `Tienes ${total} votos para repartir. Al votar te pedimos registrarte.`,
      // Confirmación antes de votar
      confirmarTitulo: (nombre) => `¿Votar por ${nombre}?`,
      confirmarTexto: (quedan) =>
        quedan === 1
          ? "Es tu último voto. Una vez votes, no se puede cambiar."
          : `Después te quedarán ${quedan - 1} votos. Una vez votes, no se puede cambiar.`,
      confirmarSi: "Sí, votar",
      confirmarNo: "Cancelar",
      votoGracias: (nombre) => `¡Votaste por ${nombre}! Gracias por mover a la familia.`,
      registroVotar: "Para votar necesitamos saber quién eres (así cada persona tiene sus propios votos).",
      registroInscribir: "Para inscribirte al concurso necesitamos saber quién eres.",
      verVideo: "Ver video",
      sinVideo: "Video en camino",
      // Formulario de inscripción
      formTitulo: "Inscríbete al concurso",
      nombreArtistico: "Nombre artístico o de tu crew",
      estiloBaile: "Estilo de baile",
      estilosBaile: ["Urbano", "Hip hop", "Dancehall", "Breaking", "Freestyle", "Otro"],
      linkVideo: "Link de tu video (opcional)",
      linkAyuda: "Puede ser de Instagram o TikTok. Si aún no lo tienes, lo agregas después.",
      enviarInscripcion: "Inscribirme",
      errorNombre: "Escribe tu nombre artístico.",
      inscritoOk: "¡Quedaste inscrit@! Ahora a bailar y a pedir votos.",
    },
    disenos: {
      titulo: "Diseña la próxima prenda",
      descripcion: "Propón tu diseño. Si la comunidad lo elige, ganas insignia, descuentos y tu propia camiseta.",
      premios: [
        { titulo: "Insignia especial", texto: "Una insignia de diseñador@ en tu perfil." },
        { titulo: "Descuentos", texto: "Descuento en tus compras Chased (referencial)." },
        { titulo: "Tu propia camiseta", texto: "Tu diseño hecho prenda, y la primera es tuya." },
      ],
      subir: "Postular mi diseño",
      nombreDiseno: "Nombre del diseño",
      descripcionDiseno: "Cuéntanos la idea",
      imagen: "Imagen del diseño",
      imagenAyuda: "Un boceto, una foto de tu cuaderno o un diseño digital. Todo vale.",
      vistaPrevia: "Vista previa",
      enviar: "Publicar diseño",
      errorNombre: "Ponle nombre a tu diseño.",
      errorImagen: "Sube una imagen para que la comunidad lo vea.",
      publicado: "¡Tu diseño ya está en la comunidad! Comparte para que voten.",
      registroPublicar: "Para postular un diseño necesitamos saber quién eres.",
      registroLike: "Para votar por diseños necesitamos saber quién eres.",
      por: (autor) => `por ${autor}`,
      meGusta: "Me gusta",
      teGusta: "Te gusta ✓",
      vacio: "Todavía no hay diseños. ¡Sé el primero!",
    },
    outfits: {
      titulo: "Outfits de la comunidad",
      descripcion: "Combinaciones armadas en Mi closet y publicadas por la familia.",
      vacio: "Nadie ha publicado outfits aún. ¡Sé el primero desde Mi closet!",
      armar: "Armar mi outfit",
      por: (autor) => `por ${autor}`,
      verOutfit: "Ver outfit",
      modalEtiqueta: "Outfit de la comunidad",
      totalOutfit: "Todo el outfit",
      agregarPrenda: "Agregar",
      agregadaPrenda: "Agregada ✓",
    },
    familia: {
      titulo: "La familia Chased",
      descripcion: "Sesiones de fotos con la gente que ya persigue lo suyo con Chased.",
      sesion: "Sesión de fotos",
      seguir: "Ver más en Instagram",
    },
  },

  maniqui: {
    titulo: "Mi closet",
    beta: "Versión beta: así funcionará con IA",
    betaTexto: "Hoy armamos por estilos, colores y palabras clave. La idea es que una IA aprenda de tu closet y tus gustos para proponerte conjuntos.",
    vestidor: "Tu vestidor",
    casillas: { arriba: "Camiseta", abajo: "Abajo", extra: "Hoodie / buzo" },
    casillaVacia: "Vacío",
    quitar: "Quitar",
    // Con qué ropa se arma el outfit
    modos: { mio: "Solo lo mío", mezcla: "Mezclar", nuevo: "Todo nuevo" },
    modosAyuda: {
      mio: "Solo con prendas que ya tienes.",
      mezcla: "Tus prendas primero, y lo que falte del catálogo.",
      nuevo: "Ideas con prendas que aún no tienes.",
    },
    tuya: "Tuya",
    nueva: "Nueva",
    equipada: "Puesta",
    equipar: "Ponérmela",
    sinPrendas: "Aún no tienes prendas en tu closet. Compra algo o escanea el QR de tu caja.",
    // Closet: solo lo comprado o lo escaneado
    closet: "Tu closet",
    closetNota: "Aquí entra lo que compras en la página y lo que traen tus cajas Chased.",
    escanear: "Escanear QR de mi caja",
    qrTitulo: "Escanea el QR de tu caja",
    qrTexto: "Cada paquete Chased trae un QR en la caja. Al escanearlo, tus prendas entran a tu closet.",
    qrSimulado: "En el prototipo el escaneo es simulado: escribe el código que viene debajo del QR.",
    qrCodigo: "Código de la caja",
    qrAgregar: "Agregar a mi closet",
    qrDemo: (codigos) => `Códigos de demo: ${codigos}`,
    qrNoExiste: "Ese código no lo reconocemos. Revisa que esté bien escrito.",
    qrYaUsado: "Esa caja ya está en tu closet.",
    qrOk: (n) => (n === 1 ? "¡Listo! 1 prenda entró a tu closet." : `¡Listo! ${n} prendas entraron a tu closet.`),
    deCompra: "Comprada",
    deCaja: "De tu caja",
    // ¿Con qué combino esto?
    combinarTitulo: "¿Con qué combino esto?",
    combinarAyuda: "Elige una prenda que ya tengas y te contamos qué le queda bien.",
    combinarBoton: "¿Con qué la combino?",
    combinarTexto: (prenda, tipos, colores) => `Con tu ${prenda} te queda bien ${tipos} en ${colores}.`,
    ejemploStock: "Como por ejemplo, tenemos este en stock:",
    probarAvatar: "Probármelo",
    o: "o",
    un: "un",
    una: "una",
    // Armar por mí
    peticion: "¿Qué plan tienes? (ej: salir a bailar)",
    armarPorMi: "Armar por mí",
    armado: "Listo: lo armamos pensando en tu plan.",
    faltaParaArmar: "No tienes suficientes prendas para armarlo solo con lo tuyo. Prueba con \"Mezclar\".",
    // Nombre, guardar y publicar
    nombreOutfit: "Nombre de tu outfit (opcional)",
    sugerirNombre: "Sugerir nombre",
    nombreSugerido: "Sugerido por la beta de IA: puedes cambiarlo.",
    guardar: "Guardar conjunto",
    guardado: "Conjunto guardado en Mis conjuntos.",
    publicar: "Publicar en Comunidad",
    publicado: "¡Outfit publicado en Comunidad!",
    verComunidad: "Ver en Comunidad",
    limpiar: "Empezar de nuevo",
    errorIncompleto: "Pon una camiseta o un hoodie, y una prenda abajo.",
    registroPublicar: "Para publicar tu outfit en la comunidad necesitamos saber quién eres.",
    sinNombre: "Outfit sin nombre",
    // Mis conjuntos
    misConjuntos: "Mis conjuntos",
    misConjuntosVacio: "Todavía no has guardado conjuntos. Arma uno arriba y dale \"Guardar\".",
    estadoGuardado: "Guardado",
    estadoPublicado: "Publicado",
    cargar: "Ponérmelo",
    guardarCorto: "Guardar",
    quitarPublicacion: "Quitar de Comunidad",
    quitarGuardado: "Quitar de guardados",
    publicacionQuitada: "Lo quitamos de Comunidad.",
    guardadoQuitado: "Lo quitamos de tus guardados.",
    yaGuardado: "Ese conjunto ya estaba guardado: actualizamos su nombre.",
    // Palabras clave → estilo, para "Armar por mí" (BORRADOR)
    palabrasClave: {
      flow: ["bailar", "baile", "entrenar", "gym", "deporte", "ensayo"],
      urbano: ["salir", "fiesta", "calle", "concierto", "parche", "rumba"],
      comfy: ["casa", "tranqui", "descansar", "frío", "frio", "viaje", "estudiar"],
      minimal: ["clase", "colegio", "trabajo", "reunión", "reunion", "básico", "basico"],
    },
    // Palabras para el "nombre sugerido" (estilo + color) — BORRADOR
    nombres: {
      urbano: ["Calle", "Noche", "Asfalto", "Barrio"],
      flow: ["Ritmo", "Paso", "Movimiento", "Pista"],
      comfy: ["Domingo", "Nube", "Calma", "Sofá"],
      minimal: ["Línea", "Base", "Silencio", "Esencia"],
    },
    colorNombre: {
      negro: "en negro", blanco: "en blanco", "blanco hueso": "hueso", beige: "arena", "azul celeste": "celeste", gris: "en gris",
    },
    totalNegro: "Total black",
    // Nombre de cada tipo de prenda para las frases
    tipos: {
      camiseta: "camiseta", hoodie: "hoodie", buzo: "buzo", crop: "crop", body: "body", jogger: "jogger", short: "short",
    },
  },

  // Armar conjunto en el catálogo (panel que se despliega)
  conjunto: {
    abrir: (n) => `Armar conjunto (${n})`,
    titulo: "Arma tu conjunto",
    ayuda: "Prueba cómo se ven juntas antes de comprarlas. Puedes comprar todo o solo una.",
    probar: "Probar en conjunto",
    agregado: (nombre) => `${nombre} está en tu conjunto`,
    vacio: "Toca \"Probar en conjunto\" en cualquier prenda para empezar.",
    total: "Todo el conjunto",
    agregarTodo: "Agregar todo al carrito",
    faltanTallas: "Elige la talla de cada prenda.",
    agregadoTodo: (n) => `${n} prendas quedaron en tu carrito`,
    abrirCloset: "Abrir en Mi closet",
    cerrar: "Cerrar",
  },

  footer: {
    instagram: "Síguenos en Instagram",
    prototipo: "Prototipo académico — Expo InnvEm 2026 · Colegio UPB Marinilla",
  },
};
