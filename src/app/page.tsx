"use client";

import { lazy, Suspense, useRef, useState, useEffect, type ReactNode } from "react";
import { useNavigation } from "@/lib/store";
import { usePrefetchData } from "@/hooks/use-prefetch-data";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { VideoShowcase } from "@/components/home/video-showcase";
import { FeaturedPlans } from "@/components/home/featured-plans";
import { TravelCarousel } from "@/components/home/travel-carousel";
import { GroupTrips } from "@/components/home/group-trips";
import { CustomTrips } from "@/components/home/custom-trips";
import { Testimonials } from "@/components/home/testimonials";

// Lazy load all non-home views — these are NOT needed on initial page load
const PlansList = lazy(() =>
  import("@/components/plans/plans-list").then((m) => ({ default: m.PlansList }))
);
const PlanDetail = lazy(() =>
  import("@/components/plans/plan-detail").then((m) => ({ default: m.PlanDetail }))
);
const CabinsList = lazy(() =>
  import("@/components/cabins/cabins-list").then((m) => ({ default: m.CabinsList }))
);
const CabinDetail = lazy(() =>
  import("@/components/cabins/cabin-detail").then((m) => ({ default: m.CabinDetail }))
);
const ContactSection = lazy(() =>
  import("@/components/contact/contact-section").then((m) => ({ default: m.ContactSection }))
);
const PoliciesSection = lazy(() =>
  import("@/components/policies/policies-section").then((m) => ({ default: m.PoliciesSection }))
);
const FavoritesSection = lazy(() =>
  import("@/components/favorites/favorites-section").then((m) => ({ default: m.FavoritesSection }))
);
const TeamSection = lazy(() =>
  import("@/components/team/team-section").then((m) => ({ default: m.TeamSection }))
);

/**
 * LazySection: Defers rendering children until the section is near the viewport.
 * Uses IntersectionObserver with rootMargin to start loading slightly before visible.
 * This saves initial render time by not mounting off-screen components.
 */
function LazySection({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Start loading 200px before entering viewport
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} style={{ contentVisibility: isVisible ? "visible" : "auto" }}>
      {isVisible ? children : <div className="min-h-[300px]" />}
    </div>
  );
}

function HomeView() {
  return (
    <>
      <HeroSection />
      <LazySection>
        <VideoShowcase />
      </LazySection>
      <LazySection>
        <FeaturedPlans />
      </LazySection>
      <LazySection>
        <TravelCarousel />
      </LazySection>
      <LazySection>
        <Testimonials />
      </LazySection>
      <LazySection>
        <GroupTrips />
      </LazySection>
      <LazySection>
        <CustomTrips />
      </LazySection>
    </>
  );
}

function ViewSkeleton() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-ocean border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ViewRouter() {
  const { currentView } = useNavigation();

  switch (currentView) {
    case "home":
      return <HomeView />;
    case "plans":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <PlansList />
        </Suspense>
      );
    case "plan-detail":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <PlanDetail />
        </Suspense>
      );
    case "cabins":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <CabinsList />
        </Suspense>
      );
    case "cabin-detail":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <CabinDetail />
        </Suspense>
      );
    case "contact":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <ContactSection />
        </Suspense>
      );
    case "policies":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <PoliciesSection />
        </Suspense>
      );
    case "team":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <TeamSection />
        </Suspense>
      );
    case "favorites":
      return (
        <Suspense fallback={<ViewSkeleton />}>
          <FavoritesSection />
        </Suspense>
      );
    default:
      return <HomeView />;
  }
}

export default function HomePage() {
  const { currentView } = useNavigation();
  const isHome = currentView === "home";

  // Prefetch plans & cabins data in background so navigation is instant
  usePrefetchData();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${isHome ? "" : "pt-16 sm:pt-20"}`}>
        <ViewRouter />
      </main>
      <Footer />
    </div>
  );
}
