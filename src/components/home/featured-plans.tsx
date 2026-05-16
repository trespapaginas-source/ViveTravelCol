"use client";

import { memo, useCallback } from "react";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatShortDuration, formatShortLocation, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { useNavigation } from "@/lib/store";
import { fetchPlans } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

const PlanCard = memo(function PlanCard({
  plan,
  onNavigate,
}: {
  plan: { id: string; name: string; images: string[]; category: string; duration: string; location: string; shortDescription: string; price: number };
  onNavigate: (id: string) => void;
}) {
  return (
    <Card
      className="group h-full cursor-pointer overflow-hidden border border-zinc-100 hover:border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-1 py-0 gap-0 shadow-none"
      onClick={() => onNavigate(plan.id)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[3/2]">
        <img
          src={plan.images[0]}
          alt={plan.name}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80";
            e.currentTarget.onerror = null;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-white/90" />
          <span className="text-white/90 text-xs font-medium drop-shadow-sm">{formatShortDuration(plan.duration)}</span>
        </div>
      </div>

      <CardContent className="p-4 sm:p-5 flex flex-col h-[calc(100%-75%)] min-h-[160px]">
        <h3 className="font-bold text-[17px] text-foreground line-clamp-2 group-hover:text-ocean transition-colors duration-200 leading-snug">
          {plan.name}
        </h3>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          <span className="line-clamp-1">{formatShortLocation(plan.location)}</span>
        </div>

        <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed mt-2">
          {plan.shortDescription}
        </p>

        <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-end">
          <div className="text-right">
            <p className="text-foreground font-bold text-[17px] sm:text-[18px] leading-tight">
              {formatPrice(plan.price)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export function FeaturedPlans() {
  const { navigate } = useNavigation();
  const { data: allPlans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });

  const handleNavigate = useCallback(
    (id: string) => navigate("plan-detail", id),
    [navigate]
  );

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Planes turísticos destacados"
            subtitle="Descubre nuestras experiencias más populares en Colombia"
          />
          <div className="mt-8 flex sm:grid overflow-x-auto sm:overflow-visible sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 snap-x snap-mandatory scroll-smooth pb-4 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 min-w-[85vw] sm:min-w-0 snap-center">
                <Card className="overflow-hidden py-0 gap-0 shadow-none border border-zinc-100">
                  <Skeleton className="aspect-[4/3] sm:aspect-[3/2] w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-4 w-1/3 mt-4 self-end" />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const featuredPlans = allPlans.filter((p) => p.published !== false).slice(0, 4);
  const carouselItems = [...featuredPlans, ...featuredPlans];

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 content-visibility-auto contain-intrinsic-size-auto overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Planes turísticos destacados"
          subtitle="Descubre nuestras experiencias más populares en Colombia"
        />

        <div className="flex sm:grid overflow-x-auto sm:overflow-visible sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 snap-x snap-mandatory scroll-smooth pb-4 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {carouselItems.map((plan, index) => {
            const isDuplicate = index >= featuredPlans.length;
            return (
              <motion.div
                key={`${plan.id}-${index}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: isDuplicate ? 0 : index * 0.1,
                }}
                className={cn(
                  "shrink-0 min-w-[85vw] sm:min-w-0 snap-center h-full",
                  isDuplicate ? "block sm:hidden" : "block"
                )}
              >
                <PlanCard plan={plan} onNavigate={handleNavigate} />
              </motion.div>
            );
          })}
        </div>

        {/* View all plans CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("plans", "pasadias")}
            className="border-ocean text-ocean hover:bg-ocean hover:text-white transition-colors duration-300 px-8 rounded-xl font-semibold shadow-sm"
          >
            Ver todas las experiencias
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
