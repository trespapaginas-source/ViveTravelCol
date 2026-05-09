-- ============================================================
-- VIVE TRAVEL - RESET COMPLETO DE AUTENTICACIÓN
-- ============================================================
-- Este SQL:
-- 1. Elimina TODOS los usuarios de auth.users (cascada a profiles)
-- 2. Recrea las funciones y triggers correctos
-- 3. Crea el usuario administrador: trespa.paginas@gmail.com
-- 4. Le asigna el rol de administrador
--
-- CONTRASEÑA TEMPORAL: ViveTravel2025!
-- (Cámbiala después de iniciar sesión)
--
-- EJECUTAR EN: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ============================================================
-- PASO 1: LIMPIEZA TOTAL - Eliminar todos los usuarios
-- ============================================================
-- Al eliminar de auth.users, se eliminan en cascada los profiles
-- gracias a ON DELETE CASCADE en la FK.

-- Eliminar TODOS los perfiles primero (por si hay huérfanos)
DELETE FROM public.profiles;

-- Eliminar TODOS los usuarios de auth
DELETE FROM auth.users;

-- ============================================================
-- PASO 2: RECREAR FUNCIONES AUXILIARES (anti-recursión RLS)
-- ============================================================

-- Función que bypassa RLS para leer el rol de un usuario
CREATE OR REPLACE FUNCTION public.get_user_role(check_uid UUID)
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = check_uid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Función para verificar si el usuario actual es admin o editor
CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('administrador', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Función para verificar si el usuario actual es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'administrador'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- PASO 3: RECREAR TRIGGER handle_new_user()
-- ============================================================
-- Esta función se ejecuta automáticamente cuando se crea un
-- usuario en auth.users (desde el Dashboard o vía API).

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

-- ============================================================
-- PASO 4: FUNCIONES HELPER PARA CREAR/ACTUALIZAR PERFILES
-- ============================================================

-- Función para crear perfil manualmente (si el trigger falla)
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

-- Función para promover un usuario a administrador por email
CREATE OR REPLACE FUNCTION public.make_admin(p_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'administrador'
  WHERE email = p_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- PASO 5: POLÍTICAS RLS DE PROFILES (sin auto-referencia)
-- ============================================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile role" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;

-- Ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins pueden ver todos los perfiles
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

-- Permitir INSERT de perfiles (necesario para el trigger y creación manual)
CREATE POLICY "Allow profile insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- ============================================================
-- PASO 6: CREAR USUARIO ADMINISTRADOR
-- ============================================================
-- Email: trespa.paginas@gmail.com
-- Contraseña temporal: ViveTravel2025!

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'trespa.paginas@gmail.com',
  crypt('ViveTravel2025!', gen_salt('bf')),
  now(),
  '{"full_name": "Admin ViveTravel", "role": "administrador"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- ============================================================
-- PASO 7: ASIGNAR ROL DE ADMINISTRADOR
-- ============================================================
-- El trigger handle_new_user() debería haber creado el perfil
-- con role 'administrador' (porque lo pusimos en raw_user_meta_data),
-- pero nos aseguramos con esta actualización.

UPDATE public.profiles
SET role = 'administrador'
WHERE email = 'trespa.paginas@gmail.com';

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
-- Ejecuta esta consulta para verificar que todo está correcto:
--
-- SELECT
--   u.id,
--   u.email,
--   u.email_confirmed_at,
--   p.role,
--   p.full_name
-- FROM auth.users u
-- LEFT JOIN public.profiles p ON p.id = u.id;
--
-- Deberías ver:
-- - email: trespa.paginas@gmail.com
-- - role: administrador
-- - email_confirmed_at: fecha de hoy
-- - full_name: Admin ViveTravel
-- ============================================================

-- ============================================================
-- IMPORTANTE: CAMBIAR LA CONTRASEÑA
-- ============================================================
-- Después de iniciar sesión con la contraseña temporal
-- "ViveTravel2025!", ve a Configuración de tu cuenta
-- y cámbiala por una contraseña segura.
-- ============================================================
