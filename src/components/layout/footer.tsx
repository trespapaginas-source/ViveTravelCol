"use client";

import { useNavigation } from "@/lib/store";
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const { navigate } = useNavigation();

  return (
    <footer className="bg-ocean-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img
              src="/logo.png"
              alt="Vive Travel"
              className="h-12 w-auto brightness-0 invert"
            />
            <p className="text-sm text-white/40 leading-relaxed">
              Tu agencia de viajes en el Atlántico, Colombia. Te conectamos con
              las mejores experiencias turísticas y alojamientos del Caribe
              colombiano.
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
                  className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200 min-w-[44px] min-h-[44px]"
                  aria-label={social.label}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/60">
              Explorar
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Inicio", view: "home" as const },
                { label: "Planes Turísticos", view: "plans" as const },
                { label: "Cabañas", view: "cabins" as const },
                { label: "Nuestro Equipo", view: "team" as const },
                { label: "Contacto", view: "contact" as const },
                { label: "Políticas", view: "policies" as const },
              ].map((item) => (
                <li key={item.view}>
                  <button
                    onClick={() => navigate(item.view)}
                    className="text-sm text-white/40 hover:text-white/80 transition-colors min-h-[44px] flex items-center"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/60">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/40">
                <Phone className="w-3.5 h-3.5 text-white/30 shrink-0" />
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/40 break-all">
                <Mail className="w-3.5 h-3.5 text-white/30 shrink-0" />
                <span>info@vivetravel.co</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/40">
                <MapPin className="w-3.5 h-3.5 text-white/30 mt-0.5 shrink-0" />
                <span>Barranquilla, Atlántico, Colombia</span>
              </li>
            </ul>
          </div>

          {/* WhatsApp CTA */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-white/60">
              ¿Necesitas ayuda?
            </h3>
            <p className="text-sm text-white/40">
              Escríbenos por WhatsApp y te ayudamos a planear tu viaje ideal.
            </p>
            <Button
              asChild
              className="w-full bg-white/10 hover:bg-white/20 text-white border-0 rounded-full min-h-[44px]"
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
          <p className="text-xs text-white/30 text-center sm:text-left">
            © {new Date().getFullYear()} Vive Travel Atlántico. Todos los
            derechos reservados.
          </p>
          <p className="text-xs text-white/30">
            Hecho en el Caribe Colombiano
          </p>
        </div>
      </div>
    </footer>
  );
}
