"use client";

import { useState, useCallback } from "react";
import { Play, X, MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/lib/store";

export function VideoShowcase() {
  const { navigate } = useNavigation();
  const [videoOpen, setVideoOpen] = useState(false);

  const handlePlay = useCallback(() => {
    setVideoOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setVideoOpen(false);
  }, []);

  return (
    <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden content-visibility-auto contain-intrinsic-size-auto">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-ocean/[0.03] to-background" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-ocean/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-mint/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-5">
              Vive la experiencia{" "}
              <span className="text-ocean">caribeña</span>{" "}
              en cada destino
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Desde playas paradisíacas hasta selvas escondidas, el Atlántico
              colombiano te espera con aventuras únicas. Déjate inspirar y
              planea tu próxima escapada con nosotros.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mb-8">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-ocean">50+</p>
                <p className="text-xs text-muted-foreground mt-0.5">Experiencias</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-ocean">15+</p>
                <p className="text-xs text-muted-foreground mt-0.5">Destinos</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-ocean">100%</p>
                <p className="text-xs text-muted-foreground mt-0.5">Caribeño</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Button
                size="lg"
                onClick={() => navigate("plans", "pasadias")}
                className="bg-ocean hover:bg-ocean-dark text-white px-6 py-5 text-base rounded-xl shadow-lg shadow-ocean/20 transition-all duration-200 hover:scale-105 gap-2"
              >
                <Compass className="w-5 h-5" />
                Explorar experiencias
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("cabins")}
                className="border-ocean/30 text-ocean hover:bg-ocean/5 px-6 py-5 text-base rounded-xl transition-colors duration-200 gap-2"
              >
                <MapPin className="w-5 h-5" />
                Ver cabañas
              </Button>
            </div>
          </div>

          {/* Right: Video Player Area */}
          <div className="relative pt-6 sm:pt-0">
            {/* Video thumbnail with play button */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-ocean/10 group cursor-pointer" onClick={handlePlay}>
              {/* Thumbnail */}
              <img                 src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&h=900&fit=crop&q=80"
                alt="Vive Travel - Descubre el Atlántico"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
               onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl transition-all duration-200 group-hover:bg-white group-hover:shadow-2xl group-hover:scale-105 min-w-[44px] min-h-[44px]">
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-ocean fill-ocean ml-1" />
                </div>
              </div>

              {/* Bottom info bar */}
              <div className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img                     src="/logo.png"
                    alt="Vive Travel"
                    width={56}
                    height={28}
                    className="h-7 w-auto brightness-0 invert"
                   onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
                </div>
              </div>

              {/* Decorative border glow */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal — only renders when open */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-5xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Cerrar video"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video container */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl">
              <iframe
                src="https://www.youtube.com/embed/j8U06veqxgU?autoplay=1&rel=0&modestbranding=1"
                title="Vive Travel - Descubre el Atlántico"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
