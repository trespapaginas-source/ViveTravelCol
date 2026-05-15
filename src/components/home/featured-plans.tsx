"use client";

import { memo, useCallback } from "react";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatShortDuration, formatShortLocation } from "@/lib/utils";
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
      className="group cursor-pointer overflow-hidden border-border/50 hover:border-border hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 py-0 gap-0"
      onClick={() => onNavigate(plan.id)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/2]">
        <img           src={plan.images[0]}
          alt={plan.name}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
         onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-white/60" />
          <span className="text-white/80 text-xs">{formatShortDuration(plan.duration)}</span>
        </div>
      </div>

      <CardContent className="p-3.5 sm:p-4 space-y-2">
        <h3 className="font-bold text-[16px] sm:text-[17px] text-foreground line-clamp-1 group-hover:text-ocean transition-colors duration-200 leading-snug">
          {plan.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0 text-muted-foreground" />
          <span className="line-clamp-1">{formatShortLocation(plan.location)}</span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {plan.shortDescription}
        </p>

        <div className="flex items-center justify-end pt-2 border-t border-border/30 mt-1">
          <div className="text-right">
            <p className="text-foreground font-bold text-[15px] sm:text-[17px] leading-tight">
              {formatPrice(plan.price)}
            </p>
          </div>
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
            title="Planes turísticos destacados"
            subtitle="Descubre nuestras experiencias más populares en Colombia" />
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
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 content-visibility-auto contain-intrinsic-size-auto">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Planes turísticos destacados"
          subtitle="Descubre nuestras experiencias más populares en Colombia" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onNavigate={handleNavigate} />
          ))}
        </div>

        {/* View all plans CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("plans", "pasadias")}
            className="border-ocean text-ocean hover:bg-ocean hover:text-white transition-colors duration-200 px-8 rounded-xl"
          >
            Ver todas las experiencias
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
