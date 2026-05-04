export function obtenerClienteId() {
  let id = localStorage.getItem("cliente_id");

  if (!id) {
    if (window.crypto && typeof crypto.randomUUID === "function") {
      id = crypto.randomUUID();
    } else {
      // 🔥 fallback universal (funciona en cualquier celular)
      id = "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    }

    localStorage.setItem("cliente_id", id);
  }

  return id;
}