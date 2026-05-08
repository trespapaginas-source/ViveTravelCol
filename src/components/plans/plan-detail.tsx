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
  Heart,
  Share2,
  type LucideIcon,
} from "lucide-react";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PropertyGallery } from "@/components/shared/property-gallery";
import { useNavigation } from "@/lib/store";
import { fetchPlan } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { ShareDialog } from "@/components/shared/share-dialog";
import { useState, useCallback } from "react";
import { toast } from "sonner";

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

  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" && selectedItemId
      ? isFavorite(selectedItemId)
      : false
  );

  const [shareOpen, setShareOpen] = useState(false);

  const handleToggleFavorite = useCallback(() => {
    if (!selectedItemId) return;
    const nowFav = toggleFavorite(selectedItemId);
    setIsFav(nowFav);
    toast.success(nowFav ? "Guardado en tu colección" : "Eliminado de tu colección", {
      description: nowFav ? "Encuéntralo en tu lista de favoritos" : undefined,
    });
  }, [selectedItemId]);

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

  return (
    <div className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-28 lg:pb-10">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("plans")}
          className="gap-2 mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a planes
        </Button>

        {/* Image Gallery */}
        <PropertyGallery
          images={plan.images}
          title={plan.name}
          className="mb-8"
        />

        {/* Main Content + Sticky Price Card */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Title Section */}
            <div>
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

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground/50" />
                  <span>{plan.location}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-9 w-9 border-border/50 hover:border-border"
                    onClick={() => setShareOpen(true)}
                    aria-label="Compartir"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full h-9 w-9 border-border/50 hover:border-border transition-colors ${
                      isFav ? "border-indigo/30 bg-indigo/5" : ""
                    }`}
                    onClick={handleToggleFavorite}
                    aria-label={isFav ? "Eliminar de favoritos" : "Guardar en favoritos"}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? "fill-indigo text-indigo" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-5" />

            {/* Info Section */}
            <div>
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
            </div>

            <Separator className="my-5" />

            {/* Full Description */}
            <div>
              <h2 className="text-base font-semibold text-foreground mb-2.5">
                Descripción
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {plan.fullDescription}
              </p>
            </div>

            <Separator className="my-5" />

            {/* Qué incluye */}
            <div>
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
            </div>

            <Separator className="my-5" />

            {/* Qué no incluye */}
            <div>
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
            </div>

            <Separator className="my-5" />

            {/* Puntos destacados */}
            <div>
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
            </div>

            <Separator className="my-5" />

            {/* Schedule & Meeting */}
            <div>
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
            </div>

            {/* Mobile Price Card Spacer */}
            <div className="h-4 lg:hidden" />
          </div>

          {/* Right Sticky Price Card */}
          <aside className="w-full lg:w-[380px] shrink-0">
            <div className="lg:sticky lg:top-24">
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
          </aside>
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border/50 px-4 py-3 safe-area-bottom">
        <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
          <div>
            <p className="text-xs text-muted-foreground">Desde</p>
            <p className="text-lg font-bold text-foreground">{formatPrice(plan.price)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-10 border-leaf/30 text-leaf hover:bg-leaf/5 gap-1.5"
              asChild
            >
              <a
                href={`https://wa.me/573001234567?text=${encodeURIComponent(
                  `Hola, me interesa el ${plan.name}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden xs:inline">WhatsApp</span>
              </a>
            </Button>
            <Button
              size="sm"
              className="bg-ocean hover:bg-ocean-dark text-white rounded-full h-10 px-5"
              onClick={() => navigate("contact", plan.id)}
            >
              Reservar
            </Button>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        title={plan.name}
        text={`Mira este plan: ${plan.name} en ${plan.location}`}
      />
    </div>
  );
}
