import { supabaseAdmin } from "../config/supabase.js";

export function suscribirsePedidos(onCambio){

  console.log("🚀 Suscribiendo pedidos...");

  const channel = supabaseAdmin
    .channel("admin-pedidos")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "pedidos"
      },
      onCambio
    )
    .subscribe((status) => {
      console.log("📡 Estado pedidos:", status);
    });

  return channel;
}