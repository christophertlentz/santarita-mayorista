import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Presentation, Product } from '../../../models/product';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cart = inject(CartService);

  producto = signal<Product | undefined>(undefined);
  cargando = signal(true);
  error = signal('');
  indicePresentacion = signal(0);
  cantidad = signal(1);
  tocado = signal(false);
  agregado = signal(false);

  // Presentación elegida (unidad, paquete, caja...)
  presentacion = computed<Presentation | undefined>(() =>
    this.producto()?.presentaciones[this.indicePresentacion()]);

  // Máximo que se puede pedir según el stock (el stock está en unidades)
  maximo = computed(() => {
    const p = this.producto();
    const pr = this.presentacion();
    return p && pr ? Math.floor(p.stock / pr.unidades) : 0;
  });

  // HU04, escenario 3: cantidad inválida
  errorCantidad = computed(() => {
    const c = this.cantidad();
    if (!Number.isInteger(c) || c <= 0) return 'Ingresa una cantidad mayor a 0.';
    if (c > this.maximo()) return `Cantidad no disponible (máximo ${this.maximo()}).`;
    return '';
  });

  // HU04, escenarios 1 y 2: precio según presentación y volumen
  precioUnitario = computed(() => {
    const pr = this.presentacion();
    return pr ? this.cart.precioSegunCantidad(pr, this.cantidad()) : 0;
  });
  subtotal = computed(() => this.precioUnitario() * Math.max(this.cantidad(), 0));
  ahorro = computed(() => {
    const pr = this.presentacion();
    return pr ? (pr.precio - this.precioUnitario()) * Math.max(this.cantidad(), 0) : 0;
  });

  ngOnInit(): void {
    // Lee el :id de la ruta /catalogo/:id
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductById(id).subscribe(respuesta => {
      if (respuesta.isSuccess && respuesta.data) {
        this.producto.set(respuesta.data);
      } else {
        this.error.set(respuesta.errorMessage || 'Producto no encontrado');
      }
      this.cargando.set(false);
    });
  }

  elegirPresentacion(indice: string): void {
    this.indicePresentacion.set(Number(indice));
    this.cantidad.set(1);
    this.tocado.set(false);
    this.agregado.set(false);
  }

  cambiarCantidad(valor: string): void {
    this.cantidad.set(Number(valor));
    this.agregado.set(false);
  }

  agregar(): void {
    this.tocado.set(true);
    const p = this.producto();
    const pr = this.presentacion();
    if (!p || !pr || this.errorCantidad()) return;
    this.cart.agregar(p, pr, this.cantidad());
    this.agregado.set(true);
  }
}