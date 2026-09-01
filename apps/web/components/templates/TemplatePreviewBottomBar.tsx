"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, ArrowRight, Edit3, Sparkles, LayoutGrid, Globe, Crown, Check, Video, X } from "lucide-react";
import MakeItYoursModal from "./MakeItYoursModal";
import { templatesRegistry } from "@/data/templatesRegistry";

interface TemplatePreviewBottomBarProps {
  slug: string;
  templateTitle?: string;
  isPremium?: boolean;
  price?: number;
  categoryParam?: string;
  displayData?: any;
}

export default function TemplatePreviewBottomBar({
  slug,
  templateTitle,
  isPremium,
  price,
  categoryParam = "wedding",
  displayData,
}: TemplatePreviewBottomBarProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkingSubscription, setCheckingSubscription] = useState(false);
  const [userSubscription, setUserSubscription] = useState<any>(null);
  const [myInvitations, setMyInvitations] = useState<any[]>([]);
  const [videoBannerDismissed, setVideoBannerDismissed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("bervic_preview_video_banner_dismissed") === "true";
    }
    return false;
  });

  const isVideoActive = Boolean(
    displayData?.showVideoSection ||
    displayData?.loveStoryVideoUrl ||
    displayData?.videoUrl
  );

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/invitations/my-invitations")
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.invitations)) {
            setMyInvitations(data.invitations);
          }
        })
        .catch(() => setMyInvitations([]));
    }
  }, [status]);

  // Determine current template and its exact category
  const targetTemplate =
    templatesRegistry.find((t) => t.slug === slug) ||
    templatesRegistry.find((t) => t.category === categoryParam) ||
    templatesRegistry[0];

  const currentCategory = targetTemplate?.category || categoryParam || "wedding";

  // Filter templates list by current category (e.g. birthday templates cycle circularly within birthday templates, wedding within wedding)
  const categoryTemplates = templatesRegistry.filter((t) => {
    if (currentCategory === "birthday") return t.category === "birthday";
    if (currentCategory === "religious") return t.category === "religious";
    if (currentCategory === "anniversary") return t.category === "anniversary";
    return t.category === "wedding" || !["birthday", "religious", "anniversary"].includes(t.category);
  });

  const activeTemplates = categoryTemplates.length > 0
    ? categoryTemplates
    : templatesRegistry.filter((t) => t.category === "wedding");

  const currentIndex = activeTemplates.findIndex((t) => t.slug === slug);
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;

  const prevIndex = (safeCurrentIndex - 1 + activeTemplates.length) % activeTemplates.length;
  const nextIndex = (safeCurrentIndex + 1) % activeTemplates.length;

  const prevTemplate = activeTemplates[prevIndex];
  const nextTemplate = activeTemplates[nextIndex];

  const prevSlug = prevTemplate ? prevTemplate.slug : activeTemplates[0].slug;
  const nextSlug = nextTemplate ? nextTemplate.slug : activeTemplates[0].slug;

  const resolvedTitle = templateTitle || targetTemplate?.title || "Invitation Template";
  const resolvedIsPremium = Boolean(
    targetTemplate?.isCinematicExclusive || slug === "scroll-scrubber"
  );
  const resolvedPrice = price || targetTemplate?.price || (resolvedIsPremium ? 2000 : 599);

  const matchingOwnedInv = myInvitations.find(
    (inv) =>
      inv.templateSlug === slug ||
      (slug === "scroll-scrubber" && inv.templateSlug === "scroll-scrubber") ||
      (slug === "premium-scroll" && inv.templateSlug === "premium-scroll")
  );
  const isTemplateOwned = Boolean(matchingOwnedInv);

  const handleEditEventDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    const eventType = currentCategory === "birthday" ? "BIRTHDAY" : "WEDDING";
    const editUrl = `/dashboard/event-profile?eventType=${eventType}&returnToTemplate=${slug}`;
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(editUrl)}`);
    } else {
      router.push(editUrl);
    }
  };

  const handleMakeItYoursClick = async () => {
    if (status !== "authenticated" || !session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/templates/${slug}`)}`);
      return;
    }

    setCheckingSubscription(true);

    try {
      const res = await fetch("/api/user/subscription");
      const subData = await res.json();
      setUserSubscription(subData);

      const isActive = subData.isActive ?? false;
      const isAdmin = session?.user?.email?.toLowerCase() === "berglin1998@gmail.com";

      if (resolvedIsPremium) {
        const remainingSlots = subData.remainingCinematicSlots ?? 0;
        const hasPaidPass = subData.plan === "CINEMATIC_2000" || subData.hasCinematicPass || remainingSlots > 0;
        const canOwn = isAdmin || (isActive && hasPaidPass);

        if (!canOwn) {
          router.push(`/checkout?plan=CINEMATIC_2000&template=${slug}`);
        } else {
          setIsModalOpen(true);
        }
      } else {
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching user subscription:", err);
      if (resolvedIsPremium) {
        router.push(`/checkout?plan=CINEMATIC_2000&template=${slug}`);
      } else {
        setIsModalOpen(true);
      }
    } finally {
      setCheckingSubscription(false);
    }
  };

  const handleConfirmActivate = async () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bervic_active_template_slug", slug);
    }

    try {
      // 1. First claim / activate template using event draft activate endpoint
      const activateRes = await fetch("/api/user/event-draft/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateSlug: slug }),
      });
      const activateData = await activateRes.json();

      if (activateData.success) {
        setIsModalOpen(false);
        const targetSlug = activateData.slug || activateData.invitation?.slug;
        if (targetSlug) {
          const cleanSlug = targetSlug.trim().replace(/[\s%20]+/g, "-");
          router.push(`/invitations/${encodeURIComponent(cleanSlug)}`);
        } else {
          router.push("/dashboard?tab=invitations");
        }
        return;
      }

      // 2. Fallback to /api/invitations/save if activate returns error or requires custom creation
      const res = await fetch("/api/invitations/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateSlug: slug,
          partnerOne: displayData?.partnerOne || "Your Name",
          partnerTwo: displayData?.partnerTwo || "Partner Name",
          weddingTime: displayData?.weddingTime || "May 13, 2026",
          heroImage: displayData?.coverImage || displayData?.heroImage,
          coupleImage: displayData?.coupleImage || displayData?.coverImage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "PAYMENT_REQUIRED" || data.error === "CINEMATIC_PLAN_REQUIRED" || data.error === "QUOTA_EXCEEDED") {
          const targetPlan = resolvedIsPremium ? "CINEMATIC_2000" : "BASIC_599";
          router.push(`/checkout?plan=${targetPlan}&template=${slug}`);
          return;
        }
        throw new Error(data.message || data.error || "Failed to activate template.");
      }

      setIsModalOpen(false);
      const targetSlug = data.invitation?.slug;
      if (targetSlug) {
        router.push(`/invitations/${targetSlug}`);
      } else {
        router.push("/dashboard?tab=invitations");
      }
    } catch (e: any) {
      console.error("Save invitation error:", e);
      throw new Error(e?.message || "Failed to activate template.");
    }
  };

  return (
    <>
      {/* Floating Top Header Bar with Edit Event Details Button */}
      <div className="fixed top-4 inset-x-4 sm:inset-x-6 z-[90] flex items-center justify-between pointer-events-none">
        <Link
          href={`/templates?category=${categoryParam}&viewed=${slug}`}
          className="pointer-events-auto px-3.5 py-2 rounded-full bg-[#221C17]/90 backdrop-blur-md text-[#F8F3EA] border border-[#D9A441]/40 text-xs font-bold flex items-center gap-1.5 shadow-lg hover:bg-[#7A1F2B] transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#D9A441]" />
          <span>All Templates</span>
        </Link>

        <button
          type="button"
          onClick={handleEditEventDetails}
          className="pointer-events-auto px-4 py-2 rounded-full bg-[#7A1F2B] text-[#F8F3EA] border-2 border-[#D9A441] text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-xl hover:bg-[#9B2C3B] hover:scale-105 transition-all cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-[#D9A441]" />
          <span>Edit Event Details</span>
        </button>
      </div>

      {/* 🌟 Floating Video Section Activation Reminder Notification 🌟 */}
      {!isVideoActive && !videoBannerDismissed && (
        <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-[95] w-[calc(100%-2rem)] max-w-lg bg-white/95 text-slate-900 border-2 border-red-200/90 rounded-2xl p-3 sm:p-3.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#991B1B] border border-red-100 flex items-center justify-center shrink-0 shadow-xs">
              <Video className="w-4 h-4 text-[#991B1B]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-slate-900 leading-tight">
                Activate Video Section
              </p>
              <p className="text-[11px] text-slate-600 truncate">
                Video section is inactive. Add your YouTube love story or teaser in Event Details!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleEditEventDetails}
              className="px-3 py-1.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-1 cursor-pointer hover:scale-105"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Activate</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setVideoBannerDismissed(true);
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("bervic_preview_video_banner_dismissed", "true");
                }
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Sticky Bottom CTA Bar */}
      <div className="fixed bottom-6 inset-x-4 max-w-xl mx-auto z-[90] bg-[#221C17]/95 backdrop-blur-md border-2 border-[#D9A441] text-[#F8F3EA] p-3 rounded-full shadow-2xl flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <Link
            href={`/templates/${prevSlug}`}
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-[#D9A441]/20 text-[#D9A441] hover:bg-[#D9A441] hover:text-[#0B0B0B] transition-all flex items-center gap-1 text-xs font-bold border border-[#D9A441]/40"
            title={`Previous Template: ${prevTemplate?.title}`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Prev</span>
          </Link>

          <Link
            href={`/templates/${nextSlug}`}
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-[#D9A441]/20 text-[#D9A441] hover:bg-[#D9A441] hover:text-[#0B0B0B] transition-all flex items-center gap-1 text-xs font-bold border border-[#D9A441]/40"
            title={`Next Template: ${nextTemplate?.title}`}
          >
            <span className="text-[11px] font-bold">Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href={`/templates?category=${categoryParam}&viewed=${slug}`}
            className="px-2 py-1.5 rounded-full bg-[#EFE7D8]/15 text-[#EFE7D8]/80 hover:bg-[#EFE7D8]/30 transition-colors flex items-center gap-1 text-xs font-bold"
            title={`Back to ${targetTemplate?.categoryLabel || "Gallery"}`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px] font-bold">Gallery</span>
          </Link>

          {myInvitations.length > 0 && (
            <Link
              href={myInvitations.length === 1 ? `/invitations/${myInvitations[0].slug}` : "/dashboard?tab=invitations"}
              className="px-2.5 py-1.5 rounded-full bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800/80 border border-emerald-500/40 transition-colors flex items-center gap-1 text-xs font-bold shrink-0"
              title="Navigate to your owned product"
            >
              <Crown className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden md:inline text-[11px] font-bold">
                {myInvitations.length === 1 ? "My Product" : `My Products (${myInvitations.length})`}
              </span>
            </Link>
          )}
        </div>

        <div className="hidden sm:flex flex-col text-left leading-tight truncate">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D9A441] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{isTemplateOwned ? "Your Active Suite" : "Love this design?"}</span>
          </span>
          <span className="text-xs font-bold text-[#F8F3EA] truncate">
            {resolvedTitle}
          </span>
        </div>

        {isTemplateOwned && matchingOwnedInv ? (
          <Link
            href={`/invitations/${matchingOwnedInv.slug}`}
            className="px-4 sm:px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wide flex items-center gap-1.5 shrink-0 shadow-lg hover:scale-105 transition-all bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer"
            title="Open your owned active invitation"
          >
            <Globe className="w-4 h-4 text-white" />
            <span>View My Owned Product ↗</span>
          </Link>
        ) : (
          <button
            onClick={handleMakeItYoursClick}
            disabled={checkingSubscription}
            className="btn-maroon px-4 sm:px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wide flex items-center gap-1.5 shrink-0 shadow-lg hover:scale-105 transition-all text-[#F8F3EA] cursor-pointer disabled:opacity-50"
          >
            {checkingSubscription ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <Edit3 className="w-4 h-4 text-[#D9A441]" />
            )}
            <span>Make It Yours ✨</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal to Own Template */}
      <MakeItYoursModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        templateSlug={slug}
        templateTitle={resolvedTitle}
        isPremium={resolvedIsPremium}
        price={resolvedPrice}
        userSubscription={userSubscription}
        onConfirmActivate={handleConfirmActivate}
      />
    </>
  );
}
