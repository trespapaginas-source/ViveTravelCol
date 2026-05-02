"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Star,
  Users,
  Mountain,
  Waves,
  Compass,
  Leaf,
  Sparkles,
  Landmark,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/shared/section-header";
import { useNavigation } from "@/lib/store";
import { tourPlans, type TourPlan } from "@/lib/data";

const categories = [
  { value: "Todos", label: "Todos", icon: Compass },
  { value: "Naturaleza", label: "Naturaleza", icon: Leaf },
  { value: "Playa", label: "Playa", icon: Waves },
  { value: "Aventura", label: "Aventura", icon: Mountain },
  { value: "Ecoturismo", label: "Ecoturismo", icon: Sparkles },
  { value: "Experiencia", label: "Experiencia", icon: Star },
  { value: "Cultural", label: "Cultural", icon: Landmark },
];

const categoryColors: Record<string, string> = {
  Naturaleza: "bg-palm text-white",
  Playa: "bg-ocean text-white",
  Aventura: "bg-sunset text-white",
  Ecoturismo: "bg-palm-light text-white",
  Experiencia: "bg-coral text-white",
  Cultural: "bg-sand text-white",
};

const difficultyColors: Record<string, string> = {
  Fácil: "bg-palm/15 text-palm border-palm/30",
  Moderado: "bg-sunset/15 text-sunset border-sunset/30",
  Avanzado: "bg-coral/15 text-coral border-coral/30",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO").format(price);
}

function PlanCard({ plan, onNavigate }: { plan: TourPlan; onNavigate: (id: string) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="cursor-pointer"
      onClick={() => onNavigate(plan.id)}
    >
      <Card className="overflow-hidden group border-border/50 hover:border-ocean/40 hover:shadow-xl transition-all duration-300 py-0 gap-0">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={plan.images[0]}
            alt={plan.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Category Badge */}
          <Badge
            className={`absolute top-3 left-3 ${categoryColors[plan.category] || "bg-ocean text-white"} border-0 text-xs font-semibold px-3 py-1`}
          >
            {plan.category}
          </Badge>

          {/* Difficulty Badge */}
          <Badge
            variant="outline"
            className={`absolute top-3 right-3 text-xs font-medium ${difficultyColors[plan.difficulty]}`}
          >
            {plan.difficulty}
          </Badge>

          {/* Price overlay */}
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
            <span className="text-ocean font-bold text-sm">
              ${formatPrice(plan.price)}
            </span>
            <span className="text-muted-foreground text-xs"> COP</span>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Name & Rating */}
          <div>
            <h3 className="font-bold text-foreground text-base leading-tight line-clamp-1 group-hover:text-ocean transition-colors">
              {plan.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Star className="w-4 h-4 fill-sunset text-sunset" />
              <span className="text-sm font-semibold text-foreground">
                {plan.rating}
              </span>
              <span className="text-xs text-muted-foreground">
                ({plan.reviewCount} reseñas)
              </span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {plan.shortDescription}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-ocean" />
              <span>{plan.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-coral" />
              <span className="line-clamp-1">{plan.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-palm" />
              <span>Máx. {plan.maxGuests}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function PlansList() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const navigate = useNavigation((s) => s.navigate);

  const filteredPlans =
    activeCategory === "Todos"
      ? tourPlans
      : tourPlans.filter((p) => p.category === activeCategory);

  const handleNavigate = (planId: string) => {
    navigate("plan-detail", planId);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Nuestros Planes"
          subtitle="Descubre experiencias únicas en el Atlántico colombiano. Desde aventuras en la naturaleza hasta noches mágicas bajo las estrellas."
        />

        {/* Filter Tabs */}
        <div className="mb-8 sm:mb-10 flex justify-center">
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="mx-auto flex-wrap h-auto gap-1 bg-muted/60 p-1.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="text-xs sm:text-sm data-[state=active]:bg-ocean data-[state=active]:text-white gap-1.5 px-2.5 sm:px-3 py-1.5"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{cat.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Plans Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPlans.map((plan, i) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onNavigate={handleNavigate}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredPlans.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Compass className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">
              No hay planes disponibles en esta categoría
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
