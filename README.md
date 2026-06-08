# Predicción Mundial 2026 ⚽🏆

App web sencilla para predecir quién ganará el Mundial de Fútbol 2026.
El objetivo del proyecto **no es la app en sí**, sino construir alrededor de ella
un entorno de **Integración y Entrega Continua (CI/CD)**: build automatizada,
pruebas automatizadas y, más adelante, despliegue automático.

No usa base de datos: las predicciones se guardan en memoria y se reinician
cuando se reinicia el servidor.

## Tecnologías

- **Node.js** + **Express** (backend y API)
- **HTML / CSS / JS** vanilla (frontend)
- **Jest** + **Supertest** (pruebas unitarias e integración)
- **ESLint** (análisis estático)

## Estructura

```
src/
  equipos.js        Datos: selecciones candidatas
  predicciones.js   Lógica de negocio (validación, conteo) — testeable
  app.js            App Express (exportada, sin abrir puerto)
  server.js         Arranca el servidor
public/             Frontend (UI)
tests/              Pruebas unitarias y de API
scripts/
  build-check.js    Verificación de "build"
```

## Cómo correrlo localmente

```bash
npm install      # instalar dependencias
npm start        # arrancar la app -> http://localhost:3001
```

## Scripts disponibles

| Comando                 | Qué hace                                            |
|-------------------------|-----------------------------------------------------|
| `npm start`             | Arranca el servidor en el puerto 3001               |
| `npm run build`         | Verifica que todos los módulos cargan sin errores   |
| `npm test`              | Corre las pruebas con Jest                          |
| `npm run test:coverage` | Corre las pruebas y genera reporte de cobertura     |
| `npm run lint`          | Análisis estático con ESLint                        |

## API

| Método | Ruta                        | Descripción                          |
|--------|-----------------------------|--------------------------------------|
| GET    | `/api/equipos`              | Lista de selecciones candidatas      |
| POST   | `/api/predicciones`         | Registra una predicción              |
| GET    | `/api/predicciones`         | Lista todas las predicciones         |
| GET    | `/api/predicciones/conteo`  | Ranking de votos por equipo          |
| GET    | `/health`                   | Healthcheck para el pipeline         |

Ejemplo de body para `POST /api/predicciones`:

```json
{ "usuario": "Juani", "equipo": "Argentina" }
```
