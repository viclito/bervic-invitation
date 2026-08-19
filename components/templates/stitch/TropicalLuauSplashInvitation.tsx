"use client";

import { useState, useEffect } from "react";
import { getYouTubeEmbedUrl, getWeddingTargetDate, formatAgeOrdinal } from "@/lib/dateUtils";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import FallingTropicalLeaves from "./FallingTropicalLeaves";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Menu,
  X,
  Play,
  MapPin,
  Car,
  Shirt,
  Sparkles,
  Quote,
  Cake,
  Gift,
} from "lucide-react";

export default function TropicalLuauSplashInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Celebrant name fallback
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const ageMilestone = formatAgeOrdinal(props.turningAge) || "30th";
  const eventTitle =
    props.tagline && props.tagline !== "TOGETHER WITH THEIR FAMILIES"
      ? props.tagline
      : "A Tropical Birthday Soirée";

  const celebrationHeader = `${celebrantName}'s Birthday`;

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 42,
    hours: 14,
    minutes: 30,
    seconds: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const targetDate = getWeddingTargetDate(props.weddingDate, props.weddingTime).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = Math.max(0, targetDate - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [props.weddingDate, props.weddingTime]);

  // Gallery items fallback
  const galleryList =
    props.galleryImages && props.galleryImages.filter(img => Boolean(Boolean(img && String(img).trim()))).length > 0
      ? props.galleryImages
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDh4Z4xW8jzsbsKdg5ia6FglPseQmsZ1nlzUwtc2WJydYhxTuHb_NyigRGCYeKiuvRuXRXP_vtYDpZ3DiXo_J0Ke9Msny6YhJr3-1mqXCVUPUSMrdHol2HuTcrR3GbXkIjnxjzlnKhHkdi1qS6i_mCRPL23DzBAjE2IUqGXEzkii77HGn1cKN8lsCHGmZwg5RGM-V5NHCELiJ5_IxMqlW4AkYgBBaekk7zQYi7vFV9k64W1oXZSC_uJ",
            caption: "Summer Celebrations",
            rotate: "-rotate-2",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHAT2ujkSkrVrFXNwYxZGWYhPp0bwVfn-zm21_weAMJfQsLRgq7pY4rT43s6LhRoCy3OrGVWc-Szfw9c-zK6eGTqqhFNDTQVkXGGYQGfMwcVdCChKLt5L4icxEBD8kVNbERV6WydO45gJ2cMRST9M0ALo-Sa0jOv2xNcZylaE1DsyHfCB2J4lWMWVB718CzJWM_QKb6Bx7zTuCy6EUWp2jFXXzanaZbT_FswQOkO-NWpwwarWorryv",
            caption: "Tuscany Adventures",
            rotate: "rotate-3",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkq4ouHRpN0B0WcEm_ER0duJsqd7R-7EwHEaKpCwBrnnK8HQK_Wnlqs0t2Jmohk-cIv1jJSf8-Zk8iS0CSFP1NLZ0dX9T1XhgdjBEJ32_A5enxenXClguGj5JSnEVYI260DDmBk3dBo1my50UbFtx12HNjUyUbamsFmpARWfmRNMCWuXVEDE8xjckOGz9YKI54iD-A-jGSzI7aTfNvJ4ERdzNQkumZwVufEZny5Fx_kNJyANgebXar",
            caption: "29th Birthday Glow",
            rotate: "-rotate-1",
          },
        ];

  // Birthday timeline steps fallback
  const timelineSteps =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay
      : [
          {
            order: 1,
            time: "6:00 PM",
            title: "Welcome Cocktails & Mocktails",
            desc: "Signature tropical cocktails and light hors d'oeuvres on the oceanfront terrace.",
          },
          {
            order: 2,
            time: "7:30 PM",
            title: "Artisanal Birthday Feast",
            desc: "A curated multi-course Mediterranean and tropical fusion dinner.",
          },
          {
            order: 3,
            time: "8:45 PM",
            title: "Cake Cutting & Toast",
            desc: "Blowing out candles, birthday toasts, and sweet dessert delights.",
          },
          {
            order: 4,
            time: "9:30 PM",
            title: "Dancing Under the Stars",
            desc: "Live DJ sets, tropical beats, and dancing the night away in the open air.",
          },
        ];

  // Venue location fallback
  const mainVenue =
    props.locations && props.locations[0]
      ? props.locations[0]
      : {
          name: "The Birthday Venue",
          venueLabel: "The Secret Level Coastal Villa",
          address: "123 Coastal Breeze Way, Mediterranean Coast",
          mapLink: "https://maps.google.com",
          image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAvWe_21aYaIvERquGq11QP4lDuSfJCppNLVOt1dIz4c0LnAUaS93PgIfx_jQCE0TT2Oled51PeaMiaxd81oA9Au5EwOAIV_SPYOnomEmQLpdcLfwguhecc6ggyvogJ3Tak0NcFIPbk_blt02bmnRBealKovkdtW2C80JY-VI3nIJyMZzJDvE9U-AoOCQJtCLD3I6bgb7677rP8GKjaYB6RhhpCC0Xt2PrOuK6-UZR2IoMHBqRmUuJq",
        };

  return (
    <div className="bg-[#fcf9f8] text-[#1b1c1c] font-sans antialiased overflow-x-hidden relative selection:bg-[#5f5f00]/20 selection:text-[#5f5f00]">
      {/* Guest Personalization Envelope Cover */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday at 6:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="tropical-luau-splash"
      />

      {/* Top Glassmorphism Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          navScrolled
            ? "bg-[#fcf9f8]/90 backdrop-blur-md shadow-sm border-b border-[#797865]/10"
            : "bg-[#fcf9f8]/70 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center h-20">
          <a
            href="#"
            className="font-serif text-2xl font-semibold text-[#5f5f00] italic tracking-tight"
          >
            {celebrationHeader}
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-8 items-center text-sm font-medium">
            <a
              href="#about"
              className="text-[#904d00] border-b-2 border-[#904d00] pb-0.5 transition-colors"
            >
              About
            </a>
            <a
              href="#timeline"
              className="text-[#484837] hover:text-[#5f5f00] transition-colors"
            >
              Timeline
            </a>
            <a
              href="#venue"
              className="text-[#484837] hover:text-[#5f5f00] transition-colors"
            >
              Venue
            </a>
            <a
              href="#gallery"
              className="text-[#484837] hover:text-[#5f5f00] transition-colors"
            >
              Gallery
            </a>
            <a
              href="#rsvp"
              className="text-[#484837] hover:text-[#5f5f00] transition-colors"
            >
              RSVP
            </a>
          </div>

          <div className="hidden md:block">
            <a
              href="#rsvp"
              className="bg-[#5f5f00] text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-md hover:bg-[#797900] transition-colors shadow-sm"
            >
              RSVP Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-[#5f5f00] p-2"
          >
            {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#fcf9f8] border-b border-[#797865]/20 px-6 py-4 flex flex-col gap-4 text-center">
            <a
              href="#about"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#904d00] font-semibold py-2"
            >
              About
            </a>
            <a
              href="#timeline"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#484837] py-2"
            >
              Timeline
            </a>
            <a
              href="#venue"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#484837] py-2"
            >
              Venue
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#484837] py-2"
            >
              Gallery
            </a>
            <a
              href="#rsvp"
              onClick={() => setMobileNavOpen(false)}
              className="bg-[#5f5f00] text-white py-3 rounded-md font-semibold text-xs uppercase tracking-wider"
            >
              RSVP Now
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-24 md:pt-44 md:pb-32 px-6 md:px-16 bg-[#fcf9f8] overflow-hidden flex flex-col items-center justify-center min-h-[750px] text-center">
        {/* Falling Tropical Leaves Animation Layer */}
        <FallingTropicalLeaves />

        {/* Botanical Leaf Accents */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-between items-start p-6 md:p-12">
          <img
            className="w-48 h-48 md:w-72 md:h-72 object-contain opacity-40 animate-pulse transition-all duration-1000"
            alt="Monstera leaf background accent"
            src="/images/templates/monstera-leaf-cutout.png"
            style={{ mixBlendMode: "multiply" }}
          />
          <img
            className="w-48 h-48 md:w-72 md:h-72 object-contain transform -scale-x-100 opacity-40 animate-pulse transition-all duration-1000"
            alt="Monstera leaf background accent"
            src="/images/templates/monstera-leaf-cutout.png"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#904d00]/10 text-[#904d00] border border-[#904d00]/20 text-xs font-semibold uppercase tracking-widest">
            <Cake className="w-4 h-4 text-[#904d00]" />
            <span>{celebrantName}'s {ageMilestone ? `${ageMilestone} Birthday` : "Birthday"} Celebration</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-serif text-[#5f5f00] tracking-tight leading-tight">
            {eventTitle}
          </h1>

          <p className="text-lg md:text-xl text-[#484837] font-serif max-w-2xl mx-auto leading-relaxed">
            {props.inviteLine && !props.inviteLine.includes("wedding")
              ? props.inviteLine
              : `Join us in celebrating ${celebrantName}'s ${ageMilestone} birthday. An evening of curated cocktails, artisanal dining, and sophisticated luau vibes.`}
          </p>

          <div className="pt-6 flex justify-center gap-4">
            <a
              href="#rsvp"
              className="inline-block border-2 border-[#904d00] text-[#904d00] font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded-md hover:bg-[#904d00] hover:text-white transition-all shadow-sm"
            >
              Save the Date
            </a>
          </div>
        </motion.div>
      </header>

      {/* SVG Wave Divider 1 */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-[50px] md:h-[100px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            className="fill-[#f6f3f2]"
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C72.82,23.63,149.3,44.99,222.18,52.48,255.43,55.85,288.75,59.39,321.39,56.44Z"
          />
        </svg>
      </div>

      {/* Countdown Section */}
      <section className="py-16 px-6 md:px-16 bg-[#f6f3f2] text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h3 className="text-2xl md:text-3xl font-serif text-[#904d00] italic font-semibold">
            Time Until We Celebrate {celebrantName}
          </h3>

          <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
            <div className="flex flex-col items-center bg-[#fcf9f8] p-4 md:p-6 rounded-2xl shadow-sm min-w-[100px] border border-[#cac7b1]/40">
              <span className="text-4xl md:text-5xl font-bold font-serif text-[#5f5f00]">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-xs font-semibold text-[#484837] uppercase tracking-wider mt-2">
                Days
              </span>
            </div>

            <div className="flex flex-col items-center bg-[#fcf9f8] p-4 md:p-6 rounded-2xl shadow-sm min-w-[100px] border border-[#cac7b1]/40">
              <span className="text-4xl md:text-5xl font-bold font-serif text-[#5f5f00]">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-xs font-semibold text-[#484837] uppercase tracking-wider mt-2">
                Hours
              </span>
            </div>

            <div className="flex flex-col items-center bg-[#fcf9f8] p-4 md:p-6 rounded-2xl shadow-sm min-w-[100px] border border-[#cac7b1]/40">
              <span className="text-4xl md:text-5xl font-bold font-serif text-[#5f5f00]">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-xs font-semibold text-[#484837] uppercase tracking-wider mt-2">
                Mins
              </span>
            </div>

            <div className="flex flex-col items-center bg-[#fcf9f8] p-4 md:p-6 rounded-2xl shadow-sm min-w-[100px] border border-[#cac7b1]/40">
              <span className="text-4xl md:text-5xl font-bold font-serif text-[#5f5f00]">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-xs font-semibold text-[#484837] uppercase tracking-wider mt-2">
                Secs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SVG Wave Divider 2 */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-[50px] md:h-[100px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            className="fill-[#fcf9f8]"
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C72.82,23.63,149.3,44.99,222.18,52.48,255.43,55.85,288.75,59.39,321.39,56.44Z"
          />
        </svg>
      </div>

      {/* About / Inspiration Section */}
      <section className="py-20 px-6 md:px-16 bg-[#fcf9f8]" id="about">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00]">
              The Inspiration
            </h2>
            <div className="w-12 h-1 bg-[#904d00] rounded-full"></div>
            <p className="text-base md:text-lg text-[#484837] font-serif leading-relaxed">
              {props.loveStoryText && !props.loveStoryText.includes("wedding")
                ? props.loveStoryText
                : `Embracing the slow living and organic textures of the Mediterranean mixed with a touch of island spirit. This 30th birthday celebration is designed to be a sensory experience, focusing on culinary arts, natural pigments, and intimate connections.`}
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-[#5f5f00]/10 translate-x-4 translate-y-4 rounded-2xl"></div>
            <img
              className="relative z-10 w-full h-[380px] md:h-[420px] object-cover rounded-2xl shadow-sm border border-[#cac7b1]/30"
              alt="Minimalist birthday table setting"
              src={
                props.coupleImage ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuArG5YFkRTyG0NbTRVMqnmH7qfHqXAFAyK9JzYzo8qCgb5rl-LsBpf_yfiu6j1B5B-pS3COjC9Zvf5xCmQWnOci5lJyAwvFF6deG8F2jdka4FfDAsO2XcwegK14vWOKrCgrOjviqY8ei882FdnnfnL0fcl7-gbrMahUOousxE2MhxV44VfugAIk0O2C2UoLNZQprgDmCkbJfVVcUt5ZQ1I4lAaOlbjmPoRR5NTrOeTVk0aIg86H_iIy"
              }
            />
          </div>
        </div>
      </section>

      {/* SVG Wave Divider 3 */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-[50px] md:h-[100px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            className="fill-[#f6f3f2]"
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C72.82,23.63,149.3,44.99,222.18,52.48,255.43,55.85,288.75,59.39,321.39,56.44Z"
          />
        </svg>
      </div>



      {/* SVG Wave Divider 4 */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-[50px] md:h-[100px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            className="fill-[#fcf9f8]"
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C72.82,23.63,149.3,44.99,222.18,52.48,255.43,55.85,288.75,59.39,321.39,56.44Z"
          />
        </svg>
      </div>

      {/* Birthday Event Timeline */}
      <section className="py-20 px-6 md:px-16 bg-[#fcf9f8]" id="timeline">
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00]">
              The Evening's Flow
            </h2>
            <div className="w-12 h-1 bg-[#904d00] rounded-full mx-auto"></div>
          </div>

          <div className="relative border-l-2 border-[#5f5f00]/20 ml-6 md:ml-0 md:border-none space-y-12">
            {timelineSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative md:flex md:justify-between md:items-center w-full"
              >
                <div className="absolute -left-[31px] md:left-1/2 md:-ml-[11px] top-1 w-6 h-6 rounded-full bg-[#fcf9f8] border-4 border-[#5f5f00] z-10"></div>

                <div
                  className={`pl-8 md:pl-0 md:w-5/12 ${
                    idx % 2 === 0
                      ? "md:text-right md:pr-8"
                      : "md:text-left md:pl-8 md:order-2"
                  }`}
                >
                  <span className="text-xl font-bold font-serif text-[#904d00] block mb-1">
                    {step.time}
                  </span>
                  <h4 className="text-xl font-bold font-serif text-[#5f5f00] mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm md:text-base text-[#484837] font-serif leading-relaxed">
                    {"desc" in step ? (step as any).desc : "Celebrate and enjoy with family and friends."}
                  </p>
                </div>

                <div
                  className={`hidden md:block md:w-5/12 ${
                    idx % 2 === 0 ? "text-left pl-8" : "text-right pr-8 md:order-1"
                  }`}
                ></div>

                {idx < timelineSteps.length - 1 && (
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-[-48px] w-[2px] bg-[#5f5f00]/20 -ml-[1px]"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Birthday Quote Banner */}
      <section className="py-20 px-6 md:px-16 bg-[#5f5f00] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <Quote className="w-12 h-12 mx-auto text-white/75" />
          <h2 className="text-3xl md:text-5xl font-serif italic leading-tight text-white">
            "Life is meant for good friends and great adventures."
          </h2>
          <p className="text-xs uppercase tracking-widest text-white/80 pt-2 font-semibold">
            — Celebrating {ageMilestone} Years of Joy
          </p>
        </div>
      </section>

      {/* Venue & Logistics Section */}
      <section className="py-20 px-6 md:px-16 bg-[#f6f3f2]" id="venue">
        <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 md:order-1 relative rounded-2xl overflow-hidden shadow-md h-[380px] bg-[#fcf9f8] border border-[#cac7b1]/30 flex items-center justify-center p-6 text-center">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{ backgroundImage: `url('${mainVenue.image}')` }}
            ></div>
            <div className="relative z-10 bg-[#fcf9f8]/95 backdrop-blur-sm p-6 rounded-xl border border-[#cac7b1]/40 max-w-[85%] shadow-sm">
              <MapPin className="w-8 h-8 text-[#5f5f00] mx-auto mb-2" />
              <h4 className="text-2xl font-bold font-serif text-[#5f5f00]">
                {mainVenue.venueLabel}
              </h4>
              <p className="text-sm text-[#484837] mt-2 font-serif">
                {mainVenue.address}
              </p>
              <a
                href={mainVenue.mapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 text-[#904d00] font-semibold text-xs uppercase tracking-wider hover:underline"
              >
                Get Directions →
              </a>
            </div>
          </div>

          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00]">
              The Setting
            </h2>
            <div className="w-12 h-1 bg-[#904d00] rounded-full"></div>
            <p className="text-base md:text-lg text-[#484837] font-serif leading-relaxed">
              Our birthday celebration takes place at a private coastal estate, offering panoramic views of the ocean and lush botanical gardens.
            </p>

            <ul className="space-y-4 pt-4">
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-[#5f5f00]/10 text-[#5f5f00] shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-semibold text-[#1b1c1c]">
                    Complimentary Valet
                  </strong>
                  <span className="text-xs md:text-sm text-[#484837]">
                    Valet parking will be available at the main entrance upon arrival.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-[#5f5f00]/10 text-[#5f5f00] shrink-0">
                  <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-sm font-semibold text-[#1b1c1c]">
                    Attire
                  </strong>
                  <span className="text-xs md:text-sm text-[#484837]">
                    Resort elegant. Think breathable linens, soft silks, and comfortable footwear for grass.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SVG Wave Divider 5 */}
      <div className="w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-[50px] md:h-[100px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            className="fill-[#fcf9f8]"
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C72.82,23.63,149.3,44.99,222.18,52.48,255.43,55.85,288.75,59.39,321.39,56.44Z"
          />
        </svg>
      </div>

      {/* Polaroid Gallery Section */}
      <section className="py-20 px-6 md:px-16 bg-[#fcf9f8]" id="gallery">
        <div className="max-w-[1280px] mx-auto space-y-12 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00]">
              Cherished Moments
            </h2>
            <div className="w-12 h-1 bg-[#904d00] rounded-full mx-auto"></div>
            <p className="text-base md:text-lg text-[#484837] font-serif">
              A glimpse into beautiful memories across thirty wonderful years.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-12">
            {galleryList.map((item: any, i: number) => {
              const url = typeof item === "string" ? item : item.url;
              const caption =
                typeof item === "string" ? `Memory #${i + 1}` : item.caption;
              const rotate =
                typeof item === "string"
                  ? i % 2 === 0
                    ? "-rotate-2"
                    : "rotate-2"
                  : item.rotate || "";

              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  className={`bg-white p-4 pb-10 shadow-lg rounded-sm border border-[#cac7b1]/30 ${rotate} transition-transform duration-300 relative`}
                >
                  <img
                    alt={caption}
                    className="w-full aspect-[4/5] object-cover mb-4 rounded-sm"
                    src={url}
                  />
                  <p className="font-serif italic text-sm text-[#484837] absolute bottom-3 left-0 w-full text-center">
                    {caption}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 bg-[#f6f3f2]">
        <RsvpSection partnerOne={celebrantName} partnerTwo="" />
      </section>

      {/* Footer */}
      <footer className="bg-[#f6f3f2] py-12 border-t border-[#cac7b1]/30">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="font-serif text-xl font-bold text-[#5f5f00]">
            {celebrationHeader}
          </div>
          <div className="text-xs text-[#484837]">
            © {new Date().getFullYear()} Crafted with love for {celebrantName}'s Birthday
          </div>
          <div className="flex gap-6 text-xs text-[#484837]">
            <a href="#" className="hover:text-[#904d00] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#904d00] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
