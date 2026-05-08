"use client";

import { motion } from "framer-motion";
import {
  Compass,
  DollarSign,
  Map,
  MessageCircle,
  ArrowRight,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumIcon, IconBadge } from "@/components/shared/premium-icon";
import type { IconTheme } from "@/components/shared/premium-icon";
import { useNavigation } from "@/lib/store";

const benefits = [
  {
    icon: Compass,
    title: "Flexibilidad total",
    description:
      "Elige tus destinos, actividades y ritmo de viaje. Tú decides cómo vivir el Atlántico.",
    theme: "sunset" as IconTheme,
  },
  {
    icon: Map,
    title: "Expertos locales",
    description:
      "Nuestros guías conocen cada rincón del departamento y te llevan a lugares únicos.",
    theme: "palm" as IconTheme,
  },
  {
    icon: DollarSign,
    title: "Mejores precios",
    description:
      "Sin intermediarios. Armamos tu viaje a medida con tarifas directas y transparentes.",
    theme: "ocean" as IconTheme,
  },
];

export function CustomTrips() {
  const { navigate } = useNavigation();

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Warm sunset gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sunset-light/20 via-sand-light/10 to-sunset/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <IconBadge
              icon={Waves}
              theme="sunset"
              variant="filled"
              label="Tu aventura, tu estilo"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            Viajes{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset to-coral">
              Personalizados
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            ¿No encuentras exactamente lo que buscas? Nosotros te ayudamos a
            crear el viaje perfecto. Cuéntanos tu idea y la hacemos realidad con
            los mejores destinos del Atlántico.
          </p>
        </motion.div>

        {/* Benefits cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group"
            >
              <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="mb-4 sm:mb-5">
                  <PremiumIcon
                    icon={benefit.icon}
                    variant="gradient"
                    theme={benefit.theme}
                    size="lg"
                    animate
                  />
                </div>
                <h3 className="text-foreground font-semibold text-lg sm:text-xl mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="relative bg-gradient-to-r from-sunset to-coral rounded-3xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3" />

            <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-10 sm:py-14 flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  ¿Listo para crear tu viaje ideal?
                </h3>
                <p className="text-white/80 text-sm sm:text-base max-w-lg leading-relaxed">
                  Cuéntanos qué tipo de experiencia buscas, cuántos días tienes,
                  tu presupuesto y nosotros nos encargamos del resto. ¡Es
                  momento de vivir el Atlántico a tu manera!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0">
                <Button
                  size="lg"
                  onClick={() => navigate("contact")}
                  className="bg-white text-sunset hover:bg-white/90 px-6 sm:px-8 py-5 sm:py-6 text-base rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contáctanos
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("plans")}
                  className="border-white/30 text-white hover:bg-white/10 px-6 py-5 sm:py-6 text-base rounded-xl transition-all duration-300 bg-transparent"
                >
                  Ver planes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
