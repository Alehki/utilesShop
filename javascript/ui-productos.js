
import { normalizarTexto } from "./utils.js";

export function renderSeccion(listaProductos, contenedor, carrito, textoFiltro = "") {
  contenedor.innerHTML = "";

  const textoNormalizado = normalizarTexto(textoFiltro);

  const productosFiltrados = listaProductos.filter(p => {
    const nombre = normalizarTexto(p.nombre || "");
    const colores = normalizarTexto((p.colores || []).join(" "));
    const tags = normalizarTexto((p.tags || []).join(" "));

    const textoCompleto = nombre + " " + colores + " " + tags;

    return textoCompleto.includes(textoNormalizado);
  });

  let html = "";

  productosFiltrados.forEach(p => {
    const cant = Object.values(carrito)
      .filter(item => item.id === p.id)
      .reduce((acc, item) => acc + item.cantidad, 0);

    html += `
      <div class="card" id="producto-${p.id}" onclick="abrirProducto(${p.id})">
        <img src="${p.img}" loading="lazy">
        <h3>${p.nombre}</h3>
        <div class="precio">$${p.precio}</div>

        <div class="controles">
          ${
            cant === 0
              ? `<button onclick="event.stopPropagation(); agregarDesdeCard(${p.id})">Agregar</button>`
              : `
                ${
                  cant === 1
                    ? `<button class="btn-icon danger" onclick="event.stopPropagation(); eliminarDesdeCard(${p.id})">
                        <svg viewBox="0 0 24 24">
                          <path d="M9 3h6M4 7h16M6 7l1 14h10l1-14"/>
                        </svg>
                      </button>`
                    : `<button class="btn-icon" onclick="event.stopPropagation(); restar(${p.id})">
                        <svg viewBox="0 0 24 24">
                          <path d="M5 12h14"/>
                        </svg>
                      </button>`
                }
                <span>${cant}</span>
                <button class="btn-icon primary" onclick="event.stopPropagation(); agregarDesdeCard(${p.id})">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </button>
              `
          }
        </div>
      </div>
    `;
  });

  contenedor.innerHTML = html;

  return productosFiltrados.length;
}


export function renderDestacados(TODOS_LOS_PRODUCTOS, carrito, vistaActual) {
  if (vistaActual !== "categorias") return;

  const contenedor = document.getElementById("destacadosContainer");
  if (!contenedor) return;

  const destacados = TODOS_LOS_PRODUCTOS.filter(p => p.destacado === true);

  let html = "";

  destacados.forEach(p => {
    const cant = Object.values(carrito)
      .filter(item => item.id === p.id)
      .reduce((acc, item) => acc + item.cantidad, 0);

    html += `
      <div class="card" id="producto-${p.id}" onclick="abrirProducto(${p.id})">
        <img src="${p.img}" loading="lazy">
        <h3>${p.nombre}</h3>
        <div class="precio">$${p.precio}</div>

        <div class="controles">
          ${
            cant === 0
              ? `<button onclick="event.stopPropagation(); agregarDesdeCard(${p.id})">Agregar</button>`
              : `
                ${
                  cant === 1
                    ? `<button class="btn-icon danger" onclick="event.stopPropagation(); eliminarDesdeCard(${p.id})">
                        <svg viewBox="0 0 24 24">
                          <path d="M9 3h6M4 7h16M6 7l1 14h10l1-14"/>
                        </svg>
                      </button>`
                    : `<button class="btn-icon" onclick="event.stopPropagation(); restar(${p.id})">
                        <svg viewBox="0 0 24 24">
                          <path d="M5 12h14"/>
                        </svg>
                      </button>`
                }
                <span>${cant}</span>
                <button class="btn-icon primary" onclick="event.stopPropagation(); agregarDesdeCard(${p.id})">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </button>
              `
          }
        </div>
      </div>
    `;
  });

  contenedor.innerHTML = html;
}