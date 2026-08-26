"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-24 px-4 sm:px-8 lg:px-14 bg-white overflow-hidden min-h-[90vh] sm:min-h-screen">
      {/* Full Hero Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/hero-invitation-mockup.jpg"
          alt="Luxury Wedding Invitation Showcase Background"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-[75%_center] sm:object-[80%_center] md:object-center"
          sizes="100vw"
        />

        {/* Mobile-only background overlay for text legibility (completely hidden on desktop) */}
        <div className="absolute inset-0 bg-white/80 sm:bg-white/60 md:hidden pointer-events-none" />

        {/* Soft bottom seamless gradient blend on mobile */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent md:hidden pointer-events-none" />
      </div>

      {/* Decorative Subtle Motifs */}
      <div className="absolute top-16 left-6 sm:left-12 w-36 h-36 pointer-events-none opacity-20 hidden lg:block z-0">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-slate-300" strokeWidth="0.8">
          <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="30" />
          <path d="M50 5 L50 95 M5 50 L95 50" />
        </svg>
      </div>

      {/* Hero Container */}
      <div className="relative z-10 max-w-[1380px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Main Content Column */}
        <div className="lg:col-span-7 xl:col-span-6 text-center lg:text-left space-y-6 sm:space-y-7 flex flex-col items-center lg:items-start z-20 py-2 sm:py-0">
          {/* Badge: INVITATIONS MADE SIMPLE */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-50/95 border border-red-200 text-[#991B1B] text-xs sm:text-sm font-extrabold tracking-widest uppercase shadow-xs backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-[#991B1B]" />
            <span>INVITATIONS MADE SIMPLE</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[34px] xs:text-[40px] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.18] sm:leading-[1.15]"
          >
            Every celebration deserves{" "}
            <span className="font-serif italic font-normal text-[#991B1B] block sm:inline mt-1.5 sm:mt-0">
              a beautiful invitation.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg lg:text-xl text-slate-700 max-w-xl font-medium leading-relaxed"
          >
            Create stunning digital &amp; traditional printed invitations for weddings, birthdays, religious celebrations, and special occasions in minutes.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto"
          >
            <Link
              href="/templates"
              className="px-9 py-4 sm:py-4.5 rounded-full bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold text-sm sm:text-base tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-red-900/25 w-full sm:w-auto group cursor-pointer"
            >
              <span>CREATE INVITATION</span>
              <ArrowRight className="w-4.5 h-4.5 text-amber-300 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link
              href="/templates"
              className="px-9 py-4 sm:py-4.5 rounded-full bg-white/95 hover:bg-white border-2 border-slate-200 hover:border-[#991B1B] text-[#991B1B] font-extrabold text-sm sm:text-base tracking-wider uppercase flex items-center justify-center transition-all duration-300 shadow-sm backdrop-blur-xs w-full sm:w-auto cursor-pointer"
            >
              <span>SEE TEMPLATES</span>
            </Link>
          </motion.div>

          {/* Social Proof / Micro Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3 text-xs sm:text-sm text-slate-700 font-semibold"
          >
            <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full border border-slate-200 shadow-2xs backdrop-blur-sm">
              <ShieldCheck className="w-4 h-4 text-[#991B1B]" />
              <span>Anti-Reuse Protection</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full border border-slate-200 shadow-2xs backdrop-blur-sm">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>10,000+ Happy Couples</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Open space to showcase the devices and floral ribbons in the background */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-6 min-h-[350px] pointer-events-none" />
      </div>

      {/* Scroll Down Mouse Indicator for Desktop */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-1 opacity-70 pointer-events-none">
        <div className="w-5 h-8 rounded-full border-2 border-[#991B1B] flex justify-center p-1 bg-white/60 backdrop-blur-xs">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[#991B1B]"
          />
        </div>
      </div>
    </section>
  );
}
