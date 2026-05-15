"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableSectionProps {
  children: React.ReactNode;
  maxHeight?: number; // Altura en px que equivale a ~6 líneas/filas
  itemCount?: number; // Cantidad exacta de items si es una lista
  className?: string;
}

export function ExpandableSection({
  children,
  maxHeight = 156, // ~6 líneas de texto base (16px * 1.625 * 6)
  itemCount,
  className,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Si pasamos itemCount, usamos esa lógica como fuente de verdad absoluta
  const definitelyNotExpandable = itemCount !== undefined && itemCount <= 6;

  useEffect(() => {
    if (definitelyNotExpandable) {
      const timeoutId = setTimeout(() => setIsExpandable(false), 0);
      return () => clearTimeout(timeoutId);
    }

    const checkHeight = () => {
      if (itemCount !== undefined && itemCount > 6) {
        setIsExpandable(true);
        return;
      }
      
      if (contentRef.current) {
        // Para texto: medimos si la altura real supera el maximo (equivalente a 6 líneas)
        setIsExpandable(contentRef.current.scrollHeight > maxHeight + 10);
      }
    };

    const initialTimeoutId = setTimeout(checkHeight, 0);
    const timeoutId = setTimeout(checkHeight, 100);
    window.addEventListener("resize", checkHeight);
    
    return () => {
      clearTimeout(initialTimeoutId);
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkHeight);
    };
  }, [maxHeight, itemCount, definitelyNotExpandable]);

  if (definitelyNotExpandable) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="relative">
        <div
          ref={contentRef}
          className="overflow-hidden transition-[max-height] duration-500 ease-in-out relative"
          style={{
            maxHeight: isExpandable && !isExpanded ? `${maxHeight}px` : "5000px",
          }}
        >
          {children}
          
          {/* Gradient overlay */}
          {isExpandable && !isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {isExpandable && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 w-fit text-sm font-semibold text-ocean hover:text-ocean-dark flex items-center gap-1.5 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean/50 rounded-sm"
        >
          {isExpanded ? "Ver menos" : "Ver más"}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
          ) : (
            <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          )}
        </button>
      )}
    </div>
  );
}
