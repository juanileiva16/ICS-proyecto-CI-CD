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
| `npm test`              | Corre todas las pruebas con Jest (incluye las specs)|
| `npm run test:coverage` | Corre las pruebas y genera reporte de cobertura     |
| `npm run test:specs`    | Corre solo las specs de aceptación (SDD)            |
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

## Spec Driven Development (SDD)

Los criterios de aceptación de la app están escritos como **specs ejecutables**
en formato Gherkin (`tests/features/*.feature`) y se ejecutan con
[`jest-cucumber`](https://github.com/bencompton/jest-cucumber). No son documentación
decorativa: **la spec ES el test.**

- Cada escenario `Given/When/Then` describe una regla de negocio en lenguaje natural.
- Los _step definitions_ (`*.steps.js`) conectan cada paso con la lógica real
  (`src/predicciones.js`).
- Corren junto al resto de las pruebas (`npm test`), dentro del pipeline de CI.

**Utilidad en el flujo CI/CD:** si alguien cambia la lógica y viola un criterio
de aceptación, la spec falla → el job `ci` se pone en rojo → el merge se bloquea
y llega la notificación a Discord. Así, la especificación y el código nunca se
desincronizan.

Para correr solo las specs:

```bash
npm run test:specs
```

## Docker

La app se empaqueta en una imagen Docker (ver `Dockerfile`). El pipeline la
construye en cada PR (para verificar) y la **publica** en GitHub Container
Registry al fusionar a `main`.

Para construir y correr la imagen localmente:

```bash
docker build -t mundial-2026 .
docker run -p 3001:3001 mundial-2026   # -> http://localhost:3001
```

Para usar la imagen ya publicada:

```bash
docker pull ghcr.io/juanileiva16/mundial-2026-prediccion:latest
docker run -p 3001:3001 ghcr.io/juanileiva16/mundial-2026-prediccion:latest
```
