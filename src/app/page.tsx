"use client";

import { useNavigation } from "@/lib/store";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
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
import { AdminPlansList } from "@/components/admin/admin-plans-list";
import { AdminPlanForm } from "@/components/admin/admin-plan-form";
import { AdminCabinsList } from "@/components/admin/admin-cabins-list";
import { AdminCabinForm } from "@/components/admin/admin-cabin-form";

function HomeView() {
  return (
    <>
      <HeroSection />
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
    case "admin-plans":
      return <AdminPlansList />;
    case "admin-plan-form":
      return <AdminPlanForm />;
    case "admin-cabins":
      return <AdminCabinsList />;
    case "admin-cabin-form":
      return <AdminCabinForm />;
    default:
      return <HomeView />;
  }
}

export default function HomePage() {
  const { currentView } = useNavigation();
  const isHome = currentView === "home";
  const isAdmin = currentView === "admin-plans" || currentView === "admin-plan-form" || currentView === "admin-cabins" || currentView === "admin-cabin-form";

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar />}
      <main className={`flex-1 ${isHome ? "" : isAdmin ? "" : "pt-16 sm:pt-20"}`}>
        <ViewRouter />
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
