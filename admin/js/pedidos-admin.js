import { suscribirsePedidos } from "./pedidos/pedidos-realtime.js";
import { renderPedidos } from "./pedidos/pedidos-ui.js";
import {
  obtenerPedidos,
  obtenerItemsPedido,
  actualizarEstadoPedido
} from "./pedidos/pedidos-api.js";

const sonidoPedido = new Audio("./sounds/pedido.mp3");
let sonidoHabilitado = false;

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

  const pedidos = await obtenerPedidos();

  renderPedidos(pedidos);

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

  const items = await obtenerItemsPedido(id);

  container.innerHTML = items.map(i => `
    - ${i.nombre} x${i.cantidad} ($${i.precio})
  `).join("<br>");

  container.style.display = "block";
  container.style.animation = "fadeDetalle .25s ease";
}

window.cambiarEstado = async function(id, nuevoEstado) {

  const ok = await actualizarEstadoPedido(id, nuevoEstado);

  if(!ok){
    alert("Error al actualizar");
  }

}

suscribirsePedidos((payload) => {

  console.log("🔥 CAMBIO PEDIDO:", payload);

  if(payload.eventType === "INSERT"){

    if(sonidoHabilitado){

      sonidoPedido.currentTime = 0;

      sonidoPedido.play();

    }

  }

  cargarPedidos();

});

cargarPedidos();

