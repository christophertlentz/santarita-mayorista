import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { documentoValidator } from './documento.validator';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  enviando = signal(false);
  errorRegistro = signal(''); // HU01, escenario 3: la cuenta ya existe

  form = this.fb.nonNullable.group(
    {
      tipoDocumento: ['RUC' as 'RUC' | 'DNI', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombreNegocio: ['', Validators.required],
      nombreContacto: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)]],
      aceptaPrivacidad: [false, Validators.requiredTrue],
    },
    { validators: documentoValidator },
  );

  // El error se muestra al salir del campo (HU01, escenario 2)
  mostrarError(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  // El documento también depende del validador de grupo
  get documentoConError(): boolean {
    const control = this.form.controls.numeroDocumento;
    return control.touched && (control.invalid || this.form.hasError('documentoInvalido'));
  }

  get esRuc(): boolean {
    return this.form.controls.tipoDocumento.value === 'RUC';
  }

  registrar(): void {
    if (this.form.invalid || this.enviando()) return;

    this.enviando.set(true);
    this.errorRegistro.set('');

    const { aceptaPrivacidad, ...datos } = this.form.getRawValue();

    this.auth.register(datos).subscribe((respuesta) => {
      this.enviando.set(false);
      if (respuesta.isSuccess) {
        // HU01, escenario 1: va al inicio de sesión con un mensaje de confirmación
        this.router.navigate(['/login'], { queryParams: { registro: 'ok' } });
      } else {
        this.errorRegistro.set(respuesta.errorMessage);
      }
    });
  }
}
