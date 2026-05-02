"use client";

import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Users,
  Mountain,
  Check,
  X,
  Sparkles,
  Calendar,
  Navigation,
  MessageCircle,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { useNavigation } from "@/lib/store";
import { tourPlans } from "@/lib/data";

const categoryColors: Record<string, string> = {
  Naturaleza: "bg-palm text-white",
  Playa: "bg-ocean text-white",
  Aventura: "bg-sunset text-white",
  Ecoturismo: "bg-palm-light text-white",
  Experiencia: "bg-coral text-white",
  Cultural: "bg-sand text-white",
};

const difficultyColors: Record<string, string> = {
  Fácil: "bg-palm/15 text-palm border-palm/30",
  Moderado: "bg-sunset/15 text-sunset border-sunset/30",
  Avanzado: "bg-coral/15 text-coral border-coral/30",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= Math.round(rating)
              ? "fill-sunset text-sunset"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  color = "text-ocean",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 p-2 rounded-lg bg-muted ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function PlanDetail() {
  const { selectedItemId, navigate } = useNavigation();
  const plan = tourPlans.find((p) => p.id === selectedItemId);

  if (!plan) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <Mountain className="w-16 h-16 text-muted-foreground/40" />
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

        {/* Image Carousel */}
        <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <ImageCarousel
            images={plan.images}
            showThumbnails
            aspectRatio="video"
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
                  className={`${categoryColors[plan.category] || "bg-ocean text-white"} border-0 text-xs font-semibold shrink-0 mt-1`}
                >
                  {plan.category}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={plan.rating} />
                  <span className="font-semibold text-foreground">
                    {plan.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({plan.reviewCount} reseñas)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-coral" />
                  <span>{plan.location}</span>
                </div>
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Host-like Section */}
            <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.25 }}>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Información del plan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoItem
                  icon={Clock}
                  label="Duración"
                  value={plan.duration}
                  color="text-ocean"
                />
                <InfoItem
                  icon={Users}
                  label="Máximo de huéspedes"
                  value={`${plan.maxGuests} personas`}
                  color="text-palm"
                />
                <InfoItem
                  icon={Mountain}
                  label="Dificultad"
                  value={plan.difficulty}
                  color="text-sunset"
                />
              </div>
              <div className="mt-4">
                <Badge
                  variant="outline"
                  className={`text-sm px-4 py-1.5 ${difficultyColors[plan.difficulty]}`}
                >
                  {plan.difficulty}
                </Badge>
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Full Description */}
            <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.3 }}>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Descripción
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {plan.fullDescription}
              </p>
            </motion.div>

            <Separator className="my-6" />

            {/* Qué incluye */}
            <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.35 }}>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Qué incluye
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan.includes.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="mt-0.5 p-1 rounded-full bg-palm/15 shrink-0">
                      <Check className="w-3.5 h-3.5 text-palm" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Qué no incluye */}
            <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.4 }}>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Qué no incluye
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan.excludes.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="mt-0.5 p-1 rounded-full bg-coral/15 shrink-0">
                      <X className="w-3.5 h-3.5 text-coral" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Puntos destacados */}
            <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.45 }}>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Puntos destacados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan.highlights.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="mt-0.5 p-1 rounded-full bg-sunset/15 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-sunset" />
                    </div>
                    <span className="text-sm text-foreground font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Schedule & Meeting */}
            <motion.div {...fadeInUp} transition={{ duration: 0.4, delay: 0.5 }}>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Horario y punto de encuentro
              </h2>
              <div className="space-y-4">
                <InfoItem
                  icon={Calendar}
                  label="Horario"
                  value={plan.schedule}
                  color="text-ocean"
                />
                <InfoItem
                  icon={Navigation}
                  label="Punto de encuentro"
                  value={plan.meeting}
                  color="text-coral"
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
              <Card className="border-border/60 shadow-xl py-0 gap-0">
                <CardContent className="p-6 space-y-5">
                  {/* Price */}
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-bold text-foreground">
                        {plan.priceRange.split(" - ")[0]}
                      </span>
                      {plan.priceRange.includes(" - ") && (
                        <>
                          <span className="text-muted-foreground">-</span>
                          <span className="text-lg text-muted-foreground">
                            {plan.priceRange.split(" - ")[1]}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Precio por persona · Impuestos incluidos
                    </p>
                  </div>

                  <Separator />

                  {/* Quick Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-ocean" />
                        Duración
                      </span>
                      <span className="font-medium text-foreground">
                        {plan.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4 text-palm" />
                        Grupo máximo
                      </span>
                      <span className="font-medium text-foreground">
                        {plan.maxGuests} personas
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Star className="w-4 h-4 text-sunset fill-sunset" />
                        Calificación
                      </span>
                      <span className="font-medium text-foreground">
                        {plan.rating} ({plan.reviewCount})
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
                      className="w-full border-palm/40 text-palm hover:bg-palm/10 font-semibold h-11 rounded-xl gap-2"
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
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
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
