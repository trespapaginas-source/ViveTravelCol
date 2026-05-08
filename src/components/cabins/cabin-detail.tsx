"use client";

import { Cabin } from "@/lib/data";
import { fetchCabin } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@/lib/store";
import { PropertyGallery } from "@/components/shared/property-gallery";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowLeft,
  MapPin,
  Users,
  BedDouble,
  Bath,
  Check,
  ShieldCheck,
  Clock,
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
  Minus,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { type DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale/es";
import { toast } from "sonner";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { ShareDialog } from "@/components/shared/share-dialog";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
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

// Map highlight keywords to icons
function getHighlightIcon(highlight: string) {
  const lower = highlight.toLowerCase();
  if (lower.includes("mar") || lower.includes("frente")) return Waves;
  if (lower.includes("piscina")) return Waves;
  if (lower.includes("sostenible") || lower.includes("eco")) return TreeDeciduous;
  if (lower.includes("manglar")) return TreePalm;
  if (lower.includes("muelle")) return Sailboat;
  if (lower.includes("ave") || lower.includes("observación")) return Binoculars;
  if (lower.includes("familia") || lower.includes("familiar")) return Users;
  if (lower.includes("habitación")) return BedDouble;
  if (lower.includes("juego")) return Baby;
  if (lower.includes("seguridad")) return Shield;
  if (lower.includes("jacuzzi")) return ShowerHead;
  if (lower.includes("romántic") || lower.includes("bohem")) return Heart;
  if (lower.includes("desayuno")) return Coffee;
  if (lower.includes("atardecer")) return Sun;
  if (lower.includes("auténtic") || lower.includes("costeñ")) return TreePalm;
  if (lower.includes("palma") || lower.includes("techo")) return TreePalm;
  if (lower.includes("económica")) return Badge;
  if (lower.includes("jardín")) return TreeDeciduous;
  if (lower.includes("caribe") || lower.includes("diseño")) return Sparkles;
  if (lower.includes("playa") || lower.includes("acceso")) return Waves;
  return Sparkles;
}

export function CabinDetail() {
  const { selectedItemId, navigate } = useNavigation();

  const { data: cabin, isLoading } = useQuery({
    queryKey: ["cabin", selectedItemId],
    queryFn: () => fetchCabin(selectedItemId!),
    enabled: !!selectedItemId,
  });

  const [isFav, setIsFav] = useState(() =>
    typeof window !== "undefined" && selectedItemId
      ? isFavorite(selectedItemId)
      : false
  );

  const [shareOpen, setShareOpen] = useState(false);

  const handleToggleFavorite = useCallback(() => {
    if (!selectedItemId) return;
    const nowFav = toggleFavorite(selectedItemId);
    setIsFav(nowFav);
    toast.success(nowFav ? "Guardado en tu colección" : "Eliminado de tu colección", {
      description: nowFav ? "Encuéntralo en tu lista de favoritos" : undefined,
    });
  }, [selectedItemId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-ocean border-t-transparent rounded-full" />
      </div>
    );
  }

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
    <div className="pb-28 lg:pb-16">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 pt-20 sm:pt-24">
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

      {/* Image Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <PropertyGallery
          images={cabin.images}
          title={cabin.name}
        />
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column - Details */}
          <div className="flex-1 min-w-0">
            {/* Title, Location, Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {cabin.name}
                  </h1>
                  <div className="flex items-center gap-1.5 text-muted-foreground mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                    <span className="text-sm">{cabin.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-9 w-9 border-border/50 hover:border-border"
                    onClick={() => setShareOpen(true)}
                    aria-label="Compartir"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full h-9 w-9 border-border/50 hover:border-border transition-colors ${
                      isFav ? "border-indigo/30 bg-indigo/5" : ""
                    }`}
                    onClick={handleToggleFavorite}
                    aria-label={isFav ? "Eliminar de favoritos" : "Guardar en favoritos"}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? "fill-indigo text-indigo" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </motion.div>

            <Separator className="my-5" />

            {/* Key Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-5 flex-wrap"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground">{cabin.capacity} huéspedes</span>
              </div>
              <div className="w-px h-6 bg-border/60" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                  <BedDouble className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground">{cabin.bedrooms} habitación{cabin.bedrooms > 1 ? "es" : ""}</span>
              </div>
              <div className="w-px h-6 bg-border/60" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center">
                  <Bath className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <span className="text-sm text-foreground">{cabin.bathrooms} baño{cabin.bathrooms > 1 ? "s" : ""}</span>
              </div>
            </motion.div>

            <Separator className="my-5" />

            {/* Full Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-base font-semibold text-foreground mb-2.5">
                Acerca de esta cabaña
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {cabin.fullDescription}
              </p>
            </motion.div>

            <Separator className="my-5" />

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <h2 className="text-base font-semibold text-foreground mb-3.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ocean/60" />
                Puntos destacados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {cabin.highlights.map((highlight, i) => {
                  const HIcon = getHighlightIcon(highlight);
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-muted/40 transition-colors"
                    >
                      <HIcon className="w-4 h-4 text-ocean/50 shrink-0" />
                      <span className="text-sm text-foreground">
                        {highlight}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <Separator className="my-5" />

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-base font-semibold text-foreground mb-3.5 flex items-center gap-2">
                <Home className="w-4 h-4 text-ocean/60" />
                Comodidades
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {cabin.amenities.map((amenity, i) => {
                  const AIcon = getAmenityIcon(amenity);
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 py-1.5 px-1"
                    >
                      <AIcon className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                      <span className="text-sm text-foreground">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <Separator className="my-5" />

            {/* Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <h2 className="text-base font-semibold text-foreground mb-3.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-ocean/60" />
                Reglas de la cabaña
              </h2>
              <div className="space-y-2">
                {cabin.rules.map((rule, i) => {
                  const RIcon = getRuleIcon(rule);
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 py-1.5"
                    >
                      <RIcon className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{rule}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <Separator className="my-5" />

            {/* Cancellation Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-base font-semibold text-foreground mb-3.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-leaf/60" />
                Política de cancelación
              </h2>
              <div className="p-4 rounded-xl bg-muted/40 border border-border/50">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-leaf/60 shrink-0 mt-0.5" />
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

      {/* Mobile Sticky CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border/50 px-4 py-3 safe-area-bottom">
        <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
          <div>
            <p className="text-xs text-muted-foreground">Desde</p>
            <p className="text-lg font-bold text-foreground">{formatPrice(cabin.pricePerNight)}<span className="text-xs font-normal text-muted-foreground">/noche</span></p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-10 border-leaf/30 text-leaf hover:bg-leaf/5 gap-1.5"
              asChild
            >
              <a
                href={`https://wa.me/573001234567?text=${encodeURIComponent(
                  `Hola, me interesa la ${cabin.name} en ${cabin.location}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden xs:inline">WhatsApp</span>
              </a>
            </Button>
            <Button
              size="sm"
              className="bg-ocean hover:bg-ocean-dark text-white rounded-full h-10 px-5"
              onClick={() => navigate("contact")}
            >
              Reservar
            </Button>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        title={cabin.name}
        text={`Mira esta cabaña: ${cabin.name} en ${cabin.location}`}
      />
    </div>
  );
}

function PriceCard({ cabin }: { cabin: Cabin }) {
  const { navigate } = useNavigation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [guests, setGuests] = useState(1);
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nightCount =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from)
      : 0;

  const subtotal = nightCount * cabin.pricePerNight;
  const serviceFee = Math.round(subtotal * 0.08);
  const total = subtotal + serviceFee;

  const formatDateShort = (date: Date) => {
    return format(date, "d 'de' MMM", { locale: es });
  };

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

          {/* Date Selector & Guest Selector */}
          <div className="space-y-3">
            {/* Date Range Picker */}
            <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  className="w-full grid grid-cols-2 gap-0 rounded-xl border border-border overflow-hidden text-left hover:border-ocean/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean/30"
                  aria-label="Seleccionar fechas"
                >
                  <div className="p-3 border-r border-border">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Check-in
                    </label>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {dateRange?.from
                        ? formatDateShort(dateRange.from)
                        : "Seleccionar fecha"}
                    </p>
                  </div>
                  <div className="p-3">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Check-out
                    </label>
                    <p className="text-sm font-medium text-foreground mt-0.5">
                      {dateRange?.to
                        ? formatDateShort(dateRange.to)
                        : "Seleccionar fecha"}
                    </p>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                sideOffset={8}
              >
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    if (range?.to) {
                      setDatePopoverOpen(false);
                    }
                  }}
                  disabled={{ before: today }}
                  numberOfMonths={1}
                  locale={es}
                  defaultMonth={today}
                />
              </PopoverContent>
            </Popover>

            {/* Guest Selector */}
            <Popover open={guestPopoverOpen} onOpenChange={setGuestPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  className="w-full rounded-xl border border-border p-3 text-left hover:border-ocean/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean/30"
                  aria-label="Seleccionar huéspedes"
                >
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Huéspedes
                  </label>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {guests} huésped{guests > 1 ? "es" : ""} (máx. {cabin.capacity})
                  </p>
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 p-4"
                align="start"
                sideOffset={8}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Huéspedes</p>
                    <p className="text-xs text-muted-foreground">
                      Máximo {cabin.capacity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      disabled={guests <= 1}
                      aria-label="Reducir huéspedes"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-6 text-center text-sm font-semibold text-foreground">
                      {guests}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setGuests((g) => Math.min(cabin.capacity, g + 1))}
                      disabled={guests >= cabin.capacity}
                      aria-label="Aumentar huéspedes"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Reserve Button */}
          <Button
            className="w-full bg-ocean hover:bg-ocean-dark text-white rounded-xl h-12 text-base font-semibold"
            onClick={() => navigate("contact")}
          >
            Reservar ahora
          </Button>

          {/* WhatsApp Button */}
          <Button
            asChild
            variant="outline"
            className="w-full rounded-xl h-11 border-leaf/30 text-leaf hover:bg-leaf/5 gap-2"
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

          {/* Dynamic Price Breakdown */}
          <div className="space-y-2 pt-2">
            {nightCount > 0 ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground underline decoration-dotted underline-offset-2">
                    {formatPrice(cabin.pricePerNight)} x {nightCount} noche{nightCount > 1 ? "s" : ""}
                  </span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground underline decoration-dotted underline-offset-2">
                    Tarifa de servicio
                  </span>
                  <span className="text-foreground">{formatPrice(serviceFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-bold">
                  <span>Total estimado</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground underline decoration-dotted underline-offset-2">
                    {formatPrice(cabin.pricePerNight)} x -- noches
                  </span>
                  <span className="text-muted-foreground">--</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground underline decoration-dotted underline-offset-2">
                    Tarifa de servicio
                  </span>
                  <span className="text-muted-foreground">--</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-bold">
                  <span>Total estimado</span>
                  <span className="text-muted-foreground">--</span>
                </div>
              </>
            )}
          </div>

          <p className="text-[11px] text-center text-muted-foreground">
            No se hará ningún cargo por el momento
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
