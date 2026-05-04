console.log("CARGANDO ADMIN JS");
const supabaseAdmin = window.supabase.createClient(
  "https://jtumqhpuegqzmkgeofxw.supabase.co",
  "sb_publishable_7a6K3_VDHdqvyQhnj-0Cag_uyH7MlFw"
);

let timeout = null;

async function cargarPedidos() {
  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  renderPedidos(data);
}

function getBoton(p) {
  if (p.estado === "pendiente") {
    return `<button onclick="pasarAPreparando('${p.id}')">Preparar</button>`;
  }
  if (p.estado === "preparando") {
    return `<button onclick="marcarEntregado('${p.id}')">Entregar</button>`;
  }
  return `<span>✔ Entregado</span>`;
}

function renderPedidos(pedidos) {
  const container = document.getElementById("lista-pedidos");
  container.innerHTML = "";

  pedidos.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("pedido");

    div.innerHTML = `
      <div class="pedido-header">Pedido #${p.id}</div>

      <div class="estado">Estado: ${p.estado}</div>

      <div>Fecha: ${new Date(p.created_at).toLocaleString()}</div>

      <button onclick="verDetalle('${p.id}')">Ver detalle</button>

      ${getBoton(p)}

      <div id="detalle-${p.id}" class="detalle" style="display:none;"></div>
    `;

    container.appendChild(div);
  });
}

window.verDetalle = async function(id) {
  const container = document.getElementById(`detalle-${id}`);

  if (container.style.display === "block") {
    container.style.display = "none";
    return;
  }

  const items = await obtenerItems(id);

  container.innerHTML = items.map(i => `
    - ${i.nombre} x${i.cantidad} ($${i.precio})
  `).join("<br>");

  container.style.display = "block";
}

window.pasarAPreparando = async function(id) {
  console.log("CLICK preparar:", id);

  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .update({ estado: "preparando" })
    .eq("id", id);

  console.log("RESULT:", data);
  console.log("ERROR:", error);

  if (error) {
    alert("Error al actualizar");
    return;
  }

}

window.marcarEntregado = async function(id) {
  console.log("CLICK entregar:", id);
  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .update({ estado: "entregado" })
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Error");
    return;
  }
}

async function obtenerItems(pedidoId) {
  const { data, error } = await supabaseAdmin
    .from("pedido_items")
    .select("*")
    .eq("pedido_id", pedidoId);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

function suscribirsePedidosAdmin() {
  console.log("🚀 Suscribiendo pedidos...");

  const channel = supabaseAdmin
    .channel("admin-pedidos")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "pedidos"
      },
      (payload) => {
        console.log("🔥 CAMBIO PEDIDO:", payload);
        cargarPedidos();
      }
    )
    .subscribe((status) => {
      console.log("📡 Estado pedidos:", status);
    });

  return channel;
}

// function suscribirsePedidosAdmin() {
//   const channel = supabaseAdmin
//     .channel("admin-pedidos")
//     .on(
//       "postgres_changes",
//       {
//         event: "*",
//         schema: "public",
//         table: "pedidos"
//       },
//       (payload) => {
//         console.log("Cambio detectado:", payload);

//         clearTimeout(timeout);

//         timeout = setTimeout(() => {
//           cargarPedidos();
//         }, 300);
//       }
//     )
//     .subscribe((status) => {
//       console.log("Realtime admin:", status);
//     });

//   return channel;
// }

cargarPedidos();
suscribirsePedidosAdmin();

