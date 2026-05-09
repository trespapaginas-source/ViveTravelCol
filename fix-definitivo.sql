-- ============================================================
-- VIVE TRAVEL - CORRECCIÓN DEFINITIVA DE AUTENTICACIÓN
-- ============================================================
-- Ejecutar TODO este script en: Supabase SQL Editor
-- Haz clic en "Run and enable RLS" si aparece el diálogo
-- ============================================================

-- PASO 1: Eliminar TODAS las políticas existentes en profiles
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    RAISE NOTICE 'Eliminada política: %', pol.policyname;
  END LOOP;
END;
$$;

-- PASO 2: Eliminar funciones anteriores que puedan causar conflicto
DROP FUNCTION IF EXISTS public.is_admin_or_editor() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.create_profile(UUID, TEXT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.make_admin(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_my_profile() CASCADE;
DROP FUNCTION IF EXISTS public.ensure_my_profile() CASCADE;

-- PASO 3: Crear función get_my_profile() - SECURITY DEFINER
-- Esta función lee el perfil del usuario autenticado SIN importar RLS
-- Si no existe, lo crea automáticamente
CREATE OR REPLACE FUNCTION public.get_my_profile()
RETURNS TABLE(id UUID, email TEXT, full_name TEXT, role TEXT) AS $$
DECLARE
  v_uid UUID;
  v_email TEXT;
  v_name TEXT;
  v_role TEXT;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  -- Intentar leer el perfil existente
  RETURN QUERY
    SELECT p.id, p.email::TEXT, p.full_name::TEXT, p.role::TEXT
    FROM public.profiles p
    WHERE p.id = v_uid;

  IF FOUND THEN
    RETURN;
  END IF;

  -- Perfil no existe - crearlo
  v_email := auth.jwt() ->> 'email';
  IF v_email IS NULL THEN
    SELECT email INTO v_email FROM auth.users WHERE id = v_uid;
  END IF;
  IF v_email IS NULL THEN
    v_email := '';
  END IF;

  v_name := auth.jwt() ->> 'full_name';
  IF v_name IS NULL THEN
    v_name := split_part(v_email, '@', 1);
  END IF;

  v_role := auth.jwt() ->> 'role';
  IF v_role IS NULL OR (v_role != 'administrador' AND v_role != 'editor') THEN
    v_role := 'editor';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (v_uid, v_email, v_name, v_role::app_role)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);

  RETURN QUERY
    SELECT p.id, p.email::TEXT, p.full_name::TEXT, p.role::TEXT
    FROM public.profiles p
    WHERE p.id = v_uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 4: Crear función make_admin() - para asignar rol admin
CREATE OR REPLACE FUNCTION public.make_admin(p_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'administrador'
  WHERE email = p_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 5: Crear función create_profile() - para el trigger y uso general
CREATE OR REPLACE FUNCTION public.create_profile(
  p_id UUID,
  p_email TEXT,
  p_full_name TEXT DEFAULT NULL,
  p_role TEXT DEFAULT 'editor'
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    p_id,
    p_email,
    COALESCE(p_full_name, split_part(p_email, '@', 1)),
    p_role::app_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 6: Crear función is_admin() para RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'administrador'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PASO 7: Trigger para crear perfil automáticamente al registrar usuario
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

-- PASO 8: Crear políticas RLS simples y sin recursión
-- Asegurar que RLS esté habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política 1: Cada usuario puede ver SU propio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Política 2: Admins pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Política 3: Cada usuario puede actualizar SU propio perfil (sin cambiar rol)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política 4: Admins pueden actualizar cualquier perfil
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- Política 5: Permitir INSERT de propio perfil o admin
CREATE POLICY "Allow profile insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- Política 6: Permitir DELETE solo a admin
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.is_admin());

-- PASO 9: Asegurar que el usuario admin tenga perfil con rol administrador
DO $$
DECLARE
  v_user_id UUID;
  v_full_name TEXT;
BEGIN
  SELECT id, COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
  INTO v_user_id, v_full_name
  FROM auth.users
  WHERE email = 'trespa.paginas@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No se encontró usuario trespa.paginas@gmail.com en auth.users';
    RETURN;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (v_user_id, 'trespa.paginas@gmail.com', v_full_name, 'administrador')
  ON CONFLICT (id) DO UPDATE SET
    role = 'administrador',
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);

  RAISE NOTICE 'Perfil de admin creado/actualizado para %', v_user_id;
END;
$$;

-- PASO 10: Verificar el resultado
SELECT 'Verificación de perfiles:' AS info;
SELECT id, email, full_name, role FROM public.profiles;

SELECT 'Verificación de políticas RLS:' AS info;
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public';

SELECT 'Verificación de funciones:' AS info;
SELECT routine_name, routine_type FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name IN (
  'get_my_profile', 'create_profile', 'make_admin', 'is_admin', 'handle_new_user'
);
