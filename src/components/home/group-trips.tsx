"use client";

import { motion } from "framer-motion";
import { Users, Percent, Calendar, Heart, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/lib/store";

const benefits = [
  {
    icon: Percent,
    title: "Descuentos grupales",
    description: "Hasta 20% de descuento para grupos de 8 o más personas",
  },
  {
    icon: Calendar,
    title: "Itinerarios flexibles",
    description: "Fechas y horarios adaptados a tu grupo",
  },
  {
    icon: Heart,
    title: "Experiencias compartidas",
    description: "Crea recuerdos inolvidables con quienes más quieres",
  },
  {
    icon: Sparkles,
    title: "Atención personalizada",
    description: "Un coordinador dedicado para tu grupo",
  },
];

export function GroupTrips() {
  const { navigate } = useNavigation();

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Ocean gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean via-ocean-dark to-ocean" />

      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-2 border-white" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full border border-white" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full border border-white" />
        <div className="absolute top-20 right-1/4 w-16 h-16 rounded-full border-2 border-white" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-ocean-light" />
              <span className="text-ocean-light text-sm font-semibold tracking-wider uppercase">
                Viajes Grupales
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Viaja en grupo y{" "}
              <span className="text-ocean-light">ahorra más</span>
            </h2>

            <p className="text-white/75 text-base sm:text-lg mb-8 leading-relaxed max-w-lg">
              Organiza tu próxima aventura con amigos, familiares o compañeros
              de trabajo. Ofrecemos tarifas especiales para grupos, itinerarios
              personalizados y la mejor atención para que solo te preocupes por
              disfrutar.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                onClick={() => navigate("contact")}
                className="bg-white text-ocean hover:bg-white/90 px-6 sm:px-8 py-5 sm:py-6 text-base rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
              >
                Solicitar cotización
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("plans")}
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-6 py-5 sm:py-6 text-base rounded-xl transition-all duration-300 bg-transparent"
              >
                Ver planes disponibles
              </Button>
            </div>

            {/* Quick stats */}
            <div className="mt-8 flex gap-6 sm:gap-8">
              {[
                { value: "20%", label: "Descuento máximo" },
                { value: "8+", label: "Personas mínimo" },
                { value: "24h", label: "Respuesta" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-bold text-ocean-light">
                    {stat.value}
                  </p>
                  <p className="text-white/60 text-xs sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Benefit cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 sm:p-6 hover:bg-white/15 transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-ocean-light/20 flex items-center justify-center mb-3 group-hover:bg-ocean-light/30 transition-colors">
                  <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-ocean-light" />
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1.5">
                  {benefit.title}
                </h3>
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
