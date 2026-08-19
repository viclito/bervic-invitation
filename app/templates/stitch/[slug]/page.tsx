"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import DynamicTemplateCard from "@/components/templates/DynamicTemplateCard";
import TemplatePreviewBottomBar from "@/components/templates/TemplatePreviewBottomBar";
import TemplatePreviewSkeleton from "@/components/skeletons/TemplatePreviewSkeleton";
import { sampleWeddingData } from "@/data/sampleWeddingData";
import { sampleBirthdayData } from "@/data/sampleBirthdayData";
import { templatesRegistry } from "@/data/templatesRegistry";
import { mapEventProfileToInvitationData } from "@/lib/mapEventProfileToInvitationData";
import { useRequireLoginAndDetails } from "@/lib/useRequireLoginAndDetails";
import { TemplateClassicFloralProps } from "@/types/template";

export default function StitchTemplatePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "olive-ochre";
  const { isLoading, hasCompletedDetails } = useRequireLoginAndDetails(`/templates/stitch/${slug}`);
  const [invitationData, setInvitationData] = useState<TemplateClassicFloralProps>(sampleWeddingData);

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

    const eventType = targetTemplate?.category === "birthday" ? "BIRTHDAY" : "WEDDING";
    const isLocalMatching =
      activeDraft &&
      (targetTemplate?.category === "birthday"
        ? activeDraft.eventType === "BIRTHDAY"
        : !activeDraft.eventType || activeDraft.eventType === "WEDDING");

    fetch(`/api/user/event-draft?eventType=${eventType}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.draft) {
          setInvitationData(mapEventProfileToInvitationData(data.draft, initialData));
        } else if (isLocalMatching && activeDraft) {
          setInvitationData(mapEventProfileToInvitationData(activeDraft, initialData));
        } else {
          setInvitationData(initialData);
        }
      })
      .catch(() => {
        if (isLocalMatching && activeDraft) {
          setInvitationData(mapEventProfileToInvitationData(activeDraft, initialData));
        } else {
          setInvitationData(initialData);
        }
      });
  }, [slug, targetTemplate?.category, initialData]);

  if (isLoading || !hasCompletedDetails) {
    return <TemplatePreviewSkeleton />;
  }

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        <DynamicTemplateCard key={slug} {...invitationData} templateSlug={slug} />
      </AnimatePresence>
      <TemplatePreviewBottomBar slug={slug} displayData={invitationData} />
    </div>
  );
}
