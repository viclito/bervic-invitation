"use client";

import { useEffect } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function MobileGoogleAuthPage() {
  useEffect(() => {
    // Automatically trigger NextAuth Google sign in with callback to mobile bridge
    signIn("google", {
      callbackUrl: "/api/auth/mobile-bridge/success",
    });
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-slate-200 shadow-sm mb-4 flex items-center justify-center">
        <Image
          src="/images/logo.png"
          alt="Bervic Logo"
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        Connecting with Google...
      </h2>
      <p className="text-slate-500 text-sm mb-6">
        Redirecting to secure Google Cloud authentication
      </p>
      <div className="w-8 h-8 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
    </div>
  );
}
