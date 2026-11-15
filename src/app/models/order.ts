import { Presentation, Product } from './product';

// Una línea del carrito o del pedido
export interface CartItem {
  producto: Product;
  presentacion: Presentation;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Order {
  id: number;
  numero: string;          // Ej.: 'PED-0001'
  clienteId: number;
  fecha: string;
  items: CartItem[];
  total: number;
  tipoEntrega: 'Reparto' | 'Recojo en almacén';
  formaPago: 'Contado' | 'Crédito';
  estado: 'Pendiente' | 'Preparado' | 'En reparto' | 'Entregado';
}
