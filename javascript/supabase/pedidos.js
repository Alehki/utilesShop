import { obtenerClienteId } from "../cliente.js";
import { supabase } from "./supabase-client.js";

export async function crearPedido(carrito, datosCliente) {
  const clienteId = obtenerClienteId();

  const items = Object.values(carrito);

  console.log("CARRITO PARA BACK:", items);

  const { data, error } = await supabase.rpc("crear_pedido", {
    carrito: items,
    p_cliente_id: clienteId,
    p_direccion: datosCliente.direccion,
    p_metodo_pago: datosCliente.metodoPago
  });

  if (error) throw error;

  return data;
}

export async function obtenerPedidosCliente() {
  const clienteId = obtenerClienteId();

  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .eq("cliente_id", clienteId)
    .order("id", { ascending: false });

  if (error) {
    console.error("Error trayendo pedidos:", error);
    return [];
  }

  return data;
}

export async function obtenerItemsPedido(pedidoId) {
  const { data, error } = await supabase
    .from("pedido_items")
    .select("*")
    .eq("pedido_id", pedidoId);

  if (error) throw error;

  return data;
}

export function suscribirseAPedidos(callback) {
  let timeout = null;
  const clienteId = obtenerClienteId();

  const channel = supabase
    .channel("pedidos-realtime")
    .on(
      "postgres_changes",
      {
        event: "INSERT,UPDATE", // podés cambiar a "INSERT,UPDATE"
        schema: "public",
        table: "pedidos",
        filter: `cliente_id=eq.${clienteId}`
      },
      (payload) => {
        console.log("Cambio en pedidos:", payload);

        clearTimeout(timeout);

        timeout = setTimeout(() => {
          callback();
        }, 300);
      }
    )
    .subscribe((status) => {
      console.log("Estado realtime:", status);
    });

  return channel;
}