import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  cartService = inject(CartService);

  finalizarCompra() {
    if (this.cartService.total() >= 200) {
      alert('¡Pedido realizado con éxito!');
      
    } else {
      alert('El monto mínimo para procesar el pedido es de S/ 200.');
    }
  }
}
