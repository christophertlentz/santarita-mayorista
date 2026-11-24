import { Order } from '../../models/order';

export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    numero: 'PED-0001',
    clienteId: 1,
    fecha: '2026-11-20',
    items: [],
    total: 450.0,
    tipoEntrega: 'Reparto',
    formaPago: 'Contado',
    estado: 'En reparto',
    historial: [
      { estado: 'Pendiente', fecha: '2026-11-20 09:15', observacion: 'Pedido registrado' },
      { estado: 'Preparado', fecha: '2026-11-20 11:30', observacion: 'Armado en almacén' },
      { estado: 'En reparto', fecha: '2026-11-20 14:00', observacion: 'Unidad en ruta' },
    ],
  },
  {
    id: 2,
    numero: 'PED-0002',
    clienteId: 1,
    fecha: '2026-11-23',
    items: [],
    total: 180.5,
    tipoEntrega: 'Recojo en almacén',
    formaPago: 'Crédito',
    estado: 'Pendiente',
    historial: [
      { estado: 'Pendiente', fecha: '2026-11-23 16:10', observacion: 'Esperando preparación' },
    ],
  },
];