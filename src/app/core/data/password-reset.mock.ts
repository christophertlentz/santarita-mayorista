// HU13: enlaces de recuperación de contraseña simulados.
// En el TB2 la API genera el token, guarda solo su hash y envía el enlace por correo.

export const MINUTOS_VIGENCIA_ENLACE = 30;

export interface ResetToken {
  token: string;
  correo: string;
  expira: number; // fecha de vencimiento en milisegundos (Date.now())
  usado: boolean;
}

// Enlaces de prueba para mostrar los tres escenarios de HU13 sin esperar 30 minutos:
//   /restablecer?token=demo-valido   → permite cambiar la contraseña de cliente@santarita.pe
//   /restablecer?token=demo-vencido  → venció hace una hora
//   /restablecer?token=demo-usado    → ya se usó
export function tokensDemo(ahora = Date.now()): ResetToken[] {
  const vigencia = MINUTOS_VIGENCIA_ENLACE * 60_000;
  return [
    {
      token: 'demo-valido',
      correo: 'cliente@santarita.pe',
      expira: ahora + vigencia,
      usado: false,
    },
    {
      token: 'demo-vencido',
      correo: 'cliente@santarita.pe',
      expira: ahora - 3_600_000,
      usado: false,
    },
    { token: 'demo-usado', correo: 'cliente@santarita.pe', expira: ahora + vigencia, usado: true },
  ];
}
