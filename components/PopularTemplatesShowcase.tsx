"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Edit3,
  MapPin,
  Clock,
} from "lucide-react";

// Curated Showcase Templates with rich mockup content
const showcaseTemplates = [
  {
    id: "veridian-garden",
    slug: "veridian-garden",
    title: "Veridian Garden Suite",
    category: "Royal Wedding",
    tagline: "Rich Veridian Green & Floral Gold",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvEA0405ZwtZbtm7Xj3i9zk8KeBMcJjOtVQT3vtPAFYPD4LPU5hSXW4CnSBcsKy_9BwJZyqjeTWMw_t4AU8S8SqFCAQBEKtmbfaQT_6ALmB1YanE54rk9BVT8xl2YicE6t8u63NN-GGbrfq9kzusp9CCcPXg1Uy6RwtwhOHc0XAh-ojk_nQQCZhOaVctMOIP7PHWzxVX5HDnIO7DTKPgtadfiipc3G54cVXsNNZJ1etdFnVAdnY1SoAGQ",
    partnerOne: "Sophia",
    partnerTwo: "Alexander",
    date: "Saturday, 28th Nov 2026",
    venue: "The Grand Palace, Bangalore",
    demoSlug: "sophia-alexander",
    schedule: [
      { time: "16:30", event: "Ganesh Puja & Swagat" },
      { time: "18:00", event: "Jaimala & Muhurat" },
      { time: "20:00", event: "Royal Banquet Dinner" },
    ],
  },
  {
    id: "royal-maharani",
    slug: "royal-maharani",
    title: "Royal Maharani & Gold",
    category: "Heritage Wedding",
    tagline: "Velvet Burgundy & Royal Gold Arch",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLsV7ymMpKzrxITcVEIXj7PYMCfII8RkFj-dPsC9V6S5yg7Eo1gvAnRV-gF-RvYrnuiYxQyW72DXy3kPnIancgfQYK-wQkLt_3SC1aCHtX1qQQj9SNVM16ZCwTJl3ReyGG0nQ0WfIcCUEC69vs6sy1idET8wkvN8iJpl40C3_8ciz4WQK9hj8hqNsHVnhfYyHaSTSbGlyUha8OUVkM5f-vGkW0c564HtTsRSDE3gUKrSArZpqsmoM1edHQ",
    partnerOne: "Priya",
    partnerTwo: "Rahul",
    date: "Sunday, 14th Dec 2026",
    venue: "Umaid Bhawan Palace, Jodhpur",
    demoSlug: "priya-rahul",
    schedule: [
      { time: "17:00", event: "Baraat Procession" },
      { time: "19:00", event: "Varmala & Pheras" },
      { time: "21:30", event: "Sangeet Gala Performance" },
    ],
  },
  {
    id: "olive-ochre",
    slug: "olive-ochre",
    title: "Olive & Ochre Suite",
    category: "Modern Minimalist",
    tagline: "Mediterranean Grove & Golden Ochre",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvSoIYkCm3eB7eNpHg5-c5Q1aTxNjTJKPYpbDObIlbXh2t3Pg-oYHp0cXegRicI-ZorPt3XLzCU7rcg0GL22HVzqLUR1Ox1Gy5SnbYFjjet_FQxu1M16e_wxLlFUEi9NWoAeS2WQJM7E9XNVbD7qo4lPpMmJ6tmlFUbIYAPgtmwRWqsCvLRC4CfwJeXYeJNhWgHNVrkHy9e_9JJnBITsuTBTXL6n7wMlLgxjKB9BfgefM5SOO0xYDf935Y",
    partnerOne: "Aarav",
    partnerTwo: "Meera",
    date: "Friday, 18th Sept 2026",
    venue: "Taj Lake Palace, Udaipur",
    demoSlug: "mary-viclito",
    schedule: [
      { time: "11:00", event: "Haldi & Mehendi Rituals" },
      { time: "17:30", event: "Sunset Wedding Vows" },
      { time: "19:30", event: "Cocktails & Dinner" },
    ],
  },
  {
    id: "bohemian-sun",
    slug: "bohemian-sun",
    title: "Bohemian Sun Suite",
    category: "Rustic Boho",
    tagline: "Terracotta Arches & Sunburst Motifs",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvOSFVwDwskg_pJePvsiIJ5qOVC6WXzofNDviADCHyUB9xUy4jeTGCKwq9FTHsNV8nccKux9ZSJWGPZZaYG9meQU6y34DaR58PUlF-M5ZhrPbadIoMbE4VMaHcAvfI9ys0cYaWaoIIzjaKENF8XEYZ6q56_xTlLm5y9v-kJeT_KYUOz1vEcPBaG0AtbpCSZq0YWFXlAbg55fxTbcXPTHjchCMzwT0m8z_tVgqbuTc31Hjv8WWlAF1Laul4",
    partnerOne: "Ancy",
    partnerTwo: "Terance",
    date: "Saturday, 10th Oct 2026",
    venue: "Alila Diwa, Goa",
    demoSlug: "terance-ancy",
    schedule: [
      { time: "16:00", event: "Beachside Vows & Exchange" },
      { time: "18:30", event: "Sunset Bonfire & Beats" },
      { time: "20:30", event: "Starry Night Celebration" },
    ],
  },
  {
    id: "celestial-night",
    slug: "celestial-night",
    title: "Celestial Night & Gold",
    category: "Starlight Glam",
    tagline: "Midnight Navy & Glittering Constellations",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpm4j-t6RMihRtGmM9BhDv4mA8cc80g2Gps4_cJa3CerbcYtH4lMbejonFYa25EunL-XZeXmhPP-_2I1lwaiQo-a4nhAYX7OAe3JdDaQvslcPrLk5sPtrDp5UzLmJ0eFX1h_SWxL1obiYSlKtXwkIpvk-xRzLrcTSK0M84D4f9YiS9Q9SBcSYrBg_NtLF78PMqb_wzFYCreqA7y0Gd5DOeYdbXdQn8IYQZXz6bhpnSZAHarQsf77e0",
    partnerOne: "Rhea",
    partnerTwo: "Karan",
    date: "Thursday, 31st Dec 2026",
    venue: "Raffles, Udaipur",
    demoSlug: "sophia-alexander",
    schedule: [
      { time: "19:00", event: "Red Carpet Welcome" },
      { time: "21:00", event: "Grand Gala Dinner" },
      { time: "23:59", event: "Midnight Countdown & Fireworks" },
    ],
  },
  {
    id: "classic-floral",
    slug: "classic-floral",
    title: "Classic Floral Suite",
    category: "Pastel Romance",
    tagline: "Blush Roses & Ivory Gold Elegance",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLtbp5bSS6d2US6GyrKl6Go2yevSQE379rZ1wnEIkTuQp_lDhJd54fGLgdyRipQYPofHt2yKx4-usV8m4oMCxVCaLmIa3GAim6Y0KzTC9wm_8qfZfQMNqjzIPXG9IhAAdRrED2PzgUQsrJoCXb2JQ047fIIqCEPpDbANRO8eXfCxw96ga2nYy5OuTKZNtSSwXWe69bLMWg5ZAfDfFEJLOObyURoM32VmpxPzhrnQzsjWwMLJ33k0EnsEPg",
    partnerOne: "Diya",
    partnerTwo: "Vikram",
    date: "Sunday, 22nd Nov 2026",
    venue: "JW Marriott, Mumbai",
    demoSlug: "mary-viclito",
    schedule: [
      { time: "10:30", event: "Traditional Muhurtham" },
      { time: "13:00", event: "Festive South Indian Feast" },
      { time: "19:00", event: "Evening Reception & Music" },
    ],
  },
  {
    id: "art-deco-revival",
    slug: "art-deco-revival",
    title: "Art Deco Revival",
    category: "1920s Gatsby",
    tagline: "Obsidian Black & Geometric Gold Arches",
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLv3FU8MvgN3FBB2E-oMQ38w-VJDc_6jt1yGJ8HrR0bDlYej22bomE90uOSWUlk6StQ5UXhS5-2Tsw5MeVdqRhZPRmmozvd2PpCsK5e_jQrhZAELYDGUdL3XoNsoVUAiiBbMNMTToqNOLGGp-5QFCSBuoH7nkJ7SDCWtoelvrqhtEly9K3k-HPzik-RTP1lohia4zXuT_BJrxk571QKYUu1IWkW0OZKJEtVjW8ewTjWLT-zPbD-HaJsWrw",
    partnerOne: "Nisha",
    partnerTwo: "Aditya",
    date: "Saturday, 12th Dec 2026",
    venue: "The Oberoi, New Delhi",
    demoSlug: "priya-rahul",
    schedule: [
      { time: "18:30", event: "Jazz Cocktail Hour" },
      { time: "20:00", event: "Seated Dinner & Speeches" },
      { time: "22:00", event: "Gatsby Dance Floor" },
    ],
  },
];

export default function PopularTemplatesShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseTemplates.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev === 0 ? showcaseTemplates.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % showcaseTemplates.length);
  };

  const activeTemplate = showcaseTemplates[activeIndex];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#F8F3EA] via-[#F3E8D7] to-[#F8F3EA] text-[#221C17] relative overflow-hidden select-none border-t border-b border-[#D9A441]/30">
      {/* Background Subtle Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] bg-radial from-[#D9A441]/20 via-[#7A1F2B]/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-[#D9A441]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-[#7A1F2B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Heading matching website's royal theme */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9A441]/20 text-[#8B6519] border border-[#D9A441]/40 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#8B6519]" />
            <span>FEATURED COLLECTION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#221C17] leading-tight">
            Most Popular{" "}
            <span className="font-accent italic text-[#7A1F2B] font-normal text-4xl sm:text-6xl md:text-7xl block sm:inline mt-1 sm:mt-0">
              Invitation Templates
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#221C17]/80 max-w-xl mx-auto leading-relaxed">
            Discover beautifully designed interactive wedding & event invitation websites with 1-click WhatsApp RSVP, map directions, and video facades.
          </p>
        </motion.div>

        {/* 3D Coverflow Perspective Container */}
        <div className="relative h-[540px] sm:h-[620px] md:h-[660px] flex items-center justify-center perspective-[1200px] my-4">
          {/* Navigation Arrow Left */}
          <button
            onClick={handlePrev}
            aria-label="Previous Template"
            className="absolute left-2 sm:left-6 md:left-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#7A1F2B] hover:bg-[#9B2C3B] text-[#F8F3EA] border-2 border-[#D9A441] flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 group"
          >
            <ChevronLeft className="w-6 h-6 text-[#D9A441] group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Navigation Arrow Right */}
          <button
            onClick={handleNext}
            aria-label="Next Template"
            className="absolute right-2 sm:right-6 md:right-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#7A1F2B] hover:bg-[#9B2C3B] text-[#F8F3EA] border-2 border-[#D9A441] flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 group"
          >
            <ChevronRight className="w-6 h-6 text-[#D9A441] group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* 3D Coverflow Track */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {showcaseTemplates.map((template, index) => {
              // Compute circular relative offset (-3, -2, -1, 0, 1, 2, 3)
              const count = showcaseTemplates.length;
              let offset = index - activeIndex;

              if (offset > count / 2) offset -= count;
              if (offset < -count / 2) offset += count;

              const absOffset = Math.abs(offset);
              const isActive = offset === 0;
              const isVisible = absOffset <= 2; // Show active + 2 on left + 2 on right

              if (!isVisible) return null;

              // Calculate 3D transforms for Coverflow effect
              const rotateY = offset * -28; // Degree of tilt
              const translateX = offset * (typeof window !== "undefined" && window.innerWidth < 640 ? 140 : 220); // Horizontal spacing
              const scale = 1 - absOffset * 0.15; // Scale drop-off
              const translateZ = -absOffset * 120 + (isActive ? 60 : 0); // Z-depth
              const opacity = 1 - absOffset * 0.28; // Opacity drop-off
              const zIndex = 30 - absOffset * 10;

              return (
                <motion.div
                  key={template.id}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveIndex(index);
                  }}
                  animate={{
                    x: translateX,
                    rotateY,
                    scale,
                    z: translateZ,
                    opacity,
                  }}
                  transition={{
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  className={`absolute cursor-pointer w-[270px] sm:w-[320px] md:w-[340px] h-[480px] sm:h-[560px] md:h-[590px] rounded-[40px] p-3 transition-shadow duration-500 ${
                    isActive
                      ? "border-2 border-[#D9A441] shadow-[0_25px_60px_rgba(122,31,43,0.35)] bg-[#1A1815]"
                      : "border border-[#D9A441]/40 hover:border-[#D9A441] shadow-xl bg-[#141210]/95"
                  }`}
                >
                  {/* Outer Mobile Phone Mockup Frame */}
                  <div className="w-full h-full rounded-[32px] overflow-hidden bg-[#0A0A0A] border border-white/10 flex flex-col relative">
                    {/* Top Speaker Notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                      <div className="w-3 h-1 bg-white/20 rounded-full" />
                    </div>

                    {/* Active Template Phone Content Screen */}
                    <div className="flex-1 overflow-y-auto no-scrollbar pt-7 pb-4 px-3 flex flex-col justify-between relative bg-gradient-to-b from-[#141210] to-[#0A0908]">
                      {/* Live Header Banner */}
                      <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden mb-3 border border-white/10 shadow-md">
                        <Image
                          src={template.image}
                          alt={template.title}
                          fill
                          sizes="340px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-3 text-center">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#D9A441] mb-0.5">
                            TOGETHER WITH FAMILIES
                          </span>
                          <h4 className="text-base sm:text-lg font-serif font-bold text-[#F8F3EA] leading-tight">
                            {template.partnerOne} & {template.partnerTwo}
                          </h4>
                          <span className="text-[10px] text-white/80 font-mono mt-0.5">
                            {template.date}
                          </span>
                        </div>
                      </div>

                      {/* Schedule Timeline Section */}
                      <div className="bg-[#1A1815] border border-[#D9A441]/25 rounded-2xl p-3 mb-3 shadow-inner">
                        <div className="text-center mb-2">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#D9A441] flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3 text-[#D9A441]" />
                            <span>WEDDING DAY SCHEDULE</span>
                          </span>
                        </div>

                        <div className="space-y-2 text-[10px] text-[#F8F3EA]/90">
                          {template.schedule.map((item, sIdx) => (
                            <div key={sIdx} className="flex items-center justify-between border-b border-white/5 pb-1.5 last:border-b-0 last:pb-0">
                              <span className="font-mono text-[#D9A441] font-bold">{item.time}</span>
                              <span className="font-medium text-right truncate max-w-[170px]">{item.event}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Google Maps Venue Card */}
                      <div className="bg-[#221F1B] border border-[#D9A441]/20 rounded-2xl p-3 mb-3 flex items-center justify-between gap-2 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-[#7A1F2B]/40 border border-[#D9A441]/30 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-[#D9A441]" />
                          </div>
                          <div className="text-left">
                            <h5 className="text-[10px] font-bold text-[#F8F3EA] truncate max-w-[140px]">
                              {template.venue}
                            </h5>
                            <span className="text-[8px] text-[#D9A441] font-medium block">
                              Tap for Google Maps Route
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-lg bg-[#D9A441] text-[#12100E] text-[8px] font-extrabold shrink-0">
                          MAP
                        </span>
                      </div>

                      {/* Template Footer Button inside Phone */}
                      <div className="text-center pt-1">
                        <span className="text-[9px] font-bold uppercase text-[#D9A441] bg-[#7A1F2B]/40 px-3 py-1 rounded-full border border-[#D9A441]/30 inline-block">
                          {template.tagline}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Details & Actions Bar for Active Template */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTemplate.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="text-center max-w-xl mx-auto mt-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7A1F2B]/10 border border-[#7A1F2B]/30 text-xs font-bold text-[#7A1F2B] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#7A1F2B]" />
              <span>{activeTemplate.category}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#221C17]">
              {activeTemplate.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#221C17]/80 mt-1">
              {activeTemplate.tagline} • Includes 1-Click WhatsApp Broadcast & Venue Map Link
            </p>

            {/* Action CTAs */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href={`/templates/customize/${activeTemplate.slug}`}
                className="btn-maroon inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 text-xs sm:text-sm font-bold shadow-xl hover:scale-105 transition-all"
              >
                <Edit3 className="w-4 h-4 text-[#D9A441]" />
                <span>Customize This Template</span>
              </Link>

              <Link
                href={`/templates/${activeTemplate.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-2xl bg-[#EFE7D8] text-[#221C17] border border-[#D9A441]/40 text-xs sm:text-sm font-bold hover:bg-[#7A1F2B] hover:text-[#F8F3EA] transition-all shadow-md group"
              >
                <span>Live Preview Demo</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#7A1F2B] group-hover:text-[#D9A441]" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {showcaseTemplates.map((tpl, idx) => (
            <button
              key={tpl.id}
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveIndex(idx);
              }}
              aria-label={`Go to template ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === activeIndex
                  ? "w-8 h-2.5 bg-[#7A1F2B] shadow-[0_0_12px_rgba(122,31,43,0.4)]"
                  : "w-2.5 h-2.5 bg-[#221C17]/20 hover:bg-[#221C17]/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
