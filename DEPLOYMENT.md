# Vive Travel - Guía de Despliegue con Supabase

## 📋 Resumen de la Migración

Se migró completamente de SQLite/Prisma a Supabase (PostgreSQL). Los cambios principales:

| Antes | Ahora |
|-------|-------|
| SQLite local | Supabase (PostgreSQL en la nube) |
| JSON dentro de textos | Tablas normalizadas con relaciones |
| Sin autenticación | Supabase Auth con roles |
| Sin protección | RLS (Row Level Security) en todas las tablas |
| Imágenes solo por URL | Subida a Storage + URL externa |
| CMS sin protección | Login con roles administrador/editor |

---

## 🚀 Pasos para Poner en Marcha

### Paso 1: Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta (gratis)
2. Clic en "New Project"
3. Nombre: `vive-travel`
4. Contraseña de base de datos: **guárdala bien**
5. Región: Elige la más cercana a Colombia (ej: East US)
6. Espera a que se cree el proyecto (~2 minutos)

### Paso 2: Ejecutar el esquema SQL

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Clic en **New Query**
3. Abre el archivo `supabase-schema.sql` de este proyecto
4. Copia TODO el contenido y pégalo en el editor
5. Clic en **Run** (▶️)
6. Espera a que termine (~10 segundos)
7. Verifica: ve a **Table Editor** — deberías ver todas las tablas con datos

### Paso 3: Obtener las credenciales

1. En el dashboard de Supabase, ve a **Settings → API**
2. Copia estos dos valores:
   - **Project URL** → algo como `https://abc123.supabase.co`
   - **anon public key** → una cadena larga que empieza con `eyJ...`

### Paso 4: Configurar variables de entorno

1. Copia `.env.example` como `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y pega tus credenciales:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

3. Reinicia el servidor de desarrollo

### Paso 5: Crear tu usuario administrador

1. En Supabase Dashboard, ve a **Authentication → Users**
2. Clic en **Add User → Create New User**
3. Email: tu email real
4. Password: una contraseña segura
5. **NO** marques "Auto Confirm User" (déjalo desmarcado)
6. Clic en **Create User**
7. Ve a **Table Editor → profiles**
8. Busca tu usuario y cambia el campo `role` de `editor` a `administrador`

**Alternativa**: Regístrate desde la página de login (`/auth/login`) y luego cambia el rol manualmente en la tabla `profiles`.

### Paso 6: Verificar Storage

1. En Supabase Dashboard, ve a **Storage**
2. Verifica que exista el bucket `images`
3. Si no existe, el SQL ya lo creó, pero verifica que esté marcado como **Public**

---

## 🗄️ Esquema de Base de Datos

### Diagrama de Relaciones

```
auth.users ──── profiles (role: administrador/editor)
                    │
    ┌───────────────┼───────────────┐
    │               │               │
plan_categories  tour_plans       cabins
    │            │    │            │    │
    │        ┌───┘    └───┐    ┌───┘    └───┐
    │        │            │    │            │
    │   plan_images   plan_includes  cabin_images  cabin_amenities
    │   plan_includes plan_excludes  cabin_highlights
    │   plan_excludes plan_highlights cabin_rules
    │   plan_highlights
    │
    ├── testimonials (→ plan_id opcional)
    ├── hero_images
    ├── trip_images
    ├── site_content (JSONB por sección)
    └── contact_messages
```

### Tablas y Propósito

| Tabla | Propósito | Clave primaria | Relaciones |
|-------|-----------|----------------|------------|
| `profiles` | Extiende auth.users con rol | id (→ auth.users) | - |
| `plan_categories` | Categorías de planes | id | → tour_plans.category_id |
| `tour_plans` | Planes turísticos | id | → plan_categories |
| `plan_images` | Imágenes de planes | id | → tour_plans (CASCADE) |
| `plan_includes` | Qué incluye un plan | id | → tour_plans (CASCADE) |
| `plan_excludes` | Qué no incluye | id | → tour_plans (CASCADE) |
| `plan_highlights` | Destacados | id | → tour_plans (CASCADE) |
| `cabins` | Cabañas | id | - |
| `cabin_images` | Imágenes de cabañas | id | → cabins (CASCADE) |
| `cabin_amenities` | Comodidades | id | → cabins (CASCADE) |
| `cabin_highlights` | Destacados | id | → cabins (CASCADE) |
| `cabin_rules` | Reglas | id | → cabins (CASCADE) |
| `testimonials` | Testimonios | id | → tour_plans (SET NULL) |
| `hero_images` | Carrusel principal | id | - |
| `trip_images` | Viajes realizados | id | - |
| `site_content` | Textos del sitio (JSONB) | id | - |
| `contact_messages` | Mensajes de contacto | id | - |

---

## 🔐 Roles y Permisos

### Rol: administrador
- ✅ Ver, crear, editar y eliminar planes
- ✅ Ver, crear, editar y eliminar cabañas
- ✅ Ver, crear, editar y eliminar mensajes
- ✅ Editar contenido del sitio
- ✅ Subir y eliminar imágenes del Storage
- ✅ Gestionar perfiles de usuarios

### Rol: editor
- ✅ Ver, crear y editar planes (NO eliminar)
- ✅ Ver, crear y editar cabañas (NO eliminar)
- ✅ Ver y marcar mensajes como leídos (NO eliminar)
- ✅ Editar contenido del sitio
- ✅ Subir imágenes al Storage
- ❌ No puede eliminar planes/cabañas
- ❌ No puede eliminar mensajes
- ❌ No puede eliminar imágenes del Storage
- ❌ No puede gestionar usuarios

### Público (sin login)
- ✅ Ver planes publicados
- ✅ Ver cabañas publicadas
- ✅ Ver testimonios publicados
- ✅ Ver contenido del sitio
- ✅ Enviar mensajes de contacto
- ❌ No puede ver planes en borrador
- ❌ No puede acceder al CMS
- ❌ No puede ver mensajes de contacto

---

## 🛡️ RLS (Row Level Security)

Todas las tablas tienen RLS habilitado. Las políticas principales:

| Tabla | Lectura pública | Lectura admin | Escritura admin | Eliminar |
|-------|----------------|---------------|-----------------|----------|
| tour_plans | Solo publicados | Todo | Admin + Editor | Solo Admin |
| cabins | Solo publicadas | Todo | Admin + Editor | Solo Admin |
| plan_images | De planes publicados | Todo | Admin + Editor | Solo Admin |
| contact_messages | ❌ | Todo | Admin + Editor | Solo Admin |
| site_content | ✅ | Todo | Admin + Editor | Solo Admin |
| testimonials | Solo publicados | Todo | Admin + Editor | Solo Admin |
| hero_images | ✅ | Todo | Admin + Editor | Solo Admin |
| trip_images | ✅ | Todo | Admin + Editor | Solo Admin |

---

## 📦 Storage

### Bucket: `images`
- **Público**: Sí (cualquiera puede ver las imágenes)
- **Tamaño máximo**: 5MB por archivo
- **Formatos permitidos**: JPEG, PNG, WebP, GIF
- **Estructura de carpetas**:
  - `plans/` — Imágenes de planes
  - `cabins/` — Imágenes de cabañas
  - `hero/` — Imágenes del carrusel
  - `trips/` — Imágenes de viajes realizados
  - `general/` — Otras imágenes

### Imágenes: URL externa vs. Subida

Cada imagen tiene dos campos:
- `url` — La URL completa (externa o de Storage)
- `storage_path` — Si se subió a Storage, la ruta interna (null si es externa)
- `source` — `external` (URL externa) o `upload` (subida a Storage)

---

## 🌐 Despliegue en Producción

### Opción recomendada: Vercel

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com) e importa el repositorio
3. En **Environment Variables**, agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu anon key
4. Clic en **Deploy**
5. ¡Listo! Tu web estará en línea

### Checklist de Verificación

- [ ] Proyecto de Supabase creado
- [ ] SQL ejecutado en SQL Editor
- [ ] Tablas visibles en Table Editor con datos
- [ ] Bucket `images` visible en Storage
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Usuario administrador creado en Authentication
- [ ] Rol cambiado a `administrador` en tabla `profiles`
- [ ] Login funciona en `/auth/login`
- [ ] CMS accesible después de login
- [ ] Planes visibles en la página principal
- [ ] Cabañas visibles en la página de cabañas
- [ ] Subida de imágenes funciona
- [ ] Mensajes de contacto se reciben
- [ ] Contenido editable desde el CMS
- [ ] Despliegue en Vercel exitoso

---

## 🔧 Solución de Problemas

### "Supabase credentials not configured"
→ Falta configurar `.env.local` con las credenciales de Supabase

### "Error 401 Unauthorized" al hacer operaciones admin
→ No estás logueado o tu usuario no tiene rol de administrador/editor

### Las imágenes no se ven
→ Verifica que el bucket `images` esté marcado como público en Supabase Storage

### No puedo eliminar planes/cabañas
→ Solo los administradores pueden eliminar. Verifica tu rol en la tabla `profiles`

### Los datos no aparecen
→ Ejecuta el SQL de seed nuevamente desde el SQL Editor de Supabase
