export function renderProductos(productos) {
  const container = document.getElementById("lista-productos");

  // 🔥 limpiar contenido sin romper referencias
  container.innerHTML = "";

  productos.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.id = `producto-${p.id}`;

    div.innerHTML = `
      <div class="producto-info">

        <div class="producto-datos">
          <div class="producto-nombre">${p.nombre}</div>

          <div class="campo">
            <label>Precio</label>
            <input type="number" value="${p.precio}" id="precio-${p.id}">
          </div>

          <div class="campo">
            <label>Stock</label>
            <input type="number" value="${p.stock ?? 0}" id="stock-${p.id}">
          </div>

          <div class="campo-checkbox">
            <label>Activo</label>
            <input type="checkbox" ${p.activo ? "checked" : ""} id="activo-${p.id}">
          </div>

        </div>

      </div>

      <div class="producto-acciones">
        <button onclick="guardarProducto('${p.id}')">
          Guardar
        </button>
      </div>
    `;

    container.appendChild(div);
  });
}

export function actualizarProductoEnUI(producto) {
  const precioInput = document.getElementById(`precio-${producto.id}`);
  const stockInput = document.getElementById(`stock-${producto.id}`);
  const activoInput = document.getElementById(`activo-${producto.id}`);

  if (precioInput) {
    precioInput.value = producto.precio;
    precioInput.style.background = "#d4ffd4";
  }

  if (stockInput) {
    stockInput.value = producto.stock;
    stockInput.style.background = "#d4ffd4";
  }

  if (activoInput) {
    activoInput.checked = producto.activo;
  }

  setTimeout(() => {
    if (precioInput) precioInput.style.background = "";
    if (stockInput) stockInput.style.background = "";
  }, 500);

  console.log("✅ UI ACTUALIZADA:", producto.id);
}