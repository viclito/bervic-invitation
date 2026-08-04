"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Check, Sparkles, ShieldCheck, Zap, Crown, Lock } from "lucide-react";

interface PricingCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  reason?: string;
}

export default function PricingCheckoutModal({
  isOpen,
  onClose,
  onSuccess,
  reason = "Choose a plan to customize, save, export, and publish your luxury digital invitations.",
}: PricingCheckoutModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Dynamically load Razorpay Checkout SDK
    if (!document.getElementById("razorpay-sdk")) {
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!isOpen) return null;

  const handleCheckout = async (plan: "BASIC_299" | "PRO_999") => {
    setLoadingPlan(plan);
    setErrorMsg(null);

    try {
      // 1. Create order on server
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create payment order");
      }

      // 2. Open Razorpay Checkout Widget
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Bervic Invitations",
        description: `${plan === "BASIC_299" ? "Basic Plan (₹299 - 6 Months)" : "Pro Plan (₹999 - 1 Year)"}`,
        image: "https://bervic.app/images/category-wedding.jpg",
        order_id: data.orderId,
        prefill: {
          name: data.user?.name || "",
          email: data.user?.email || "",
          contact: data.user?.phone || "",
        },
        theme: {
          color: "#7A1F2B",
        },
        handler: async function (response: any) {
          try {
            // 3. Verify payment on server
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || verifyData.error) {
              throw new Error(verifyData.error || "Payment verification failed.");
            }

            setLoadingPlan(null);
            if (onSuccess) onSuccess();
            onClose();
          } catch (err: any) {
            console.error("Payment verification error:", err);
            setErrorMsg(err.message || "Payment verification failed.");
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingPlan(null);
          },
        },
      };

      const razorpayWindow = (window as any).Razorpay;
      if (razorpayWindow) {
        const rzp = new razorpayWindow(options);
        rzp.open();
      } else {
        throw new Error("Razorpay SDK failed to load. Please refresh.");
      }
    } catch (err: any) {
      console.error("Checkout Error:", err);
      setErrorMsg(err.message || "Failed to start payment.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in" data-lenis-prevent>
      <div data-lenis-prevent className="bg-[#F8F3EA] border-2 border-[#D9A441]/40 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#221C17] overscroll-contain">
        {/* Header */}
        <div className="p-6 border-b border-[#D9A441]/20 bg-[#EFE7D8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center shadow-md">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#221C17]">Unlock Bervic Invitation Suite</h2>
              <p className="text-xs text-[#221C17]/70 font-medium mt-0.5">{reason}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/10 text-[#221C17]/70 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-300 rounded-xl text-red-800 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Content: 2 Plan Pricing Cards */}
        <div data-lenis-prevent className="p-6 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 overscroll-contain">
          {/* Plan 1: BASIC ₹299 */}
          <div className="bg-[#FAF7F2] border-2 border-[#D9A441]/40 rounded-3xl p-6 flex flex-col justify-between hover:border-[#7A1F2B] transition-all shadow-md group relative">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] text-[10px] font-extrabold uppercase tracking-widest border border-[#7A1F2B]/20 inline-block mb-3">
                6 Months Plan
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#221C17]">Basic Pass</h3>
              <div className="flex items-baseline gap-2 mt-2 mb-4">
                <span className="line-through text-sm text-[#221C17]/40 font-semibold">₹900</span>
                <span className="text-3xl font-bold text-[#7A1F2B]">₹299</span>
                <span className="text-xs text-[#221C17]/60 font-medium">/ 6 Months</span>
              </div>

              <hr className="border-t border-[#D9A441]/20 mb-4" />

              <ul className="space-y-3 text-xs text-[#221C17]/80">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>1 Wedding Invitation Template</strong> (locked to chosen template once selected)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>Unlimited Edits</strong> to your chosen template anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>1 Instagram Announcement Card</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>Invite Unlimited Guests via WhatsApp</strong> with guest name personalization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>Active for 6 Months</strong> (Assets stay live until plan ends)</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout("BASIC_299")}
              disabled={loadingPlan !== null}
              className="mt-6 w-full py-3 rounded-xl bg-[#EFE7D8] text-[#7A1F2B] border-2 border-[#7A1F2B]/40 text-xs font-bold hover:bg-[#7A1F2B] hover:text-[#F8F3EA] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loadingPlan === "BASIC_299" ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-[#D9A441]" />
                  <span>Choose Basic (₹299)</span>
                </>
              )}
            </button>
          </div>

          {/* Plan 2: PRO ₹999 */}
          <div className="bg-[#FAF7F2] border-2 border-[#7A1F2B] rounded-3xl p-6 flex flex-col justify-between shadow-xl relative group">
            <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#7A1F2B] text-[#D9A441] text-[10px] font-extrabold uppercase tracking-widest shadow-md">
              Best Value & Most Popular
            </span>

            <div>
              <span className="px-3 py-1 rounded-full bg-[#D9A441]/20 text-[#7A1F2B] text-[10px] font-extrabold uppercase tracking-widest border border-[#D9A441]/40 inline-block mb-3">
                1 Year Annual Pass
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#221C17]">Pro Annual Pass</h3>
              <div className="flex items-baseline gap-2 mt-2 mb-4">
                <span className="line-through text-sm text-[#221C17]/40 font-semibold">₹2,000</span>
                <span className="text-3xl font-bold text-[#7A1F2B]">₹999</span>
                <span className="text-xs text-[#221C17]/60 font-medium">/ 1 Full Year</span>
              </div>

              <hr className="border-t border-[#D9A441]/20 mb-4" />

              <ul className="space-y-3 text-xs text-[#221C17]/80">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>4 Wedding Invitation Templates</strong> (select 4 distinct template designs)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>Unlimited Edits</strong> to all selected templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>6 Instagram Announcement Cards</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>Invite Unlimited Guests via WhatsApp</strong> with guest name personalization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>Active for 1 Full Year (12 Months)</strong></span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleCheckout("PRO_999")}
              disabled={loadingPlan !== null}
              className="mt-6 w-full py-3.5 rounded-xl bg-[#7A1F2B] text-[#F8F3EA] text-xs font-bold hover:bg-[#601822] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loadingPlan === "PRO_999" ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  <Crown className="w-4 h-4 text-[#D9A441]" />
                  <span>Choose Pro (₹999)</span>
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
            <Link href="/checkout?required=true" onClick={onClose} className="text-[#7A1F2B] font-bold underline flex items-center gap-1">
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
