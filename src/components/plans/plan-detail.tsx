"use client";

import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Mountain,
  Calendar,
  Navigation,
  MessageCircle,
  Phone,
  Check,
  X,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PropertyGallery } from "@/components/shared/property-gallery";
import { useNavigation } from "@/lib/store";
import { fetchPlan } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const categoryColors: Record<string, string> = {
  Naturaleza: "bg-ocean/80 text-white",
  Playa: "bg-ocean/80 text-white",
  Aventura: "bg-ocean/80 text-white",
  Ecoturismo: "bg-ocean/80 text-white",
  Experiencia: "bg-ocean/80 text-white",
  Cultural: "bg-ocean/80 text-white",
};


function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div>
        <p className="text-[11px] text-muted-foreground/60 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function PlanDetail() {
  const { selectedItemId, navigate } = useNavigation();
  const { data: plan, isLoading } = useQuery({
    queryKey: ["plan", selectedItemId],
    queryFn: () => fetchPlan(selectedItemId!),
    enabled: !!selectedItemId,
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-foreground border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <Mountain className="w-10 h-10 text-muted-foreground/30" />
        <p className="text-muted-foreground text-lg">
          Plan no encontrado
        </p>
        <Button
          variant="outline"
          onClick={() => navigate("plans")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a planes
        </Button>
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div {...fadeInUp} transition={{ duration: 0.3 }}>
          <Button
            variant="ghost"
            onClick={() => navigate("plans")}
            className="gap-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a planes
          </Button>
        </motion.div>

        {/* Image Gallery */}
        <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <PropertyGallery
            images={plan.images}
            title={plan.name}
            className="mb-8"
          />
        </motion.div>

        {/* Main Content + Sticky Price Card */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Title Section */}
            <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.2 }}>
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                  {plan.name}
                </h1>
                <Badge
                  className={`${categoryColors[plan.category] || "bg-ocean/80 text-white"} border-0 text-xs font-medium shrink-0 mt-1`}
                >
                  {plan.category}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground/50" />
                <span>{plan.location}</span>
              </div>
            </motion.div>

            <Separator className="my-5" />

            {/* Info Section */}
            <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.25 }}>
              <h2 className="text-base font-semibold text-foreground mb-4">
                Información del plan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoItem
                  icon={Clock}
                  label="Duración"
                  value={plan.duration}
                />
                <InfoItem
                  icon={Users}
                  label="Máximo de huéspedes"
                  value={`${plan.maxGuests} personas`}
                />
              </div>
            </motion.div>

            <Separator className="my-5" />

            {/* Full Description */}
            <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.3 }}>
              <h2 className="text-base font-semibold text-foreground mb-2.5">
                Descripción
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {plan.fullDescription}
              </p>
            </motion.div>

            <Separator className="my-5" />

            {/* Qué incluye */}
            <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.35 }}>
              <h2 className="text-base font-semibold text-foreground mb-3.5">
                Qué incluye
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plan.includes.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 py-1">
                    <Check className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <Separator className="my-5" />

            {/* Qué no incluye */}
            <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.4 }}>
              <h2 className="text-base font-semibold text-foreground mb-3.5">
                Qué no incluye
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plan.excludes.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 py-1">
                    <X className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <Separator className="my-5" />

            {/* Puntos destacados */}
            <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.45 }}>
              <h2 className="text-base font-semibold text-foreground mb-3.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-foreground/30" />
                Puntos destacados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plan.highlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 py-1">
                    <Sparkles className="w-3.5 h-3.5 text-foreground/25 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <Separator className="my-5" />

            {/* Schedule & Meeting */}
            <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.5 }}>
              <h2 className="text-base font-semibold text-foreground mb-3.5">
                Horario y punto de encuentro
              </h2>
              <div className="space-y-3">
                <InfoItem
                  icon={Calendar}
                  label="Horario"
                  value={plan.schedule}
                />
                <InfoItem
                  icon={Navigation}
                  label="Punto de encuentro"
                  value={plan.meeting}
                />
              </div>
            </motion.div>

            {/* Mobile Price Card Spacer */}
            <div className="h-4 lg:hidden" />
          </div>

          {/* Right Sticky Price Card */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full lg:w-[380px] shrink-0"
          >
            <div className="lg:sticky lg:top-6">
              <Card className="border-border/50 shadow-xl py-0 gap-0">
                <CardContent className="p-6 space-y-5">
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-foreground">
                        {plan.priceRange.split(" - ")[0]}
                      </span>
                      {plan.priceRange.includes(" - ") && (
                        <>
                          <span className="text-muted-foreground/40">-</span>
                          <span className="text-lg text-muted-foreground">
                            {plan.priceRange.split(" - ")[1]}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Precio por persona · Impuestos incluidos
                    </p>
                  </div>

                  <Separator />

                  {/* Quick Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground/70">
                        <Clock className="w-3.5 h-3.5" />
                        Duración
                      </span>
                      <span className="font-medium text-foreground">
                        {plan.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground/70">
                        <Users className="w-3.5 h-3.5" />
                        Grupo máximo
                      </span>
                      <span className="font-medium text-foreground">
                        {plan.maxGuests} personas
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-ocean hover:bg-ocean-dark text-white font-semibold h-12 text-base rounded-xl"
                      onClick={() => navigate("contact", plan.id)}
                    >
                      Reservar ahora
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-border text-foreground hover:bg-muted font-medium h-11 rounded-xl gap-2"
                      asChild
                    >
                      <a
                        href={`https://wa.me/573001234567?text=Hola, me interesa el ${encodeURIComponent(plan.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>

                  {/* Trust Badge */}
                  <div className="text-center pt-1">
                    <p className="text-xs text-muted-foreground/50 flex items-center justify-center gap-1">
                      <Phone className="w-3 h-3" />
                      Reserva segura · Confirmación inmediata
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
