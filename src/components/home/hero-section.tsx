"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Palmtree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/lib/store";
import { heroImages } from "@/lib/data";

export function HeroSection() {
  const { navigate } = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden">
      {/* Embla Carousel */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full">
          {heroImages.map((image, index) => (
            <div key={image.id} className="flex-[0_0_100%] min-w-0 relative h-full">
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 z-10" />

      {/* Navigation arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 sm:p-3 transition-all duration-300"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 sm:p-3 transition-all duration-300"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-4 sm:mb-6"
          >
            <Palmtree className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-sm sm:text-base font-medium tracking-wider uppercase">
              Vive Travel
            </span>
            <MapPin className="w-4 h-4 text-white/70" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Descubre el{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-light to-mint-light">
              Atlántico
            </span>
          </h1>

          <p className="text-white/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed">
            Experiencias únicas en el departamento del Atlántico, Colombia.
            Playas, naturaleza, aventura y cultura caribeña te esperan.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("plans")}
              className="bg-ocean hover:bg-ocean-dark text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl shadow-lg shadow-ocean/30 transition-all duration-300 hover:scale-105"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Ver Planes
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("cabins")}
              className="border-white/40 text-white hover:bg-white/15 backdrop-blur-sm px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl transition-all duration-300 hover:scale-105 bg-transparent"
            >
              Ver Cabañas
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`transition-all duration-300 rounded-full ${
              index === selectedIndex
                ? "w-8 h-2.5 bg-ocean-light"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Caption */}
      <div className="absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-20">
        <p className="text-white/60 text-xs sm:text-sm tracking-wide">
          {heroImages[selectedIndex]?.caption}
        </p>
      </div>
    </section>
  );
}
