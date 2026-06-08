// "Build" para una app Node sin transpilación: verificamos que todos los
// módulos del backend cargan sin errores de sintaxis ni de require.
// Si algo está roto, el proceso termina con código != 0 y el CI falla.
const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const carpetaSrc = path.join(raiz, 'src');

let errores = 0;

for (const archivo of fs.readdirSync(carpetaSrc)) {
  if (!archivo.endsWith('.js')) continue;
  // No cargamos server.js: abriría un puerto. app.js ya cubre el backend.
  if (archivo === 'server.js') continue;

  const ruta = path.join(carpetaSrc, archivo);
  try {
    require(ruta);
    console.log(`✓ ${archivo} carga correctamente`);
  } catch (err) {
    errores += 1;
    console.error(`✗ ${archivo}: ${err.message}`);
  }
}

if (errores > 0) {
  console.error(`\nBuild fallida: ${errores} módulo(s) con errores.`);
  process.exit(1);
}

console.log('\nBuild OK: todos los módulos cargan correctamente.');
