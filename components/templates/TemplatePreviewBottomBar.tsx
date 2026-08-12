"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, ArrowRight, Edit3, Sparkles, LayoutGrid } from "lucide-react";
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

  // Filter templates list to wedding category ONLY (excluding birthday, religious, anniversary)
  const activeWeddingTemplates = templatesRegistry.filter(
    (t) => t.category === "wedding" || !["birthday", "religious", "anniversary"].includes(t.category)
  );

  const targetTemplate =
    activeWeddingTemplates.find((t) => t.slug === slug) ||
    templatesRegistry.find((t) => t.slug === slug) ||
    activeWeddingTemplates[0];

  const currentIndex = activeWeddingTemplates.findIndex((t) => t.slug === slug);
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;

  const prevIndex = (safeCurrentIndex - 1 + activeWeddingTemplates.length) % activeWeddingTemplates.length;
  const nextIndex = (safeCurrentIndex + 1) % activeWeddingTemplates.length;

  const prevTemplate = activeWeddingTemplates[prevIndex];
  const nextTemplate = activeWeddingTemplates[nextIndex];

  const prevSlug = prevTemplate ? prevTemplate.slug : activeWeddingTemplates[0].slug;
  const nextSlug = nextTemplate ? nextTemplate.slug : activeWeddingTemplates[0].slug;

  const resolvedTitle = templateTitle || targetTemplate?.title || "Wedding Invitation";
  const resolvedIsPremium = Boolean(
    targetTemplate?.isCinematicExclusive || slug === "scroll-scrubber"
  );
  const resolvedPrice = price || targetTemplate?.price || (resolvedIsPremium ? 2000 : 599);

  const handleMakeItYoursClick = async () => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/templates/${slug}`);
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
      const res = await fetch("/api/invitations/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateSlug: slug,
          partnerOne: displayData?.partnerOne || "Sasa Adi Tinah",
          partnerTwo: displayData?.partnerTwo || "Allan Susilo",
          weddingTime: displayData?.weddingTime || "May 13, 2026",
          heroImage: displayData?.coverImage || displayData?.heroImage,
          coupleImage: displayData?.coupleImage || displayData?.coverImage,
        }),
      });

      const data = await res.json();
      if (!res.ok && data.error === "PAYMENT_REQUIRED") {
        const targetPlan = resolvedIsPremium ? "CINEMATIC_2000" : "BASIC_599";
        router.push(`/checkout?plan=${targetPlan}&template=${slug}`);
        return;
      }
    } catch (e) {
      console.warn("Save invitation notice:", e);
    }

    setIsModalOpen(false);
    router.push(`/templates/${slug}?activated=true`);
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

        <Link
          href="/dashboard/event-profile"
          className="pointer-events-auto px-4 py-2 rounded-full bg-[#7A1F2B] text-[#F8F3EA] border-2 border-[#D9A441] text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-xl hover:bg-[#9B2C3B] hover:scale-105 transition-all cursor-pointer"
        >
          <Edit3 className="w-4 h-4 text-[#D9A441]" />
          <span>Edit Event Details</span>
        </Link>
      </div>

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
        </div>

        <div className="hidden sm:flex flex-col text-left leading-tight truncate">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D9A441] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Love this design?</span>
          </span>
          <span className="text-xs font-bold text-[#F8F3EA] truncate">
            {resolvedTitle}
          </span>
        </div>

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
