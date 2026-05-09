"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-provider";
import { Loader2, LayoutDashboard, Map, Home, MessageSquare, FileText, Settings, LogOut, Palmtree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "@/components/error-boundary";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/planes", label: "Planes", icon: Map },
  { href: "/admin/cabanas", label: "Cabañas", icon: Home },
  { href: "/admin/mensajes", label: "Mensajes", icon: MessageSquare },
  { href: "/admin/contenido", label: "Contenido", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isEditor, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=" + encodeURIComponent(pathname));
    } else if (!loading && user && !isEditor) {
      router.push("/");
    }
  }, [loading, user, isEditor, router, pathname]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!user || !isEditor) return null;

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-white">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center">
              <Palmtree className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-brand-dark text-sm">Vive Travel</span>
              <span className="block text-[10px] text-muted-foreground">Panel Admin</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive ? "bg-brand/10 text-brand" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={() => router.push("/")}>
            <Settings className="w-4 h-4" /> Ver sitio
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-red-500 hover:text-red-600" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Mobile header + content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile nav */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand text-white flex items-center justify-center">
                <Palmtree className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm">Admin</span>
            </div>
            <div className="flex gap-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      isActive ? "bg-brand/10 text-brand" : "text-muted-foreground"
                    )}
                    title={item.label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
              <button onClick={handleSignOut} className="p-2 rounded-lg text-red-500" title="Cerrar sesión">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
