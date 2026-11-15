import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../../models/order';
import { Presentation, Product } from '../../models/product';

const STORAGE_KEY = 'santarita-carrito';
export const MONTO_MINIMO = 200; // HU05: pedido mínimo en soles

@Injectable({ providedIn: 'root' })
export class CartService {
  // Lista del carrito (se recupera al recargar la página: HU05, escenario 3)
  readonly items = signal<CartItem[]>(this.cargar());

  // Valores que se recalculan solos cuando cambia el carrito
  readonly total = computed(() => this.items().reduce((suma, i) => suma + i.subtotal, 0));
  readonly cantidadProductos = computed(() => this.items().length);
  readonly faltaParaMinimo = computed(() => Math.max(0, MONTO_MINIMO - this.total()));

  // HU04: precio unitario según la cantidad (aplica el precio por volumen)
  precioSegunCantidad(presentacion: Presentation, cantidad: number): number {
    const aplicaEscala = presentacion.desdeCantidad !== undefined
      && presentacion.precioEscala !== undefined
      && cantidad >= presentacion.desdeCantidad;
    return aplicaEscala ? presentacion.precioEscala! : presentacion.precio;
  }

  // HU03/HU04: agregar un producto (si ya está con la misma presentación, suma la cantidad)
  agregar(producto: Product, presentacion: Presentation, cantidad: number): void {
    const items = this.items();
    const existe = items.some(i => i.producto.id === producto.id && i.presentacion.tipo === presentacion.tipo);

    const nuevos = existe
      ? items.map(i => i.producto.id === producto.id && i.presentacion.tipo === presentacion.tipo
          ? this.crearItem(producto, presentacion, i.cantidad + cantidad)
          : i)
      : [...items, this.crearItem(producto, presentacion, cantidad)];

    this.guardar(nuevos);
  }

  // HU05: cambiar la cantidad de una línea
  actualizarCantidad(index: number, cantidad: number): void {
    const nuevos = this.items().map((item, i) =>
      i === index ? this.crearItem(item.producto, item.presentacion, cantidad) : item);
    this.guardar(nuevos);
  }

  // HU05: quitar una línea
  eliminar(index: number): void {
    this.guardar(this.items().filter((_, i) => i !== index));
  }

  // HU06: vaciar el carrito al confirmar el pedido
  vaciar(): void {
    this.guardar([]);
  }

  private crearItem(producto: Product, presentacion: Presentation, cantidad: number): CartItem {
    const precioUnitario = this.precioSegunCantidad(presentacion, cantidad);
    return { producto, presentacion, cantidad, precioUnitario, subtotal: precioUnitario * cantidad };
  }

  private guardar(items: CartItem[]): void {
    this.items.set(items);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* sin almacenamiento */ }
  }

  private cargar(): CartItem[] {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
  }
}