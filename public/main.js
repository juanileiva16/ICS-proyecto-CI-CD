const form = document.getElementById('form-prediccion');
const selectEquipo = document.getElementById('equipo');
const mensaje = document.getElementById('mensaje');
const rankingLista = document.getElementById('ranking-lista');

// Carga la lista de equipos en el <select>.
async function cargarEquipos() {
  try {
    const res = await fetch('/api/equipos');
    const data = await res.json();
    selectEquipo.innerHTML = '<option value="">Elegí un equipo...</option>';
    for (const equipo of data.equipos) {
      const opt = document.createElement('option');
      opt.value = equipo;
      opt.textContent = equipo;
      selectEquipo.appendChild(opt);
    }
  } catch (err) {
    selectEquipo.innerHTML = '<option value="">Error al cargar equipos</option>';
  }
}

// Refresca el ranking de votos.
async function cargarRanking() {
  try {
    const res = await fetch('/api/predicciones/conteo');
    const data = await res.json();
    if (!data.conteo.length) {
      rankingLista.innerHTML = '<li class="vacio">Todavía no hay predicciones.</li>';
      return;
    }
    rankingLista.innerHTML = '';
    for (const { equipo, votos } of data.conteo) {
      const li = document.createElement('li');
      li.textContent = `${equipo} — ${votos} voto${votos === 1 ? '' : 's'}`;
      rankingLista.appendChild(li);
    }
  } catch (err) {
    rankingLista.innerHTML = '<li class="vacio">Error al cargar el ranking.</li>';
  }
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value;
  const equipo = selectEquipo.value;

  try {
    const res = await fetch('/api/predicciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, equipo })
    });
    const data = await res.json();
    if (res.ok) {
      mostrarMensaje(`¡Listo! Predijiste que gana ${data.prediccion.equipo}.`, 'ok');
      form.reset();
      cargarRanking();
    } else {
      mostrarMensaje(data.error || 'Algo salió mal.', 'error');
    }
  } catch (err) {
    mostrarMensaje('No se pudo conectar con el servidor.', 'error');
  }
});

cargarEquipos();
cargarRanking();
