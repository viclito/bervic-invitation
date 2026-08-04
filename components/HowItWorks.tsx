"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutGrid, Edit3, Share2, Play, Sparkles, Heart } from "lucide-react";

export default function HowItWorks() {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const steps = [
    {
      step: "Step 1",
      title: "Choose a Template",
      description: "Beautiful designs, multiple styles to choose from",
      icon: LayoutGrid,
    },
    {
      step: "Step 2",
      title: "Fill in Your Details",
      description: "Add photos, names, event dates, venues, and map locations",
      icon: Edit3,
    },
    {
      step: "Step 3",
      title: "Send Your Invitation",
      description: "Share instantly via WhatsApp, Instagram, or any messaging app",
      icon: Share2,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#141215] text-[#F8F3EA] relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#7A1F2B]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Create digital wedding invitations at just{" "}
            <span className="text-[#E11D48] font-accent italic font-normal">
              ₹299 & manage guests
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-400 font-medium tracking-wide">
            Keep the tradition · Enjoy the convenience · Starting at just ₹299
          </p>
        </motion.div>

        {/* 2-Column Grid: Timeline on Left, Phone Frame Mockup on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-16">
          {/* Left Column: Vertical 3-Step Timeline */}
          <div className="lg:col-span-6 space-y-10 relative pl-4 sm:pl-6">
            {/* Connecting Vertical Line */}
            <div className="absolute left-[38px] sm:left-[46px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#E11D48] via-[#7A1F2B] to-[#E11D48]/30" />

            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="flex items-start gap-5 relative z-10 group"
                >
                  {/* Circular Step Badge */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E11D48] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#E11D48]/30 border-2 border-[#E11D48] group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  {/* Step Details */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E11D48] block mb-1">
                      {st.step}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-[#E11D48] transition-colors">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                      {st.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Phone Frame Preview */}
          <div className="lg:col-span-6 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-[340px] sm:max-w-[380px]"
            >
              {/* Soft Pink Glow Card Container */}
              <div className="p-4 sm:p-6 rounded-[36px] bg-gradient-to-b from-[#E11D48]/20 via-[#1F1A20] to-[#141215] border border-[#E11D48]/30 shadow-2xl relative">
                {/* Tutorial Badge Banner Header */}
                <div className="text-center mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
                    <span>How to Create a Beautiful Invitation</span>
                  </span>
                </div>

                {/* iPhone / Android Mockup Container */}
                <div className="relative rounded-[28px] overflow-hidden border-4 border-stone-800 bg-stone-900 shadow-2xl aspect-[9/16] flex flex-col justify-between p-4 group">
                  {/* Top Address Bar Simulation */}
                  <div className="bg-stone-800/90 backdrop-blur-md rounded-full py-1.5 px-3 flex items-center justify-between text-[10px] text-stone-300 font-mono mb-3 border border-white/5">
                    <span className="truncate text-stone-400">bervic-invitation.app</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  {/* Phone Screen Invitation Preview Card */}
                  <div className="flex-1 rounded-2xl bg-[#FDFBF7] text-[#221C17] p-5 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-[#7A1F2B]/10 border border-[#7A1F2B]/30 flex items-center justify-center mb-3">
                      <Heart className="w-5 h-5 text-[#7A1F2B] fill-current" />
                    </div>

                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#7A1F2B] mb-1">
                      Together with Families
                    </span>

                    <h4 className="text-xl font-serif font-bold text-[#221C17] leading-tight">
                      Sophia <br />
                      <span className="text-[#D9A441] font-accent italic text-base">&</span> <br />
                      Alexander
                    </h4>

                    <div className="w-10 h-0.5 bg-[#D9A441] my-2" />

                    <span className="text-[10px] text-stone-600 font-medium mb-4">
                      Saturday, 28th November 2026
                    </span>

                    <div className="w-full py-2 bg-[#7A1F2B] text-white rounded-xl text-xs font-bold shadow-md">
                      Open Invitation
                    </div>

                    {/* Big Interactive Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex flex-col items-center justify-center transition-all group-hover:bg-black/20">
                      <button
                        type="button"
                        onClick={() => setIsPlayingDemo(true)}
                        className="w-16 h-16 rounded-full bg-[#E11D48] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                        title="Watch Preview Demo"
                      >
                        <Play className="w-7 h-7 text-white fill-current ml-1" />
                      </button>
                      <span className="text-[11px] font-bold text-white mt-2 drop-shadow-md">
                        Tap to Preview Demo
                      </span>
                    </div>
                  </div>

                  {/* Watermark branding at phone bottom */}
                  <div className="mt-3 text-center">
                    <span className="text-[11px] font-bold text-stone-400 font-serif tracking-wider">
                      bervic-invitation.com
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Center CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/templates"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-[#E11D48] text-white text-base font-bold shadow-xl shadow-[#E11D48]/30 hover:bg-[#BE123C] hover:scale-105 active:scale-95 transition-all"
          >
            <span>Start Creating</span>
          </Link>
        </motion.div>
      </div>

      {/* Interactive Modal Video Preview overlay */}
      {isPlayingDemo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsPlayingDemo(false)}
        >
          <div className="bg-stone-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center relative space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white">Live Invitation Demo</h3>
            <p className="text-xs text-stone-400">Experience our interactive live invitations in action!</p>
            <div className="aspect-[9/16] rounded-2xl overflow-hidden bg-black relative">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Bervic Invitation Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <button
              type="button"
              onClick={() => setIsPlayingDemo(false)}
              className="w-full py-2.5 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-700 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

