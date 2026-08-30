"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { templatesRegistry } from "@/data/templatesRegistry";
import TemplateCardGraphic from "@/components/templates/TemplateCardGraphic";
import { Search, ExternalLink, Sparkles, Crown, Globe, Check, MessageCircle, Edit3 } from "lucide-react";

import TemplateGallerySkeleton from "@/components/skeletons/TemplateGallerySkeleton";
import MakeItYoursModal from "@/components/templates/MakeItYoursModal";

function TemplateGalleryContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category");
  const viewedParam = searchParams.get("viewed");

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedSlug] = useState<string | null>(viewedParam);
  const [myInvitations, setMyInvitations] = useState<any[]>([]);

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

    fetch("/api/invitations/my-invitations")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.invitations)) {
          setMyInvitations(data.invitations);
        }
      })
      .catch(() => setMyInvitations([]));
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

  const handleMakeItYoursClick = (tpl: (typeof templatesRegistry)[0]) => {
    if (status !== "authenticated" || !session) {
      const returnUrl = `/templates/${tpl.slug}`;
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    setSelectedTemplateForModal({
      slug: tpl.slug,
      title: tpl.title,
      isPremium: Boolean(tpl.isCinematicExclusive || tpl.slug === "scroll-scrubber"),
      price: tpl.isCinematicExclusive || tpl.slug === "scroll-scrubber" ? 2000 : 599,
    });
  };

  const [profiles, setProfiles] = useState<{ id?: string; eventType?: string }[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    fetch("/api/user/event-draft?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.profiles)) {
          setProfiles(data.profiles);
          const hasWedding = data.profiles.some((p: { eventType?: string }) => !p.eventType || p.eventType.toUpperCase() === "WEDDING");
          const hasBday = data.profiles.some((p: { eventType?: string }) => p.eventType && p.eventType.toUpperCase() === "BIRTHDAY");
          if (hasBday && !hasWedding && (!categoryParam || categoryParam === "all")) {
            setSelectedCategory("birthday");
          }
        }
      })
      .catch((err) => console.error("Error fetching profiles:", err))
      .finally(() => setLoadingProfiles(false));
  }, [categoryParam]);

  const categories = [
    { id: "all", label: "✨ All Templates" },
    { id: "wedding", label: "💒 Weddings" },
    { id: "birthday", label: "🎂 Birthdays" },
    { id: "cinematic", label: "👑 Premium Cinematic" },
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
    // Filter by selected category pill
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

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16">
        {/* Header Title and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-serif">
              Explore Templates
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Select any design below to preview live with your personalized details
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search designs, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#991B1B] text-slate-900 transition-colors"
            />
          </div>
        </div>

        {/* ── Owned Products Banner (Shown if User Has Purchased / Activated Templates) ── */}
        {myInvitations.length > 0 && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-50 via-white to-amber-50/60 border border-red-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#991B1B] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {myInvitations.length === 1
                      ? "You Own 1 Active Invitation Website"
                      : `You Own ${myInvitations.length} Active Invitation Websites`}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wide">
                    Owned
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {myInvitations.length === 1
                    ? `Your live wedding suite "${myInvitations[0].partnerOne || 'Event'} & ${myInvitations[0].partnerTwo || ''}" is active and published.`
                    : "Manage your customized invitation websites, guest RSVPs, and downloads."}
                </p>
              </div>
            </div>

            {myInvitations.length === 1 ? (() => {
              const primaryInv = myInvitations[0];
              const coupleNameStr = `${primaryInv.partnerOne || "Our Wedding"} ${primaryInv.partnerTwo ? `& ${primaryInv.partnerTwo}` : ""}`.trim();
              const origin = typeof window !== "undefined" ? window.location.origin : "https://bervic.com";
              const inviteUrl = `${origin}/invitations/${primaryInv.slug}`;
              const whatsappText = encodeURIComponent(
                `✨ You are cordially invited to celebrate with ${coupleNameStr}!\n\nView our wedding invitation suite, schedule & venue details here:\n👉 ${inviteUrl}`
              );
              const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;

              return (
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                  {/* Edit Button */}
                  <Link
                    href="/dashboard"
                    className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-xs border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-none cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit</span>
                  </Link>

                  {/* Send on WhatsApp Button */}
                  <Link
                    href={`/dashboard/invite-whatsapp/${primaryInv.id}`}
                    className="px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-none cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Send on WhatsApp</span>
                  </Link>

                  {/* View Live */}
                  <Link
                    href={`/invitations/${primaryInv.slug}`}
                    className="px-4 py-2.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs flex-1 sm:flex-none cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-amber-200" />
                    <span>View Live ↗</span>
                  </Link>
                </div>
              );
            })() : (
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                <Link
                  href="/dashboard"
                  className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-none"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit</span>
                </Link>

                <Link
                  href={`/dashboard/invite-whatsapp/${myInvitations[0].id}`}
                  className="px-3.5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all flex-1 sm:flex-none cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Send on WhatsApp</span>
                </Link>

                <Link
                  href="/dashboard?tab=invitations"
                  className="px-4 py-2.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs flex-1 sm:flex-none"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>View All ({myInvitations.length}) ↗</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6 border-b border-slate-100">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === tab.id
                  ? "bg-[#991B1B] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Templates Grid Display */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200 p-8">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No templates found</h3>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or filter</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#991B1B] text-white text-xs font-bold hover:bg-[#7F1D1D] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredTemplates.map((tpl) => {
              const isViewed = highlightedSlug === tpl.slug;
              const ownedInvitation = myInvitations.find(
                (inv) =>
                  inv.templateSlug === tpl.slug ||
                  (tpl.slug === "scroll-scrubber" && inv.templateSlug === "scroll-scrubber") ||
                  (tpl.slug === "premium-scroll" && inv.templateSlug === "premium-scroll")
              );
              const isOwned = Boolean(ownedInvitation);

              return (
                <div
                  key={tpl.id}
                  id={`template-card-${tpl.slug}`}
                  className={`flex flex-col group transition-all duration-300 bg-white rounded-2xl p-2 sm:p-3 border relative ${
                    isOwned
                      ? "border-2 border-emerald-600/80 ring-4 ring-emerald-100 shadow-md scale-[1.01]"
                      : isViewed
                      ? "border-2 border-[#991B1B] ring-4 ring-red-100 shadow-lg scale-[1.02]"
                      : "border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300"
                  }`}
                >
                  {/* Badge for Owned vs Premium vs Recently Viewed */}
                  {isOwned ? (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-[9px] font-extrabold uppercase tracking-widest shadow-md border border-emerald-400 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-white" />
                      <span>Owned ✓</span>
                    </div>
                  ) : tpl.isCinematicExclusive || tpl.slug === "scroll-scrubber" ? (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-2.5 py-0.5 rounded-full bg-[#070707] text-[#D9A441] text-[9px] font-extrabold uppercase tracking-widest shadow-md border border-[#D9A441] flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 fill-current text-[#D9A441]" />
                      <span>Premium</span>
                    </div>
                  ) : isViewed ? (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-2.5 py-0.5 rounded-full bg-[#991B1B] text-white text-[9px] font-extrabold uppercase tracking-widest shadow-md border border-red-300 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 fill-current text-white" />
                      <span>Last Viewed</span>
                    </div>
                  ) : null}

                  {/* ── Card Graphic Container (Clicking goes to Live Preview or Owned Product) ── */}
                  <div
                    onClick={() => {
                      if (isOwned && ownedInvitation?.slug) {
                        router.push(`/invitations/${ownedInvitation.slug}`);
                      } else {
                        router.push(`/templates/${tpl.slug}`);
                      }
                    }}
                    className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer block group-hover:scale-[1.02] transition-transform duration-300"
                    style={{
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                      border: "1px solid rgba(217,200,138,0.4)",
                    }}
                    title={isOwned ? "Click to open your live owned invitation" : "Click to view live preview"}
                  >
                    <TemplateCardGraphic template={tpl} />
                  </div>

                  {/* ── Card Title Below Graphic ── */}
                  <div
                    onClick={() => {
                      if (isOwned && ownedInvitation?.slug) {
                        router.push(`/invitations/${ownedInvitation.slug}`);
                      } else {
                        router.push(`/templates/${tpl.slug}`);
                      }
                    }}
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

                    {isOwned && ownedInvitation ? (
                      <button
                        type="button"
                        onClick={() => router.push(`/invitations/${ownedInvitation.slug}`)}
                        className="py-2 px-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 shadow-sm hover:scale-[1.01] transition-transform whitespace-nowrap cursor-pointer"
                        title="Open your owned active invitation"
                      >
                        <Globe className="w-3 h-3 text-white shrink-0" />
                        <span>View Yours ↗</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleMakeItYoursClick(tpl)}
                        className="btn-maroon py-2 px-1.5 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 shadow-sm hover:scale-[1.01] transition-transform whitespace-nowrap cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#D9A441] shrink-0" />
                        <span>Make It Yours</span>
                      </button>
                    )}
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
