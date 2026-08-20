"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Check, Sparkles, ShieldCheck, Zap, Crown, Lock } from "lucide-react";

interface PricingCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  reason?: string;
  templateSlug?: string;
  preselectedPlan?: string;
}

export default function PricingCheckoutModal({
  isOpen,
  onClose,
  onSuccess,
  reason = "Choose a plan to customize, save, export, and publish your luxury digital invitations.",
  templateSlug = "",
  preselectedPlan = "",
}: PricingCheckoutModalProps) {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isCinematicRequired = templateSlug === "scroll-scrubber" || preselectedPlan === "CINEMATIC_2000";

  if (!isOpen) return null;

  const handleCheckout = (plan: "BASIC_599" | "PRO_1799" | "CINEMATIC_2000" | "CARDS_99") => {
    onClose();
    router.push(`/checkout?plan=${plan}${templateSlug ? `&template=${templateSlug}` : ""}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[#F8F3EA] border-2 border-[#D9A441] rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl relative my-8">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-[#FAF7F2] border-b border-[#D9A441]/20 relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-[#EFE7D8] text-[#221C17] hover:bg-[#7A1F2B] hover:text-[#F8F3EA] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] text-[10px] font-extrabold uppercase tracking-wider mb-2">
            <Crown className="w-3.5 h-3.5" />
            <span>Unlock Subscription Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#221C17]">
            Choose Your Official Bervic Pass
          </h2>
          <p className="text-xs text-[#221C17]/70 mt-1 max-w-xl">
            {isCinematicRequired
              ? "🎬 Cinematic Scroll Template Selected: This 480-frame Apple-style template requires the ₹2000 Cinematic Masterpiece Pass."
              : reason}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-100 border-b border-red-300 text-red-800 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* Plan Cards Grid: 4 Cards */}
        <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          
          {/* Plan 1: INSTAGRAM CARDS PASS ₹99 */}
          <div
            className={`bg-[#FAF7F2] border-2 rounded-3xl p-5 flex flex-col justify-between relative ${
              isCinematicRequired
                ? "border-gray-300 opacity-40 grayscale select-none"
                : "border-[#D9A441]/40 hover:border-[#991B1B] shadow-md"
            }`}
          >
            <div>
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-block mb-3 bg-red-50 text-[#991B1B] border border-red-200">
                Social Pass
              </span>
              <h3 className="text-lg font-serif font-bold text-[#221C17]">Instagram Cards</h3>
              <div className="flex items-baseline gap-2 mt-1 mb-3">
                <span className="line-through text-xs text-[#221C17]/40 font-semibold">₹299</span>
                <span className="text-2xl font-bold text-[#991B1B]">₹99</span>
                <span className="text-[11px] text-[#221C17]/60 font-medium">/ 5 Cards</span>
              </div>

              <hr className="border-t border-[#D9A441]/20 mb-3" />

              <ul className="space-y-2 text-[11px] text-[#221C17]/80">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#991B1B] shrink-0 mt-0.5" />
                  <span><strong>5 High-Res Downloads</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#991B1B] shrink-0 mt-0.5" />
                  <span><strong>31+ Luxury Presets</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#991B1B] shrink-0 mt-0.5" />
                  <span><strong>PNG &amp; PDF Downloads</strong></span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout("CARDS_99")}
              disabled={loadingPlan !== null}
              className="mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-[#991B1B] text-white hover:bg-[#7F1D1D] shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {loadingPlan === "CARDS_99" ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Choose ₹99 Pass</span>
                </>
              )}
            </button>
          </div>

          {/* Plan 2: BASIC ₹599 */}
          <div
            className={`bg-[#FAF7F2] border-2 rounded-3xl p-5 flex flex-col justify-between relative ${
              isCinematicRequired
                ? "border-gray-300 opacity-40 grayscale select-none"
                : "border-[#D9A441]/40 hover:border-[#7A1F2B] shadow-md"
            }`}
          >
            <div>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-block mb-3 ${
                  isCinematicRequired
                    ? "bg-gray-200 text-gray-700 border border-gray-300"
                    : "bg-[#7A1F2B]/10 text-[#7A1F2B] border border-[#7A1F2B]/20"
                }`}
              >
                {isCinematicRequired ? "🔒 Standard Only" : "6 Months Pass"}
              </span>
              <h3 className="text-lg font-serif font-bold text-[#221C17]">Basic Pass</h3>
              <div className="flex items-baseline gap-2 mt-1 mb-3">
                <span className="line-through text-xs text-[#221C17]/40 font-semibold">₹1,299</span>
                <span className="text-2xl font-bold text-[#7A1F2B]">₹599</span>
                <span className="text-[11px] text-[#221C17]/60 font-medium">/ 6 Months</span>
              </div>

              <hr className="border-t border-[#D9A441]/20 mb-3" />

              <ul className="space-y-2 text-[11px] text-[#221C17]/80">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>1 Standard Template Slot</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>Unlimited Edits</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>2 Instagram Cards</strong></span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout("BASIC_599")}
              disabled={loadingPlan !== null || isCinematicRequired}
              className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isCinematicRequired
                  ? "bg-gray-200 text-gray-600 border border-gray-300 cursor-not-allowed"
                  : "bg-[#EFE7D8] text-[#7A1F2B] border-2 border-[#7A1F2B]/40 hover:bg-[#7A1F2B] hover:text-[#F8F3EA] shadow-sm disabled:opacity-50"
              }`}
            >
              {isCinematicRequired ? (
                <span>Requires ₹2000 Pass</span>
              ) : loadingPlan === "BASIC_599" ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>Choose ₹599</span>
                </>
              )}
            </button>
          </div>

          {/* Plan 2: PRO ₹1799 */}
          <div
            className={`bg-[#FAF7F2] border-2 rounded-3xl p-5 flex flex-col justify-between relative ${
              isCinematicRequired
                ? "border-gray-300 opacity-40 grayscale select-none"
                : "border-[#7A1F2B] shadow-xl"
            }`}
          >
            {!isCinematicRequired && (
              <span className="absolute -top-3.5 right-4 px-2.5 py-0.5 rounded-full bg-[#7A1F2B] text-[#D9A441] text-[9px] font-extrabold uppercase tracking-widest shadow-md">
                Most Popular
              </span>
            )}

            <div>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-block mb-3 ${
                  isCinematicRequired
                    ? "bg-gray-200 text-gray-700 border border-gray-300"
                    : "bg-[#D9A441]/20 text-[#7A1F2B] border border-[#D9A441]/40"
                }`}
              >
                {isCinematicRequired ? "🔒 Standard Only" : "1 Year Annual Pass"}
              </span>
              <h3 className="text-lg font-serif font-bold text-[#221C17]">Pro Pass</h3>
              <div className="flex items-baseline gap-2 mt-1 mb-3">
                <span className="line-through text-xs text-[#221C17]/40 font-semibold">₹3,499</span>
                <span className="text-2xl font-bold text-[#7A1F2B]">₹1799</span>
                <span className="text-[11px] text-[#221C17]/60 font-medium">/ 1 Year</span>
              </div>

              <hr className="border-t border-[#D9A441]/20 mb-3" />

              <ul className="space-y-2 text-[11px] text-[#221C17]/80">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>4 Standard Template Slots</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>Unlimited Edits</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>6 Instagram Cards</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>8 PDF Exports</strong></span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout("PRO_1799")}
              disabled={loadingPlan !== null || isCinematicRequired}
              className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isCinematicRequired
                  ? "bg-gray-200 text-gray-600 border border-gray-300 cursor-not-allowed"
                  : "bg-[#7A1F2B] text-[#F8F3EA] hover:bg-[#601822] shadow-lg disabled:opacity-50"
              }`}
            >
              {isCinematicRequired ? (
                <span>Requires ₹2000 Pass</span>
              ) : loadingPlan === "PRO_1799" ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Crown className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>Choose Pro (₹1799)</span>
                </>
              )}
            </button>
          </div>

          {/* Plan 3: CINEMATIC ₹2000 EXCLUSIVE */}
          <div
            className={`bg-[#0D0D0D] text-[#FDF6F3] rounded-3xl p-5 flex flex-col justify-between relative group ${
              isCinematicRequired
                ? "border-4 border-[#D9A441] ring-4 ring-[#D9A441]/50 scale-[1.03] shadow-[0_0_40px_rgba(217,164,65,0.6)] z-10"
                : "border-2 border-[#D9A441] shadow-2xl"
            }`}
          >
            <span
              className={`absolute -top-3.5 right-4 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-md ${
                isCinematicRequired ? "bg-[#D9A441] text-[#070707] animate-bounce" : "bg-[#D9A441] text-[#070707]"
              }`}
            >
              {isCinematicRequired ? "⭐ REQUIRED FOR THIS TEMPLATE" : "Cinematic Exclusive"}
            </span>

            <div>
              <span className="px-3 py-1 rounded-full bg-[#D9A441]/20 text-[#D9A441] text-[10px] font-extrabold uppercase tracking-widest border border-[#D9A441]/50 inline-block mb-3">
                {isCinematicRequired ? "🎬 CINEMATIC REQUIRED" : "Exclusive Masterpiece"}
              </span>
              <h3 className="text-lg font-serif font-bold text-[#F7E7C4]">Cinematic Pass</h3>
              <div className="flex items-baseline gap-2 mt-1 mb-3">
                <span className="line-through text-xs text-[#FDF6F3]/40 font-semibold">₹4,999</span>
                <span className="text-2xl font-bold text-[#D9A441]">₹2000</span>
                <span className="text-[11px] text-[#FDF6F3]/70 font-medium">/ 1 Year</span>
              </div>

              <hr className="border-t border-[#D9A441]/30 mb-3" />

              <ul className="space-y-2 text-[11px] text-[#FDF6F3]/90">
                <li className="flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9A441] shrink-0 mt-0.5" />
                  <span><strong>1 Exclusive Cinematic Template Slot</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#D9A441] shrink-0 mt-0.5" />
                  <span><strong>10 Instagram Cards</strong></span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#D9A441] shrink-0 mt-0.5" />
                  <span><strong>WhatsApp RSVPs</strong></span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout("CINEMATIC_2000")}
              disabled={loadingPlan !== null}
              className={`mt-6 w-full py-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
                isCinematicRequired
                  ? "bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] text-[#070707] hover:scale-105 animate-pulse"
                  : "bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] text-[#070707] hover:scale-[1.02]"
              }`}
            >
              {loadingPlan === "CINEMATIC_2000" ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#070707]" />
                  <span>Pay ₹2000 &amp; Unlock</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="p-4 border-t border-[#D9A441]/20 bg-[#EFE7D8] flex items-center justify-between text-xs text-[#221C17]/70 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7A1F2B]" />
            <span>Secure 256-bit SSL Payment powered by Razorpay</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={`/checkout?required=true${templateSlug ? `&template=${templateSlug}` : ""}`}
              onClick={onClose}
              className="text-[#7A1F2B] font-bold underline flex items-center gap-1"
            >
              <span>Full Checkout Page →</span>
            </Link>
            <button onClick={onClose} className="hover:text-[#7A1F2B] font-semibold underline">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
