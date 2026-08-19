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
  const isCinematicRequired = templateSlug === "scroll-scrubber" || templateSlug === "premium-scroll" || initialPlan === "CINEMATIC_2000";

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const existing = document.getElementById("razorpay-sdk");
      if (existing) {
        existing.addEventListener("load", () => resolve(true));
        existing.addEventListener("error", () => resolve(false));
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handlePay = async (plan: "BASIC_599" | "PRO_1799" | "CINEMATIC_2000" | "CARDS_99") => {
    if (status !== "authenticated") {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(`/checkout?plan=${plan}`)}`);
      return;
    }

    setLoadingPlan(plan);
    setErrorMsg(null);

    try {
      // Ensure Razorpay SDK is ready
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error("Payment gateway could not load. Please check your internet connection and refresh.");
      }

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
        CARDS_99: "Instagram Post Cards Pass (₹99 - 5 Credits)",
        BASIC_599: "Basic Pass (₹599 - 6 Months)",
        PRO_1799: "Pro Annual Pass (₹1799 - 1 Year)",
        CINEMATIC_2000: "Cinematic Pass (₹2000 - 1 Year)",
      };

      // 2. Open Razorpay Widget
      const options: any = {
        key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TJjdhQ40H2NION",
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Bervic Invitations",
        description: planDescriptions[plan] || "Bervic Subscription Pass",
        order_id: data.orderId,
        prefill: {
          name: data.user?.name || session?.user?.name || "",
          email: data.user?.email || session?.user?.email || "",
          contact: data.user?.phone || "",
        },
        theme: {
          color: "#991B1B",
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
            if (plan === "CARDS_99") {
              router.push("/cards?payment=success");
            } else if (templateSlug) {
              router.push(`/templates/${templateSlug}?payment=success`);
            } else {
              router.push("/templates?payment=success");
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

      const RazorpayConstructor = (window as any).Razorpay;
      if (RazorpayConstructor) {
        const rzp = new RazorpayConstructor(options);
        rzp.on("payment.failed", function (failResponse: any) {
          setErrorMsg(failResponse?.error?.description || "Payment was cancelled or failed.");
          setLoadingPlan(null);
        });
        rzp.open();
      } else {
        throw new Error("Razorpay SDK is not available. Please refresh.");
      }
    } catch (err: any) {
      console.error("Checkout Error:", err);
      setErrorMsg(err?.message || "Failed to initiate payment.");
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      <Navbar />

      {/* Decorative Red Background Accents */}
      <div className="relative overflow-hidden flex-1">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-red-50/80 via-red-50/30 to-transparent -z-10 pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#991B1B]/5 blur-3xl rounded-full -z-10 pointer-events-none" />

        <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 pt-36 pb-20">
          {/* Banner Alert if redirected because payment required */}
          {isRequired && (
            <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center justify-between gap-4 text-[#991B1B]">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 shrink-0 text-[#991B1B]" />
                <div>
                  <h4 className="font-bold text-sm">Subscription Required to Edit & Save</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Explore all available templates below. Choose a plan to customize, save, and send personalized WhatsApp invitations!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cards Pass Special Banner */}
          {initialPlan === "CARDS_99" && (
            <div className="mb-10 max-w-4xl mx-auto p-5 rounded-2xl bg-[#991B1B] text-white border-2 border-red-300 shadow-[0_10px_30px_rgba(153,27,27,0.3)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-up">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-amber-300 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                    <span>📸 INSTAGRAM ANNOUNCEMENT CARDS PASS SELECTED</span>
                  </h4>
                  <p className="text-xs text-white/90 mt-0.5">
                    You selected the <strong>₹99 Instagram Cards Pass</strong>. Get <strong>5 High-Res Card Credits</strong> with full access to 31+ presets &amp; instant PNG/PDF downloads.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handlePay("CARDS_99")}
                disabled={loadingPlan !== null}
                className="px-6 py-3 rounded-xl bg-white text-[#991B1B] text-xs font-extrabold shrink-0 uppercase tracking-wider hover:bg-red-50 transition-all shadow-md hover:scale-105 cursor-pointer"
              >
                {loadingPlan === "CARDS_99" ? "Processing..." : "Pay ₹99 Now"}
              </button>
            </div>
          )}

          {/* Cinematic Template Special Banner */}
          {isCinematicRequired && (
            <div className="mb-10 max-w-4xl mx-auto p-5 rounded-2xl bg-[#1A0507] border-2 border-[#991B1B] text-white shadow-[0_10px_30px_rgba(153,27,27,0.35)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-200 flex items-center gap-1.5 justify-center sm:justify-start">
                    <span>🎬 CINEMATIC SCROLL TEMPLATE SELECTED</span>
                  </h4>
                  <p className="text-xs text-white/80 mt-0.5">
                    You selected the <strong>Cinematic 480-Frame Scroll Sequence</strong> template. This exclusive template requires the <strong>₹2000 Cinematic Masterpiece Pass</strong>.
                  </p>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#991B1B] text-white text-xs font-extrabold shrink-0 uppercase tracking-wider border border-red-400/50">
                ₹2000 Pass Required
              </span>
            </div>
          )}

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-[#991B1B] border border-red-200 text-xs font-bold uppercase tracking-widest mb-3">
              <Crown className="w-3.5 h-3.5 text-[#991B1B]" />
              <span>Official Subscription Pass</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-slate-950 leading-tight">
              Choose Your <span className="text-[#991B1B] italic">Bervic Pass</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-3">
              Unlock 1-click customization, personalized WhatsApp guest invitations, and high-res PDF exports.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-8 max-w-2xl mx-auto p-4 bg-red-50 border border-red-300 rounded-xl text-red-800 text-xs font-semibold text-center">
              {errorMsg}
            </div>
          )}

          {/* Unauthenticated Login Prompt Banner */}
          {status === "unauthenticated" && (
            <div className="mb-10 max-w-2xl mx-auto p-4 bg-red-50/80 border border-red-200 rounded-2xl flex items-center justify-between gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#991B1B]" />
                <span className="text-slate-800">Log in to your account before choosing a plan.</span>
              </div>
              <Link
                href={`/auth/login?callbackUrl=${encodeURIComponent("/checkout")}`}
                className="px-4 py-2 rounded-xl bg-[#991B1B] text-white hover:bg-[#7F1D1D] transition-colors flex items-center gap-1.5 shrink-0 font-bold"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In First</span>
              </Link>
            </div>
          )}

          {/* Free Plan / Try First Banner */}
          <div className="mb-10 max-w-4xl mx-auto p-4 sm:p-5 bg-white border-2 border-red-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:border-red-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#991B1B] flex items-center justify-center shrink-0 border border-red-100">
                <Sparkles className="w-5 h-5 text-[#991B1B]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">Free Explorer Tier</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ₹0 FREE FOREVER
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Every logged-in account gets <strong>2 Free Instagram Card downloads</strong> + unlimited live previews of all digital templates and the shop catalog.
                </p>
              </div>
            </div>
            <Link
              href="/cards"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black transition-colors shrink-0 text-center"
            >
              Start Free (2 Cards)
            </Link>
          </div>

          {/* 4 Plan Cards: ₹99, ₹599, ₹1799, ₹2000 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            
            {/* Plan 1: INSTAGRAM CARDS PASS ₹99 */}
            <div
              className={`bg-white border-2 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                initialPlan === "CARDS_99"
                  ? "border-[#991B1B] ring-4 ring-red-100 shadow-2xl scale-[1.02] z-10"
                  : isCinematicRequired
                  ? "border-slate-200 opacity-40 grayscale select-none"
                  : "border-slate-200 hover:border-[#991B1B] shadow-sm hover:shadow-xl"
              }`}
            >
              {initialPlan === "CARDS_99" && (
                <span className="absolute -top-3.5 right-6 px-3 py-0.5 rounded-full bg-[#991B1B] text-white text-[9px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Selected Pass</span>
                </span>
              )}

              <div>
                <span className="px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-block mb-4 bg-red-50 text-[#991B1B] border border-red-200">
                  Social Post Pass
                </span>

                <h3 className="text-xl font-serif font-bold text-slate-950">Instagram Cards</h3>
                <p className="text-xs text-slate-500 mt-1">
                  For couples needing aesthetic Instagram &amp; WhatsApp status post cards.
                </p>

                <div className="flex items-baseline gap-2 my-5">
                  <span className="line-through text-xs text-slate-400 font-semibold">₹299</span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#991B1B]">₹99</span>
                  <span className="text-xs text-slate-500 font-medium">/ 5 Cards</span>
                </div>

                <hr className="border-t border-slate-100 mb-5" />

                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                    <span><strong>5 High-Res (1080x1080px) Card Downloads</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                    <span><strong>Access to all 31+ Luxury Presets</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                    <span><strong>PNG &amp; Printable PDF Downloads</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                    <span><strong>Card credits never expire</strong></span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePay("CARDS_99")}
                disabled={loadingPlan !== null}
                className="mt-8 w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-[#991B1B] text-white hover:bg-[#7F1D1D] shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {loadingPlan === "CARDS_99" ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Pay ₹99 &amp; Get 5 Cards</span>
                  </>
                )}
              </button>
            </div>

            {/* Plan 2: BASIC ₹599 */}
            <div className={`bg-white border-2 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${isCinematicRequired ? "border-slate-200 opacity-40 grayscale select-none" : "border-slate-200 hover:border-[#991B1B] shadow-sm hover:shadow-xl"}`}>
              <div>
                <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-block mb-4 ${isCinematicRequired ? "bg-slate-100 text-slate-600 border border-slate-200" : "bg-red-50 text-[#991B1B] border border-red-200"}`}>
                  {isCinematicRequired ? "🔒 Standard Only" : "6 Months Validity"}
                </span>

                <h3 className="text-xl font-serif font-bold text-slate-950">Basic Pass</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isCinematicRequired ? "Standard templates only." : "1 luxury invitation website &amp; Instagram cards."}
                </p>

                <div className="flex items-baseline gap-2 my-5">
                  <span className="line-through text-xs text-slate-400 font-semibold">₹1,499</span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#991B1B]">₹599</span>
                  <span className="text-xs text-slate-500 font-medium">/ 6 Months</span>
                </div>

                <hr className="border-t border-slate-100 mb-5" />

                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                    <span><strong>1 Standard Website Slot</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                    <span><strong>Unlimited Edits</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                    <span><strong>2 Instagram Cards</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                    <span><strong>WhatsApp RSVPs</strong></span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePay("BASIC_599")}
                disabled={loadingPlan !== null || isCinematicRequired}
                className={`mt-8 w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${isCinematicRequired ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed" : "bg-red-50 text-[#991B1B] border-2 border-red-200 hover:bg-[#991B1B] hover:text-white shadow-sm disabled:opacity-50 cursor-pointer"}`}
              >
                {isCinematicRequired ? (
                  <span>Requires ₹2000 Pass</span>
                ) : loadingPlan === "BASIC_599" ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-[#991B1B]" />
                    <span>Pay ₹599 &amp; Unlock</span>
                  </>
                )}
              </button>
            </div>

            {/* Plan 3: PRO ₹1799 (Most Popular - Red Themed) */}
            <div className={`bg-white border-2 rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative ${isCinematicRequired ? "border-slate-200 opacity-40 grayscale select-none" : "border-[#991B1B] ring-4 ring-red-100 shadow-2xl scale-[1.02] z-10"}`}>
              {!isCinematicRequired && (
                <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#991B1B] text-white text-[9px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-300" />
                  <span>Most Popular</span>
                </span>
              )}

              <div>
                <span className={`px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest inline-block mb-4 ${isCinematicRequired ? "bg-slate-100 text-slate-600 border border-slate-200" : "bg-red-50 text-[#991B1B] border border-red-200"}`}>
                  {isCinematicRequired ? "🔒 Standard Only" : "1 Year Annual Suite"}
                </span>

                <h3 className="text-xl font-serif font-bold text-slate-950">Pro Annual Pass</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isCinematicRequired ? "Standard templates only." : "Multi-day wedding celebrations."}
                </p>

                <div className="flex items-baseline gap-2 my-5">
                  <span className="line-through text-xs text-slate-400 font-semibold">₹3,499</span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#991B1B]">₹1799</span>
                  <span className="text-xs text-slate-500 font-medium">/ 1 Year</span>
                </div>

                <hr className="border-t border-slate-100 mb-5" />

                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                    <span><strong>4 Standard Website Slots</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                    <span><strong>Unlimited Edits</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                    <span><strong>6 Instagram Cards</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                    <span><strong>8 Printable PDF Exports</strong></span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePay("PRO_1799")}
                disabled={loadingPlan !== null || isCinematicRequired}
                className={`mt-8 w-full py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${isCinematicRequired ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed" : "bg-[#991B1B] text-white hover:bg-[#7F1D1D] shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer"}`}
              >
                {isCinematicRequired ? (
                  <span>Requires ₹2000 Pass</span>
                ) : loadingPlan === "PRO_1799" ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span>Pay ₹1799 &amp; Unlock</span>
                  </>
                )}
              </button>
            </div>

            {/* Plan 4: CINEMATIC ₹2000 EXCLUSIVE (Dark Velvet Red Noir) */}
            <div className={`bg-gradient-to-b from-[#1C0608] via-[#140405] to-[#0A0203] text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative group ${isCinematicRequired ? "border-4 border-red-500 ring-8 ring-red-500/30 scale-[1.04] shadow-[0_0_60px_rgba(153,27,27,0.6)] z-10" : "border-2 border-red-900/60 shadow-2xl"}`}>
              <span className={`absolute -top-3.5 right-6 px-3.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-md flex items-center gap-1 ${isCinematicRequired ? "bg-[#991B1B] text-white animate-bounce" : "bg-[#991B1B] text-white border border-red-400/50"}`}>
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{isCinematicRequired ? "⭐ REQUIRED" : "Cinematic Exclusive"}</span>
              </span>

              <div>
                <span className="px-3.5 py-1.5 rounded-full bg-red-900/50 text-red-200 text-[10px] font-extrabold uppercase tracking-widest border border-red-700/50 inline-block mb-4">
                  {isCinematicRequired ? "🎬 REQUIRED FOR CINEMATIC" : "Exclusive Masterpiece"}
                </span>

                <h3 className="text-xl font-serif font-bold text-red-50">Cinematic Pass</h3>
                <p className="text-xs text-white/70 mt-1">Exclusive 480-Frame Apple-Style Scroll Sequence invitation.</p>

                <div className="flex items-baseline gap-2 my-5">
                  <span className="line-through text-xs text-white/40 font-semibold">₹4,999</span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">₹2000</span>
                  <span className="text-xs text-white/70 font-medium">/ 1 Full Year</span>
                </div>

                <hr className="border-t border-white/10 mb-5" />

                <ul className="space-y-2.5 text-xs text-white/90">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>1 Exclusive 480-Frame Scroll Template</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>1 Premium Website Slot</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>10 High-Res Instagram Cards</strong></span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handlePay("CINEMATIC_2000")}
                disabled={loadingPlan !== null}
                className={`mt-8 w-full py-4 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(153,27,27,0.5)] cursor-pointer ${isCinematicRequired ? "bg-gradient-to-r from-[#991B1B] via-red-600 to-[#991B1B] text-white hover:scale-105 animate-pulse" : "bg-gradient-to-r from-[#991B1B] via-red-600 to-[#991B1B] text-white hover:scale-[1.02]"}`}
              >
                {loadingPlan === "CINEMATIC_2000" ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Pay ₹2000 &amp; Unlock</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Dedicated Micro-Pass: Standalone Instagram Cards Pass (₹99) */}
          <div className="mt-10 max-w-4xl mx-auto bg-gradient-to-r from-[#7F1D1D] via-[#991B1B] to-[#7F1D1D] text-white border-2 border-red-300/40 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3.5 py-1 rounded-full bg-white/15 text-white border border-white/30 text-[10px] font-extrabold uppercase tracking-widest inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Standalone Instagram Card Pass</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Instagram Announcement Cards Pass — ₹99
              </h3>
              <p className="text-xs text-white/85 max-w-lg leading-relaxed">
                Need only Instagram & WhatsApp status post cards? Get <strong>5 High-Res (1080x1080px) Card Credits</strong> for just ₹99 with access to all 31+ design presets, photo upload, and instant PNG/PDF downloads.
              </p>
            </div>

            <button
              onClick={() => handlePay("CARDS_99")}
              disabled={loadingPlan !== null}
              className="w-full md:w-auto px-8 py-4 rounded-2xl bg-white text-[#991B1B] font-extrabold text-xs uppercase tracking-wider hover:bg-red-50 transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 hover:scale-105 cursor-pointer"
            >
              {loadingPlan === "CARDS_99" ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-[#991B1B] fill-current" />
                  <span>Buy 5 Cards for ₹99</span>
                </>
              )}
            </button>
          </div>

          {/* Security Guarantee */}
          <div className="mt-14 max-w-xl mx-auto p-4 bg-red-50/70 border border-red-200 rounded-2xl flex items-center justify-center gap-3 text-xs text-slate-700 font-semibold text-center">
            <ShieldCheck className="w-5 h-5 text-[#991B1B] shrink-0" />
            <span>Encrypted 256-bit SSL Payment Gateway powered by Razorpay (UPI, GPay, Cards, NetBanking)</span>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-xs font-bold text-[#991B1B]">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
