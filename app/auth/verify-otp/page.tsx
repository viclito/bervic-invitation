"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { KeyRound, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";

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
    } catch (err: any) {
      setError(err?.message || "Failed to verify OTP");
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
    } catch (err: any) {
      setError(err?.message || "Error resending OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#F8F3EA] border-2 border-[#D9A441]/40 rounded-3xl p-8 sm:p-10 card-shadow relative overflow-hidden text-center">
      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white p-1 shadow-md border-2 border-[#D9A441]/50 flex items-center justify-center mx-auto mb-4">
        <img src="/logo.png" alt="Bervic Logo" className="w-full h-full object-contain" />
      </div>

      <h1 className="text-3xl font-bold text-[#221C17]">Enter Verification Code</h1>
      <p className="text-sm text-[#221C17]/70 mt-2 font-medium">
        We sent a 6-digit OTP code to: <br />
        <strong className="text-[#7A1F2B] font-semibold">{emailParam || "your email"}</strong>
      </p>

      {error && (
        <div className="mt-6 p-3.5 rounded-2xl bg-[#7A1F2B]/10 border border-[#7A1F2B]/30 text-[#7A1F2B] text-xs font-semibold">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-6 p-3.5 rounded-2xl bg-[#5B8C69]/15 border border-[#5B8C69]/40 text-[#375B42] text-xs font-semibold flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#5B8C69]" />
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
            className="w-full text-center py-4 rounded-2xl bg-[#F8F3EA] border-2 border-[#D9A441] text-3xl font-bold tracking-[10px] text-[#7A1F2B] focus:outline-none focus:border-[#7A1F2B] placeholder:tracking-normal placeholder:text-lg"
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length < 6}
          className="btn-maroon w-full py-4 text-sm font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-[#D9A441]" />
          <span>{loading ? "Verifying..." : "Verify & Continue"}</span>
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-[#D9A441]/20 flex items-center justify-between text-xs">
        <button
          onClick={handleResend}
          disabled={resending}
          className="text-[#7A1F2B] font-semibold hover:underline flex items-center gap-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
          <span>Resend OTP Code</span>
        </button>

        <Link href="/auth/register" className="text-[#221C17]/60 hover:text-[#221C17]">
          Change Email
        </Link>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EA] text-[#221C17]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-28 px-4 sm:px-6">
        <Suspense fallback={<div className="p-8 text-center text-sm font-semibold text-[#7A1F2B]">Loading verification form...</div>}>
          <VerifyOtpContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
