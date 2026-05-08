"use client";

import { useState, useEffect } from "react";
import { useNavigation } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, Phone, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "home" as const, label: "Inicio" },
  { key: "plans" as const, label: "Planes" },
  { key: "cabins" as const, label: "Cabañas" },
  { key: "team" as const, label: "Equipo" },
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
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNav("home")}
            className="flex items-center group"
          >
            <img
              src="/logo.png"
              alt="Vive Travel"
              className={cn(
                "h-10 sm:h-12 w-auto transition-all duration-300",
                !showOpaque && "brightness-0 invert"
              )}
            />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={cn(
                  "px-2.5 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all duration-300",
                  currentView === item.key ||
                    (item.key === "plans" && currentView === "plan-detail") ||
                    (item.key === "cabins" && currentView === "cabin-detail")
                    ? showOpaque
                      ? "bg-ocean text-white"
                      : "bg-white/20 backdrop-blur-sm text-white"
                    : showOpaque
                    ? "text-muted-foreground hover:bg-muted hover:text-ocean-dark"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
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
                    ? "bg-ocean/10 text-ocean"
                    : "bg-white/20 text-white"
                  : showOpaque
                  ? "text-muted-foreground/50 hover:text-ocean hover:bg-ocean/5"
                  : "text-white/50 hover:text-white hover:bg-white/10"
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
                  ? "bg-ocean hover:bg-ocean-dark text-white"
                  : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20"
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
                    showOpaque ? "text-ocean-dark" : "text-white"
                  )}
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <img
                      src="/logo.png"
                      alt="Vive Travel"
                      className="h-9 w-auto"
                    />
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
                            : "text-muted-foreground hover:bg-muted hover:text-ocean"
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
                          ? "bg-ocean/10 text-ocean font-semibold"
                          : "text-muted-foreground hover:bg-muted hover:text-ocean"
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
                      className="w-full bg-ocean hover:bg-ocean-dark text-white rounded-full"
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
