"use client";

import { memo, useCallback } from "react";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { useNavigation } from "@/lib/store";
import { fetchPlans } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const categoryColors: Record<string, string> = {
  Naturaleza: "bg-ocean/80 text-white",
  Playa: "bg-ocean/80 text-white",
  Aventura: "bg-ocean/80 text-white",
  Ecoturismo: "bg-ocean/80 text-white",
  Experiencia: "bg-ocean/80 text-white",
  Cultural: "bg-ocean/80 text-white",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

const PlanCard = memo(function PlanCard({
  plan,
  onNavigate,
}: {
  plan: { id: string; name: string; images: string[]; category: string; duration: string; location: string; shortDescription: string; price: number };
  onNavigate: (id: string) => void;
}) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/50 hover:border-border hover:shadow-lg transition-all duration-200 hover:-translate-y-1 py-0 gap-0"
      onClick={() => onNavigate(plan.id)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={plan.images[0]}
          alt={plan.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Category badge */}
        <Badge
          className={`absolute top-3 left-3 ${
            categoryColors[plan.category] || "bg-ocean/80 text-white"
          } border-0 text-[11px] font-medium px-2.5 py-0.5 backdrop-blur-sm`}
        >
          {plan.category}
        </Badge>

        {/* Duration */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-white/60" />
          <span className="text-white/80 text-xs">{plan.duration}</span>
        </div>
      </div>

      <CardContent className="p-3.5 sm:p-4 space-y-2">
        <h3 className="font-semibold text-sm sm:text-[15px] text-foreground line-clamp-1 group-hover:text-ocean transition-colors duration-200 leading-snug">
          {plan.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
          <MapPin className="w-3 h-3 shrink-0 text-muted-foreground/50" />
          <span className="line-clamp-1">{plan.location}</span>
        </div>

        <p className="text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed">
          {plan.shortDescription}
        </p>

        <div className="flex items-center justify-between pt-1.5 border-t border-border/30">
          <div>
            <span className="text-[10px] text-muted-foreground/60">Desde</span>
            <p className="text-foreground font-semibold text-sm">
              {formatPrice(plan.price)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-ocean hover:text-ocean-dark hover:bg-ocean/5 -mr-2 text-xs h-7 px-2"
          >
            Ver más
            <ArrowRight className="w-3 h-3 ml-0.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

export function FeaturedPlans() {
  const { navigate } = useNavigation();
  const { data: allPlans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const handleNavigate = useCallback(
    (id: string) => navigate("plan-detail", id),
    [navigate]
  );

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Planes Destacados"
            subtitle="Descubre nuestras experiencias más populares en el Atlántico"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden py-0 gap-0">
                <Skeleton className="aspect-[4/3]" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featuredPlans = allPlans.filter((p) => p.published !== false).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Planes Destacados"
          subtitle="Descubre nuestras experiencias más populares en el Atlántico"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onNavigate={handleNavigate}
            />
          ))}
        </div>

        {/* View all plans CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("plans")}
            className="border-ocean text-ocean hover:bg-ocean hover:text-white transition-colors duration-200 px-8 rounded-xl"
          >
            Ver todos los planes
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
