const path = require('path');
const { loadFeature, defineFeature } = require('jest-cucumber');
const {
  registrarPrediccion,
  obtenerConteo,
  reiniciar
} = require('../../src/predicciones');

// Carga el archivo .feature con los criterios de aceptación.
const feature = loadFeature(path.join(__dirname, 'predicciones.feature'));

defineFeature(feature, (test) => {
  // Antes de cada escenario, limpiamos el almacén en memoria
  // para que los escenarios no se contaminen entre sí.
  beforeEach(() => {
    reiniciar();
  });

  test('Registrar una predicción válida', ({ given, when, then }) => {
    let usuario;
    let resultado;

    given(/^un usuario llamado "(.*)"$/, (nombre) => {
      usuario = nombre;
    });

    when(/^predice que el campeón será "(.*)"$/, (equipo) => {
      resultado = registrarPrediccion(usuario, equipo);
    });

    then(/^la predicción queda registrada para "(.*)"$/, (equipoEsperado) => {
      expect(resultado.equipo).toBe(equipoEsperado);
    });
  });

  test('Rechazar un equipo que no está en la lista', ({ given, when, then }) => {
    let usuario;
    let error;

    given(/^un usuario llamado "(.*)"$/, (nombre) => {
      usuario = nombre;
    });

    when(/^intenta predecir "(.*)"$/, (equipo) => {
      try {
        registrarPrediccion(usuario, equipo);
      } catch (e) {
        error = e;
      }
    });

    then(/^la predicción es rechazada con el mensaje "(.*)"$/, (mensaje) => {
      expect(error).toBeDefined();
      expect(error.message).toBe(mensaje);
    });
  });

  test('Rechazar una predicción sin nombre de usuario', ({ given, when, then }) => {
    let usuario;
    let error;

    given(/^un usuario sin nombre$/, () => {
      usuario = '';
    });

    when(/^intenta predecir "(.*)"$/, (equipo) => {
      try {
        registrarPrediccion(usuario, equipo);
      } catch (e) {
        error = e;
      }
    });

    then(/^la predicción es rechazada con el mensaje "(.*)"$/, (mensaje) => {
      expect(error).toBeDefined();
      expect(error.message).toBe(mensaje);
    });
  });

  test('El ranking ordena los equipos por cantidad de votos', ({ given, when, then, and }) => {
    let ranking;

    given(/^las siguientes predicciones:$/, (tabla) => {
      // jest-cucumber pasa la tabla como array de objetos { usuario, equipo }.
      for (const fila of tabla) {
        registrarPrediccion(fila.usuario, fila.equipo);
      }
    });

    when(/^se consulta el ranking$/, () => {
      ranking = obtenerConteo();
    });

    then(/^"(.*)" aparece primera con (\d+) votos$/, (equipo, votos) => {
      expect(ranking[0]).toEqual({ equipo, votos: Number(votos) });
    });

    and(/^"(.*)" aparece con (\d+) voto$/, (equipo, votos) => {
      const encontrado = ranking.find((r) => r.equipo === equipo);
      expect(encontrado).toEqual({ equipo, votos: Number(votos) });
    });
  });
});
