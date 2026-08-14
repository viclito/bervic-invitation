"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle, Crown, Lock, ArrowRight, X, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface MakeItYoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateSlug: string;
  templateTitle: string;
  isPremium?: boolean;
  price?: number;
  userSubscription: {
    plan?: string;
    isActive?: boolean;
    remainingTemplateSlots?: number;
    remainingCinematicSlots?: number;
    allowedTemplatesCount?: number;
    allowedCinematicCount?: number;
    hasCinematicPass?: boolean;
  } | null;
  onConfirmActivate: () => Promise<void>;
}

export default function MakeItYoursModal({
  isOpen,
  onClose,
  templateSlug,
  templateTitle,
  isPremium = false,
  price = 599,
  userSubscription,
  onConfirmActivate,
}: MakeItYoursModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const remainingStandardSlots = userSubscription?.remainingTemplateSlots ?? 0;
  const remainingCinematicSlots = userSubscription?.remainingCinematicSlots ?? 0;

  const hasStandardPass =
    remainingStandardSlots > 0 ||
    userSubscription?.plan === "BASIC_599" ||
    userSubscription?.plan === "PRO_1799" ||
    (userSubscription?.allowedTemplatesCount ?? 0) > 0;

  const hasCinematicPass =
    remainingCinematicSlots > 0 ||
    Boolean(userSubscription?.hasCinematicPass) ||
    userSubscription?.plan === "CINEMATIC_2000" ||
    (userSubscription?.allowedCinematicCount ?? 0) > 0;

  const isCurrentPassActive = isPremium ? hasCinematicPass : hasStandardPass;
  const currentRemainingSlots = isPremium ? remainingCinematicSlots : remainingStandardSlots;

  const canOwn = currentRemainingSlots > 0;

  const activeSubscriptionText = isPremium
    ? hasCinematicPass
      ? "Premium Cinematic Pass (₹2000) Active"
      : "No Active Premium Package"
    : hasStandardPass
    ? `Standard Pass (${userSubscription?.plan === "PRO_1799" ? "₹1799" : "₹599"}) Active`
    : "No Active Standard Package";

  const quotaAvailableText = isPremium
    ? currentRemainingSlots > 0
      ? `${currentRemainingSlots} Premium Slot${currentRemainingSlots > 1 ? "s" : ""} Available ✨`
      : "0 Premium Slots Remaining"
    : currentRemainingSlots > 0
    ? `${currentRemainingSlots} Standard Slot${currentRemainingSlots > 1 ? "s" : ""} Available ✨`
    : "0 Standard Slots Remaining";

  const handleActivate = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await onConfirmActivate();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to activate template. Please try again.");
      setLoading(false);
    }
  };

  const handleBuyPlan = () => {
    const targetPlan = isPremium ? "CINEMATIC_2000" : "BASIC_599";
    router.push(`/checkout?plan=${targetPlan}&template=${templateSlug}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[#F8F3EA] text-[#221C17] rounded-3xl border-2 border-[#D9A441] shadow-2xl overflow-hidden p-6 sm:p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#7A1F2B] hover:bg-[#7A1F2B]/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badge & Title */}
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D9A441]/20 text-[#7A1F2B] border border-[#D9A441]/50">
              {isPremium ? (
                <>
                  <Crown className="w-4 h-4 text-[#D9A441]" />
                  <span>Premium Template</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D9A441]" />
                  <span>Standard Template</span>
                </>
              )}
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#7A1F2B]">
              Own {templateTitle}
            </h3>

            <p className="text-xs sm:text-sm text-[#54433d] leading-relaxed max-w-sm mx-auto">
              Are you sure you want to buy and own this template? Activating this design will link it directly to your wedding event profile.
            </p>
          </div>

          {/* User Status / Subscription Check Info Box */}
          <div className="bg-white/80 border border-[#D9A441]/40 rounded-2xl p-4 mb-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#54433d] uppercase tracking-wider">Active Subscription:</span>
              <span className={`px-2.5 py-0.5 rounded-full ${isCurrentPassActive ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                {activeSubscriptionText}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs font-bold border-t border-[#D9A441]/20 pt-2.5">
              <span className="text-[#54433d] uppercase tracking-wider">Template Quota Available:</span>
              <span className={canOwn ? "text-emerald-700 font-bold" : "text-[#7A1F2B]"}>
                {quotaAvailableText}
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-[#7A1F2B]/30 text-[#7A1F2B] font-bold text-xs uppercase tracking-wider hover:bg-[#7A1F2B]/5 transition-colors disabled:opacity-50"
            >
              Keep Browsing
            </button>

            {canOwn ? (
              <button
                onClick={handleActivate}
                disabled={loading}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#7A1F2B] text-[#F8F3EA] font-extrabold text-xs uppercase tracking-wider hover:bg-[#9E2A3B] transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Activating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#D9A441]" />
                    <span>Yes, Own Template ✨</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleBuyPlan}
                className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-[#D9A441] text-[#0B0B0B] font-extrabold text-xs uppercase tracking-wider hover:bg-[#E5B555] transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <Lock className="w-4 h-4" />
                <span>Buy Package (₹{price})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
