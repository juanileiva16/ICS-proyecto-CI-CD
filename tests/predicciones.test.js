const {
  esEquipoValido,
  nombreCanonico,
  registrarPrediccion,
  obtenerConteo,
  listarPredicciones,
  reiniciar
} = require('../src/predicciones');

// Cada test arranca con el estado limpio.
beforeEach(() => {
  reiniciar();
});

describe('esEquipoValido', () => {
  test('acepta un equipo de la lista', () => {
    expect(esEquipoValido('Argentina')).toBe(true);
  });

  test('es tolerante a mayúsculas/minúsculas y espacios', () => {
    expect(esEquipoValido('  brasil  ')).toBe(true);
    expect(esEquipoValido('FRANCIA')).toBe(true);
  });

  test('rechaza un equipo que no está en la lista', () => {
    expect(esEquipoValido('Atlántida')).toBe(false);
  });

  test('rechaza valores vacíos o no string', () => {
    expect(esEquipoValido('')).toBe(false);
    expect(esEquipoValido('   ')).toBe(false);
    expect(esEquipoValido(null)).toBe(false);
    expect(esEquipoValido(42)).toBe(false);
  });
});

describe('nombreCanonico', () => {
  test('devuelve el nombre oficial a partir de una variante', () => {
    expect(nombreCanonico('argentina')).toBe('Argentina');
  });

  test('devuelve null si el equipo no es válido', () => {
    expect(nombreCanonico('Narnia')).toBeNull();
  });
});

describe('registrarPrediccion', () => {
  test('registra una predicción válida y la normaliza', () => {
    const p = registrarPrediccion('Juani', 'argentina');
    expect(p.usuario).toBe('Juani');
    expect(p.equipo).toBe('Argentina');
    expect(p.fecha).toBeDefined();
    expect(listarPredicciones()).toHaveLength(1);
  });

  test('recorta espacios del nombre de usuario', () => {
    const p = registrarPrediccion('  Ana  ', 'Brasil');
    expect(p.usuario).toBe('Ana');
  });

  test('lanza error si falta el usuario', () => {
    expect(() => registrarPrediccion('', 'Brasil')).toThrow('usuario');
  });

  test('lanza error si el equipo no es válido', () => {
    expect(() => registrarPrediccion('Juani', 'Marte')).toThrow('Equipo no válido');
  });

  test('no agrega nada al almacén si falla', () => {
    expect(() => registrarPrediccion('Juani', 'Marte')).toThrow();
    expect(listarPredicciones()).toHaveLength(0);
  });
});

describe('obtenerConteo', () => {
  test('cuenta votos por equipo', () => {
    registrarPrediccion('A', 'Argentina');
    registrarPrediccion('B', 'Argentina');
    registrarPrediccion('C', 'Brasil');

    const conteo = obtenerConteo();
    expect(conteo).toEqual([
      { equipo: 'Argentina', votos: 2 },
      { equipo: 'Brasil', votos: 1 }
    ]);
  });

  test('ordena de mayor a menor cantidad de votos', () => {
    registrarPrediccion('A', 'Brasil');
    registrarPrediccion('B', 'Francia');
    registrarPrediccion('C', 'Francia');
    registrarPrediccion('D', 'Francia');

    const conteo = obtenerConteo();
    expect(conteo[0]).toEqual({ equipo: 'Francia', votos: 3 });
  });

  test('devuelve lista vacía si no hay predicciones', () => {
    expect(obtenerConteo()).toEqual([]);
  });
});
