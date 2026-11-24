import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  tipoEntrega: 'Reparto' | 'Recojo en almacén' = 'Reparto';
  formaPago: 'Contado' | 'Crédito' = 'Contado';

  finalizarCompra() {
    const total = this.cartService.total();

    if (total >= 200) {
      const now = new Date();
      const newOrder: Order = {
        id: Date.now(),
        numero: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
        clienteId: 1,
        fecha: now.toISOString().slice(0, 10),
        items: [...this.cartService.items()],
        total: total,
        tipoEntrega: this.tipoEntrega,
        formaPago: this.formaPago,
        estado: 'Pendiente',
        historial: [
          {
            estado: 'Pendiente',
            fecha: now.toISOString().slice(0, 16).replace('T', ' '),
            observacion: 'Pedido confirmado desde checkout',
          },
        ],
      };

      this.orderService.createOrder(newOrder);

      alert(`¡Pedido ${newOrder.numero} realizado con éxito!`);
      this.router.navigate(['/seguimiento']);
    } else {
      alert('El monto mínimo para procesar el pedido es de S/ 200.');
    }
  }
}