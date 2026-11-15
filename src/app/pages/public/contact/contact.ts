import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface InfoContacto {
  icono: string;
  titulo: string;
  lineaPrincipal: string;
  lineaSecundaria: string;
  badge?: string;
  enlaceAccion?: {
    texto: string;
    url: string;
    esExterno: boolean;
  };
}

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private fb = inject(FormBuilder);

  // Estados reactivos con Signals
  enviando = signal(false);
  enviadoConExito = signal(false);
  ultimoEnvio = signal<{
    nombreNegocio: string;
    nombreContacto: string;
    asunto: string;
  } | null>(null);

  // Formulario reactivo con tipado estricto
  form = this.fb.nonNullable.group({
    nombreNegocio: ['', [Validators.required, Validators.minLength(3)]],
    nombreContacto: ['', [Validators.required, Validators.minLength(3)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
    asunto: ['', Validators.required],
    mensaje: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(600)]],
  });

  // Asuntos predefinidos para agilizar al bodeguero
  readonly asuntosDisponibles: string[] = [
    'Consulta sobre precios y pedidos por volumen',
    'Dudas sobre registro de bodega / cuenta mayorista',
    'Consulta sobre cobertura y reparto en caseríos',
    'Solicitud de visita comercial o cotización especial',
    'Estado o seguimiento de un pedido',
    'Otro motivo o sugerencia',
  ];

  // Datos institucionales de contacto
  readonly datosContacto: InfoContacto[] = [
    {
      icono: 'bi-geo-alt-fill',
      titulo: 'Dirección y Almacén Central',
      lineaPrincipal: 'Calle San Francisco N° 340',
      lineaSecundaria: 'Olmos, Lambayeque, Perú (a 1 cuadra de la plaza principal)',
      badge: 'Atención presencial',
    },
    {
      icono: 'bi-whatsapp',
      titulo: 'Teléfono / WhatsApp Comercial',
      lineaPrincipal: '+51 974 812 345',
      lineaSecundaria: 'Atención rápida para pedidos y emergencias de stock',
      enlaceAccion: {
        texto: 'Enviar WhatsApp directo',
        url: 'https://wa.me/51974812345?text=Hola%2C%20tengo%20una%20consulta%20sobre%20pedidos%20en%20Distribuidora%20Santa%20Rita',
        esExterno: true,
      },
    },
    {
      icono: 'bi-envelope-at-fill',
      titulo: 'Correo Institucional',
      lineaPrincipal: 'contacto@distribuidorasantarita.pe',
      lineaSecundaria: 'ventas@distribuidorasantarita.pe',
      enlaceAccion: {
        texto: 'Escribir por correo',
        url: 'mailto:contacto@distribuidorasantarita.pe',
        esExterno: true,
      },
    },
    {
      icono: 'bi-clock-fill',
      titulo: 'Horario de Atención Comercial',
      lineaPrincipal: 'Lunes a Sábado: 6:30 a.m. – 7:30 p.m.',
      lineaSecundaria: 'Domingos: 7:00 a.m. – 1:00 p.m. (Horario especial)',
      badge: 'Apertura temprana',
    },
  ];

  // Métodos de validación accesibles para la plantilla
  mostrarError(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  obtenerMensajeError(campo: keyof typeof this.form.controls): string {
    const control = this.form.controls[campo];
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('minlength')) {
      const min = control.errors?.['minlength'].requiredLength;
      return `Debe ingresar al menos ${min} caracteres.`;
    }
    if (control.hasError('email')) return 'Ingrese un correo electrónico válido (ejemplo: contacto@bodega.pe).';
    if (control.hasError('pattern') && campo === 'telefono') {
      return 'Ingrese un número celular válido de 9 dígitos que inicie con 9.';
    }
    return 'Dato incorrecto.';
  }

  // Envío del formulario
  enviar(): void {
    if (this.form.invalid || this.enviando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);

    const valores = this.form.getRawValue();

    // Simulación de envío con tiempo de respuesta realista
    setTimeout(() => {
      this.enviando.set(false);
      this.ultimoEnvio.set({
        nombreNegocio: valores.nombreNegocio,
        nombreContacto: valores.nombreContacto,
        asunto: valores.asunto,
      });
      this.enviadoConExito.set(true);
      this.form.reset();
    }, 900);
  }

  // Reiniciar formulario para enviar otro mensaje
  reiniciar(): void {
    this.enviadoConExito.set(false);
    this.ultimoEnvio.set(null);
    this.form.reset();
  }
}
