"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Download, ShieldCheck, Layers, Heart } from "lucide-react";

export default function InstagramCardsSection() {
  return (
    <section id="instagram-cards" className="py-20 lg:py-28 bg-white text-slate-900 relative overflow-hidden border-t border-b border-slate-200">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* ── LEFT COLUMN: Showcase Device Mockup Image ── */}
          <div className="lg:col-span-6 space-y-6">
            <div className="w-full flex items-center justify-center">
              <img
                src="/images/instagram-whatsapp-mockup.png"
                alt="Aesthetic Instagram and WhatsApp Wedding Announcement Cards Mockup"
                className="w-full max-w-xl h-auto object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                loading="eager"
              />
            </div>

            {/* Bottom Translucent Specs Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:p-4 shadow-sm flex items-center justify-around text-center">
              {/* Metric 1 */}
              <div className="flex items-center gap-2.5">
                <div className="px-2 py-1 rounded-lg bg-red-50 border border-red-200 text-[#991B1B] text-[11px] font-extrabold">
                  HD
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-slate-900">1080x1080px &amp; 9:16</h5>
                  <p className="text-[10px] text-slate-500">Posts &amp; Stories</p>
                </div>
              </div>

              <div className="w-[1px] h-8 bg-slate-200" />

              {/* Metric 2 */}
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-[#991B1B]" />
                <div className="text-left">
                  <h5 className="text-xs font-bold text-slate-900">31+</h5>
                  <p className="text-[10px] text-slate-500">Curated Presets</p>
                </div>
              </div>

              <div className="w-[1px] h-8 bg-slate-200" />

              {/* Metric 3 */}
              <div className="flex items-center gap-2.5">
                <Download className="w-5 h-5 text-[#991B1B]" />
                <div className="text-left">
                  <h5 className="text-xs font-bold text-slate-900">PNG &amp; PDF</h5>
                  <p className="text-[10px] text-slate-500">Instant Export</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Text, Copy & CTA ── */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            
            {/* Main Headline with Logos */}
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-serif font-bold text-slate-900 leading-[1.25] tracking-tight">
              Aesthetic{" "}
              <span className="inline-flex items-center gap-1.5 align-middle">
                {/* Instagram Logo */}
                <svg className="w-7 h-7 sm:w-9 sm:h-9 inline-block align-middle rounded-xl shadow-xs" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <radialGradient id="ig-grad-headline" cx="20%" cy="110%" r="140%">
                      <stop offset="0%" stopColor="#fdf497" />
                      <stop offset="5%" stopColor="#fdf497" />
                      <stop offset="45%" stopColor="#fd5949" />
                      <stop offset="60%" stopColor="#d6249f" />
                      <stop offset="90%" stopColor="#285AEB" />
                    </radialGradient>
                  </defs>
                  <rect width="24" height="24" rx="6" fill="url(#ig-grad-headline)" />
                  <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4z" fill="#fff" />
                  <circle cx="16.5" cy="7.5" r="1.1" fill="#fff" />
                  <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="#fff" strokeWidth="1.5" />
                </svg>
                <span className="font-accent text-[#991B1B] italic font-normal">Instagram</span>
              </span>{" "}
              &amp;{" "}
              <span className="inline-flex items-center gap-1.5 align-middle">
                {/* WhatsApp Logo */}
                <svg className="w-7 h-7 sm:w-9 sm:h-9 inline-block align-middle drop-shadow-xs" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.95.56 3.77 1.53 5.32L2 22l4.82-1.49C8.31 21.46 10.1 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#25D366" />
                  <path d="M17.5 14.38c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.89-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.65-.93-2.25-.25-.6-.5-.52-.68-.53l-.58-.01c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.13 4.54.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z" fill="#fff" />
                </svg>
                <span className="text-[#25D366] font-bold">WhatsApp</span>
              </span>
              <br />
              Announcement Cards
            </h2>

            {/* Heart Accent Line */}
            <div className="flex items-center justify-center lg:justify-start gap-3 my-2">
              <div className="w-10 h-[1px] bg-red-200" />
              <Heart className="w-3.5 h-3.5 text-[#991B1B] fill-current" />
              <div className="w-24 h-[1px] bg-red-200" />
            </div>

            {/* Paragraph Text */}
            <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              Announce your Save-the-Date, Wedding Ceremony, or Reception on Instagram &amp; WhatsApp Status with 31+ high-resolution (1080x1080px &amp; Story) post card presets tailored to your wedding aesthetic.
            </p>

            {/* Solid Brand CTA Button */}
            <div className="pt-2 max-w-lg mx-auto lg:mx-0 space-y-3">
              <Link
                href="/cards"
                className="w-full py-4 rounded-2xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:scale-[1.02] transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <span>CREATE INSTAGRAM CARDS NOW</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
