import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Pantalla del panel interno: destino del personal al iniciar sesión (HU02).
// Desde aquí el administrador entra al mantenimiento de productos (HU08).
@Component({
  imports: [RouterLink],
  selector: 'app-panel',
  templateUrl: './panel.html',
})
export class Panel {
  auth = inject(AuthService);
}