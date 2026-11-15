import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

// Pantalla provisional del panel interno: destino del personal al iniciar sesión (HU02).
// Sus funciones (productos, stock, pedidos) se desarrollan en el Sprint 2.
@Component({
  imports: [],
  selector: 'app-panel',
  templateUrl: './panel.html',
})
export class Panel {
  auth = inject(AuthService);
}
