"use client";

import { useState, useEffect } from "react";
import { useNavigation } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, Palmtree, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
        scrolled
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
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                scrolled
                  ? "bg-ocean text-white"
                  : "bg-white/20 backdrop-blur-sm text-white"
              )}
            >
              <Palmtree className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  "text-lg font-bold leading-tight transition-colors duration-300",
                  scrolled ? "text-ocean-dark" : "text-white"
                )}
              >
                Vive Travel
              </span>
              <span
                className={cn(
                  "text-[10px] tracking-widest uppercase leading-tight transition-colors duration-300",
                  scrolled ? "text-ocean/70" : "text-white/70"
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
                    ? scrolled
                      ? "bg-ocean text-white shadow-md"
                      : "bg-white/20 backdrop-blur-sm text-white"
                    : scrolled
                    ? "text-foreground hover:bg-ocean/10 hover:text-ocean"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => handleNav("contact")}
              className={cn(
                "hidden sm:flex items-center gap-2 rounded-full transition-all duration-300",
                scrolled
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
                    scrolled ? "text-foreground" : "text-white"
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
                      <div className="w-8 h-8 rounded-lg bg-ocean text-white flex items-center justify-center">
                        <Palmtree className="w-5 h-5" />
                      </div>
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
