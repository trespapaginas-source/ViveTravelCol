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
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@vivetravel.co",
    href: "mailto:info@vivetravel.co",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: "Barranquilla, Atlántico, Colombia",
    href: null,
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun - Sáb: 8:00 AM - 6:00 PM\nDom: 9:00 AM - 1:00 PM",
    href: null,
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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success("Mensaje enviado", {
      description: "Te contactaremos pronto. ¡Gracias por escribirnos!",
    });
    form.reset();
  }

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-muted/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-muted/20 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute bottom-0 left-0 right-0 opacity-[0.03]">
          <Waves className="w-full h-32 text-foreground" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground/50 text-xs font-medium tracking-wider uppercase mb-4">
            <MessageCircle className="w-3.5 h-3.5" />
            Contáctanos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            ¿Listo para tu{" "}
            <span className="text-foreground/40">próxima aventura</span>?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Estamos aquí para ayudarte a planear el viaje perfecto. Escríbenos y
            te responderemos lo antes posible.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: Contact Form */}
          <Card className="lg:col-span-3 border-border/50 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <Send className="w-4 h-4 text-muted-foreground/40" />
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
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer has-[data-state=checked]:bg-muted has-[data-state=checked]:border-foreground/20">
                              <RadioGroupItem value="whatsapp" id="whatsapp" />
                              <label
                                htmlFor="whatsapp"
                                className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                              >
                                <MessageCircle className="w-4 h-4 text-muted-foreground/50" />
                                WhatsApp
                              </label>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer has-[data-state=checked]:bg-muted has-[data-state=checked]:border-foreground/20">
                              <RadioGroupItem value="email" id="email" />
                              <label
                                htmlFor="email"
                                className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                              >
                                <Mail className="w-4 h-4 text-muted-foreground/50" />
                                Email
                              </label>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer has-[data-state=checked]:bg-muted has-[data-state=checked]:border-foreground/20">
                              <RadioGroupItem value="phone" id="phone" />
                              <label
                                htmlFor="phone"
                                className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                              >
                                <Phone className="w-4 h-4 text-muted-foreground/50" />
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
                    className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-white rounded-full px-8 py-3 text-base font-medium transition-all duration-300"
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
          <div className="lg:col-span-2 space-y-4">
            {/* Direct Contact Cards */}
            {contactInfo.map((item) => (
              <Card
                key={item.label}
                className="border-border/50 hover:border-border transition-all duration-300 group"
              >
                <CardContent className="p-4">
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-3"
                    >
                      <div className="w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors">
                        <item.icon className="w-4 h-4 text-muted-foreground/60" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground/60 font-medium">
                          {item.label}
                        </p>
                        <p className="text-foreground font-medium text-sm whitespace-pre-line">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-muted-foreground/60" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground/60 font-medium">
                          {item.label}
                        </p>
                        <p className="text-foreground font-medium text-sm whitespace-pre-line">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Social Media */}
            <Card className="border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground/60 font-medium mb-3">
                  Síguenos en redes sociales
                </p>
                <div className="flex gap-2">
                  {[
                    { icon: Instagram, href: "#", label: "Instagram" },
                    { icon: Facebook, href: "#", label: "Facebook" },
                    { icon: MessageCircle, href: "https://wa.me/573001234567", label: "WhatsApp" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 rounded-xl bg-muted/60 border border-border/50 flex items-center justify-center text-muted-foreground/50 hover:text-foreground hover:bg-muted transition-all duration-300"
                      aria-label={social.label}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp CTA */}
            <Card className="bg-muted/40 border-border/50">
              <CardContent className="p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-muted/80 flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-5 h-5 text-muted-foreground/50" />
                </div>
                <h4 className="font-semibold text-foreground mb-1.5 text-sm">
                  ¿Prefieres chatear?
                </h4>
                <p className="text-xs text-muted-foreground/60 mb-4">
                  Escríbenos por WhatsApp y recibe atención inmediata.
                </p>
                <Button
                  asChild
                  className="bg-foreground hover:bg-foreground/90 text-white rounded-full px-6 text-sm"
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
