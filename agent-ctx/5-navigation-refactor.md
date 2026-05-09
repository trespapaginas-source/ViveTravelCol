Task ID: 5
Agent: Navigation Refactor
Task: Update all public-facing components to use Next.js router instead of Zustand's useNavigation

Work Log:
- Read all 10 target files to understand current useNavigation usage
- Identified that contact-section.tsx and policies-section.tsx do NOT use useNavigation (no changes needed)
- Updated 8 files with the following pattern:
  1. Removed `import { useNavigation } from "@/lib/store"`
  2. Added `import { useRouter } from "next/navigation"`
  3. Replaced `const { navigate } = useNavigation()` with `const router = useRouter()`
  4. Replaced all `navigate()` calls with `router.push()` per the navigation mapping

Navigation mapping applied:
- `navigate("home")` → `router.push("/")`
- `navigate("plans")` → `router.push("/planes")`
- `navigate("plan-detail", planId)` → `router.push(`/planes/${planId}`)`
- `navigate("cabins")` → `router.push("/cabanas")`
- `navigate("cabin-detail", cabinId)` → `router.push(`/cabanas/${cabinId}`)`
- `navigate("contact")` → `router.push("/contacto")`
- `navigate("contact", planId)` → `router.push("/contacto")`
- `navigate("policies")` → `router.push("/politicas")`

Special handling for detail components:
- **plan-detail.tsx**: Added `params` prop of type `Promise<{ id: string }>`, used `React.use(params)` to unwrap, replaced `selectedItemId` with `planId` from params
- **cabin-detail.tsx**: Same pattern as plan-detail.tsx, replaced `selectedItemId` with `cabinId` from params. Also updated nested `PriceCard` component to use `useRouter` instead of `useNavigation`

Files changed (8):
1. src/components/home/hero-section.tsx - 2 navigate calls → router.push
2. src/components/home/featured-plans.tsx - 2 navigate calls → router.push
3. src/components/home/group-trips.tsx - 2 navigate calls → router.push
4. src/components/home/custom-trips.tsx - 2 navigate calls → router.push
5. src/components/plans/plans-list.tsx - 1 navigate call via handleNavigate → router.push
6. src/components/plans/plan-detail.tsx - 3 navigate calls + selectedItemId → params prop + router.push
7. src/components/cabins/cabins-list.tsx - 2 navigate calls → router.push
8. src/components/cabins/cabin-detail.tsx - 3 navigate calls + selectedItemId → params prop + router.push (including PriceCard)

Files unchanged (2):
9. src/components/contact/contact-section.tsx - no useNavigation usage
10. src/components/policies/policies-section.tsx - no useNavigation usage

Lint: passes cleanly
Dev server: running correctly on port 3000
