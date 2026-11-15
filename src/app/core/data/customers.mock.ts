import { Customer } from '../../models/customer';

// Cuenta simulada: el cliente más su contraseña.
// En el TB1 la contraseña va en texto plano porque no hay backend;
// con la API real la validación se hará en el servidor.
export interface Account {
  cliente: Customer;
  password: string;
}

// Cuentas de prueba (datos ficticios), una por rol
export const ACCOUNTS_MOCK: Account[] = [
  {
    cliente: {
      id: 1,
      tipoDocumento: 'RUC',
      numeroDocumento: '10456789012',
      nombreNegocio: 'Bodega Doña Rosa',
      nombreContacto: 'Rosa Fernández',
      direccion: 'Av. Augusto B. Leguía 123, Olmos',
      telefono: '987654321',
      correo: 'cliente@santarita.pe',
      lineaCredito: 1500,
      saldoDeuda: 0,
      rol: 'cliente',
    },
    password: 'Cliente123',
  },
  {
    cliente: {
      id: 2,
      tipoDocumento: 'DNI',
      numeroDocumento: '40123456',
      nombreNegocio: 'Distribuidora Santa Rita',
      nombreContacto: 'Ana Torres',
      direccion: 'Olmos, Lambayeque',
      telefono: '912345678',
      correo: 'admin@santarita.pe',
      lineaCredito: 0,
      saldoDeuda: 0,
      rol: 'administrador',
    },
    password: 'Admin123',
  },
  {
    cliente: {
      id: 3,
      tipoDocumento: 'DNI',
      numeroDocumento: '41234567',
      nombreNegocio: 'Distribuidora Santa Rita',
      nombreContacto: 'Luis Ramos',
      direccion: 'Olmos, Lambayeque',
      telefono: '923456789',
      correo: 'despacho@santarita.pe',
      lineaCredito: 0,
      saldoDeuda: 0,
      rol: 'despachador',
    },
    password: 'Despacho123',
  },
  {
    cliente: {
      id: 4,
      tipoDocumento: 'DNI',
      numeroDocumento: '42345678',
      nombreNegocio: 'Distribuidora Santa Rita',
      nombreContacto: 'Carmen Díaz',
      direccion: 'Olmos, Lambayeque',
      telefono: '934567890',
      correo: 'gerencia@santarita.pe',
      lineaCredito: 0,
      saldoDeuda: 0,
      rol: 'gerente',
    },
    password: 'Gerente123',
  },
];
