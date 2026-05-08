"use client";

import { useMemo } from "react";
import { Cabin } from "@/lib/data";
import { fetchCabins } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@/lib/store";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { SectionHeader } from "@/components/shared/section-header";
import {
  FilterSidebar,
  FilterMobileSheet,
  buildCabinFilters,
  filterCabins,
  useFilterState,
} from "@/components/shared/filter-panel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  BedDouble,
  Bath,
  MapPin,
  ArrowRight,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { useState, useCallback } from "react";
import { toast } from "sonner";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function CabinCard({
  cabin,
  index,
  onSelect,
}: {
  cabin: Cabin;
  index: number;
  onSelect: () => void;
}) {
  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" ? isFavorite(cabin.id) : false
  );

  const handleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const nowFav = toggleFavorite(cabin.id);
      setIsFav(nowFav);
      toast.success(nowFav ? "Guardado en tu colección" : "Eliminado de tu colección", {
        description: nowFav ? "Encuéntralo en tu lista de favoritos" : undefined,
      });
    },
    [cabin.id]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Card
        className="overflow-hidden cursor-pointer group border-border/50 hover:border-ocean/20 hover:shadow-lg transition-all duration-300 py-0 gap-0"
        onClick={onSelect}
      >
        {/* Image Carousel */}
        <div className="relative">
          <ImageCarousel
            images={cabin.images}
            aspectRatio="video"
            showExpand={false}
            className="[&_.border-0]:border-0"
          />
          {/* Price Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-white/90 text-foreground backdrop-blur-sm border-0 text-[11px] font-semibold px-2.5 py-0.5 shadow-sm">
              {formatPrice(cabin.pricePerNight)}/noche
            </Badge>
          </div>
          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-105 transition-all duration-200"
            aria-label={isFav ? "Eliminar de favoritos" : "Guardar en favoritos"}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors duration-200 ${
                isFav ? "fill-coral text-coral" : "text-muted-foreground"
              }`}
            />
          </button>
        </div>

        <CardContent className="p-3.5 sm:p-4 space-y-2">
          {/* Name and Location */}
          <div>
            <h3 className="font-semibold text-[15px] text-foreground group-hover:text-ocean transition-colors line-clamp-1 leading-snug">
              {cabin.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="w-3 h-3 shrink-0 text-muted-foreground/60" />
              <span className="line-clamp-1">{cabin.location}</span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
            {cabin.shortDescription}
          </p>

          {/* Compact Stats Row */}
          <div className="flex items-center gap-0 text-xs text-muted-foreground/70 pt-1">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{cabin.capacity}</span>
            </div>
            <span className="mx-1.5 text-muted-foreground/30">·</span>
            <div className="flex items-center gap-1">
              <BedDouble className="w-3 h-3" />
              <span>{cabin.bedrooms} hab.</span>
            </div>
            <span className="mx-1.5 text-muted-foreground/30">·</span>
            <div className="flex items-center gap-1">
              <Bath className="w-3 h-3" />
              <span>{cabin.bathrooms} baño{cabin.bathrooms > 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Bottom: CTA */}
          <div className="flex items-center justify-end pt-1.5 border-t border-border/30">
            <Button
              variant="ghost"
              size="sm"
              className="text-ocean hover:text-ocean-dark hover:bg-ocean/5 gap-1 text-xs font-medium px-2 h-7"
            >
              Ver más
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function CabinsList() {
  const { navigate } = useNavigation();
  const { data: cabins = [], isLoading } = useQuery({
    queryKey: ["cabins"],
    queryFn: fetchCabins,
  });

  const publishedCabins = useMemo(
    () => cabins.filter((c) => c.published !== false),
    [cabins]
  );

  const filterSections = useMemo(
    () => buildCabinFilters(publishedCabins),
    [publishedCabins]
  );

  const { filters, toggleCheckbox, changeRange, clearAll, activeCount } =
    useFilterState(filterSections);

  const filteredCabins = useMemo(
    () => filterCabins(publishedCabins, filters),
    [publishedCabins, filters]
  );

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="Nuestras Cabañas"
            subtitle="Descubre el alojamiento perfecto para tu escapada al Caribe colombiano. Desde refugios románticos hasta espacios familiares frente al mar."
          />
        </motion.div>

        {/* Mobile filter button + result count */}
        <div className="flex items-center justify-between mb-6 lg:mb-10">
          <div className="flex items-center gap-2">
            <FilterMobileSheet
              sections={filterSections}
              filters={filters}
              onToggleCheckbox={toggleCheckbox}
              onChangeRange={changeRange}
              onClearAll={clearAll}
              activeCount={activeCount}
              resultCount={filteredCabins.length}
            />
            <span className="text-xs text-muted-foreground/50">
              {filteredCabins.length} cabaña{filteredCabins.length !== 1 ? "s" : ""}
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

          {/* Cabins Grid */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {filteredCabins.map((cabin, index) => (
                <CabinCard
                  key={cabin.id}
                  cabin={cabin}
                  index={index}
                  onSelect={() => navigate("cabin-detail", cabin.id)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredCabins.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <MapPin className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">
                  No hay cabañas con estos filtros
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
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            ¿No encuentras lo que buscas? Escríbenos y te ayudamos a encontrar la cabaña ideal.
          </p>
          <Button
            onClick={() => navigate("contact")}
            className="bg-ocean hover:bg-ocean-dark text-white rounded-full px-8"
          >
            Contáctanos
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
