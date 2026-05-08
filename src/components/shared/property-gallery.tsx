"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  title?: string;
  className?: string;
}

// ─── Desktop Gallery: Booking.com style ────────────────────────────────────────
// 2 columns: Left ~60% (1 large image full height) + Right ~40% (2 stacked images)
// "+N fotos" overlay on the bottom-right image

function DesktopGallery({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: (index: number) => void;
}) {
  const count = images.length;
  // Calculate how many extra photos exist beyond the 3 visible ones
  const extraCount = count > 3 ? count - 3 : 0;

  if (count === 1) {
    return (
      <div
        className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer group"
        onClick={() => onImageClick(0)}
      >
        <GalleryImage src={images[0]} alt="Imagen 1" priority />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="flex gap-2 rounded-2xl overflow-hidden h-[460px]">
        {/* Left large image */}
        <div
          className="relative flex-[3] cursor-pointer group overflow-hidden"
          onClick={() => onImageClick(0)}
        >
          <GalleryImage src={images[0]} alt="Imagen 1" priority />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        {/* Right image */}
        <div
          className="relative flex-[2] cursor-pointer group overflow-hidden"
          onClick={() => onImageClick(1)}
        >
          <GalleryImage src={images[1]} alt="Imagen 2" priority />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </div>
    );
  }

  // 3+ images: Booking.com layout — 1 large left, 2 stacked right
  return (
    <div className="flex gap-2 rounded-2xl overflow-hidden h-[460px]">
      {/* Left: Main large image */}
      <div
        className="relative flex-[3] cursor-pointer group overflow-hidden"
        onClick={() => onImageClick(0)}
      >
        <GalleryImage src={images[0]} alt="Imagen 1" priority />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Right: 2 stacked images */}
      <div className="flex-[2] flex flex-col gap-2">
        <div
          className="relative flex-1 cursor-pointer group overflow-hidden"
          onClick={() => onImageClick(1)}
        >
          <GalleryImage src={images[1]} alt="Imagen 2" priority />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
        <div
          className="relative flex-1 cursor-pointer group overflow-hidden"
          onClick={() => onImageClick(2)}
        >
          <GalleryImage src={images[2]} alt="Imagen 3" priority={false} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          {/* "+N fotos" overlay */}
          {extraCount > 0 && <MorePhotosOverlay count={extraCount} />}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Gallery: 2x2 grid, 4:3 aspect ─────────────────────────────────────

function MobileGallery({
  images,
  onImageClick,
}: {
  images: string[];
  onImageClick: (index: number) => void;
}) {
  const displayImages = images.slice(0, 4);
  const extraCount = images.length > 4 ? images.length - 4 : 0;

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-1.5 rounded-xl overflow-hidden">
      {displayImages.map((img, i) => (
        <div
          key={i}
          className="relative cursor-pointer group overflow-hidden aspect-[4/3]"
          onClick={() => onImageClick(i)}
        >
          <GalleryImage src={img} alt={`Imagen ${i + 1}`} priority={i < 2} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
          {/* "+N fotos" overlay on last visible image */}
          {i === 3 && extraCount > 0 && (
            <MorePhotosOverlay count={extraCount} />
          )}
        </div>
      ))}
      {/* Fill empty cells if less than 4 images */}
      {displayImages.length < 4 &&
        Array.from({ length: 4 - displayImages.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="bg-muted/30 aspect-[4/3]"
          />
        ))}
    </div>
  );
}

// ─── Optimized Gallery Image ───────────────────────────────────────────────────

function GalleryImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className="w-full h-full object-cover transition-transform duration-500"
    />
  );
}

// ─── "+N fotos" Overlay ────────────────────────────────────────────────────────

function MorePhotosOverlay({ count }: { count: number }) {
  return (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
      <span className="text-white font-semibold text-base">
        +{count} foto{count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

// ─── Full-Screen Lightbox ──────────────────────────────────────────────────────

function Lightbox({
  images,
  initialIndex,
  onClose,
  title,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
  title?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(((index % images.length) + images.length) % images.length);
    },
    [images.length]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 shrink-0">
        <div className="min-w-0">
          {title && (
            <p className="text-white/80 text-sm font-medium truncate max-w-[50vw]">
              {title}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-sm tabular-nums">
            {currentIndex + 1} / {images.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-9 w-9"
            aria-label="Cerrar galería"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Image Area */}
      <div className="flex-1 relative flex items-center justify-center px-4 sm:px-12 pb-4 min-h-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Imagen ${currentIndex + 1}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 backdrop-blur-sm"
              onClick={() => goTo(currentIndex - 1)}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 backdrop-blur-sm"
              onClick={() => goTo(currentIndex + 1)}
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="shrink-0 px-4 pb-4 sm:pb-6">
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar max-w-4xl mx-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-200",
                  currentIndex === i
                    ? "border-white scale-105 shadow-lg"
                    : "border-transparent opacity-40 hover:opacity-70"
                )}
              >
                <img
                  src={img}
                  alt={`Miniatura ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────

export function PropertyGallery({ images, title, className }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  return (
    <div className={cn("relative", className)}>
      {/* Desktop Gallery */}
      <div className="hidden sm:block">
        <DesktopGallery images={images} onImageClick={handleImageClick} />
      </div>

      {/* Mobile Gallery */}
      <div className="sm:hidden">
        <MobileGallery images={images} onImageClick={handleImageClick} />
      </div>

      {/* Lightbox — key forces remount when clicking a different starting image */}
      {lightboxOpen && (
        <Lightbox
          key={lightboxIndex}
          images={images}
          initialIndex={lightboxIndex}
          onClose={handleCloseLightbox}
          title={title}
        />
      )}
    </div>
  );
}
