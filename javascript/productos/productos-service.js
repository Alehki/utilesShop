import { supabase } from "../supabase/supabase-client.js";

export async function obtenerProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("activo", true);

  if (error) {
    console.error("Error Supabase:", error);
    return [];
  }

  console.log("PRODUCTOS DESDE DB:", data);

  // 🔥 normalización (MUY importante)
  return data.map(p => ({
    ...p,
    imagenes: Array.isArray(p.imagenes)
      ? p.imagenes
      : [p.imagenes],
    colores: Array.isArray(p.colores)
      ? p.colores
      : (p.colores ? [p.colores] : [])
  }));
}

export async function obtenerListas() {
  const productos = await obtenerProductos();

  return agruparPorCategoria(productos);
}

// 🔹 helper interno
function agruparPorCategoria(productos) {
  const resultado = {};

  productos.forEach(p => {
    if (!resultado[p.categoria]) {
      resultado[p.categoria] = [];
    }
    resultado[p.categoria].push(p);
  });

  return resultado;
}