"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoGalleryProps {
  images: string[];
  className?: string;
}

export function PhotoGallery({ images, className }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  if (images.length === 0) return null;

  // Single image
  if (images.length === 1) {
    return (
      <div className={cn("relative group rounded-2xl overflow-hidden", className)}>
        <img
          src={images[0]}
          alt="Imagen 1"
          className="w-full aspect-[16/10] object-cover cursor-pointer hover:brightness-95 transition-all"
          onClick={() => openLightbox(0)}
        />
      </div>
    );
  }

  // Two images
  if (images.length === 2) {
    return (
      <div className={cn("relative grid grid-cols-2 gap-2 rounded-2xl overflow-hidden", className)}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Imagen ${i + 1}`}
            className="w-full aspect-[16/10] object-cover cursor-pointer hover:brightness-95 transition-all"
            onClick={() => openLightbox(i)}
          />
        ))}
        <ShowAllButton onClick={() => openLightbox(0)} total={images.length} />
        <Lightbox
          images={images}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      </div>
    );
  }

  // 3+ images - Airbnb-style grid: 1 large + smaller grid
  return (
    <div className={cn("relative", className)}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
        {/* Main large image */}
        <div className="md:col-span-2 md:row-span-2">
          <img
            src={images[0]}
            alt="Imagen 1"
            className="w-full aspect-[4/3] md:aspect-auto md:h-full object-cover cursor-pointer hover:brightness-95 transition-all"
            onClick={() => openLightbox(0)}
          />
        </div>

        {/* Smaller images */}
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="relative">
            <img
              src={img}
              alt={`Imagen ${i + 2}`}
              className="w-full aspect-[4/3] object-cover cursor-pointer hover:brightness-95 transition-all"
              onClick={() => openLightbox(i + 1)}
            />
            {/* Show overlay on last visible image if there are more */}
            {i === 3 && images.length > 5 && (
              <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-all"
                onClick={() => openLightbox(i + 1)}
              >
                <span className="text-white text-lg font-semibold">
                  +{images.length - 5}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <ShowAllButton onClick={() => openLightbox(0)} total={images.length} />

      <Lightbox
        images={images}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        onPrev={goToPrev}
        onNext={goToNext}
      />
    </div>
  );
}

function ShowAllButton({ onClick, total }: { onClick: () => void; total: number }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="absolute bottom-4 right-4 bg-white/95 hover:bg-white text-foreground border-border shadow-md rounded-lg gap-1.5 text-sm font-medium z-10"
    >
      <Grid3X3 className="w-4 h-4" />
      Ver las {total} fotos
    </Button>
  );
}

interface LightboxProps {
  images: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ images, selectedIndex, onSelect, open, onOpenChange, onPrev, onNext }: LightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full p-0 bg-black/98 border-0 overflow-hidden rounded-xl">
        <DialogTitle className="sr-only">Galería de imágenes</DialogTitle>
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full"
          onClick={() => onOpenChange(false)}
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="relative flex flex-col items-center justify-center min-h-[70vh] py-8">
          {/* Main image */}
          <img
            src={images[selectedIndex]}
            alt={`Imagen ${selectedIndex + 1}`}
            className="max-h-[65vh] max-w-full object-contain px-12"
          />

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10"
                onClick={onPrev}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10"
                onClick={onNext}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Counter + Thumbnail strip */}
          <div className="mt-4 flex flex-col items-center gap-3">
            <span className="text-white/70 text-sm">
              {selectedIndex + 1} / {images.length}
            </span>
            {images.length > 1 && (
              <div className="flex gap-2 max-w-[80vw] overflow-x-auto no-scrollbar py-1 px-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => onSelect(i)}
                    className={cn(
                      "w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all",
                      selectedIndex === i
                        ? "border-white opacity-100 scale-105"
                        : "border-transparent opacity-40 hover:opacity-70"
                    )}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
