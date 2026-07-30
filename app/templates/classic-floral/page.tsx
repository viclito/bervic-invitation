"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TemplateClassicFloral from "@/components/templates/classic-floral/TemplateClassicFloral";
import { sampleWeddingData } from "@/data/sampleWeddingData";

export default function ClassicFloralTemplatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/templates/classic-floral");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F3EA]">
        <div className="w-10 h-10 rounded-full border-2 border-[#7A1F2B] border-t-transparent animate-spin mb-3" />
        <span className="text-xs font-semibold text-[#7A1F2B]">Redirecting to login...</span>
      </div>
    );
  }

  return <TemplateClassicFloral {...sampleWeddingData} />;
}
