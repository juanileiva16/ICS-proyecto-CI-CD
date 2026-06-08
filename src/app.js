const path = require('path');
const express = require('express');
const { EQUIPOS } = require('./equipos');
const {
  registrarPrediccion,
  obtenerConteo,
  listarPredicciones
} = require('./predicciones');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Lista de selecciones candidatas.
app.get('/api/equipos', (req, res) => {
  res.json({ equipos: EQUIPOS });
});

// Registrar una predicción.
app.post('/api/predicciones', (req, res) => {
  const { usuario, equipo } = req.body || {};
  try {
    const prediccion = registrarPrediccion(usuario, equipo);
    res.status(201).json({ ok: true, prediccion });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// Conteo de votos por equipo (ranking).
app.get('/api/predicciones/conteo', (req, res) => {
  res.json({ conteo: obtenerConteo() });
});

// Listado completo de predicciones.
app.get('/api/predicciones', (req, res) => {
  res.json({ predicciones: listarPredicciones() });
});

// Healthcheck: útil para el pipeline de CI/CD.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
