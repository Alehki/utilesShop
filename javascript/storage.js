
export function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

export function obtenerCarrito() {
  const data = JSON.parse(localStorage.getItem("carrito"));

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {};
  }

  return data;
}