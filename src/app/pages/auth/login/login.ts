import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, Rol } from '../../../core/services/auth.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  enviando = signal(false);
  errorLogin = signal('');

  // HU01, escenario 1: mensaje de confirmación al llegar desde el registro
  registroExitoso = this.route.snapshot.queryParamMap.get('registro') === 'ok';

  // HU13, escenario 2: mensaje al llegar después de crear una contraseña nueva
  claveActualizada = this.route.snapshot.queryParamMap.get('clave') === 'ok';

  form = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  mostrarError(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  ingresar(): void {
    if (this.form.invalid || this.enviando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.errorLogin.set('');

    const { correo, password } = this.form.getRawValue();

    this.auth.login(correo, password).subscribe((respuesta) => {
      this.enviando.set(false);
      if (respuesta.isSuccess && respuesta.data) {
        // HU02, escenario 1: catálogo si es cliente, panel interno si es personal.
        // Si venía de una ruta protegida, vuelve a ella (el guard revisa el rol).
        this.router.navigateByUrl(this.destino(respuesta.data.rol));
      } else {
        this.errorLogin.set(respuesta.errorMessage);
      }
    });
  }

  private destino(rol: Rol): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    // Solo se aceptan rutas internas de la aplicación
    const esInterna = !!returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//');
    return esInterna ? returnUrl : this.auth.rutaInicio(rol);
  }
}
