"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-8 lg:px-12 bg-[#F8F3EA] overflow-hidden min-h-0 sm:min-h-screen">
      {/* Warm Silk Background Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/hero-bg-texture.png"
          alt="Warm Cream Silk & Floral Background"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center opacity-95"
          sizes="100vw"
        />
        {/* Soft bottom gradient blend */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F8F3EA] to-transparent pointer-events-none" />
      </div>

      {/* Integrated Tilted Background Mockup Layer for Mobile & Laptop Screens */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center opacity-25 sm:opacity-15">
        <Image
          src="/images/hero-phone-isolated.png"
          alt="Tilted Background Watermark Mockup"
          width={550}
          height={1100}
          loading="lazy"
          className="w-[290px] sm:w-[420px] lg:w-[480px] max-w-none transform -rotate-12 translate-y-2 drop-shadow-md"
        />
      </div>

      {/* Decorative Crosshair Motifs for Desktop */}
      <div className="absolute top-14 left-6 sm:left-12 w-36 h-36 pointer-events-none opacity-20 hidden sm:block z-0">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#94A3B8]" strokeWidth="0.8">
          <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="30" />
          <path d="M50 5 L50 95 M5 50 L95 50" />
        </svg>
      </div>

      <div className="absolute bottom-6 right-6 sm:right-12 w-36 h-36 pointer-events-none opacity-20 hidden sm:block z-0">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#94A3B8]" strokeWidth="0.8">
          <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="30" />
          <path d="M50 5 L50 95 M5 50 L95 50" />
        </svg>
      </div>

      {/* Hero Container */}
      <div className="relative z-10 max-w-[1380px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Main Content Column */}
        <div className="lg:col-span-7 xl:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6 flex flex-col items-center lg:items-start z-20 pointer-events-auto">
          {/* Stitch Badge: INVITATIONS MADE SIMPLE */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7E121D]/10 border border-[#7E121D]/20 text-[#7E121D] text-xs font-bold tracking-widest uppercase shadow-xs backdrop-blur-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7E121D]" />
            <span>INVITATIONS MADE SIMPLE</span>
          </motion.div>

          {/* Stitch Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.15]"
          >
            Every celebration deserves{" "}
            <span className="font-serif italic font-normal text-[#7E121D] block sm:inline mt-1 sm:mt-0">
              a beautiful invitation.
            </span>
          </motion.h1>

          {/* Stitch Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl font-normal leading-relaxed"
          >
            Create stunning invitations for weddings, birthdays, religious functions, and every occasion in minutes. No design skills needed.
          </motion.p>

          {/* Stitch Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto"
          >
            <Link
              href="/templates"
              onClick={(e) => {
                const hasDetails = typeof window !== "undefined" && localStorage.getItem("bervic_user_has_details") === "true";
                if (!hasDetails) {
                  e.preventDefault();
                  const el = document.getElementById("details-form");
                  if (el) {
                    if ((window as any).lenis) {
                      (window as any).lenis.scrollTo(el, { offset: -80 });
                    } else {
                      const rect = el.getBoundingClientRect();
                      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                      window.scrollTo({ top: Math.max(0, rect.top + scrollTop - 80), behavior: "smooth" });
                    }
                  } else {
                    window.location.href = "/?redirectFromTemplates=true#details-form";
                  }
                }
              }}
              className="px-8 py-3.5 sm:py-4 rounded-full bg-[#7E121D] hover:bg-[#680E17] text-white font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all duration-300 shadow-lg shadow-rose-900/20 w-full sm:w-auto group cursor-pointer"
            >
              <span>CREATE INVITATION</span>
              <ArrowRight className="w-4 h-4 text-[#FED7AA] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/templates"
              onClick={(e) => {
                const hasDetails = typeof window !== "undefined" && localStorage.getItem("bervic_user_has_details") === "true";
                if (!hasDetails) {
                  e.preventDefault();
                  const el = document.getElementById("details-form");
                  if (el) {
                    if ((window as any).lenis) {
                      (window as any).lenis.scrollTo(el, { offset: -80 });
                    } else {
                      const rect = el.getBoundingClientRect();
                      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                      window.scrollTo({ top: Math.max(0, rect.top + scrollTop - 80), behavior: "smooth" });
                    }
                  } else {
                    window.location.href = "/?redirectFromTemplates=true#details-form";
                  }
                }
              }}
              className="px-8 py-3.5 sm:py-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-[#7E121D] font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center transition-all duration-300 shadow-xs w-full sm:w-auto cursor-pointer"
            >
              <span>SEE TEMPLATES</span>
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Desktop Tilted Phone Mockup */}
        <div className="hidden sm:flex lg:col-span-5 xl:col-span-5 justify-center lg:justify-end items-center relative z-10 mt-2 lg:mt-0">
          {/* Soft Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#D9A441]/15 via-[#FED7AA]/25 to-purple-200/20 rounded-full blur-3xl opacity-80 scale-135 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: -12, y: 16 }}
            animate={{ opacity: 1, scale: 1, rotate: -12, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[480px] xl:max-w-[540px] flex justify-center lg:justify-end transform origin-center"
          >
            <div className="relative w-full flex justify-center lg:justify-end">
              <Image
                src="/images/hero-phone-isolated.png"
                alt="Wedding Invitation Mobile Mockup"
                width={600}
                height={1200}
                priority
                className="w-full h-[60vh] sm:h-[68vh] lg:h-[76vh] xl:h-[80vh] object-contain drop-shadow-xl scale-110 lg:scale-115 transform origin-center"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Mouse Indicator for Desktop */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-1 opacity-80 pointer-events-none">
        <div className="w-5 h-8 rounded-full border-2 border-[#7E121D] flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[#7E121D]"
          />
        </div>
      </div>
    </section>
  );
}
