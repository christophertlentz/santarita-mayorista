import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { Customer } from '../../models/customer';
import { ResponseBase } from '../../models/response-base';
import { ACCOUNTS_MOCK, Account } from '../data/customers.mock';

const SESSION_KEY = 'santarita-sesion';
const ACCOUNTS_KEY = 'santarita-cuentas';

export type Rol = Customer['rol'];

// Datos que envía el formulario de registro (HU01)
export interface RegisterData {
  tipoDocumento: Customer['tipoDocumento'];
  numeroDocumento: string;
  nombreNegocio: string;
  nombreContacto: string;
  direccion: string;
  telefono: string;
  correo: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Cuentas de prueba + las que se registran desde el formulario
  private cuentas: Account[] = [...ACCOUNTS_MOCK, ...this.cargarCuentas()];

  // Usuario con sesión iniciada (se recupera al recargar la página)
  readonly usuario = signal<Customer | null>(this.cargarSesion());
  readonly estaAutenticado = computed(() => this.usuario() !== null);

  // HU02: iniciar sesión con correo y contraseña
  login(correo: string, password: string): Observable<ResponseBase<Customer | null>> {
    const buscado = correo.trim().toLowerCase();
    const cuenta = this.cuentas.find(
      (c) => c.cliente.correo.toLowerCase() === buscado && c.password === password,
    );

    // HU02, escenario 2: el mensaje no indica cuál de los dos datos falló
    const respuesta = cuenta
      ? this.ok(cuenta.cliente)
      : this.error('0401', 'Correo o contraseña incorrectos');

    return of(respuesta).pipe(
      delay(300),
      tap((r) => {
        if (r.isSuccess) this.guardarSesion(r.data);
      }),
    );
  }

  // HU01: registrar un cliente mayorista
  register(datos: RegisterData): Observable<ResponseBase<Customer | null>> {
    const correo = datos.correo.trim().toLowerCase();

    // HU01, escenario 3: el documento ya está registrado
    if (this.cuentas.some((c) => c.cliente.numeroDocumento === datos.numeroDocumento)) {
      return of(this.error('0409', `Ya tienes una cuenta con ese ${datos.tipoDocumento}.`)).pipe(
        delay(300),
      );
    }
    if (this.cuentas.some((c) => c.cliente.correo.toLowerCase() === correo)) {
      return of(this.error('0409', 'Ya tienes una cuenta con ese correo.')).pipe(delay(300));
    }

    const cliente: Customer = {
      id: Math.max(...this.cuentas.map((c) => c.cliente.id)) + 1,
      tipoDocumento: datos.tipoDocumento,
      numeroDocumento: datos.numeroDocumento,
      nombreNegocio: datos.nombreNegocio.trim(),
      nombreContacto: datos.nombreContacto.trim(),
      direccion: datos.direccion.trim(),
      telefono: datos.telefono,
      correo,
      lineaCredito: 0,
      saldoDeuda: 0,
      rol: 'cliente',
    };

    return of(this.ok(cliente)).pipe(
      delay(300),
      tap(() => {
        this.cuentas = [...this.cuentas, { cliente, password: datos.password }];
        this.guardarCuentas();
      }),
    );
  }

  logout(): void {
    this.guardarSesion(null);
  }

  // HU02, escenario 1: a dónde va cada rol después de iniciar sesión
  rutaInicio(rol: Rol): string {
    return rol === 'cliente' ? '/catalogo' : '/panel';
  }

  private ok(data: Customer): ResponseBase<Customer | null> {
    return { isSuccess: true, errorCode: '0000', errorMessage: '', data };
  }

  private error(errorCode: string, errorMessage: string): ResponseBase<Customer | null> {
    return { isSuccess: false, errorCode, errorMessage, data: null };
  }

  // La sesión guarda solo los datos del cliente, nunca la contraseña
  private guardarSesion(usuario: Customer | null): void {
    this.usuario.set(usuario);
    try {
      if (usuario) localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* sin almacenamiento */
    }
  }

  private cargarSesion(): Customer | null {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null');
    } catch {
      return null;
    }
  }

  // Solo se guardan las cuentas registradas desde el formulario (las de prueba ya están en el código)
  private guardarCuentas(): void {
    const registradas = this.cuentas.slice(ACCOUNTS_MOCK.length);
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(registradas));
    } catch {
      /* sin almacenamiento */
    }
  }

  private cargarCuentas(): Account[] {
    try {
      return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? '[]');
    } catch {
      return [];
    }
  }
}
