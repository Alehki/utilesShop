console.log("ADMIN PRODUCTOS");

// const supabaseAdmin = window.supabase.createClient(

//   "https://jtumqhpuegqzmkgeofxw.supabase.co",
//   "sb_publishable_7a6K3_VDHdqvyQhnj-0Cag_uyH7MlFw"
  
// );

// async function cargarProductos() {
//   const { data, error } = await supabaseAdmin
//     .from("productos")
//     .select("*")
//     .order("id", { ascending: false });

//   if (error) {
//     console.error(error);
//     return;
//   }

//   renderProductos(data);
// }

async function cargarProductos() {
  console.log("🔄 RECARGANDO PRODUCTOS...");

  const { data, error } = await supabaseAdmin
    .from("productos")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  console.log("📦 Productos recibidos:", data);

  renderProductos(data);
}

function renderProductos(productos) {
  const container = document.getElementById("lista-productos");

  // 🔥 limpiar contenido sin romper referencias
  container.innerHTML = "";

  productos.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.id = `producto-${p.id}`;

    div.innerHTML = `
      <div class="producto-info">

        <div class="producto-datos">
          <div class="producto-nombre">${p.nombre}</div>

          <div class="campo">
            <label>Precio</label>
            <input type="number" value="${p.precio}" id="precio-${p.id}">
          </div>

          <div class="campo">
            <label>Stock</label>
            <input type="number" value="${p.stock ?? 0}" id="stock-${p.id}">
          </div>

          <div class="campo-checkbox">
            <label>Activo</label>
            <input type="checkbox" ${p.activo ? "checked" : ""} id="activo-${p.id}">
          </div>

        </div>

      </div>

      <div class="producto-acciones">
        <button onclick="guardarProducto('${p.id}')">
          Guardar
        </button>
      </div>
    `;

    container.appendChild(div);
  });
}

window.guardarProducto = async function(id) {
  const precio = document.getElementById(`precio-${id}`).value;
  const stock = document.getElementById(`stock-${id}`).value;
  const activo = document.getElementById(`activo-${id}`).checked;

  const { error } = await supabaseAdmin
    .from("productos")
    .update({
      precio: Number(precio),
      stock: Number(stock),
      activo
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Error al guardar");
    return;
  }

};

let timeoutProductos = null;

function suscribirseProductos() {
  console.log("🚀 Iniciando suscripción realtime...");

  const channel = supabaseAdmin
    .channel("productos-realtime");

  console.log("🧪 Probando canal realtime...");

  channel
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "productos"
      },
      (payload) => {
        console.log("🔥🔥🔥 EVENTO RECIBIDO");
        console.log("🔥 CAMBIO DETECTADO:", payload);

        const { eventType, new: nuevo, old: viejo } = payload;

        if (eventType === "UPDATE") {
          actualizarProductoEnUI(nuevo);
        }

        if (eventType === "INSERT") {
          console.log("➕ Producto nuevo, recargando...");
          cargarProductos();
        }

        if (eventType === "DELETE") {
          const el = document.getElementById(`producto-${viejo.id}`);
          if (el) el.remove();
        }
      }
    )
    .subscribe((status) => {
      console.log("📡 Estado realtime:", status);
    });

  return channel;
}

function actualizarProductoEnUI(producto) {
  const precioInput = document.getElementById(`precio-${producto.id}`);
  const stockInput = document.getElementById(`stock-${producto.id}`);
  const activoInput = document.getElementById(`activo-${producto.id}`);

  if (precioInput) {
    precioInput.value = producto.precio;
    precioInput.style.background = "#d4ffd4";
  }

  if (stockInput) {
    stockInput.value = producto.stock;
    stockInput.style.background = "#d4ffd4";
  }

  if (activoInput) {
    activoInput.checked = producto.activo;
  }

  setTimeout(() => {
    if (precioInput) precioInput.style.background = "";
    if (stockInput) stockInput.style.background = "";
  }, 500);

  console.log("✅ UI ACTUALIZADA:", producto.id);
}

// Agregar producto js
window.crearProducto = async function() {

  const nombre = document.getElementById("nuevo-nombre").value;

  const precio = Number(
    document.getElementById("nuevo-precio").value
  );

  const stock = Number(
    document.getElementById("nuevo-stock").value
  );

  const categoria = document.getElementById("nuevo-categoria").value;

  const img = document.getElementById("nuevo-img").value;

  const imagenes = document
    .getElementById("nuevo-imagenes")
    .value
    .split(",")
    .map(i => i.trim());

  const colores = document
    .getElementById("nuevo-colores")
    .value
    .split(",")
    .map(c => c.trim());

  const tags = document
    .getElementById("nuevo-tags")
    .value
    .split(",")
    .map(t => t.trim());

  const destacado = document.getElementById("nuevo-destacado").checked;

  const activo = document.getElementById("nuevo-activo").checked;

  const { error } = await window.supabaseAdmin
    .from("productos")
    .insert([
      {
        nombre,
        precio,
        stock,
        categoria,
        img,
        imagenes,
        colores,
        tags,
        destacado,
        activo
      }
    ]);

  if(error){
    console.error("ERROR COMPLETO:", error);
    alert(error.message);
    return;
  }

  alert("Producto creado");

}

window.mostrarVista = function(id){

  document.querySelectorAll(".vista").forEach(vista => {
    vista.classList.add("oculto");
  });

  document.getElementById(id).classList.remove("oculto");

}

// 

cargarProductos();
suscribirseProductos();