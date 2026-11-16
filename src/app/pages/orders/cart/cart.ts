import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { CartService, MONTO_MINIMO } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart {
  cartService = inject(CartService);
  montoMinimo = MONTO_MINIMO;

  actualizar(index: number, cantidad: number) {
    if (cantidad > 0) {
      this.cartService.actualizarCantidad(index, cantidad);
    } else {
      this.cartService.eliminar(index);
    }
  }

  eliminar(index: number) {
    this.cartService.eliminar(index);
  }
}