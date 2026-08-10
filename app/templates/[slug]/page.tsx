"use client";

import { use, useEffect, useState } from "react";
import DynamicTemplateCard from "@/components/templates/DynamicTemplateCard";
import TemplatePreviewBottomBar from "@/components/templates/TemplatePreviewBottomBar";
import { sampleWeddingData } from "@/data/sampleWeddingData";
import { sampleBirthdayData } from "@/data/sampleBirthdayData";
import { templatesRegistry } from "@/data/templatesRegistry";
import { mapEventProfileToInvitationData } from "@/lib/mapEventProfileToInvitationData";
import { useRequireLoginAndDetails } from "@/lib/useRequireLoginAndDetails";
import TemplatePreviewSkeleton from "@/components/skeletons/TemplatePreviewSkeleton";
import { TemplateClassicFloralProps } from "@/types/template";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function GenericTemplatePreviewPage({ params }: Props) {
  const { slug } = use(params);
  const { isLoading, hasCompletedDetails } = useRequireLoginAndDetails(`/templates/${slug}`);
  const [invitationData, setInvitationData] = useState<TemplateClassicFloralProps | null>(null);

  const targetTemplate =
    templatesRegistry.find((t) => t.slug === slug && t.category === "birthday") ||
    templatesRegistry.find((t) => t.slug === slug);

  const initialData =
    targetTemplate?.category === "birthday"
      ? sampleBirthdayData
      : sampleWeddingData;

  useEffect(() => {
    let activeDraft: Record<string, unknown> | null = null;

    if (typeof window !== "undefined") {
      const localStr = localStorage.getItem("bervic_user_draft_details");
      if (localStr) {
        try {
          activeDraft = JSON.parse(localStr);
        } catch {
          activeDraft = null;
        }
      }
    }

    fetch("/api/user/event-draft")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.draft) {
          const merged = mapEventProfileToInvitationData(data.draft, initialData);
          setInvitationData(merged);
        } else if (activeDraft) {
          const merged = mapEventProfileToInvitationData(activeDraft, initialData);
          setInvitationData(merged);
        } else {
          setInvitationData(initialData);
        }
      })
      .catch(() => {
        if (activeDraft) {
          setInvitationData(mapEventProfileToInvitationData(activeDraft, initialData));
        } else {
          setInvitationData(initialData);
        }
      });
  }, [slug, targetTemplate?.category, initialData]);

  const categoryParam = targetTemplate?.category || "all";
  const displayData = invitationData || initialData;

  if (isLoading || !hasCompletedDetails) {
    return <TemplatePreviewSkeleton />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Live Preview Full Invitation Screen */}
      <DynamicTemplateCard {...displayData} templateSlug={slug} />

      {/* Floating Bottom CTA Bar & Ownership Modal */}
      <TemplatePreviewBottomBar
        slug={slug}
        templateTitle={targetTemplate?.title}
        isPremium={targetTemplate?.isPremium}
        price={targetTemplate?.price}
        categoryParam={categoryParam}
        displayData={displayData}
      />
    </div>
  );
}
