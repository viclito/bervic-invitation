"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/templates";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const cleanEmail = email.toLowerCase().trim();
      const res = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl });
  };

  return (
    <div className="max-w-md w-full bg-[#F8F3EA] border-2 border-[#D9A441]/40 rounded-3xl p-8 sm:p-10 card-shadow space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white p-1 shadow-md border-2 border-[#D9A441]/50 flex items-center justify-center mx-auto">
          <img src="/logo.png" alt="Bervic Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-[#221C17]">Welcome Back</h1>
        <p className="text-xs text-[#221C17]/70">
          Sign in to manage and customize your Bervic invitations
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-[#7A1F2B]/10 border border-[#7A1F2B]/30 text-[#7A1F2B] text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Google OAuth Login Option */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full py-3 px-4 rounded-2xl bg-white border border-[#D9A441]/40 text-[#221C17] font-semibold text-xs flex items-center justify-center gap-3 hover:bg-[#EFE7D8]/50 transition-all shadow-sm"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-[#D9A441]/30 w-full" />
        <span className="bg-[#F8F3EA] px-3 text-[11px] text-[#221C17]/50 font-bold uppercase tracking-wider">
          OR EMAIL
        </span>
      </div>

      {/* Credentials Email/Password Login Form */}
      <form onSubmit={handleCredentialsLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#221C17]/80 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs focus:outline-none focus:border-[#7A1F2B]"
            />
            <Mail className="w-4 h-4 text-[#7A1F2B] absolute left-3.5 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#221C17]/80 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F3EA] border border-[#D9A441]/40 text-xs focus:outline-none focus:border-[#7A1F2B]"
            />
            <Lock className="w-4 h-4 text-[#7A1F2B] absolute left-3.5 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-maroon w-full py-3.5 text-xs font-bold flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
          <ArrowRight className="w-4 h-4 text-[#D9A441]" />
        </button>
      </form>

      <p className="text-center text-xs text-[#221C17]/70">
        Don't have an account yet?{" "}
        <Link
          href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="text-[#7A1F2B] font-bold underline"
        >
          Create Free Account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EA] text-[#221C17]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-28 relative">
        <Suspense fallback={<div className="text-xs font-bold text-[#7A1F2B]">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
