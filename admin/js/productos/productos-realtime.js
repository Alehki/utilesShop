import { supabaseAdmin } from "../config/supabase.js";

export function suscribirseProductos(callback){

  return supabaseAdmin
    .channel("productos-realtime")
    .on(
      "postgres_changes",
      {
        event:"*",
        schema:"public",
        table:"productos"
      },
      callback
    )
    .subscribe();

}