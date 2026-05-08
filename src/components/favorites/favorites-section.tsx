"use client";

import { useNavigation } from "@/lib/store";
import { getFavorites } from "@/lib/favorites";
import { fetchCabin } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import {
  Heart,
  MapPin,
  Users,
  BedDouble,
  Bath,
  ArrowRight,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { toggleFavorite } from "@/lib/favorites";
import { toast } from "sonner";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function FavoriteCard({
  cabinId,
  onSelect,
  onRemove,
}: {
  cabinId: string;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const { data: cabin, isLoading } = useQuery({
    queryKey: ["cabin", cabinId],
    queryFn: () => fetchCabin(cabinId),
    enabled: !!cabinId,
  });

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleFavorite(cabinId);
      onRemove();
      toast.success("Eliminado de tu colección");
    },
    [cabinId, onRemove]
  );

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 py-0 gap-0">
        <div className="aspect-video bg-muted animate-pulse" />
        <CardContent className="p-4 space-y-3">
          <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </CardContent>
      </Card>
    );
  }

  if (!cabin) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="overflow-hidden cursor-pointer group border-border/50 hover:border-ocean/20 hover:shadow-lg transition-all duration-300 py-0 gap-0"
        onClick={onSelect}
      >
        <div className="relative">
          <ImageCarousel
            images={cabin.images}
            aspectRatio="video"
            showExpand={false}
            className="[&_.border-0]:border-0"
          />
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-105 transition-all duration-200"
            aria-label="Eliminar de favoritos"
          >
            <Heart className="w-3.5 h-3.5 fill-indigo text-indigo" />
          </button>
        </div>

        <CardContent className="p-3.5 sm:p-4 space-y-2">
          <div>
            <h3 className="font-semibold text-[15px] text-foreground group-hover:text-ocean transition-colors line-clamp-1 leading-snug">
              {cabin.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="w-3 h-3 shrink-0 text-muted-foreground/60" />
              <span className="line-clamp-1">{cabin.location}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
            {cabin.shortDescription}
          </p>

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

          <div className="flex items-center justify-between pt-1.5 border-t border-border/30">
            <span className="text-sm font-semibold text-foreground">
              {formatPrice(cabin.pricePerNight)}<span className="text-xs font-normal text-muted-foreground">/noche</span>
            </span>
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

export function FavoritesSection() {
  const { navigate } = useNavigation();
  const [favIds, setFavIds] = useState<string[]>(() =>
    typeof window !== "undefined" ? getFavorites() : []
  );

  const handleRemove = useCallback(() => {
    setFavIds(getFavorites());
  }, []);

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="Tu Colección"
            subtitle="Tus cabañas favoritas guardadas para comparar y encontrar tu escapada ideal."
          />
        </motion.div>

        {favIds.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4">
              <Compass className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1.5">
              Tu colección está vacía
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              Explora nuestras cabañas y guarda las que más te gusten tocando el ícono de corazón.
            </p>
            <Button
              onClick={() => navigate("cabins")}
              className="bg-ocean hover:bg-ocean-dark text-white rounded-full px-8 gap-2"
            >
              Explorar cabañas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {favIds.map((id) => (
                <FavoriteCard
                  key={id}
                  cabinId={id}
                  onSelect={() => navigate("cabin-detail", id)}
                  onRemove={handleRemove}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
