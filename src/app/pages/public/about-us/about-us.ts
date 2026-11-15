import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface HitoHistoria {
  ano: string;
  titulo: string;
  descripcion: string;
  icono: string;
}

interface ValorEmpresa {
  titulo: string;
  descripcion: string;
  icono: string;
}

interface Caserio {
  nombre: string;
  zona: string;
}

@Component({
  selector: 'app-about-us',
  imports: [RouterLink],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  readonly hitos: HitoHistoria[] = [
    {
      ano: '1990s',
      titulo: 'Raíces familiares en la plaza de Olmos',
      descripcion:
        'Iniciamos como una pequeña bodega familiar atendiendo a los vecinos y agricultores de la plaza de Olmos, aprendiendo el valor del servicio y la confianza comunitaria.',
      icono: 'bi-shop-window',
    },
    {
      ano: '2019',
      titulo: 'Nacimiento de Distribuidora Santa Rita S.A.C.',
      descripcion:
        'Aprovechando más de tres décadas de experiencia comercial, dimos el gran paso al mayoreo para abastecer directamente a bodegas y minimarkets de la zona.',
      icono: 'bi-building-check',
    },
    {
      ano: '2022',
      titulo: 'Rutas fijas hacia caseríos',
      descripcion:
        'Ampliamos nuestra flota de reparto hacia los caseríos de Olmos, evitando que los pequeños comerciantes deban viajar a Chiclayo o Motupe a buscar mercadería.',
      icono: 'bi-truck-flatbed',
    },
    {
      ano: '2026',
      titulo: 'Plataforma web mayorista 24/7',
      descripcion:
        'Digitalizamos el proceso comercial con este sistema web para que cualquier bodeguero pueda revisar stock, calcular márgenes y hacer pedidos desde su celular a cualquier hora.',
      icono: 'bi-laptop',
    },
  ];

  readonly valores: ValorEmpresa[] = [
    {
      titulo: 'Calidad Garantizada',
      descripcion:
        'Lotes vigentes, empaques en perfecto estado y marcas de primera línea directo de fábrica. Protegemos la reputación de tu mostrador.',
      icono: 'bi-patch-check-fill',
    },
    {
      titulo: 'Precios Justos y Claros',
      descripcion:
        'Tarifas por volumen transparentes, sin sobreprecios ni costos ocultos de flete. Maximizamos el margen de rentabilidad de cada bodeguero.',
      icono: 'bi-cash-stack',
    },
    {
      titulo: 'Cercanía y Trato Humano',
      descripcion:
        'Somos olmanos trabajando para olmanos. Brindamos una atención cálida, escuchamos tus necesidades y resolvemos tus urgencias de reposición.',
      icono: 'bi-people-fill',
    },
    {
      titulo: 'Apoyo al Comerciante Local',
      descripcion:
        'El bodeguero es el pilar de su caserío. Nuestro compromiso es facilitar su crecimiento continuo con abastecimiento continuo y confiable.',
      icono: 'bi-shield-heart-fill',
    },
  ];

  readonly caseriosAtendidos: Caserio[] = [
    { nombre: 'Olmos (Casco Urbano)', zona: 'Todos los sectores y asentamientos' },
    { nombre: 'Insculás', zona: 'Eje Panamericana Norte' },
    { nombre: 'Corral de Arena', zona: 'Sector Valle Viejo' },
    { nombre: 'El Virrey', zona: 'Zona Norte' },
    { nombre: 'Querpón', zona: 'Valle Agrícola' },
    { nombre: 'Calera Santa Isabel', zona: 'Zona Rural y alrededores' },
  ];
}
