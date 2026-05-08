"use client";

import { motion } from "framer-motion";
import { Code2, Star, TrendingUp, Heart, Users, Globe, Sparkles, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/lib/store";

const teamMembers = [
  {
    name: "Andrés Trespalacios",
    role: "Creador Digital & Estratega",
    description:
      "Creador de la página web y CRM de la agencia. Aportador de ideas clave que ayudaron a estructurar la agencia de la manera correcta. Su visión digital transformó la forma en que Vive Travel conecta con sus viajeros.",
    initials: "AT",
    icon: Code2,
    accent: "ocean" as const,
    accentBg: "bg-ocean",
    accentLight: "bg-ocean/10",
    accentText: "text-ocean",
    accentBorder: "border-ocean/20",
  },
  {
    name: "Luis Méndez",
    role: "Influencer & Accionista Mayoritario",
    description:
      "El rostro e imagen de la agencia. Como influencer y accionista mayoritario, Luis es la conexión directa entre Vive Travel y la comunidad de viajeros. Su carisma y alcance inspiran a miles a descubrir el Atlántico.",
    initials: "LM",
    icon: Star,
    accent: "mint" as const,
    accentBg: "bg-mint",
    accentLight: "bg-mint/10",
    accentText: "text-mint",
    accentBorder: "border-mint/20",
    featured: true,
  },
  {
    name: "Jean Fontalo",
    role: "Operaciones & Ventas Comerciales",
    description:
      "El motor operativo y comercial de la agencia. Jean se encarga de que cada experiencia sea impecable, desde la logística hasta la atención al viajero. Su dedicación garantiza la calidad en cada viaje.",
    initials: "JF",
    icon: TrendingUp,
    accent: "leaf" as const,
    accentBg: "bg-leaf",
    accentLight: "bg-leaf/10",
    accentText: "text-leaf",
    accentBorder: "border-leaf/20",
  },
];

const stats = [
  { value: "3", label: "Fundadores", icon: Users },
  { value: "50+", label: "Experiencias", icon: Globe },
  { value: "15+", label: "Destinos", icon: Heart },
  { value: "100%", label: "Pasión Caribeña", icon: Sparkles },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function TeamSection() {
  const { navigate } = useNavigation();

  return (
    <section className="py-16 sm:py-20 lg:py-28 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-ocean/[0.02] to-background" />
      <div className="absolute top-40 -left-32 w-96 h-96 bg-ocean/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-32 w-80 h-80 bg-mint/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-leaf/3 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            title="Nuestro Equipo"
            subtitle="Tres amigos, una pasión: conectar al mundo con la magia del Atlántico colombiano"
          />
        </motion.div>

        {/* Story intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto text-center mb-12 sm:mb-16"
        >
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Lo que comenzó como un sueño entre tres amigos se convirtió en una agencia
            que transforma la manera de vivir el Caribe colombiano. Cada uno aporta su
            talento único para que tu experiencia sea extraordinaria.
          </p>
          {/* Decorative line */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-12 h-0.5 bg-ocean/30 rounded-full" />
            <div className="w-3 h-3 rounded-full bg-ocean/20" />
            <div className="w-12 h-0.5 bg-ocean/30 rounded-full" />
          </div>
        </motion.div>

        {/* Team Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 sm:mb-20"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.name}
              variants={cardVariants}
              className="group relative"
            >
              <div
                className={`relative bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-ocean/5 hover:-translate-y-1 ${
                  member.featured ? "ring-2 ring-mint/30" : ""
                }`}
              >
                {/* Top accent bar */}
                <div className={`h-1.5 ${member.accentBg}`} />

                {/* Featured badge */}
                {member.featured && (
                  <div className="absolute top-5 right-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-mint/10 text-mint text-[10px] font-bold uppercase tracking-wider">
                      <Star className="w-3 h-3 fill-current" />
                      Rostro de la agencia
                    </span>
                  </div>
                )}

                <div className="p-6 sm:p-8 text-center">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-6 w-28 h-28 sm:w-32 sm:h-32">
                    {/* Decorative ring */}
                    <div
                      className={`absolute inset-0 rounded-full ${member.accentLight} scale-110 group-hover:scale-115 transition-transform duration-500`}
                    />
                    <div
                      className={`absolute inset-0 rounded-full border-2 ${member.accentBorder} scale-105`}
                    />
                    {/* Avatar circle */}
                    <div
                      className={`relative w-full h-full rounded-full ${member.accentBg} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-white font-bold text-2xl sm:text-3xl tracking-tight">
                        {member.initials}
                      </span>
                    </div>
                    {/* Floating icon */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-white shadow-md border border-border/50 flex items-center justify-center`}
                    >
                      <member.icon className={`w-5 h-5 ${member.accentText}`} />
                    </motion.div>
                  </div>

                  {/* Name & Role */}
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5">
                    {member.name}
                  </h3>
                  <p
                    className={`text-sm font-semibold ${member.accentText} mb-4 tracking-wide uppercase`}
                  >
                    {member.role}
                  </p>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.description}
                  </p>

                  {/* Bottom decorative dots */}
                  <div className="mt-6 flex items-center justify-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${member.accentBg} opacity-40`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${member.accentBg} opacity-60`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${member.accentBg} opacity-40`} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative rounded-3xl overflow-hidden bg-ocean-dark">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-mint rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            </div>

            <div className="relative z-10 py-12 sm:py-16 px-6 sm:px-10">
              <div className="text-center mb-10">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl sm:text-3xl font-bold text-white mb-2"
                >
                  Cifras que hablan por nosotros
                </motion.h3>
                <p className="text-white/50 text-sm sm:text-base max-w-lg mx-auto">
                  Nos hemos encargado de entregar experiencias significativas a cada viajero
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-3">
                      <stat.icon className="w-5 h-5 text-mint-light" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                      {stat.value}
                    </p>
                    <p className="text-white/40 text-xs sm:text-sm uppercase tracking-wider font-medium">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12 sm:mt-16"
        >
          <p className="text-muted-foreground mb-6 text-base sm:text-lg">
            Conoce de primera mano lo que podemos hacer por ti
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate("plans")}
              className="bg-ocean hover:bg-ocean-dark text-white px-8 py-5 text-base rounded-xl shadow-lg shadow-ocean/20 transition-all duration-300 hover:scale-105 gap-2"
            >
              Ver nuestros planes
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("contact")}
              className="border-ocean/30 text-ocean hover:bg-ocean/5 px-8 py-5 text-base rounded-xl transition-all duration-300 gap-2"
            >
              Contáctanos
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
