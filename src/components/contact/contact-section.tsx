"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Phone,
  Instagram,
  Facebook,
  Send,
  Loader2,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phone: z
    .string()
    .min(7, "Ingresa un número de teléfono válido")
    .regex(/^[+]?[\d\s()-]+$/, "Formato de teléfono inválido"),
  subject: z.string().min(1, "Selecciona un asunto"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  contactMethod: z.enum(["whatsapp", "email", "phone"], {
    message: "Selecciona un método de contacto",
  }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const subjectOptions = [
  { value: "plan_turistico", label: "Plan turístico" },
  { value: "alojamiento", label: "Alojamiento" },
  { value: "viaje_grupal", label: "Viaje grupal" },
  { value: "viaje_personalizado", label: "Viaje personalizado" },
  { value: "otro", label: "Otro" },
];

const contactInfo = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+57 300 123 4567",
    href: "https://wa.me/573001234567",
    color: "text-palm",
    bgColor: "bg-palm/10",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@vivetravel.co",
    href: "mailto:info@vivetravel.co",
    color: "text-ocean",
    bgColor: "bg-ocean/10",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Barranquilla, Atlántico, Colombia",
    href: null,
    color: "text-sunset",
    bgColor: "bg-sunset/10",
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun - Sáb: 8:00 AM - 6:00 PM\nDom: 9:00 AM - 1:00 PM",
    href: null,
    color: "text-coral",
    bgColor: "bg-coral/10",
  },
];

const socialLinks = [
  {
    icon: Instagram,
    label: "Instagram",
    href: "#",
    hoverColor: "hover:bg-sunset",
  },
  {
    icon: Facebook,
    label: "Facebook",
    href: "#",
    hoverColor: "hover:bg-ocean",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "https://wa.me/573001234567",
    hoverColor: "hover:bg-palm",
  },
];

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      contactMethod: "whatsapp",
    },
  });

  async function onSubmit(_data: ContactFormValues) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success("Mensaje enviado", {
      description: "Te contactaremos pronto. ¡Gracias por escribirnos!",
    });
    form.reset();
  }

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-ocean/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sunset/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-palm/5 rounded-full" />
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 opacity-[0.03]">
          <Waves className="w-full h-32 text-ocean" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ocean/10 text-ocean text-sm font-medium mb-4">
            <MessageCircle className="w-4 h-4" />
            Contáctanos
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            ¿Listo para tu{" "}
            <span className="text-ocean">próxima aventura</span>?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Estamos aquí para ayudarte a planear el viaje perfecto. Escríbenos y
            te responderemos lo antes posible.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: Contact Form */}
          <Card className="lg:col-span-3 border-ocean/10 shadow-lg shadow-ocean/5">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-ocean" />
                Envíanos un mensaje
              </h3>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tu nombre"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="tu@email.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Phone & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+57 300 123 4567"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Asunto</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona un asunto" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjectOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Cuéntanos sobre el viaje que tienes en mente..."
                            className="min-h-[120px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Preferred Contact Method */}
                  <FormField
                    control={form.control}
                    name="contactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de contacto preferido</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-4"
                          >
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:border-palm/50 hover:bg-palm/5 transition-colors cursor-pointer has-[data-state=checked]:border-palm has-[data-state=checked]:bg-palm/10">
                              <RadioGroupItem value="whatsapp" id="whatsapp" />
                              <label
                                htmlFor="whatsapp"
                                className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                              >
                                <MessageCircle className="w-4 h-4 text-palm" />
                                WhatsApp
                              </label>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:border-ocean/50 hover:bg-ocean/5 transition-colors cursor-pointer has-[data-state=checked]:border-ocean has-[data-state=checked]:bg-ocean/10">
                              <RadioGroupItem value="email" id="email" />
                              <label
                                htmlFor="email"
                                className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                              >
                                <Mail className="w-4 h-4 text-ocean" />
                                Email
                              </label>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:border-sunset/50 hover:bg-sunset/5 transition-colors cursor-pointer has-[data-state=checked]:border-sunset has-[data-state=checked]:bg-sunset/10">
                              <RadioGroupItem value="phone" id="phone" />
                              <label
                                htmlFor="phone"
                                className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                              >
                                <Phone className="w-4 h-4 text-sunset" />
                                Teléfono
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-ocean hover:bg-ocean-dark text-white rounded-full px-8 py-3 text-base font-medium shadow-lg shadow-ocean/25 transition-all duration-300 hover:shadow-xl hover:shadow-ocean/30"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar mensaje
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Right: Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Direct Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <Card
                  key={item.label}
                  className="border-border/50 hover:border-ocean/20 transition-all duration-300 hover:shadow-md group"
                >
                  <CardContent className="p-4 sm:p-5">
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="flex items-start gap-4"
                      >
                        <div
                          className={`${item.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                        >
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-muted-foreground">
                            {item.label}
                          </p>
                          <p className="text-foreground font-semibold whitespace-pre-line">
                            {item.value}
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div
                          className={`${item.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                        >
                          <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-muted-foreground">
                            {item.label}
                          </p>
                          <p className="text-foreground font-semibold whitespace-pre-line">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Social Media */}
            <Card className="border-border/50">
              <CardContent className="p-4 sm:p-5">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Síguenos en redes sociales
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={link.label}
                      className={`w-11 h-11 rounded-full bg-muted flex items-center justify-center transition-all duration-300 ${link.hoverColor} hover:text-white`}
                    >
                      <link.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp CTA */}
            <Card className="bg-gradient-to-br from-palm/10 to-ocean/10 border-palm/20">
              <CardContent className="p-5 sm:p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-palm/20 flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-7 h-7 text-palm" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  ¿Prefieres chatear?
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Escríbenos por WhatsApp y recibe atención inmediata.
                </p>
                <Button
                  asChild
                  className="bg-palm hover:bg-palm-light text-white rounded-full px-6"
                >
                  <a
                    href="https://wa.me/573001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chatear ahora
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
