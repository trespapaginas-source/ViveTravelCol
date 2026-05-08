"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[current];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title="Lo que dicen nuestros viajeros"
          subtitle="Historias reales de quienes ya vivieron la experiencia Vive Travel"
        />

        <div className="relative">
          <div className="bg-card rounded-3xl shadow-sm border border-border/50 p-8 sm:p-12 relative overflow-hidden">
            {/* Decorative quote */}
            <div className="absolute top-6 left-6">
              <Quote className="w-12 h-12 text-foreground/[0.04]" />
            </div>

            {/* Avatar + Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground font-semibold text-sm">
                {t.avatar}
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-base">
                  {t.name}
                </h4>
                <p className="text-sm text-muted-foreground/60">{t.location}</p>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="text-foreground text-base sm:text-lg leading-relaxed mb-4 relative z-10">
              &ldquo;{t.text}&rdquo;
            </blockquote>

            {/* Trip name */}
            <p className="text-muted-foreground/50 text-sm font-medium">{t.tripName}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-border hover:border-foreground/20 hover:bg-muted/50 flex items-center justify-center transition-colors"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? "w-8 h-2.5 bg-ocean"
                      : "w-2.5 h-2.5 bg-muted-foreground/25 hover:bg-muted-foreground/40"
                  }`}
                  aria-label={`Ir a testimonio ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-border hover:border-foreground/20 hover:bg-muted/50 flex items-center justify-center transition-colors"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
