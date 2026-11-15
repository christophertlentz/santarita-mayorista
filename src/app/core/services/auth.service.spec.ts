import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AuthService, RegisterData } from './auth.service';

const NUEVO: RegisterData = {
  tipoDocumento: 'RUC',
  numeroDocumento: '20999888777',
  nombreNegocio: 'Bodega Prueba',
  nombreContacto: 'Persona Prueba',
  direccion: 'Calle Prueba 1',
  telefono: '999888777',
  correo: 'Nuevo@prueba.pe',
  password: 'Prueba123',
};

describe('AuthService', () => {
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    auth = TestBed.inject(AuthService);
  });

  it('inicia sesión con credenciales válidas y guarda la sesión sin la contraseña', async () => {
    const r = await firstValueFrom(auth.login('cliente@santarita.pe', 'Cliente123'));

    expect(r.isSuccess).toBe(true);
    expect(auth.usuario()?.rol).toBe('cliente');
    expect(auth.estaAutenticado()).toBe(true);
    expect(localStorage.getItem('santarita-sesion')).not.toContain('Cliente123');
  });

  it('rechaza credenciales inválidas con el mismo mensaje para correo o contraseña', async () => {
    const malaClave = await firstValueFrom(auth.login('cliente@santarita.pe', 'otra'));
    const malCorreo = await firstValueFrom(auth.login('nadie@santarita.pe', 'Cliente123'));

    expect(malaClave.isSuccess).toBe(false);
    expect(malaClave.errorMessage).toBe('Correo o contraseña incorrectos');
    expect(malCorreo.errorMessage).toBe(malaClave.errorMessage);
    expect(auth.usuario()).toBeNull();
  });

  it('registra un cliente nuevo que luego puede iniciar sesión', async () => {
    const registro = await firstValueFrom(auth.register(NUEVO));
    expect(registro.isSuccess).toBe(true);
    expect(registro.data?.rol).toBe('cliente');
    expect(auth.usuario()).toBeNull(); // registrarse no inicia sesión

    const login = await firstValueFrom(auth.login('nuevo@prueba.pe', 'Prueba123'));
    expect(login.isSuccess).toBe(true);
  });

  it('no registra un documento o correo que ya existe', async () => {
    const mismoDocumento = await firstValueFrom(
      auth.register({ ...NUEVO, numeroDocumento: '10456789012' }),
    );
    const mismoCorreo = await firstValueFrom(
      auth.register({ ...NUEVO, correo: 'cliente@santarita.pe' }),
    );

    expect(mismoDocumento.isSuccess).toBe(false);
    expect(mismoDocumento.errorMessage).toContain('Ya tienes una cuenta');
    expect(mismoCorreo.isSuccess).toBe(false);
  });

  it('cierra la sesión', async () => {
    await firstValueFrom(auth.login('admin@santarita.pe', 'Admin123'));
    auth.logout();

    expect(auth.usuario()).toBeNull();
    expect(localStorage.getItem('santarita-sesion')).toBeNull();
  });

  it('envía a cada rol a su pantalla de inicio', () => {
    expect(auth.rutaInicio('cliente')).toBe('/catalogo');
    expect(auth.rutaInicio('administrador')).toBe('/panel');
    expect(auth.rutaInicio('despachador')).toBe('/panel');
  });
});
