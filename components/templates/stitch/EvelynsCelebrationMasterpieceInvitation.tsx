"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, Sparkles, MapPin, Calendar, Clock } from "lucide-react";

export default function EvelynsCelebrationMasterpieceInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Celebrant name
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const celebrationHeader = `${celebrantName}'s Celebration`;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 45,
  });

  useEffect(() => {
    // Launch confetti explosion on mount
    import("canvas-confetti").then((confetti) => {
      confetti.default({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#904d00", "#ffb77c", "#ff7f50", "#e9e86b"],
      });
    }).catch(() => {});

    const targetDate = new Date(
      props.weddingDate || "2026-10-15T19:00:00"
    ).getTime();

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

      setTimeLeft({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(interval);
  }, [props.weddingDate]);

  // Hero image fallback matching Stitch screen dcadce93dda94b86b70ee38c4c08e8a1
  const isNonMasterpieceHero =
    !props.heroImage ||
    props.heroImage.includes("unsplash.com") ||
    props.heroImage.includes("wedding") ||
    props.heroImage.includes("photo-1519741497674") ||
    props.heroImage.includes("photo-1511795409834") ||
    props.heroImage.includes("AB6AXuCbj6E_qQBW8N2") ||
    Boolean(props.partnerTwo && props.partnerTwo.trim() !== "");

  const displayHeroImage =
    props.heroImage && !isNonMasterpieceHero
      ? props.heroImage
      : "https://lh3.googleusercontent.com/aida-public/AB6AXuDPNnny-dlognAkhDvCNhFRNyGdojg7bnFj9koTHxsIkmDMy9nv5DW7U0sXvez0NdnLDBzJQ6PvCHZR9AS2jITAmqVVxSufalgrhBrSBTPIvD--MbXtkg9fIiOYoMjfDqBBXZB8eiJJDcdjhIXBxHAkPd9wImdF-x76N_PDM5xs7wjIwV8ruvkfZa4hLejyc3xLQlDdzHrJ6g90juloHzWGSTBzYafBH3TYgbA2plyz-2xVOzLfvtZ1";
  const galleryList =
    props.galleryImages && props.galleryImages.length >= 3
      ? props.galleryImages
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-CHnc6isuaO6BcUDnVVjJfYt0sIuwluvudEeEmkaSasB5cKtOCEaaYcnuCGaUoNrLUYdQ9UW7QOHe8XSTTAFU14Dm3T-DVGMM9ypzgWv7KSF8-Oyn4SU59i8VEtFyJVTiITxYBGLFDc79h6qscWLlY3hKycCtB_OFAYezyxOC5N-WYQhu5OsnWsr-9A_1yNg5dZWX7qtqUnjGqregZmVCVIAn90Y6HT64P_OUPLhjTJEjROypjUTQ",
            caption: "Summer '22",
            rotate: "rotate-[-2deg]",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgpgUGapB_XqNzx8AlEjaxluFc98vsyFpVwKovkqm9Ape8Lr2r3BIGgyNTCn8j_4BcoxIgTezUJkTCGT409uz4KR50fp3Qw0CtYjXviTibQ2gBk2Ll17sYwInbC7YcgojYBx5qYSi79eshrWsPtFP1rxQUFxGoiwLIarj9hGwhh2BQogM9wLe7Aol3hgjQmhLmVRxAeg1OIfPmFihhJAPdRLp2Yoqlbky4mElULSXsa8hS9PMmxf5_",
            caption: "Sweet details",
            rotate: "rotate-[3deg] md:mt-12",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWyDDqRdYSVN2zy6WM2JG-qkTFXQrCqI_-4B-fUHOS3SVoJ0LrGzi5mRTGSwLaH71u62TUwPp2T1zjzyfayN-BjwAkPeWyNfzsy2FSU4rXDnkavj8knovkF834A5mb--1xZpoUHeaKpRtpJm0uwYynBtyd46V3p6GmKopa_pSu_tJlooSSuLXx6SSgONCv6GsmpUs6plNxF4i7hOEJmJG2WJ9PRtI3LtNns8CHJzMpraldPAbY_Q87",
            caption: "The Venue",
            rotate: "rotate-[-1deg]",
          },
        ];

  return (
    <div className="bg-[#fdf9f4] text-[#1b1c1c] font-serif antialiased overflow-x-hidden relative selection:bg-[#5f5f00] selection:text-white min-h-screen">
      {/* Material Symbols Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Masterpiece CSS Engine & Animations */}
      <style>{`
        .gold-shimmer-sweep {
          background: linear-gradient(to right, #904d00 20%, #ffb77c 40%, #ffb77c 60%, #904d00 80%);
          background-size: 200% auto;
          color: #000;
          background-clip: text;
          text-fill-color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s linear infinite;
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }

        .cinematic-zoom {
          animation: zoomFade 2s ease-out forwards;
          opacity: 0;
          transform: scale(1.1);
        }
        @keyframes zoomFade {
          to { opacity: 1; transform: scale(1); }
        }

        .neon-glow {
          box-shadow: 0 0 10px rgba(144, 77, 0, 0.5), inset 0 0 10px rgba(144, 77, 0, 0.2);
          border: 1px solid rgba(144, 77, 0, 0.3);
        }

        .polaroid {
          background: white;
          padding: 10px 10px 40px 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        .polaroid:hover {
          transform: scale(1.05) rotate(0deg) !important;
          z-index: 10;
        }

        .sparkle-twinkle::after {
          content: '✨';
          position: absolute;
          animation: twinkle 1.5s infinite alternate;
        }
        @keyframes twinkle {
          from { opacity: 0.2; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday at 7:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="evelyns-celebration-masterpiece"
      />

      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-[#fdf9f4]/80 backdrop-blur-md transition-all duration-300 border-b border-[#cac7b1]/30">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center h-20">
          <div className="text-xl md:text-2xl text-[#5f5f00] italic font-bold">
            {celebrationHeader}
          </div>

          <nav className="hidden md:flex gap-8 font-sans text-sm font-semibold">
            <a
              className="text-[#904d00] border-b-2 border-[#904d00] pb-1"
              href="#about"
            >
              About
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] transition-colors"
              href="#timeline"
            >
              Timeline
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] transition-colors"
              href="#venue"
            >
              Venue
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] transition-colors"
              href="#gallery"
            >
              Gallery
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] transition-colors"
              href="#rsvp"
            >
              RSVP
            </a>
          </nav>

          <a
            className="hidden md:inline-flex bg-[#5f5f00] text-white px-6 py-2 rounded font-sans text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
            href="#rsvp"
          >
            RSVP Now
          </a>

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-[#5f5f00] p-2"
          >
            {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#fdf9f4] border-t border-[#cac7b1]/30 px-6 py-4 flex flex-col gap-3 text-center font-sans">
            <a
              href="#about"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#904d00] font-bold py-2 border-b border-[#f0eded]"
            >
              About
            </a>
            <a
              href="#timeline"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#484837] font-semibold py-2 border-b border-[#f0eded]"
            >
              Timeline
            </a>
            <a
              href="#venue"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#484837] font-semibold py-2 border-b border-[#f0eded]"
            >
              Venue
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#484837] font-semibold py-2 border-b border-[#f0eded]"
            >
              Gallery
            </a>
            <a
              href="#rsvp"
              onClick={() => setMobileNavOpen(false)}
              className="bg-[#5f5f00] text-white py-2.5 rounded font-semibold text-xs uppercase tracking-wider"
            >
              RSVP Now
            </a>
          </div>
        )}
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[880px] flex items-center justify-center py-20 px-6 md:px-16 max-w-[1280px] mx-auto" id="about">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center w-full">
            <div className="col-span-1 md:col-span-6 z-10 space-y-6">
              <p className="font-sans text-xs md:text-sm text-[#904d00] uppercase tracking-widest font-semibold">
                You are invited to celebrate
              </p>
              <h1 className="text-4xl md:text-6xl text-[#5f5f00] gold-shimmer-sweep leading-tight font-bold">
                {celebrantName}'s <br />
                Special Day
              </h1>
              <p className="text-base md:text-lg text-[#5d5c58] max-w-md leading-relaxed">
                Join us for an evening of joy, laughter, and unforgettable memories as we celebrate a milestone.
              </p>
            </div>

            <div className="col-span-1 md:col-span-6 relative flex justify-center mt-10 md:mt-0">
              <div className="relative w-full max-w-[500px] aspect-[4/5] cinematic-zoom">
                <img
                  alt={`${celebrantName} Birthday Masterpiece`}
                  className="w-full h-full object-cover rounded-t-full shadow-lg"
                  src={displayHeroImage}
                />
                {/* Botanical SVG Dotted Oval Frame */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none scale-105 opacity-80"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 100"
                >
                  <path
                    d="M5,50 C5,10 95,10 95,50 C95,90 5,90 5,50 Z"
                    fill="none"
                    stroke="#797865"
                    strokeDasharray="2 2"
                    strokeWidth="0.5"
                  ></path>
                  <circle cx="50" cy="10" fill="#904d00" r="2"></circle>
                  <circle cx="50" cy="90" fill="#904d00" r="2"></circle>
                  <circle cx="10" cy="50" fill="#904d00" r="2"></circle>
                  <circle cx="90" cy="50" fill="#904d00" r="2"></circle>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Wave Divider */}
        <div className="w-full text-[#f6f3f2]">
          <svg
            className="w-full h-16 fill-current"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>

        {/* Countdown Section */}
        <section className="bg-[#f6f3f2] py-20 px-6 md:px-16" id="countdown">
          <div className="max-w-[1280px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl text-[#5f5f00] font-bold mb-12">
              The Countdown Begins
            </h2>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center neon-glow bg-[#fdf9f4] text-[#904d00] text-3xl font-bold">
                  {String(timeLeft.days).padStart(2, "0")}
                </div>
                <span className="mt-3 font-sans text-xs text-[#5d5c58] uppercase font-bold tracking-wider">
                  Days
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center neon-glow bg-[#fdf9f4] text-[#904d00] text-3xl font-bold">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <span className="mt-3 font-sans text-xs text-[#5d5c58] uppercase font-bold tracking-wider">
                  Hours
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center neon-glow bg-[#fdf9f4] text-[#904d00] text-3xl font-bold">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <span className="mt-3 font-sans text-xs text-[#5d5c58] uppercase font-bold tracking-wider">
                  Mins
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Highlight Section */}
        <section className="bg-[#ff7f50] py-24 relative overflow-hidden text-white">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                A Night to <br />
                Remember
              </h2>
              <p className="text-base md:text-lg opacity-90 max-w-md leading-relaxed">
                Expect an evening filled with culinary delights, artisanal cocktails, and music under the stars.
              </p>
            </div>
            <div className="relative">
              <img
                alt="Party dancers under lights"
                className="w-full aspect-[4/3] object-cover shadow-2xl rounded-lg"
                src={props.coupleImage || props.heroImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuAZCkfapr3kHN4Z2HWJgMAu969WaZErlUGyVg0mTlWmloy-uhdFfRMiSSCNhMo0C-ymAjjw4hxDsngLL1kGZQcnTHrhrm63ss5ivqgcXiOtTcj8G6v_UY8--i2XPajDm5JADtmZbg6N9vPSeCkzBig52dT2B-1wtrydI05mNhiBPwfoOqJ5cxKc3HLl449etoHZfdJpxUI4ECa_Beg6zBU_E1QoKzLveaLhiBIdyzLbh-FVDEfdEIgm"}
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#5f5f00] rounded-full mix-blend-multiply opacity-50 pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-24 max-w-[1280px] mx-auto px-6 md:px-16" id="gallery">
          <div className="relative inline-block mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5f5f00]">
              Memories & Moments
            </h2>
            <span className="absolute -top-4 -right-8 text-2xl sparkle-twinkle"></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {galleryList.map((item: any, i: number) => {
              const url = typeof item === "string" ? item : item.url;
              const caption =
                typeof item === "string" ? `Moment #${i + 1}` : item.caption;
              const rotate =
                typeof item === "string"
                  ? i === 0
                    ? "rotate-[-2deg]"
                    : i === 1
                    ? "rotate-[3deg] md:mt-12"
                    : "rotate-[-1deg]"
                  : item.rotate || "";

              return (
                <div
                  key={i}
                  className={`polaroid ${rotate} mx-auto w-full max-w-sm rounded-sm`}
                >
                  <img
                    alt={caption}
                    className="w-full aspect-square object-cover bg-[#e4e2e1]"
                    src={url}
                  />
                  <p className="font-sans text-xs font-semibold text-center mt-4 text-[#5d5c58]">
                    {caption}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* RSVP Section */}
        <section id="rsvp" className="py-24 bg-[#fdf9f4] border-t border-[#cac7b1]/30">
          <RsvpSection partnerOne={celebrantName} partnerTwo="" />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#f6f3f2] border-t border-[#cac7b1]/30 w-full py-12">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="text-xl text-[#5f5f00] font-bold italic">
            {celebrationHeader}
          </div>
          <div className="text-xs text-[#5d5c58] font-sans">
            © {new Date().getFullYear()} Crafted with Love for {celebrantName}'s Special Day
          </div>
          <div className="flex gap-6 text-xs font-sans font-semibold">
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
