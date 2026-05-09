"use client";

import { useEffect, useState, createContext, useContext, useMemo, useCallback } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: "administrador" | "editor";
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isConfigured: boolean;
  profileError: string | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: false,
  isAdmin: false,
  isEditor: false,
  isConfigured: false,
  profileError: null,
  signOut: async () => {},
  refreshProfile: async () => {},
});

/**
 * Fetch profile using get_my_profile() RPC (SECURITY DEFINER).
 * This is the most reliable method because:
 * 1. It bypasses RLS entirely
 * 2. It auto-creates the profile if it doesn't exist
 * 3. It uses auth.uid() internally, so no ID mismatch issues
 */
async function fetchMyProfile(supabase: NonNullable<ReturnType<typeof createClient>>): Promise<UserProfile | null> {
  // Method 1: Use get_my_profile() RPC (SECURITY DEFINER, auto-creates profile)
  try {
    const { data, error } = await supabase.rpc("get_my_profile");
    if (!error && data && data.length > 0) {
      const p = data[0];
      return {
        id: p.id,
        email: p.email,
        full_name: p.full_name,
        role: p.role,
      };
    }
    if (error) {
      console.warn("[Auth] get_my_profile RPC error:", error.code, error.message);
    }
  } catch (e) {
    console.warn("[Auth] get_my_profile RPC exception:", e);
  }

  // Method 2: Use server-side endpoint as fallback
  try {
    const res = await fetch("/api/auth/ensure-profile");
    if (res.ok) {
      const d = await res.json();
      if (d.profile) {
        return d.profile as UserProfile;
      }
    }
  } catch (e) {
    console.warn("[Auth] Server profile fetch error:", e);
  }

  // Method 3: Direct SELECT query (may fail due to RLS)
  try {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (data) {
      return data as UserProfile;
    }
  } catch (e) {
    console.warn("[Auth] Direct profile query error:", e);
  }

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loading = configured ? authLoading : false;

  const loadProfile = useCallback(async (authUser: User) => {
    setProfileError(null);
    console.log("[Auth] Loading profile for:", authUser.email);

    const supabase = createClient();
    if (!supabase) {
      console.error("[Auth] No Supabase client available");
      setProfileError("Error de configuración: Supabase no disponible.");
      return;
    }

    const p = await fetchMyProfile(supabase);

    if (p) {
      console.log("[Auth] Profile loaded:", p.email, "role:", p.role);
      setProfile(p);
      return;
    }

    // All methods failed - try one more time after a delay
    console.log("[Auth] First attempt failed, retrying in 2s...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    const retryProfile = await fetchMyProfile(supabase);
    if (retryProfile) {
      console.log("[Auth] Profile loaded on retry:", retryProfile.email, "role:", retryProfile.role);
      setProfile(retryProfile);
      return;
    }

    console.error("[Auth] Could not load profile after retries");
    setProfileError("No se pudo cargar tu perfil de usuario. Intenta cerrar sesión e iniciar sesión de nuevo.");
  }, []);

  useEffect(() => {
    if (!configured) {
      queueMicrotask(() => setAuthLoading(false));
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      queueMicrotask(() => setAuthLoading(false));
      return;
    }

    let mounted = true;

    // Get initial session
    supabase.auth.getUser().then(async ({ data: { user: initialUser } }) => {
      if (!mounted) return;
      console.log("[Auth] Initial user:", initialUser?.email || "none");
      setUser(initialUser);
      if (initialUser) {
        await loadProfile(initialUser);
      }
      if (mounted) setAuthLoading(false);
    }).catch((err) => {
      console.error("[Auth] getUser error:", err);
      if (mounted) setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        console.log("[Auth] Auth state changed:", event, session?.user?.email || "no session");

        // Ignore INITIAL_SESSION — already handled by getUser()
        if (event === "INITIAL_SESSION") return;

        setAuthLoading(true);
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        if (sessionUser) {
          await loadProfile(sessionUser);
        } else {
          setProfile(null);
          setProfileError(null);
        }
        if (mounted) setAuthLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [configured, loadProfile]);

  const signOut = useMemo(() => async () => {
    if (configured) {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    setUser(null);
    setProfile(null);
    setProfileError(null);
  }, [configured]);

  const refreshProfile = useCallback(async () => {
    if (!user || !configured) return;
    await loadProfile(user);
  }, [user, configured, loadProfile]);

  const isAdmin = profile?.role === "administrador";
  const isEditor = profile?.role === "editor" || profile?.role === "administrador";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        isEditor,
        isConfigured: configured,
        profileError,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
