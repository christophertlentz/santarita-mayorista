import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { Customer } from '../../models/customer';
import { ResponseBase } from '../../models/response-base';
import { ACCOUNTS_MOCK, Account } from '../data/customers.mock';
import { MINUTOS_VIGENCIA_ENLACE, ResetToken, tokensDemo } from '../data/password-reset.mock';

const SESSION_KEY = 'santarita-sesion';
const ACCOUNTS_KEY = 'santarita-cuentas';
const RESET_TOKENS_KEY = 'santarita-recuperacion';
const NEW_PASSWORDS_KEY = 'santarita-claves';

// HU13, escenario 3: el mismo mensaje si el enlace no existe, venció o ya se usó
export const ENLACE_INVALIDO = 'Este enlace venció o ya fue usado. Solicita uno nuevo.';

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
  // (con las contraseñas cambiadas desde "Olvidé mi contraseña", HU13)
  private cuentas: Account[] = this.aplicarClavesNuevas([
    ...ACCOUNTS_MOCK,
    ...this.cargarCuentas(),
  ]);

  // HU13: enlaces de recuperación (los de prueba + los solicitados desde el formulario)
  private tokens: ResetToken[] = [...tokensDemo(), ...this.cargarTokens()];

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

  // HU13, escenario 1: pedir el enlace para restablecer la contraseña.
  // La respuesta es la misma exista o no la cuenta, para no revelar qué correos están registrados.
  solicitarRecuperacion(correo: string): Observable<ResponseBase<null>> {
    const buscado = correo.trim().toLowerCase();
    const existe = this.cuentas.some((c) => c.cliente.correo.toLowerCase() === buscado);

    if (existe) {
      const token = this.nuevoToken();
      this.tokens = [
        ...this.tokens,
        {
          token,
          correo: buscado,
          expira: Date.now() + MINUTOS_VIGENCIA_ENLACE * 60_000,
          usado: false,
        },
      ];
      this.guardarTokens();

      // Correo simulado: en el TB2 la API enviará este enlace al correo del cliente
      console.info(
        `[Correo simulado] Para: ${buscado} | Enlace: ${location.origin}/restablecer?token=${token}`,
      );
    }

    return of(this.sinDatos()).pipe(delay(300));
  }

  // HU13, escenario 3: al abrir el enlace se revisa si todavía sirve
  validarEnlace(token: string): Observable<ResponseBase<null>> {
    const respuesta = this.tokenVigente(token) ? this.sinDatos() : this.enlaceInvalido();
    return of(respuesta).pipe(delay(300));
  }

  // HU13, escenario 2: guardar la contraseña nueva; el enlace queda usado
  restablecerPassword(token: string, password: string): Observable<ResponseBase<null>> {
    const vigente = this.tokenVigente(token);
    if (!vigente) return of(this.enlaceInvalido()).pipe(delay(300));

    return of(this.sinDatos()).pipe(
      delay(300),
      tap(() => {
        const correo = vigente.correo;
        this.cuentas = this.cuentas.map((c) =>
          c.cliente.correo.toLowerCase() === correo ? { ...c, password } : c,
        );
        // Se invalidan todos los enlaces pendientes de esa cuenta, no solo el usado
        this.tokens = this.tokens.map((t) => (t.correo === correo ? { ...t, usado: true } : t));
        this.guardarClaveNueva(correo, password);
        this.guardarCuentas();
        this.guardarTokens();
      }),
    );
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

  private sinDatos(): ResponseBase<null> {
    return { isSuccess: true, errorCode: '0000', errorMessage: '', data: null };
  }

  private enlaceInvalido(): ResponseBase<null> {
    return { isSuccess: false, errorCode: '0410', errorMessage: ENLACE_INVALIDO, data: null };
  }

  // Un enlace sirve si existe, no se usó y no venció
  private tokenVigente(token: string): ResetToken | undefined {
    return this.tokens.find((t) => t.token === token && !t.usado && t.expira > Date.now());
  }

  private nuevoToken(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  // Simulación: solo se guardan los enlaces pedidos desde el formulario (los de prueba están en el código)
  private guardarTokens(): void {
    const demo = new Set(tokensDemo().map((t) => t.token));
    const solicitados = this.tokens.filter((t) => !demo.has(t.token));
    try {
      localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(solicitados));
    } catch {
      /* sin almacenamiento */
    }
  }

  private cargarTokens(): ResetToken[] {
    try {
      return JSON.parse(localStorage.getItem(RESET_TOKENS_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  // Simulación: las contraseñas cambiadas se guardan aparte para que también apliquen
  // a las cuentas de prueba. Con la API real la contraseña se guarda con hash en el servidor.
  private guardarClaveNueva(correo: string, password: string): void {
    const claves = this.cargarClavesNuevas();
    claves[correo] = password;
    try {
      localStorage.setItem(NEW_PASSWORDS_KEY, JSON.stringify(claves));
    } catch {
      /* sin almacenamiento */
    }
  }

  private cargarClavesNuevas(): Record<string, string> {
    try {
      return JSON.parse(localStorage.getItem(NEW_PASSWORDS_KEY) ?? '{}');
    } catch {
      return {};
    }
  }

  private aplicarClavesNuevas(cuentas: Account[]): Account[] {
    const claves = this.cargarClavesNuevas();
    return cuentas.map((c) => {
      const nueva = claves[c.cliente.correo.toLowerCase()];
      return nueva ? { ...c, password: nueva } : c;
    });
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
