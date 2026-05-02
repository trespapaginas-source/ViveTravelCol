"use client";

import { cabins } from "@/lib/data";
import { useNavigation } from "@/lib/store";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  BedDouble,
  Bath,
  Check,
  ShieldCheck,
  Clock,
  CalendarDays,
  MessageCircle,
  Sparkles,
  AlertCircle,
  Heart,
  Share2,
  Home,
  Wind,
  Wifi,
  Car,
  Tv,
  UtensilsCrossed,
  Flame,
  Waves,
  TreePalm,
  Eye,
  ShowerHead,
  Sun,
  Coffee,
  Wine,
  Tent,
  Binoculars,
  Sailboat,
  Music,
  Lock,
  Baby,
  PawPrint,
  Cigarette,
  Volume2,
  Shield,
  TreeDeciduous,
} from "lucide-react";
import { motion } from "framer-motion";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function renderStars(rating: number, size = "w-4 h-4") {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={`full-${i}`} className={`${size} fill-sunset text-sunset`} />
    );
  }
  if (hasHalf) {
    stars.push(
      <div key="half" className="relative inline-block">
        <Star className={`${size} text-muted-foreground/30`} />
        <div className="absolute inset-0 overflow-hidden w-[50%]">
          <Star className={`${size} fill-sunset text-sunset`} />
        </div>
      </div>
    );
  }
  const remaining = 5 - fullStars - (hasHalf ? 1 : 0);
  for (let i = 0; i < remaining; i++) {
    stars.push(
      <Star key={`empty-${i}`} className={`${size} text-muted-foreground/30`} />
    );
  }
  return stars;
}

// Map amenity keywords to icons
function getAmenityIcon(amenity: string) {
  const lower = amenity.toLowerCase();
  if (lower.includes("piscina") || lower.includes("jacuzzi")) return Waves;
  if (lower.includes("aire") || lower.includes("ventilador")) return Wind;
  if (lower.includes("wifi")) return Wifi;
  if (lower.includes("estacionamiento") || lower.includes("parqueo")) return Car;
  if (lower.includes("tv") || lower.includes("smart")) return Tv;
  if (lower.includes("cocina")) return UtensilsCrossed;
  if (lower.includes("parrilla") || lower.includes("bbq") || lower.includes("barbacoa")) return Flame;
  if (lower.includes("hamaca") || lower.includes("hamaca")) return Tent;
  if (lower.includes("desayuno") || lower.includes("café") || lower.includes("coffee")) return Coffee;
  if (lower.includes("vino") || lower.includes("copa")) return Wine;
  if (lower.includes("binoculares") || lower.includes("avistamiento")) return Binoculars;
  if (lower.includes("kayak")) return Sailboat;
  if (lower.includes("ducha") || lower.includes("agua caliente")) return ShowerHead;
  if (lower.includes("solar") || lower.includes("energía")) return Sun;
  if (lower.includes("seguridad") || lower.includes("seguro")) return Shield;
  if (lower.includes("muelle")) return TreePalm;
  if (lower.includes("terraza") || lower.includes("balcón")) return Eye;
  if (lower.includes("jardín") || lower.includes("bosque")) return TreeDeciduous;
  if (lower.includes("toalla")) return ShowerHead;
  if (lower.includes("vela") || lower.includes("romántic")) return Heart;
  if (lower.includes("mosquitero")) return Home;
  if (lower.includes("lavadora")) return ShowerHead;
  if (lower.includes("silla") || lower.includes("sillas")) return Sun;
  if (lower.includes("cama")) return BedDouble;
  if (lower.includes("música")) return Music;
  if (lower.includes("candado") || lower.includes("cerradura")) return Lock;
  return Check;
}

// Map rule keywords to icons
function getRuleIcon(rule: string) {
  const lower = rule.toLowerCase();
  if (lower.includes("fiesta") || lower.includes("evento")) return Music;
  if (lower.includes("fumar") || lower.includes("cigarrillo")) return Cigarette;
  if (lower.includes("mascota")) return PawPrint;
  if (lower.includes("niño") || lower.includes("adulto") || lower.includes("18")) return Baby;
  if (lower.includes("silencio") || lower.includes("ruido") || lower.includes("música alta")) return Volume2;
  if (lower.includes("huésped") || lower.includes("máximo")) return Users;
  if (lower.includes("check-in") || lower.includes("check-out") || lower.includes("llegada") || lower.includes("salida")) return Clock;
  if (lower.includes("fauna") || lower.includes("naturaleza")) return TreeDeciduous;
  if (lower.includes("norma") || lower.includes("complejo")) return Shield;
  if (lower.includes("material") || lower.includes("cuidar")) return Home;
  return AlertCircle;
}

export function CabinDetail() {
  const { selectedItemId, navigate } = useNavigation();

  const cabin = cabins.find((c) => c.id === selectedItemId);

  if (!cabin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-lg">
            Cabaña no encontrada
          </p>
          <Button
            onClick={() => navigate("cabins")}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a cabañas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 sm:pt-24 pb-16">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("cabins")}
            className="gap-2 text-muted-foreground hover:text-ocean -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a cabañas
          </Button>
        </motion.div>
      </div>

      {/* Image Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <ImageCarousel
          images={cabin.images}
          aspectRatio="wide"
          showThumbnails
          showExpand
        />
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - Details */}
          <div className="flex-1 min-w-0">
            {/* Title, Rating, Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                    {cabin.name}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      {renderStars(cabin.rating, "w-4 h-4")}
                      <span className="text-sm font-semibold text-foreground ml-1">
                        {cabin.rating}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({cabin.reviewCount} evaluaciones)
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-ocean/10 text-ocean border-0 text-xs"
                    >
                      Superhost
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4 text-sunset shrink-0" />
                    <span className="text-sm">{cabin.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Key Stats Row - Airbnb style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-6 flex-wrap"
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-ocean" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {cabin.capacity} huéspedes
                  </p>
                </div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-ocean" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {cabin.bedrooms} habitación{cabin.bedrooms > 1 ? "es" : ""}
                  </p>
                </div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-ocean" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {cabin.bathrooms} baño{cabin.bathrooms > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Full Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Acerca de esta cabaña
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {cabin.fullDescription}
              </p>
            </motion.div>

            <Separator className="my-6" />

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sunset" />
                Puntos destacados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cabin.highlights.map((highlight, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-ocean/5 border border-ocean/10"
                  >
                    <div className="w-8 h-8 rounded-full bg-ocean/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-ocean" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-ocean" />
                Comodidades
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cabin.amenities.map((amenity, i) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-2"
                    >
                      <Icon className="w-4 h-4 text-ocean shrink-0" />
                      <span className="text-sm text-foreground">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Check-in / Check-out */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-ocean" />
                Horarios de llegada y salida
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-palm/5 border border-palm/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-palm" />
                    <span className="text-xs font-medium text-palm uppercase tracking-wider">
                      Check-in
                    </span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {cabin.checkIn}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-sunset/5 border border-sunset/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-sunset" />
                    <span className="text-xs font-medium text-sunset uppercase tracking-wider">
                      Check-out
                    </span>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    {cabin.checkOut}
                  </p>
                </div>
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-ocean" />
                Reglas de la cabaña
              </h2>
              <div className="space-y-3">
                {cabin.rules.map((rule, i) => {
                  const Icon = getRuleIcon(rule);
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{rule}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Cancellation Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-palm" />
                Política de cancelación
              </h2>
              <div className="p-4 rounded-xl bg-palm/5 border border-palm/10">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-palm shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {cabin.cancellationPolicy}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cancela dentro del plazo indicado y recibirás un reembolso completo.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile Price Card - shows at bottom on mobile */}
            <div className="lg:hidden mt-8">
              <PriceCard cabin={cabin} />
            </div>
          </div>

          {/* Right Column - Sticky Price Card (Desktop) */}
          <div className="hidden lg:block w-[380px] shrink-0">
            <div className="sticky top-28">
              <PriceCard cabin={cabin} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceCard({ cabin }: { cabin: (typeof cabins)[number] }) {
  const { navigate } = useNavigation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-border/50 shadow-xl py-0 gap-0">
        <CardContent className="p-6 space-y-5">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(cabin.pricePerNight)}
              </span>
              <span className="text-sm text-muted-foreground">/ noche</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rango: {cabin.priceRange}
            </p>
          </div>

          <Separator />

          {/* Date Selector Placeholder */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-0 rounded-xl border border-border overflow-hidden">
              <div className="p-3 border-r border-border">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Check-in
                </label>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  Seleccionar fecha
                </p>
              </div>
              <div className="p-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Check-out
                </label>
                <p className="text-sm font-medium text-foreground mt-0.5">
                  Seleccionar fecha
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-border p-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Huéspedes
              </label>
              <p className="text-sm font-medium text-foreground mt-0.5">
                1 huésped (máx. {cabin.capacity})
              </p>
            </div>
          </div>

          {/* Reserve Button */}
          <Button
            className="w-full bg-sunset hover:bg-sunset/90 text-white rounded-xl h-12 text-base font-semibold"
            onClick={() => navigate("contact")}
          >
            Reservar ahora
          </Button>

          {/* WhatsApp Button */}
          <Button
            asChild
            variant="outline"
            className="w-full rounded-xl h-11 border-palm/30 text-palm hover:bg-palm/5 gap-2"
          >
            <a
              href={`https://wa.me/573001234567?text=${encodeURIComponent(
                `Hola, me interesa la ${cabin.name} en ${cabin.location}. ¿Podrían darme más información?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4" />
              Preguntar por WhatsApp
            </a>
          </Button>

          {/* Price Breakdown Placeholder */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground underline decoration-dotted underline-offset-2">
                {formatPrice(cabin.pricePerNight)} x 1 noche
              </span>
              <span className="text-foreground">{formatPrice(cabin.pricePerNight)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground underline decoration-dotted underline-offset-2">
                Tarifa de servicio
              </span>
              <span className="text-foreground">{formatPrice(Math.round(cabin.pricePerNight * 0.08))}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm font-bold">
              <span>Total estimado</span>
              <span>{formatPrice(Math.round(cabin.pricePerNight * 1.08))}</span>
            </div>
          </div>

          <p className="text-[11px] text-center text-muted-foreground">
            No se hará ningún cargo por el momento
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
