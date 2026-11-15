import { Product } from '../../models/product';

// Datos simulados del catálogo (marcas y precios de prueba)
export const PRODUCTS_MOCK: Product[] = [
  {
    id: 1, nombre: 'Arroz extra 5 kg', marca: 'Valle Norte', categoria: 'Abarrotes', stock: 120,
    presentaciones: [
      { tipo: 'Unidad', unidades: 1, precio: 19.50 },
      { tipo: 'Saco x 10', unidades: 10, precio: 185.00, desdeCantidad: 5, precioEscala: 179.00 }
    ]
  },
  {
    id: 2, nombre: 'Azúcar rubia 1 kg', marca: 'Dulce Sol', categoria: 'Abarrotes', stock: 300,
    presentaciones: [
      { tipo: 'Unidad', unidades: 1, precio: 4.20 },
      { tipo: 'Paquete x 10', unidades: 10, precio: 40.00, desdeCantidad: 5, precioEscala: 38.50 }
    ]
  },
  {
    id: 3, nombre: 'Aceite vegetal 1 L', marca: 'Oro del Campo', categoria: 'Abarrotes', stock: 144,
    presentaciones: [
      { tipo: 'Unidad', unidades: 1, precio: 8.90 },
      { tipo: 'Caja x 12', unidades: 12, precio: 102.00, desdeCantidad: 5, precioEscala: 98.00 }
    ]
  },
  {
    id: 4, nombre: 'Fideo spaghetti 500 g', marca: 'Pastas del Norte', categoria: 'Abarrotes', stock: 240,
    presentaciones: [
      { tipo: 'Unidad', unidades: 1, precio: 2.80 },
      { tipo: 'Paquete x 20', unidades: 20, precio: 52.00 }
    ]
  },
  {
    id: 5, nombre: 'Gaseosa 3 L', marca: 'Refresco Andino', categoria: 'Bebidas', stock: 96,
    presentaciones: [
      { tipo: 'Unidad', unidades: 1, precio: 9.50 },
      { tipo: 'Paquete x 6', unidades: 6, precio: 54.00, desdeCantidad: 5, precioEscala: 51.00 }
    ]
  },
  {
    id: 6, nombre: 'Agua mineral 625 ml', marca: 'Agua Pura', categoria: 'Bebidas', stock: 0,
    presentaciones: [
      { tipo: 'Unidad', unidades: 1, precio: 1.50 },
      { tipo: 'Paquete x 15', unidades: 15, precio: 19.50 }
    ]
  },
  {
    id: 7, nombre: 'Leche evaporada 400 g', marca: 'Vaca Feliz', categoria: 'Lácteos y conservas', stock: 480,
    presentaciones: [
      { tipo: 'Unidad', unidades: 1, precio: 3.90 },
      { tipo: 'Caja x 48', unidades: 48, precio: 180.00, desdeCantidad: 3, precioEscala: 174.00 }
    ]
  },
  {
    id: 8, nombre: 'Atún en aceite 140 g', marca: 'Mar del Sur', categoria: 'Lácteos y conservas', stock: 192,
    presentaciones: [
      { tipo: 'Unidad', unidades: 1, precio: 5.50 },
      { tipo: 'Caja x 48', unidades: 48, precio: 252.00 }
    ]
  },
  {
    id: 9, nombre: 'Detergente en polvo 900 g', marca: 'Blanco Total', categoria: 'Limpieza', stock: 60,
    presentaciones: [
      { tipo: 'Unidad', unidades: 1, precio: 9.80 },
      { tipo: 'Caja x 12', unidades: 12, precio: 112.00 }
    ]
  },
  {
    id: 10, nombre: 'Lejía 1 L', marca: 'Blanco Total', categoria: 'Limpieza', stock: 144,
    presentaciones: [
      { tipo: 'Unidad', unidades: 1, precio: 3.20 },
      { tipo: 'Caja x 12', unidades: 12, precio: 36.00, desdeCantidad: 5, precioEscala: 34.50 }
    ]
  },
  {
    id: 11, nombre: 'Jabón de tocador 90 g', marca: 'Suave Piel', categoria: 'Cuidado personal', stock: 288,
    presentaciones: [
      { tipo: 'Unidad', unidades: 1, precio: 2.50 },
      { tipo: 'Caja x 72', unidades: 72, precio: 165.00 }
    ]
  },
  {
    id: 12, nombre: 'Galletas de soda', marca: 'Crocante', categoria: 'Golosinas', stock: 400,
    presentaciones: [
      { tipo: 'Unidad', unidades: 1, precio: 1.20 },
      { tipo: 'Caja x 40', unidades: 40, precio: 44.00, desdeCantidad: 5, precioEscala: 42.00 }
    ]
  }
];