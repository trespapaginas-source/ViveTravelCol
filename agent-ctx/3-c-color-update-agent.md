# Task 3-c: Update Plans Components with New Teal/Sage Color Palette

## Summary
Updated both `plans-list.tsx` and `plan-detail.tsx` to use the new teal/sage/amber/sand color palette, replacing all old ocean/sunset/palm/coral color references.

## Changes Made

### `/home/z/my-project/src/components/plans/plans-list.tsx`
- **categoryColors map**: `palm→sage`, `ocean→teal`, `sunset→amber`, `palm-light→sage-light`, `coral→sand-dark`
- **difficultyColors map**: `palm→sage`, `sunset→amber`, `coral→sand-dark`
- Card hover border: `hover:border-ocean/30` → `hover:border-teal/30`
- Fallback category color: `bg-ocean` → `bg-teal`
- Price text: `text-ocean` → `text-teal`
- Title hover: `group-hover:text-ocean` → `group-hover:text-teal`
- Star rating: `fill-sunset text-sunset` → `fill-amber text-amber`
- Clock icon: `text-ocean` → `text-teal`
- Map pin: `text-coral` → `text-sand-dark`

### `/home/z/my-project/src/components/plans/plan-detail.tsx`
- **categoryColors map**: `palm→sage`, `ocean→teal`, `sunset→amber`, `palm-light→sage-light`, `coral→sand-dark`
- **difficultyColors map**: `palm→sage`, `sunset→amber`, `coral→sand-dark`
- StarRating: `fill-sunset text-sunset` → `fill-amber text-amber`
- InfoItem default color: `text-ocean` → `text-teal`
- Fallback category color: `bg-ocean` → `bg-teal`
- MapPin icon: `text-coral` → `text-sand-dark`
- Clock/Calendar InfoItems: `color="text-ocean"` → `color="text-teal"`
- Users InfoItem: `color="text-palm"` → `color="text-sage"`
- Mountain InfoItem: `color="text-sunset"` → `color="text-amber"`
- Includes section: `bg-palm/15` → `bg-sage/15`, `text-palm` → `text-sage`
- Excludes section: `bg-coral/15` → `bg-sand-dark/15`, `text-coral` → `text-sand-dark`
- Highlights section: `bg-sunset/15` → `bg-amber/15`, `text-sunset` → `text-amber`
- Reservar button: `bg-ocean hover:bg-ocean-dark` → `bg-teal hover:bg-teal-dark`
- WhatsApp button: `border-palm/40 text-palm hover:bg-palm/10` → `border-sage/40 text-sage hover:bg-sage/10`
- Sticky card Clock: `text-ocean` → `text-teal`
- Sticky card Star: `text-sunset fill-amber` → `text-amber fill-amber`
- Navigation InfoItem: `text-coral` → `text-sand-dark`

## Verification
- Grep search confirmed zero remaining `ocean`, `sunset`, `palm`, or `coral` references in the plans components
- No functionality changes — only CSS class name updates
