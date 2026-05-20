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

export function renderPedidos(pedidos) {

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

          <div class="pedido-pago">
            💳 ${p.metodo_pago || "No especificado"}
          </div>

          <div class="pedido-direccion">
            📍 ${p.direccion || "Sin dirección"}
          </div>

          <div class="pedido-referencia">
            📝 ${p.referencia || "Sin referencia"}
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