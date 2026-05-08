"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/shared/section-header";
import { useNavigation } from "@/lib/store";
import { type TourPlan } from "@/lib/data";
import { fetchPlans } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { PremiumIcon, RatingStars } from "@/components/shared/premium-icon";

const categoryColors: Record<string, string> = {
  Naturaleza: "bg-palm text-white",
  Playa: "bg-ocean text-white",
  Aventura: "bg-sunset text-white",
  Ecoturismo: "bg-palm-light text-white",
  Experiencia: "bg-coral text-white",
  Cultural: "bg-sand text-white",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function FeaturedPlans() {
  const { navigate } = useNavigation();
  const { data: allPlans = [] } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
  });
  const featuredPlans = allPlans.filter((p) => p.published !== false).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            title="Planes Destacados"
            subtitle="Descubre nuestras experiencias más populares en el Atlántico"
          />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 py-0 gap-0"
                onClick={() => navigate("plan-detail", plan.id)}
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={plan.images[0]}
                    alt={plan.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Category badge */}
                  <Badge
                    className={`absolute top-3 left-3 ${
                      categoryColors[plan.category] || "bg-ocean text-white"
                    } border-0 text-xs font-medium`}
                  >
                    {plan.category}
                  </Badge>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 [&_span]:text-white">
                    <RatingStars rating={plan.rating} size="sm" showValue={true} />
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                    <PremiumIcon icon={Clock} variant="glass" theme="white" size="xs" />
                    <span className="text-white/90 text-xs">{plan.duration}</span>
                  </div>
                </div>

                <CardContent className="p-4 sm:p-5">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1.5 line-clamp-1 group-hover:text-ocean transition-colors">
                    {plan.name}
                  </h3>

                  <div className="flex items-center gap-1.5 mb-2">
                    <PremiumIcon icon={MapPin} variant="default" theme="coral" size="xs" />
                    <span className="text-muted-foreground text-xs line-clamp-1">
                      {plan.location}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2 leading-relaxed">
                    {plan.shortDescription}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div>
                      <span className="text-xs text-muted-foreground">Desde</span>
                      <p className="text-ocean font-bold text-sm sm:text-base">
                        {formatPrice(plan.price)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-ocean hover:text-ocean-dark hover:bg-ocean/10 -mr-2"
                    >
                      Ver más
                      <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View all plans CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 sm:mt-12 text-center"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("plans")}
            className="border-ocean text-ocean hover:bg-ocean hover:text-white transition-all duration-300 px-8 rounded-xl"
          >
            Ver todos los planes
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
