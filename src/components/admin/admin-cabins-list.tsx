"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, Home, Bed, Bath, Users } from "lucide-react";
import { toast } from "sonner";

interface CabinRow {
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
  createdAt: string;
  updatedAt: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}

export function AdminCabinsList() {
  const navigate = useNavigation((s) => s.navigate);
  const queryClient = useQueryClient();

  const {
    data: cabins,
    isLoading,
    isError,
    error,
  } = useQuery<CabinRow[]>({
    queryKey: ["admin-cabins"],
    queryFn: async () => {
      const res = await fetch("/api/cabins");
      if (!res.ok) throw new Error("Error al cargar cabañas");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/cabins/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar cabaña");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-cabins"] });
      toast.success("Cabaña eliminada correctamente");
    },
    onError: () => {
      toast.error("Error al eliminar la cabaña");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Administrar Cabañas
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestiona las cabañas disponibles en tu sitio web
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("cabins")}
            >
              <Home className="mr-2 h-4 w-4" />
              Ver sitio
            </Button>
            <Button size="sm" onClick={() => navigate("admin-cabin-form")}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Cabaña
            </Button>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">
              {cabins
                ? `${cabins.length} cabaña${cabins.length !== 1 ? "s" : ""}`
                : "Cabañas"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {isLoading ? (
              <div className="space-y-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 border-b px-6 py-3"
                  >
                    <Skeleton className="h-10 w-10 rounded" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-20 ml-auto" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="px-6 pb-6 text-center">
                <p className="text-sm text-destructive">
                  {error instanceof Error ? error.message : "Error al cargar datos"}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() =>
                    queryClient.invalidateQueries({
                      queryKey: ["admin-cabins"],
                    })
                  }
                >
                  Reintentar
                </Button>
              </div>
            ) : cabins && cabins.length === 0 ? (
              <div className="px-6 pb-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No hay cabañas creadas todavía.
                </p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => navigate("admin-cabin-form")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primera cabaña
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Nombre</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Precio/Noche</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="pr-6 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cabins?.map((cabin) => (
                    <TableRow key={cabin.id}>
                      <TableCell className="pl-6">
                        <div className="flex flex-col">
                          <span className="font-medium">{cabin.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {cabin.slug}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{cabin.location || "—"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {cabin.pricePerNight
                            ? formatPrice(cabin.pricePerNight)
                            : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {cabin.capacity}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Bed className="h-3 w-3" />
                            {cabin.bedrooms}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Bath className="h-3 w-3" />
                            {cabin.bathrooms}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {cabin.published ? (
                          <Badge
                            variant="default"
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Publicada
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Borrador</Badge>
                        )}
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate("admin-cabin-form", cabin.id)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Eliminar</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Eliminar cabaña?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará
                                  permanentemente la cabaña{" "}
                                  <strong>{cabin.name}</strong> y todos sus datos
                                  asociados.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-white hover:bg-destructive/90"
                                  onClick={() => deleteMutation.mutate(cabin.id)}
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
