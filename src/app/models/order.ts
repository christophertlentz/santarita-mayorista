export type OrderStatus = 'Pendiente' | 'Preparado' | 'En reparto' | 'Entregado';

export interface CartItem {
  productoId?: number;
  nombre?: string;
  precio?: number;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
  producto?: any;
  presentacion?: any;
}

export interface OrderHistoryItem {
  estado: OrderStatus;
  fecha: string;
  observacion?: string;
}

export interface Order {
  id: number;
  numero: string;
  clienteId: number;
  fecha: string;
  items: CartItem[];
  total: number;
  tipoEntrega: string;
  formaPago: string;
  estado: OrderStatus;
  historial?: OrderHistoryItem[];
}