// Presentación de venta de un producto (unidad, paquete, caja...)
export interface Presentation {
  tipo: string;            // Ej.: 'Unidad', 'Paquete x 6', 'Caja x 12'
  unidades: number;        // Cuántas unidades trae la presentación
  precio: number;          // Precio normal de la presentación (S/)
  desdeCantidad?: number;  // Desde cuántas presentaciones aplica el precio por volumen
  precioEscala?: number;   // Precio por volumen (S/)
}

export interface Product {
  id: number;
  nombre: string;
  marca: string;
  categoria: string;
  stock: number;           // Stock disponible en unidades
  imagen?: string;
  presentaciones: Presentation[];
}