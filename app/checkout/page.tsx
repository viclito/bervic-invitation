"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Crown, Zap, ShieldCheck, ArrowRight, Lock, Sparkles, User, LogIn } from "lucide-react";

function CheckoutContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "BASIC_599";
  const isRequired = searchParams.get("required") === "true";
  const templateSlug = searchParams.get("template") || "";

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Load Razorpay SDK
    if (!document.getElementById("razorpay-sdk")) {
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePay = async (plan: "BASIC_599" | "PRO_1799" | "CINEMATIC_2000") => {
    if (status !== "authenticated") {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/checkout?plan=${plan}`)}`);
      return;
    }

    setLoadingPlan(plan);
    setErrorMsg(null);

    try {
      // 1. Create order
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create payment order.");
      }

      const planDescriptions = {
        BASIC_599: "Basic Pass (₹599 - 6 Months)",
        PRO_1799: "Pro Annual Pass (₹1799 - 1 Year)",
        CINEMATIC_2000: "Cinematic Pass (₹2000 - 1 Year)",
      };

      // 2. Open Razorpay Widget
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Bervic Invitations",
        description: planDescriptions[plan],
        image: "https://bervic.app/images/category-wedding.jpg",
        order_id: data.orderId,
        prefill: {
          name: data.user?.name || session?.user?.name || "",
          email: data.user?.email || session?.user?.email || "",
          contact: data.user?.phone || "",
        },
        theme: {
          color: "#7A1F2B",
        },
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
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
            if (templateSlug) {
              router.push(`/templates/customize/${templateSlug}`);
            } else {
              router.push("/dashboard?payment=success");
            }
          } catch (err: any) {
            console.error("Verification error:", err);
            setErrorMsg(err?.message || "Payment verification failed.");
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
      setErrorMsg(err?.message || "Failed to initiate payment.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EA] text-[#221C17] font-sans">
      <Navbar />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 pt-36 pb-20">
        {/* Banner Alert if redirected because payment required */}
        {isRequired && (
          <div className="mb-8 p-4 bg-[#7A1F2B]/10 border-2 border-[#7A1F2B]/30 rounded-2xl flex items-center justify-between gap-4 text-[#7A1F2B]">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Subscription Required to Edit & Save</h4>
                <p className="text-xs text-[#221C17]/70 mt-0.5">
                  Browsing templates is free. Choose a plan below to customize, save, and send personalized WhatsApp invitations!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9A441]/20 text-[#8B6519] border border-[#D9A441]/40 text-xs font-semibold uppercase tracking-widest mb-3">
            <Crown className="w-3.5 h-3.5" />
            <span>Official Subscription Pass</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#221C17] leading-tight">
            Choose Your <span className="font-accent text-[#7A1F2B] italic">Bervic Pass</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#221C17]/70 mt-3">
            Unlock 1-click customization, personalized WhatsApp guest invitations, and high-res PDF exports.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-8 max-w-2xl mx-auto p-4 bg-red-100 border border-red-300 rounded-xl text-red-800 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* Unauthenticated Login Prompt Banner */}
        {status === "unauthenticated" && (
          <div className="mb-10 max-w-2xl mx-auto p-4 bg-[#D9A441]/10 border border-[#D9A441]/40 rounded-2xl flex items-center justify-between gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#7A1F2B]" />
              <span>Log in to your account before choosing a plan.</span>
            </div>
            <Link
              href={`/auth/login?callbackUrl=${encodeURIComponent("/checkout")}`}
              className="px-4 py-2 rounded-xl bg-[#7A1F2B] text-[#F8F3EA] hover:bg-[#601822] transition-colors flex items-center gap-1.5 shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In First</span>
            </Link>
          </div>
        )}

        {/* 3 Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Plan 1: BASIC ₹599 */}
          <div className="bg-[#FAF7F2] border-2 border-[#D9A441]/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#7A1F2B] transition-all shadow-md group relative">
            <div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#7A1F2B]/10 text-[#7A1F2B] text-[10px] font-extrabold uppercase tracking-widest border border-[#7A1F2B]/20 inline-block mb-4">
                6 Months Validity
              </span>

              <h3 className="text-xl font-serif font-bold text-[#221C17]">Basic Pass</h3>
              <p className="text-xs text-[#221C17]/60 mt-1">Perfect for couples wanting 1 luxury invitation & Instagram card.</p>

              <div className="flex items-baseline gap-1 my-5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#7A1F2B]">₹599</span>
                <span className="text-xs text-[#221C17]/60 font-medium">/ 6 Months</span>
              </div>

              <hr className="border-t border-[#D9A441]/20 mb-5" />

              <ul className="space-y-2.5 text-xs text-[#221C17]/80">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>1 Standard Invitation Template Slot</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>Unlimited Edits</strong> to your chosen template</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>2 Instagram Announcement Cards</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>Invite Unlimited Guests via WhatsApp</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>Active for 6 Full Months</strong></span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePay("BASIC_599")}
              disabled={loadingPlan !== null}
              className="mt-8 w-full py-3.5 rounded-2xl bg-[#EFE7D8] text-[#7A1F2B] border-2 border-[#7A1F2B]/40 text-xs font-bold hover:bg-[#7A1F2B] hover:text-[#F8F3EA] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loadingPlan === "BASIC_599" ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-[#D9A441]" />
                  <span>Pay ₹599 & Unlock Basic</span>
                </>
              )}
            </button>
          </div>

          {/* Plan 2: PRO ₹1799 */}
          <div className="bg-[#FAF7F2] border-2 border-[#7A1F2B] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl relative group">
            <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#7A1F2B] text-[#D9A441] text-[9px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1">
              <Crown className="w-3 h-3 text-[#D9A441]" />
              <span>Most Popular</span>
            </span>

            <div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#D9A441]/20 text-[#7A1F2B] text-[10px] font-extrabold uppercase tracking-widest border border-[#D9A441]/40 inline-block mb-4">
                1 Year Annual Suite
              </span>

              <h3 className="text-xl font-serif font-bold text-[#221C17]">Pro Annual Pass</h3>
              <p className="text-xs text-[#221C17]/60 mt-1">Ideal for grand wedding celebrations with multiple functions.</p>

              <div className="flex items-baseline gap-1 my-5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#7A1F2B]">₹1799</span>
                <span className="text-xs text-[#221C17]/60 font-medium">/ 1 Full Year</span>
              </div>

              <hr className="border-t border-[#D9A441]/20 mb-5" />

              <ul className="space-y-2.5 text-xs text-[#221C17]/80">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>4 Standard Invitation Template Slots</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>Unlimited Edits</strong> to all templates anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>6 Instagram Announcement Cards</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>Invite Unlimited Guests via WhatsApp</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                  <span><strong>8 High-Res Printable PDF Exports</strong></span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePay("PRO_1799")}
              disabled={loadingPlan !== null}
              className="mt-8 w-full py-3.5 rounded-2xl bg-[#7A1F2B] text-[#F8F3EA] text-xs font-bold hover:bg-[#601822] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loadingPlan === "PRO_1799" ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Crown className="w-4 h-4 text-[#D9A441]" />
                  <span>Pay ₹1799 & Unlock Pro</span>
                </>
              )}
            </button>
          </div>

          {/* Plan 3: CINEMATIC ₹2000 EXCLUSIVE */}
          <div className="bg-[#0D0D0D] border-2 border-[#D9A441] text-[#FDF6F3] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative group">
            <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#D9A441] text-[#070707] text-[9px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#070707]" />
              <span>Cinematic Exclusive</span>
            </span>

            <div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#D9A441]/20 text-[#D9A441] text-[10px] font-extrabold uppercase tracking-widest border border-[#D9A441]/50 inline-block mb-4">
                Exclusive Masterpiece
              </span>

              <h3 className="text-xl font-serif font-bold text-[#F7E7C4]">Cinematic Pass</h3>
              <p className="text-xs text-[#FDF6F3]/70 mt-1">Exclusive 480-Frame Apple-Style Scroll Sequence invitation.</p>

              <div className="flex items-baseline gap-1 my-5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#D9A441]">₹2000</span>
                <span className="text-xs text-[#FDF6F3]/70 font-medium">/ 1 Full Year</span>
              </div>

              <hr className="border-t border-[#D9A441]/30 mb-5" />

              <ul className="space-y-2.5 text-xs text-[#FDF6F3]/90">
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                  <span><strong>Includes Exclusive 480-Frame Scroll Template</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                  <span><strong>5 Total Invitation Template Slots</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                  <span><strong>10 High-Res Instagram Announcement Cards</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                  <span><strong>Invite Unlimited Guests via WhatsApp</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                  <span><strong>Active for 1 Full Year (12 Months)</strong></span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handlePay("CINEMATIC_2000")}
              disabled={loadingPlan !== null}
              className="mt-8 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] text-[#070707] text-xs font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,164,65,0.4)] disabled:opacity-50"
            >
              {loadingPlan === "CINEMATIC_2000" ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#070707]" />
                  <span>Pay ₹2000 & Unlock Cinematic</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security Guarantee */}
        <div className="mt-14 max-w-xl mx-auto p-4 bg-[#EFE7D8] border border-[#D9A441]/30 rounded-2xl flex items-center justify-center gap-3 text-xs text-[#221C17]/70 font-semibold text-center">
          <ShieldCheck className="w-5 h-5 text-[#7A1F2B] shrink-0" />
          <span>Encrypted 256-bit SSL Payment Gateway powered by Razorpay (UPI, GPay, Cards, NetBanking)</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F8F3EA] text-xs font-bold text-[#7A1F2B]">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
