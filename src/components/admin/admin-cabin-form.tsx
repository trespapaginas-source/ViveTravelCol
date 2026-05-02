"use client";

import { useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigation } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CabinFormValues {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  images: { value: string }[];
  pricePerNight: number | string;
  priceRange: string;
  location: string;
  capacity: number | string;
  bedrooms: number | string;
  bathrooms: number | string;
  amenities: { value: string }[];
  highlights: { value: string }[];
  rules: { value: string }[];
  rating: number | string;
  reviewCount: number | string;
  lat: number | string;
  lng: number | string;
  checkIn: string;
  checkOut: string;
  cancellationPolicy: string;
  published: boolean;
  order: number | string;
}

interface CabinApiResponse {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  images: string;
  pricePerNight: number;
  priceRange: string;
  location: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string;
  highlights: string;
  rules: string;
  rating: number;
  reviewCount: number;
  lat: number;
  lng: number;
  checkIn: string;
  checkOut: string;
  cancellationPolicy: string;
  published: boolean;
  order: number;
}

/* ------------------------------------------------------------------ */
/*  Main Form Component                                                */
/* ------------------------------------------------------------------ */

export function AdminCabinForm() {
  const { selectedItemId, navigate } = useNavigation();
  const isEditing = !!selectedItemId;

  const {
    data: cabinData,
    isLoading: isLoadingCabin,
  } = useQuery<CabinApiResponse>({
    queryKey: ["admin-cabin", selectedItemId],
    queryFn: async () => {
      const res = await fetch(`/api/cabins/${selectedItemId}`);
      if (!res.ok) throw new Error("Error al cargar cabaña");
      return res.json();
    },
    enabled: isEditing,
  });

  const form = useForm<CabinFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      images: [{ value: "" }],
      pricePerNight: "",
      priceRange: "",
      location: "",
      capacity: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [{ value: "" }],
      highlights: [{ value: "" }],
      rules: [{ value: "" }],
      rating: 0,
      reviewCount: 0,
      lat: 0,
      lng: 0,
      checkIn: "3:00 PM",
      checkOut: "11:00 AM",
      cancellationPolicy: "",
      published: true,
      order: 0,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = form;

  const imagesField = useFieldArray({ control: form.control, name: "images" });
  const amenitiesField = useFieldArray({
    control: form.control,
    name: "amenities",
  });
  const highlightsField = useFieldArray({
    control: form.control,
    name: "highlights",
  });
  const rulesField = useFieldArray({ control: form.control, name: "rules" });

  // Auto-generate slug from name
  const nameValue = watch("name");
  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }, []);

  useEffect(() => {
    if (nameValue && !isEditing) {
      setValue("slug", generateSlug(nameValue));
    }
  }, [nameValue, isEditing, setValue, generateSlug]);

  // Populate form when editing
  useEffect(() => {
    if (cabinData) {
      const parseJsonArray = (jsonStr: string): { value: string }[] => {
        try {
          const arr = JSON.parse(jsonStr);
          if (Array.isArray(arr) && arr.length > 0) {
            return arr.map((v: string) => ({ value: v }));
          }
        } catch {
          // ignore
        }
        return [{ value: "" }];
      };

      reset({
        name: cabinData.name || "",
        slug: cabinData.slug || "",
        shortDescription: cabinData.shortDescription || "",
        fullDescription: cabinData.fullDescription || "",
        images: parseJsonArray(cabinData.images),
        pricePerNight: cabinData.pricePerNight || "",
        priceRange: cabinData.priceRange || "",
        location: cabinData.location || "",
        capacity: cabinData.capacity || 2,
        bedrooms: cabinData.bedrooms || 1,
        bathrooms: cabinData.bathrooms || 1,
        amenities: parseJsonArray(cabinData.amenities),
        highlights: parseJsonArray(cabinData.highlights),
        rules: parseJsonArray(cabinData.rules),
        rating: cabinData.rating || 0,
        reviewCount: cabinData.reviewCount || 0,
        lat: cabinData.lat || 0,
        lng: cabinData.lng || 0,
        checkIn: cabinData.checkIn || "3:00 PM",
        checkOut: cabinData.checkOut || "11:00 AM",
        cancellationPolicy: cabinData.cancellationPolicy || "",
        published: cabinData.published ?? true,
        order: cabinData.order ?? 0,
      });
    }
  }, [cabinData, reset]);

  const onSubmit = async (data: CabinFormValues) => {
    const toStringList = (items: { value: string }[]): string[] =>
      items.map((i) => i.value).filter((v) => v.trim() !== "");

    const payload = {
      name: data.name,
      slug: data.slug || generateSlug(data.name),
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      images: toStringList(data.images),
      pricePerNight: Number(data.pricePerNight) || 0,
      priceRange: data.priceRange,
      location: data.location,
      capacity: Number(data.capacity) || 2,
      bedrooms: Number(data.bedrooms) || 1,
      bathrooms: Number(data.bathrooms) || 1,
      amenities: toStringList(data.amenities),
      highlights: toStringList(data.highlights),
      rules: toStringList(data.rules),
      rating: Number(data.rating) || 0,
      reviewCount: Number(data.reviewCount) || 0,
      lat: Number(data.lat) || 0,
      lng: Number(data.lng) || 0,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      cancellationPolicy: data.cancellationPolicy,
      published: data.published,
      order: Number(data.order) || 0,
    };

    try {
      if (isEditing && selectedItemId) {
        const res = await fetch(`/api/cabins/${selectedItemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error al actualizar cabaña");
        toast.success("Cabaña actualizada correctamente");
      } else {
        const res = await fetch("/api/cabins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error al crear cabaña");
        toast.success("Cabaña creada correctamente");
      }
      navigate("admin-cabins");
    } catch {
      toast.error(
        isEditing
          ? "Error al actualizar la cabaña"
          : "Error al crear la cabaña"
      );
    }
  };

  if (isEditing && isLoadingCabin) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2 text-muted-foreground"
            onClick={() => navigate("admin-cabins")}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver a cabañas
          </Button>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {isEditing ? "Editar Cabaña" : "Nueva Cabaña"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditing
              ? "Modifica los datos de la cabaña"
              : "Completa los datos para crear una nueva cabaña"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* ─── Información Básica ─── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    placeholder="Nombre de la cabaña"
                    {...register("name", { required: "El nombre es obligatorio" })}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    placeholder="auto-generado-del-nombre"
                    {...register("slug")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Descripción Corta</Label>
                <Textarea
                  id="shortDescription"
                  placeholder="Breve descripción de la cabaña..."
                  rows={2}
                  {...register("shortDescription")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">Descripción Completa</Label>
                <Textarea
                  id="fullDescription"
                  placeholder="Descripción detallada de la cabaña..."
                  rows={5}
                  {...register("fullDescription")}
                />
              </div>
            </CardContent>
          </Card>

          {/* ─── Precios ─── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Precios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pricePerNight">Precio por Noche (COP)</Label>
                  <Input
                    id="pricePerNight"
                    type="number"
                    placeholder="280000"
                    {...register("pricePerNight")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceRange">Rango de Precio</Label>
                  <Input
                    id="priceRange"
                    placeholder="$280.000 - $380.000 COP / noche"
                    {...register("priceRange")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ─── Capacidad ─── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Capacidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacidad (huéspedes)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="6"
                    {...register("capacity")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Habitaciones</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    placeholder="2"
                    {...register("bedrooms")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Baños</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    placeholder="2"
                    {...register("bathrooms")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ─── Listas (Images, Amenities, Highlights, Rules) ─── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Listas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Images */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Imágenes (URLs)
                </Label>
                <div className="space-y-2">
                  {imagesField.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        placeholder="https://images.unsplash.com/..."
                        {...register(`images.${index}.value`)}
                        className="flex-1"
                      />
                      {imagesField.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => imagesField.remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => imagesField.append({ value: "" })}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Agregar imagen
                </Button>
              </div>

              <Separator />

              {/* Amenities */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Amenidades</Label>
                <div className="space-y-2">
                  {amenitiesField.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        placeholder="Piscina privada"
                        {...register(`amenities.${index}.value`)}
                        className="flex-1"
                      />
                      {amenitiesField.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => amenitiesField.remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => amenitiesField.append({ value: "" })}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Agregar amenidad
                </Button>
              </div>

              <Separator />

              {/* Highlights */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Destacados</Label>
                <div className="space-y-2">
                  {highlightsField.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        placeholder="Frente al mar"
                        {...register(`highlights.${index}.value`)}
                        className="flex-1"
                      />
                      {highlightsField.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => highlightsField.remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => highlightsField.append({ value: "" })}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Agregar destacado
                </Button>
              </div>

              <Separator />

              {/* Rules */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Reglas</Label>
                <div className="space-y-2">
                  {rulesField.fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        placeholder="No fiestas ni eventos"
                        {...register(`rules.${index}.value`)}
                        className="flex-1"
                      />
                      {rulesField.fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => rulesField.remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => rulesField.append({ value: "" })}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Agregar regla
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ─── Ubicación ─── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Dirección / Ubicación</Label>
                <Input
                  id="location"
                  placeholder="Santa Verónica, Atlántico"
                  {...register("location")}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lat">Latitud</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    placeholder="10.95"
                    {...register("lat")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitud</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    placeholder="-75.05"
                    {...register("lng")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ─── Políticas ─── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Políticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Check-in</Label>
                  <Input
                    id="checkIn"
                    placeholder="3:00 PM"
                    {...register("checkIn")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOut">Check-out</Label>
                  <Input
                    id="checkOut"
                    placeholder="11:00 AM"
                    {...register("checkOut")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cancellationPolicy">
                  Política de Cancelación
                </Label>
                <Input
                  id="cancellationPolicy"
                  placeholder="Cancelación gratuita hasta 7 días antes del check-in"
                  {...register("cancellationPolicy")}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="4.8"
                    {...register("rating")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewCount">Cantidad de Reviews</Label>
                  <Input
                    id="reviewCount"
                    type="number"
                    placeholder="98"
                    {...register("reviewCount")}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Publicada</Label>
                  <p className="text-xs text-muted-foreground">
                    La cabaña será visible en el sitio web
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={watch("published")}
                  onCheckedChange={(checked) => setValue("published", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Orden</Label>
                <Input
                  id="order"
                  type="number"
                  placeholder="0"
                  {...register("order")}
                />
                <p className="text-xs text-muted-foreground">
                  Número menor = aparece primero
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ─── Actions ─── */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("admin-cabins")}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Guardar Cambios" : "Crear Cabaña"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
