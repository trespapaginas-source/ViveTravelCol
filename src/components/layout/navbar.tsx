"use client";

import { useState, useEffect } from "react";
import { useNavigation } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, Palmtree, Phone, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { PremiumIcon } from "@/components/shared/premium-icon";

const navItems = [
  { key: "home" as const, label: "Inicio" },
  { key: "plans" as const, label: "Planes" },
  { key: "cabins" as const, label: "Cabañas" },
  { key: "contact" as const, label: "Contacto" },
  { key: "policies" as const, label: "Políticas" },
];

export function Navbar() {
  const { currentView, navigate } = useNavigation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = currentView === "home";
  const showOpaque = !isHome || scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (view: Parameters<typeof navigate>[0]) => {
    navigate(view);
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        showOpaque
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-ocean/10"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNav("home")}
            className="flex items-center gap-2 group"
          >
            <PremiumIcon icon={Palmtree} variant="solid" theme="ocean" size="md" />
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-lg font-bold leading-tight transition-colors duration-300",
                  showOpaque ? "text-ocean-dark" : "text-white"
                )}
              >
                Vive Travel
              </span>
              <span
                className={cn(
                  "text-[10px] tracking-widest uppercase leading-tight transition-colors duration-300",
                  showOpaque ? "text-ocean/70" : "text-white/70"
                )}
              >
                Atlántico
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  currentView === item.key ||
                    (item.key === "plans" && currentView === "plan-detail") ||
                    (item.key === "cabins" && currentView === "cabin-detail")
                    ? showOpaque
                      ? "bg-ocean text-white shadow-md"
                      : "bg-white/20 backdrop-blur-sm text-white"
                    : showOpaque
                    ? "text-foreground hover:bg-ocean/10 hover:text-ocean"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA + Favorites + Mobile */}
          <div className="flex items-center gap-2">
            {/* Favorites */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNav("favorites")}
              className={cn(
                "rounded-full h-9 w-9 transition-all duration-300",
                currentView === "favorites"
                  ? showOpaque
                    ? "bg-coral/10 text-coral"
                    : "bg-white/20 text-white"
                  : showOpaque
                  ? "text-foreground/60 hover:text-coral hover:bg-coral/5"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
              aria-label="Mis favoritos"
            >
              <Heart className={cn(
                "w-4 h-4",
                currentView === "favorites" && "fill-current"
              )} />
            </Button>

            {/* Reservar CTA */}
            <Button
              onClick={() => handleNav("contact")}
              className={cn(
                "hidden sm:flex items-center gap-2 rounded-full transition-all duration-300",
                showOpaque
                  ? "bg-sunset hover:bg-sunset/90 text-white"
                  : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
              )}
            >
              <Phone className="w-4 h-4" />
              Reservar
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "md:hidden",
                    showOpaque ? "text-foreground" : "text-white"
                  )}
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                      <PremiumIcon icon={Palmtree} variant="solid" theme="ocean" size="sm" />
                      <span className="font-bold text-ocean-dark">Vive Travel</span>
                    </div>
                  </div>
                  <nav className="flex flex-col p-4 gap-1">
                    {navItems.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => handleNav(item.key)}
                        className={cn(
                          "px-4 py-3 rounded-xl text-left text-sm font-medium transition-all",
                          currentView === item.key
                            ? "bg-ocean/10 text-ocean font-semibold"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                    <button
                      onClick={() => handleNav("favorites")}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all",
                        currentView === "favorites"
                          ? "bg-coral/10 text-coral font-semibold"
                          : "text-foreground hover:bg-muted"
                      )}
                    >
                      <Heart className={cn(
                        "w-4 h-4",
                        currentView === "favorites" && "fill-current"
                      )} />
                      Mi Colección
                    </button>
                  </nav>
                  <div className="mt-auto p-4 border-t">
                    <Button
                      onClick={() => handleNav("contact")}
                      className="w-full bg-sunset hover:bg-sunset/90 text-white rounded-full"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Reservar ahora
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
