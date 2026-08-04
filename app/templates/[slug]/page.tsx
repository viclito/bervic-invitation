"use client";

import { use } from "react";
import DynamicTemplateCard from "@/components/templates/DynamicTemplateCard";
import { sampleWeddingData } from "@/data/sampleWeddingData";
import { sampleBirthdayData } from "@/data/sampleBirthdayData";
import { templatesRegistry } from "@/data/templatesRegistry";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function GenericTemplatePreviewPage({ params }: Props) {
  const { slug } = use(params);

  const targetTemplate =
    templatesRegistry.find((t) => t.slug === slug && t.category === "birthday") ||
    templatesRegistry.find((t) => t.slug === slug);

  const initialData =
    targetTemplate?.category === "birthday"
      ? sampleBirthdayData
      : sampleWeddingData;

  return <DynamicTemplateCard {...initialData} templateSlug={slug} />;
}
