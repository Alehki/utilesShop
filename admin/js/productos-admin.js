import { obtenerProductos, actualizarProducto, crearProducto } from "./productos/productos-api.js";

import { renderProductos, actualizarProductoEnUI } from "./productos/productos-ui.js";

import { suscribirseProductos } from "./productos/productos-realtime.js";

console.log("ADMIN PRODUCTOS");

async function cargarProductos() {

  console.log("🔄 RECARGANDO PRODUCTOS...");

  const productos = await obtenerProductos();

  console.log("📦 Productos recibidos:", productos);

  renderProductos(productos);

}

window.guardarProducto = async function(id) {
  const precio = document.getElementById(`precio-${id}`).value;
  const stock = document.getElementById(`stock-${id}`).value;
  const activo = document.getElementById(`activo-${id}`).checked;

  const ok = await actualizarProducto(id, {
    precio: Number(precio),
    stock: Number(stock),
    activo
  });

  if(!ok){
    alert("Error al guardar");
    return;
  }

};

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

  const ok = await crearProducto({
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
  });

  if(!ok){
    alert("Error al crear producto");
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

suscribirseProductos((payload) => {

  console.log("🔥 CAMBIO DETECTADO:", payload);

  const { eventType, new: nuevo, old: viejo } = payload;

  if(eventType === "UPDATE"){
    actualizarProductoEnUI(nuevo);
  }

  if(eventType === "INSERT"){
    cargarProductos();
  }

  if(eventType === "DELETE"){

    const el = document.getElementById(`producto-${viejo.id}`);

    if(el){
      el.remove();
    }

  }

});

cargarProductos();