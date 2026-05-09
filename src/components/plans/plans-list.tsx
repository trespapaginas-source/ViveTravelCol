"use client";

import { useMemo, memo } from "react";
import { MapPin, Clock, Users, Compass, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/shared/section-header";
import {
  FilterSidebar,
  FilterMobileSheet,
  buildPlanFilters,
  filterPlans,
  useFilterState,
} from "@/components/shared/filter-panel";
import { useNavigation } from "@/lib/store";
import { type TourPlan } from "@/lib/data";
import { fetchPlans } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const categoryColors: Record<string, string> = {
  Naturaleza: "bg-ocean/80 text-white",
  Playa: "bg-ocean/80 text-white",
  Aventura: "bg-ocean/80 text-white",
  Ecoturismo: "bg-ocean/80 text-white",
  Experiencia: "bg-ocean/80 text-white",
  Cultural: "bg-ocean/80 text-white",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Memoized plan card — prevents re-rendering when other cards change
const PlanCard = memo(function PlanCard({ plan, onNavigate }: { plan: TourPlan; onNavigate: (id: string) => void }) {
  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" ? isFavorite(plan.id) : false
  );

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(plan.id);
      setIsFav(nowFav);
      toast.success(nowFav ? "Guardado en tu colección" : "Eliminado de tu colección", {
        description: nowFav ? "Encuéntralo en tu lista de favoritos" : undefined,
      });
    },
    [plan.id]
  );

  return (
    <Card
      className="overflow-hidden group border-border/50 hover:border-border hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 py-0 gap-0 cursor-pointer"
      onClick={() => onNavigate(plan.id)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={plan.images[0]}
          alt={plan.name}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <Badge
          className={`absolute top-3 left-3 ${categoryColors[plan.category] || "bg-ocean/80 text-white"} border-0 text-[11px] font-medium px-2.5 py-0.5 backdrop-blur-sm`}
        >
          {plan.category}
        </Badge>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-105 transition-all duration-200 min-w-[44px] min-h-[44px]"
          aria-label={isFav ? "Eliminar de favoritos" : "Guardar en favoritos"}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors duration-200 ${
              isFav ? "fill-indigo text-indigo" : "text-muted-foreground"
            }`}
          />
        </button>

        {/* Price overlay */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 shadow-sm">
          <span className="text-foreground font-semibold text-sm">
            {formatPrice(plan.price)}
          </span>
        </div>
      </div>

      <CardContent className="p-3.5 sm:p-4 space-y-2.5">
        {/* Name */}
        <h3 className="font-semibold text-[15px] text-foreground leading-tight line-clamp-1 group-hover:text-ocean transition-colors duration-200">
          {plan.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed">
          {plan.shortDescription}
        </p>

        {/* Meta Info — compact inline */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground/60 pt-1">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{plan.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{plan.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Máx. {plan.maxGuests}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export function PlansList() {
  const navigate = useNavigation((s) => s.navigate);

  const { data: tourPlans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const publishedPlans = useMemo(
    () => tourPlans.filter((p) => p.published !== false),
    [tourPlans]
  );

  const filterSections = useMemo(
    () => buildPlanFilters(publishedPlans),
    [publishedPlans]
  );

  const { filters, toggleCheckbox, changeRange, clearAll, activeCount } =
    useFilterState(filterSections);

  const filteredPlans = useMemo(
    () => filterPlans(publishedPlans, filters),
    [publishedPlans, filters]
  );

  const handleNavigate = useCallback((planId: string) => {
    navigate("plan-detail", planId);
  }, [navigate]);

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Nuestros Planes"
            subtitle="Descubre experiencias únicas en el Atlántico colombiano."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
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

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Nuestros Planes"
          subtitle="Descubre experiencias únicas en el Atlántico colombiano. Desde aventuras en la naturaleza hasta noches mágicas bajo las estrellas."
        />

        {/* Mobile filter button */}
        <div className="flex items-center justify-between mb-6 lg:mb-10">
          <div className="flex items-center gap-2">
            <FilterMobileSheet
              sections={filterSections}
              filters={filters}
              onToggleCheckbox={toggleCheckbox}
              onChangeRange={changeRange}
              onClearAll={clearAll}
              activeCount={activeCount}
              resultCount={filteredPlans.length}
            />
            <span className="text-xs text-muted-foreground/50">
              {filteredPlans.length} plan{filteredPlans.length !== 1 ? "es" : ""}
            </span>
          </div>
        </div>

        {/* Content: Sidebar + Grid */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <FilterSidebar
            sections={filterSections}
            filters={filters}
            onToggleCheckbox={toggleCheckbox}
            onChangeRange={changeRange}
            onClearAll={clearAll}
            activeCount={activeCount}
          />

          {/* Plans Grid — NO AnimatePresence/layout, just CSS transitions */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {filteredPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredPlans.length === 0 && (
              <div className="text-center py-16">
                <Compass className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">
                  No hay planes con estos filtros
                </p>
                <p className="text-muted-foreground/60 text-sm mb-4">
                  Intenta ajustar los filtros para encontrar más opciones
                </p>
                <button
                  onClick={clearAll}
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
