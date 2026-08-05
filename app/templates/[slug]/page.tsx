"use client";

import { use } from "react";
import Link from "next/link";
import DynamicTemplateCard from "@/components/templates/DynamicTemplateCard";
import { sampleWeddingData } from "@/data/sampleWeddingData";
import { sampleBirthdayData } from "@/data/sampleBirthdayData";
import { templatesRegistry } from "@/data/templatesRegistry";
import { Sparkles, Edit3, ArrowLeft } from "lucide-react";

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

  return (
    <div className="relative min-h-screen">
      {/* Live Preview Full Invitation Screen */}
      <DynamicTemplateCard {...initialData} templateSlug={slug} />

      {/* Floating Sticky Bottom CTA Bar to Customize */}
      <div className="fixed bottom-6 inset-x-4 max-w-md mx-auto z-50 bg-[#221C17]/95 backdrop-blur-md border-2 border-[#D9A441] text-[#F8F3EA] p-3 rounded-full shadow-2xl flex items-center justify-between gap-3">
        <Link
          href="/templates"
          className="p-2.5 rounded-full bg-[#EFE7D8]/20 text-[#D9A441] hover:bg-[#D9A441]/30 transition-colors shrink-0"
          title="Back to All Templates"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex flex-col text-left leading-tight truncate">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D9A441] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Love this design?</span>
          </span>
          <span className="text-xs font-bold text-[#F8F3EA] truncate">
            {targetTemplate?.title || "Custom Invitation"}
          </span>
        </div>

        <Link
          href={`/templates/customize/${slug}?from=templates`}
          className="btn-maroon px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wide flex items-center gap-1.5 shrink-0 shadow-lg hover:scale-105 transition-all text-[#F8F3EA]"
        >
          <Edit3 className="w-4 h-4 text-[#D9A441]" />
          <span>Make It Yours ✨</span>
        </Link>
      </div>
    </div>
  );
}
