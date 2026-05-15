// ─── Site Content Types ──────────────────────────────────────────────────────
// All editable text content for the website, organized by section.
// Stored as JSON in the SiteContent table (key = section name).

export interface HeroContent {
  brandLabel: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  ctaPlans: string;
  ctaCabins: string;
}

export interface FeaturedPlansContent {
  title: string;
  subtitle: string;
  priceLabel: string;
  viewMore: string;
  viewAll: string;
}

export interface CarouselContent {
  title: string;
  subtitle: string;
  brandHover: string;
  stats: Array<{ value: string; label: string }>;
}

export interface TestimonialsContent {
  title: string;
  subtitle: string;
}

export interface GroupTripsContent {
  label: string;
  title: string;
  titleHighlight: string;
  description: string;
  ctaQuote: string;
  ctaPlans: string;
  benefits: Array<{ title: string; description: string }>;
  stats: Array<{ value: string; label: string }>;
}

export interface CustomTripsContent {
  label: string;
  title: string;
  titleHighlight: string;
  description: string;
  benefits: Array<{ title: string; description: string }>;
  ctaTitle: string;
  ctaDescription: string;
  ctaContact: string;
  ctaPlans: string;
}

export interface ContactContent {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  formTitle: string;
  whatsapp: string;
  email: string;
  location: string;
  hours: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl: string;
  socialLabel: string;
  chatTitle: string;
  chatDescription: string;
  chatButton: string;
}

export interface PolicyItem {
  id: string;
  title: string;
  content: string; // Markdown
}

export interface PoliciesContent {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  bookingTitle: string;
  bookingSubtitle: string;
  cancellationTitle: string;
  cancellationSubtitle: string;
  footerText: string;
  lastUpdate: string;
  bookingPolicies: PolicyItem[];
  cancellationPolicies: PolicyItem[];
}

export interface FooterContent {
  brandName: string;
  brandSub: string;
  description: string;
  instagramUrl: string;
  facebookUrl: string;
  whatsappUrl: string;
  exploreTitle: string;
  contactTitle: string;
  phone: string;
  email: string;
  location: string;
  helpTitle: string;
  helpDescription: string;
  chatButton: string;
  copyright: string;
  madeWith: string;
}

export interface NavbarContent {
  brandName: string;
  brandSub: string;
  navItems: Array<{ key: string; label: string }>;
  ctaButton: string;
  ctaButtonMobile: string;
}

export interface PlansListContent {
  title: string;
  subtitle: string;
  emptyState: string;
  viewAll: string;
}

export interface CabinsListContent {
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyDescription: string;
  contactButton: string;
}

export interface SiteContentData {
  hero: HeroContent;
  featuredPlans: FeaturedPlansContent;
  carousel: CarouselContent;
  testimonials: TestimonialsContent;
  groupTrips: GroupTripsContent;
  customTrips: CustomTripsContent;
  contact: ContactContent;
  policies: PoliciesContent;
  footer: FooterContent;
  navbar: NavbarContent;
  plansList: PlansListContent;
  cabinsList: CabinsListContent;
}

export type SectionKey = keyof SiteContentData;
