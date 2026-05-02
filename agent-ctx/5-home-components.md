# Task 5: Home Section Components

## Agent: Home Components Builder

## Summary
Created all 5 home section components for the Vive Travel website in `/home/z/my-project/src/components/home/`.

## Files Created

### 1. `hero-section.tsx`
- Full-width hero with auto-playing Embla carousel (5s interval)
- Uses `embla-carousel-autoplay` plugin directly with `useEmblaCarousel`
- Gradient overlay for text readability (from-black/70 via-black/30 to-black/10)
- Large title "Descubre el Atlántico" with gradient text (ocean-light to sand-light)
- Vive Travel branding with Palmtree/MapPin icons
- CTA buttons: "Ver Planes" (navigates to 'plans') and "Ver Cabañas" (navigates to 'cabins')
- Dot indicators and navigation arrows
- Caption display synced with current slide
- Framer Motion entrance animations

### 2. `featured-plans.tsx`
- Shows top 4 tour plans from data.ts
- Card design with: image, category badge (color-coded), rating overlay, duration, name, location, description, price
- Category color mapping: Naturaleza→palm, Playa→ocean, Aventura→sunset, Ecoturismo→palm-light, Experiencia→coral, Cultural→sand
- Hover effects: scale-110 on image, -translate-y-1 on card, shadow-xl
- "Ver todos los planes" CTA button
- Responsive grid: 1 col → 2 cols → 4 cols
- Framer Motion staggered entrance animations

### 3. `travel-carousel.tsx`
- Embla carousel showing pastTripImages (8 images)
- Responsive slides: 70% mobile → 45% tablet → 30% desktop
- Hover overlay with Camera icon + caption
- Always-visible caption badge (hides on hover)
- Navigation buttons with hover color change (white→ocean)
- Stats section: 500+ viajeros, 50+ viajes, 4.8 rating, 6 destinos
- SectionHeader: "Viajes Realizados" / "Nuestros viajeros ya lo vivieron"

### 4. `group-trips.tsx`
- Ocean gradient background (from-ocean via-ocean-dark to-ocean)
- Decorative circle pattern overlay
- Two-column layout: content left, benefit cards right
- Benefits: Descuentos grupales, Itinerarios flexibles, Experiencias compartidas, Atención personalizada
- Quick stats: 20% descuento, 8+ personas, 24h respuesta
- Two CTAs: "Solicitar cotización" (→contact) and "Ver planes disponibles" (→plans)
- Glassmorphism benefit cards with hover effects

### 5. `custom-trips.tsx`
- Warm sunset gradient background
- Benefits: Flexibilidad total, Expertos locales, Mejores precios
- Each benefit has unique icon color (sunset, palm, ocean)
- Large CTA card with sunset-to-coral gradient
- Decorative circle elements
- CTAs: "Contáctanos" (→contact) and "Ver planes" (→plans)
- Responsive layout with proper mobile-first design

## Key Implementation Details
- All components use `"use client"` directive
- All use `useNavigation` from `@/lib/store` for navigation
- All use framer-motion with `whileInView` and `viewport={{ once: true }}`
- All use lucide-react icons
- All are fully responsive (mobile-first with sm/md/lg breakpoints)
- All use shadcn/ui components (Card, Badge, Button)
- Custom Tailwind theme colors used: ocean, ocean-light, ocean-dark, sand, sand-light, sunset, sunset-light, coral, palm, palm-light
- Lint passes with no errors
