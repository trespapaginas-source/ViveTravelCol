"use client";

import { cabins as cabinsData, Cabin } from "@/lib/data";
import { fetchCabins } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@/lib/store";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  BedDouble,
  Bath,
  Star,
  MapPin,
  ArrowRight,
  Waves,
} from "lucide-react";
import { motion } from "framer-motion";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function renderStars(rating: number) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={`full-${i}`} className="w-3.5 h-3.5 fill-sunset text-sunset" />
    );
  }
  if (hasHalf) {
    stars.push(
      <div key="half" className="relative">
        <Star className="w-3.5 h-3.5 text-muted-foreground/30" />
        <div className="absolute inset-0 overflow-hidden w-[50%]">
          <Star className="w-3.5 h-3.5 fill-sunset text-sunset" />
        </div>
      </div>
    );
  }
  const remaining = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < remaining; i++) {
    stars.push(
      <Star key={`empty-${i}`} className="w-3.5 h-3.5 text-muted-foreground/30" />
    );
  }
  return stars;
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <Card
        className="overflow-hidden cursor-pointer group border-border/50 hover:border-ocean/30 hover:shadow-xl transition-all duration-300 py-0 gap-0"
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
            <Badge className="bg-ocean/90 text-white backdrop-blur-sm border-0 text-xs font-semibold px-2.5 py-1">
              {formatPrice(cabin.pricePerNight)}/noche
            </Badge>
          </div>
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-white/90 text-foreground backdrop-blur-sm border-0 text-xs font-semibold px-2.5 py-1 gap-1">
              <Star className="w-3 h-3 fill-sunset text-sunset" />
              {cabin.rating}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 sm:p-5 space-y-3">
          {/* Name and Location */}
          <div>
            <h3 className="font-bold text-lg text-foreground group-hover:text-ocean transition-colors line-clamp-1">
              {cabin.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-sunset shrink-0" />
              <span className="line-clamp-1">{cabin.location}</span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {cabin.shortDescription}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-ocean" />
              <span>{cabin.capacity} huéspedes</span>
            </div>
            <div className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5 text-ocean" />
              <span>{cabin.bedrooms} hab.</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-ocean" />
              <span>{cabin.bathrooms} baño{cabin.bathrooms > 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Bottom Row: Rating and CTA */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1.5">
              <div className="flex">{renderStars(cabin.rating)}</div>
              <span className="text-xs text-muted-foreground">
                ({cabin.reviewCount})
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-ocean hover:text-ocean-dark hover:bg-ocean/5 gap-1 text-xs font-semibold px-2"
            >
              Ver más
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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

  const publishedCabins = cabins.filter((c) => c.published !== false);

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

        {/* Decorative wave */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-10"
        >
          <div className="h-px w-12 bg-ocean/30" />
          <Waves className="w-5 h-5 text-ocean" />
          <div className="h-px w-12 bg-ocean/30" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {publishedCabins.map((cabin, index) => (
            <CabinCard
              key={cabin.id}
              cabin={cabin}
              index={index}
              onSelect={() => navigate("cabin-detail", cabin.id)}
            />
          ))}
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
