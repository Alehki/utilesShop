
import { calcularTotalDesde } from "./carrito-core.js";

export function renderCarrito({
  getCarrito,
  carritoItems,
  totalSpan,
  modalCarrito,
  actualizarCount,
  estaAbierto,
  COMPRA_MINIMA,
  HORARIO_APERTURA,
  HORARIO_CIERRE,
  actualizarBotonRevisar,
  activarSwipeCarrito,
  pedirEliminar,
  agregarDesdeCarrito,
  restarDesdeCarrito
}) {
  const carrito = getCarrito();
  carritoItems.innerHTML = "";

  if (Object.keys(carrito).length === 0) {
    totalSpan.textContent = 0;
    modalCarrito.classList.add("hidden");
    actualizarCount();
    return;
  }

  const fragment = document.createDocumentFragment();

  Object.entries(carrito).forEach(([key, p]) => {
    const item = document.createElement("div");
    item.classList.add("item-carrito");

    const btnEliminar = document.createElement("div");
    btnEliminar.classList.add("item-eliminar");
    btnEliminar.textContent = "🗑";
    // btnEliminar.classList.add("btn-icon", "danger");
    // btnEliminar.innerHTML = `
    //   <svg viewBox="0 0 24 24">
    //     <path d="M9 3h6M4 7h16M6 7l1 14h10l1-14"/>
    //   </svg>
    // `;
    btnEliminar.onclick = () => pedirEliminar(key);

    const contenido = document.createElement("div");
    contenido.classList.add("item-contenido");

    const info = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = `${p.nombre}${p.color ? ` (${p.color})` : ""}`;

    const textoPrecio = document.createTextNode(
      ` $${p.precio} x ${p.cantidad}`
    );

    info.appendChild(strong);
    info.appendChild(textoPrecio);

    const controles = document.createElement("div");
    controles.classList.add("controles");

    const btnMenos = document.createElement("button");

    if (p.cantidad === 1) {
      // btnMenos.textContent = "🗑";
      btnMenos.classList.add("btn-icon", "danger");
      btnMenos.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M9 3h6M4 7h16M6 7l1 14h10l1-14"/>
        </svg>
      `;
      btnMenos.onclick = () => pedirEliminar(key);
    } else {
      btnMenos.textContent = "−";
      btnMenos.onclick = () => restarDesdeCarrito(key);
    }

    const spanCantidad = document.createElement("span");
    spanCantidad.textContent = p.cantidad;

    const btnMas = document.createElement("button");
    // btnMas.textContent = "+";
    btnMas.classList.add("btn-icon", "primary");
    btnMas.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    `;
    btnMas.onclick = () => agregarDesdeCarrito(key);

    controles.appendChild(btnMenos);
    controles.appendChild(spanCantidad);
    controles.appendChild(btnMas);

    contenido.appendChild(info);
    contenido.appendChild(controles);

    item.appendChild(btnEliminar);
    item.appendChild(contenido);

    fragment.appendChild(item);
  });

  carritoItems.appendChild(fragment);

  const total = calcularTotalDesde(carrito);
  totalSpan.textContent = total;

  // RESUMEN DEL CARRITO

  const resumenDiv = document.getElementById("resumenCarrito");
  const cantidadTotal = Object.values(carrito)
    .reduce((acc, p) => acc + p.cantidad, 0);

  resumenDiv.innerHTML = `
    <div class="resumen-linea">
      <span>Productos</span>
      <span>$${total}</span>
    </div>
  `;

  const msgMinimo = document.getElementById("mensajeCompraMinima");
  const msgHorario = document.getElementById("mensajeHorario");

  if (!estaAbierto()) {
    msgHorario.textContent =
      `Estamos cerrados 🕒 Horario: ${HORARIO_APERTURA}:00 a ${HORARIO_CIERRE}:00 hs`;
    msgHorario.classList.remove("hidden");
    msgMinimo.classList.add("hidden");

  } else if (total < COMPRA_MINIMA) {
    const falta = COMPRA_MINIMA - total;
    msgMinimo.textContent = `Agregá $${falta} para poder pedir`;
    msgMinimo.classList.add("show");
    msgHorario.classList.remove("show");

  } else {
    msgMinimo.classList.remove("show");
    msgHorario.classList.remove("show");
  }

  actualizarBotonRevisar();
  activarSwipeCarrito();
}

export function abrirCarrito({
  carrito,
  modalCarrito,
  modalProducto,
  modalColores,
  mobileCartBar,
  renderCarrito,
  bloquearScroll
}) {
  if (Object.keys(carrito).length === 0) return;

  if (!modalProducto.classList.contains("hidden")) {
    modalProducto.classList.add("hidden");
  }

  if (!modalColores.classList.contains("hidden")) {
    modalColores.classList.add("hidden");
  }

  modalCarrito.classList.remove("hidden");
  mobileCartBar.classList.remove("show");

  renderCarrito();
  bloquearScroll();
}

export function cerrarCarrito({
  modalCarrito,
  habilitarScroll,
  actualizarCount
}) {
  modalCarrito.classList.add("hidden");
  habilitarScroll();
  actualizarCount();
}