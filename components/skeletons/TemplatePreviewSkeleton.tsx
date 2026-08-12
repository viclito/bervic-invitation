"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplatePreviewSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] relative overflow-hidden animate-in fade-in duration-300">
      {/* Hero Invitation Banner Skeleton */}
      <div className="w-full h-80 sm:h-96 bg-slate-100/50 relative flex items-center justify-center p-6 border-b border-slate-200">
        <div className="text-center space-y-4 max-w-md w-full">
          <Skeleton className="w-20 h-20 rounded-full mx-auto" />
          <Skeleton className="w-48 h-4 rounded-full mx-auto" />
          <Skeleton className="w-64 h-8 rounded-xl mx-auto" />
          <Skeleton className="w-36 h-4 rounded-full mx-auto" />
        </div>
      </div>

      {/* Meet the Bride & Groom Arched Section Skeleton */}
      <div className="max-w-4xl mx-auto w-full px-4 py-12 space-y-8">
        <Skeleton className="w-40 h-6 rounded-full mx-auto" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="h-72 rounded-t-[100px] rounded-b-2xl bg-white border border-slate-200 p-4 shadow-xs flex flex-col items-center justify-center space-y-3">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="w-32 h-5 rounded-md" />
            <Skeleton className="w-20 h-3 rounded-md" />
          </div>

          <div className="h-72 rounded-t-[100px] rounded-b-2xl bg-white border border-slate-200 p-4 shadow-xs flex flex-col items-center justify-center space-y-3">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="w-32 h-5 rounded-md" />
            <Skeleton className="w-20 h-3 rounded-md" />
          </div>
        </div>
      </div>

      {/* Floating Bottom CTA Bar Skeleton */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg h-14 rounded-full bg-white/95 border border-slate-200 shadow-xl backdrop-blur-md flex items-center justify-between px-6">
        <Skeleton className="w-20 h-5 rounded-full" />
        <Skeleton className="w-32 h-9 rounded-full" />
      </div>
    </div>
  );
}
