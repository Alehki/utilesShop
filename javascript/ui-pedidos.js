export function renderPedidos(pedidos, contenedor) {
  if (!pedidos.length) {
    contenedor.innerHTML = "<p>No tenés pedidos todavía</p>";
    return;
  }

  const ordenados = [...pedidos].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at));

  const activos = ordenados.filter(p =>
    p.estado === "pendiente" || p.estado === "preparando"
  );

  const historial = ordenados.filter(p =>
    p.estado === "entregado"
  );

  contenedor.innerHTML = `
    ${renderLista("Pedidos activos", activos)}
    ${renderLista("Historial", historial)}
  `;
}

function formatearEstado(estado) {
  const estados = {
    pendiente: "🟡 Pendiente",
    preparando: "🔵 En preparación",
    entregado: "🟢 Entregado"
  };

  return estados[estado] || estado;
}

function renderLista(titulo, lista) {
  if (!lista.length) return "";

  const esHistorial = titulo === "Historial";

  return `
    <div class="pedidos-seccion ${esHistorial ? "historial" : ""}">
      <h3 class="title-pedido">${titulo}</h3>

      ${lista.map(p => `
        <div class="pedido-card estado-${p.estado}">
          
          <div class="pedido-header">
            <strong>Pedido #${p.id}</strong>
            <span>${formatearEstado(p.estado)}</span>
          </div>

          <div class="pedido-body">
            <p>Total: $${p.total}</p>
            <p class="fecha">${formatearFecha(p.created_at)}</p>
          </div>

          <div class="pedido-footer">
            <button class="btn-detalle" data-id="${p.id}">
              Ver detalle
            </button>
          </div>

        </div>
      `).join("")}

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