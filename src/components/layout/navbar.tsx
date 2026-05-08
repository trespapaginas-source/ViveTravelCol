"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigation, type ViewType } from "@/lib/store";
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

/** Check if a nav item is active, including nested detail views */
function isItemActive(itemKey: string, currentView: ViewType): boolean {
  if (currentView === itemKey) return true;
  if (itemKey === "plans" && currentView === "plan-detail") return true;
  if (itemKey === "cabins" && currentView === "cabin-detail") return true;
  return false;
}

export function Navbar() {
  const { currentView, navigate } = useNavigation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const tickingRef = useRef(false);

  const isHome = currentView === "home";
  const showOpaque = !isHome || scrolled;

  // Throttled scroll handler using rAF — avoids excessive re-renders
  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigate immediately — no delay. Close mobile menu after navigate.
  const handleNav = useCallback(
    (view: Parameters<typeof navigate>[0]) => {
      navigate(view);
      // Close mobile menu after navigation starts
      setMobileOpen(false);
    },
    [navigate]
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
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
              width={120}
              height={48}
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
                  "px-2.5 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-colors duration-200",
                  isItemActive(item.key, currentView)
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
                "rounded-full h-10 w-10 sm:h-9 sm:w-9 transition-colors duration-200",
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
                "hidden sm:flex items-center gap-2 rounded-full transition-colors duration-200",
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
                    "md:hidden h-10 w-10",
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
                      width={90}
                      height={36}
                      className="h-9 w-auto"
                    />
                  </div>
                  <nav className="flex flex-col p-4 gap-1 overflow-y-auto">
                    {navItems.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => handleNav(item.key)}
                        className={cn(
                          "px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors duration-150",
                          isItemActive(item.key, currentView)
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
                        "flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors duration-150",
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
