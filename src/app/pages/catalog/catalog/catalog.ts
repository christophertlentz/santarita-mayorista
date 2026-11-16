import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../models/product';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-catalog',
  imports: [RouterLink],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css'
})
export class Catalog implements OnInit {
  private productService = inject(ProductService);
  private cart = inject(CartService);

  productos = signal<Product[]>([]);
  categorias = signal<string[]>([]);
  cargando = signal(true);
  error = signal('');
  busqueda = signal('');
  categoria = signal('');
  agregadoId = signal<number | null>(null);

  // HU03: productos que cumplen la búsqueda y el filtro
  filtrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const cat = this.categoria();
    return this.productos().filter(p =>
      (texto === '' || p.nombre.toLowerCase().includes(texto) || p.marca.toLowerCase().includes(texto)) &&
      (cat === '' || p.categoria === cat)
    );
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.productService.getProducts().subscribe(respuesta => {
      if (respuesta.isSuccess) {
        this.productos.set(respuesta.data);
        this.categorias.set(this.productService.getCategories());
      } else {
        this.error.set(respuesta.errorMessage);
      }
      this.cargando.set(false);
    });
  }

  buscar(texto: string): void {
    this.busqueda.set(texto);
  }

  filtrar(categoria: string): void {
    this.categoria.set(categoria);
  }

  limpiar(): void {
    this.busqueda.set('');
    this.categoria.set('');
  }

  // Agrega 1 unidad de la primera presentación
  agregar(producto: Product): void {
    this.cart.agregar(producto, producto.presentaciones[0], 1);
    this.agregadoId.set(producto.id);
    setTimeout(() => this.agregadoId.set(null), 1500);
  }
}