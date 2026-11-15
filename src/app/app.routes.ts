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

export const routes: Routes = [
  // Públicas
  { path: '', component: Home },
  { path: 'nosotros', component: AboutUs },
  { path: 'contacto', component: Contact },

  // Acceso (HU01, HU02)
  { path: 'registro', component: Register },
  { path: 'login', component: Login },

  // Catálogo (HU03, HU04)
  { path: 'catalogo', component: Catalog },
  { path: 'catalogo/:id', component: ProductDetail },

  // Pedidos (HU05, HU06)
  { path: 'carrito', component: Cart },
  { path: 'checkout', component: Checkout },

  // Cualquier otra dirección vuelve al inicio
  { path: '**', redirectTo: '' }
];