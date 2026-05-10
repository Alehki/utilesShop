const progresoAnterior = {};

const PASOS_PEDIDO = [
  "recibido",
  "preparando",
  "en_camino",
  "entregado"
];

const LABELS_ESTADO = {
  recibido: "Recibido",
  preparando: "Preparando",
  en_camino: "En camino",
  entregado: "Entregado"
};

function obtenerEstadoInicial(pedidoId, estadoActual) {

  if (
    progresoAnterior[pedidoId] !== undefined &&
    progresoAnterior[pedidoId] !== "finalizado"
  ) {

    return PASOS_PEDIDO[
      Math.round(
        progresoAnterior[pedidoId] *
        (PASOS_PEDIDO.length - 1)
      )
    ];

  }

  return estadoActual;

}

function renderProgreso(estadoActual, pedidoId) {

  const actualIndex =
    PASOS_PEDIDO.indexOf(estadoActual);

  const progreso =
    actualIndex / (PASOS_PEDIDO.length - 1);

  const progresoPrevio =
    progresoAnterior[pedidoId] ?? progreso;

  return `
    <div
      class="pedido-progreso"
      data-id="${pedidoId}"
      data-actual="${actualIndex}"
      data-progreso="${progreso}"
      style="--progreso:${progresoPrevio}"
    >

      ${PASOS_PEDIDO.map((paso, index) => `

        <div class="paso ${
          index < actualIndex
            ? "completado"
            : ""
        }">

          <div class="circulo">
            ${index < actualIndex ? "✓" : ""}
          </div>

          <span>${LABELS_ESTADO[paso]}</span>

        </div>

      `).join("")}

    </div>
  `;
}

function animarProgresos(pedidos, contenedor) {
  let renderizandoHistorial = false;
  document
    .querySelectorAll(".pedido-progreso")
    .forEach(el => {

      const progreso =
        el.dataset.progreso;

      const card =
        el.closest(".pedido-card");

      const estadoFinal =
        card.dataset.estadoFinal;

      el.offsetWidth;

      el.style.setProperty(
        "--progreso",
        progreso
      );

      progresoAnterior[el.dataset.id] =
        progreso;

      setTimeout(() => {

        card.classList.remove(
          "estado-recibido",
          "estado-preparando",
          "estado-en_camino",
          "estado-entregado"
        );

        const actualIndex =
          Number(el.dataset.actual);

        const pasos =
          card.querySelectorAll(".paso");

        pasos[actualIndex]
          ?.classList.add("activo");

        card.classList.add(
          `estado-${estadoFinal}`
        );

      if (estadoFinal === "entregado") {

        progresoAnterior[el.dataset.id] =
          "finalizado";

        // renderPedidos(
        //   pedidos,
        //   contenedor
        // );

      }

      }, 700);

    });

}

export function renderPedidos(pedidos, contenedor) {
  if (!pedidos.length) {
    contenedor.innerHTML = "<p>No tenés pedidos todavía</p>";
    return;
  }

  const ordenados = [...pedidos].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at));

  // const activos = ordenados.filter(p =>
  //   p.estado === "pendiente" || p.estado === "preparando"
  // );

  // const activos = ordenados.filter(p =>
  //   p.estado !== "entregado"
  // );

  // const historial = ordenados.filter(p =>
  //   p.estado === "entregado"
  // );

  const activos = ordenados.filter(p => {

    if (p.estado !== "entregado") return true;

    return progresoAnterior[p.id] !== "finalizado";

  });

  const historial = ordenados.filter(p => {

    return (
      p.estado === "entregado" &&
      progresoAnterior[p.id] === "finalizado"
    );

  });

  contenedor.innerHTML = `
    ${renderLista("Pedidos activos", activos)}
    ${renderLista("Historial", historial)}
  `;

  setTimeout(() => {

    animarProgresos( pedidos, contenedor );

  }, 50);
}

function formatearEstado(estado) {
  const estados = {
    recibido: "Recibido",
    pendiente: "🟡 Pendiente",
    preparando: "Preparando",
    en_camino: "En camino",
    entregado: "Entregado"
  };

  return estados[estado] || estado;
}

function renderLista(titulo, lista) {
  if (!lista.length) return "";

  const esHistorial = titulo === "Historial";

  return `
    <div class="pedidos-seccion ${esHistorial ? "historial" : "activos"}">
      <h3 class="title-pedido">${titulo}</h3>

      ${lista.map(p => {

      const estadoInicial = obtenerEstadoInicial( p.id, p.estado );

        return `
          <div class="pedido-card estado-${estadoInicial}" data-estado-final="${p.estado}">
            
            <div class="pedido-header">
              <strong>Pedido #${p.id}</strong>
              <span class="pedido-estado">
                ${formatearEstado(p.estado)}
              </span>
            </div>

            <div class="pedido-body">
              <p>Total: $${p.total}</p>
              <p class="fecha">${formatearFecha(p.created_at)}</p>
              ${renderProgreso(p.estado, p.id)}

              <div class="pedido-eta">
                🕒 Llegada estimada: 15-25 min
              </div>
            </div>

            <div class="pedido-footer">
              <button class="btn-detalle" data-id="${p.id}">
                Ver detalle
              </button>
            </div>

          </div>
        `;

      }).join("")}

    </div>
  `;
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return "";

  const fecha = new Date(fechaISO);

  const offset = fecha.getTimezoneOffset(); // minutos
  const fechaLocal = new Date(fecha.getTime() - offset * 60000);

  return fechaLocal.toLocaleDateString("es-AR") + " " +
         fechaLocal.toLocaleTimeString("es-AR", {
           hour: "2-digit",
           minute: "2-digit"
         });
}