"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
  aspectRatio?: "video" | "square" | "wide";
  showThumbnails?: boolean;
  className?: string;
  showExpand?: boolean;
}

export function ImageCarousel({
  images,
  aspectRatio = "video",
  showThumbnails = false,
  className,
  showExpand = true,
}: ImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Sync selectedIndex with the carousel's embla API
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect(); // Initial sync

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Scroll carousel to a given index
  const scrollToIndex = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      api?.scrollTo(index);
    },
    [api]
  );

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    wide: "aspect-[21/9]",
  };

  return (
    <>
      <div className={cn("relative group", className)}>
        <Carousel
          setApi={setApi}
          opts={{ loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {images.map((img, i) => (
              <CarouselItem key={i}>
                <div className={cn("relative overflow-hidden rounded-2xl", aspectClasses[aspectRatio])}>
                  <img                     src={img}
                    alt={`Imagen ${i + 1}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                   onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
                  {showExpand && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-black/40 text-white hover:bg-black/60 rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setSelectedIndex(i);
                        setLightboxOpen(true);
                      }}
                    >
                      <Expand className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-3 bg-white/80 hover:bg-white shadow-md border-0" />
          <CarouselNext className="right-3 bg-white/80 hover:bg-white shadow-md border-0" />
        </Carousel>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all",
                  selectedIndex === i
                    ? "border-ocean shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img                   src={img}
                  alt={`Miniatura ${i + 1}`}
                  className="w-full h-full object-cover"
                 onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
              </button>
            ))}
          </div>
        )}

        {/* Counter */}
        {images.length > 1 && !showThumbnails && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black/95 border-0 overflow-hidden">
          <DialogTitle className="sr-only">Visor de imágenes</DialogTitle>
          <div className="relative">
            <img               src={images[selectedIndex]}
              alt={`Imagen ${selectedIndex + 1}`}
              className="w-full max-h-[80vh] object-contain"
             onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 text-white hover:bg-white/30 rounded-full"
                onClick={() =>
                  scrollToIndex(
                    (selectedIndex - 1 + images.length) % images.length
                  )
                }
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-white text-sm">
                {selectedIndex + 1} / {images.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 text-white hover:bg-white/30 rounded-full"
                onClick={() =>
                  scrollToIndex((selectedIndex + 1) % images.length)
                }
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
