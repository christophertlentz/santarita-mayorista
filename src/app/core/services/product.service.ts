import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Product } from '../../models/product';
import { ResponseBase } from '../../models/response-base';
import { PRODUCTS_MOCK } from '../data/products.mock';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private productos: Product[] = PRODUCTS_MOCK;

  // HU03: lista completa del catálogo
  getProducts(): Observable<ResponseBase<Product[]>> {
    return of(this.ok(this.productos)).pipe(delay(300));
  }

  // HU04: detalle de un producto por su id
  getProductById(id: number): Observable<ResponseBase<Product | undefined>> {
    const producto = this.productos.find(p => p.id === id);
    const respuesta: ResponseBase<Product | undefined> = producto
      ? this.ok(producto)
      : { isSuccess: false, errorCode: '0404', errorMessage: 'Producto no encontrado', data: undefined };
    return of(respuesta).pipe(delay(300));
  }

  // HU03: categorías para el filtro, sin repetir
  getCategories(): string[] {
    return [...new Set(this.productos.map(p => p.categoria))];
  }

  private ok<T>(data: T): ResponseBase<T> {
    return { isSuccess: true, errorCode: '0000', errorMessage: '', data };
  }
}