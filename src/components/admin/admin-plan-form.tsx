"use client";

import { useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

/* ---------- Types ---------- */

interface PlanFormData {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  price: number;
  priceRange: string;
  duration: string;
  location: string;
  category: string;
  includes: string[];
  excludes: string[];
  highlights: string[];
  rating: number;
  reviewCount: number;
  maxGuests: number;
  difficulty: string;
  schedule: string;
  meeting: string;
  published: boolean;
  order: number;
}

interface TourPlan {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  images: string;
  price: number;
  priceRange: string;
  duration: string;
  location: string;
  category: string;
  includes: string;
  excludes: string;
  highlights: string;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  difficulty: string;
  schedule: string;
  meeting: string;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/* ---------- Constants ---------- */

const CATEGORIES = [
  "Naturaleza",
  "Playa",
  "Aventura",
  "Ecoturismo",
  "Experiencia",
  "Cultural",
] as const;

const DIFFICULTIES = ["Fácil", "Moderado", "Avanzado"] as const;

/* ---------- Reusable StringListInput ---------- */

function StringListInput({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string[];
  onChange: (val: string[]) => void;
  label: string;
  placeholder: string;
}) {
  const handleAdd = () => {
    onChange([...value, ""]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, newValue: string) => {
    const updated = [...value];
    updated[index] = newValue;
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="gap-1 h-7 text-xs"
        >
          <Plus className="size-3" />
          Agregar
        </Button>
      </div>
      {value.length === 0 && (
        <p className="text-xs text-muted-foreground italic">
          No hay elementos. Haz clic en &quot;Agregar&quot; para añadir.
        </p>
      )}
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 h-9 text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(index)}
              className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Main Component ---------- */

export function AdminPlanForm() {
  const { navigate, selectedItemId } = useNavigation();
  const isEditing = !!selectedItemId;

  const {
    data: existingPlan,
    isLoading: isLoadingPlan,
  } = useQuery<TourPlan>({
    queryKey: ["admin-plan", selectedItemId],
    queryFn: async () => {
      const res = await fetch(`/api/plans/${selectedItemId}`);
      if (!res.ok) throw new Error("Plan no encontrado");
      return res.json();
    },
    enabled: isEditing,
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<PlanFormData>({
    defaultValues: {
      name: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      images: [],
      price: 0,
      priceRange: "",
      duration: "",
      location: "",
      category: "Naturaleza",
      includes: [],
      excludes: [],
      highlights: [],
      rating: 0,
      reviewCount: 0,
      maxGuests: 1,
      difficulty: "Fácil",
      schedule: "",
      meeting: "",
      published: true,
      order: 0,
    },
  });

  const nameValue = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditing || !existingPlan) {
      const slug = nameValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug);
    }
  }, [nameValue, isEditing, setValue]);

  // Populate form when editing
  useEffect(() => {
    if (existingPlan && isEditing) {
      const parseJSON = (val: string): string[] => {
        try {
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      };

      reset({
        name: existingPlan.name,
        slug: existingPlan.slug,
        shortDescription: existingPlan.shortDescription,
        fullDescription: existingPlan.fullDescription,
        images: parseJSON(existingPlan.images),
        price: existingPlan.price,
        priceRange: existingPlan.priceRange,
        duration: existingPlan.duration,
        location: existingPlan.location,
        category: existingPlan.category,
        includes: parseJSON(existingPlan.includes),
        excludes: parseJSON(existingPlan.excludes),
        highlights: parseJSON(existingPlan.highlights),
        rating: existingPlan.rating,
        reviewCount: existingPlan.reviewCount,
        maxGuests: existingPlan.maxGuests,
        difficulty: existingPlan.difficulty,
        schedule: existingPlan.schedule,
        meeting: existingPlan.meeting,
        published: existingPlan.published,
        order: existingPlan.order,
      });
    }
  }, [existingPlan, isEditing, reset]);

  const onSubmit = useCallback(
    async (data: PlanFormData) => {
      try {
        const payload = {
          ...data,
          images: data.images,
          includes: data.includes,
          excludes: data.excludes,
          highlights: data.highlights,
        };

        if (isEditing && selectedItemId) {
          const res = await fetch(`/api/plans/${selectedItemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Error actualizando plan");
          }
          toast.success("Plan actualizado correctamente");
        } else {
          const res = await fetch("/api/plans", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Error creando plan");
          }
          toast.success("Plan creado correctamente");
        }
        navigate("admin-plans");
      } catch (err) {
        toast.error(
          (err as Error)?.message || "Error guardando el plan"
        );
      }
    },
    [isEditing, selectedItemId, navigate]
  );

  if (isEditing && isLoadingPlan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Editar Plan" : "Nuevo Plan"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEditing
                ? "Modifica los datos del plan turístico"
                : "Completa los datos para crear un nuevo plan turístico"}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("admin-plans")}
            className="gap-2 w-fit"
          >
            <ArrowLeft className="size-4" />
            Volver a la lista
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section: Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
              <CardDescription>
                Datos principales del plan turístico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ej: Tour Manglares de Totumo"
                    {...register("name", {
                      required: "El nombre es obligatorio",
                    })}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    placeholder="tour-manglares-totumo"
                    {...register("slug")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se genera automáticamente desde el nombre
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">
                  Descripción Corta <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="shortDescription"
                  placeholder="Breve descripción del plan..."
                  rows={2}
                  {...register("shortDescription", {
                    required: "La descripción corta es obligatoria",
                  })}
                />
                {errors.shortDescription && (
                  <p className="text-xs text-red-500">
                    {errors.shortDescription.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">
                  Descripción Completa
                </Label>
                <Textarea
                  id="fullDescription"
                  placeholder="Descripción detallada del plan turístico..."
                  rows={6}
                  {...register("fullDescription")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dificultad</Label>
                  <Controller
                    name="difficulty"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar dificultad" />
                        </SelectTrigger>
                        <SelectContent>
                          {DIFFICULTIES.map((diff) => (
                            <SelectItem key={diff} value={diff}>
                              {diff}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section: Precios */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Precios</CardTitle>
              <CardDescription>
                Información de precios y rangos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Precio (COP) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    placeholder="250000"
                    {...register("price", {
                      required: "El precio es obligatorio",
                      valueAsNumber: true,
                    })}
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceRange">Rango de Precio</Label>
                  <Input
                    id="priceRange"
                    placeholder="Ej: $200.000 - $350.000"
                    {...register("priceRange")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section: Detalles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles</CardTitle>
              <CardDescription>
                Información logística y operativa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración</Label>
                  <Input
                    id="duration"
                    placeholder="Ej: 4 horas"
                    {...register("duration")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    placeholder="Ej: Galerazamba, Atlántico"
                    {...register("location")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="schedule">Horario</Label>
                  <Input
                    id="schedule"
                    placeholder="Ej: 7:00 AM - 11:00 AM"
                    {...register("schedule")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting">Punto de Encuentro</Label>
                  <Input
                    id="meeting"
                    placeholder="Ej: Parque principal de Galerazamba"
                    {...register("meeting")}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    min={0}
                    max={5}
                    step={0.1}
                    {...register("rating", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewCount">Reseñas</Label>
                  <Input
                    id="reviewCount"
                    type="number"
                    min={0}
                    {...register("reviewCount", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxGuests">Máx. Huéspedes</Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    min={1}
                    {...register("maxGuests", { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Orden</Label>
                  <Input
                    id="order"
                    type="number"
                    min={0}
                    {...register("order", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Publicado</Label>
                  <p className="text-xs text-muted-foreground">
                    Los planes publicados son visibles en el sitio
                  </p>
                </div>
                <Controller
                  name="published"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section: Listas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Listas</CardTitle>
              <CardDescription>
                Imágenes, inclusiones, exclusiones y destacados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Images */}
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <StringListInput
                    value={field.value}
                    onChange={field.onChange}
                    label="Imágenes (URLs)"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                )}
              />

              {watch("images").length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {watch("images")
                    .filter((url) => url.trim() !== "")
                    .map((url, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-md border border-gray-200 bg-gray-100 overflow-hidden"
                      >
                        <img
                          src={url}
                          alt={`Vista previa ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                            (
                              e.target as HTMLImageElement
                            ).parentElement!.innerHTML =
                              '<div class="flex items-center justify-center w-full h-full text-gray-400"><svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                          }}
                        />
                      </div>
                    ))}
                </div>
              )}

              <Separator />

              {/* Includes */}
              <Controller
                name="includes"
                control={control}
                render={({ field }) => (
                  <StringListInput
                    value={field.value}
                    onChange={field.onChange}
                    label="Incluye"
                    placeholder="Ej: Transporte ida y vuelta"
                  />
                )}
              />

              <Separator />

              {/* Excludes */}
              <Controller
                name="excludes"
                control={control}
                render={({ field }) => (
                  <StringListInput
                    value={field.value}
                    onChange={field.onChange}
                    label="No Incluye"
                    placeholder="Ej: Alimentación no especificada"
                  />
                )}
              />

              <Separator />

              {/* Highlights */}
              <Controller
                name="highlights"
                control={control}
                render={({ field }) => (
                  <StringListInput
                    value={field.value}
                    onChange={field.onChange}
                    label="Destacados"
                    placeholder="Ej: Avistamiento de flamencos"
                  />
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("admin-plans")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  {isEditing ? "Actualizar Plan" : "Crear Plan"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
