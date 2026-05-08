"use client";

import { useNavigation } from "@/lib/store";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { VideoShowcase } from "@/components/home/video-showcase";
import { FeaturedPlans } from "@/components/home/featured-plans";
import { TravelCarousel } from "@/components/home/travel-carousel";
import { GroupTrips } from "@/components/home/group-trips";
import { CustomTrips } from "@/components/home/custom-trips";
import { Testimonials } from "@/components/home/testimonials";
import { PlansList } from "@/components/plans/plans-list";
import { PlanDetail } from "@/components/plans/plan-detail";
import { CabinsList } from "@/components/cabins/cabins-list";
import { CabinDetail } from "@/components/cabins/cabin-detail";
import { ContactSection } from "@/components/contact/contact-section";
import { PoliciesSection } from "@/components/policies/policies-section";
import { FavoritesSection } from "@/components/favorites/favorites-section";

function HomeView() {
  return (
    <>
      <HeroSection />
      <VideoShowcase />
      <FeaturedPlans />
      <TravelCarousel />
      <Testimonials />
      <GroupTrips />
      <CustomTrips />
    </>
  );
}

function ViewRouter() {
  const { currentView } = useNavigation();

  switch (currentView) {
    case "home":
      return <HomeView />;
    case "plans":
      return <PlansList />;
    case "plan-detail":
      return <PlanDetail />;
    case "cabins":
      return <CabinsList />;
    case "cabin-detail":
      return <CabinDetail />;
    case "contact":
      return <ContactSection />;
    case "policies":
      return <PoliciesSection />;
    case "favorites":
      return <FavoritesSection />;
    default:
      return <HomeView />;
  }
}

export default function HomePage() {
  const { currentView } = useNavigation();
  const isHome = currentView === "home";
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
