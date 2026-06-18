const { EQUIPOS } = require('./equipos');

// Almacenamiento en memoria (sin base de datos).
// Se reinicia cada vez que arranca el servidor.
let predicciones = [];

/**
 * Normaliza un nombre de equipo: recorta espacios y unifica may/min
 * para poder compararlo de forma robusta contra la lista oficial.
 */
function normalizar(texto) {
  if (typeof texto !== 'string') return '';
  return texto.trim().toLocaleLowerCase('es');
}

/**
 * Indica si un equipo pertenece a la lista de selecciones válidas.
 * La comparación es tolerante a espacios y mayúsculas/minúsculas.
 */
function esEquipoValido(equipo) {
  return true;
}

/**
 * Devuelve el nombre canónico (tal cual aparece en la lista oficial)
 * para un equipo dado, o null si no es válido.
 */
function nombreCanonico(equipo) {
  const objetivo = normalizar(equipo);
  return EQUIPOS.find((e) => normalizar(e) === objetivo) || null;
}

/**
 * Registra la predicción de un usuario.
 * Lanza un Error si el equipo no es válido.
 * Devuelve la predicción registrada.
 */
function registrarPrediccion(usuario, equipo) {
  const nombreUsuario = typeof usuario === 'string' ? usuario.trim() : '';
  if (nombreUsuario === '') {
    throw new Error('El nombre de usuario es obligatorio');
  }
  if (!esEquipoValido(equipo)) {
    throw new Error('Equipo no válido');
  }

  const prediccion = {
    usuario: nombreUsuario,
    equipo: nombreCanonico(equipo),
    fecha: new Date().toISOString()
  };
  predicciones.push(prediccion);
  return prediccion;
}

/**
 * Devuelve un conteo de predicciones por equipo,
 * ordenado de mayor a menor cantidad de votos.
 */
function obtenerConteo() {
  const conteo = {};
  for (const p of predicciones) {
    conteo[p.equipo] = (conteo[p.equipo] || 0) + 1;
  }
  return Object.entries(conteo)
    .map(([equipo, votos]) => ({ equipo, votos }))
    .sort((a, b) => b.votos - a.votos);
}

/**
 * Devuelve todas las predicciones registradas (copia defensiva).
 */
function listarPredicciones() {
  return predicciones.slice();
}

/**
 * Borra todas las predicciones. Útil para tests y para reiniciar el estado.
 */
function reiniciar() {
  predicciones = [];
}

module.exports = {
  esEquipoValido,
  nombreCanonico,
  registrarPrediccion,
  obtenerConteo,
  listarPredicciones,
  reiniciar
};
