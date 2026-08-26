"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Calendar } from "lucide-react";

interface HeroProps {
  partnerOne: string;
  partnerTwo: string;
  tagline: string;
  inviteLine: string;
  weddingTime: string;
  heroImage: string;
}

export default function Hero({
  partnerOne,
  partnerTwo,
  tagline,
  inviteLine,
  weddingTime,
  heroImage,
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 px-4 overflow-hidden bg-[#FDF6F3]"
    >
      {/* Background Floral Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src={heroImage?.trim() || "/images/templates/floral-hero.jpg"}
          alt="Floral wedding template hero background"
          fill
          priority
          unoptimized={(heroImage?.trim() || "").startsWith("http")}
          sizes="100vw"
          className="object-cover"
        />
        {/* Soft Romantic Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDF6F3] via-[#FDF6F3]/80 to-[#FDF6F3]/60" />
      </div>

      {/* Decorative Floral Accent Borders */}
      <div className="absolute top-6 left-6 w-24 h-24 border-t-2 border-l-2 border-[#C9A15A]/40 pointer-events-none rounded-tl-3xl hidden sm:block" />
      <div className="absolute bottom-6 right-6 w-24 h-24 border-b-2 border-r-2 border-[#C9A15A]/40 pointer-events-none rounded-br-3xl hidden sm:block" />

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-[850px] mx-auto text-center px-4">
        {/* Tagline / Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block px-4 py-1.5 rounded-full bg-[#B85C6B]/10 border border-[#C9A15A]/40 text-[#B85C6B] text-xs uppercase tracking-widest font-semibold mb-8"
        >
          {tagline}
        </motion.div>

        {/* Large Couple Names Stacked with Heart Divider */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2 mb-8"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-accent font-normal text-[#2B2320] tracking-tight leading-none">
            {partnerOne}
          </h1>

          <div className="flex items-center justify-center gap-4 py-2">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#C9A15A]" />
            <Heart className="w-6 h-6 text-[#B85C6B] fill-current animate-pulse" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#C9A15A]" />
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-accent font-normal text-[#2B2320] tracking-tight leading-none">
            {partnerTwo}
          </h1>
        </motion.div>

        {/* Invite Line */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-xl font-accent italic text-[#B85C6B] mb-4"
        >
          {inviteLine}
        </motion.p>

        {/* Date & Time Line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FDF6F3]/90 border border-[#C9A15A]/30 text-[#2B2320] text-sm sm:text-base font-medium shadow-sm mb-10"
        >
          <Calendar className="w-4 h-4 text-[#B85C6B]" />
          <span>{weddingTime}</span>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="#countdown"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#B85C6B] text-[#FDF6F3] font-semibold text-sm hover:bg-[#a04b5a] transition-all shadow-lg hover:scale-105"
          >
            <span>Save the Date</span>
            <Heart className="w-4 h-4 text-[#C9A15A] fill-current" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
