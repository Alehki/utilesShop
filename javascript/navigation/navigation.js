export function crearNavegador({ getState, setState, render }) {

  function actualizar(nuevoEstado, push = true) {

    const nuevo = {
      ...getState(),
      ...nuevoEstado
    };

    setState(nuevo);

    if (push) {
      history.pushState(nuevo, "");
    } else {
      history.replaceState(nuevo, "");
    }

    render();
  }

    window.addEventListener("popstate", (e) => {

    // 👇 back especial HOME scroll
    if (e.state?.scrollTopHome) {

        window.scrollTo({
        top: 0,
        behavior: "smooth"
        });

        return;
    }

    if (!e.state) return;

    setState(e.state);

    render();
    });

  return {

    irA(tab) {

      if (tab === "inicio") {
        actualizar({
          tabActiva: "inicio",
          vistaActual: "categorias",
          categoriaActiva: null
        });

        return;
      }

      actualizar({
        tabActiva: tab
      });
    },

    abrirCategoria(categoria) {

    actualizar({
        tabActiva: "inicio",
        vistaActual: "productos",
        categoriaActiva: categoria
    });
    },

    volverCategorias() {

    actualizar({
        vistaActual: "categorias",
        categoriaActiva: null
    });
    }
  };
}

export function actualizarNavActiva(tabActiva) {

  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach(btn => {

    btn.classList.remove("active");

    if (btn.dataset.tab === tabActiva) {
      btn.classList.add("active");
    }
  });
}