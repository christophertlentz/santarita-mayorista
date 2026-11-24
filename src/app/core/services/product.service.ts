import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Product } from '../../models/product';
import { ResponseBase } from '../../models/response-base';
import { PRODUCTS_MOCK } from '../data/products.mock';

const STORAGE_KEY = 'santarita-productos';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // HU08: se parte de los datos simulados; los cambios del administrador se guardan en el navegador
  private productos: Product[] = this.cargar();

  // HU03: lista completa del catálogo
  getProducts(): Observable<ResponseBase<Product[]>> {
    return of(this.ok(this.productos)).pipe(delay(300));
  }

  // HU04: detalle de un producto por su id
  getProductById(id: number): Observable<ResponseBase<Product | undefined>> {
    const producto = this.productos.find(p => p.id === id);
    const respuesta = producto ? this.ok<Product | undefined>(producto) : this.error('0404', 'Producto no encontrado');
    return of(respuesta).pipe(delay(300));
  }

  // HU03: categorías para el filtro, sin repetir
  getCategories(): string[] {
    return [...new Set(this.productos.map(p => p.categoria))];
  }

  // HU08: registrar un producto nuevo
  crearProducto(datos: Omit<Product, 'id'>): Observable<ResponseBase<Product | undefined>> {
    if (this.nombreRepetido(datos.nombre)) {
      return of(this.error('0409', 'Ya existe un producto con ese nombre.')).pipe(delay(300));
    }
    const producto: Product = { ...datos, id: Math.max(0, ...this.productos.map(p => p.id)) + 1 };
    this.productos = [...this.productos, producto];
    this.guardar();
    return of(this.ok<Product | undefined>(producto)).pipe(delay(300));
  }

  // HU08: editar un producto existente (también lo usa HU09 para actualizar el stock)
  actualizarProducto(producto: Product): Observable<ResponseBase<Product | undefined>> {
    if (!this.productos.some(p => p.id === producto.id)) {
      return of(this.error('0404', 'Producto no encontrado')).pipe(delay(300));
    }
    if (this.nombreRepetido(producto.nombre, producto.id)) {
      return of(this.error('0409', 'Ya existe un producto con ese nombre.')).pipe(delay(300));
    }
    this.productos = this.productos.map(p => (p.id === producto.id ? producto : p));
    this.guardar();
    return of(this.ok<Product | undefined>(producto)).pipe(delay(300));
  }

  private nombreRepetido(nombre: string, idExcluido?: number): boolean {
    const buscado = nombre.trim().toLowerCase();
    return this.productos.some(p => p.id !== idExcluido && p.nombre.trim().toLowerCase() === buscado);
  }

  private ok<T>(data: T): ResponseBase<T> {
    return { isSuccess: true, errorCode: '0000', errorMessage: '', data };
  }

  private error(errorCode: string, errorMessage: string): ResponseBase<Product | undefined> {
    return { isSuccess: false, errorCode, errorMessage, data: undefined };
  }

  private guardar(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.productos));
    } catch {
      /* sin almacenamiento */
    }
  }

  private cargar(): Product[] {
    try {
      const guardados = localStorage.getItem(STORAGE_KEY);
      return guardados ? JSON.parse(guardados) : [...PRODUCTS_MOCK];
    } catch {
      return [...PRODUCTS_MOCK];
    }
  }
}