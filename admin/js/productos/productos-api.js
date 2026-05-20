import { supabaseAdmin } from "../config/supabase.js";

export async function obtenerProductos() {

  const { data, error } = await supabaseAdmin
    .from("productos")
    .select("*")
    .order("id", { ascending:false });

  if(error){
    console.error(error);
    return [];
  }

  return data;

}

export async function actualizarProducto(id, datos){

  const { error } = await supabaseAdmin
    .from("productos")
    .update(datos)
    .eq("id", id);

  if(error){
    console.error(error);
    return false;
  }

  return true;

}

export async function crearProducto(producto){

  const { error } = await supabaseAdmin
    .from("productos")
    .insert([producto]);

  if(error){
    console.error(error);
    return false;
  }

  return true;

}