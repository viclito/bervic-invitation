"use client";

import { Suspense, useEffect, useState } from "react";
import DynamicTemplateCard from "@/components/templates/DynamicTemplateCard";
import TemplatePreviewBottomBar from "@/components/templates/TemplatePreviewBottomBar";
import TemplatePreviewSkeleton from "@/components/skeletons/TemplatePreviewSkeleton";
import { mapEventProfileToInvitationData } from "@/lib/mapEventProfileToInvitationData";
import { useRequireLoginAndDetails } from "@/lib/useRequireLoginAndDetails";
import { sampleWeddingData } from "@/data/sampleWeddingData";
import { TemplateClassicFloralProps } from "@/types/template";

function ScrollScrubberContent() {
  const { isLoading, hasCompletedDetails } = useRequireLoginAndDetails("/templates/scroll-scrubber");
  const [invitationData, setInvitationData] = useState<TemplateClassicFloralProps>(sampleWeddingData);

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
          setInvitationData(mapEventProfileToInvitationData(data.draft, sampleWeddingData));
        } else if (activeDraft) {
          setInvitationData(mapEventProfileToInvitationData(activeDraft, sampleWeddingData));
        }
      })
      .catch(() => {
        if (activeDraft) {
          setInvitationData(mapEventProfileToInvitationData(activeDraft, sampleWeddingData));
        }
      });
  }, []);

  return (
    <div className="relative min-h-screen">
      <DynamicTemplateCard {...invitationData} templateSlug="scroll-scrubber" />
      <TemplatePreviewBottomBar
        slug="scroll-scrubber"
        templateTitle="Cinematic 480-Frame Scroll Sequence"
        isPremium={true}
        price={2000}
        displayData={invitationData}
      />
    </div>
  );
}

export default function ScrollScrubberPage() {
  return (
    <Suspense fallback={<TemplatePreviewSkeleton />}>
      <ScrollScrubberContent />
    </Suspense>
  );
}
