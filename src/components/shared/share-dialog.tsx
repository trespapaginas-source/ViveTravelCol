"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Facebook,
  Link2,
  Share2,
  Check,
} from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  text: string;
}

export function ShareDialog({ open, onOpenChange, title, text }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleWhatsApp = useCallback(() => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${currentUrl}`)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  }, [text, currentUrl, onOpenChange]);

  const handleFacebook = useCallback(() => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(text)}`;
    window.open(facebookUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    onOpenChange(false);
  }, [text, currentUrl, onOpenChange]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success("Enlace copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
      onOpenChange(false);
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  }, [currentUrl, onOpenChange]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: currentUrl,
        });
        onOpenChange(false);
      } catch {
        // User cancelled — do nothing
      }
    }
  }, [title, text, currentUrl, onOpenChange]);

  const supportsNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-5 pb-3 border-b border-border/50">
          <DialogTitle className="text-base font-semibold">Compartir</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-2">
          {/* Native Share (Mobile) */}
          {supportsNativeShare && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/80 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-ocean/10 flex items-center justify-center shrink-0 group-hover:bg-ocean/15 transition-colors">
                <Share2 className="w-4.5 h-4.5 text-ocean" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">Más opciones</p>
                <p className="text-xs text-muted-foreground">Compartir con otras apps</p>
              </div>
            </button>
          )}

          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/80 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/15 transition-colors">
              <MessageCircle className="w-4.5 h-4.5 text-[#25D366]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">WhatsApp</p>
              <p className="text-xs text-muted-foreground">Enviar por chat</p>
            </div>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebook}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/80 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1877F2]/10 flex items-center justify-center shrink-0 group-hover:bg-[#1877F2]/15 transition-colors">
              <Facebook className="w-4.5 h-4.5 text-[#1877F2]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Facebook</p>
              <p className="text-xs text-muted-foreground">Compartir en tu muro</p>
            </div>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/80 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-muted/80 transition-colors">
              {copied ? (
                <Check className="w-4.5 h-4.5 text-palm" />
              ) : (
                <Link2 className="w-4.5 h-4.5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {copied ? "¡Copiado!" : "Copiar enlace"}
              </p>
              <p className="text-xs text-muted-foreground">
                {copied ? "Listo para compartir" : "Pegar en cualquier lugar"}
              </p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
