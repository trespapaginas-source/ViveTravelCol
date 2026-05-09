-- ============================================================
-- FIX: Corregir recursión infinita en políticas RLS
-- ============================================================
-- El problema: las políticas de "profiles" se referencian a sí mismas,
-- causando recursión infinita que bloquea TODAS las consultas.
-- Solución: usar una función SECURITY DEFINER que bypassa RLS
-- para verificar el rol del usuario.
-- ============================================================

-- 1. Crear función auxiliar que bypassa RLS para leer el rol
CREATE OR REPLACE FUNCTION public.get_user_role(check_uid UUID)
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.profiles WHERE id = check_uid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Crear función para verificar si el usuario es admin/editor
CREATE OR REPLACE FUNCTION public.is_admin_or_editor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('administrador', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 3. Crear función para verificar si el usuario es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'administrador'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- 4. ELIMINAR TODAS LAS POLÍTICAS EXISTENTES DE PROFILES
-- ============================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile role" ON public.profiles;

-- 5. Nuevas políticas de PROFILES (sin auto-referencia)

-- Cualquiera puede ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins pueden ver todos los perfiles (usando función, sin auto-ref)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Usuarios pueden actualizar su propio perfil (sin cambiar rol)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role::TEXT = public.get_user_role(auth.uid()));

-- Admins pueden cambiar cualquier perfil (incluido rol)
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- ============================================================
-- 6. ELIMINAR Y RECREAR POLÍTICAS DE TODAS LAS DEMÁS TABLAS
-- ============================================================

-- PLAN_CATEGORIES
DROP POLICY IF EXISTS "Categories are publicly readable" ON public.plan_categories;
DROP POLICY IF EXISTS "Admins and editors can manage categories" ON public.plan_categories;

CREATE POLICY "Categories are publicly readable"
  ON public.plan_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage categories"
  ON public.plan_categories FOR ALL
  USING (public.is_admin_or_editor());


-- TOUR_PLANS
DROP POLICY IF EXISTS "Published plans are publicly readable" ON public.tour_plans;
DROP POLICY IF EXISTS "Admins and editors can see all plans" ON public.tour_plans;
DROP POLICY IF EXISTS "Admins and editors can create plans" ON public.tour_plans;
DROP POLICY IF EXISTS "Admins and editors can update plans" ON public.tour_plans;
DROP POLICY IF EXISTS "Only admins can delete plans" ON public.tour_plans;

CREATE POLICY "Published plans are publicly readable"
  ON public.tour_plans FOR SELECT
  USING (published = true);

CREATE POLICY "Admins and editors can see all plans"
  ON public.tour_plans FOR SELECT
  USING (public.is_admin_or_editor());

CREATE POLICY "Admins and editors can create plans"
  ON public.tour_plans FOR INSERT
  WITH CHECK (public.is_admin_or_editor());

CREATE POLICY "Admins and editors can update plans"
  ON public.tour_plans FOR UPDATE
  USING (public.is_admin_or_editor());

CREATE POLICY "Only admins can delete plans"
  ON public.tour_plans FOR DELETE
  USING (public.is_admin());


-- PLAN_IMAGES
DROP POLICY IF EXISTS "Plan images are publicly readable" ON public.plan_images;
DROP POLICY IF EXISTS "Admins and editors can manage plan images" ON public.plan_images;

CREATE POLICY "Plan images are publicly readable"
  ON public.plan_images FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.tour_plans WHERE id = plan_images.plan_id AND published = true)
    OR public.is_admin_or_editor()
  );

CREATE POLICY "Admins and editors can manage plan images"
  ON public.plan_images FOR ALL
  USING (public.is_admin_or_editor());


-- PLAN_INCLUDES
DROP POLICY IF EXISTS "Plan includes publicly readable" ON public.plan_includes;
DROP POLICY IF EXISTS "Admins and editors can manage plan includes" ON public.plan_includes;

CREATE POLICY "Plan includes publicly readable"
  ON public.plan_includes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.tour_plans WHERE id = plan_includes.plan_id AND published = true)
    OR public.is_admin_or_editor()
  );

CREATE POLICY "Admins and editors can manage plan includes"
  ON public.plan_includes FOR ALL
  USING (public.is_admin_or_editor());


-- PLAN_EXCLUDES
DROP POLICY IF EXISTS "Plan excludes publicly readable" ON public.plan_excludes;
DROP POLICY IF EXISTS "Admins and editors can manage plan excludes" ON public.plan_excludes;

CREATE POLICY "Plan excludes publicly readable"
  ON public.plan_excludes FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.tour_plans WHERE id = plan_excludes.plan_id AND published = true)
    OR public.is_admin_or_editor()
  );

CREATE POLICY "Admins and editors can manage plan excludes"
  ON public.plan_excludes FOR ALL
  USING (public.is_admin_or_editor());


-- PLAN_HIGHLIGHTS
DROP POLICY IF EXISTS "Plan highlights publicly readable" ON public.plan_highlights;
DROP POLICY IF EXISTS "Admins and editors can manage plan highlights" ON public.plan_highlights;

CREATE POLICY "Plan highlights publicly readable"
  ON public.plan_highlights FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.tour_plans WHERE id = plan_highlights.plan_id AND published = true)
    OR public.is_admin_or_editor()
  );

CREATE POLICY "Admins and editors can manage plan highlights"
  ON public.plan_highlights FOR ALL
  USING (public.is_admin_or_editor());


-- CABINS
DROP POLICY IF EXISTS "Published cabins are publicly readable" ON public.cabins;
DROP POLICY IF EXISTS "Admins and editors can see all cabins" ON public.cabins;
DROP POLICY IF EXISTS "Admins and editors can create cabins" ON public.cabins;
DROP POLICY IF EXISTS "Admins and editors can update cabins" ON public.cabins;
DROP POLICY IF EXISTS "Only admins can delete cabins" ON public.cabins;

CREATE POLICY "Published cabins are publicly readable"
  ON public.cabins FOR SELECT
  USING (published = true);

CREATE POLICY "Admins and editors can see all cabins"
  ON public.cabins FOR SELECT
  USING (public.is_admin_or_editor());

CREATE POLICY "Admins and editors can create cabins"
  ON public.cabins FOR INSERT
  WITH CHECK (public.is_admin_or_editor());

CREATE POLICY "Admins and editors can update cabins"
  ON public.cabins FOR UPDATE
  USING (public.is_admin_or_editor());

CREATE POLICY "Only admins can delete cabins"
  ON public.cabins FOR DELETE
  USING (public.is_admin());


-- CABIN_IMAGES
DROP POLICY IF EXISTS "Cabin images are publicly readable" ON public.cabin_images;
DROP POLICY IF EXISTS "Admins and editors can manage cabin images" ON public.cabin_images;

CREATE POLICY "Cabin images are publicly readable"
  ON public.cabin_images FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.cabins WHERE id = cabin_images.cabin_id AND published = true)
    OR public.is_admin_or_editor()
  );

CREATE POLICY "Admins and editors can manage cabin images"
  ON public.cabin_images FOR ALL
  USING (public.is_admin_or_editor());


-- CABIN_AMENITIES
DROP POLICY IF EXISTS "Cabin amenities publicly readable" ON public.cabin_amenities;
DROP POLICY IF EXISTS "Admins and editors can manage cabin amenities" ON public.cabin_amenities;

CREATE POLICY "Cabin amenities publicly readable"
  ON public.cabin_amenities FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.cabins WHERE id = cabin_amenities.cabin_id AND published = true)
    OR public.is_admin_or_editor()
  );

CREATE POLICY "Admins and editors can manage cabin amenities"
  ON public.cabin_amenities FOR ALL
  USING (public.is_admin_or_editor());


-- CABIN_HIGHLIGHTS
DROP POLICY IF EXISTS "Cabin highlights publicly readable" ON public.cabin_highlights;
DROP POLICY IF EXISTS "Admins and editors can manage cabin highlights" ON public.cabin_highlights;

CREATE POLICY "Cabin highlights publicly readable"
  ON public.cabin_highlights FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.cabins WHERE id = cabin_highlights.cabin_id AND published = true)
    OR public.is_admin_or_editor()
  );

CREATE POLICY "Admins and editors can manage cabin highlights"
  ON public.cabin_highlights FOR ALL
  USING (public.is_admin_or_editor());


-- CABIN_RULES
DROP POLICY IF EXISTS "Cabin rules publicly readable" ON public.cabin_rules;
DROP POLICY IF EXISTS "Admins and editors can manage cabin rules" ON public.cabin_rules;

CREATE POLICY "Cabin rules publicly readable"
  ON public.cabin_rules FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.cabins WHERE id = cabin_rules.cabin_id AND published = true)
    OR public.is_admin_or_editor()
  );

CREATE POLICY "Admins and editors can manage cabin rules"
  ON public.cabin_rules FOR ALL
  USING (public.is_admin_or_editor());


-- TESTIMONIALS
DROP POLICY IF EXISTS "Published testimonials are publicly readable" ON public.testimonials;
DROP POLICY IF EXISTS "Admins and editors can manage testimonials" ON public.testimonials;

CREATE POLICY "Published testimonials are publicly readable"
  ON public.testimonials FOR SELECT
  USING (published = true);

CREATE POLICY "Admins and editors can manage testimonials"
  ON public.testimonials FOR ALL
  USING (public.is_admin_or_editor());


-- HERO_IMAGES
DROP POLICY IF EXISTS "Hero images are publicly readable" ON public.hero_images;
DROP POLICY IF EXISTS "Admins and editors can manage hero images" ON public.hero_images;

CREATE POLICY "Hero images are publicly readable"
  ON public.hero_images FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage hero images"
  ON public.hero_images FOR ALL
  USING (public.is_admin_or_editor());


-- TRIP_IMAGES
DROP POLICY IF EXISTS "Trip images are publicly readable" ON public.trip_images;
DROP POLICY IF EXISTS "Admins and editors can manage trip images" ON public.trip_images;

CREATE POLICY "Trip images are publicly readable"
  ON public.trip_images FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage trip images"
  ON public.trip_images FOR ALL
  USING (public.is_admin_or_editor());


-- SITE_CONTENT
DROP POLICY IF EXISTS "Site content is publicly readable" ON public.site_content;
DROP POLICY IF EXISTS "Admins and editors can manage site content" ON public.site_content;

CREATE POLICY "Site content is publicly readable"
  ON public.site_content FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can manage site content"
  ON public.site_content FOR ALL
  USING (public.is_admin_or_editor());


-- CONTACT_MESSAGES
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins and editors can read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins and editors can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can delete contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can create contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins and editors can read contact messages"
  ON public.contact_messages FOR SELECT
  USING (public.is_admin_or_editor());

CREATE POLICY "Admins and editors can update contact messages"
  ON public.contact_messages FOR UPDATE
  USING (public.is_admin_or_editor());

CREATE POLICY "Only admins can delete contact messages"
  ON public.contact_messages FOR DELETE
  USING (public.is_admin());
