import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, ENLACE_INVALIDO } from '../../../core/services/auth.service';
import { passwordsIgualesValidator } from './passwords-iguales.validator';

type Estado = 'verificando' | 'valido' | 'invalido';

// HU13: pantalla a la que lleva el enlace del correo (/restablecer?token=...)
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-reset-password',
  styleUrl: './reset-password.css',
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private token = this.route.snapshot.queryParamMap.get('token') ?? '';

  readonly mensajeEnlaceInvalido = ENLACE_INVALIDO;

  estado = signal<Estado>('verificando');
  enviando = signal(false);
  errorEnvio = signal('');

  // Misma regla de contraseña que en el registro (HU01): 8 caracteres o más, con letras y números
  form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)]],
      confirmacion: ['', Validators.required],
    },
    { validators: passwordsIgualesValidator },
  );

  constructor() {
    // HU13, escenario 3: al abrir el enlace se revisa si todavía sirve
    if (!this.token) {
      this.estado.set('invalido');
      return;
    }
    this.auth.validarEnlace(this.token).subscribe((r) => {
      this.estado.set(r.isSuccess ? 'valido' : 'invalido');
    });
  }

  get passwordConError(): boolean {
    const control = this.form.controls.password;
    return control.invalid && control.touched;
  }

  get confirmacionConError(): boolean {
    const control = this.form.controls.confirmacion;
    return control.touched && (control.invalid || this.form.hasError('passwordsDistintas'));
  }

  guardar(): void {
    if (this.form.invalid || this.enviando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.errorEnvio.set('');

    this.auth.restablecerPassword(this.token, this.form.getRawValue().password).subscribe((r) => {
      this.enviando.set(false);
      if (r.isSuccess) {
        // HU13, escenario 2: ya puede iniciar sesión con la contraseña nueva
        this.router.navigate(['/login'], { queryParams: { clave: 'ok' } });
      } else if (r.errorCode === '0410') {
        // El enlace venció mientras la pantalla estaba abierta
        this.estado.set('invalido');
      } else {
        this.errorEnvio.set(r.errorMessage);
      }
    });
  }
}
