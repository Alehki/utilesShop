
import { agregarItem, restarItem, calcularTotalDesde } from "./carrito-core.js";
document.addEventListener("DOMContentLoaded", () => {

  let vistaActual = "categorias";
  let categoriaActiva = null;


  window.onerror = function (msg, url, line, col, error) {
    alert("Error: " + msg + " en línea: " + line);
  };

  const logoBtn = document.getElementById("logoBtn");

  logoBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  /* funciones para las categorias */
  function obtenerCategorias() {
    const categoriasUnicas = new Set(
      TODOS_LOS_PRODUCTOS.map(p => p.categoria)
    );

    return Array.from(categoriasUnicas).map(cat => ({
      id: cat,
      nombre: cat.charAt(0).toUpperCase() + cat.slice(1)
    }));
  }

  function renderCategorias() {
    main.innerHTML = `
      <h2 class="titulo-seccion">Categorías</h2>
      <div class="grid-categorias" id="gridCategorias"></div>
    `;

    const grid = document.getElementById("gridCategorias");

    const categorias = obtenerCategorias();

    categorias.forEach(cat => {
      const card = document.createElement("div");
      card.className = "card-categoria";

    card.innerHTML = `
      <div class="categoria-img">
        <img src="assets/categorias/${cat.id}.webp" alt="${cat.nombre}">
      </div>

      <div class="categoria-info">
        <span class="categoria-nombre">${cat.nombre}</span>
        <span class="categoria-arrow">›</span>
      </div>
    `;

      card.addEventListener("click", () => {
        vistaActual = "productos";
        categoriaActiva = cat.id;
        renderTodo();
      });

      grid.appendChild(card);
    });
  }

  function renderProductosCategoria(categoria) {

    vistaActual = "productos";
    categoriaActiva = categoria;

    main.innerHTML = `
      <div class="header-categoria">
        <button class="btn-volver">← Volver</button>
        <h2 class="titulo-seccion">${categoria}</h2>
      </div>
      <div id="contenedorProductos" class="productos"></div>
    `;

    document.querySelector(".btn-volver").addEventListener("click", () => {
      vistaActual = "categorias";
      categoriaActiva = null;
      renderTodo();
    });

    const contenedor = document.getElementById("contenedorProductos");

    const productosFiltrados = TODOS_LOS_PRODUCTOS.filter(
      p => p.categoria === categoria
    );

    renderSeccion(productosFiltrados, contenedor, textoBusqueda);
  }

  const libreria = [
    { id: 1, nombre: "Resaltadores", precio: 1200, categoria: "libreria", img: "assets/resaltadores/resaltador_1.webp", imagenes: ["assets/resaltadores/resaltador_1.webp","assets/resaltadores/resaltador_2.webp", "assets/resaltadores/resaltador_3.webp" ], colores: ["Amarillo", "Verde", "Rosa"], tags: ["libro", "estudio", "escuela", "apunte"] },
    { id: 2, nombre: "Fibras", precio: 2100, categoria: "libreria", img: "assets/fibras/fibras_1.webp", imagenes: ["assets/fibras/fibras_1.webp", "assets/fibras/fibras_2.webp", "assets/fibras/fibras_3.webp" ] },
    { id: 3, nombre: "Goma de Borrar", precio: 900, categoria: "libreria", img: "assets/goma_de_borrar/goma_1.webp", imagenes: ["assets/goma_de_borrar/goma_1.webp", "assets/goma_de_borrar/goma_2.webp", "assets/goma_de_borrar/goma_3.webp" ] },
    { id: 4, nombre: "Lapicera Azul Bic", precio: 1200,categoria: "libreria", destacado: true, img: "assets/lapicera_azul_bic/lapicera_azul_bic_1.webp",imagenes: ["assets/lapicera_azul_bic/lapicera_azul_bic_1.webp", "assets/lapicera_azul_bic/lapicera_azul_bic_2.webp", "assets/lapicera_azul_bic/lapicera_azul_bic_3.webp" ] },
    { id: 5, nombre: "Lapicera Azul Filgo", precio: 1200,categoria: "libreria", img: "assets/lapicera_azul_filgo/lapicera_azul_filgo_1.webp",imagenes: ["assets/lapicera_azul_filgo/lapicera_azul_filgo_1.webp", "assets/lapicera_azul_filgo/lapicera_azul_filgo_2.webp", "assets/lapicera_azul_filgo/lapicera_azul_filgo_3.webp" ] },
    { id: 6, nombre: "Lapicera Negro Bic", precio: 1200, categoria: "libreria", destacado: true, img: "assets/lapicera_negro_bic/lapicera_negra_bic_1.webp", imagenes: ["assets/lapicera_negro_bic/lapicera_negra_bic_1.webp", "assets/lapicera_negro_bic/lapicera_negra_bic_2.webp", "assets/lapicera_negro_bic/lapicera_negra_bic_3.webp" ] },
    { id: 7, nombre: "Lapices de color x 24", precio: 1200,categoria: "libreria", img: "assets/lapices_de_color_x24/lapices_de_colorx24_1.webp", imagenes: ["assets/lapices_de_color_x24/lapices_de_colorx24_1.webp", "assets/lapices_de_color_x24/lapices_de_colorx24_2.webp", "assets/lapices_de_color_x24/lapices_de_colorx24_3.webp" ] },
    { id: 8, nombre: "Lapiz con brillos", precio: 1200, categoria: "libreria",img: "assets/lapiz_brillo/lapiz_brillo_1.webp", imagenes: ["assets/lapiz_brillo/lapiz_brillo_1.webp", "assets/lapiz_brillo/lapiz_brillo_2.webp", "assets/lapiz_brillo/lapiz_brillo_3.webp" ] },
    { id: 9, nombre: "Cuadernillo universitario cuadriculado", precio: 1200,categoria: "libreria", img: "assets/cuadernillo_universitario_cuadriculado/cuadernillo_cuadriculado_1.webp", imagenes: ["assets/cuadernillo_universitario_cuadriculado/cuadernillo_cuadriculado_1.webp", "assets/cuadernillo_universitario_cuadriculado/cuadernillo_cuadriculado_2.webp", "assets/cuadernillo_universitario_cuadriculado/cuadernillo_cuadriculado_3.webp" ], tags: ["libro", "hojas", "estudio", "escuela"] },
    { id: 10, nombre: "Cuadernillo universitario rayado", precio: 1200,categoria: "libreria", img: "assets/cuadernillo_universitario_rayado/cuadernillo_rayado_1.webp", imagenes: ["assets/cuadernillo_universitario_rayado/cuadernillo_rayado_1.webp", "assets/cuadernillo_universitario_rayado/cuadernillo_rayado_2.webp", "assets/cuadernillo_universitario_rayado/cuadernillo_rayado_3.webp" ], tags: ["libro", "hojas", "estudio", "escuela"] },
    { id: 11, nombre: "Liqui", precio: 2100, categoria: "libreria", img: "assets/liqui/liqui_1.webp", imagenes: ["assets/liqui/liqui_1.webp", "assets/liqui/liqui_2.webp", "assets/liqui/liqui_3.webp" ] },
    { id: 12, nombre: "Liqui Filgo", precio: 2100, categoria: "libreria", destacado: true, img: "assets/liqui_filgo/liqui_filgo_1.webp", imagenes: ["assets/liqui_filgo/liqui_filgo_1.webp", "assets/liqui_filgo/liqui_filgo_2.webp", "assets/liqui_filgo/liqui_filgo_3.webp" ] },
    { id: 13, nombre: "Sacapuntas económico", precio: 2100,categoria: "libreria", img: "assets/sacapuntas_barat/sacapuntas_economico_1.webp", imagenes: ["assets/sacapuntas_barat/sacapuntas_economico_1.webp", "assets/sacapuntas_barat/sacapuntas_economico_2.webp", "assets/sacapuntas_barat/sacapuntas_economico_3.webp" ] },
    { id: 14, nombre: "Sacapuntas", precio: 2100, categoria: "libreria", destacado: true, img: "assets/sacapuntas_caro/sacapuntas_1.webp", imagenes: ["assets/sacapuntas_caro/sacapuntas_1.webp", "assets/sacapuntas_caro/sacapuntas_2.webp", "assets/sacapuntas_caro/sacapuntas_3.webp" ] },
    { id: 15, nombre: "lapiz negro (amarillo)", precio: 2100,categoria: "libreria", img: "assets/lapiz_negro_(amarillo)/lapiz_negro_(amarillo)_1.webp", imagenes: ["assets/lapiz_negro_(amarillo)/lapiz_negro_(amarillo)_1.webp", "assets/lapiz_negro_(amarillo)/lapiz_negro_(amarillo)_2.webp", "assets/lapiz_negro_(amarillo)/lapiz_negro_(amarillo)_3.webp" ] },
    { id: 16, nombre: "lapiz negro (rojo)", precio: 2100, categoria: "libreria",img: "assets/lapiz_negro_(rojo)/lapiz_negro_(rojo)_1.webp", imagenes: ["assets/lapiz_negro_(rojo)/lapiz_negro_(rojo)_1.webp", "assets/lapiz_negro_(rojo)/lapiz_negro_(rojo)_2.webp", "assets/lapiz_negro_(rojo)/lapiz_negro_(rojo)_3.webp" ] },
  ];

  const otrosProductos = [
    { id: 17, nombre: "Rolito 10kg", precio: 9500,categoria: "hielo", img: "assets/rolito/rolito_10k_1.webp", imagenes: ["assets/rolito/rolito_10k_1.webp", "assets/rolito/rolito_10k_2.webp", "assets/rolito/rolito_10k_3.webp" ], tags: ["hielo"] },
  ]

  const almacen = [
    { id: 18, nombre: "Rolito 10kg", precio: 9500,categoria: "almacen", img: "assets/rolito/rolito_10k_1.webp", imagenes: ["assets/rolito/rolito_10k_1.webp", "assets/rolito/rolito_10k_2.webp", "assets/rolito/rolito_10k_3.webp" ], tags: ["hielo"] },
  ]

  const bebidas = [
    { id: 19, nombre: "Rolito 10kg", precio: 9500,categoria: "bebidas", destacado: true, img: "assets/rolito/rolito_10k_1.webp", imagenes: ["assets/rolito/rolito_10k_1.webp", "assets/rolito/rolito_10k_2.webp", "assets/rolito/rolito_10k_3.webp" ], tags: ["hielo"] },
  ]

  const TODOS_LOS_PRODUCTOS = [...libreria, ...otrosProductos, ...almacen, ...bebidas];

  const listas = {
    libreria: libreria,
    otrosProductos: otrosProductos,
    almacen: almacen,
    bebidas: bebidas,
  };

  let textoBusqueda = "";
  // Cargar carrito de forma segura
  let carritoGuardado = JSON.parse(localStorage.getItem("carrito"));

  if (!carritoGuardado || typeof carritoGuardado !== "object" || Array.isArray(carritoGuardado)) {
    carritoGuardado = {};
  }

  let carrito = carritoGuardado;


  let idEliminar = null;

  window.abrirProducto = abrirProducto;


  /* DOM */
  // const productosDiv = document.getElementById("productos");
  const carritoCount = document.getElementById("carritoCount");
  const modalCarrito = document.getElementById("modalCarrito");
  const carritoItems = document.getElementById("carrito-items");
  const totalSpan = document.getElementById("total");
  const modalResumen = document.getElementById("modalResumen");
  const resumenPedido = document.getElementById("resumenPedido");
  const toast = document.getElementById("toast");

  const main = document.getElementById("mainContenido");
  /* probando */
  // const otrosProductosDiv = document.getElementById("otrosProductos");

  /* para el boton del footer */
  const mobileCartBar = document.getElementById("mobileCartBar");
  const mobileCartCantidad = document.getElementById("mobileCartCantidad");
  const mobileCartTotal = document.getElementById("mobileCartTotal");
  const mobileCartBtn = document.getElementById("mobileCartBtn");

  /* abrir modal cards */

  const modalProducto = document.getElementById("modalProducto");
  const productoImagen = document.getElementById("productoImagen");
  const productoNombre = document.getElementById("productoNombre");
  const productoPrecio = document.getElementById("productoPrecio");
  const productoAgregar = document.getElementById("productoAgregar");

  const galeria = document.querySelector(".producto-galeria");

  /* referencias del modal que aparece al apretar click al carrito es para el boton */

  const productoCantidad = document.getElementById("productoCantidad");
  const productoCantidadValor = document.getElementById("productoCantidadValor");
  const productoMas = document.getElementById("productoMas");
  const productoMenos = document.getElementById("productoMenos");

  // --- MODAL COLORES ---
  const modalColores = document.getElementById("modalColores");
  const listaColores = document.getElementById("listaColores");
  const cerrarColores = document.getElementById("cerrarColores");
  const btnElegirColores = document.getElementById("btnElegirColores");
  const colorSeleccionadoInfo = document.getElementById("colorSeleccionadoInfo");



  let imagenActual = 0;
  let productoActivo = null;
  let coloresSeleccionados = {};

  const COMPRA_MINIMA = 10000;
  const HORARIO_APERTURA = 9;   // 9 AM
  const HORARIO_CIERRE = 18;   // 18 PM


  /* UTILS */

  // function guardar() {
  //   persistirCarrito();
  //   sincronizarUI();
  // }

  function guardar() {
    persistirCarrito();

    actualizarCount();       // carrito arriba
    renderCarrito();         // modal carrito (total + botón)

    if (vistaActual === "productos") {
      renderProductosCategoria(categoriaActiva); // cards
    }

    if (vistaActual === "categorias") {
      renderDestacados(); // home
    }
  }

  function persistirCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function sincronizarUI() {
    renderTodo();
    actualizarCount();
    actualizarBotonRevisar();
  }

  function normalizarTexto(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")                // separa letras y tildes
      .replace(/[\u0300-\u036f]/g, ""); // elimina tildes
  }

  function renderTodo() {
    const carousel = document.getElementById("carouselSection");
    const hero = document.querySelector(".hero");
    const destacados = document.querySelector(".seccion-destacados");

    if (vistaActual === "categorias") {

      carousel?.classList.remove("hidden");
      hero?.classList.remove("hidden");
      destacados?.classList.remove("hidden");

      renderCategorias();
      renderDestacados(); // 👈 SOLO ACÁ

    } else if (vistaActual === "productos") {

      carousel?.classList.add("hidden");
      hero?.classList.add("hidden");
      destacados?.classList.add("hidden");

      renderProductosCategoria(categoriaActiva);
    }
  }


  function mostrarResumenSeleccion() {
    if (!productoActivo) return;

    const contenedor = document.getElementById("colorSeleccionadoInfo");

    let totalConfirmado = 0;
    let totalPendiente = 0;
    let detalle = [];

    /* NOTA: EL "?" DELANTE DE COLORES VA PORQUE LAS CARDS PUEDEN O NO TENER COLORES, SI TUVIERA QUE EXISTIR 
    SI O SI EL COLOR TRAERIA PROBLEMAS. PERO PARA NUESTRO CASO VA DE 10. */
    productoActivo.colores?.forEach(color => {
      const key = `${productoActivo.id}_${color}`;

      const confirmado = carrito[key]?.cantidad || 0;
      const pendiente = coloresSeleccionados[color] || 0;

      if (confirmado > 0) {
        totalConfirmado += confirmado;
        detalle.push(`${confirmado} ${color}`);
      }

      if (pendiente > 0) {
        totalPendiente += pendiente;
      }
    });

    if (totalConfirmado === 0 && totalPendiente === 0) {
      contenedor.classList.add("hidden");
      contenedor.textContent = "";
      return;
    }

    // 🔴 Hay cambios sin confirmar
    if (totalPendiente > 0) {
      contenedor.innerHTML = `
        <span style="color:red;">❌ Cambios sin agregar</span><br>
        Tenés ${totalConfirmado} en carrito.<br>
        + ${totalPendiente} pendientes.
      `;
    } else {
      // 🟢 Todo confirmado
      contenedor.innerHTML = `
        <span style="color:green;">✔ Agregado al carrito</span><br>
        ${totalConfirmado} producto${totalConfirmado !== 1 ? "s" : ""} confirmados.
      `;
    }

    contenedor.classList.remove("hidden");
  }




  function actualizarCount() {
    const { cantidad, total } = obtenerResumenCarrito(carrito);

    carritoCount.textContent = cantidad;

    const carritoAbierto = !modalCarrito.classList.contains("hidden");

    if (cantidad > 0 && !carritoAbierto) {
      mobileCartBar.classList.add("show");
      mobileCartCantidad.textContent =
        cantidad === 1 ? "1 producto" : `${cantidad} productos`;
      mobileCartTotal.textContent = `$${total}`;
    } else {
      mobileCartBar.classList.remove("show");
    }

    const btnCarrito = document.getElementById("btnCarrito");
    btnCarrito.classList.toggle("disabled", cantidad === 0);
  }


  /* 2 funciones nuevas para bloquear scroll */
  function bloquearScroll() {
    document.body.style.overflow = "hidden";
  }

  function habilitarScroll() {
    document.body.style.overflow = "";
  }

  function actualizarScrollGlobal() {
    const hayModalAbierta = document.querySelector(".modal:not(.hidden)");

    if (hayModalAbierta) {
      bloquearScroll();
    } else {
      habilitarScroll();
    }
  }

  function abrirProducto(id, forzarColor = false) {
    
    productoActivo = Object
      .values(listas)
      .flat()
      .find(p => p.id === id);


    if (!productoActivo) return;

    imagenActual = 0;
    coloresSeleccionados = {};

    cambiarImagen(0);

    productoNombre.textContent = productoActivo.nombre;
    productoPrecio.textContent = `$${productoActivo.precio}`;

    const colorContainer = document.getElementById("colorContainer");
    const errorColor = document.getElementById("errorColor");

    if (productoActivo.colores && productoActivo.colores.length > 0) {
      colorContainer.classList.remove("hidden");
      btnElegirColores.classList.remove("hidden");

      if (forzarColor) {
        errorColor.classList.remove("hidden");
      } else {
        errorColor.classList.add("hidden");
      }
    } else {
      colorContainer.classList.add("hidden");
      errorColor.classList.add("hidden");
    }

    actualizarAccionesProducto(); // 👈 ÚNICO lugar que decide el botón

    mostrarResumenSeleccion()

    modalProducto.classList.remove("hidden");
    bloquearScroll();
  }







  const colorSelect = document.getElementById("colorSelect");

  if (colorSelect) {
    colorSelect.addEventListener("change", () => {
      document.getElementById("errorColor").classList.add("hidden");
      actualizarAccionesProducto();
    });
  }


  function manejarSwipe() {
    const diff = endX - startX;

    if (Math.abs(diff) < 50) return;

    let nuevoIndex;

    if (diff < 0) {
      // swipe izquierda → siguiente
      nuevoIndex =
        (imagenActual + 1) % productoActivo.imagenes.length;
    } else {
      // swipe derecha → anterior
      nuevoIndex =
        (imagenActual - 1 + productoActivo.imagenes.length) %
        productoActivo.imagenes.length;
    }

    cambiarImagen(nuevoIndex);
  }


  function renderIndicadores() {
    const cont = document.getElementById("galeriaIndicadores");
    cont.innerHTML = "";

    productoActivo.imagenes.forEach((_, index) => {
      const dot = document.createElement("span");
      if (index === imagenActual) dot.classList.add("active");
      cont.appendChild(dot);
    });
  }

  function cambiarImagen(nuevoIndex) {
    if (!productoActivo) return;

    productoImagen.style.opacity = "0";

    setTimeout(() => {
      imagenActual = nuevoIndex;
      productoImagen.src = productoActivo.imagenes[imagenActual];
      renderIndicadores();
      productoImagen.style.opacity = "1";
    }, 200);
  }

  function actualizarAccionesProducto() {
    if (!productoActivo) return;

    const tieneColores =
      productoActivo.colores && productoActivo.colores.length > 0;

    const hayColoresElegidos =
      Object.keys(coloresSeleccionados).length > 0;

    const totalEnCarrito = Object.values(carrito)
      .filter(p => p.id === productoActivo.id)
      .reduce((acc, p) => acc + p.cantidad, 0);


    // =========================
    // 🟣 PRODUCTO CON COLORES
    // =========================
    if (tieneColores) {

      // Nunca mostrar contador
      productoCantidad.classList.add("hidden");
      productoAgregar.classList.remove("hidden");

      productoAgregar.textContent = "Agregar al carrito";

      // Habilitar botón solo si eligió colores
      if (hayColoresElegidos) {
        productoAgregar.disabled = false;
        productoAgregar.classList.remove("disabled");
      } else {
        productoAgregar.disabled = true;
        productoAgregar.classList.add("disabled");
      }

      return; // ⛔ Cortamos acá para que no ejecute la lógica de abajo
    }

    // =========================
    // 🔵 PRODUCTO SIN COLORES
    // =========================

    productoAgregar.disabled = false;
    productoAgregar.classList.remove("disabled");

    if (totalEnCarrito > 0) {
      productoAgregar.classList.add("hidden");
      productoCantidad.classList.remove("hidden");
      productoCantidadValor.textContent = totalEnCarrito;
      if (totalEnCarrito === 1) {
        productoMenos.textContent = "🗑";
      } else {
        productoMenos.textContent = "−";
      }
    } else {
      productoAgregar.classList.remove("hidden");
      productoCantidad.classList.add("hidden");
      productoCantidadValor.textContent = 1;
    }

  }



  function actualizarCardProducto(id) {
  const card = document.getElementById(`producto-${id}`);
  if (!card) return;

  const p = TODOS_LOS_PRODUCTOS.find(prod => prod.id === id);
  if (!p) return;
  const cant = Object.values(carrito)
    .filter(item => item.id === id)
    .reduce((acc, item) => acc + item.cantidad, 0);

  const controles = `
    ${
      cant === 0
        ? `<button onclick="event.stopPropagation(); agregarDesdeCard(${id})">Agregar</button>`
        : `
          <button onclick="event.stopPropagation(); restar(${id})">−</button>
          <span>${cant}</span>
          <button onclick="event.stopPropagation(); agregarDesdeCard(${id})">+</button>
        `
    }
  `;

  const controlesDiv = card.querySelector(".controles");
  controlesDiv.innerHTML = controles;
}


  /*  */
  // ================= CARRUSEL PRO =================
const track = document.querySelector(".carousel-track");
let slides = document.querySelectorAll(".slide");
const nextButton = document.querySelector(".right");
const prevButton = document.querySelector(".left");
const dotsNav = document.querySelector(".dots");

let index = 1;
let isAnimating = false;
let autoplayTimeout;

/* Clonar primera y última */
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

slides = document.querySelectorAll(".slide");

/* Posición inicial en porcentaje */
track.style.transform = `translateX(-${index * 100}%)`;
updateActiveSlide();

/* Crear dots */
dotsNav.innerHTML = "";
for (let i = 0; i < slides.length - 2; i++) {
  const dot = document.createElement("span");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");

  dot.addEventListener("click", () => {
    moveToSlide(i + 1);
    resetAutoplay();
  });

  dotsNav.appendChild(dot);
}

const dots = document.querySelectorAll(".dot");

function updateDots() {
  dots.forEach(dot => dot.classList.remove("active"));

  let realIndex = index - 1;

  if (realIndex < 0) realIndex = dots.length - 1;
  if (realIndex >= dots.length) realIndex = 0;

  dots[realIndex].classList.add("active");
}

function updateActiveSlide() {

  slides.forEach(slide => slide.classList.remove("active"));

  slides[index].classList.add("active");

  // sincronizar clones
  if (index === 1) {
    slides[slides.length - 1].classList.add("active"); 
  }

  if (index === slides.length - 2) {
    slides[0].classList.add("active");
  }

}

function moveToSlide(newIndex) {
  if (isAnimating) return;

  isAnimating = true;

  const maxIndex = slides.length - 2;

  if (newIndex > maxIndex) {

    track.style.transition = "none";
    index = 0;
    track.style.transform = `translateX(-${index * 100}%)`;

    requestAnimationFrame(() => {
      track.style.transition = "transform 0.5s ease-in-out";
      index = 1;
      track.style.transform = `translateX(-${index * 100}%)`;
      updateDots();
      updateActiveSlide();
    });

    return;
  }

  index = newIndex;

  track.style.transition = "transform 0.5s ease-in-out";
  track.style.transform = `translateX(-${index * 100}%)`;

  updateDots();
  updateActiveSlide();
}

/* Flechas */
nextButton.addEventListener("click", () => {
  moveToSlide(index + 1);
  resetAutoplay();
});

prevButton.addEventListener("click", () => {
  moveToSlide(index - 1);
  resetAutoplay();
});

/* Loop infinito limpio */
track.addEventListener("transitionend", () => {
  isAnimating = false;
});

/* Autoplay */
function startAutoplay() {
  autoplayTimeout = setTimeout(() => {
    moveToSlide(index + 1);
    startAutoplay();
  }, 4000);
}

function resetAutoplay() {
  clearTimeout(autoplayTimeout);
  startAutoplay();
}

startAutoplay();

/* Swipe móvil */
let startXX = 0;

track.addEventListener("touchstart", e => {
  startXX = e.touches[0].clientX;
});

track.addEventListener("touchend", e => {
  let endX = e.changedTouches[0].clientX;

  if (startXX - endX > 50) {
    moveToSlide(index + 1);
    resetAutoplay();
  }

  if (endX - startXX > 50) {
    moveToSlide(index - 1);
    resetAutoplay();
  }
});

track.addEventListener("click", () => {
  moveToSlide(index + 1);
  resetAutoplay();
});

  /* logica de horarios */

  function estaAbierto() {
    const ahora = new Date();
    const hora = ahora.getHours();

    // ajustá tu horario acá
    return hora >= 0 && hora < 24;
  }


  function actualizarEstadoHorario() {
    const headerMsg = document.getElementById("mensajeHorario");

    if (estaAbierto()) {
      document.body.classList.remove("tienda-cerrada");
      headerMsg.classList.add("hidden");
    } else {
      document.body.classList.add("tienda-cerrada");
      headerMsg.classList.remove("hidden");
    }
  }

  function calcularTotal() {
    return calcularTotalDesde(carrito);
  }

  function obtenerResumenCarrito(carritoActual) {
    return Object.values(carritoActual).reduce(
      (acc, p) => {
        acc.cantidad += p.cantidad;
        acc.total += p.precio * p.cantidad;
        return acc;
      },
      { cantidad: 0, total: 0 }
    );
  }

  function puedeRevisarPedido() {
    const direccion = document.getElementById("direccion").value.trim();
    const metodoPago = document.getElementById("metodoPago").value;
    const total = calcularTotal();

    if (!estaAbierto()) return false;
    if (total < COMPRA_MINIMA) return false;
    if (!direccion) return false;
    if (!metodoPago) return false;

    return true;
  }




  function actualizarBotonRevisar() {
    const btn = document.getElementById("revisarPedido");
    const direccion = document.getElementById("direccion").value.trim();
    const metodoPago = document.getElementById("metodoPago").value;
    const total = calcularTotal();

    let mensajes = [];

    if (!direccion) mensajes.push("Completá la dirección");
    if (!metodoPago) mensajes.push("Seleccioná un método de pago");

    if (total < COMPRA_MINIMA) {
      mensajes.push(`Agregá $${COMPRA_MINIMA - total} para poder pedir`);
    }

    if (!estaAbierto()) {
      mensajes.push("La tienda está cerrada");
    }

    if (mensajes.length === 0) {
      btn.disabled = false;
      btn.classList.remove("disabled");
      btn.removeAttribute("title");
    } else {
      btn.disabled = true;
      btn.classList.add("disabled");
      btn.title = mensajes.join(" · ");
    }

    console.log({
      total: calcularTotal(),
      direccion: direccionInput?.value,
      pago: metodoPagoSelect?.value,
      carrito: carrito.length
    });
  }

  window.agregarDesdeCarrito = function(key) {
    const item = carrito[key];
    if (!item) return;

    carrito = agregarItem(carrito, TODOS_LOS_PRODUCTOS, item.id, item.color, 1);
    guardar();
    renderCarrito();
  };


  window.restarDesdeCarrito = function(key) {
    const item = carrito[key];
    if (!item) return;

    if (item.cantidad === 1) {
      pedirEliminar(key);
      return;
    }

    carrito = restarItem(carrito, item.id, item.color, 1);
    guardar();
    renderCarrito();
  };




  function abrirModalColores() {
    if (!productoActivo || !productoActivo.colores) return;

    listaColores.innerHTML = "";

    productoActivo.colores.forEach(color => {
      const key = `${productoActivo.id}_${color}`;

      const cantidadEnCarrito = carrito[key]?.cantidad || 0;
      const cantidadSeleccionada = coloresSeleccionados[color] || 0;

      const cantidad = cantidadEnCarrito + cantidadSeleccionada;


      const fila = document.createElement("div");
      fila.className = "fila-color";

      let controlesHTML = "";

      if (cantidad === 0) {
        controlesHTML = `
          <button onclick="agregarColorDesdeModal('${color}')">
            Agregar
          </button>
        `;
      } else {
        controlesHTML = `
          <button onclick="restarColorDesdeModal('${color}')">−</button>
          <span>${cantidad}</span>
          <button onclick="agregarColorDesdeModal('${color}')">+</button>
        `;
      }

      fila.innerHTML = `
        <span>${productoActivo.nombre} (${color})</span>
        <div class="controles">
          ${controlesHTML}
        </div>
      `;

      listaColores.appendChild(fila);
    });

    modalColores.classList.remove("hidden");
  }


  window.restarColorDesdeModal = function(color) {
    if (!coloresSeleccionados[color]) return;

    coloresSeleccionados[color]--;

    if (coloresSeleccionados[color] <= 0) {
      delete coloresSeleccionados[color];
    }

    abrirModalColores();
    actualizarAccionesProducto();
    mostrarResumenSeleccion();
  };










  /* */


  function toastMsg(msg) {
    if(window.innerWidth<=768) return;
    if (mobileCartBar.classList.contains("show")) return;
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("hidden"), 1200);
  }

  // function mostrarAnimacionPedido() {
  //   const overlay = document.getElementById("pedidoOverlay");

  //   overlay.classList.remove("hidden");

  //   // forzar repaint
  //   overlay.offsetHeight;

  //   overlay.classList.add("active");
  // }

  function mostrarAnimacionPedido() {
    const overlay = document.getElementById("pedidoOverlay");
    const bolita = overlay.querySelector(".pedido-bolita");
    const sonido = document.getElementById("pedidoSound");

    overlay.classList.remove("active");
    overlay.classList.remove("hidden");

    // Forzar repaint
    overlay.offsetHeight;

    // Sonido
    sonido.currentTime = 0;
    sonido.play().catch(() => {});

    // Calcular el scale para cubrir la pantalla
    const w = window.innerWidth;
    const h = window.innerHeight;
    const diametroInicial = 20; // tamaño inicial de la bolita
    const radioNecesario = Math.sqrt((w/2)**2 + (h/2)**2);
    const scale = radioNecesario / (diametroInicial / 2);

    bolita.style.setProperty('--scale-final', scale);
    overlay.classList.add("active");

    // Ocultar overlay después de la animación
    setTimeout(() => {
      overlay.classList.remove("active");
      overlay.classList.add("hidden");
    }, 1500);
  }





  /* filtro buscador */

  window.agregarColorDesdeModal = function(color) {
    if (!coloresSeleccionados[color]) {
      coloresSeleccionados[color] = 0;
    }

    coloresSeleccionados[color]++;
    abrirModalColores(); // refresca solo la vista
    actualizarAccionesProducto();
    mostrarResumenSeleccion();
  };



  const buscador = document.getElementById("buscador");

  if (buscador) {
    buscador.addEventListener("input", () => {
      textoBusqueda = buscador.value.toLowerCase();
      renderTodo();
    });
  }



  /* PRODUCTOS */

    window.agregarDesdeCard = function(id) {
    const producto = TODOS_LOS_PRODUCTOS.find(p => p.id === id);
    if (!producto) return;

    // Si tiene colores → abrir modal forzando selección
    if (producto.colores && producto.colores.length > 0) {
      abrirProducto(id, true);
      return;
    }

    // Si NO tiene colores → agregar directo
    agregar(id);
  };

  window.agregar = function(id, color = null) {
    carrito = agregarItem(carrito, TODOS_LOS_PRODUCTOS, id, color, 1);
    guardar();
  };

  window.restar = function(id, color = null) {
    carrito = restarItem(carrito, id, color, 1);
    guardar();
  };

  window.eliminarDesdeCard = function(id) {
    const itemKey = Object.keys(carrito).find(key => carrito[key].id === id);
    if (!itemKey) return;

    pedirEliminar(itemKey);
  };


  console.log("ANTES de render");

  /* render productos */
  function renderSeccion(listaProductos, contenedor, textoFiltro = "") {
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
                ? `
                  <button onclick="event.stopPropagation(); agregarDesdeCard(${p.id})">
                    Agregar
                  </button>
                `
                : `
                ${
                  cant === 1
                    ? `<button onclick="event.stopPropagation(); eliminarDesdeCard(${p.id})">🗑</button>`
                    : `<button onclick="event.stopPropagation(); restar(${p.id})">−</button>`
                }
                <span>${cant}</span>
                <button onclick="event.stopPropagation(); agregarDesdeCard(${p.id})">+</button>
              `
            }
          </div>
        </div>
      `;
    });

    contenedor.innerHTML = html;

    return productosFiltrados.length; //
  }

  /* CARRITO */

  function abrirCarrito() {
    if (Object.keys(carrito).length === 0) return;

    // 🔥 Si hay una card abierta, cerrarla primero
    if (!modalProducto.classList.contains("hidden")) {
      modalProducto.classList.add("hidden");
      productoActivo = null;
    }

    // También cerrar mini modal de colores por seguridad
    if (!modalColores.classList.contains("hidden")) {
      modalColores.classList.add("hidden");
    }

    modalCarrito.classList.remove("hidden");
    mobileCartBar.classList.remove("show");
    renderCarrito();
    bloquearScroll();
  }


  function cerrarCarrito() {
    modalCarrito.classList.add("hidden");
    habilitarScroll();
    actualizarCount();
  }


  function renderCarrito() {
    carritoItems.innerHTML = "";

    if (Object.keys(carrito).length === 0) {
      totalSpan.textContent = 0;
      modalCarrito.classList.add("hidden");
      habilitarScroll();
      actualizarCount();
      return;
    }

    const fragment = document.createDocumentFragment();

    Object.entries(carrito).forEach(([key, p]) => {
      const item = document.createElement("div");
      item.classList.add("item-carrito");

      // Botón eliminar
      const btnEliminar = document.createElement("div");
      btnEliminar.classList.add("item-eliminar");
      btnEliminar.textContent = "🗑";
      btnEliminar.onclick = () => pedirEliminar(key);

      // Contenido
      const contenido = document.createElement("div");
      contenido.classList.add("item-contenido");

      const info = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = `${p.nombre}${p.color ? ` (${p.color})` : ""}`;

      const textoPrecio = document.createTextNode(
        ` $${p.precio} x ${p.cantidad}`
      );

      info.appendChild(strong);
      info.appendChild(textoPrecio);

      // Controles
      const controles = document.createElement("div");
      controles.classList.add("controles");

      const btnMenos = document.createElement("button");

      if (p.cantidad === 1) {
        btnMenos.textContent = "🗑";
        btnMenos.onclick = () => pedirEliminar(key);
      } else {
        btnMenos.textContent = "−";
        btnMenos.onclick = () => restarDesdeCarrito(key);
      }

      const spanCantidad = document.createElement("span");
      spanCantidad.textContent = p.cantidad;

      const btnMas = document.createElement("button");
      btnMas.textContent = "+";
      btnMas.onclick = () => agregarDesdeCarrito(key);

      controles.appendChild(btnMenos);
      controles.appendChild(spanCantidad);
      controles.appendChild(btnMas);

      contenido.appendChild(info);
      contenido.appendChild(controles);

      item.appendChild(btnEliminar);
      item.appendChild(contenido);

      fragment.appendChild(item);
    });

    carritoItems.appendChild(fragment);

    const total = calcularTotal();
    totalSpan.textContent = total;

    const btnRevisar = document.getElementById("revisarPedido");
    const msgMinimo = document.getElementById("mensajeCompraMinima");
    const msgHorario = document.getElementById("mensajeHorario");

    // 🔥 TU LÓGICA DE HORARIO COMPLETA (no la tocamos)
    if (!estaAbierto()) {
      msgHorario.textContent =
        `Estamos cerrados 🕒 Horario: ${HORARIO_APERTURA}:00 a ${HORARIO_CIERRE}:00 hs`;
      msgHorario.classList.remove("hidden");
      msgMinimo.classList.add("hidden");

    } else if (total < COMPRA_MINIMA) {
      const falta = COMPRA_MINIMA - total;
      msgMinimo.textContent = `Agregá $${falta} para poder pedir`;
      msgMinimo.classList.add("show");
      msgHorario.classList.remove("show");

    } else {
      msgMinimo.classList.remove("show");
      msgHorario.classList.remove("show");
    }

    actualizarBotonRevisar();
    activarSwipeCarrito();
  }


  /* funcion de correr en el carrito */
  function activarSwipeCarrito() {
    const items = document.querySelectorAll(".item-carrito");

    items.forEach(item => {
      const contenido = item.querySelector(".item-contenido");

      let startX = 0;
      let startY = 0;
      let currentX = 0;
      let swipeActivo = false;
      let autoCerrarTimeout;

      const UMBRAL_ACTIVACION = 25;
      const UMBRAL_FIJAR = 45;
      const LIMITE = 70;
      const TIEMPO_AUTO_CIERRE = 2000; // 2 segundos

      contenido.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        swipeActivo = false;

        // si vuelve a tocar mientras está abierto → cancelar cierre automático
        clearTimeout(autoCerrarTimeout);
      });

      contenido.addEventListener("touchmove", e => {
        const deltaX = startX - e.touches[0].clientX;
        const deltaY = startY - e.touches[0].clientY;

        if (Math.abs(deltaY) > Math.abs(deltaX)) return;

        if (!swipeActivo) {
          if (deltaX > UMBRAL_ACTIVACION) {
            swipeActivo = true;
          } else {
            return;
          }
        }

        if (deltaX > 0) {
          const movimiento = Math.min(deltaX, LIMITE);
          contenido.style.transform = `translateX(-${movimiento}px)`;
        }

        currentX = e.touches[0].clientX;
      });

      contenido.addEventListener("touchend", () => {
        if (!swipeActivo) return;

        const diff = startX - currentX;

        if (diff > UMBRAL_FIJAR) {
          contenido.style.transform = `translateX(-${LIMITE}px)`;

          // 👇 auto cierre después de unos segundos
          autoCerrarTimeout = setTimeout(() => {
            contenido.style.transform = "translateX(0)";
          }, TIEMPO_AUTO_CIERRE);

        } else {
          contenido.style.transform = "translateX(0)";
        }
      });
    });
  }



  
  /* MODALES */
  document.getElementById("btnCarrito").onclick = () => {
    if (Object.keys(carrito).length === 0) return;
    abrirCarrito();
  };


  document.getElementById("cerrarCarrito").onclick = () => {
    cerrarCarrito();
  };

  window.pedirEliminar = function(key) {
    idEliminar = key;
    document.getElementById("modalEliminar").classList.remove("hidden");
    actualizarScrollGlobal();
  };


  window.cancelarEliminar = function() {
    idEliminar = null;
    document.getElementById("modalEliminar").classList.add("hidden");
    actualizarScrollGlobal();
  };

  window.confirmarEliminar = function() {

    delete carrito[idEliminar];

    guardar();
    renderCarrito();

    cancelarEliminar(); // cierra modalEliminar

    // 🔥 cerrar modalProducto si está abierto
    const modalProducto = document.getElementById("modalProducto");
    if (!modalProducto.classList.contains("hidden")) {
      modalProducto.classList.add("hidden");
    }

    idEliminar = null;
    actualizarScrollGlobal();
  };

  /*Limpiear msj de error*/

  const direccionInput = document.getElementById("direccion");
  const errorDireccion = document.getElementById("errorDireccion");

  ["input", "change", "blur"].forEach(evento => {
    direccionInput.addEventListener(evento, () => {
      errorDireccion.classList.add("hidden");
      direccionInput.classList.remove("error-input");
      actualizarBotonRevisar();
    });
  });

  const metodoPagoSelect = document.getElementById("metodoPago");
  const errorPago = document.getElementById("errorPago");

  metodoPagoSelect.addEventListener("change", () => {
    errorPago.classList.add("hidden");
    metodoPagoSelect.classList.remove("error-input");
    actualizarBotonRevisar();
  });





  /* RESUMEN */

    document.getElementById("revisarPedido").onclick = () => {
    if (!puedeRevisarPedido()) return;

    const inputDir = document.getElementById("direccion");
    const metodoPagoSelect = document.getElementById("metodoPago");

    const direccion = inputDir.value.trim();
    const referencia = document.getElementById("referencia").value.trim();
    const metodoPago = metodoPagoSelect.value;

    let texto = "";
    let total = 0;

    Object.values(carrito).forEach(p => {
      texto += `${p.nombre}${p.color ? ` (${p.color})` : ""} x${p.cantidad}\n`;
      total += p.precio * p.cantidad;
    });

    resumenPedido.textContent = `${texto}
  Total: $${total}
  Dirección: ${direccion}
  Referencia: ${referencia || "—"}
  Pago: ${metodoPago}`;

    modalCarrito.classList.add("hidden");
    modalResumen.classList.remove("hidden");
    bloquearScroll();
  };




  document.getElementById("cerrarResumen").onclick = () => {
    modalResumen.classList.add("hidden");
    habilitarScroll();
  };

  document.getElementById("enviarWhatsapp").onclick = () => {
    const btn = document.getElementById("enviarWhatsapp");

    if (btn.dataset.enviado === "true") return; // evitar clics múltiples
    btn.dataset.enviado = "true";
    btn.disabled = true;

    // Mostrar animación
    mostrarAnimacionPedido();

    // Construir mensaje de WhatsApp
    const texto = encodeURIComponent(resumenPedido.textContent);

    // Vaciar carrito y actualizar UI
    carrito = {};
    localStorage.removeItem("carrito");
    renderTodo();
    actualizarCount();
    modalResumen.classList.add("hidden");
    habilitarScroll();

    // Esperar a que termine la animación para abrir WhatsApp
    setTimeout(() => {
      window.open(`https://wa.me/5491166967802?text=${texto}`, "_blank");

      // Reactivar botón unos ms después de abrir WhatsApp
      setTimeout(() => {
        btn.disabled = false;
        btn.dataset.enviado = "false";
      }, 200); // 200ms es suficiente para evitar clics rápidos
    }, 1500); // coincide con la duración de la animación
  };




  /* boton de ver carrito */
  mobileCartBtn.onclick = () => {
    abrirCarrito();
  };


  /*prueba */

  document.getElementById("cerrarProducto").onclick = () => {
    modalProducto.classList.add("hidden");
    habilitarScroll();
    productoActivo = null;
  };

  document.querySelector(".galeria-btn.next").onclick = () => {
    if (!productoActivo) return;

    const nuevoIndex =
      (imagenActual + 1) % productoActivo.imagenes.length;
    cambiarImagen(nuevoIndex);
  };

  document.querySelector(".galeria-btn.prev").onclick = () => {
    if (!productoActivo) return;

    const nuevoIndex =
      (imagenActual - 1 + productoActivo.imagenes.length) %
      productoActivo.imagenes.length;
    cambiarImagen(nuevoIndex);
  };

  productoAgregar.onclick = () => {

    const tieneColores =
      productoActivo.colores && productoActivo.colores.length > 0;

    // =========================
    // 🟣 PRODUCTO CON COLORES
    // =========================
    if (tieneColores) {

      if (Object.keys(coloresSeleccionados).length === 0) {
        return;
      }

      Object.entries(coloresSeleccionados).forEach(([color, cantidad]) => {
        carrito = agregarItem(
          carrito,
          TODOS_LOS_PRODUCTOS,
          productoActivo.id,
          color,
          cantidad
        );
      });

    } else {
      // =========================
      // 🔵 PRODUCTO SIN COLORES
      // =========================
      carrito = agregarItem(
        carrito,
        TODOS_LOS_PRODUCTOS,
        productoActivo.id,
        null,
        1
      );
    }

    guardar();
    renderCarrito();
    actualizarCardProducto(productoActivo.id);
    actualizarAccionesProducto();

    // Limpiar selección temporal
    coloresSeleccionados = {};
    colorSeleccionadoInfo.classList.add("hidden");
    colorSeleccionadoInfo.textContent = "";

    // 🔥 Cerrar SOLO si tiene colores
    if (tieneColores) {
      modalColores.classList.add("hidden");
      modalProducto.classList.add("hidden");
      habilitarScroll();
    }
  };







  productoMas.onclick = () => {
    const color = document.getElementById("colorSelect")?.value || null;
    agregar(productoActivo.id, color);
    actualizarAccionesProducto();
  };

  productoMenos.onclick = () => {
    const color = document.getElementById("colorSelect")?.value || null;

    const key = Object.keys(carrito).find(k => {
      const item = carrito[k];
      return item.id === productoActivo.id && item.color === color;
    });

    if (!key) return;

    if (carrito[key].cantidad === 1) {
      pedirEliminar(key);
      return;
    }

    carrito = restarItem(carrito, productoActivo.id, color, 1);
    guardar();
    renderCarrito();
    actualizarAccionesProducto();
  };



  /* modale nueva de click card */
  let startX = 0;
  let endX = 0;

  if (galeria) {
    galeria.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });

    galeria.addEventListener("touchend", e => {
      endX = e.changedTouches[0].clientX;
      manejarSwipe();
    });
  }


  if (btnElegirColores) {
    btnElegirColores.onclick = () => {
      abrirModalColores();
    };
  }

  if (cerrarColores) {
    cerrarColores.onclick = () => {

      modalColores.classList.add("hidden");

      mostrarResumenSeleccion();

      actualizarAccionesProducto();
    };
  }

  function renderDestacados() {
    if (vistaActual !== "categorias") return; // 🛡️ seguridad
    const contenedor = document.getElementById("destacadosContainer");

    if (!contenedor) return; // 🔥 CLAVE

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
                      ? `<button onclick="event.stopPropagation(); eliminarDesdeCard(${p.id})">🗑</button>`
                      : `<button onclick="event.stopPropagation(); restar(${p.id})">−</button>`
                  }
                  <span>${cant}</span>
                  <button onclick="event.stopPropagation(); agregarDesdeCard(${p.id})">+</button>
                `
            }
          </div>
        </div>
      `;
    });

    contenedor.innerHTML = html;
  }


  /* INIT */
  renderTodo();
  actualizarCount();
  actualizarEstadoHorario();

  setInterval(actualizarEstadoHorario, 60 * 1000);

});




