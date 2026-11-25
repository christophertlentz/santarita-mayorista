import { Routes } from '@angular/router';
import { Home } from './pages/public/home/home';
import { AboutUs } from './pages/public/about-us/about-us';
import { Contact } from './pages/public/contact/contact';
import { Register } from './pages/auth/register/register';
import { Login } from './pages/auth/login/login';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';
import { ResetPassword } from './pages/auth/reset-password/reset-password';
import { Catalog } from './pages/catalog/catalog/catalog';
import { ProductDetail } from './pages/catalog/product-detail/product-detail';
import { Cart } from './pages/orders/cart/cart';
import { Checkout } from './pages/orders/checkout/checkout';
import { Panel } from './pages/internal/panel/panel';
import { Products } from './pages/internal/products/products';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Públicas
  { path: '', component: Home },
  { path: 'nosotros', component: AboutUs },
  { path: 'contacto', component: Contact },

  // Acceso (HU01, HU02, HU13)
  { path: 'registro', component: Register },
  { path: 'login', component: Login },
  { path: 'recuperar', component: ForgotPassword },
  { path: 'restablecer', component: ResetPassword },

  // Catálogo (HU03, HU04): solo clientes con sesión iniciada
  { path: 'catalogo', component: Catalog, canActivate: [authGuard], data: { roles: ['cliente'] } },
  { path: 'catalogo/:id', component: ProductDetail, canActivate: [authGuard], data: { roles: ['cliente'] } },

  // Pedidos (HU05, HU06): solo clientes con sesión iniciada
  { path: 'carrito', component: Cart, canActivate: [authGuard], data: { roles: ['cliente'] } },
  { path: 'checkout', component: Checkout, canActivate: [authGuard], data: { roles: ['cliente'] } },

  // Panel interno (HU02): solo personal de la empresa
  {
    path: 'panel',
    component: Panel,
    canActivate: [authGuard],
    data: { roles: ['administrador', 'despachador', 'gerente'] }
  },

  // Mantenimiento de productos (HU08): solo el administrador
  {
    path: 'panel/productos',
    component: Products,
    canActivate: [authGuard],
    data: { roles: ['administrador'] }
  },

  // Cualquier otra dirección vuelve al inicio
  { path: '**', redirectTo: '' }
];