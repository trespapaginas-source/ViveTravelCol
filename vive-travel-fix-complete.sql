-- ============================================================
-- VIVE TRAVEL - FIX COMPLETO DE AUTENTICACIÓN Y PERFILES
-- ============================================================
-- EJECUTAR EN: Supabase Dashboard → SQL Editor → New Query
-- PEGAR TODO Y EJECUTAR (Run)
-- ============================================================

-- PASO 1: Asegurar que el tipo app_role existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('administrador', 'editor');
    RAISE NOTICE 'Tipo app_role creado';
  ELSE
    RAISE NOTICE 'Tipo app_role ya existe';
  END IF;
END $$;

-- PASO 2: Asegurar que el tipo image_source existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'image_source') THEN
    CREATE TYPE image_source AS ENUM ('external', 'upload');
    RAISE NOTICE 'Tipo image_source creado';
  ELSE
    RAISE NOTICE 'Tipo image_source ya existe';
  END IF;
END $$;

-- PASO 3: Asegurar que la tabla profiles existe con la estructura correcta
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role app_role NOT NULL DEFAULT 'editor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PASO 4: Crear función auxiliar que lee el rol SIN ser afectada por RLS
CREATE OR REPLACE FUNCTION public.get_user_role(check_uid UUID)
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = check_uid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PASO 5: Función para verificar si el usuario actual es admin/editor
CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('administrador', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PASO 6: Función para verificar si el usuario actual es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'administrador'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PASO 7: Función para crear perfil (bypassea RLS)
-- Esta función permite que un usuario autenticado cree SU PROPIO perfil
-- También permite actualizar el rol si ya existe
CREATE OR REPLACE FUNCTION public.create_profile(
  p_id UUID,
  p_email TEXT,
  p_full_name TEXT DEFAULT NULL,
  p_role TEXT DEFAULT 'editor'
)
RETURNS VOID AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Debes estar autenticado para crear un perfil';
  END IF;
  IF auth.uid() != p_id THEN
    RAISE EXCEPTION 'Solo puedes crear tu propio perfil';
  END IF;
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    p_id,
    p_email,
    COALESCE(p_full_name, split_part(p_email, '@', 1)),
    p_role::app_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    role = CASE
      WHEN profiles.role = 'editor' AND p_role::app_role = 'administrador' THEN 'administrador'::app_role
      ELSE profiles.role
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 8: Función para promover un usuario a administrador por email
CREATE OR REPLACE FUNCTION public.make_admin(p_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'administrador'
  WHERE email = p_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 9: Trigger para crear perfil automáticamente al registrar usuario
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

-- Asegurar que el trigger existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PASO 10: ELIMINAR TODAS las políticas RLS existentes de profiles
-- y crearlas de nuevo correctamente
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    RAISE NOTICE 'Eliminada política: %', pol.policyname;
  END LOOP;
END $$;

-- Ver su propio perfil (cualquier usuario autenticado puede verse a sí mismo)
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Usuarios pueden insertar su propio perfil
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins pueden insertar cualquier perfil
CREATE POLICY "Admins can insert any profile"
  ON public.profiles FOR INSERT
  WITH CHECK (public.is_admin());

-- Usuarios pueden actualizar su propio perfil (sin cambiar rol)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role::TEXT = public.get_user_role(auth.uid()));

-- Admins pueden cambiar cualquier perfil
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- PASO 11: CREAR/ACTUALIZAR el perfil del administrador
-- Busca el usuario trespa.paginas@gmail.com en auth.users
-- y crea su perfil como administrador
DO $$
DECLARE
  v_user_id UUID;
  v_full_name TEXT;
  v_existing_role TEXT;
BEGIN
  -- Buscar el usuario por email
  SELECT id, COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
  INTO v_user_id, v_full_name
  FROM auth.users
  WHERE email = 'trespa.paginas@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No se encontro usuario trespa.paginas@gmail.com en auth.users. El perfil se creara cuando el usuario inicie sesion.';
    RETURN;
  END IF;

  RAISE NOTICE 'Usuario encontrado: id=%, name=%', v_user_id, v_full_name;

  -- Verificar si ya existe un perfil
  SELECT role::TEXT INTO v_existing_role FROM public.profiles WHERE id = v_user_id;

  IF v_existing_role IS NOT NULL THEN
    RAISE NOTICE 'Perfil existente encontrado con role=%', v_existing_role;
    -- Actualizar a administrador si no lo es
    IF v_existing_role != 'administrador' THEN
      UPDATE public.profiles SET role = 'administrador' WHERE id = v_user_id;
      RAISE NOTICE 'Perfil actualizado a administrador';
    END IF;
  ELSE
    -- Crear el perfil como administrador
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (v_user_id, 'trespa.paginas@gmail.com', v_full_name, 'administrador');
    RAISE NOTICE 'Perfil de administrador creado';
  END IF;
END $$;

-- PASO 12: VERIFICACIÓN - Mostrar el estado actual
SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  p.role,
  p.full_name,
  CASE WHEN p.id IS NOT NULL THEN 'SI' ELSE 'NO' END as perfil_existe
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
ORDER BY u.created_at DESC;

-- ============================================================
-- RESULTADO: La última consulta debe mostrar tu usuario con:
--   email: trespa.paginas@gmail.com
--   role: administrador
--   perfil_existe: SI
-- ============================================================
