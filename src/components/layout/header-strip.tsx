"use client";

import { Phone, Mail, TreePalm } from "lucide-react";

export function HeaderStrip() {
  return (
    <div
      className="relative w-full h-8 sm:h-10 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/header-strip.png')",
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-teal-dark/70" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-4 sm:gap-8 text-white text-[10px] sm:text-xs">
        <a
          href="tel:+573001234567"
          className="flex items-center gap-1.5 hover:text-amber-light transition-colors"
        >
          <Phone className="w-3 h-3" />
          <span className="hidden sm:inline">+57 300 123 4567</span>
        </a>
        <span className="text-white/30 hidden sm:inline">|</span>
        <a
          href="mailto:info@vivetravel.co"
          className="flex items-center gap-1.5 hover:text-amber-light transition-colors"
        >
          <Mail className="w-3 h-3" />
          <span className="hidden sm:inline">info@vivetravel.co</span>
        </a>
        <span className="text-white/30 hidden sm:inline">|</span>
        <span className="font-medium tracking-wide">
          <TreePalm className="w-3.5 h-3.5 inline" /> Vive la experiencia del Caribe colombiano
        </span>
      </div>
    </div>
  );
}
