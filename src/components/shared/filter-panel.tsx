"use client";

import { useState, useCallback, useMemo } from "react";
import { ChevronDown, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { type TourPlan, type Cabin } from "@/lib/data";

// ─── Filter Types ──────────────────────────────────────────────────────────────

interface CheckboxFilterOption {
  label: string;
  value: string;
  count: number;
}

interface CheckboxFilterSection {
  id: string;
  title: string;
  type: "checkbox";
  options: CheckboxFilterOption[];
  initialShowCount?: number;
}

interface RangeFilterSection {
  id: string;
  title: string;
  type: "range";
  min: number;
  max: number;
  step: number;
  formatLabel: (value: number) => string;
}

type FilterSection = CheckboxFilterSection | RangeFilterSection;

export interface FilterState {
  checkboxes: Record<string, string[]>;
  ranges: Record<string, [number, number]>;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Filter Configuration Builders ─────────────────────────────────────────────

export function buildPlanFilters(plans: TourPlan[]): FilterSection[] {
  // Category counts
  const categoryCounts: Record<string, number> = {};
  plans.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  // Location counts
  const locationCounts: Record<string, number> = {};
  plans.forEach((p) => {
    locationCounts[p.location] = (locationCounts[p.location] || 0) + 1;
  });

  // Duration counts
  const durationCounts: Record<string, number> = {};
  plans.forEach((p) => {
    const dur = p.duration;
    durationCounts[dur] = (durationCounts[dur] || 0) + 1;
  });

  // Difficulty counts
  const difficultyCounts: Record<string, number> = {};
  plans.forEach((p) => {
    difficultyCounts[p.difficulty] = (difficultyCounts[p.difficulty] || 0) + 1;
  });

  // Price range
  const prices = plans.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return [
    {
      id: "category",
      title: "Categoría",
      type: "checkbox",
      options: Object.entries(categoryCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([label, count]) => ({ label, value: label, count })),
    },
    {
      id: "location",
      title: "Ubicación",
      type: "checkbox",
      options: Object.entries(locationCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([label, count]) => ({ label, value: label, count })),
    },
    {
      id: "price",
      title: "Precio",
      type: "range",
      min: minPrice,
      max: maxPrice,
      step: 5000,
      formatLabel: formatCOP,
    },
    {
      id: "duration",
      title: "Duración",
      type: "checkbox",
      options: Object.entries(durationCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([label, count]) => ({ label, value: label, count })),
    },
    {
      id: "difficulty",
      title: "Dificultad",
      type: "checkbox",
      options: Object.entries(difficultyCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([label, count]) => ({ label, value: label, count })),
    },
  ];
}

export function buildCabinFilters(cabins: Cabin[]): FilterSection[] {
  // Location counts
  const locationCounts: Record<string, number> = {};
  cabins.forEach((c) => {
    locationCounts[c.location] = (locationCounts[c.location] || 0) + 1;
  });

  // Capacity counts
  const capacityCounts: Record<string, number> = {};
  cabins.forEach((c) => {
    const label = `${c.capacity} huéspedes`;
    capacityCounts[label] = (capacityCounts[label] || 0) + 1;
  });

  // Bedroom counts
  const bedroomCounts: Record<string, number> = {};
  cabins.forEach((c) => {
    const label = `${c.bedrooms} hab.`;
    bedroomCounts[label] = (bedroomCounts[label] || 0) + 1;
  });

  // Bathroom counts
  const bathroomCounts: Record<string, number> = {};
  cabins.forEach((c) => {
    const label = `${c.bathrooms} baño${c.bathrooms > 1 ? "s" : ""}`;
    bathroomCounts[label] = (bathroomCounts[label] || 0) + 1;
  });

  // Amenity counts (top amenities)
  const amenityCounts: Record<string, number> = {};
  cabins.forEach((c) => {
    c.amenities.forEach((a) => {
      amenityCounts[a] = (amenityCounts[a] || 0) + 1;
    });
  });

  // Price range
  const prices = cabins.map((c) => c.pricePerNight);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return [
    {
      id: "location",
      title: "Ubicación",
      type: "checkbox",
      options: Object.entries(locationCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([label, count]) => ({ label, value: label, count })),
    },
    {
      id: "price",
      title: "Precio por noche",
      type: "range",
      min: minPrice,
      max: maxPrice,
      step: 10000,
      formatLabel: formatCOP,
    },
    {
      id: "capacity",
      title: "Capacidad",
      type: "checkbox",
      options: Object.entries(capacityCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([label, count]) => ({ label, value: label, count })),
    },
    {
      id: "bedrooms",
      title: "Habitaciones",
      type: "checkbox",
      options: Object.entries(bedroomCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([label, count]) => ({ label, value: label, count })),
    },
    {
      id: "bathrooms",
      title: "Baños",
      type: "checkbox",
      options: Object.entries(bathroomCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([label, count]) => ({ label, value: label, count })),
    },
    {
      id: "amenities",
      title: "Servicios",
      type: "checkbox",
      initialShowCount: 5,
      options: Object.entries(amenityCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([label, count]) => ({ label, value: label, count })),
    },
  ];
}

// ─── Filter Logic ──────────────────────────────────────────────────────────────

export function filterPlans(plans: TourPlan[], filters: FilterState): TourPlan[] {
  return plans.filter((plan) => {
    // Category
    const categories = filters.checkboxes["category"] || [];
    if (categories.length > 0 && !categories.includes(plan.category)) return false;

    // Location
    const locations = filters.checkboxes["location"] || [];
    if (locations.length > 0 && !locations.includes(plan.location)) return false;

    // Price
    const priceRange = filters.ranges["price"];
    if (priceRange && (plan.price < priceRange[0] || plan.price > priceRange[1])) return false;

    // Duration
    const durations = filters.checkboxes["duration"] || [];
    if (durations.length > 0 && !durations.includes(plan.duration)) return false;

    // Difficulty
    const difficulties = filters.checkboxes["difficulty"] || [];
    if (difficulties.length > 0 && !difficulties.includes(plan.difficulty)) return false;

    return true;
  });
}

export function filterCabins(cabins: Cabin[], filters: FilterState): Cabin[] {
  return cabins.filter((cabin) => {
    // Location
    const locations = filters.checkboxes["location"] || [];
    if (locations.length > 0 && !locations.includes(cabin.location)) return false;

    // Price
    const priceRange = filters.ranges["price"];
    if (priceRange && (cabin.pricePerNight < priceRange[0] || cabin.pricePerNight > priceRange[1])) return false;

    // Capacity
    const capacities = filters.checkboxes["capacity"] || [];
    if (capacities.length > 0) {
      const capLabel = `${cabin.capacity} huéspedes`;
      if (!capacities.includes(capLabel)) return false;
    }

    // Bedrooms
    const bedrooms = filters.checkboxes["bedrooms"] || [];
    if (bedrooms.length > 0) {
      const bedLabel = `${cabin.bedrooms} hab.`;
      if (!bedrooms.includes(bedLabel)) return false;
    }

    // Bathrooms
    const bathrooms = filters.checkboxes["bathrooms"] || [];
    if (bathrooms.length > 0) {
      const bathLabel = `${cabin.bathrooms} baño${cabin.bathrooms > 1 ? "s" : ""}`;
      if (!bathrooms.includes(bathLabel)) return false;
    }

    // Amenities
    const amenityFilters = filters.checkboxes["amenities"] || [];
    if (amenityFilters.length > 0) {
      const hasAll = amenityFilters.every((a) => cabin.amenities.includes(a));
      if (!hasAll) return false;
    }

    return true;
  });
}

// ─── Default Filter State ──────────────────────────────────────────────────────

export function createDefaultFilterState(sections: FilterSection[]): FilterState {
  const checkboxes: Record<string, string[]> = {};
  const ranges: Record<string, [number, number]> = {};

  sections.forEach((section) => {
    if (section.type === "checkbox") {
      checkboxes[section.id] = [];
    } else {
      ranges[section.id] = [section.min, section.max];
    }
  });

  return { checkboxes, ranges };
}

export function countActiveFilters(filters: FilterState, sections: FilterSection[]): number {
  let count = 0;

  sections.forEach((section) => {
    if (section.type === "checkbox") {
      count += (filters.checkboxes[section.id] || []).length;
    } else {
      const range = filters.ranges[section.id];
      if (range && (range[0] !== section.min || range[1] !== section.max)) {
        count += 1;
      }
    }
  });

  return count;
}

// ─── Checkbox Section Component ────────────────────────────────────────────────

function FilterCheckboxSection({
  section,
  selectedValues,
  onToggle,
}: {
  section: CheckboxFilterSection;
  selectedValues: string[];
  onToggle: (sectionId: string, value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const showCount = section.initialShowCount || section.options.length;
  const displayedOptions = showAll ? section.options : section.options.slice(0, showCount);
  const hasMore = section.options.length > showCount;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
        <span className="text-sm font-medium text-foreground/90">{section.title}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground/50 transition-transform duration-200 ${
            isOpen ? "" : "-rotate-90"
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pb-3">
        {displayedOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2.5 py-1 px-1 rounded-md hover:bg-muted/50 cursor-pointer group/item transition-colors"
          >
            <Checkbox
              checked={selectedValues.includes(option.value)}
              onCheckedChange={() => onToggle(section.id, option.value)}
              className="data-[state=checked]:bg-foreground data-[state=checked]:border-foreground data-[state=checked]:text-white"
            />
            <span className="text-[13px] text-foreground/80 group-hover/item:text-foreground transition-colors flex-1 leading-tight">
              {option.label}
            </span>
            <span className="text-[11px] text-muted-foreground/50 tabular-nums">
              {option.count}
            </span>
          </label>
        ))}
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[12px] text-foreground/50 hover:text-foreground/70 transition-colors ml-7 mt-1"
          >
            {showAll ? "Mostrar menos" : `Mostrar más (${section.options.length - showCount})`}
          </button>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── Range Section Component ───────────────────────────────────────────────────

function FilterRangeSection({
  section,
  value,
  onChange,
}: {
  section: RangeFilterSection;
  value: [number, number];
  onChange: (sectionId: string, value: [number, number]) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
        <span className="text-sm font-medium text-foreground/90">{section.title}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground/50 transition-transform duration-200 ${
            isOpen ? "" : "-rotate-90"
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4 pt-2 px-1">
        <div className="space-y-3">
          <Slider
            value={value}
            min={section.min}
            max={section.max}
            step={section.step}
            onValueChange={(v) => onChange(section.id, v as [number, number])}
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground/70 tabular-nums">
              {section.formatLabel(value[0])}
            </span>
            <span className="text-xs text-muted-foreground/70 tabular-nums">
              {section.formatLabel(value[1])}
            </span>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ─── Main Filter Panel Content ─────────────────────────────────────────────────

function FilterPanelContent({
  sections,
  filters,
  onToggleCheckbox,
  onChangeRange,
  onClearAll,
  activeCount,
}: {
  sections: FilterSection[];
  filters: FilterState;
  onToggleCheckbox: (sectionId: string, value: string) => void;
  onChangeRange: (sectionId: string, value: [number, number]) => void;
  onClearAll: () => void;
  activeCount: number;
}) {
  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-foreground/60" />
          <span className="text-sm font-semibold text-foreground">Filtros</span>
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="h-5 min-w-5 text-[10px] px-1.5 bg-foreground text-white rounded-full"
            >
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-[12px] text-muted-foreground/60 hover:text-foreground/80 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>

      <Separator className="mb-2" />

      {/* Active Filters Tags */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-2">
          {sections.map((section) => {
            if (section.type === "checkbox") {
              const selected = filters.checkboxes[section.id] || [];
              return selected.map((value) => {
                const option = section.options.find((o) => o.value === value);
                return (
                  <button
                    key={`${section.id}-${value}`}
                    onClick={() => onToggleCheckbox(section.id, value)}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-muted/80 text-foreground/70 hover:bg-muted transition-colors"
                  >
                    {option?.label || value}
                    <X className="w-2.5 h-2.5" />
                  </button>
                );
              });
            }
            // Range active indicator
            const range = filters.ranges[section.id];
            if (
              section.type === "range" &&
              range &&
              (range[0] !== section.min || range[1] !== section.max)
            ) {
              return (
                <button
                  key={section.id}
                  onClick={() => onChangeRange(section.id, [section.min, section.max])}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-muted/80 text-foreground/70 hover:bg-muted transition-colors"
                >
                  {section.formatLabel(range[0])} – {section.formatLabel(range[1])}
                  <X className="w-2.5 h-2.5" />
                </button>
              );
            }
            return null;
          })}
        </div>
      )}

      {/* Filter Sections */}
      {sections.map((section, index) => (
        <div key={section.id}>
          {section.type === "checkbox" ? (
            <FilterCheckboxSection
              section={section}
              selectedValues={filters.checkboxes[section.id] || []}
              onToggle={onToggleCheckbox}
            />
          ) : (
            <FilterRangeSection
              section={section}
              value={filters.ranges[section.id] || [section.min, section.max]}
              onChange={onChangeRange}
            />
          )}
          {index < sections.length - 1 && <Separator className="my-1" />}
        </div>
      ))}
    </div>
  );
}

// ─── Desktop Sidebar ───────────────────────────────────────────────────────────

export function FilterSidebar(props: {
  sections: FilterSection[];
  filters: FilterState;
  onToggleCheckbox: (sectionId: string, value: string) => void;
  onChangeRange: (sectionId: string, value: [number, number]) => void;
  onClearAll: () => void;
  activeCount: number;
}) {
  return (
    <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
      <div className="sticky top-24 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 p-4 shadow-sm">
        <FilterPanelContent {...props} />
      </div>
    </aside>
  );
}

// ─── Mobile Filter Sheet ───────────────────────────────────────────────────────

export function FilterMobileSheet(props: {
  sections: FilterSection[];
  filters: FilterState;
  onToggleCheckbox: (sectionId: string, value: string) => void;
  onChangeRange: (sectionId: string, value: [number, number]) => void;
  onClearAll: () => void;
  activeCount: number;
  resultCount: number;
}) {
  const {
    sections,
    filters,
    onToggleCheckbox,
    onChangeRange,
    onClearAll,
    activeCount,
    resultCount,
  } = props;

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs relative"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filtros
            {activeCount > 0 && (
              <Badge className="h-4 min-w-4 text-[9px] px-1 bg-foreground text-white rounded-full absolute -top-1.5 -right-1.5">
                {activeCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader className="pb-0">
            <SheetTitle className="text-base">Filtros</SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {resultCount} resultado{resultCount !== 1 ? "s" : ""} encontrado{resultCount !== 1 ? "s" : ""}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-20">
            <FilterPanelContent
              sections={sections}
              filters={filters}
              onToggleCheckbox={onToggleCheckbox}
              onChangeRange={onChangeRange}
              onClearAll={onClearAll}
              activeCount={activeCount}
            />
          </div>
          <SheetFooter className="absolute bottom-0 left-0 right-0 bg-background border-t p-3">
            <Button
              onClick={onClearAll}
              variant="outline"
              className="w-full text-xs"
              disabled={activeCount === 0}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Limpiar filtros
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── useFilterState Hook ───────────────────────────────────────────────────────

export function useFilterState(sections: FilterSection[]) {
  const defaultState = useMemo(
    () => createDefaultFilterState(sections),
    [sections]
  );

  const [filters, setFilters] = useState<FilterState>(defaultState);

  const toggleCheckbox = useCallback(
    (sectionId: string, value: string) => {
      setFilters((prev) => {
        const current = prev.checkboxes[sectionId] || [];
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return {
          ...prev,
          checkboxes: { ...prev.checkboxes, [sectionId]: next },
        };
      });
    },
    []
  );

  const changeRange = useCallback(
    (sectionId: string, value: [number, number]) => {
      setFilters((prev) => ({
        ...prev,
        ranges: { ...prev.ranges, [sectionId]: value },
      }));
    },
    []
  );

  const clearAll = useCallback(() => {
    setFilters(defaultState);
  }, [defaultState]);

  const activeCount = useMemo(
    () => countActiveFilters(filters, sections),
    [filters, sections]
  );

  return { filters, toggleCheckbox, changeRange, clearAll, activeCount };
}
