"use client";

import React from "react";

export default function TemplatePreviewSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] relative overflow-hidden animate-in fade-in duration-300">
      {/* Hero Invitation Banner Skeleton */}
      <div className="w-full h-80 sm:h-96 bg-gradient-to-b from-[#7A1F2B]/10 to-[#FAF6F0] relative flex items-center justify-center p-6 border-b border-[#D9A441]/20">
        <div className="text-center space-y-4 max-w-md w-full animate-pulse">
          <div className="w-20 h-20 rounded-full border-2 border-[#C59B27]/40 bg-white/80 mx-auto" />
          <div className="w-48 h-4 bg-[#7A1F2B]/20 rounded-full mx-auto" />
          <div className="w-64 h-8 bg-[#2C1D11]/15 rounded-xl mx-auto" />
          <div className="w-36 h-4 bg-[#7A1F2B]/20 rounded-full mx-auto" />
        </div>
      </div>

      {/* Meet the Bride & Groom Arched Section Skeleton */}
      <div className="max-w-4xl mx-auto w-full px-4 py-12 space-y-8">
        <div className="w-40 h-6 bg-[#C59B27]/20 rounded-full mx-auto animate-pulse" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="h-72 rounded-t-[100px] rounded-b-2xl bg-white border border-[#E8DFC8] p-4 shadow-sm animate-pulse flex flex-col items-center justify-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-slate-200" />
            <div className="w-32 h-5 bg-slate-200 rounded-md" />
            <div className="w-20 h-3 bg-slate-100 rounded-md" />
          </div>

          <div className="h-72 rounded-t-[100px] rounded-b-2xl bg-white border border-[#E8DFC8] p-4 shadow-sm animate-pulse flex flex-col items-center justify-center space-y-3">
            <div className="w-24 h-24 rounded-full bg-slate-200" />
            <div className="w-32 h-5 bg-slate-200 rounded-md" />
            <div className="w-20 h-3 bg-slate-100 rounded-md" />
          </div>
        </div>
      </div>

      {/* Floating Bottom CTA Bar Skeleton */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-lg h-14 rounded-full bg-white/95 border border-[#C59B27]/40 shadow-2xl backdrop-blur-md flex items-center justify-between px-6 animate-pulse">
        <div className="w-20 h-5 bg-slate-200 rounded-full" />
        <div className="w-32 h-9 bg-[#8C6227]/40 rounded-full" />
      </div>
    </div>
  );
}
