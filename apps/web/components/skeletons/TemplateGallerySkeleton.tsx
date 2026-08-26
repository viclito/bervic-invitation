"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplateGallerySkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 animate-in fade-in duration-300">
      {/* Fake Header Placeholder */}
      <div className="h-16 w-full border-b border-slate-200 bg-white flex items-center justify-between px-6">
        <Skeleton className="w-28 h-7 bg-slate-100" />
        <div className="flex gap-4">
          <Skeleton className="w-16 h-5 bg-slate-100" />
          <Skeleton className="w-16 h-5 bg-slate-100" />
          <Skeleton className="w-16 h-5 bg-slate-100" />
        </div>
      </div>

      {/* Hero Header Skeleton */}
      <section className="pt-28 pb-8 text-center px-4 max-w-3xl mx-auto space-y-4">
        <Skeleton className="w-32 h-6 rounded-full mx-auto bg-slate-100" />
        <Skeleton className="w-3/4 sm:w-2/3 h-10 rounded-2xl mx-auto bg-slate-100" />
        <Skeleton className="w-1/2 h-4 rounded-lg mx-auto bg-slate-100" />

        {/* Search Bar Skeleton */}
        <Skeleton className="w-full max-w-sm h-11 rounded-full mx-auto border border-slate-200 bg-slate-50 mt-6" />

        {/* Category Pills Skeleton */}
        <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-24 h-8 rounded-full border border-slate-200 bg-slate-50" />
          ))}
        </div>
      </section>

      {/* Templates Grid Skeleton */}
      <main className="flex-1 max-w-[1380px] mx-auto px-4 sm:px-6 pb-20 w-full">
        <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
            >
              <Skeleton className="w-full aspect-[3/4] rounded-xl bg-slate-100" />

              <div className="space-y-2 pt-1">
                <Skeleton className="w-3/4 h-4 bg-slate-100" />
                <Skeleton className="w-1/2 h-3 bg-slate-100" />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <Skeleton className="w-12 h-4 bg-slate-100" />
                <Skeleton className="w-16 h-7 rounded-lg bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
