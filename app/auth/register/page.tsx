"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to OTP verification page
      router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err?.message || "Something went wrong during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F3EA] text-[#221C17]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-28 px-4 sm:px-6">
        <div className="w-full max-w-md bg-[#F8F3EA] border-2 border-[#D9A441]/40 rounded-3xl p-8 sm:p-10 card-shadow relative overflow-hidden">
          {/* Top Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white p-1 shadow-md border-2 border-[#D9A441]/50 flex items-center justify-center mx-auto mb-3">
              <img src="/logo.png" alt="Bervic Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-bold text-[#221C17]">Create Your Account</h1>
            <p className="text-sm text-[#221C17]/70 mt-1 font-medium">
              Start creating & sharing digital invitations in minutes
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-[#7A1F2B]/10 border border-[#7A1F2B]/30 text-[#7A1F2B] text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/templates" })}
            className="w-full py-3.5 px-4 rounded-full border-2 border-[#D9A441]/50 bg-[#F8F3EA] text-[#221C17] text-sm font-semibold hover:border-[#D9A441] hover:bg-[#F4EBDB] transition-all flex items-center justify-center gap-3 shadow-sm mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>Register with Google</span>
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-[1px] bg-[#D9A441]/30" />
            <span className="text-xs uppercase text-[#221C17]/50 font-bold tracking-wider">or fill details</span>
            <div className="flex-1 h-[1px] bg-[#D9A441]/30" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#221C17]/80 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7A1F2B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Terance"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8F3EA] border border-[#D9A441]/40 text-sm focus:outline-none focus:border-[#7A1F2B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#221C17]/80 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7A1F2B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8F3EA] border border-[#D9A441]/40 text-sm focus:outline-none focus:border-[#7A1F2B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#221C17]/80 mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#7A1F2B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8F3EA] border border-[#D9A441]/40 text-sm focus:outline-none focus:border-[#7A1F2B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#221C17]/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A1F2B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F8F3EA] border border-[#D9A441]/40 text-sm focus:outline-none focus:border-[#7A1F2B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-maroon w-full py-4 text-sm font-semibold flex items-center justify-center gap-2 mt-6 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#D9A441]" />
              <span>{loading ? "Creating Account..." : "Register & Verify Email"}</span>
              <ArrowRight className="w-4 h-4 text-[#D9A441]" />
            </button>
          </form>

          <p className="text-center text-xs text-[#221C17]/70 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-bold text-[#7A1F2B] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
