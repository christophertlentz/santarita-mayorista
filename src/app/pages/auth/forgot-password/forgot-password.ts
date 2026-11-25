import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MINUTOS_VIGENCIA_ENLACE } from '../../../core/data/password-reset.mock';

// HU13: "Olvidé mi contraseña"
@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-forgot-password',
  styleUrl: './forgot-password.css',
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  readonly minutosVigencia = MINUTOS_VIGENCIA_ENLACE;

  enviando = signal(false);
  enviado = signal(false);

  form = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
  });

  get correoConError(): boolean {
    const control = this.form.controls.correo;
    return control.invalid && control.touched;
  }

  solicitar(): void {
    if (this.form.invalid || this.enviando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);

    this.auth.solicitarRecuperacion(this.form.getRawValue().correo).subscribe(() => {
      // HU13, escenario 1: el mismo mensaje exista o no la cuenta
      this.enviando.set(false);
      this.enviado.set(true);
    });
  }
}
