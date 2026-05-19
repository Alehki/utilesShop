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

const sonidoPedido = new Audio("./sounds/pedido.mp3");
let sonidoHabilitado = false;
let timeoutPedidos = null;

document.addEventListener("click", habilitarAudio, { once:true });

function habilitarAudio(){

  sonidoPedido.play()
    .then(() => {

      sonidoPedido.pause();
      sonidoPedido.currentTime = 0;

      sonidoHabilitado = true;

      console.log("🔊 Audio habilitado");

    })
    .catch(err => {
      console.log("Error habilitando audio", err);
    });

}

async function cargarPedidos() {
  const { data, error } = await window.supabaseAdmin
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

      <div class="pedido-top">

        <div>
          <div class="pedido-id">
            Pedido #${p.id}
          </div>

          <div class="pedido-fecha">
            ${new Date(p.created_at).toLocaleString()}
          </div>
        </div>

        <div class="estado estado-${p.estado}">
          ${LABELS[p.estado]}
        </div>

      </div>

      <div class="pedido-acciones">

        <button class="btn-detalle" onclick="verDetalle('${p.id}')">
          Ver detalle
        </button>

        ${getBoton(p)}

      </div>

      <div id="detalle-${p.id}" class="detalle"></div>

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

  // detalles

  container.style.display = "block";

  container.innerHTML = `
    <div class="detalle-loading">
      Cargando detalle...
    </div>
  `;

  // --------

  const items = await obtenerItems(id);

  container.innerHTML = items.map(i => `
    - ${i.nombre} x${i.cantidad} ($${i.precio})
  `).join("<br>");

  container.style.display = "block";
  container.style.animation = "fadeDetalle .25s ease";
}

window.cambiarEstado = async function(id, nuevoEstado) {

  const { error } = await window.supabaseAdmin
    .from("pedidos")
    .update({ estado: nuevoEstado })
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Error al actualizar");
  }
}

async function obtenerItems(pedidoId) {
  const { data, error } = await window.supabaseAdmin
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

  const channel = window.supabaseAdmin
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

        if(payload.eventType === "INSERT"){

          if(sonidoHabilitado){

            sonidoPedido.currentTime = 0;

            sonidoPedido.play();

          }

        }
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

