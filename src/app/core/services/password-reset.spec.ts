import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AuthService, ENLACE_INVALIDO } from './auth.service';

// Lee el enlace que el "correo simulado" deja en la consola
function capturarToken(info: ReturnType<typeof vi.spyOn>): string {
  const mensaje = String(info.mock.calls.at(-1)?.[0] ?? '');
  return new URL(mensaje.split('Enlace: ')[1]).searchParams.get('token') ?? '';
}

describe('AuthService – recuperación de contraseña (HU13)', () => {
  let auth: AuthService;
  let info: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorage.clear();
    info = vi.spyOn(console, 'info').mockImplementation(() => {});
    TestBed.configureTestingModule({});
    auth = TestBed.inject(AuthService);
  });

  afterEach(() => info.mockRestore());

  it('responde igual exista o no la cuenta, y solo envía enlace si existe', async () => {
    const existe = await firstValueFrom(auth.solicitarRecuperacion('Cliente@santarita.pe'));
    expect(info).toHaveBeenCalledTimes(1);

    const noExiste = await firstValueFrom(auth.solicitarRecuperacion('nadie@santarita.pe'));
    expect(info).toHaveBeenCalledTimes(1);

    expect(noExiste).toEqual(existe);
    expect(existe.isSuccess).toBe(true);
  });

  it('cambia la contraseña con un enlace vigente; la anterior deja de funcionar', async () => {
    await firstValueFrom(auth.solicitarRecuperacion('cliente@santarita.pe'));
    const token = capturarToken(info);

    expect((await firstValueFrom(auth.validarEnlace(token))).isSuccess).toBe(true);
    expect((await firstValueFrom(auth.restablecerPassword(token, 'NuevaClave1'))).isSuccess).toBe(
      true,
    );

    const conNueva = await firstValueFrom(auth.login('cliente@santarita.pe', 'NuevaClave1'));
    const conAnterior = await firstValueFrom(auth.login('cliente@santarita.pe', 'Cliente123'));
    expect(conNueva.isSuccess).toBe(true);
    expect(conAnterior.isSuccess).toBe(false);
  });

  it('un enlace no se puede usar dos veces', async () => {
    await firstValueFrom(auth.restablecerPassword('demo-valido', 'NuevaClave1'));
    const segundaVez = await firstValueFrom(auth.restablecerPassword('demo-valido', 'OtraClave2'));

    expect(segundaVez.isSuccess).toBe(false);
    expect(segundaVez.errorMessage).toBe(ENLACE_INVALIDO);
  });

  it('rechaza enlaces vencidos, usados o inexistentes con el mismo mensaje', async () => {
    for (const token of ['demo-vencido', 'demo-usado', 'no-existe']) {
      const r = await firstValueFrom(auth.validarEnlace(token));
      expect(r.isSuccess).toBe(false);
      expect(r.errorMessage).toBe(ENLACE_INVALIDO);
    }
  });

  it('al cambiar la contraseña invalida los demás enlaces pendientes de esa cuenta', async () => {
    await firstValueFrom(auth.solicitarRecuperacion('cliente@santarita.pe'));
    const primero = capturarToken(info);
    await firstValueFrom(auth.solicitarRecuperacion('cliente@santarita.pe'));
    const segundo = capturarToken(info);

    await firstValueFrom(auth.restablecerPassword(segundo, 'NuevaClave1'));

    expect((await firstValueFrom(auth.validarEnlace(primero))).isSuccess).toBe(false);
  });

  it('la contraseña nueva se mantiene al recargar la página', async () => {
    await firstValueFrom(auth.restablecerPassword('demo-valido', 'NuevaClave1'));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const recargado = TestBed.inject(AuthService);

    const r = await firstValueFrom(recargado.login('cliente@santarita.pe', 'NuevaClave1'));
    expect(r.isSuccess).toBe(true);
  });
});
