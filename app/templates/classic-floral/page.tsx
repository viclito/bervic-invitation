"use client";

import { useEffect, useState } from "react";
import TemplateClassicFloral from "@/components/templates/classic-floral/TemplateClassicFloral";
import TemplatePreviewBottomBar from "@/components/templates/TemplatePreviewBottomBar";
import { sampleWeddingData } from "@/data/sampleWeddingData";
import { mapEventProfileToInvitationData } from "@/lib/mapEventProfileToInvitationData";
import { useRequireLoginAndDetails } from "@/lib/useRequireLoginAndDetails";
import TemplatePreviewSkeleton from "@/components/skeletons/TemplatePreviewSkeleton";
import { TemplateClassicFloralProps } from "@/types/template";

export default function ClassicFloralTemplatePage() {
  const { isLoading, hasCompletedDetails } = useRequireLoginAndDetails("/templates/classic-floral");
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

  if (isLoading || !hasCompletedDetails) {
    return <TemplatePreviewSkeleton />;
  }

  return (
    <div className="relative min-h-screen">
      <TemplateClassicFloral {...invitationData} />
      <TemplatePreviewBottomBar
        slug="classic-floral"
        templateTitle="Classic Floral Invitation"
        isPremium={false}
        price={599}
        categoryParam="wedding"
        displayData={invitationData}
      />
    </div>
  );
}
