import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Order, OrderStatus } from '../../models/order';
import { MOCK_ORDERS } from '../data/orders.mock';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly storageKey = 'santarita_orders_v1';
  private readonly ordersSubject = new BehaviorSubject<Order[]>(this.loadOrders());
  public readonly orders$: Observable<Order[]> = this.ordersSubject.asObservable();

  constructor() {}

  private loadOrders(): Order[] {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved) as Order[];
      } catch {
        return MOCK_ORDERS;
      }
    }
    localStorage.setItem(this.storageKey, JSON.stringify(MOCK_ORDERS));
    return MOCK_ORDERS;
  }

  private saveOrders(orders: Order[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(orders));
    this.ordersSubject.next(orders);
  }

  getOrders(clienteId?: number): Observable<Order[]> {
    const current = this.ordersSubject.value;
    const filtered = clienteId
      ? current.filter((order) => order.clienteId === clienteId)
      : current;
    return of(filtered);
  }

  getOrderById(orderId: number): Observable<Order | undefined> {
    const found = this.ordersSubject.value.find((order) => order.id === orderId);
    return of(found);
  }

  createOrder(newOrder: Order): void {
    const updated = [newOrder, ...this.ordersSubject.value];
    this.saveOrders(updated);
  }

  updateOrderStatus(orderId: number, nuevoEstado: OrderStatus, observacion?: string): void {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const updated = this.ordersSubject.value.map((order) => {
      if (order.id !== orderId) return order;
      const historialPrevio = order.historial ?? [];
      return {
        ...order,
        estado: nuevoEstado,
        historial: [
          ...historialPrevio,
          { estado: nuevoEstado, fecha: now, observacion: observacion ?? 'Estado actualizado' },
        ],
      };
    });
    this.saveOrders(updated);
  }
}