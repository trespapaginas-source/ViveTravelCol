"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SlidersHorizontal,
  MapPin,
  DollarSign,
  Mountain,
  Leaf,
  Waves,
  Star,
  Clock,
  Users,
  BedDouble,
  ChevronDown,
  X,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TourPlan, Cabin } from "@/lib/data";

// ─── Plan Filter Types ────────────────────────────────────────────────────────

export interface PlanFilters {
  categories: string[];
  locations: string[];
  priceRange: [number, number];
  difficulties: string[];
  durations: string[];
}

export const defaultPlanFilters: PlanFilters = {
  categories: [],
  locations: [],
  priceRange: [0, 250000],
  difficulties: [],
  durations: [],
};

// ─── Cabin Filter Types ───────────────────────────────────────────────────────

export interface CabinFilters {
  locations: string[];
  priceRange: [number, number];
  capacities: string[];
  bedrooms: string[];
}

export const defaultCabinFilters: CabinFilters = {
  locations: [],
  priceRange: [0, 500000],
  capacities: [],
  bedrooms: [],
};

// ─── Derived Data from Plans ──────────────────────────────────────────────────

export function getPlanFilterData(plans: TourPlan[]) {
  const categories = [...new Set(plans.map((p) => p.category))].sort();
  const locations = [...new Set(plans.map((p) => p.location))].sort();
  const difficulties = [...new Set(plans.map((p) => p.difficulty))].sort();
  const durations = [...new Set(plans.map((p) => p.duration))].sort();
  const prices = plans.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  return { categories, locations, difficulties, durations, minPrice, maxPrice };
}

// ─── Derived Data from Cabins ─────────────────────────────────────────────────

export function getCabinFilterData(cabins: Cabin[]) {
  const locations = [...new Set(cabins.map((c) => c.location))].sort();
  const capacities = [...new Set(cabins.map((c) => c.capacity))].sort((a, b) => a - b);
  const bedrooms = [...new Set(cabins.map((c) => c.bedrooms))].sort((a, b) => a - b);
  const prices = cabins.map((c) => c.pricePerNight);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  return { locations, capacities, bedrooms, minPrice, maxPrice };
}

// ─── Filter Functions ─────────────────────────────────────────────────────────

export function filterPlans(plans: TourPlan[], filters: PlanFilters): TourPlan[] {
  return plans.filter((plan) => {
    if (filters.categories.length > 0 && !filters.categories.includes(plan.category)) return false;
    if (filters.locations.length > 0 && !filters.locations.includes(plan.location)) return false;
    if (filters.difficulties.length > 0 && !filters.difficulties.includes(plan.difficulty)) return false;
    if (filters.durations.length > 0 && !filters.durations.includes(plan.duration)) return false;
    if (plan.price < filters.priceRange[0] || plan.price > filters.priceRange[1]) return false;
    return true;
  });
}

export function filterCabins(cabins: Cabin[], filters: CabinFilters): Cabin[] {
  return cabins.filter((cabin) => {
    if (filters.locations.length > 0 && !filters.locations.includes(cabin.location)) return false;
    if (cabin.pricePerNight < filters.priceRange[0] || cabin.pricePerNight > filters.priceRange[1]) return false;
    if (filters.capacities.length > 0 && !filters.capacities.includes(String(cabin.capacity))) return false;
    if (filters.bedrooms.length > 0 && !filters.bedrooms.includes(String(cabin.bedrooms))) return false;
    return true;
  });
}

// ─── Shared Filter Components ─────────────────────────────────────────────────

function FilterSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 group">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function CheckboxList({
  options,
  selected,
  onToggle,
  formatLabel,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  formatLabel?: (value: string) => string;
}) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <div
          key={option}
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => onToggle(option)}
          role="checkbox"
          aria-checked={selected.includes(option)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              onToggle(option);
            }
          }}
        >
          <div
            className={cn(
              "w-4.5 h-4.5 rounded border-2 flex items-center justify-center transition-all",
              selected.includes(option)
                ? "bg-teal border-teal"
                : "border-muted-foreground/30 group-hover:border-teal/50"
            )}
          >
            {selected.includes(option) && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className={cn(
            "text-sm transition-colors",
            selected.includes(option) ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
          )}>
            {formatLabel ? formatLabel(option) : option}
          </span>
        </div>
      ))}
    </div>
  );
}

function PriceSlider({
  range,
  min,
  max,
  onChange,
}: {
  range: [number, number];
  min: number;
  max: number;
  onChange: (range: [number, number]) => void;
}) {
  const formatPrice = (val: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-3 px-1">
      <Slider
        value={range}
        min={min}
        max={max}
        step={5000}
        onValueChange={(val) => onChange(val as [number, number])}
        className="w-full"
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatPrice(range[0])}</span>
        <span>{formatPrice(range[1])}</span>
      </div>
    </div>
  );
}

// ─── Plan Filter Sidebar ──────────────────────────────────────────────────────

function PlanFilterContent({
  filters,
  onChange,
  filterData,
}: {
  filters: PlanFilters;
  onChange: (filters: PlanFilters) => void;
  filterData: ReturnType<typeof getPlanFilterData>;
}) {
  const toggleCategory = (cat: string) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  };

  const toggleLocation = (loc: string) => {
    const next = filters.locations.includes(loc)
      ? filters.locations.filter((l) => l !== loc)
      : [...filters.locations, loc];
    onChange({ ...filters, locations: next });
  };

  const toggleDifficulty = (diff: string) => {
    const next = filters.difficulties.includes(diff)
      ? filters.difficulties.filter((d) => d !== diff)
      : [...filters.difficulties, diff];
    onChange({ ...filters, difficulties: next });
  };

  const toggleDuration = (dur: string) => {
    const next = filters.durations.includes(dur)
      ? filters.durations.filter((d) => d !== dur)
      : [...filters.durations, dur];
    onChange({ ...filters, durations: next });
  };

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.locations.length > 0) count++;
    if (filters.difficulties.length > 0) count++;
    if (filters.durations.length > 0) count++;
    if (filters.priceRange[0] > filterData.minPrice || filters.priceRange[1] < filterData.maxPrice) count++;
    return count;
  }, [filters, filterData]);

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Filtros</h3>
        {activeCount > 0 && (
          <Badge variant="secondary" className="bg-teal/10 text-teal text-xs">
            {activeCount} activo{activeCount > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <Separator className="mb-2" />

      {/* Category */}
      <FilterSection title="Categoría" icon={Leaf}>
        <CheckboxList
          options={filterData.categories}
          selected={filters.categories}
          onToggle={toggleCategory}
        />
      </FilterSection>

      {/* Location */}
      <FilterSection title="Ubicación" icon={MapPin}>
        <CheckboxList
          options={filterData.locations}
          selected={filters.locations}
          onToggle={toggleLocation}
        />
      </FilterSection>

      {/* Price */}
      <FilterSection title="Precio" icon={DollarSign}>
        <PriceSlider
          range={filters.priceRange}
          min={filterData.minPrice}
          max={filterData.maxPrice}
          onChange={(priceRange) => onChange({ ...filters, priceRange })}
        />
      </FilterSection>

      {/* Difficulty */}
      <FilterSection title="Dificultad" icon={Mountain}>
        <CheckboxList
          options={filterData.difficulties}
          selected={filters.difficulties}
          onToggle={toggleDifficulty}
        />
      </FilterSection>

      {/* Duration */}
      <FilterSection title="Duración" icon={Clock}>
        <CheckboxList
          options={filterData.durations}
          selected={filters.durations}
          onToggle={toggleDuration}
        />
      </FilterSection>
    </div>
  );
}

// ─── Cabin Filter Sidebar ─────────────────────────────────────────────────────

function CabinFilterContent({
  filters,
  onChange,
  filterData,
}: {
  filters: CabinFilters;
  onChange: (filters: CabinFilters) => void;
  filterData: ReturnType<typeof getCabinFilterData>;
}) {
  const toggleLocation = (loc: string) => {
    const next = filters.locations.includes(loc)
      ? filters.locations.filter((l) => l !== loc)
      : [...filters.locations, loc];
    onChange({ ...filters, locations: next });
  };

  const toggleCapacity = (cap: string) => {
    const next = filters.capacities.includes(cap)
      ? filters.capacities.filter((c) => c !== cap)
      : [...filters.capacities, cap];
    onChange({ ...filters, capacities: next });
  };

  const toggleBedrooms = (bed: string) => {
    const next = filters.bedrooms.includes(bed)
      ? filters.bedrooms.filter((b) => b !== bed)
      : [...filters.bedrooms, bed];
    onChange({ ...filters, bedrooms: next });
  };

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.locations.length > 0) count++;
    if (filters.capacities.length > 0) count++;
    if (filters.bedrooms.length > 0) count++;
    if (filters.priceRange[0] > filterData.minPrice || filters.priceRange[1] < filterData.maxPrice) count++;
    return count;
  }, [filters, filterData]);

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Filtros</h3>
        {activeCount > 0 && (
          <Badge variant="secondary" className="bg-teal/10 text-teal text-xs">
            {activeCount} activo{activeCount > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <Separator className="mb-2" />

      {/* Location */}
      <FilterSection title="Ubicación" icon={MapPin}>
        <CheckboxList
          options={filterData.locations}
          selected={filters.locations}
          onToggle={toggleLocation}
        />
      </FilterSection>

      {/* Price */}
      <FilterSection title="Precio por noche" icon={DollarSign}>
        <PriceSlider
          range={filters.priceRange}
          min={filterData.minPrice}
          max={filterData.maxPrice}
          onChange={(priceRange) => onChange({ ...filters, priceRange })}
        />
      </FilterSection>

      {/* Capacity */}
      <FilterSection title="Capacidad" icon={Users}>
        <CheckboxList
          options={filterData.capacities.map(String)}
          selected={filters.capacities}
          onToggle={toggleCapacity}
          formatLabel={(val) => `${val} huésped${parseInt(val) > 1 ? "es" : ""}`}
        />
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection title="Habitaciones" icon={BedDouble}>
        <CheckboxList
          options={filterData.bedrooms.map(String)}
          selected={filters.bedrooms}
          onToggle={toggleBedrooms}
          formatLabel={(val) => `${val} hab.`}
        />
      </FilterSection>
    </div>
  );
}

// ─── Public Exports: Desktop + Mobile Filter Panels ───────────────────────────

export function PlanFilterSidebar({
  filters,
  onChange,
  filterData,
  onReset,
}: {
  filters: PlanFilters;
  onChange: (filters: PlanFilters) => void;
  filterData: ReturnType<typeof getPlanFilterData>;
  onReset: () => void;
}) {
  return (
    <aside className="hidden lg:block w-[260px] shrink-0">
      <div className="sticky top-32 bg-card border border-border rounded-2xl p-5 shadow-sm">
        <PlanFilterContent filters={filters} onChange={onChange} filterData={filterData} />
        <Separator className="my-4" />
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-muted-foreground"
          onClick={onReset}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Limpiar filtros
        </Button>
      </div>
    </aside>
  );
}

export function PlanFilterMobile({
  filters,
  onChange,
  filterData,
  onReset,
  resultCount,
}: {
  filters: PlanFilters;
  onChange: (filters: PlanFilters) => void;
  filterData: ReturnType<typeof getPlanFilterData>;
  onReset: () => void;
  resultCount: number;
}) {
  const [open, setOpen] = useState(false);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.locations.length > 0) count++;
    if (filters.difficulties.length > 0) count++;
    if (filters.durations.length > 0) count++;
    if (filters.priceRange[0] > filterData.minPrice || filters.priceRange[1] < filterData.maxPrice) count++;
    return count;
  }, [filters, filterData]);

  return (
    <div className="lg:hidden flex items-center justify-between mb-4">
      <span className="text-sm text-muted-foreground">
        {resultCount} plan{resultCount !== 1 ? "es" : ""}
      </span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {activeCount > 0 && (
              <Badge className="bg-teal text-white text-[10px] px-1.5 py-0 min-w-[18px] h-[18px] flex items-center justify-center">
                {activeCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetTitle className="sr-only">Filtros de planes</SheetTitle>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-foreground">Filtros</h2>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <PlanFilterContent filters={filters} onChange={onChange} filterData={filterData} />
            </div>
            <div className="p-4 border-t space-y-2">
              <Button
                className="w-full bg-teal hover:bg-teal-dark text-white"
                onClick={() => setOpen(false)}
              >
                Ver {resultCount} plan{resultCount !== 1 ? "es" : ""}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 text-muted-foreground"
                onClick={onReset}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpiar filtros
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function CabinFilterSidebar({
  filters,
  onChange,
  filterData,
  onReset,
}: {
  filters: CabinFilters;
  onChange: (filters: CabinFilters) => void;
  filterData: ReturnType<typeof getCabinFilterData>;
  onReset: () => void;
}) {
  return (
    <aside className="hidden lg:block w-[260px] shrink-0">
      <div className="sticky top-32 bg-card border border-border rounded-2xl p-5 shadow-sm">
        <CabinFilterContent filters={filters} onChange={onChange} filterData={filterData} />
        <Separator className="my-4" />
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-muted-foreground"
          onClick={onReset}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Limpiar filtros
        </Button>
      </div>
    </aside>
  );
}

export function CabinFilterMobile({
  filters,
  onChange,
  filterData,
  onReset,
  resultCount,
}: {
  filters: CabinFilters;
  onChange: (filters: CabinFilters) => void;
  filterData: ReturnType<typeof getCabinFilterData>;
  onReset: () => void;
  resultCount: number;
}) {
  const [open, setOpen] = useState(false);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.locations.length > 0) count++;
    if (filters.capacities.length > 0) count++;
    if (filters.bedrooms.length > 0) count++;
    if (filters.priceRange[0] > filterData.minPrice || filters.priceRange[1] < filterData.maxPrice) count++;
    return count;
  }, [filters, filterData]);

  return (
    <div className="lg:hidden flex items-center justify-between mb-4">
      <span className="text-sm text-muted-foreground">
        {resultCount} cabaña{resultCount !== 1 ? "s" : ""}
      </span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
            {activeCount > 0 && (
              <Badge className="bg-teal text-white text-[10px] px-1.5 py-0 min-w-[18px] h-[18px] flex items-center justify-center">
                {activeCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetTitle className="sr-only">Filtros de cabañas</SheetTitle>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-foreground">Filtros</h2>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <CabinFilterContent filters={filters} onChange={onChange} filterData={filterData} />
            </div>
            <div className="p-4 border-t space-y-2">
              <Button
                className="w-full bg-teal hover:bg-teal-dark text-white"
                onClick={() => setOpen(false)}
              >
                Ver {resultCount} cabaña{resultCount !== 1 ? "s" : ""}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 text-muted-foreground"
                onClick={onReset}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpiar filtros
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
