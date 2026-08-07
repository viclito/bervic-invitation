"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-24 pb-16 px-[10px]">
      {/* Background Video Container with 10px Whitespace Margin on Left & Right */}
      <div className="absolute inset-y-0 left-[10px] right-[10px] top-[10px] rounded-3xl overflow-hidden z-0 card-shadow">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/hero-poster.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-loop.webm" type="video/webm" />
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
          {/* Fallback image if video fails to load */}
          <Image
            src="/videos/hero-poster.jpg"
            alt="Utsav Indian celebration background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </video>

        {/* Clear Warm Cream and Dark Overlay Gradient (NO BLUR) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#221C17]/90 via-[#221C17]/40 to-[#221C17]/60" />
      </div>

      {/* Decorative Gold Corner Motifs */}
      <div className="absolute top-28 left-10 w-32 h-32 pointer-events-none opacity-30 hidden lg:block z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#D9A441]" strokeWidth="1">
          <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="30" />
          <path d="M50 5 L50 95 M5 50 L95 50" />
        </svg>
      </div>

      <div className="absolute bottom-20 right-10 w-32 h-32 pointer-events-none opacity-30 hidden lg:block z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[#D9A441]" strokeWidth="1">
          <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="30" />
          <path d="M50 5 L50 95 M5 50 L95 50" />
        </svg>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 text-center text-white">
        {/* Eyebrow Label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9A441]/20 border border-[#D9A441]/50 text-[#D9A441] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-6 shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Invitations Made Simple</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F8F3EA] leading-[1.15] mb-6 drop-shadow-md"
        >
          Every celebration deserves <br className="hidden sm:inline" />
          a <span className="font-accent text-[#D9A441] font-normal tracking-wide">beautiful invitation.</span>
        </motion.h1>

        {/* Supporting Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl text-[#F8F3EA]/95 max-w-2xl mx-auto font-normal leading-relaxed mb-10 drop-shadow-sm"
        >
          Create stunning invitations for weddings, birthdays, religious functions,
          and every occasion in minutes. No design skills needed.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
        >
          <Link
            href="/templates"
            className="btn-maroon px-8 py-4 text-base font-semibold flex items-center justify-center gap-3 w-full sm:w-auto shadow-xl"
          >
            <span>Create Invitation</span>
            <ArrowRight className="w-5 h-5 text-[#D9A441]" />
          </Link>
          <Link
            href="/templates"
            className="btn-outline-cream px-8 py-4 text-base font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span>See Templates</span>
          </Link>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2 opacity-80">
        <div className="w-5 h-9 rounded-full border-2 border-[#D9A441]/70 flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[#D9A441]"
          />
        </div>
      </div>
    </section>
  );
}
