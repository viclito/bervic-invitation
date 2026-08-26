"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, CheckCircle2, RefreshCw } from "lucide-react";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailParam, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailParam }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      setSuccess("New OTP code sent to your email!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error resending OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-red-100/80 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-red-950/10 relative overflow-hidden text-center backdrop-blur-xs">
      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-red-50/80 p-2 shadow-xs border border-red-200 flex items-center justify-center mx-auto mb-4">
        <img src="/logo.svg" alt="Bervic Logo" className="w-full h-full object-contain" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">Enter Verification Code</h1>
      <p className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
        We sent a 6-digit OTP code to: <br />
        <strong className="text-[#991B1B] font-semibold">{emailParam || "your email"}</strong>
      </p>

      {error && (
        <div className="mt-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-[#991B1B] text-xs font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleVerify} className="mt-8 space-y-6">
        <div>
          <input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="• • • • • •"
            className="w-full text-center py-4 rounded-2xl bg-slate-50 border-2 border-red-200 text-3xl font-bold tracking-[10px] text-[#991B1B] focus:outline-none focus:border-[#991B1B] focus:bg-white placeholder:tracking-normal placeholder:text-lg transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length < 6}
          className="w-full py-4 rounded-2xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{loading ? "Verifying..." : "Verify & Continue"}</span>
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-[#991B1B] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
          <span>Resend OTP Code</span>
        </button>

        <Link href="/auth/register" className="text-slate-500 hover:text-slate-900">
          Change Email
        </Link>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50/70 via-white to-red-50/40 text-slate-900 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <Navbar />
      <main className="flex-1 flex items-center justify-center py-28 px-4 sm:px-6 relative z-10">
        <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-[#991B1B]">Loading verification form...</div>}>
          <VerifyOtpContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
