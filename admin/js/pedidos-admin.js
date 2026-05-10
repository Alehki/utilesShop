const ESTADOS = [
  "recibido",
  "preparando",
  "en_camino",
  "entregado"
];

const LABELS = {
  recibido: "Pedido recibido",
  preparando: "Preparando",
  en_camino: "En camino",
  entregado: "Entregado"
};

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

function getTextoBoton(estado) {
  const textos = {
    preparando: "Comenzar preparación",
    en_camino: "Enviar pedido",
    entregado: "Marcar entregado"
  };

  return textos[estado] || "Continuar";
}

function getBoton(p) {
  const index = ESTADOS.indexOf(p.estado);

  // último estado
  if (index === ESTADOS.length - 1) {
    return `<span class="estado-ok">✔ Entregado</span>`;
  }

  const siguienteEstado = ESTADOS[index + 1];

  return `
    <button onclick="cambiarEstado('${p.id}', '${siguienteEstado}')">
      ${getTextoBoton(siguienteEstado)}
    </button>
  `;
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

  console.log("ID CLICK:", id);

  const items = await obtenerItems(id);

  container.innerHTML = items.map(i => `
    - ${i.nombre} x${i.cantidad} ($${i.precio})
  `).join("<br>");

  container.style.display = "block";
}

window.cambiarEstado = async function(id, nuevoEstado) {

  const { error } = await supabaseAdmin
    .from("pedidos")
    .update({ estado: nuevoEstado })
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Error al actualizar");
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

