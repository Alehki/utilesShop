import {
  agregarItem,
  restarItem,
  calcularTotalDesde
} from "../carrito-core.js";

describe("Carrito Core", () => {

  test("agrega producto nuevo", () => {
    const carrito = {};
    const productos = [{ id: 1, precio: 1000 }];

    const nuevo = agregarItem(carrito, productos, 1);

    expect(nuevo["1"].cantidad).toBe(1);
    expect(nuevo["1"].precio).toBe(1000);
  });

  test("suma cantidad si el producto ya existe", () => {
    const productos = [{ id: 1, precio: 1000 }];

    const carrito = {
      1: { id: 1, precio: 1000, cantidad: 1 }
    };

    const nuevo = agregarItem(carrito, productos, 1);

    expect(nuevo["1"].cantidad).toBe(2);
  });

  test("resta cantidad y elimina si llega a 0", () => {
    const carrito = {
      1: { id: 1, precio: 1000, cantidad: 1 }
    };

    const nuevo = restarItem(carrito, 1);

    expect(nuevo["1"]).toBeUndefined();
  });

  test("calcula total correctamente", () => {
    const carrito = {
      1: { id: 1, precio: 1000, cantidad: 2 },
      2: { id: 2, precio: 500, cantidad: 1 }
    };

    const total = calcularTotalDesde(carrito);

    expect(total).toBe(2500);
  });

});

