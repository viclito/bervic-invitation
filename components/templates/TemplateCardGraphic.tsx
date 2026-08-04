"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Crown, Heart, Calendar, MapPin } from "lucide-react";
import { TemplateRegistryItem } from "@/data/templatesRegistry";

interface Props {
  template: TemplateRegistryItem;
}

export default function TemplateCardGraphic({ template }: Props) {
  const { slug, title, styleTag, bgGrad, textColor, accentColor, secondaryAccent, fontStyle, isPremium } = template;

  // Custom visual card rendering based on template slug / layoutVariant
  switch (slug) {
    case "royal-maharani":
      return (
        <div className="w-full h-full bg-[#1a0812] relative overflow-hidden flex flex-col items-center justify-center p-4 border border-[#e6c280]/40">
          {/* Gold Arch SVG Ornament */}
          <svg className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] pointer-events-none" viewBox="0 0 200 160">
            <path
              d="M 20,150 L 20,60 Q 20,10 100,10 Q 180,10 180,60 L 180,150 Z"
              fill="none"
              stroke="#e6c280"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <path
              d="M 26,146 L 26,62 Q 26,16 100,16 Q 174,16 174,62 L 174,146 Z"
              fill="none"
              stroke="#e6c280"
              strokeWidth="0.75"
            />
          </svg>

          {/* Maharani Crown Motif */}
          <div className="w-8 h-8 rounded-full bg-[#e6c280]/20 border border-[#e6c280] flex items-center justify-center mb-2 shadow-lg">
            <Crown className="w-4 h-4 text-[#e6c280]" />
          </div>

          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#e6c280] mb-1">
            ROYAL WEDDING SUITE
          </span>

          <h4 className="text-xl font-serif font-bold text-[#fce8ef] text-center leading-tight">
            Priya <span className="text-[#e6c280] font-accent italic">&</span> Rahul
          </h4>

          <div className="w-12 h-0.5 bg-[#e6c280] my-2 opacity-80" />

          <span className="text-[10px] font-mono text-[#e6c280]/90">
            14th December 2026
          </span>
          <span className="text-[9px] text-[#fce8ef]/70 mt-0.5">
            Umaid Bhawan Palace, Jodhpur
          </span>
        </div>
      );

    case "art-deco-revival":
      return (
        <div className="w-full h-full bg-[#131410] relative overflow-hidden flex flex-col items-center justify-center p-4 border border-[#d4af37]/40">
          {/* Gatsby Sunburst Corner SVG */}
          <svg className="absolute top-0 left-0 w-24 h-24 pointer-events-none opacity-40 text-[#d4af37]" fill="currentColor" viewBox="0 0 100 100">
            <path d="M0,0 L100,0 L0,100 Z" />
          </svg>

          <div className="border-2 border-[#d4af37] p-4 rounded-xl w-full h-full flex flex-col items-center justify-center bg-[#1c1c18]/80 relative z-10">
            <div className="w-6 h-6 rotate-45 border border-[#d4af37] flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-[#d4af37]" />
            </div>

            <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#d4af37] mb-1">
              GREAT GATSBY CELEBRATION
            </span>

            <h4 className="text-lg font-serif font-bold text-[#e5e2db] text-center uppercase tracking-widest">
              Nisha <span className="text-[#d4af37]">&</span> Aditya
            </h4>

            <div className="w-16 h-px bg-[#d4af37] my-2" />

            <span className="text-[9px] text-[#d4af37] font-mono">12.12.2026</span>
          </div>
        </div>
      );

    case "classic-floral":
      return (
        <div className="w-full h-full bg-[#FAF8F5] relative overflow-hidden flex flex-col items-center justify-center p-4 border border-[#B85C6B]/30">
          {/* Subtle Pink Wash */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FDF6F3] via-[#FAF1ED] to-[#FAF8F5]" />

          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#B85C6B]/10 border border-[#B85C6B]/30 flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-[#B85C6B]" />
            </div>

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B85C6B] mb-1">
              WEDDING ANNOUNCEMENT
            </span>

            <h4 className="text-xl font-serif font-bold text-[#4A2E35]">
              Sophia <span className="font-accent italic text-[#B85C6B]">&</span> Alexander
            </h4>

            <div className="w-10 h-0.5 bg-[#D9A441] my-2" />

            <span className="text-[10px] text-[#4A2E35]/80 font-medium">
              28th November 2026
            </span>
          </div>
        </div>
      );

    case "celestial-night":
      return (
        <div className="w-full h-full bg-[#090a10] relative overflow-hidden flex flex-col items-center justify-center p-4 border border-[#d4af37]/30">
          {/* Twinkling Stars SVG */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-ping" />
            <div className="absolute top-10 right-10 w-2 h-2 bg-[#d4af37] rotate-45" />
            <div className="absolute bottom-6 left-12 w-1.5 h-1.5 bg-[#d4af37]" />
            <div className="absolute bottom-10 right-8 w-2 h-2 bg-white rounded-full" />
          </div>

          <div className="relative z-10 text-center flex flex-col items-center">
            <Sparkles className="w-6 h-6 text-[#d4af37] mb-2" />
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#d4af37] mb-1">
              STARLIGHT CELEBRATION
            </span>
            <h4 className="text-xl font-serif font-bold text-[#e0e2ec]">
              Rhea <span className="text-[#d4af37] font-accent italic">&</span> Karan
            </h4>
            <div className="w-12 h-px bg-[#d4af37] my-2" />
            <span className="text-[10px] font-mono text-[#d4af37]">31st December 2026</span>
          </div>
        </div>
      );

    case "veridian-garden":
      return (
        <div className="w-full h-full bg-[#061b0e] relative overflow-hidden flex flex-col items-center justify-center p-4 border border-[#735c00]/40">
          <div className="border border-[#735c00] rounded-2xl p-4 w-full h-full flex flex-col items-center justify-center bg-[#061b0e]/90 relative z-10">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D9A441] mb-1">
              VERIDIAN BOTANICAL SUITE
            </span>

            <h4 className="text-xl font-serif font-bold text-[#F8F3EA] text-center">
              Sophia <span className="text-[#D9A441] font-accent italic">&</span> Alexander
            </h4>

            <div className="w-12 h-0.5 bg-[#735c00] my-2" />

            <span className="text-[10px] font-mono text-[#D9A441]">The Grand Palace, Bangalore</span>
          </div>
        </div>
      );

    case "bohemian-sun":
      return (
        <div className="w-full h-full bg-[#2b1810] relative overflow-hidden flex flex-col items-center justify-center p-4 border border-[#F4A261]/40">
          <div className="w-20 h-20 rounded-t-full border border-[#F4A261] flex items-center justify-center mb-2 bg-[#91472a]/30">
            <span className="text-xs text-[#F4A261] font-serif">☀️</span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#F4A261] mb-1">
            BOHEMIAN BOHO SUITE
          </span>
          <h4 className="text-xl font-serif font-bold text-[#F8F3EA]">
            Ancy <span className="text-[#F4A261] font-accent italic">&</span> Terance
          </h4>
        </div>
      );

    default:
      // High-End Graphic Card Fallback matching exact theme colors & layout
      return (
        <div
          className={`w-full h-full bg-gradient-to-br ${bgGrad} relative overflow-hidden flex flex-col items-center justify-center p-5 border border-[#D9A441]/30`}
          style={{ backgroundColor: template.themeColor }}
        >
          {/* Central Template Design Mockup Layout */}
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#D9A441]/20 border border-[#D9A441]/50 flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4 text-[#D9A441]" />
            </div>

            <h4
              className="text-lg font-serif font-bold leading-tight"
              style={{ color: template.textColor || "#221C17" }}
            >
              {title}
            </h4>

            <div
              className="w-10 h-0.5 my-2"
              style={{ backgroundColor: template.secondaryAccent || "#D9A441" }}
            />

            <span className="text-[10px] font-mono text-[#D9A441] opacity-90">
              {styleTag}
            </span>
          </div>
        </div>
      );
  }
}
