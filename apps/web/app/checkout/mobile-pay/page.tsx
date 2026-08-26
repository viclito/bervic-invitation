"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Lock,
  Sparkles,
  QrCode,
  Loader2,
} from "lucide-react";

function MobilePayContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const keyId =
    searchParams.get("keyId") ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "rzp_test_TJjdhQ40H2NION";
  const plan = searchParams.get("plan") || "PRO_1799";
  const rawAmount = searchParams.get("amount") || "179900";
  const name = searchParams.get("name") || "Bervic Member";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const token = searchParams.get("token") || "";
  const initialStatus = searchParams.get("status");
  const initialMsg = searchParams.get("msg");

  const [isLoadingGateway, setIsLoadingGateway] = useState(false);
  const [status, setStatus] = useState<"ready" | "verifying" | "success" | "error">(
    initialStatus === "success" ? "success" : initialStatus === "error" ? "error" : "ready"
  );
  const [errorMessage, setErrorMessage] = useState(initialMsg || "");

  const planTitles: Record<string, { title: string; badge: string; desc: string }> = {
    CARDS_99: {
      title: "Canva 2D Card Booster Pack",
      badge: "5 EXTRA CARD SLOTS",
      desc: "Instant unlock for 5 high-resolution Instagram & WhatsApp announcement cards.",
    },
    BASIC_599: {
      title: "Royal Basic Suite",
      badge: "6 MONTHS VALIDITY",
      desc: "1 Luxury Wedding Website slot with unlimited RSVPs & personalized guest passes.",
    },
    PRO_1799: {
      title: "Royal Pro Suite",
      badge: "1 YEAR ANNUAL PASS",
      desc: "3 Luxury Wedding Websites, 10 Canva 2D Cards & Multi-Event Scheduler.",
    },
    CINEMATIC_2000: {
      title: "Royal Cinematic 480 Suite",
      badge: "480p SCROLL SUITE",
      desc: "Apple-style 480-frame interactive video sequence & VIP features.",
    },
  };

  const planInfo = planTitles[plan] || {
    title: "Bervic Royal Membership",
    badge: "ROYAL PASS",
    desc: "Premium digital invitations & card generator slots.",
  };

  // Convert amount safely from paise or rupees
  const parsed = parseInt(rawAmount, 10) || 9900;
  const amountInRupees = parsed >= 100 ? Math.round(parsed / 100) : parsed;
  const amountInPaise = amountInRupees * 100;
  const displayAmount = amountInRupees.toLocaleString("en-IN");

  const handleOpenRazorpay = () => {
    if (!orderId) {
      setStatus("error");
      setErrorMessage("No active order ID received. Please return to the app and select your plan again.");
      return;
    }

    const RazorpayConstructor = typeof window !== "undefined" ? (window as any).Razorpay : null;
    if (!RazorpayConstructor) {
      setStatus("error");
      setErrorMessage("Razorpay payment gateway is initializing. Please wait a moment and tap pay again.");
      return;
    }

    setIsLoadingGateway(true);
    setErrorMessage("");

    try {
      const options: any = {
        key: keyId || "rzp_test_TJjdhQ40H2NION",
        amount: amountInPaise,
        currency: "INR",
        name: "Bervic Invitations",
        description: planInfo.title,
        order_id: orderId,
        prefill: {
          name: name || "Customer",
          email: email || "",
          contact: phone || "",
        },
        theme: {
          color: "#991B1B",
        },
        modal: {
          ondismiss: function () {
            setIsLoadingGateway(false);
          },
        },
        handler: async function (response: any) {
          setIsLoadingGateway(false);
          setStatus("verifying");
          try {
            const headers: Record<string, string> = {
              "Content-Type": "application/json",
            };
            if (token) {
              headers["Authorization"] = `Bearer ${token}`;
            }

            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers,
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

            setStatus("success");
          } catch (err: any) {
            setStatus("error");
            setErrorMessage(err?.message || "Payment verification failed.");
          }
        },
      };

      const rzp = new RazorpayConstructor(options);
      rzp.on("payment.failed", function (response: any) {
        setIsLoadingGateway(false);
        setStatus("error");
        setErrorMessage(response?.error?.description || "Payment was declined or cancelled.");
      });
      rzp.open();
      setIsLoadingGateway(false);
    } catch (err: any) {
      setIsLoadingGateway(false);
      setStatus("error");
      setErrorMessage(err?.message || "Failed to launch Razorpay gateway.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF2F2] via-[#FFF1F2] to-[#FFFFFF] text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-white p-2.5 shadow-md border border-red-100 flex items-center justify-center mb-2.5">
          <Image
            src="/images/logo.svg"
            alt="Bervic Logo"
            width={64}
            height={64}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1 font-serif">
          Bervic
          <span className="w-2 h-2 rounded-full bg-[#991B1B] inline-block"></span>
        </h1>
        <p className="text-[11px] font-bold text-red-700 tracking-widest uppercase mt-0.5">
          Luxury Indian Invitations
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-md w-full bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(220,38,38,0.08)] border border-red-100 text-center">
        {status === "success" ? (
          <div className="py-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/10">
              <CheckCircle2 size={46} />
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase px-3 py-1 rounded-full mb-2">
              Payment Verified & Active
            </span>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Complete! 🎉</h2>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed px-2">
              Your <span className="font-bold text-slate-900">{planInfo.title}</span> is now active. All invitation slots and features have been unlocked.
            </p>

            <a
              href="bervic://(tabs)/profile?payment=success"
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold rounded-2xl block transition-all shadow-xl shadow-emerald-600/25 text-sm tracking-wider uppercase"
            >
              Return to Bervic App
            </a>
          </div>
        ) : status === "verifying" ? (
          <div className="py-12 flex flex-col items-center">
            <div className="w-14 h-14 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
            <h2 className="text-lg font-black text-slate-900 mb-1">Verifying Payment...</h2>
            <p className="text-xs text-slate-500">Activating your subscription quotas in real time.</p>
          </div>
        ) : (
          <div>
            {/* Plan Badge & Header */}
            <div className="flex flex-col items-center pb-5 mb-5 border-b border-red-100">
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                <Sparkles size={11} />
                {planInfo.badge}
              </span>
              <h3 className="text-lg font-black text-slate-900 mb-1">{planInfo.title}</h3>
              <p className="text-xs text-slate-500 mb-4 px-2">{planInfo.desc}</p>

              {/* Big Price Tag */}
              <div className="bg-red-50/80 border border-red-100 rounded-2xl px-6 py-3 w-full flex items-baseline justify-center gap-1">
                <span className="text-sm font-extrabold text-red-600">₹</span>
                <span className="text-4xl font-black text-red-600 tracking-tight">{displayAmount}</span>
                <span className="text-xs font-bold text-slate-500 ml-1">Total Payable</span>
              </div>
            </div>

            {/* Order Info Rows */}
            <div className="bg-slate-50/80 rounded-2xl p-4 mb-6 text-left border border-slate-100 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Order Reference:</span>
                <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                  {orderId ? orderId.slice(0, 16) : "Pending"}...
                </span>
              </div>
              {name && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Customer:</span>
                  <span className="font-bold text-slate-800">{name}</span>
                </div>
              )}
              {email && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Account:</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[180px]">{email}</span>
                </div>
              )}
            </div>

            {/* Error Notice */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4 text-left">
                <AlertCircle size={16} className="text-red-600 shrink-0" />
                <p className="text-xs text-red-700 font-medium">{errorMessage}</p>
              </div>
            )}

            {/* Primary Pay Button */}
            <button
              type="button"
              onClick={handleOpenRazorpay}
              disabled={isLoadingGateway}
              className="w-full py-4 bg-gradient-to-r from-red-600 via-red-700 to-rose-800 hover:from-red-700 hover:to-rose-900 active:scale-[0.98] disabled:opacity-75 text-white font-extrabold rounded-2xl transition-all shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 text-sm tracking-wider uppercase mb-4 cursor-pointer"
            >
              {isLoadingGateway ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Opening Gateway...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>Pay ₹{displayAmount} via Razorpay</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Security & Payment Methods */}
            <div className="flex flex-col items-center gap-2 pt-2 text-[11px] text-slate-500 font-semibold">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck size={13} />
                  256-Bit SSL Encrypted
                </span>
                <span className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                  <QrCode size={13} />
                  UPI / GPay / PhonePe / Cards
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MobilePayPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FEF2F2] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MobilePayContent />
    </Suspense>
  );
}
