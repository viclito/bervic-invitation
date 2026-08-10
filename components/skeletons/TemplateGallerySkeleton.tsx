"use client";

import React from "react";

export default function TemplateGallerySkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5EEE0] text-[#1A1410] animate-in fade-in duration-300">
      {/* Fake Header Placeholder */}
      <div className="h-16 w-full border-b border-[#D9C88A]/30 bg-white/40 backdrop-blur-xs flex items-center justify-between px-6">
        <div className="w-28 h-7 bg-amber-900/10 rounded-xl animate-pulse" />
        <div className="flex gap-4">
          <div className="w-16 h-5 bg-amber-900/10 rounded-lg animate-pulse" />
          <div className="w-16 h-5 bg-amber-900/10 rounded-lg animate-pulse" />
          <div className="w-16 h-5 bg-amber-900/10 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Hero Header Skeleton */}
      <section className="pt-28 pb-8 text-center px-4 max-w-3xl mx-auto space-y-4">
        <div className="w-32 h-6 bg-[#C9A84C]/20 rounded-full mx-auto animate-pulse" />
        <div className="w-3/4 sm:w-2/3 h-10 bg-[#1A1410]/10 rounded-2xl mx-auto animate-pulse" />
        <div className="w-1/2 h-4 bg-[#1A1410]/10 rounded-lg mx-auto animate-pulse" />

        {/* Search Bar Skeleton */}
        <div className="w-full max-w-sm h-11 bg-white/80 rounded-full mx-auto border border-[#D9C88A]/40 animate-pulse mt-6" />

        {/* Category Pills Skeleton */}
        <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-24 h-8 bg-white/80 rounded-full border border-[#D9C88A]/40 animate-pulse" />
          ))}
        </div>
      </section>

      {/* Templates Grid Skeleton */}
      <main className="flex-1 max-w-[1380px] mx-auto px-4 sm:px-6 pb-20 w-full">
        <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-3 border border-[#D9C88A]/40 shadow-xs flex flex-col justify-between space-y-3 animate-pulse"
            >
              <div className="w-full aspect-[3/4] bg-slate-200/80 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>

              <div className="space-y-2 pt-1">
                <div className="w-3/4 h-4 bg-slate-200 rounded-md" />
                <div className="w-1/2 h-3 bg-slate-100 rounded-md" />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="w-12 h-4 bg-amber-900/10 rounded-md" />
                <div className="w-16 h-7 bg-[#7A1F2B]/10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
