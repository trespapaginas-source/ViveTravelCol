"use client";

import { useNavigation } from "@/lib/store";
import { Palmtree, Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const { navigate } = useNavigation();

  return (
    <footer className="bg-ocean-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Palmtree className="w-6 h-6 text-ocean-light" />
              </div>
              <div>
                <span className="text-lg font-bold">Vive Travel</span>
                <span className="block text-[10px] tracking-widest uppercase text-ocean-light">
                  Atlántico
                </span>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Tu agencia de viajes en el Atlántico, Colombia. Te conectamos con
              las mejores experiencias turísticas y alojamientos del Caribe
              colombiano.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-sunset transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-sunset transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/573001234567"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-palm transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              Explorar
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Inicio", view: "home" as const },
                { label: "Planes Turísticos", view: "plans" as const },
                { label: "Cabañas", view: "cabins" as const },
                { label: "Contacto", view: "contact" as const },
                { label: "Políticas", view: "policies" as const },
              ].map((item) => (
                <li key={item.view}>
                  <button
                    onClick={() => navigate(item.view)}
                    className="text-sm text-white/70 hover:text-sunset-light transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="w-4 h-4 text-sunset-light shrink-0" />
                +57 300 123 4567
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="w-4 h-4 text-sunset-light shrink-0" />
                info@vivetravel.co
              </li>
              <li className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-sunset-light shrink-0 mt-0.5" />
                Barranquilla, Atlántico, Colombia
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider">
              ¿Necesitas ayuda?
            </h3>
            <p className="text-sm text-white/70">
              Escríbenos por WhatsApp y te ayudamos a planear tu viaje ideal.
            </p>
            <Button
              asChild
              className="w-full bg-palm hover:bg-palm-light text-white rounded-full"
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
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Bottom Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Vive Travel Atlántico. Todos los
            derechos reservados.
          </p>
          <p className="text-xs text-white/50">
            Hecho con ❤️ en el Caribe Colombiano
          </p>
        </div>
      </div>
    </footer>
  );
}
