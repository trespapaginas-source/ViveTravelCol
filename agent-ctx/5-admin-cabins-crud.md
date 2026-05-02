# Task 5 - Admin Cabins CRUD Panel

## Agent: Code Agent
## Task: Build Admin CRUD panel for Cabins

### Work Completed

1. **Updated Navigation Store** (`src/lib/store.ts`)
   - Added `admin-cabins` and `admin-cabin-form` to the `ViewType` union type

2. **Created QueryClient Provider** (`src/components/providers.tsx`)
   - Set up TanStack React Query with `QueryClientProvider`
   - Configured default stale time of 60s and disabled refetch on window focus
   - Wrapped the app in `layout.tsx` with the `<Providers>` component

3. **Created Admin Cabins List** (`src/components/admin/admin-cabins-list.tsx`)
   - "use client" component with TanStack Query data fetching from `/api/cabins`
   - Table view showing: name (with slug subtitle), location, price/night (formatted COP), capacity (guests/bedrooms/bathrooms with icons), published status (emerald badge or secondary badge), and action buttons (edit/delete)
   - "Nueva Cabaña" button navigates to `admin-cabin-form` view
   - Edit button navigates to `admin-cabin-form` with cabin ID as `selectedItemId`
   - Delete uses AlertDialog confirmation dialog, then DELETEs via `/api/cabins/[id]`, invalidates query cache on success
   - Loading state with skeleton rows, error state with retry button, empty state with create CTA
   - "Ver sitio" button to navigate back to public cabins view
   - Clean admin layout with gray background, Card container

4. **Created Admin Cabin Form** (`src/components/admin/admin-cabin-form.tsx`)
   - "use client" component using react-hook-form with all required fields
   - Two modes: create (POST `/api/cabins`) and edit (fetch + PUT `/api/cabins/[id]`)
   - Sections organized: Información Básica, Precios, Capacidad, Listas, Ubicación, Políticas
   - Two-column layout where appropriate (name/slug, pricePerNight/priceRange, etc.)
   - Dynamic list fields with `useFieldArray` for images, amenities, highlights, rules
   - Auto-generates slug from name (with NFD normalization for Spanish characters)
   - Parses JSON strings when loading cabin data for edit mode, stringifies arrays on submit
   - Switch component for published toggle
   - Loading skeleton when fetching cabin data in edit mode
   - Save button with Loader2 spinner, Back/Cancel button
   - Toast success/error notifications via Sonner
   - All 22+ form fields covered as specified

5. **Updated Page Router** (`src/app/page.tsx`)
   - Added `admin-cabins` and `admin-cabin-form` to ViewRouter switch cases
   - Extended `isAdmin` check to include both new view types
   - Admin views hide Navbar and Footer for clean admin experience

### Files Modified/Created
- Modified: `src/lib/store.ts`
- Modified: `src/app/layout.tsx`
- Modified: `src/app/page.tsx`
- Created: `src/components/providers.tsx`
- Created: `src/components/admin/admin-cabins-list.tsx`
- Created: `src/components/admin/admin-cabin-form.tsx`

### Lint & Compilation
- ESLint: ✅ No errors
- Dev server: ✅ Compiles successfully
