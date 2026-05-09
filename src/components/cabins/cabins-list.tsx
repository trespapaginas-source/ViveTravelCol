"use client";

import { useMemo, memo } from "react";
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
import { ListToolbar, type ViewMode, type SortOption, cabinSortOptions } from "@/components/shared/list-toolbar";
import { ListPagination } from "@/components/shared/list-pagination";
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
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { sortCabins, getGridCols, ITEMS_PER_PAGE } from "@/lib/sorting";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Memoized cabin card
const CabinCard = memo(function CabinCard({
  cabin,
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
    <Card
      className="overflow-hidden cursor-pointer group border-border/50 hover:border-ocean/20 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 py-0 gap-0"
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
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-105 transition-all duration-200 min-w-[44px] min-h-[44px]"
          aria-label={isFav ? "Eliminar de favoritos" : "Guardar en favoritos"}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors duration-200 ${
              isFav ? "fill-indigo text-indigo" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>

      <CardContent className="p-3.5 sm:p-4 space-y-2">
        {/* Name and Location */}
        <div>
          <h3 className="font-semibold text-[15px] text-foreground group-hover:text-ocean transition-colors duration-200 line-clamp-1 leading-snug">
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
  );
});

export function CabinsList() {
  const { navigate } = useNavigation();
  const { data: cabins = [], isLoading } = useQuery({
    queryKey: ["cabins"],
    queryFn: fetchCabins,
  });

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>("2");
  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Apply filters
  const filteredCabins = useMemo(
    () => filterCabins(publishedCabins, filters),
    [publishedCabins, filters]
  );

  // Apply sorting
  const sortedCabins = useMemo(
    () => sortCabins(filteredCabins, sortOption),
    [filteredCabins, sortOption]
  );

  // Pagination
  const totalPages = Math.ceil(sortedCabins.length / ITEMS_PER_PAGE);
  const paginatedCabins = useMemo(
    () => sortedCabins.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [sortedCabins, currentPage]
  );

  // Reset page when filters or sort change
  const handleSortChange = useCallback((option: SortOption) => {
    setSortOption(option);
    setCurrentPage(1);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  const handleClearAll = useCallback(() => {
    clearAll();
    setCurrentPage(1);
  }, [clearAll]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSelect = useCallback(
    (cabinId: string) => navigate("cabin-detail", cabinId),
    [navigate]
  );

  const gridCols = getGridCols(viewMode);

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Nuestras Cabañas"
            subtitle="Descubre el alojamiento perfecto para tu escapada al Caribe colombiano."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden py-0 gap-0">
                <Skeleton className="aspect-video" />
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
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <SectionHeader
          title="Nuestras Cabañas"
          subtitle="Descubre el alojamiento perfecto para tu escapada al Caribe colombiano. Desde refugios románticos hasta espacios familiares frente al mar."
        />

        {/* Mobile filter button */}
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div className="flex items-center gap-2">
            <FilterMobileSheet
              sections={filterSections}
              filters={filters}
              onToggleCheckbox={toggleCheckbox}
              onChangeRange={changeRange}
              onClearAll={handleClearAll}
              activeCount={activeCount}
              resultCount={filteredCabins.length}
            />
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
            onClearAll={handleClearAll}
            activeCount={activeCount}
          />

          {/* Cabins Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar: Sort + View toggle */}
            <div className="mb-5">
              <ListToolbar
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                sortOption={sortOption}
                onSortOptionChange={handleSortChange}
                sortOptions={cabinSortOptions}
                resultCount={filteredCabins.length}
                resultLabel={`cabaña${filteredCabins.length !== 1 ? "s" : ""}`}
              />
            </div>

            <div className={`grid ${gridCols} gap-5 sm:gap-6`}>
              {paginatedCabins.map((cabin, index) => (
                <CabinCard
                  key={cabin.id}
                  cabin={cabin}
                  index={index}
                  onSelect={() => handleSelect(cabin.id)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredCabins.length === 0 && (
              <div className="text-center py-16">
                <MapPin className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">
                  No hay cabañas con estos filtros
                </p>
                <p className="text-muted-foreground/60 text-sm mb-4">
                  Intenta ajustar los filtros para encontrar más opciones
                </p>
                <button
                  onClick={handleClearAll}
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            {/* Pagination */}
            <ListPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            ¿No encuentras lo que buscas? Escríbenos y te ayudamos a encontrar la cabaña ideal.
          </p>
          <Button
            onClick={() => navigate("contact")}
            className="bg-ocean hover:bg-ocean-dark text-white rounded-full px-8"
          >
            Contáctanos
          </Button>
        </div>
      </div>
    </section>
  );
}
