import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador de grupo: la confirmación debe ser igual a la contraseña nueva (HU13, escenario 2)
export const passwordsIgualesValidator: ValidatorFn = (
  grupo: AbstractControl,
): ValidationErrors | null => {
  const password = grupo.get('password')?.value ?? '';
  const confirmacion = grupo.get('confirmacion')?.value ?? '';

  if (!confirmacion) return null; // de eso se encarga Validators.required

  return password === confirmacion ? null : { passwordsDistintas: true };
};
