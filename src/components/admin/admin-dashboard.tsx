"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Home,
  Plus,
  ArrowRight,
  Star,
  Settings,
  LayoutDashboard,
  TreePalm,
  Mail,
  ScrollText,
  LogOut,
} from "lucide-react";
import { fetchPlans, fetchCabins, fetchContactMessages, type TourPlan, type Cabin, type ContactMessage } from "@/lib/supabase/queries";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
}

export function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, isEditor, signOut } = useAuth();

  const { data: plans = [] } = useQuery<TourPlan[]>({
    queryKey: ["admin-plans-dashboard"],
    queryFn: () => fetchPlans(true),
  });

  const { data: cabins = [] } = useQuery<Cabin[]>({
    queryKey: ["admin-cabins-dashboard"],
    queryFn: () => fetchCabins(true),
  });

  const { data: messages = [] } = useQuery<ContactMessage[]>({
    queryKey: ["admin-messages-dashboard"],
    queryFn: fetchContactMessages,
  });

  const publishedPlans = plans.filter((p) => p.published);
  const draftPlans = plans.filter((p) => !p.published);
  const publishedCabins = cabins.filter((c) => c.published);
  const draftCabins = cabins.filter((c) => !c.published);
  const unreadMessages = messages.filter((m) => !m.is_read);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-brand" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Panel de Administración
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {user ? `Hola, ${user.email}` : "Gestiona los planes y cabañas de Vive Travel"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {(isAdmin || isEditor) && (
              <Button
                variant="outline"
                onClick={signOut}
                className="gap-2 w-fit text-muted-foreground"
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="gap-2 w-fit"
            >
              <ArrowLeft className="size-4" />
              Volver al sitio
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="border-brand/20 bg-gradient-to-br from-brand/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-brand" />
                <span className="text-xs text-muted-foreground font-medium">
                  Planes
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {plans.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {publishedPlans.length} publicados
              </p>
            </CardContent>
          </Card>

          <Card className="border-palm/20 bg-gradient-to-br from-palm/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Home className="w-4 h-4 text-palm" />
                <span className="text-xs text-muted-foreground font-medium">
                  Cabañas
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {cabins.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {publishedCabins.length} publicadas
              </p>
            </CardContent>
          </Card>

          <Card className="border-sunset/20 bg-gradient-to-br from-sunset/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-sunset" />
                <span className="text-xs text-muted-foreground font-medium">
                  Mensajes
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {unreadMessages.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {unreadMessages.length > 0 ? "sin leer" : "Todo leído"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gradient-to-br from-gray-50 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">
                  Borradores
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {draftPlans.length + draftCabins.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Sin publicar
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plans Management */}
          <Card className="border-brand/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-brand/5 to-brand/10 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand/15 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Planes Turísticos</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {plans.length} plan{plans.length !== 1 ? "es" : ""} registrado{plans.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => router.push("/admin/planes/nuevo")}
                  className="gap-1.5 bg-brand hover:bg-brand/90"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nuevo</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {plans.length === 0 ? (
                <div className="p-8 text-center">
                  <MapPin className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    No hay planes creados
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push("/admin/planes/nuevo")}
                    className="gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Crear primer plan
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {plans.slice(0, 5).map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-2 h-2 rounded-full shrink-0 bg-brand" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {plan.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 h-4"
                            >
                              {plan.category?.name || "Sin categoría"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatPrice(plan.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={plan.published ? "default" : "secondary"}
                        className={`text-[10px] shrink-0 ${
                          plan.published
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                            : ""
                        }`}
                      >
                        {plan.published ? "Publicado" : "Borrador"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              {plans.length > 5 && (
                <div className="px-4 py-3 bg-muted/20 text-center">
                  <p className="text-xs text-muted-foreground">
                    y {plans.length - 5} más...
                  </p>
                </div>
              )}
              <div className="p-3 border-t bg-muted/10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-brand hover:text-brand hover:bg-brand/5 gap-2"
                  onClick={() => router.push("/admin/planes")}
                >
                  Gestionar Planes
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cabins Management */}
          <Card className="border-palm/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-palm/5 to-palm/10 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-palm/15 flex items-center justify-center">
                    <TreePalm className="w-5 h-5 text-palm" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Cabañas</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {cabins.length} cabaña{cabins.length !== 1 ? "s" : ""} registrada{cabins.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => router.push("/admin/cabanas/nuevo")}
                  className="gap-1.5 bg-palm hover:bg-palm/90"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nueva</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {cabins.length === 0 ? (
                <div className="p-8 text-center">
                  <TreePalm className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">
                    No hay cabañas creadas
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push("/admin/cabanas/nuevo")}
                    className="gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Crear primera cabaña
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {cabins.slice(0, 5).map((cabin) => (
                    <div
                      key={cabin.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-2 h-2 rounded-full shrink-0 bg-palm" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {cabin.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">
                              {cabin.location}
                            </span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">
                              {formatPrice(cabin.price_per_night)}/noche
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={cabin.published ? "default" : "secondary"}
                        className={`text-[10px] shrink-0 ${
                          cabin.published
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                            : ""
                        }`}
                      >
                        {cabin.published ? "Publicada" : "Borrador"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              {cabins.length > 5 && (
                <div className="px-4 py-3 bg-muted/20 text-center">
                  <p className="text-xs text-muted-foreground">
                    y {cabins.length - 5} más...
                  </p>
                </div>
              )}
              <div className="p-3 border-t bg-muted/10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-palm hover:text-palm hover:bg-palm/5 gap-2"
                  onClick={() => router.push("/admin/cabanas")}
                >
                  Gestionar Cabañas
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Messages Management */}
          <Card className="border-sunset/20 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sunset/5 to-sunset/10 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sunset/15 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-sunset" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Mensajes</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {unreadMessages.length > 0
                        ? `${unreadMessages.length} sin leer`
                        : "Todo leído"}
                    </p>
                  </div>
                </div>
                {unreadMessages.length > 0 && (
                  <Badge className="bg-sunset text-white border-0">
                    {unreadMessages.length}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {messages.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">
                    No hay mensajes
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Los mensajes del formulario de contacto aparecerán aquí
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {messages.slice(0, 5).map((msg) => (
                    <div
                      key={msg.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${msg.is_read ? "bg-muted-foreground/30" : "bg-sunset"}`} />
                        <div className="min-w-0">
                          <p className={`text-sm truncate ${msg.is_read ? "" : "font-semibold"}`}>
                            {msg.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {msg.subject}
                          </p>
                        </div>
                      </div>
                      {!msg.is_read && (
                        <Badge className="text-[10px] shrink-0 bg-sunset/10 text-sunset border-sunset/20 border">
                          Nuevo
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {messages.length > 5 && (
                <div className="px-4 py-3 bg-muted/20 text-center">
                  <p className="text-xs text-muted-foreground">
                    y {messages.length - 5} más...
                  </p>
                </div>
              )}
              <div className="p-3 border-t bg-muted/10">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-sunset hover:text-sunset hover:bg-sunset/5 gap-2"
                  onClick={() => router.push("/admin/mensajes")}
                >
                  Ver Mensajes
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/planes/nuevo")}
            className="h-auto py-4 flex flex-col items-center gap-2 border-brand/20 hover:bg-brand/5 hover:border-brand/40"
          >
            <Plus className="w-5 h-5 text-brand" />
            <span className="text-sm font-medium">Crear Plan</span>
            <span className="text-xs text-muted-foreground">
              Nuevo plan turístico
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/admin/cabanas/nuevo")}
            className="h-auto py-4 flex flex-col items-center gap-2 border-palm/20 hover:bg-palm/5 hover:border-palm/40"
          >
            <Plus className="w-5 h-5 text-palm" />
            <span className="text-sm font-medium">Crear Cabaña</span>
            <span className="text-xs text-muted-foreground">
              Nueva cabaña
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/admin/mensajes")}
            className="h-auto py-4 flex flex-col items-center gap-2 border-sunset/20 hover:bg-sunset/5 hover:border-sunset/40 relative"
          >
            <Mail className="w-5 h-5 text-sunset" />
            <span className="text-sm font-medium">Mensajes</span>
            <span className="text-xs text-muted-foreground">
              {unreadMessages.length > 0 ? `${unreadMessages.length} sin leer` : "Ver mensajes"}
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/admin/contenido")}
            className="h-auto py-4 flex flex-col items-center gap-2 border-coral/20 hover:bg-coral/5 hover:border-coral/40"
          >
            <ScrollText className="w-5 h-5 text-coral" />
            <span className="text-sm font-medium">Editar Contenido</span>
            <span className="text-xs text-muted-foreground">
              Textos de la web
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="h-auto py-4 flex flex-col items-center gap-2 border-brand/20 hover:bg-brand/5 hover:border-brand/40"
          >
            <TreePalm className="w-5 h-5 text-brand" />
            <span className="text-sm font-medium">Ver Sitio</span>
            <span className="text-xs text-muted-foreground">
              Vista del sitio público
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
