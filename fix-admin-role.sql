-- ============================================================
-- VIVE TRAVEL - ARREGLAR ROL DE ADMINISTRADOR
-- ============================================================
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- 
-- Este SQL hace 3 cosas:
-- 1. Verifica/crea las funciones auxiliares anti-recursión
-- 2. Asegura que el trigger de creación de perfil funciona
-- 3. BUSCA el usuario trespa.paginas@gmail.com y le da rol administrador
--    (crea el perfil si no existe, actualiza si existe)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- PASO 1: Funciones auxiliares (anti-recursión RLS)
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_user_role(check_uid UUID)
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = check_uid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('administrador', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'administrador'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ────────────────────────────────────────────────────────────
-- PASO 2: Trigger para crear perfil automáticamente
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'editor')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'No se pudo crear perfil para usuario %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- PASO 3: Función para promover a administrador por email
-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.make_admin(p_email TEXT)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_full_name TEXT;
BEGIN
  -- Buscar el usuario por email en auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró usuario con email: %', p_email;
  END IF;
  
  -- Obtener nombre de user_metadata o del email
  SELECT COALESCE(raw_user_meta_data->>'full_name', split_part(p_email, '@', 1))
  INTO v_full_name
  FROM auth.users WHERE id = v_user_id;
  
  -- Crear o actualizar el perfil con rol administrador
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (v_user_id, p_email, v_full_name, 'administrador')
  ON CONFLICT (id) DO UPDATE SET
    role = 'administrador',
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ────────────────────────────────────────────────────────────
-- PASO 4: Políticas RLS de profiles (sin auto-referencia)
-- ────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile role" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile insert" ON public.profiles;

-- Ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins pueden ver todos
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Usuarios pueden actualizar su propio perfil (sin cambiar rol)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role::TEXT = public.get_user_role(auth.uid()));

-- Admins pueden cambiar cualquier perfil
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- Permitir INSERT (para el trigger y creación)
CREATE POLICY "Allow profile insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- ────────────────────────────────────────────────────────────
-- PASO 5: ASIGNAR ROL ADMINISTRADOR AL USUARIO
-- ────────────────────────────────────────────────────────────
-- ✅ Esto busca el usuario por email y le da rol administrador.
-- ✅ Si el perfil no existe, lo crea.
-- ✅ Si ya existe, actualiza el rol.

SELECT public.make_admin('trespa.paginas@gmail.com');

-- ────────────────────────────────────────────────────────────
-- VERIFICACIÓN: Ejecuta esto después para confirmar
-- ────────────────────────────────────────────────────────────
-- SELECT u.email, p.role, p.full_name FROM auth.users u
-- LEFT JOIN public.profiles p ON p.id = u.id;
--
-- Debería mostrar:
-- email: trespa.paginas@gmail.com
-- role: administrador
-- full_name: (nombre del usuario)
-- ============================================================
