export function crearKey(id, color = null) {
  return color ? `${id}_${color}` : id;
}

export function agregarItem(carritoActual, productos, id, color = null, cantidad = 1) {
  const key = crearKey(id, color);
  const nuevoCarrito = { ...carritoActual };

  if (!nuevoCarrito[key]) {
    const prod = productos.find(p => p.id === id);
    if (!prod) return nuevoCarrito;

    nuevoCarrito[key] = {
      ...prod,
      color,
      cantidad: 0
    };
  }

  nuevoCarrito[key].cantidad += cantidad;

  return nuevoCarrito;
}

export function restarItem(carritoActual, id, color = null, cantidad = 1) {
  const key = crearKey(id, color);
  const nuevoCarrito = { ...carritoActual };

  if (!nuevoCarrito[key]) return nuevoCarrito;

  nuevoCarrito[key].cantidad -= cantidad;

  if (nuevoCarrito[key].cantidad <= 0) {
    delete nuevoCarrito[key];
  }

  return nuevoCarrito;
}

export function calcularTotalDesde(carritoActual) {
  return Object.values(carritoActual)
    .reduce((acc, p) => acc + p.precio * p.cantidad, 0);
}


