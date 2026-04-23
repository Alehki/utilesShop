
import { agregarItem, restarItem, calcularTotalDesde } from "./carrito-core.js";
import { TODOS_LOS_PRODUCTOS, listas } from "./productos-data.js";
import { normalizarTexto, obtenerResumenCarrito } from "./utils.js";
import { guardarCarrito, obtenerCarrito } from "./storage.js";
import { estaAbierto, actualizarEstadoHorario, actualizarHeroHorario} from "./horario.js";
import { renderSeccion, renderDestacados } from "./ui-productos.js";
import { renderCarrito, abrirCarrito, cerrarCarrito } from "./ui-carrito.js";

document.addEventListener("DOMContentLoaded", () => {

  function pedirEliminar (key) {
    idEliminar = key;
    document.getElementById("modalEliminar").classList.remove("hidden");
    actualizarScrollGlobal();
  };

  function agregarDesdeCarrito (key) {
    const item = carrito[key];
    if (!item) return;

    carrito = agregarItem(carrito, TODOS_LOS_PRODUCTOS, item.id, item.color, 1);
    guardar();
    renderCarrito(contextoCarrito);
  };

  function restarDesdeCarrito(key) {
    const item = carrito[key];
    if (!item) return;

    if (item.cantidad === 1) {
      pedirEliminar(key);
      return;
    }

    carrito = restarItem(carrito, item.id, item.color, 1);
    guardar();
    renderCarrito(contextoCarrito);
  };

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
        <button class="btn-volver">←</button>
        <h2>${categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h2>
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

    renderSeccion(productosFiltrados, contenedor, carrito, textoBusqueda);
  }

  let textoBusqueda = "";
  // Cargar carrito de forma segura

  let carrito = obtenerCarrito();


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

  const direccionInput = document.getElementById("direccion");
  const errorDireccion = document.getElementById("errorDireccion");

  const metodoPagoSelect = document.getElementById("metodoPago");
  const errorPago = document.getElementById("errorPago");


  let imagenActual = 0;
  let productoActivo = null;
  let coloresSeleccionados = {};

  const COMPRA_MINIMA = 10000;
  const HORARIO_APERTURA = 9;   // 9 AM
  const HORARIO_CIERRE = 18;   // 18 PM

  const contextoCarrito = {
    getCarrito: () => carrito,
    carritoItems,
    totalSpan,
    modalCarrito,
    actualizarCount,
    estaAbierto,
    COMPRA_MINIMA,
    HORARIO_APERTURA,
    HORARIO_CIERRE,
    actualizarBotonRevisar,
    activarSwipeCarrito,
    pedirEliminar,
    agregarDesdeCarrito,
    restarDesdeCarrito,
    resumenDiv: document.getElementById("resumenCarrito"),
    msgMinimo: document.getElementById("mensajeCompraMinima"),
    msgHorario: document.getElementById("mensajeHorario"),
    obtenerEstadoPedido
  };

  /* UTILS */

  // function guardar() {
  //   persistirCarrito();
  //   sincronizarUI();
  // }

  function guardar() {
    guardarCarrito(carrito);

    const carritoVacio = Object.keys(carrito).length === 0;

    if (carritoVacio) {
      cerrarCarrito({
        modalCarrito,
        habilitarScroll,
        actualizarCount
      });
    } else {
      renderCarrito(contextoCarrito);
      actualizarCount();
    }

    if (vistaActual === "productos") {
      renderProductosCategoria(categoriaActiva);
    }

    if (vistaActual === "categorias") {
      renderDestacados(TODOS_LOS_PRODUCTOS, carrito, vistaActual);
    }
  }

  function sincronizarUI() {
    renderTodo();
    actualizarCount();
    actualizarBotonRevisar();
  }

  function renderTodo() {
    const carousel = document.getElementById("carouselSection");
    const hero = document.querySelector(".hero");
    const destacados = document.querySelector(".seccion-destacados");
    const barraBeneficios = document.querySelector(".barra-beneficios");

    if (vistaActual === "categorias") {

      carousel?.classList.remove("hidden");
      hero?.classList.remove("hidden");
      destacados?.classList.remove("hidden");
      barraBeneficios?.classList.remove("hidden");

      renderCategorias();
      renderDestacados(TODOS_LOS_PRODUCTOS, carrito, vistaActual);

    } else if (vistaActual === "productos") {

      carousel?.classList.add("hidden");
      hero?.classList.add("hidden");
      destacados?.classList.add("hidden");
      barraBeneficios?.classList.add("hidden");

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


  function animarPopCarrito() {
    carritoCount.classList.remove("pop");
    void carritoCount.offsetWidth;
    carritoCount.classList.add("pop");
  }

  /* BARRA BOTON NAV */

  let cantidadAnterior = 0;

  function animarCambioCantidad(nuevaCantidad) {
    if (nuevaCantidad < cantidadAnterior) {
      carritoCount.classList.remove("shake");
      void carritoCount.offsetWidth;
      carritoCount.classList.add("shake");
    }

    cantidadAnterior = nuevaCantidad;
  }

  function actualizarBarraCarritoUI(cantidad, total) {
    const carritoAbierto = !modalCarrito.classList.contains("hidden");

    if (cantidad > 0 && !carritoAbierto) {
      mobileCartBar.classList.add("show");
      mobileCartCantidad.textContent =
        cantidad === 1 ? "1 producto" : `${cantidad} productos`;
      mobileCartTotal.textContent = `$${total}`;
    } else {
      mobileCartBar.classList.remove("show");
    }
  }

  function actualizarCount() {
    const { cantidad, total } = obtenerResumenCarrito(carrito);

    carritoCount.textContent = cantidad;

    animarCambioCantidad(cantidad);
    actualizarBarraCarritoUI(cantidad, total);

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
        // productoMenos.textContent = "🗑";
        productoMenos.classList.add("btn-icon", "danger");
        productoMenos.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M9 3h6M4 7h16M6 7l1 14h10l1-14"/>
          </svg>
        `;
      } else {
        productoMenos.classList.remove("btn-icon", "danger");
        productoMenos.textContent = "−";
      }
    } else {
      productoAgregar.classList.remove("hidden");
      productoCantidad.classList.add("hidden");
      productoCantidadValor.textContent = 1;
    }

  }



  // function actualizarCardProducto(id) {
  //   const card = document.getElementById(`producto-${id}`);
  //   if (!card) return;

  //   const p = TODOS_LOS_PRODUCTOS.find(prod => prod.id === id);
  //   if (!p) return;
  //   const cant = Object.values(carrito)
  //     .filter(item => item.id === id)
  //     .reduce((acc, item) => acc + item.cantidad, 0);

  //   const controles = `
  //     ${
  //       cant === 0
  //         ? `<button onclick="event.stopPropagation(); agregarDesdeCard(${id})">Agregar</button>`
  //         : `
  //           <button onclick="event.stopPropagation(); restar(${id})">−</button>
  //           <span>${cant}</span>
  //           <button onclick="event.stopPropagation(); agregarDesdeCard(${id})">+</button>
  //         `
  //     }
  //   `;

  //   const controlesDiv = card.querySelector(".controles");
  //   controlesDiv.innerHTML = controles;
  // }


  /*  */
  // ================= CARRUSEL PRO =================

  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".slide");
  const nextBtn = document.querySelector(".right");
  const prevBtn = document.querySelector(".left");
  const dotsContainer = document.querySelector(".dots");

  const totalSlides = slides.length;

  /* =========================
    CLONAR (INFINITO REAL)
  ========================= */
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  let isAnimating = false;

  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  const allSlides = document.querySelectorAll(".slide");

  let index = 1;

  track.style.transform = `translateX(-${index * 100}%)`;

  /* =========================
    FUNCIONES
  ========================= */
  function updateCarousel() {
    if (isAnimating) return;

    isAnimating = true;

    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${index * 100}%)`;

    updateDots();
  }
  function updateDots() {
    dots.forEach(dot => dot.classList.remove("active"));

    let realIndex = index - 1;

    if (realIndex < 0) realIndex = dots.length - 1;
    if (realIndex >= dots.length) realIndex = 0;

    dots[realIndex].classList.add("active");
  }

  /*DOTS*/
  dotsContainer.innerHTML = "";

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");

    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      index = i + 1; // 🔥 IMPORTANTE (por los clones)
      updateCarousel();
      resetAutoplay();
    });

    dotsContainer.appendChild(dot);
  }

  const dots = document.querySelectorAll(".dot");

  /* BOTONES */
  nextBtn.addEventListener("click", () => {
    if (isAnimating) return;
    index++;
    updateCarousel();
    resetAutoplay();
  });

  prevBtn.addEventListener("click", () => {
    if (isAnimating) return;
    index--;
    updateCarousel();
    resetAutoplay();
  });

  /* AUTOPLAY */
  let autoplay = setInterval(() => {
    if (!isAnimating) {
      index++;
      updateCarousel();
    }
  }, 4000);

  function resetAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(() => {
      index++;
      updateCarousel();
    }, 4000);
  }

  /* SWIPE */
  let startX = 0;
  let isSwiping = false;

  // function hayModalAbierto() {
  //   return document.querySelector(".modal:not(.hidden)");
  // }

  track.addEventListener("touchstart", e => {
    if (isAnimating) return; // 🚫 no permitir swipe en animación

    startX = e.touches[0].clientX;
    isSwiping = true;
  });

  track.addEventListener("touchmove", e => {
    if (!isSwiping) return;

    const currentX = e.touches[0].clientX;
    const diff = Math.abs(startX - currentX);

    // 👉 si el movimiento es muy chico, ignoramos
    if (diff < 10) return;

    // 👉 si ya empezó un swipe real, bloqueamos múltiples direcciones
    isSwiping = true;
  });

  track.addEventListener("touchend", e => {
    if (!isSwiping) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) < 50) {
      isSwiping = false;

      // 🔥 FORZAMOS QUE NO QUEDE “medio estado”
      track.style.transition = "transform 0.2s ease-out";
      track.style.transform = `translateX(-${index * 100}%)`;

      return;
    }

    if (isAnimating) {
      isSwiping = false;
      return;
    }

    if (diff > 0) {
      index++;
    } else {
      index--;
    }

    updateCarousel();
    resetAutoplay();

    isSwiping = false;
  });

  /* LOOP INFINITO */
  track.addEventListener("transitionend", () => {
    const currentSlide = allSlides[index];

    if (!currentSlide) {
      track.style.transition = "none";
      index = 1;
      track.style.transform = `translateX(-${index * 100}%)`;
      updateDots(); // 🔥 agregar acá
      isAnimating = false;
      return;
    }

    if (currentSlide === firstClone) {
      track.style.transition = "none";
      index = 1;
      track.style.transform = `translateX(-${index * 100}%)`;
      updateDots(); // 🔥 clave
    }

    if (currentSlide === lastClone) {
      track.style.transition = "none";
      index = allSlides.length - 2;
      track.style.transform = `translateX(-${index * 100}%)`;
      updateDots(); // 🔥 clave
    }

    isAnimating = false;
  });

  /* */

  function calcularTotal() {
    return calcularTotalDesde(carrito);
  }

  function puedeRevisarPedido() {
    // const direccion = document.getElementById("direccion").value.trim();
    // const metodoPago = document.getElementById("metodoPago").value;
    const total = calcularTotal();

    if (!estaAbierto()) return false;
    if (total < COMPRA_MINIMA) return false;
    // if (!direccion) return false;
    // if (!metodoPago) return false;

    return true;
  }

  function obtenerEstadoPedido(total) {
    if (!estaAbierto()) return "cerrado";
    if (total < COMPRA_MINIMA) return "minimo";
    return "ok";
  }

  function actualizarBotonRevisar() {
    const btn = document.getElementById("revisarPedido");
    // const direccion = document.getElementById("direccion").value.trim();
    // const metodoPago = document.getElementById("metodoPago").value;
    const total = calcularTotal();

    let mensajes = [];

    // if (!direccion) mensajes.push("Completá la dirección");
    // if (!metodoPago) mensajes.push("Seleccioná un método de pago");

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
      carrito: Object.keys(carrito).length
    });
  }




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
    animarPopCarrito();
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
      abrirCarrito({
        carrito,
        modalCarrito,
        modalProducto,
        modalColores,
        mobileCartBar,
        renderCarrito: () => renderCarrito(contextoCarrito),
        bloquearScroll
      });
  };


  document.getElementById("cerrarCarrito").onclick = () => {
    cerrarCarrito({
      modalCarrito,
      habilitarScroll,
      actualizarCount
    });
  };


  window.cancelarEliminar = function() {
    idEliminar = null;
    document.getElementById("modalEliminar").classList.add("hidden");
    actualizarScrollGlobal();
  };

  window.confirmarEliminar = function() {

    delete carrito[idEliminar];

    guardar();
    // renderCarrito(contextoCarrito);

    cancelarEliminar(); // cierra modalEliminar

    // 🔥 cerrar modalProducto si está abierto
    const modalProducto = document.getElementById("modalProducto");
    if (!modalProducto.classList.contains("hidden")) {
      modalProducto.classList.add("hidden");
    }

    idEliminar = null;
    actualizarScrollGlobal();
  };


  ["input", "change", "blur"].forEach(evento => {
    direccionInput.addEventListener(evento, () => {
      errorDireccion.classList.add("hidden");
      direccionInput.classList.remove("error-input");
      actualizarBotonRevisar();
    });
  });

  metodoPagoSelect.addEventListener("change", () => {
    errorPago.classList.add("hidden");
    metodoPagoSelect.classList.remove("error-input");
    actualizarBotonRevisar();
  });





  /* RESUMEN */

  //   document.getElementById("revisarPedido").onclick = () => {
  //   if (!puedeRevisarPedido()) return;

  //   const inputDir = document.getElementById("direccion");
  //   const metodoPagoSelect = document.getElementById("metodoPago");

  //   const direccion = inputDir.value.trim();
  //   const referencia = document.getElementById("referencia").value.trim();
  //   const metodoPago = metodoPagoSelect.value;

  //   let texto = "";
  //   let total = 0;

  //   Object.values(carrito).forEach(p => {
  //     texto += `${p.nombre}${p.color ? ` (${p.color})` : ""} x${p.cantidad}\n`;
  //     total += p.precio * p.cantidad;
  //   });

  //   resumenPedido.textContent = `${texto}
  // Total: $${total}
  // Dirección: ${direccion}
  // Referencia: ${referencia || "—"}
  // Pago: ${metodoPago}`;

  //   modalCarrito.classList.add("hidden");
  //   modalResumen.classList.remove("hidden");
  //   bloquearScroll();
  // };
  document.getElementById("revisarPedido").onclick = () => {
    if (!puedeRevisarPedido()) return;

    const costoEnvio = 900;

    let productosHTML = "";
    let subtotal = 0;

    Object.values(carrito).forEach(p => {
      productosHTML += `
        <div class="resumen-item">
          <span>${p.nombre}${p.color ? ` (${p.color})` : ""}</span>
          <span>x${p.cantidad}</span>
        </div>
      `;
      subtotal += p.precio * p.cantidad;
    });

    const totalFinal = subtotal + costoEnvio;

    resumenPedido.innerHTML = `
      <div class="resumen-container">

        <div class="resumen-productos">
          ${productosHTML}
        </div>

        <div class="resumen-card">
          <div class="fila">
            <span>Productos</span>
            <span>$${subtotal}</span>
          </div>

          <div class="fila">
            <span>Envío</span>
            <span>$${costoEnvio}</span>
          </div>

          <div class="fila total-final">
            <span>Total</span>
            <span>$${totalFinal}</span>
          </div>
        </div>

      </div>
    `;

    modalCarrito.classList.add("hidden");
    modalResumen.classList.remove("hidden");
    bloquearScroll();
  };

  document.getElementById("volverCarrito").onclick = () => {
    modalResumen.classList.add("hidden");
    modalCarrito.classList.remove("hidden");
  };


  document.getElementById("cerrarResumen").onclick = () => {
    modalResumen.classList.add("hidden");
    habilitarScroll();
  };

  document.getElementById("enviarWhatsapp").onclick = () => {
    const btn = document.getElementById("enviarWhatsapp");
    const direccionInput = document.getElementById("direccion");
    const metodoPagoSelect = document.getElementById("metodoPago");
    const errorDireccion = document.getElementById("errorDireccion");
    const errorPago = document.getElementById("errorPago");

    const direccion = direccionInput.value.trim();
    const metodoPago = metodoPagoSelect.value;
    const referencia = document.getElementById("referencia").value.trim();

    // reset errores
    errorDireccion.classList.add("hidden");
    errorPago.classList.add("hidden");
    direccionInput.classList.remove("error-input");
    metodoPagoSelect.classList.remove("error-input");

    // validaciones
    let hayError = false;

    if (!direccion) {
      errorDireccion.classList.remove("hidden");
      direccionInput.classList.add("error-input");
      hayError = true;
    }

    if (!metodoPago) {
      errorPago.classList.remove("hidden");
      metodoPagoSelect.classList.add("error-input");
      hayError = true;
    }

    if (hayError) return;

    if (btn.dataset.enviado === "true") return; // evitar clics múltiples
    btn.dataset.enviado = "true";
    btn.disabled = true;

    // Mostrar animación
    mostrarAnimacionPedido();

    // Construir mensaje de WhatsApp
    let mensaje = "🛍️ *Nuevo pedido*\n";

    let subtotal = 0;

    Object.values(carrito).forEach(p => {
      mensaje += `\n• ${p.nombre}${p.color ? ` (${p.color})` : ""} x${p.cantidad}`;
      subtotal += p.precio * p.cantidad;
    });

    const envio = 900;
    const totalFinal = subtotal + envio;

    mensaje += `\n\nSubtotal: $${subtotal}`;
    mensaje += `\nEnvío: $${envio}`;
    mensaje += `\n*Total: $${totalFinal}*`;

    mensaje += `\n\n📍 ${direccion}`;
    mensaje += `\n💳 ${metodoPago}`;

    if (referencia) {
      mensaje += `\n📝 ${referencia}`;
    }

    const texto = encodeURIComponent(mensaje);

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
      abrirCarrito({
        carrito,
        modalCarrito,
        modalProducto,
        modalColores,
        mobileCartBar,
        renderCarrito: () => renderCarrito(contextoCarrito),
        bloquearScroll
      });
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
    renderCarrito(contextoCarrito);
    // actualizarCardProducto(productoActivo.id);
    // renderProductosCategoria(categoriaActiva);
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
    animarPopCarrito();
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
    renderCarrito(contextoCarrito);
    actualizarAccionesProducto();
  };

  function manejarSwipe() {
    const diff = endX - startXX;

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

  /* modale nueva de click card */
  // let startXX = 0;
  // let endX = 0;

  // if (galeria) {
  //   galeria.addEventListener("touchstart", e => {
  //     startXX = e.touches[0].clientX;
  //   });

  //   galeria.addEventListener("touchend", e => {
  //     endX = e.changedTouches[0].clientX;
  //     manejarSwipe();
  //   });
  // }

  let startXX = null;
  let endX = null;

  if (galeria) {
    galeria.addEventListener("touchstart", e => {
      startXX = e.touches[0].clientX;
    });

    galeria.addEventListener("touchend", e => {
      if (startXX === null) return;

      endX = e.changedTouches[0].clientX;
      manejarSwipe();

      startXX = null;
      endX = null;
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

  /* INIT */
  renderTodo();
  actualizarCount();
  actualizarEstadoHorario();

  setInterval(actualizarEstadoHorario, 60 * 1000);
  setInterval(actualizarHeroHorario, 60 * 1000);
  actualizarHeroHorario(); // al cargar

});




