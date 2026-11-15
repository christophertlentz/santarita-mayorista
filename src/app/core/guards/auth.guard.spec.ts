import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

function ejecutar(url: string, roles?: string[]) {
  const route = { data: roles ? { roles } : {} } as unknown as ActivatedRouteSnapshot;
  const state = { url } as RouterStateSnapshot;
  return TestBed.runInInjectionContext(() => authGuard(route, state));
}

describe('authGuard', () => {
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    auth = TestBed.inject(AuthService);
  });

  it('sin sesión redirige al inicio de sesión y recuerda la ruta pedida', () => {
    const resultado = ejecutar('/carrito', ['cliente']) as UrlTree;

    expect(resultado.toString()).toBe('/login?returnUrl=%2Fcarrito');
  });

  it('deja pasar al cliente a las rutas de cliente', async () => {
    await firstValueFrom(auth.login('cliente@santarita.pe', 'Cliente123'));

    expect(ejecutar('/carrito', ['cliente'])).toBe(true);
  });

  it('lleva a cada usuario a la pantalla de su rol si la ruta no le corresponde', async () => {
    await firstValueFrom(auth.login('admin@santarita.pe', 'Admin123'));
    expect((ejecutar('/carrito', ['cliente']) as UrlTree).toString()).toBe('/panel');

    await firstValueFrom(auth.login('cliente@santarita.pe', 'Cliente123'));
    expect((ejecutar('/panel', ['administrador']) as UrlTree).toString()).toBe('/catalogo');
  });
});
