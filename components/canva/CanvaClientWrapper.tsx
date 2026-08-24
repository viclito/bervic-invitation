"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const CanvaCardStudio = dynamic(
  () => import("@/components/canva/CanvaCardStudio"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-900 text-sm font-bold gap-3">
        <div className="w-8 h-8 border-2 border-[#991B1B] border-t-transparent rounded-full animate-spin" />
        <span className="tracking-wide">Loading Canva Invitation Studio...</span>
      </div>
    ),
  }
);

export default function CanvaClientWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-900 text-sm font-bold gap-3">
          <div className="w-8 h-8 border-2 border-[#991B1B] border-t-transparent rounded-full animate-spin" />
          <span className="tracking-wide">Loading Canva Invitation Studio...</span>
        </div>
      }
    >
      <CanvaCardStudio />
    </Suspense>
  );
}
