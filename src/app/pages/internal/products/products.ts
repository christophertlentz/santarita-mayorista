import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl, FormArray, FormBuilder, FormGroup,
  ReactiveFormsModule, ValidationErrors, Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Presentation, Product } from '../../../models/product';

// HU08: si hay precio por volumen, deben ir los dos datos y el precio debe ser menor al normal
function escalaValida(grupo: AbstractControl): ValidationErrors | null {
  const precio = grupo.get('precio')?.value;
  const desde = grupo.get('desdeCantidad')?.value;
  const escala = grupo.get('precioEscala')?.value;
  const hayDesde = desde !== null && desde !== '';
  const hayEscala = escala !== null && escala !== '';
  if (hayDesde !== hayEscala) return { escalaIncompleta: true };
  if (hayEscala && escala >= precio) return { escalaMayor: true };
  return null;
}

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);

  productos = signal<Product[]>([]);
  categorias = signal<string[]>([]);
  cargando = signal(true);
  mostrarFormulario = signal(false);
  editandoId = signal<number | null>(null);
  guardando = signal(false);
  error = signal('');
  mensaje = signal('');

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    marca: ['', Validators.required],
    categoria: ['', Validators.required],
    stock: [0, [Validators.required, Validators.min(0)]],
    presentaciones: this.fb.array<FormGroup>([]),
  });

  constructor() {
    this.cargar();
  }

  get presentaciones(): FormArray<FormGroup> {
    return this.form.controls.presentaciones;
  }

  cargar(): void {
    this.cargando.set(true);
    this.productService.getProducts().subscribe((r) => {
      this.productos.set([...r.data]);
      this.categorias.set(this.productService.getCategories());
      this.cargando.set(false);
    });
  }

  // Abrir el formulario vacío para un producto nuevo
  nuevo(): void {
    this.editandoId.set(null);
    this.form.reset({ nombre: '', marca: '', categoria: '', stock: 0 });
    this.presentaciones.clear();
    this.presentaciones.push(this.crearPresentacion());
    this.abrirFormulario();
  }

  // Abrir el formulario con los datos del producto elegido
  editar(p: Product): void {
    this.editandoId.set(p.id);
    this.form.reset({ nombre: p.nombre, marca: p.marca, categoria: p.categoria, stock: p.stock });
    this.presentaciones.clear();
    p.presentaciones.forEach((pres) => this.presentaciones.push(this.crearPresentacion(pres)));
    this.abrirFormulario();
  }

  cancelar(): void {
    this.mostrarFormulario.set(false);
    this.error.set('');
  }

  agregarPresentacion(): void {
    this.presentaciones.push(this.crearPresentacion());
  }

  quitarPresentacion(i: number): void {
    if (this.presentaciones.length > 1) this.presentaciones.removeAt(i);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const datos: Omit<Product, 'id'> = {
      nombre: v.nombre.trim(),
      marca: v.marca.trim(),
      categoria: v.categoria.trim(),
      stock: v.stock,
      presentaciones: v.presentaciones.map((p) => this.limpiar(p)),
    };

    const id = this.editandoId();
    const original = this.productos().find((p) => p.id === id);
    const peticion =
      id === null
        ? this.productService.crearProducto(datos)
        : this.productService.actualizarProducto({ ...original, ...datos, id });

    this.guardando.set(true);
    this.error.set('');
    peticion.subscribe((r) => {
      this.guardando.set(false);
      if (!r.isSuccess) {
        this.error.set(r.errorMessage);
        return;
      }
      this.mensaje.set(id === null ? `Producto "${datos.nombre}" registrado.` : `Producto "${datos.nombre}" actualizado.`);
      this.mostrarFormulario.set(false);
      this.cargar();
      setTimeout(() => this.mensaje.set(''), 3000);
    });
  }

  invalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!c && c.invalid && c.touched;
  }

    private abrirFormulario(): void {
    this.error.set('');
    this.mensaje.set('');
    this.mostrarFormulario.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private crearPresentacion(p?: Presentation): FormGroup {
    return this.fb.group(
      {
        tipo: [p?.tipo ?? '', Validators.required],
        unidades: [p?.unidades ?? 1, [Validators.required, Validators.min(1)]],
        precio: [p?.precio ?? null, [Validators.required, Validators.min(0.01)]],
        desdeCantidad: [p?.desdeCantidad ?? null, Validators.min(2)],
        precioEscala: [p?.precioEscala ?? null, Validators.min(0.01)],
      },
      { validators: escalaValida },
    );
  }

  // Quita los campos de escala vacíos antes de guardar
  private limpiar(p: any): Presentation {
    const pres: Presentation = { tipo: p.tipo.trim(), unidades: p.unidades, precio: p.precio };
    if (p.desdeCantidad && p.precioEscala) {
      pres.desdeCantidad = p.desdeCantidad;
      pres.precioEscala = p.precioEscala;
    }
    return pres;
  }
}