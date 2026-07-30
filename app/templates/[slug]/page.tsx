"use client";

import { useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DynamicTemplateCard from "@/components/templates/DynamicTemplateCard";
import { sampleWeddingData } from "@/data/sampleWeddingData";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function GenericTemplatePreviewPage({ params }: Props) {
  const { slug } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/login?callbackUrl=/templates/${slug}`);
    }
  }, [status, router, slug]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F3EA]">
        <div className="w-10 h-10 rounded-full border-2 border-[#7A1F2B] border-t-transparent animate-spin mb-3" />
        <span className="text-xs font-semibold text-[#7A1F2B]">Loading template preview...</span>
      </div>
    );
  }

  return <DynamicTemplateCard {...sampleWeddingData} templateSlug={slug} />;
}
