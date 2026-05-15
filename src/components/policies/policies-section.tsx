"use client";

import {
  ScrollText,
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  CheckCircle2,
  PenLine,
  ClipboardList,
  XCircle,
  Clock,
  UserX,
  RefreshCcw,
  AlertTriangle,
  FileText,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PolicyItem {
  id: string;
  icon: React.ElementType;
  title: string;
  content: React.ReactNode;
}

const bookingPolicies: PolicyItem[] = [
  {
    id: "booking-process",
    icon: CalendarCheck,
    title: "Proceso de Reserva",
    content: (
      <div className="space-y-3">
        <p>
          Para realizar una reserva con Vive Travel, sigue estos pasos:
        </p>
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>
            Selecciona el plan turístico o alojamiento de tu preferencia a
            través de nuestro sitio web o contacto directo.
          </li>
          <li>
            Completa el formulario de reserva con tus datos personales y los
            detalles del viaje.
          </li>
          <li>
            Recibirás una cotización personalizada por correo electrónico o
            WhatsApp en un plazo máximo de 24 horas.
          </li>
          <li>
            Una vez confirmes la cotización, se generará tu reserva provisional.
          </li>
          <li>
            Realiza el pago inicial según las condiciones indicadas para
            confirmar tu reserva.
          </li>
        </ol>
        <p className="text-muted-foreground text-sm mt-2">
          Las reservas provisionales tienen una vigencia de 48 horas. Si no se
          recibe el pago en este plazo, la reserva será cancelada automáticamente.
        </p>
      </div>
    ),
  },
  {
    id: "payments",
    icon: CreditCard,
    title: "Pagos y Formas de Pago",
    content: (
      <div className="space-y-3">
        <p>Aceptamos las siguientes formas de pago:</p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>Transferencia bancaria (Bancolombia, Davivienda, BBVA)</li>
          <li>PSE – Pagos Seguros en Línea</li>
          <li>Tarjetas de crédito y débito (Visa, Mastercard)</li>
          <li>Nequi y Daviplata</li>
          <li>Efectivo en nuestra oficina</li>
        </ul>
        <div className="bg-muted/50 rounded-lg p-4 mt-3">
          <p className="font-medium text-foreground text-sm">
            Plan de pagos diferido
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Para planes turísticos con valor superior a $1,000,000 COP,
            ofrecemos la opción de pago en cuotas: 40% al momento de la reserva,
            30% a los 15 días y 30% restante 5 días antes del viaje.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Todos los precios incluyen IVA cuando aplica. Los precios están
          sujetos a cambio sin previo aviso hasta que la reserva sea confirmada.
        </p>
      </div>
    ),
  },
  {
    id: "confirmations",
    icon: CheckCircle2,
    title: "Confirmación de Reserva",
    content: (
      <div className="space-y-3">
        <p>
          Tu reserva será considerada <strong>confirmada</strong> cuando:
        </p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>
            Hayas recibido el correo electrónico de confirmación con el número
            de reserva asignado.
          </li>
          <li>
            Se haya recibido y verificado el pago inicial correspondiente.
          </li>
          <li>
            Se hayan enviado los documentos de viaje (itinerario, vouchers,
            información del alojamiento).
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          La confirmación suele realizarse en un plazo de 24 a 48 horas hábiles
          después de recibido el pago. Te recomendamos revisar todos los datos
          del itinerario y contactarnos de inmediato si encuentras alguna
          discrepancia.
        </p>
      </div>
    ),
  },
  {
    id: "modifications",
    icon: PenLine,
    title: "Modificaciones y Cambios",
    content: (
      <div className="space-y-3">
        <p>
          Entendemos que los planes pueden cambiar. Puedes solicitar
          modificaciones a tu reserva bajo las siguientes condiciones:
        </p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>
            <strong>Cambios de fecha:</strong> Permitidos hasta 7 días antes
            del viaje, sujeto a disponibilidad. Pueden aplicarse tarifas
            diferenciales.
          </li>
          <li>
            <strong>Cambio de plan:</strong> Posible hasta 5 días antes del
            viaje, sujeto a disponibilidad y diferencia de precio.
          </li>
          <li>
            <strong>Cambio de viajero:</strong> Se permite cambiar el nombre
            del viajero hasta 3 días antes del viaje sin costo adicional.
          </li>
          <li>
            <strong>Adición de servicios:</strong> Puedes agregar servicios
            complementarios en cualquier momento, sujeto a disponibilidad.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Todas las modificaciones deben solicitarse por escrito (correo
          electrónico o WhatsApp) y serán confirmadas por nuestro equipo.
        </p>
      </div>
    ),
  },
  {
    id: "requirements",
    icon: ClipboardList,
    title: "Requisitos para Viajeros",
    content: (
      <div className="space-y-3">
        <p>
          Es responsabilidad del viajero cumplir con los siguientes requisitos:
        </p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>
            <strong>Documentación:</strong> Cédula de ciudadanía o pasaporte
            vigente según el destino. Para menores de edad, registro civil y
            permiso de salida del país si aplica.
          </li>
          <li>
            <strong>Salud:</strong> Vacunas requeridas según el destino
            (consultar con anticipación). Seguro de viaje obligatorio para
            destinos internacionales.
          </li>
          <li>
            <strong>Información médica:</strong> Informar sobre condiciones
            médicas preexistentes, alergias o necesidades especiales al momento
            de la reserva.
          </li>
          <li>
            <strong>Edad mínima:</strong> Los menores de 18 años deben viajar
            acompañados por un adulto responsable o contar con autorización
            notariada.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Vive Travel no se hace responsable por la denegación de ingreso a
          destinos nacionales o internacionales por incumplimiento de requisitos
          documentales o de salud.
        </p>
      </div>
    ),
  },
];

const cancellationPolicies: PolicyItem[] = [
  {
    id: "early-cancellation",
    icon: Clock,
    title: "Cancelaciones Anticipadas",
    content: (
      <div className="space-y-3">
        <p>
          Las cancelaciones realizadas con suficiente anticipación tendrán las
          siguientes condiciones de reembolso:
        </p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>
            <strong>Más de 15 días antes del viaje:</strong> Reembolso del 90%
            del valor pagado (se retiene 10% por gastos administrativos).
          </li>
          <li>
            <strong>Entre 10 y 15 días antes del viaje:</strong> Reembolso del
            70% del valor pagado.
          </li>
          <li>
            <strong>Entre 7 y 9 días antes del viaje:</strong> Reembolso del
            50% del valor pagado.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Los reembolsos se procesarán en un plazo de 5 a 10 días hábiles por el
          mismo medio de pago utilizado.
        </p>
      </div>
    ),
  },
  {
    id: "late-cancellation",
    icon: XCircle,
    title: "Cancelaciones Tardías",
    content: (
      <div className="space-y-3">
        <p>
          Las cancelaciones realizadas con menos de 7 días de anticipación
          están sujetas a las siguientes condiciones:
        </p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>
            <strong>Entre 3 y 6 días antes del viaje:</strong> Reembolso del
            25% del valor pagado.
          </li>
          <li>
            <strong>Menos de 3 días antes del viaje:</strong> No aplica
            reembolso.
          </li>
        </ul>
        <div className="bg-muted/50 rounded-lg p-4 mt-3 border border-border">
          <p className="font-medium text-foreground text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            Nota importante
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Los gastos no reembolsables de proveedores (hoteles, transporte,
            actividades) serán descontados del monto a reembolsar en todos los
            casos. Te recomendamos contratar un seguro de cancelación al momento
            de reservar.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "no-show",
    icon: UserX,
    title: "No Show (No Presentación)",
    content: (
      <div className="space-y-3">
        <p>
          Se considera <strong>No Show</strong> cuando el viajero no se
          presenta al servicio reservado sin haber realizado una cancelación
          previa.
        </p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>
            No aplica ningún tipo de reembolso en caso de No Show.
          </li>
          <li>
            No se permite la reprogramación del servicio sin costo.
          </li>
          <li>
            Los servicios no utilizados (comidas, excursiones, alojamiento) no
            serán reembolsables ni acumulables.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          Si anticipas que no podrás asistir, te recomendamos cancelar o
          modificar tu reserva con la mayor antelación posible para minimizar
          pérdidas.
        </p>
      </div>
    ),
  },
  {
    id: "refunds",
    icon: RefreshCcw,
    title: "Proceso de Reembolsos",
    content: (
      <div className="space-y-3">
        <p>
          Los reembolsos siguen el siguiente proceso:
        </p>
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>
            Solicitar el reembolso por escrito a{" "}
            <a
              href="mailto:info@vivetravel.co"
              className="text-foreground underline underline-offset-2"
            >
              info@vivetravel.co
            </a>{" "}
            o por WhatsApp indicando el número de reserva.
          </li>
          <li>
            Nuestro equipo verificará la solicitud y calculará el monto
            reembolsable según la política correspondiente.
          </li>
          <li>
            Recibirás una confirmación por correo con el detalle del reembolso.
          </li>
          <li>
            El reembolso se procesará en un plazo de 5 a 10 días hábiles.
          </li>
        </ol>
        <ul className="list-disc list-inside space-y-1.5 ml-2 text-sm text-muted-foreground">
          <li>
            Los reembolsos se realizan por el mismo medio de pago original.
          </li>
          <li>
            Transferencias bancarias pueden tardar hasta 15 días hábiles en
            reflejarse.
          </li>
          <li>
            No se realizan reembolsos en efectivo en oficina para pagos
            electrónicos.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "force-majeure",
    icon: AlertTriangle,
    title: "Fuerza Mayor y Circunstancias Excepcionales",
    content: (
      <div className="space-y-3">
        <p>
          En caso de eventos de fuerza mayor, se aplicarán las siguientes
          disposiciones:
        </p>
        <p>
          Se consideran fuerza mayor: desastres naturales, epidemias,
          declaraciones de emergencia por autoridades gubernamentales,
          conflictos armados, huelgas generales, y eventos similares que
          imposibiliten la prestación del servicio.
        </p>
        <ul className="list-disc list-inside space-y-1.5 ml-2">
          <li>
            <strong>Cancelación por Vive Travel:</strong> Si cancelamos el
            viaje por fuerza mayor, ofreceremos reprogramación sin costo o
            reembolso del 100% del valor pagado.
          </li>
          <li>
            <strong>Cancelación por el viajero por fuerza mayor:</strong> Se
            evaluará caso por caso. Podrá aplicar reembolso parcial sujeto a
            los costos ya incurridos con proveedores.
          </li>
          <li>
            <strong>Interrupción del viaje:</strong> Si el viaje se interrumpe
            por fuerza mayor una vez iniciado, se reembolsará la parte
            proporcional de los servicios no utilizados, menos los costos no
            recuperables.
          </li>
        </ul>
        <div className="bg-muted/50 rounded-lg p-4 mt-3">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Recomendación:</strong> Siempre
            recomendamos adquirir un seguro de viaje que cubra cancelaciones por
            fuerza mayor. Podemos asesorarte en la selección del seguro más
            adecuado para tu destino.
          </p>
        </div>
      </div>
    ),
  },
];

function PolicyAccordion({
  items,
  type = "single",
}: {
  items: PolicyItem[];
  type?: "single" | "multiple";
}) {
  return (
    <Accordion
      type={type}
      collapsible={type === "single"}
      className="w-full"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="border-border/50 px-1"
          >
            <AccordionTrigger className="hover:no-underline hover:text-foreground transition-colors py-4">
              <span className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <span className="font-semibold text-sm">{item.title}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
              <div className="pl-11">{item.content}</div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export function PoliciesSection() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-80 h-80 bg-muted/20 rounded-full translate-x-1/3" />
        <div className="absolute bottom-40 left-0 w-64 h-64 bg-muted/15 rounded-full -translate-x-1/4" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs font-medium tracking-wider uppercase mb-4">
            <ScrollText className="w-3.5 h-3.5" />
            Políticas
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Políticas de{" "}
            <span className="text-foreground">Reserva y Cancelación</span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Es importante que conozcas nuestras políticas antes de realizar tu
            reserva. Estamos comprometidos con la transparencia y tu
            satisfacción.
          </p>
        </div>

        {/* Booking Policies */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Políticas de Reserva
              </h3>
              <p className="text-sm text-muted-foreground">
                Condiciones para realizar y gestionar tu reserva
              </p>
            </div>
          </div>

          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <PolicyAccordion items={bookingPolicies} />
            </CardContent>
          </Card>
        </div>

        {/* Cancellation Policies */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center">
              <FileText className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Políticas de Cancelación
              </h3>
              <p className="text-sm text-muted-foreground">
                Condiciones para cancelaciones, reembolsos y casos especiales
              </p>
            </div>
          </div>

          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <PolicyAccordion items={cancellationPolicies} />
            </CardContent>
          </Card>
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center">
          <Separator className="mb-8" />
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Si tienes alguna pregunta sobre nuestras políticas, no dudes en{" "}
            <a
              href="mailto:info@vivetravel.co"
              className="text-foreground underline underline-offset-2 font-medium"
            >
              contactarnos
            </a>
            . Estamos aquí para ayudarte.
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Última actualización: Enero 2025. Las políticas están sujetas a
            cambios sin previo aviso.
          </p>
        </div>
      </div>
    </section>
  );
}
