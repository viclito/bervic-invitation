import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

// Reusable Skeleton Component for Lazy Loaded Sections
function SectionSkeleton({ height = "h-[400px]" }: { height?: string }) {
  return (
    <div className={`w-full ${height} bg-[#F8F3EA] flex items-center justify-center p-8`}>
      <div className="w-full max-w-[1200px] h-full rounded-3xl border border-[#D9A441]/20 bg-[#F4EBDB]/40 animate-pulse flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#D9A441] border-t-transparent animate-spin" />
      </div>
    </div>
  );
}

// Below the Fold Sections — Dynamic Imports with Skeletons
const AboutSection = dynamic(() => import("@/components/AboutSection"), {
  loading: () => <SectionSkeleton height="h-[600px]" />,
});

const StatsSection = dynamic(() => import("@/components/StatsSection"), {
  loading: () => <SectionSkeleton height="h-[450px]" />,
});

const TemplateCategories = dynamic(
  () => import("@/components/TemplateCategories"),
  {
    loading: () => <SectionSkeleton height="h-[800px]" />,
  }
);

const HowItWorks = dynamic(() => import("@/components/HowItWorks"), {
  loading: () => <SectionSkeleton height="h-[650px]" />,
});

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

      {/* Hero Section (Loaded immediately, priority) */}
      <Hero />

      {/* Lazy-Loaded Below the Fold Sections */}
      <AboutSection />
      <StatsSection />
      <TemplateCategories />
      <HowItWorks />
      <PricingSection />
      <FAQSection />
      <FinalCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
