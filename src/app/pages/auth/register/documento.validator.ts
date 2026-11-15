import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador de grupo: necesita leer dos campos (el tipo de documento y el número).
// RUC: 11 dígitos y empieza con 10 o 20. DNI: 8 dígitos.
export const documentoValidator: ValidatorFn = (
  grupo: AbstractControl,
): ValidationErrors | null => {
  const tipo = grupo.get('tipoDocumento')?.value;
  const numero: string = grupo.get('numeroDocumento')?.value ?? '';

  if (!numero) return null; // de eso se encarga Validators.required

  const valido = tipo === 'RUC' ? /^(10|20)\d{9}$/.test(numero) : /^\d{8}$/.test(numero);
  return valido ? null : { documentoInvalido: true };
};
