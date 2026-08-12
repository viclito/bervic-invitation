import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuickStartDetailsWizard from "@/components/QuickStartDetailsWizard";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

// Reusable Skeleton Component for Lazy Loaded Sections
function SectionSkeleton({ height = "h-[400px]" }: { height?: string }) {
  return (
    <div className={`w-full ${height} bg-[#12100E] flex items-center justify-center p-8`}>
      <Skeleton className="w-full max-w-[1200px] h-full rounded-3xl border border-[#D9A441]/20 bg-[#1A1815]/40 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#D9A441] border-t-transparent animate-spin" />
      </Skeleton>
    </div>
  );
}

// Below the Fold Sections — Dynamic Imports with Skeletons
const PopularTemplatesShowcase = dynamic(() => import("@/components/PopularTemplatesShowcase"), {
  loading: () => <SectionSkeleton height="h-[750px]" />,
});

const CinematicShowcaseSection = dynamic(
  () => import("@/components/CinematicShowcaseSection"),
  {
    loading: () => <SectionSkeleton height="h-[750px]" />,
  }
);

const AboutSection = dynamic(() => import("@/components/AboutSection"), {
  loading: () => <SectionSkeleton height="h-[600px]" />,
});

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

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#F8F3EA] text-[#221C17] selection:bg-[#D9A441] selection:text-[#221C17]">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Interactive Quick-Start Details Collection Wizard (Upload or 1-to-3 Question Form) */}
      <QuickStartDetailsWizard />

      {/* 3D Coverflow Popular Invitation Templates Showcase */}
      <PopularTemplatesShowcase />

      {/* Dedicated Showcase Section for ₹2000 Cinematic Exclusive 480-Frame Template */}
      <CinematicShowcaseSection />

      {/* Lazy-Loaded Below the Fold Sections */}
      <AboutSection />
      {/* <HowItWorks /> */}
      <PricingSection />
      <FAQSection />
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
