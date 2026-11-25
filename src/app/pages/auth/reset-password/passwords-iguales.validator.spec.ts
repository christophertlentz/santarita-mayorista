import { FormControl, FormGroup } from '@angular/forms';
import { passwordsIgualesValidator } from './passwords-iguales.validator';

function validar(password: string, confirmacion: string) {
  const grupo = new FormGroup({
    password: new FormControl(password),
    confirmacion: new FormControl(confirmacion),
  });
  return passwordsIgualesValidator(grupo);
}

describe('passwordsIgualesValidator', () => {
  it('acepta cuando las dos contraseñas son iguales', () => {
    expect(validar('NuevaClave1', 'NuevaClave1')).toBeNull();
  });

  it('marca error cuando no coinciden', () => {
    expect(validar('NuevaClave1', 'NuevaClave2')).toEqual({ passwordsDistintas: true });
  });

  it('no marca error mientras la confirmación esté vacía', () => {
    expect(validar('NuevaClave1', '')).toBeNull();
  });
});
