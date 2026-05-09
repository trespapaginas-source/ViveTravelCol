"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  Trash2,
  Eye,
  MailOpen,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  fetchContactMessages,
  markMessageRead,
  deleteContactMessage,
  type ContactMessage,
} from "@/lib/supabase/queries";

const subjectLabels: Record<string, string> = {
  plan_turistico: "Plan turístico",
  alojamiento: "Alojamiento",
  viaje_grupal: "Viaje grupal",
  viaje_personalizado: "Viaje personalizado",
  otro: "Otro",
};

const methodIcons: Record<string, typeof Mail> = {
  whatsapp: MessageCircle,
  email: Mail,
  phone: Phone,
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Ahora mismo";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return formatDate(dateStr);
}

export function AdminMessages() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const {
    data: messages = [],
    isLoading,
    isError,
    error,
  } = useQuery<ContactMessage[]>({
    queryKey: ["admin-messages"],
    queryFn: fetchContactMessages,
  });

  const markReadMutation = useMutation({
    mutationFn: markMessageRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast.success("Mensaje eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar mensaje");
    },
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      markReadMutation.mutate(msg.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Mensajes de Contacto
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {unreadCount > 0
                ? `Tienes ${unreadCount} mensaje${unreadCount !== 1 ? "s" : ""} sin leer`
                : "Todos los mensajes están leídos"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin")}
            className="gap-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al panel
          </Button>
        </div>

        {/* Content */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {messages.length} mensaje{messages.length !== 1 ? "s" : ""}
              {unreadCount > 0 && (
                <Badge className="bg-sunset text-white border-0 ml-2">
                  {unreadCount} nuevo{unreadCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {isLoading ? (
              <div className="space-y-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 border-b px-6 py-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24 ml-auto" />
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
                    queryClient.invalidateQueries({ queryKey: ["admin-messages"] })
                  }
                >
                  Reintentar
                </Button>
              </div>
            ) : messages.length === 0 ? (
              <div className="px-6 pb-6 text-center">
                <Mail className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No hay mensajes de contacto todavía.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Los mensajes enviados desde el formulario de contacto aparecerán aquí.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6 w-8"></TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden sm:table-cell">Asunto</TableHead>
                    <TableHead className="hidden md:table-cell">Mensaje</TableHead>
                    <TableHead className="hidden lg:table-cell">Método</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="pr-6 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => {
                    const MethodIcon = methodIcons[msg.contact_method] || Mail;
                    return (
                      <TableRow
                        key={msg.id}
                        className={!msg.is_read ? "bg-sunset/5 font-medium" : ""}
                      >
                        <TableCell className="pl-6">
                          {msg.is_read ? (
                            <MailOpen className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Mail className="w-4 h-4 text-sunset" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className={msg.is_read ? "" : "font-semibold"}>
                              {msg.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {msg.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {subjectLabels[msg.subject] || msg.subject}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <p className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                            {msg.message}
                          </p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MethodIcon className="w-3.5 h-3.5" />
                            {msg.contact_method}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className="text-xs text-muted-foreground"
                            title={formatDate(msg.created_at)}
                          >
                            {timeAgo(msg.created_at)}
                          </span>
                        </TableCell>
                        <TableCell className="pr-6">
                          <div className="flex items-center justify-end gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenMessage(msg)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Ver</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-brand" />
                                    Mensaje de {selectedMessage?.name}
                                  </DialogTitle>
                                </DialogHeader>
                                {selectedMessage && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <p className="text-xs text-muted-foreground">Nombre</p>
                                        <p className="text-sm font-medium">{selectedMessage.name}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <a href={`mailto:${selectedMessage.email}`} className="text-sm text-brand hover:underline">
                                          {selectedMessage.email}
                                        </a>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Teléfono</p>
                                        <a href={`tel:${selectedMessage.phone}`} className="text-sm text-brand hover:underline">
                                          {selectedMessage.phone}
                                        </a>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Método preferido</p>
                                        <p className="text-sm">{selectedMessage.contact_method}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Asunto</p>
                                        <Badge variant="outline" className="text-xs">
                                          {subjectLabels[selectedMessage.subject] || selectedMessage.subject}
                                        </Badge>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">Fecha</p>
                                        <p className="text-sm">{formatDate(selectedMessage.created_at)}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Mensaje</p>
                                      <div className="p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap leading-relaxed">
                                        {selectedMessage.message}
                                      </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                      <Button asChild size="sm" className="bg-palm hover:bg-palm/90 text-white gap-1.5">
                                        <a
                                          href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, "")}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <MessageCircle className="w-4 h-4" />
                                          WhatsApp
                                        </a>
                                      </Button>
                                      <Button asChild size="sm" variant="outline" className="gap-1.5">
                                        <a href={`mailto:${selectedMessage.email}`}>
                                          <Mail className="w-4 h-4" />
                                          Responder email
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

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
                                    ¿Eliminar mensaje?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Se eliminará el mensaje de{" "}
                                    <strong>{msg.name}</strong> permanentemente.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                    onClick={() => deleteMutation.mutate(msg.id)}
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
