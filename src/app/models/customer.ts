export interface Customer {
  id: number;
  tipoDocumento: 'RUC' | 'DNI';
  numeroDocumento: string;
  nombreNegocio: string;
  nombreContacto: string;
  direccion: string;
  telefono: string;
  correo: string;
  lineaCredito: number;    // 0 si no tiene línea de crédito
  saldoDeuda: number;      // Cuánto debe actualmente
  rol: 'cliente' | 'administrador' | 'despachador' | 'gerente';
}