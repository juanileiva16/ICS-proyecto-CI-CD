const request = require('supertest');
const app = require('../src/app');
const { reiniciar } = require('../src/predicciones');

beforeEach(() => {
  reiniciar();
});

describe('GET /health', () => {
  test('responde ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/equipos', () => {
  test('devuelve la lista de equipos', async () => {
    const res = await request(app).get('/api/equipos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.equipos)).toBe(true);
    expect(res.body.equipos).toContain('Argentina');
  });
});

describe('POST /api/predicciones', () => {
  test('registra una predicción válida', async () => {
    const res = await request(app)
      .post('/api/predicciones')
      .send({ usuario: 'Juani', equipo: 'Argentina' });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.prediccion.equipo).toBe('Argentina');
  });

  test('rechaza un equipo inválido con 400', async () => {
    const res = await request(app)
      .post('/api/predicciones')
      .send({ usuario: 'Juani', equipo: 'Marte' });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.error).toMatch(/no válido/i);
  });

  test('rechaza si falta el usuario con 400', async () => {
    const res = await request(app)
      .post('/api/predicciones')
      .send({ equipo: 'Brasil' });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });
});

describe('GET /api/predicciones/conteo', () => {
  test('refleja las predicciones registradas', async () => {
    await request(app).post('/api/predicciones').send({ usuario: 'A', equipo: 'Brasil' });
    await request(app).post('/api/predicciones').send({ usuario: 'B', equipo: 'Brasil' });

    const res = await request(app).get('/api/predicciones/conteo');
    expect(res.status).toBe(200);
    expect(res.body.conteo).toEqual([{ equipo: 'Brasil', votos: 2 }]);
  });
});
