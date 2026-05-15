"use client";

import { ArrowRight } from "lucide-react";
import { useNavigation } from "@/lib/store";

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

  return (
    <section className="py-16 sm:py-20 lg:py-24 content-visibility-auto contain-intrinsic-size-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {internationalDestinations.map((destination) => (
            <article
              key={destination.name}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl shadow-black/10 cursor-pointer bg-muted"
              onClick={() => navigate("plans", "internacionales")}
            >
              <img                 src={destination.image}
                alt={destination.name}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
               onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <p className="text-white/80 text-sm font-medium mb-2">
                  {destination.eyebrow}
                </p>
                <h3 className="text-white text-3xl sm:text-4xl font-bold leading-tight">
                  {destination.name}
                </h3>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-ocean shadow-lg transition-colors duration-200 group-hover:bg-ocean group-hover:text-white">
                  Ver destino
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-white/15" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
