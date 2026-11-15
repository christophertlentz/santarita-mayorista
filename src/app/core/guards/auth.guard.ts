import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Rol } from '../services/auth.service';

// Protege las rutas privadas.
// - Sin sesión: redirige al inicio de sesión (HU02, escenario 3) y recuerda la URL pedida.
// - Con sesión pero con un rol que la ruta no permite (data.roles): lo lleva a la pantalla de su rol.
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const usuario = auth.usuario();

  if (!usuario) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  const roles = route.data['roles'] as Rol[] | undefined;
  if (roles && !roles.includes(usuario.rol)) {
    return router.createUrlTree([auth.rutaInicio(usuario.rol)]);
  }

  return true;
};
