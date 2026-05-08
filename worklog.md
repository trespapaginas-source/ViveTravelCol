---
Task ID: 1
Agent: Main Agent
Task: Fix all bugs, failures, and inconsistencies in the Vive Travel website

Work Log:
- Audited entire codebase (20+ component files, store, API, data, favorites)
- Identified 8 major bugs/inconsistencies
- FIX 1: Removed difficulty filter from filter-panel.tsx (buildPlanFilters and filterPlans still referenced difficulty after user requested removal)
- FIX 2: Changed PlanDetail sticky card from `top-6` to `top-24` (was hidden behind 64-80px fixed navbar)
- FIX 3: Added loading skeletons to PlansList, FeaturedPlans, CabinsList (previously showed blank screen while data loaded)
- FIX 4: Added ShareDialog + Heart (favorite) button to PlanDetail (was missing, inconsistent with CabinDetail)
- FIX 5: Added Heart favorite button to PlanCard in PlansList (only cabins had favorites before)
- FIX 6: Replaced Rick Roll YouTube URL with blank placeholder in video-showcase.tsx
- FIX 7: Fixed formatPrice in PlansList to use Intl currency format (was inconsistent with FeaturedPlans)
- FIX 8: Fixed both PlanDetail and CabinDetail top padding for fixed navbar (pt-4 → pt-20 sm:pt-24)
- FIX 9: Rewrote FavoritesSection to support both plans AND cabins (was cabin-only)
- Fixed React hooks rules-of-hooks violations (hooks were called after conditional returns in PlansList and CabinsList)
- All changes pass lint check cleanly

Stage Summary:
- 8 major bugs fixed, 0 lint errors
- Plans now have full feature parity with cabins (favorites, share, loading states)
- Detail pages no longer hidden behind navbar
- Consistent price formatting across all components
- Favorites section now displays both plan and cabin favorites with type badges
