

export function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")                // separa letras y tildes
    .replace(/[\u0300-\u036f]/g, ""); // elimina tildes
}

export function obtenerResumenCarrito(carritoActual) {
  return Object.values(carritoActual).reduce(
    (acc, p) => {
      acc.cantidad += p.cantidad;
      acc.total += p.precio * p.cantidad;
      return acc;
    },
    { cantidad: 0, total: 0 }
  );
}