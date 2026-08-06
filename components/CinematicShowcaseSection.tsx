"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Edit3,
  Film,
  Play,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function CinematicShowcaseSection() {
  const highlights = [
    {
      icon: Film,
      title: "480-Frame Apple Scroll",
      desc: "Ultra-smooth WebP frame scrubbing locked to touch scroll or mouse wheel.",
    },
    {
      icon: Sparkles,
      title: "Royal Guest Preloader",
      desc: "Formal glassmorphic invitation unveil displaying guest names & progress bar.",
    },
    {
      icon: MapPin,
      title: "Interactive Venues & Map",
      desc: "Seamless bento cards with 1-click Google Maps directions for your guests.",
    },
    {
      icon: Clock,
      title: "Order of Events Timeline",
      desc: "Vertical fade & rise event timeline built specifically for mobile screens.",
    },
  ];

  return (
    <section id="cinematic-exclusive" className="py-24 bg-[#0A0A0A] text-[#FDF6F3] relative overflow-hidden border-t border-b border-[#D9A441]/30">
      {/* Background Decorative Gold Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-[#D9A441]/10 via-[#F7E7C4]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D9A441]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7A1F2B]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ── Section Header ── */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#D9A441]/20 via-[#F7E7C4]/15 to-[#D9A441]/20 border border-[#D9A441]/50 text-[#D9A441] text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(217,164,65,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441] animate-pulse" />
            <span>EXCLUSIVITY AT ITS FINEST • ₹2000 PASS</span>
            <Sparkles className="w-3.5 h-3.5 text-[#D9A441] animate-pulse" />
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#FDF6F3] leading-tight">
            The 480-Frame Apple-Style <br />
            <span className="font-accent italic text-transparent bg-clip-text bg-gradient-to-r from-[#F7E7C4] via-[#D9A441] to-[#F7E7C4] drop-shadow-[0_4px_20px_rgba(217,164,65,0.4)]">
              Cinematic Scroll Masterpiece
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#F8F3EA]/80 max-w-2xl mx-auto font-light leading-relaxed">
            Experience the pinnacle of digital wedding invitations. Scroll through 480 high-definition WebP video sequence frames with royal gold storytelling, glassmorphic guest cards, and interactive venue navigation.
          </p>
        </div>

        {/* ── Main Showcase Unit: Mockup & Interactive Feature Switcher ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#111111]/90 border border-[#D9A441]/40 rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-xl relative overflow-hidden">
          
          {/* Left Column: Interactive Visual Frame Mockup */}
          <div className="lg:col-span-7 relative group">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[#D9A441]/60 shadow-[0_15px_45px_rgba(217,164,65,0.25)] bg-[#070707]">
              
              {/* Frame Image / Live Background Preview */}
              <img
                src="/frames/scene1/frame-0004.webp"
                alt="480-Frame Scroll Sequence Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />

              {/* Gradient Overlay Mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-transparent" />

              {/* Top Right Exclusive Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#070707]/80 border border-[#D9A441]/50 text-[#D9A441] text-[10px] uppercase font-mono tracking-widest backdrop-blur-md shadow-md flex items-center gap-1.5">
                <Film className="w-3 h-3 text-[#D9A441]" />
                <span>480 FPS Scroll Scrubbing</span>
              </div>

              {/* Center Simulated Overlay Card */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <div className="max-w-md w-full p-4 sm:p-5 rounded-2xl bg-[#0C0C0C]/90 border border-[#D9A441]/40 backdrop-blur-md shadow-[0_12px_35px_rgba(0,0,0,0.9)] flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#D9A441] font-semibold mb-1">
                    TOGETHER WITH THEIR FAMILIES
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-accent italic text-[#FDF6F3]">
                    Terrence <span className="text-[#D9A441]">&amp;</span> Ancy
                  </h3>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#D9A441] mt-1 font-mono">
                    DECEMBER 28, 2026 • 4:00 PM ONWARDS
                  </p>
                  
                  <div className="mt-3.5 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#F7E7C4] bg-[#D9A441]/20 px-3.5 py-1.5 rounded-full border border-[#D9A441]/40">
                    <Sparkles className="w-3 h-3 text-[#D9A441]" />
                    <span>A Special Invitation For Honored Guest</span>
                  </div>
                </div>
              </div>

              {/* Bottom Scroll Indicator Bar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#070707]/90 border border-[#D9A441]/40 text-[#F7E7C4] text-[11px] font-mono flex items-center gap-2 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-[#D9A441] animate-ping" />
                <span>Interactive Scroll Scrubbing Active</span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Details & Direct Action CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D9A441] uppercase tracking-widest mb-2">
                <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
                <span>CINEMATIC MASTERPIECE TIER</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FDF6F3] mb-3">
                Unrivaled Elegance for Your Special Day
              </h3>

              <p className="text-xs sm:text-sm text-[#F8F3EA]/80 leading-relaxed font-light mb-6">
                Created with 480 continuous 4K WebP sequence frames. As your guests scroll, the background seamlessly responds frame-by-frame, unveiling your story, gallery, locations, and RSVP.
              </p>

              {/* Feature Checklist */}
              <div className="space-y-3 mb-6">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-[#FDF6F3]/90">
                    <div className="w-6 h-6 rounded-full bg-[#D9A441]/15 border border-[#D9A441]/40 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-3.5 h-3.5 text-[#D9A441]" />
                    </div>
                    <div>
                      <strong className="font-semibold text-[#F7E7C4] block">{item.title}</strong>
                      <span className="text-[#F8F3EA]/70">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#D9A441]/30">
              <Link
                href="/templates/scroll-scrubber"
                className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] text-[#070707] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,164,65,0.35)] hover:scale-[1.02] transition-all"
              >
                <Play className="w-4 h-4 text-[#070707] fill-current" />
                <span>Live Interactive Demo</span>
              </Link>

              <Link
                href="/templates/customize/scroll-scrubber"
                className="flex-1 py-3.5 px-5 rounded-2xl bg-[#070707] border border-[#D9A441]/60 text-[#F7E7C4] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#D9A441]/20 hover:text-white transition-all shadow-md"
              >
                <Edit3 className="w-4 h-4 text-[#D9A441]" />
                <span>Customize (₹2000)</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
