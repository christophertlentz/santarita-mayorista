import { FormControl, FormGroup } from '@angular/forms';
import { documentoValidator } from './documento.validator';

function validar(tipoDocumento: string, numeroDocumento: string) {
  const grupo = new FormGroup({
    tipoDocumento: new FormControl(tipoDocumento),
    numeroDocumento: new FormControl(numeroDocumento),
  });
  return documentoValidator(grupo);
}

describe('documentoValidator', () => {
  it('acepta un RUC de 11 dígitos que empieza con 10 o 20', () => {
    expect(validar('RUC', '10456789012')).toBeNull();
    expect(validar('RUC', '20123456789')).toBeNull();
  });

  it('rechaza un RUC con otra longitud, otro prefijo o letras', () => {
    expect(validar('RUC', '1045678901')).toEqual({ documentoInvalido: true });
    expect(validar('RUC', '30456789012')).toEqual({ documentoInvalido: true });
    expect(validar('RUC', '1045678901a')).toEqual({ documentoInvalido: true });
  });

  it('acepta un DNI de 8 dígitos y rechaza los demás', () => {
    expect(validar('DNI', '40123456')).toBeNull();
    expect(validar('DNI', '4012345')).toEqual({ documentoInvalido: true });
    expect(validar('DNI', '10456789012')).toEqual({ documentoInvalido: true });
  });

  it('deja el campo vacío a Validators.required', () => {
    expect(validar('RUC', '')).toBeNull();
  });
});
