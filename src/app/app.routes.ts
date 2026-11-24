import { Routes } from '@angular/router';
import { Home } from './pages/public/home/home';
import { AboutUs } from './pages/public/about-us/about-us';
import { Contact } from './pages/public/contact/contact';
import { Register } from './pages/auth/register/register';
import { Login } from './pages/auth/login/login';
import { Catalog } from './pages/catalog/catalog/catalog';
import { ProductDetail } from './pages/catalog/product-detail/product-detail';
import { Cart } from './pages/orders/cart/cart';
import { Checkout } from './pages/orders/checkout/checkout';
import { Tracking } from './pages/orders/tracking/tracking';
import { Panel } from './pages/internal/panel/panel';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Públicas
  { path: '', component: Home },
  { path: 'nosotros', component: AboutUs },
  { path: 'contacto', component: Contact },

  // Acceso (HU01, HU02)
  { path: 'registro', component: Register },
  { path: 'login', component: Login },

  // Catálogo (HU03, HU04): solo clientes con sesión iniciada
  { path: 'catalogo', component: Catalog, canActivate: [authGuard], data: { roles: ['cliente'] } },
  { path: 'catalogo/:id', component: ProductDetail, canActivate: [authGuard], data: { roles: ['cliente'] } },

  // Pedidos (HU05, HU06, HU07): solo clientes con sesión iniciada
  { path: 'carrito', component: Cart, canActivate: [authGuard], data: { roles: ['cliente'] } },
  { path: 'checkout', component: Checkout, canActivate: [authGuard], data: { roles: ['cliente'] } },
  { path: 'seguimiento', component: Tracking, canActivate: [authGuard], data: { roles: ['cliente'] } },

  // Panel interno (HU02): solo personal de la empresa
  {
    path: 'panel',
    component: Panel,
    canActivate: [authGuard],
    data: { roles: ['administrador', 'despachador', 'gerente'] }
  },

  // Cualquier otra dirección vuelve al inicio
  { path: '**', redirectTo: '' }
];