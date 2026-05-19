import { obtenerPedidosCliente } from "./supabase/pedidos.js";

let ultimaCantidadPedidos = 0;

export function actualizarBadgePedidos(cantidad) {

  const btnPedidos = document.querySelector(
    '.nav-item[data-tab="pedidos"]'
  );

  if (!btnPedidos) return;

  let badge = btnPedidos.querySelector(".pedidos-badge");

  if (cantidad <= 0) {

    if (badge) {
      badge.remove();
    }

    ultimaCantidadPedidos = 0;

    return;
  }

  if (!badge) {

    badge = document.createElement("span");
    badge.className = "pedidos-badge";

    btnPedidos.appendChild(badge);
  }

  badge.textContent = cantidad;

  // animar solo si aumentó
  if (cantidad > ultimaCantidadPedidos) {

    badge.classList.remove("animar");

    void badge.offsetWidth;

    badge.classList.add("animar");
  }

  ultimaCantidadPedidos = cantidad;
}

export async function refrescarPedidosActivos() {

  const pedidos = await obtenerPedidosCliente();

  const activos = pedidos.filter(
    p => p.estado !== "entregado"
  ).length;

  actualizarBadgePedidos(activos);
}