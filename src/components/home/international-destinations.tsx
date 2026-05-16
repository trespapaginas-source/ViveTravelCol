"use client";

import { ArrowRight } from "lucide-react";
import { useNavigation } from "@/lib/store";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const internationalDestinations = [
  {
    name: "Cancún",
    eyebrow: "Escapadas al Caribe mexicano",
    image:
      "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=900&h=1125&fit=crop&q=80",
  },
  {
    name: "Punta Cana",
    eyebrow: "Playas, descanso y resorts",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=900&h=1125&fit=crop&q=80",
  },
  {
    name: "San Andrés",
    eyebrow: "Mar de siete colores",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&h=1125&fit=crop&q=80",
  },
];

export function InternationalDestinations() {
  const { navigate } = useNavigation();

  // Duplicar elementos para simular bucle infinito en móvil
  const carouselItems = [...internationalDestinations, ...internationalDestinations];

  return (
    <section className="py-16 sm:py-20 lg:py-24 content-visibility-auto contain-intrinsic-size-auto overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
            Explora destinos{" "}
            <span className="text-ocean">internacionales</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
            Descubre escapadas inolvidables fuera de Colombia
          </p>
        </div>

        <div className="flex sm:grid overflow-x-auto sm:overflow-visible sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 snap-x snap-mandatory scroll-smooth pb-4 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {carouselItems.map((destination, index) => {
            const isDuplicate = index >= internationalDestinations.length;
            return (
              <motion.article
                key={`${destination.name}-${index}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: isDuplicate ? 0 : index * 0.1,
                }}
                className={cn(
                  "group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer bg-muted border border-zinc-100 shrink-0 min-w-[85vw] sm:min-w-0 snap-center",
                  isDuplicate ? "block sm:hidden" : "block"
                )}
                onClick={() => navigate("plans", "internacionales")}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80";
                    e.currentTarget.onerror = null;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                  <p className="text-white/90 text-sm font-medium mb-2 drop-shadow-sm">
                    {destination.eyebrow}
                  </p>
                  <h3 className="text-white text-3xl sm:text-4xl font-bold leading-tight drop-shadow-sm">
                    {destination.name}
                  </h3>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 transition-colors duration-300 group-hover:bg-white group-hover:text-ocean">
                    Ver destino
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
