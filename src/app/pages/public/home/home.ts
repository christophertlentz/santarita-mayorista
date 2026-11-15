import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface Beneficio {
  titulo: string;
  descripcion: string;
  icono: string;
}

interface CategoriaDestacada {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  badge: string;
  ejemplos: string;
}

interface PasoCompra {
  numero: number;
  titulo: string;
  descripcion: string;
  icono: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected auth = inject(AuthService);

  readonly beneficios: Beneficio[] = [
    {
      titulo: 'Pedidos 24/7 desde el celular',
      descripcion:
        'Pide a cualquier hora del día o de la noche. Sin esperar al preventista ni lidiar con líneas ocupadas.',
      icono: 'bi-phone',
    },
    {
      titulo: 'Precios claros por volumen',
      descripcion:
        'Precios transparentes por unidad, paquete y caja con escalas de descuento automáticas para proteger tu ganancia.',
      icono: 'bi-tags',
    },
    {
      titulo: 'Entrega puntual en Olmos y caseríos',
      descripcion:
        'Despacho directo y seguro hasta la puerta de tu bodega o minimarket en el casco urbano de Olmos y caseríos aledaños.',
      icono: 'bi-truck',
    },
    {
      titulo: 'Surtido y marcas de confianza',
      descripcion:
        'Productos originales de alta rotación con fecha de vencimiento óptima, directo de fabricantes líderes.',
      icono: 'bi-shield-check',
    },
  ];

  readonly categorias: CategoriaDestacada[] = [
    {
      id: 'Abarrotes',
      nombre: 'Abarrotes',
      descripcion: 'Productos indispensables de consumo diario para el hogar y la canasta familiar.',
      icono: 'bi-basket2-fill',
      badge: 'Básicos de bodega',
      ejemplos: 'Arroz, azúcar, fideos, aceites, harinas y menestras',
    },
    {
      id: 'Bebidas',
      nombre: 'Bebidas',
      descripcion: 'Variedad en gaseosas, aguas purificadas y refrescos al por mayor.',
      icono: 'bi-cup-straw',
      badge: 'Packs mayoristas',
      ejemplos: 'Gaseosas 3 L, agua mineral, néctares y rehidratantes',
    },
    {
      id: 'Lácteos y conservas',
      nombre: 'Lácteos y conservas',
      descripcion: 'Alimentos envasados de alta duración y demanda diaria ininterrumpida.',
      icono: 'bi-inboxes-fill',
      badge: 'Por caja x48',
      ejemplos: 'Leche evaporada, atún en aceite, conservas y leche condensada',
    },
    {
      id: 'Limpieza',
      nombre: 'Limpieza',
      descripcion: 'Insumos de aseo y desinfección en presentaciones familiares y comerciales.',
      icono: 'bi-stars',
      badge: 'Higiene del hogar',
      ejemplos: 'Detergente en polvo, lejía 1 L, jabones de lavar y desinfectantes',
    },
    {
      id: 'Cuidado personal',
      nombre: 'Cuidado personal',
      descripcion: 'Artículos de higiene personal de alta frecuencia de compra en mostrador.',
      icono: 'bi-person-heart',
      badge: 'Cajas x72',
      ejemplos: 'Jabón de tocador, champús en frasco y sachet, cremas dentales',
    },
    {
      id: 'Golosinas',
      nombre: 'Golosinas',
      descripcion: 'Snacks y golosinas que generan compra por impulso y excelente rentabilidad.',
      icono: 'bi-gift-fill',
      badge: 'Margen rápido',
      ejemplos: 'Galletas de soda y dulces, barras de chocolate, caramelos y snacks',
    },
  ];

  readonly pasosCompra: PasoCompra[] = [
    {
      numero: 1,
      titulo: 'Crea tu cuenta mayorista',
      descripcion:
        'Regístrate gratis con tu RUC o DNI en menos de 2 minutos para acceder a la lista de precios mayoristas.',
      icono: 'bi-person-vcard',
    },
    {
      numero: 2,
      titulo: 'Arma tu pedido por volumen',
      descripcion:
        'Selecciona unidades, paquetes o fardos cerrados. Mira el total de tu compra al instante sin sorpresas.',
      icono: 'bi-cart-check',
    },
    {
      numero: 3,
      titulo: 'Recibe en la puerta de tu local',
      descripcion:
        'Despachamos puntualmente en Olmos y caseríos con comprobante electrónico y opción de pago contra entrega.',
      icono: 'bi-shop',
    },
  ];
}
