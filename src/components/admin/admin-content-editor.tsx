"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSiteContent } from "@/lib/use-site-content";
import type { SectionKey, SiteContentData } from "@/lib/content-types";
import { defaultSiteContent } from "@/lib/content-defaults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Loader2,
  Sun,
  Star,
  Camera,
  Users,
  Compass,
  Phone,
  ScrollText,
  Palmtree,
  MenuIcon,
  RotateCcw,
  Plus,
  Trash2,
  GripVertical,
  MapPin,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections: Array<{
  key: SectionKey;
  label: string;
  icon: React.ElementType;
  color: string;
}> = [
  { key: "hero", label: "Inicio (Hero)", icon: Sun, color: "text-brand" },
  { key: "featuredPlans", label: "Planes Destacados", icon: Star, color: "text-sunset" },
  { key: "plansList", label: "Lista de Planes", icon: MapPin, color: "text-brand" },
  { key: "carousel", label: "Viajes Realizados", icon: Camera, color: "text-palm" },
  { key: "testimonials", label: "Testimonios", icon: Star, color: "text-coral" },
  { key: "groupTrips", label: "Viajes Grupales", icon: Users, color: "text-brand" },
  { key: "customTrips", label: "Viajes Personalizados", icon: Compass, color: "text-sunset" },
  { key: "cabinsList", label: "Lista de Cabañas", icon: Home, color: "text-palm" },
  { key: "contact", label: "Contacto", icon: Phone, color: "text-palm" },
  { key: "policies", label: "Políticas", icon: ScrollText, color: "text-brand" },
  { key: "footer", label: "Footer", icon: Palmtree, color: "text-sunset" },
  { key: "navbar", label: "Navegación", icon: MenuIcon, color: "text-palm" },
];

export function AdminContentEditor() {
  const router = useRouter();
  const { content, updateSection, isLoading } = useSiteContent();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<SectionKey>("hero");
  const [saving, setSaving] = useState<string | null>(null);
  const [localContent, setLocalContent] = useState<SiteContentData>(content);

  // Sync local state when content loads
  const currentContent = content;

  const handleSave = async (section: SectionKey) => {
    setSaving(section);
    try {
      await updateSection(section, localContent[section]);
      toast.success("Contenido actualizado", {
        description: `Sección "${sections.find((s) => s.key === section)?.label}" guardada correctamente.`,
      });
    } catch {
      toast.error("Error al guardar", {
        description: "No se pudo actualizar el contenido. Intenta de nuevo.",
      });
    } finally {
      setSaving(null);
    }
  };

  const handleReset = (section: SectionKey) => {
    setLocalContent((prev) => ({
      ...prev,
      [section]: defaultSiteContent[section],
    }));
    toast.info("Valores restaurados", {
      description: "Se restauraron los valores por defecto. Guarda para aplicar.",
    });
  };

  const handleSeed = async () => {
    try {
      const res = await fetch("/api/content", { method: "POST" });
      if (!res.ok) throw new Error();
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Contenido inicializado");
      setLocalContent(defaultSiteContent);
    } catch {
      toast.error("Error al inicializar contenido");
    }
  };

  const updateField = (section: SectionKey, field: string, value: unknown) => {
    setLocalContent((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        [field]: value,
      },
    }));
  };

  const getSectionData = (section: SectionKey) => {
    return localContent[section] ?? currentContent[section];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  const activeSectionMeta = sections.find((s) => s.key === activeSection)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-brand/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
              <ScrollText className="w-6 h-6 text-brand" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Editar Contenido del Sitio
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Modifica los textos de cada sección de la web
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSeed} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar todo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin")}
              className="gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Section Selector */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-4">
              <CardContent className="p-2">
                <nav className="flex flex-col gap-0.5">
                  {sections.map((section) => (
                    <button
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                        activeSection === section.key
                          ? "bg-brand/10 text-brand"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      <section.icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          activeSection === section.key ? "text-brand" : section.color
                        )}
                      />
                      {section.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3">
            <Card className="border-border/50">
              <CardHeader className="border-b bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center bg-brand/10",
                        activeSectionMeta.color
                      )}
                    >
                      <activeSectionMeta.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {activeSectionMeta.label}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Edita los textos que se muestran en esta sección
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReset(activeSection)}
                      className="gap-1.5 text-muted-foreground"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restaurar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSave(activeSection)}
                      disabled={saving === activeSection}
                      className="gap-1.5 bg-brand hover:bg-brand/90"
                    >
                      {saving === activeSection ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      Guardar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {activeSection === "hero" && (
                  <HeroEditor
                    data={getSectionData("hero")}
                    onChange={(field, value) => updateField("hero", field, value)}
                  />
                )}
                {activeSection === "featuredPlans" && (
                  <FeaturedPlansEditor
                    data={getSectionData("featuredPlans")}
                    onChange={(field, value) => updateField("featuredPlans", field, value)}
                  />
                )}
                {activeSection === "plansList" && (
                  <PlansListEditor
                    data={getSectionData("plansList")}
                    onChange={(field, value) => updateField("plansList", field, value)}
                  />
                )}
                {activeSection === "carousel" && (
                  <CarouselEditor
                    data={getSectionData("carousel")}
                    onChange={(field, value) => updateField("carousel", field, value)}
                  />
                )}
                {activeSection === "testimonials" && (
                  <TestimonialsEditor
                    data={getSectionData("testimonials")}
                    onChange={(field, value) => updateField("testimonials", field, value)}
                  />
                )}
                {activeSection === "groupTrips" && (
                  <GroupTripsEditor
                    data={getSectionData("groupTrips")}
                    onChange={(field, value) => updateField("groupTrips", field, value)}
                  />
                )}
                {activeSection === "customTrips" && (
                  <CustomTripsEditor
                    data={getSectionData("customTrips")}
                    onChange={(field, value) => updateField("customTrips", field, value)}
                  />
                )}
                {activeSection === "cabinsList" && (
                  <CabinsListEditor
                    data={getSectionData("cabinsList")}
                    onChange={(field, value) => updateField("cabinsList", field, value)}
                  />
                )}
                {activeSection === "contact" && (
                  <ContactEditor
                    data={getSectionData("contact")}
                    onChange={(field, value) => updateField("contact", field, value)}
                  />
                )}
                {activeSection === "policies" && (
                  <PoliciesEditor
                    data={getSectionData("policies")}
                    onChange={(field, value) => updateField("policies", field, value)}
                  />
                )}
                {activeSection === "footer" && (
                  <FooterEditor
                    data={getSectionData("footer")}
                    onChange={(field, value) => updateField("footer", field, value)}
                  />
                )}
                {activeSection === "navbar" && (
                  <NavbarEditor
                    data={getSectionData("navbar")}
                    onChange={(field, value) => updateField("navbar", field, value)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared field components ────────────────────────────────────────────────

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <FieldGroup label={label}>
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </FieldGroup>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <FieldGroup label={label}>
      <Textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="resize-y"
      />
    </FieldGroup>
  );
}

// ─── Section Editors ────────────────────────────────────────────────────────

function HeroEditor({ data, onChange }: { data: any; onChange: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <TextField label="Etiqueta de marca" value={data.brandLabel} onChange={(v) => onChange("brandLabel", v)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="Título (primera parte)" value={data.title} onChange={(v) => onChange("title", v)} />
        <TextField label="Título (destacado)" value={data.titleHighlight} onChange={(v) => onChange("titleHighlight", v)} placeholder="Texto resaltado en color" />
      </div>
      <TextAreaField label="Subtítulo" value={data.subtitle} onChange={(v) => onChange("subtitle", v)} rows={3} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="Botón planes" value={data.ctaPlans} onChange={(v) => onChange("ctaPlans", v)} />
        <TextField label="Botón cabañas" value={data.ctaCabins} onChange={(v) => onChange("ctaCabins", v)} />
      </div>
    </div>
  );
}

function FeaturedPlansEditor({ data, onChange }: { data: any; onChange: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <TextField label="Título" value={data.title} onChange={(v) => onChange("title", v)} />
      <TextAreaField label="Subtítulo" value={data.subtitle} onChange={(v) => onChange("subtitle", v)} rows={2} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextField label="Etiqueta precio" value={data.priceLabel} onChange={(v) => onChange("priceLabel", v)} />
        <TextField label="Botón ver más" value={data.viewMore} onChange={(v) => onChange("viewMore", v)} />
        <TextField label="Botón ver todos" value={data.viewAll} onChange={(v) => onChange("viewAll", v)} />
      </div>
    </div>
  );
}

function PlansListEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <TextField label="Título" value={data.title as string} onChange={(v) => onChange("title", v)} />
      <TextAreaField label="Subtítulo" value={data.subtitle as string} onChange={(v) => onChange("subtitle", v)} rows={3} />
      <TextField label="Estado vacío" value={data.emptyState as string} onChange={(v) => onChange("emptyState", v)} />
      <TextField label="Botón ver todos" value={data.viewAll as string} onChange={(v) => onChange("viewAll", v)} />
    </div>
  );
}

function CabinsListEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <TextField label="Título" value={data.title as string} onChange={(v) => onChange("title", v)} />
      <TextAreaField label="Subtítulo" value={data.subtitle as string} onChange={(v) => onChange("subtitle", v)} rows={3} />
      <TextField label="Título estado vacío" value={data.emptyTitle as string} onChange={(v) => onChange("emptyTitle", v)} />
      <TextAreaField label="Descripción estado vacío" value={data.emptyDescription as string} onChange={(v) => onChange("emptyDescription", v)} rows={2} />
      <TextField label="Botón contacto" value={data.contactButton as string} onChange={(v) => onChange("contactButton", v)} />
    </div>
  );
}

function CarouselEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <TextField label="Título" value={data.title} onChange={(v) => onChange("title", v)} />
      <TextField label="Subtítulo" value={data.subtitle} onChange={(v) => onChange("subtitle", v)} />
      <TextField label="Marca (hover)" value={data.brandHover} onChange={(v) => onChange("brandHover", v)} />

      <Separator />
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-foreground">Estadísticas</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const stats = [...(data.stats ?? []), { value: "", label: "" }];
              onChange("stats", stats);
            }}
            className="gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar
          </Button>
        </div>
        <div className="space-y-3">
          {(data.stats ?? []).map((stat: { value: string; label: string }, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                value={stat.value}
                onChange={(e) => {
                  const stats = [...data.stats];
                  stats[i] = { ...stats[i], value: e.target.value };
                  onChange("stats", stats);
                }}
                placeholder="Valor (ej: 500+)"
                className="w-28"
              />
              <Input
                value={stat.label}
                onChange={(e) => {
                  const stats = [...data.stats];
                  stats[i] = { ...stats[i], label: e.target.value };
                  onChange("stats", stats);
                }}
                placeholder="Etiqueta (ej: Viajeros felices)"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  const stats = data.stats.filter((_: unknown, j: number) => j !== i);
                  onChange("stats", stats);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestimonialsEditor({ data, onChange }: { data: any; onChange: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <TextField label="Título" value={data.title} onChange={(v) => onChange("title", v)} />
      <TextAreaField label="Subtítulo" value={data.subtitle} onChange={(v) => onChange("subtitle", v)} rows={2} />
      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          💡 Los testimonios individuales se gestionan desde la base de datos. Aquí solo puedes editar el título y subtítulo de la sección.
        </p>
      </div>
    </div>
  );
}

function GroupTripsEditor({ data, onChange }: { data: any; onChange: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="Etiqueta" value={data.label} onChange={(v) => onChange("label", v)} />
        <TextField label="Título (destacado)" value={data.titleHighlight} onChange={(v) => onChange("titleHighlight", v)} />
      </div>
      <TextField label="Título (primera parte)" value={data.title} onChange={(v) => onChange("title", v)} />
      <TextAreaField label="Descripción" value={data.description} onChange={(v) => onChange("description", v)} rows={4} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="Botón cotización" value={data.ctaQuote} onChange={(v) => onChange("ctaQuote", v)} />
        <TextField label="Botón planes" value={data.ctaPlans} onChange={(v) => onChange("ctaPlans", v)} />
      </div>

      <Separator />
      <ArrayEditor
        label="Beneficios"
        items={data.benefits ?? []}
        fieldNames={["title", "description"]}
        fieldLabels={["Título", "Descripción"]}
        onChange={(items) => onChange("benefits", items)}
      />

      <Separator />
      <ArrayEditor
        label="Estadísticas"
        items={data.stats ?? []}
        fieldNames={["value", "label"]}
        fieldLabels={["Valor", "Etiqueta"]}
        onChange={(items) => onChange("stats", items)}
      />
    </div>
  );
}

function CustomTripsEditor({ data, onChange }: { data: any; onChange: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="Etiqueta" value={data.label} onChange={(v) => onChange("label", v)} />
        <TextField label="Título (destacado)" value={data.titleHighlight} onChange={(v) => onChange("titleHighlight", v)} />
      </div>
      <TextField label="Título (primera parte)" value={data.title} onChange={(v) => onChange("title", v)} />
      <TextAreaField label="Descripción" value={data.description} onChange={(v) => onChange("description", v)} rows={3} />

      <Separator />
      <ArrayEditor
        label="Beneficios"
        items={data.benefits ?? []}
        fieldNames={["title", "description"]}
        fieldLabels={["Título", "Descripción"]}
        onChange={(items) => onChange("benefits", items)}
      />

      <Separator />
      <TextField label="CTA - Título" value={data.ctaTitle} onChange={(v) => onChange("ctaTitle", v)} />
      <TextAreaField label="CTA - Descripción" value={data.ctaDescription} onChange={(v) => onChange("ctaDescription", v)} rows={3} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="CTA - Botón contacto" value={data.ctaContact} onChange={(v) => onChange("ctaContact", v)} />
        <TextField label="CTA - Botón planes" value={data.ctaPlans} onChange={(v) => onChange("ctaPlans", v)} />
      </div>
    </div>
  );
}

function ContactEditor({ data, onChange }: { data: any; onChange: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <TextField label="Badge" value={data.badge} onChange={(v) => onChange("badge", v)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="Título (primera parte)" value={data.title} onChange={(v) => onChange("title", v)} />
        <TextField label="Título (destacado)" value={data.titleHighlight} onChange={(v) => onChange("titleHighlight", v)} />
      </div>
      <TextAreaField label="Subtítulo" value={data.subtitle} onChange={(v) => onChange("subtitle", v)} rows={2} />
      <TextField label="Título del formulario" value={data.formTitle} onChange={(v) => onChange("formTitle", v)} />

      <Separator />
      <h4 className="text-sm font-semibold text-foreground">Información de contacto</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="WhatsApp" value={data.whatsapp} onChange={(v) => onChange("whatsapp", v)} />
        <TextField label="Email" value={data.email} onChange={(v) => onChange("email", v)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="Ubicación" value={data.location} onChange={(v) => onChange("location", v)} />
        <TextAreaField label="Horario" value={data.hours} onChange={(v) => onChange("hours", v)} rows={2} />
      </div>

      <Separator />
      <h4 className="text-sm font-semibold text-foreground">Redes sociales y enlaces</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextField label="URL Instagram" value={data.instagramUrl} onChange={(v) => onChange("instagramUrl", v)} />
        <TextField label="URL Facebook" value={data.facebookUrl} onChange={(v) => onChange("facebookUrl", v)} />
        <TextField label="URL WhatsApp" value={data.whatsappUrl} onChange={(v) => onChange("whatsappUrl", v)} />
      </div>

      <Separator />
      <h4 className="text-sm font-semibold text-foreground">Tarjeta WhatsApp</h4>
      <TextField label="Etiqueta redes" value={data.socialLabel} onChange={(v) => onChange("socialLabel", v)} />
      <TextField label="Título chat" value={data.chatTitle} onChange={(v) => onChange("chatTitle", v)} />
      <TextAreaField label="Descripción chat" value={data.chatDescription} onChange={(v) => onChange("chatDescription", v)} rows={2} />
      <TextField label="Botón chat" value={data.chatButton} onChange={(v) => onChange("chatButton", v)} />
    </div>
  );
}

function PoliciesEditor({ data, onChange }: { data: any; onChange: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <TextField label="Badge" value={data.badge} onChange={(v) => onChange("badge", v)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="Título (primera parte)" value={data.title} onChange={(v) => onChange("title", v)} />
        <TextField label="Título (destacado)" value={data.titleHighlight} onChange={(v) => onChange("titleHighlight", v)} />
      </div>
      <TextAreaField label="Subtítulo" value={data.subtitle} onChange={(v) => onChange("subtitle", v)} rows={3} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="Título reservas" value={data.bookingTitle} onChange={(v) => onChange("bookingTitle", v)} />
        <TextField label="Subtítulo reservas" value={data.bookingSubtitle} onChange={(v) => onChange("bookingSubtitle", v)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="Título cancelaciones" value={data.cancellationTitle} onChange={(v) => onChange("cancellationTitle", v)} />
        <TextField label="Subtítulo cancelaciones" value={data.cancellationSubtitle} onChange={(v) => onChange("cancellationSubtitle", v)} />
      </div>

      <TextAreaField label="Texto del pie" value={data.footerText} onChange={(v) => onChange("footerText", v)} rows={2} />
      <TextField label="Última actualización" value={data.lastUpdate} onChange={(v) => onChange("lastUpdate", v)} />

      <Separator />
      <PoliciesArrayEditor
        label="Políticas de Reserva"
        items={data.bookingPolicies ?? []}
        onChange={(items) => onChange("bookingPolicies", items)}
      />

      <Separator />
      <PoliciesArrayEditor
        label="Políticas de Cancelación"
        items={data.cancellationPolicies ?? []}
        onChange={(items) => onChange("cancellationPolicies", items)}
      />
    </div>
  );
}

function FooterEditor({ data, onChange }: { data: any; onChange: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="Nombre de marca" value={data.brandName} onChange={(v) => onChange("brandName", v)} />
        <TextField label="Sub-marca" value={data.brandSub} onChange={(v) => onChange("brandSub", v)} />
      </div>
      <TextAreaField label="Descripción" value={data.description} onChange={(v) => onChange("description", v)} rows={3} />

      <Separator />
      <h4 className="text-sm font-semibold text-foreground">Redes sociales</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextField label="URL Instagram" value={data.instagramUrl} onChange={(v) => onChange("instagramUrl", v)} />
        <TextField label="URL Facebook" value={data.facebookUrl} onChange={(v) => onChange("facebookUrl", v)} />
        <TextField label="URL WhatsApp" value={data.whatsappUrl} onChange={(v) => onChange("whatsappUrl", v)} />
      </div>

      <Separator />
      <h4 className="text-sm font-semibold text-foreground">Secciones</h4>
      <TextField label="Título explorar" value={data.exploreTitle} onChange={(v) => onChange("exploreTitle", v)} />
      <TextField label="Título contacto" value={data.contactTitle} onChange={(v) => onChange("contactTitle", v)} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextField label="Teléfono" value={data.phone} onChange={(v) => onChange("phone", v)} />
        <TextField label="Email" value={data.email} onChange={(v) => onChange("email", v)} />
        <TextField label="Ubicación" value={data.location} onChange={(v) => onChange("location", v)} />
      </div>

      <Separator />
      <h4 className="text-sm font-semibold text-foreground">Tarjeta de ayuda</h4>
      <TextField label="Título" value={data.helpTitle} onChange={(v) => onChange("helpTitle", v)} />
      <TextAreaField label="Descripción" value={data.helpDescription} onChange={(v) => onChange("helpDescription", v)} rows={2} />
      <TextField label="Botón chat" value={data.chatButton} onChange={(v) => onChange("chatButton", v)} />

      <Separator />
      <TextField label="Copyright" value={data.copyright} onChange={(v) => onChange("copyright", v)} placeholder="Usa {year} para el año dinámico" />
      <TextField label="Texto final" value={data.madeWith} onChange={(v) => onChange("madeWith", v)} />
    </div>
  );
}

function NavbarEditor({ data, onChange }: { data: any; onChange: (f: string, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField label="Nombre de marca" value={data.brandName} onChange={(v) => onChange("brandName", v)} />
        <TextField label="Sub-marca" value={data.brandSub} onChange={(v) => onChange("brandSub", v)} />
      </div>

      <Separator />
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-foreground">Items de navegación</h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const items = [...(data.navItems ?? []), { key: "", label: "" }];
              onChange("navItems", items);
            }}
            className="gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar
          </Button>
        </div>
        <div className="space-y-3">
          {(data.navItems ?? []).map((item: { key: string; label: string }, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs shrink-0">{i + 1}</Badge>
              <Input
                value={item.key}
                onChange={(e) => {
                  const items = [...data.navItems];
                  items[i] = { ...items[i], key: e.target.value };
                  onChange("navItems", items);
                }}
                placeholder="Key (ej: home, plans)"
                className="w-32"
              />
              <Input
                value={item.label}
                onChange={(e) => {
                  const items = [...data.navItems];
                  items[i] = { ...items[i], label: e.target.value };
                  onChange("navItems", items);
                }}
                placeholder="Etiqueta visible"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  const items = data.navItems.filter((_: unknown, j: number) => j !== i);
                  onChange("navItems", items);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextField label="Botón CTA" value={data.ctaButton} onChange={(v) => onChange("ctaButton", v)} />
        <TextField label="Botón CTA (móvil)" value={data.ctaButtonMobile} onChange={(v) => onChange("ctaButtonMobile", v)} />
        <TextField label="Etiqueta admin" value={data.adminLabel} onChange={(v) => onChange("adminLabel", v)} />
      </div>
    </div>
  );
}

// ─── Reusable Array Editors ─────────────────────────────────────────────────

function ArrayEditor({
  label,
  items,
  fieldNames,
  fieldLabels,
  onChange,
}: {
  label: string;
  items: any[];
  fieldNames: string[];
  fieldLabels: string[];
  onChange: (items: any[]) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground">{label}</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newItem: Record<string, string> = {};
            fieldNames.forEach((f) => (newItem[f] = ""));
            onChange([...items, newItem]);
          }}
          className="gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Agregar
        </Button>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="bg-muted/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground hover:text-destructive gap-1"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
              >
                <Trash2 className="w-3 h-3" /> Eliminar
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fieldNames.map((fieldName, fi) => (
                <div key={fieldName}>
                  <label className="text-xs text-muted-foreground">{fieldLabels[fi]}</label>
                  {fieldName === "description" ? (
                    <Textarea
                      value={item[fieldName] ?? ""}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...updated[i], [fieldName]: e.target.value };
                        onChange(updated);
                      }}
                      rows={2}
                      className="mt-1 resize-y"
                    />
                  ) : (
                    <Input
                      value={item[fieldName] ?? ""}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[i] = { ...updated[i], [fieldName]: e.target.value };
                        onChange(updated);
                      }}
                      className="mt-1"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PoliciesArrayEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: Array<{ id: string; title: string; content: string }>;
  onChange: (items: Array<{ id: string; title: string; content: string }>) => void;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground">{label}</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newItem = {
              id: `policy-${Date.now()}`,
              title: "",
              content: "",
            };
            onChange([...items, newItem]);
            setExpandedIndex(items.length);
          }}
          className="gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Agregar
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 bg-muted/20 hover:bg-muted/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{i + 1}</Badge>
                <span className="text-sm font-medium">{item.title || "(Sin título)"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(items.filter((_, j) => j !== i));
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </button>
            {expandedIndex === i && (
              <div className="p-4 space-y-3 border-t">
                <div>
                  <label className="text-xs text-muted-foreground">Título de la política</label>
                  <Input
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[i] = { ...updated[i], title: e.target.value };
                      onChange(updated);
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Contenido (Markdown)</label>
                  <Textarea
                    value={item.content}
                    onChange={(e) => {
                      const updated = [...items];
                      updated[i] = { ...updated[i], content: e.target.value };
                      onChange(updated);
                    }}
                    rows={12}
                    className="mt-1 resize-y font-mono text-xs"
                    placeholder="Escribe el contenido en formato Markdown..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Usa **texto** para negrita, - para listas, 1. para listas numeradas
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
