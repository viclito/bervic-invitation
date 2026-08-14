"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { templatesRegistry } from "@/data/templatesRegistry";
import TemplateCardGraphic from "@/components/templates/TemplateCardGraphic";
import { Search, ExternalLink, Palette, Sparkles } from "lucide-react";

import { useRequireLoginAndDetails } from "@/lib/useRequireLoginAndDetails";
import TemplateGallerySkeleton from "@/components/skeletons/TemplateGallerySkeleton";
import MakeItYoursModal from "@/components/templates/MakeItYoursModal";

function TemplateGalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, hasCompletedDetails } = useRequireLoginAndDetails("/templates");

  const categoryParam = searchParams.get("category");
  const viewedParam = searchParams.get("viewed");

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedSlug] = useState<string | null>(viewedParam);

  const [selectedTemplateForModal, setSelectedTemplateForModal] = useState<{
    slug: string;
    title: string;
    isPremium: boolean;
    price: number;
  } | null>(null);

  const [subData, setSubData] = useState<{
    plan?: string;
    isActive?: boolean;
    remainingTemplateSlots?: number;
    remainingCinematicSlots?: number;
    hasCinematicPass?: boolean;
  } | null>(null);

  useEffect(() => {
    fetch("/api/user/subscription")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSubData({
            plan: data.plan || data.subscription?.plan || "NONE",
            isActive: Boolean(data.isActive || data.subscription?.isActive),
            remainingTemplateSlots: data.remainingTemplateSlots ?? 0,
            remainingCinematicSlots: data.remainingCinematicSlots ?? 0,
            hasCinematicPass: Boolean(data.hasCinematicPass || (data.remainingCinematicSlots ?? 0) > 0),
          });
        }
      })
      .catch(() => setSubData(null));
  }, []);

  const handleActivateTemplate = async () => {
    if (!selectedTemplateForModal) return;
    const res = await fetch("/api/user/event-draft/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateSlug: selectedTemplateForModal.slug }),
    });
    const data = await res.json();
    if (data.success) {
      const targetSlug = data.slug || data.invitation?.slug;
      if (targetSlug) {
        router.push(`/invitations/${targetSlug}`);
      } else {
        router.push("/dashboard");
      }
    } else {
      throw new Error(data.message || "Failed to activate template.");
    }
  };

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "cinematic", label: "🎬 Cinematic (₹2000 Exclusive)" },
    { id: "wedding", label: "Weddings" },
  ];

  // Scroll to last viewed template if specified
  useEffect(() => {
    if (viewedParam) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`template-card-${viewedParam}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [viewedParam]);

  const filteredTemplates = templatesRegistry.filter((tpl) => {
    // Hide non-wedding categories for now
    if (["birthday", "religious", "anniversary"].includes(tpl.category)) {
      return false;
    }
    const matchesCategory =
      selectedCategory === "all"
        ? true
        : selectedCategory === "cinematic"
        ? tpl.isCinematicExclusive || tpl.slug === "scroll-scrubber"
        : tpl.category === selectedCategory;
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.styleTag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading || !hasCompletedDetails) {
    return <TemplateGallerySkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5EEE0" }}>
      <Navbar />

      {/* ── Hero Header ── */}
      <section className="pt-36 pb-10 text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/60 bg-white/60 text-[#7A6520] text-[11px] font-semibold uppercase tracking-widest mb-6 shadow-sm">
          <Palette className="w-3.5 h-3.5" />
          <span>Design Library</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-[56px] font-bold tracking-tight text-[#1A1410] leading-tight">
          Select Your{" "}
          <span
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
              color: "#C9A84C",
              fontStyle: "italic",
              fontWeight: 700,
            }}
          >
            Invitation Template
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#1A1410]/65 max-w-md mx-auto leading-relaxed">
          Choose from our curated collection, personalize details, and create stunning
          invitations for any occasion.
        </p>

        {/* Search Bar */}
        <div className="mt-7 max-w-sm mx-auto relative">
          <Search className="w-4 h-4 text-[#8B7345] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-[#D9C88A]/50 text-sm text-[#1A1410] placeholder-[#A89060] focus:outline-none focus:border-[#C9A84C] shadow-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border ${
                selectedCategory === cat.id
                  ? "bg-[#7A1F2B] text-white border-[#7A1F2B] shadow-sm"
                  : "bg-white text-[#1A1410]/70 border-[#D9C88A]/50 hover:border-[#C9A84C] hover:text-[#1A1410]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Templates Grid ── */}
      <main className="flex-1 max-w-[1380px] mx-auto px-4 sm:px-6 pb-20 w-full">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#D9C88A]/30 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#1A1410]">No templates found</h3>
            <p className="text-sm text-[#1A1410]/60 mt-1">
              Try clearing your search query or selecting a different category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="btn-maroon mt-4 px-6 py-2.5 text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredTemplates.map((tpl) => {
              const isViewed = highlightedSlug === tpl.slug;
              return (
                <div
                  key={tpl.id}
                  id={`template-card-${tpl.slug}`}
                  className={`flex flex-col group transition-all duration-300 bg-white rounded-2xl p-2 sm:p-3 border relative ${
                    isViewed
                      ? "border-2 border-[#7A1F2B] ring-4 ring-[#7A1F2B]/20 shadow-lg scale-[1.02]"
                      : "border-[#D9C88A]/40 shadow-sm hover:shadow-md hover:border-[#D9A441]"
                  }`}
                >
                  {/* Badge for Cinematic Exclusive vs Recently Viewed */}
                  {tpl.isCinematicExclusive || tpl.slug === "scroll-scrubber" ? (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-2.5 py-0.5 rounded-full bg-[#070707] text-[#D9A441] text-[9px] font-extrabold uppercase tracking-widest shadow-md border border-[#D9A441] flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 fill-current text-[#D9A441]" />
                      <span>₹2000 Cinematic Exclusive</span>
                    </div>
                  ) : isViewed ? (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-2.5 py-0.5 rounded-full bg-[#7A1F2B] text-[#D9A441] text-[9px] font-extrabold uppercase tracking-widest shadow-md border border-[#D9A441] flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 fill-current text-[#D9A441]" />
                      <span>Last Viewed</span>
                    </div>
                  ) : null}

                  {/* ── Card Graphic Container (Clicking goes to Live Preview) ── */}
                  <div
                    onClick={() => router.push(`/templates/${tpl.slug}`)}
                    className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer block group-hover:scale-[1.02] transition-transform duration-300"
                    style={{
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                      border: "1px solid rgba(217,200,138,0.4)",
                    }}
                    title="Click to view live preview"
                  >
                    <TemplateCardGraphic template={tpl} />
                  </div>

                  {/* ── Card Title Below Graphic ── */}
                  <div
                    onClick={() => router.push(`/templates/${tpl.slug}`)}
                    className="text-xs sm:text-sm font-bold text-[#1A1410] mt-2 px-0.5 leading-tight line-clamp-1 cursor-pointer group-hover:text-[#7A1F2B] transition-colors"
                  >
                    {tpl.title}
                  </div>

                  {/* ── Text Format Action Buttons Below Image ── */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-3 pt-2 border-t border-[#D9C88A]/30">
                    <button
                      type="button"
                      onClick={() => router.push(`/templates/${tpl.slug}`)}
                      className="py-2 px-1.5 rounded-xl border border-[#D9A441]/60 bg-[#F8F3EA] text-[#221C17] text-[11px] sm:text-xs font-semibold hover:bg-[#D9A441]/20 transition-all flex items-center justify-center gap-1 shadow-sm whitespace-nowrap"
                    >
                      <ExternalLink className="w-3 h-3 text-[#7A1F2B] shrink-0" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedTemplateForModal({
                          slug: tpl.slug,
                          title: tpl.title,
                          isPremium: Boolean(tpl.isCinematicExclusive || tpl.slug === "scroll-scrubber"),
                          price: tpl.isCinematicExclusive || tpl.slug === "scroll-scrubber" ? 2000 : 599,
                        })
                      }
                      className="btn-maroon py-2 px-1.5 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 shadow-sm hover:scale-[1.01] transition-transform whitespace-nowrap"
                    >
                      <Sparkles className="w-3 h-3 text-[#D9A441] shrink-0" />
                      <span>Make It Yours</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedTemplateForModal && (
        <MakeItYoursModal
          isOpen={Boolean(selectedTemplateForModal)}
          onClose={() => setSelectedTemplateForModal(null)}
          templateSlug={selectedTemplateForModal.slug}
          templateTitle={selectedTemplateForModal.title}
          isPremium={selectedTemplateForModal.isPremium}
          price={selectedTemplateForModal.price}
          userSubscription={subData}
          onConfirmActivate={handleActivateTemplate}
        />
      )}

      <Footer />
    </div>
  );
}

export default function TemplateGalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5EEE0]" />}>
      <TemplateGalleryContent />
    </Suspense>
  );
}
