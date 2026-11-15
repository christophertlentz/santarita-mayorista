import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  cart = inject(CartService);
  auth = inject(AuthService);
  private router = inject(Router);

  // HU02: cerrar sesión y volver al inicio
  salir(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}