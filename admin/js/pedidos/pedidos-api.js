import { supabaseAdmin } from "../config/supabase.js";

export async function obtenerPedidos() {

  const { data, error } = await supabaseAdmin
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false });

  if(error){
    console.error(error);
    return [];
  }

  return data;
}

export async function obtenerItemsPedido(pedidoId){

  const { data, error } = await supabaseAdmin
    .from("pedido_items")
    .select("*")
    .eq("pedido_id", pedidoId);

  if(error){
    console.error(error);
    return [];
  }

  return data;
}

export async function actualizarEstadoPedido(id, estado){

  const { error } = await supabaseAdmin
    .from("pedidos")
    .update({ estado })
    .eq("id", id);

  if(error){
    console.error(error);
    return false;
  }

  return true;
}