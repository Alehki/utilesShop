
export function estaAbierto() {
  const ahora = new Date();
  const hora = ahora.getHours();

  return hora >= 0 && hora < 24;
}

export function actualizarEstadoHorario() {
  const headerMsg = document.getElementById("mensajeHorario");

  if (estaAbierto()) {
    document.body.classList.remove("tienda-cerrada");
    headerMsg.classList.add("hidden");
  } else {
    document.body.classList.add("tienda-cerrada");
    headerMsg.classList.remove("hidden");
  }
}

// fincion extra para el hero. por ahora ver.
export function actualizarHeroHorario() {
  const badge = document.getElementById("hero-badge");
  if (!badge) return;

  if (estaAbierto()) {
    badge.textContent = "🟢 Abierto ahora · Entregas en el día";
  } else {
    badge.textContent = "🔴 Cerrado · Abrimos a las 9:00";
  }
}

