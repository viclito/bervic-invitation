"use client";

import React from "react";

export default function WizardDetailsSkeleton() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left AI Upload Box Skeleton */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#D9C88A]/40 shadow-xs space-y-5 animate-pulse">
          <div className="w-32 h-5 bg-[#C9A84C]/20 rounded-full" />
          <div className="space-y-2">
            <div className="w-48 h-6 bg-slate-200 rounded-lg" />
            <div className="w-full h-3.5 bg-slate-100 rounded" />
            <div className="w-4/5 h-3.5 bg-slate-100 rounded" />
          </div>

          <div className="w-full h-44 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/80 flex flex-col items-center justify-center p-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-200" />
            <div className="w-40 h-3.5 bg-slate-200 rounded" />
            <div className="w-32 h-8 bg-slate-200 rounded-xl" />
          </div>

          <div className="w-full h-16 rounded-xl bg-amber-900/5 border border-amber-900/10 p-3 space-y-2">
            <div className="w-24 h-3 bg-slate-200 rounded" />
            <div className="w-full h-3 bg-slate-100 rounded" />
          </div>
        </div>

        {/* Right Form Wizard Skeleton */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#D9C88A]/40 shadow-xs space-y-6 animate-pulse">
          {/* 9 Step Pills Skeleton */}
          <div className="grid grid-cols-5 sm:grid-cols-9 gap-2 pb-4 border-b border-slate-100">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-8 rounded-full bg-slate-200" />
            ))}
          </div>

          {/* Step Header & Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-56 h-6 bg-slate-200 rounded-lg" />
              <div className="w-28 h-4 bg-slate-200 rounded" />
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="w-2/5 h-full bg-[#7A1F2B]/30 rounded-full" />
            </div>
          </div>

          {/* Pending alert box skeleton */}
          <div className="w-full h-11 rounded-xl bg-amber-500/10 border border-amber-500/20" />

          {/* Input Cards Grid Skeleton */}
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="h-28 rounded-2xl bg-slate-100 border border-slate-200/60" />
              <div className="h-28 rounded-2xl bg-slate-100 border border-slate-200/60" />
              <div className="h-28 rounded-2xl bg-slate-100 border border-slate-200/60" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-24 rounded-2xl bg-slate-100 border border-slate-200/60" />
              <div className="h-24 rounded-2xl bg-slate-100 border border-slate-200/60" />
            </div>
          </div>

          {/* Navigation Action Buttons Skeleton */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="w-20 h-10 bg-slate-200 rounded-xl" />
            <div className="w-40 h-12 bg-[#7A1F2B]/30 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
