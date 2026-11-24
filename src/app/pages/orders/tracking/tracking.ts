import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Order, OrderStatus } from '../../../models/order';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tracking.html',
  styleUrl: './tracking.css',
})
export class Tracking implements OnInit {
  orders: Order[] = [];
  selectedOrder: Order | null = null;

  readonly steps: OrderStatus[] = [
    'Pendiente',
    'Preparado',
    'En reparto',
    'Entregado',
  ];

  constructor(private readonly orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe((data) => {
      this.orders = data;
      if (this.orders.length > 0) {
        this.selectedOrder = this.orders[0];
      }
    });
  }

  selectOrder(order: Order): void {
    this.selectedOrder = order;
  }

  getStepIndex(status: OrderStatus): number {
    return this.steps.indexOf(status);
  }
}