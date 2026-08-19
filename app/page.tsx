import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

// Reusable Skeleton Component for Lazy Loaded Sections
function SectionSkeleton({ height = "h-[400px]", id }: { height?: string; id?: string }) {
  return (
    <div id={id} className={`w-full ${height} bg-white flex items-center justify-center p-8 scroll-mt-24`}>
      <Skeleton className="w-full max-w-[1200px] h-full rounded-3xl border border-slate-200 bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#991B1B] border-t-transparent animate-spin" />
      </Skeleton>
    </div>
  );
}

const QuickStartDetailsWizard = dynamic(
  () => import("@/components/QuickStartDetailsWizard"),
  {
    loading: () => <SectionSkeleton id="details-form" height="h-[600px]" />,
  }
);

// Below the Fold Sections — Dynamic Imports with Skeletons
const PopularTemplatesShowcase = dynamic(() => import("@/components/PopularTemplatesShowcase"), {
  loading: () => <SectionSkeleton height="h-[750px]" />,
});

const InstagramCardsSection = dynamic(
  () => import("@/components/InstagramCardsSection"),
  {
    loading: () => <SectionSkeleton height="h-[650px]" />,
  }
);

const CanvaStudioSection = dynamic(
  () => import("@/components/CanvaStudioSection"),
  {
    loading: () => <SectionSkeleton height="h-[650px]" />,
  }
);

// const HowItWorks = dynamic(() => import("@/components/HowItWorks"), {
//   loading: () => <SectionSkeleton height="h-[650px]" />,
// });

const PricingSection = dynamic(() => import("@/components/PricingSection"), {
  loading: () => <SectionSkeleton height="h-[700px]" />,
});

const FAQSection = dynamic(() => import("@/components/FAQSection"), {
  loading: () => <SectionSkeleton height="h-[550px]" />,
});

const FinalCTA = dynamic(() => import("@/components/FinalCTA"), {
  loading: () => <SectionSkeleton height="h-[500px]" />,
});

import AutoScrollToForm from "@/components/AutoScrollToForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#991B1B] selection:text-white">
      <AutoScrollToForm />
      {/* Sticky Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Interactive Quick-Start Details Collection Wizard (Upload or 1-to-3 Question Form) */}
      <QuickStartDetailsWizard />

      {/* 3D Coverflow Popular Invitation Templates Showcase */}
      <PopularTemplatesShowcase />

      {/* Dedicated Canva Studio Visual Editor Section */}
      <CanvaStudioSection />

      {/* Dedicated Instagram & WhatsApp Announcement Post Cards Showcase Section */}
      <InstagramCardsSection />

      {/* Lazy-Loaded Below the Fold Sections */}
      {/* <HowItWorks /> */}
      <PricingSection />
      <FAQSection />
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
