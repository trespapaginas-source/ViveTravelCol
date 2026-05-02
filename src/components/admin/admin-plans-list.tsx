"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, MapPin, Clock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

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

const categoryColors: Record<string, string> = {
  Naturaleza: "bg-green-100 text-green-800 border-green-200",
  Playa: "bg-cyan-100 text-cyan-800 border-cyan-200",
  Aventura: "bg-orange-100 text-orange-800 border-orange-200",
  Ecoturismo: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Experiencia: "bg-purple-100 text-purple-800 border-purple-200",
  Cultural: "bg-amber-100 text-amber-800 border-amber-200",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}

export function AdminPlansList() {
  const { navigate } = useNavigation();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    data: plans,
    isLoading,
    isError,
    error,
  } = useQuery<TourPlan[]>({
    queryKey: ["admin-plans"],
    queryFn: async () => {
      const res = await fetch("/api/plans");
      if (!res.ok) throw new Error("Error cargando planes");
      return res.json();
    },
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/plans/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error eliminando plan");
      toast.success("Plan eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
    } catch {
      toast.error("Error al eliminar el plan");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Administrar Planes
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona los planes turísticos del sitio
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("home")}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Volver al sitio
            </Button>
            <Button
              onClick={() => navigate("admin-plan-form")}
              className="gap-2"
            >
              <Plus className="size-4" />
              Nuevo Plan
            </Button>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              Planes Turísticos{" "}
              {plans ? `(${plans.length})` : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="p-6 text-center">
                <p className="text-red-600 mb-2">Error cargando planes</p>
                <p className="text-sm text-gray-500">
                  {(error as Error)?.message}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    queryClient.invalidateQueries({
                      queryKey: ["admin-plans"],
                    })
                  }
                >
                  Reintentar
                </Button>
              </div>
            ) : plans && plans.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <MapPin className="size-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No hay planes
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Comienza creando tu primer plan turístico
                </p>
                <Button
                  onClick={() => navigate("admin-plan-form")}
                  className="gap-2"
                >
                  <Plus className="size-4" />
                  Crear Plan
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Duración
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Ubicación
                    </TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right pr-6">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans?.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="pl-6">
                        <div>
                          <p className="font-medium text-gray-900">
                            {plan.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {plan.slug}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            categoryColors[plan.category] ||
                            "bg-gray-100 text-gray-800 border-gray-200"
                          }
                        >
                          {plan.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {formatPrice(plan.price)}
                          </p>
                          {plan.priceRange && (
                            <p className="text-xs text-gray-500">
                              {plan.priceRange}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Clock className="size-3.5" />
                          {plan.duration}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <MapPin className="size-3.5" />
                          {plan.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        {plan.published ? (
                          <Badge className="bg-green-100 text-green-800 border-green-200 border">
                            Publicado
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-gray-500 border-gray-300"
                          >
                            Borrador
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate("admin-plan-form", plan.id)
                            }
                            className="gap-1.5 text-gray-600 hover:text-gray-900"
                          >
                            <Pencil className="size-3.5" />
                            <span className="hidden sm:inline">Editar</span>
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="size-3.5" />
                                <span className="hidden sm:inline">
                                  Eliminar
                                </span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  ¿Eliminar plan?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se
                                  eliminará permanentemente el plan{" "}
                                  <strong>{plan.name}</strong> y todos sus
                                  datos asociados.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(plan.id)}
                                  disabled={deletingId === plan.id}
                                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                >
                                  {deletingId === plan.id
                                    ? "Eliminando..."
                                    : "Eliminar"}
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
