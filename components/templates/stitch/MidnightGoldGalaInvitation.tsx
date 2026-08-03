"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Menu,
  X,
  PlayCircle,
  MapPin,
  Car,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function MidnightGoldGalaInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  // Celebrant name & headers
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const celebrationHeader = `${celebrantName}'s Celebration`;
  const galaTitle = `${celebrantName}'s Midnight Gold Gala`;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 45,
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
    const targetDate = new Date(
      props.weddingDate || "2026-09-15T18:00:00"
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
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [props.weddingDate]);

  // Gallery images fallback
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

  // Evening Itinerary fallback
  const itinerary =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay
      : [
          {
            time: "6:30 PM",
            title: "Welcome Reception",
            desc: "Signature cocktails and hors d'oeuvres in the Grand Foyer.",
          },
          {
            time: "8:00 PM",
            title: "Dinner Service",
            desc: "A curated three-course meal in the main ballroom.",
          },
          {
            time: "9:30 PM",
            title: "Dancing & Celebrations",
            desc: "Live music and dancing into the midnight hours.",
          },
        ];

  // Venue location fallback
  const mainVenue =
    props.locations && props.locations[0]
      ? props.locations[0]
      : {
          name: "The Grand Estate",
          address: "123 Elegance Boulevard, Metropolis, NY 10001",
          mapLink: "https://maps.google.com",
        };

  return (
    <div className="bg-[#fcf9f8] text-[#1b1c1c] font-sans antialiased overflow-x-hidden relative selection:bg-[#ffa049] selection:text-[#6e3a00]">
      {/* Google Material Symbols Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Embedded CSS for Exact Shimmer, Twinkle, and Neon Glow Effects */}
      <style>{`
        .gold-shimmer {
          background: linear-gradient(
            90deg,
            #1b1c1c 0%,
            #ffa049 50%,
            #1b1c1c 100%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

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

        @keyframes shimmer {
          to { background-position: 200% center; }
        }

        .cinematic-fade {
          animation: fadeIn 1.8s ease-in-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .neon-glow {
          box-shadow: 0 0 10px rgba(144, 77, 0, 0.5), inset 0 0 10px rgba(144, 77, 0, 0.2);
          border: 1px solid rgba(144, 77, 0, 0.3);
        }

        .polaroid {
          background: white;
          padding: 10px 10px 40px 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }
        .polaroid:hover { transform: scale(1.05) rotate(0deg) !important; z-index: 10; }

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

      {/* Guest Envelope Cover */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday at 6:30 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="midnight-gold-gala"
      />

      {/* Top Glassmorphism Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#fcf9f8]/80 backdrop-blur-md transition-all duration-300 ease-in-out border-b border-[#e4e2e1]/50 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center h-20">
          <a
            className="font-serif text-2xl text-[#5f5f00] italic font-semibold"
            href="#"
          >
            {celebrationHeader}
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center text-sm font-semibold">
            <a
              className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300"
              href="#about"
            >
              About
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300"
              href="#timeline"
            >
              Timeline
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300"
              href="#venue"
            >
              Venue
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300"
              href="#gallery"
            >
              Gallery
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300"
              href="#rsvp"
            >
              RSVP
            </a>
          </div>

          <a
            className="hidden md:inline-flex bg-[#5f5f00] text-white px-6 py-3 rounded hover:bg-[#626200] transition-colors duration-300 font-semibold text-xs uppercase tracking-wider shadow-sm"
            href="#rsvp"
          >
            RSVP Now
          </a>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-[#5f5f00] p-2"
          >
            {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#fcf9f8] border-b border-[#e4e2e1] px-6 py-4 flex flex-col gap-4 text-center">
            <a
              href="#about"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#484837] font-semibold py-2"
            >
              About
            </a>
            <a
              href="#timeline"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#484837] font-semibold py-2"
            >
              Timeline
            </a>
            <a
              href="#venue"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#484837] font-semibold py-2"
            >
              Venue
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#484837] font-semibold py-2"
            >
              Gallery
            </a>
            <a
              href="#rsvp"
              onClick={() => setMobileNavOpen(false)}
              className="bg-[#5f5f00] text-white py-3 rounded font-semibold text-xs uppercase tracking-wider"
            >
              RSVP Now
            </a>
          </div>
        )}
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[850px] md:min-h-[921px] flex items-center justify-center overflow-hidden bg-[#ffffff]">
          <div className="absolute inset-0 z-0">
            <div
              className="bg-cover bg-center w-full h-full opacity-60"
              style={{
                backgroundImage: `url('${
                  props.heroImage ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuD0UYLzxxkzcgL_Ry2JKz9_ej15-wsUHOVw6BET408ObWqPcQjCean3UdBgo0qj1fHjBbN_PCvlkLkFN023hfOj017BIio-GRlcqsUHan_rE7lDUP8v3cDzzG2HlGZy_eetgAm4EOm-37ekPuw3ntOMf1p5UMGlfj1i5sMBpLC9ttj0w4f8bcDr4FKFhLsd7RFgSGdXSFIAy8oYRjVe_hweChFpRaZxMncqEFzDSu7RNEWvY4xXWzep"
                }')`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#fcf9f8] via-[#fcf9f8]/50 to-transparent"></div>
          </div>

          <div className="relative z-10 text-center max-w-4xl px-6 md:px-16 cinematic-fade">
            <p className="font-semibold text-xs text-[#904d00] tracking-[0.2em] uppercase mb-4">
              You are cordially invited
            </p>

            <h1 className="text-4xl md:text-6xl font-bold font-serif text-[#1b1c1c] mb-6 gold-shimmer italic leading-tight">
              {galaTitle}
            </h1>

            <p className="text-lg md:text-xl font-serif text-[#484837] max-w-2xl mx-auto mb-10 leading-relaxed">
              {props.inviteLine && !props.inviteLine.includes("wedding")
                ? props.inviteLine
                : "Join us for an evening of elegance, celebration, and unforgettable moments as we toast to a beautiful milestone."}
            </p>

            <a
              className="inline-flex items-center justify-center bg-[#5f5f00] text-white px-8 py-4 rounded font-semibold text-xs uppercase tracking-wider hover:bg-[#626200] transition-all shadow-[0_4px_14px_0_rgba(95,95,0,0.39)] hover:shadow-[0_6px_20px_rgba(95,95,0,0.23)] hover:-translate-y-0.5"
              href="#rsvp"
            >
              Reserve Your Place
            </a>
          </div>
        </section>

        {/* Wave Divider */}
        <div className="w-full text-[#f6f3f2]">
          <svg className="w-full h-16 fill-current" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>

        {/* Countdown Section */}
        <section className="bg-[#f6f3f2] py-20 px-4">
          <div className="max-w-[1280px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] mb-12">
              The Countdown Begins
            </h2>
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center neon-glow bg-[#fcf9f8] text-[#904d00] font-serif text-3xl font-bold">
                  {String(timeLeft.days).padStart(2, "0")}
                </div>
                <span className="mt-3 text-xs font-semibold text-[#5d5c58] uppercase tracking-widest">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center neon-glow bg-[#fcf9f8] text-[#904d00] font-serif text-3xl font-bold">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <span className="mt-3 text-xs font-semibold text-[#5d5c58] uppercase tracking-widest">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center neon-glow bg-[#fcf9f8] text-[#904d00] font-serif text-3xl font-bold">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <span className="mt-3 text-xs font-semibold text-[#5d5c58] uppercase tracking-widest">
                  Mins
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 px-6 md:px-16 max-w-[1280px] mx-auto" id="about">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-6 space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold font-serif gold-shimmer-sweep">
                Our Story
              </h2>
              <p className="text-lg text-[#484837] font-serif leading-relaxed">
                It feels like just yesterday that this journey began. Through seasons of change and moments of quiet beauty, every step has been a testament to growth and resilience.
              </p>
              <p className="text-base text-[#5d5c58] font-serif leading-relaxed">
                {props.loveStoryText ||
                  `Join us as we reflect on the memories we've shared and look forward to the adventures still to come. This celebration is not just about a milestone, but about the people who have made the journey so special.`}
              </p>
            </div>

            <div className="md:col-span-6 mt-10 md:mt-0">
              <img
                alt="Story Portrait"
                className="w-full h-auto rounded-lg shadow-xl border border-[#cac7b1]/30"
                src={
                  props.coupleImage ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDPNnny-dlognAkhDvCNhFRNyGdojg7bnFj9koTHxsIkmDMy9nv5DW7U0sXvez0NdnLDBzJQ6PvCHZR9AS2jITAmqVVxSufalgrhBrSBTPIvD--MbXtkg9fIiOYoMjfDqBBXZB8eiJJDcdjhIXBxHAkPd9wImdF-x76N_PDM5xs7wjIwV8ruvkfZa4hLejyc3xLQlDdzHrJ6g90juloHzWGSTBzYafBH3TYgbA2plyz-2xVOzLfvtZ1"
                }
              />
            </div>
          </div>
        </section>

        {/* Timeline Section (Evening Itinerary) */}
        <section className="bg-[#ffffff] py-24 px-6 md:px-16" id="timeline">
          <div className="max-w-3xl mx-auto space-y-16">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-center gold-shimmer-sweep">
              Evening Itinerary
            </h2>

            <div className="space-y-12">
              {itinerary.map((item, idx) => (
                <div key={idx} className="flex items-start gap-6">
                  <div className="text-[#904d00] font-serif text-xl md:text-2xl font-semibold min-w-[100px]">
                    {item.time}
                  </div>
                  <div className={`border-l-2 border-[#797900] pl-6 ${idx < itinerary.length - 1 ? "pb-8" : ""}`}>
                    <h3 className="text-xl font-bold font-serif text-[#1b1c1c]">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-[#5d5c58] font-serif mt-2 leading-relaxed">
                      {"desc" in item ? (item as any).desc : "Enjoy cocktails and dining."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Highlight Section */}
        <section className="bg-[#904d00] py-24 relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div className="text-white space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold font-serif leading-tight">
                A Night to <br />Remember
              </h2>
              <p className="text-lg opacity-90 max-w-md font-serif leading-relaxed">
                Expect an evening filled with culinary delights, artisanal cocktails, and music under the stars.
              </p>
            </div>

            <div className="relative">
              <img
                alt="Celebration moment"
                className="w-full aspect-[4/3] object-cover shadow-2xl rounded-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZCkfapr3kHN4Z2HWJgMAu969WaZErlUGyVg0mTlWmloy-uhdFfRMiSSCNhMo0C-ymAjjw4hxDsngLL1kGZQcnTHrhrm63ss5ivqgcXiOtTcj8G6v_UY8--i2XPajDm5JADtmZbg6N9vPSeCkzBig52dT2B-1wtrydI05mNhiBPwfoOqJ5cxKc3HLl449etoHZfdJpxUI4ECa_Beg6zBU_E1QoKzLveaLhiBIdyzLbh-FVDEfdEIgm"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#5f5f00] rounded-full mix-blend-multiply opacity-50 pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Venue Section */}
        <section className="py-24 px-6 md:px-16 max-w-[1280px] mx-auto" id="venue">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-6 order-2 md:order-1">
              <div className="w-full h-80 bg-[#e4e2e1] flex flex-col items-center justify-center rounded-lg shadow-md border border-[#cac7b1]/40 p-6 text-center space-y-2">
                <MapPin className="w-10 h-10 text-[#904d00]" />
                <span className="text-[#5d5c58] font-semibold text-sm">
                  {mainVenue.name || "The Grand Estate"}
                </span>
                <span className="text-[#484837] text-xs max-w-xs">
                  {mainVenue.address}
                </span>
              </div>
            </div>

            <div className="md:col-span-6 order-1 md:order-2 space-y-6 md:pl-12">
              <h2 className="text-3xl md:text-5xl font-bold font-serif gold-shimmer">
                {mainVenue.name || "The Grand Estate"}
              </h2>
              <p className="text-lg text-[#484837] font-serif leading-relaxed">
                {mainVenue.address}
              </p>
              <p className="text-base text-[#5d5c58] font-serif leading-relaxed">
                Complimentary valet parking will be available at the main entrance. We recommend arriving 15 minutes prior to the start time.
              </p>
              <a
                className="inline-flex items-center gap-2 text-[#904d00] hover:text-[#5f5f00] transition-colors font-semibold text-xs uppercase tracking-wider"
                href={mainVenue.mapLink}
                target="_blank"
                rel="noreferrer"
              >
                <span>Get Directions</span>
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="bg-[#f6f3f2] py-24 px-6 md:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-3xl md:text-5xl font-bold font-serif gold-shimmer-sweep">
              A Glimpse of the Magic
            </h2>
            <div className="relative w-full aspect-video bg-[#e4e2e1] rounded-xl shadow-2xl overflow-hidden flex items-center justify-center border border-[#cac7b1]/30 group">
              <span className="material-symbols-outlined text-6xl text-[#5f5f00] opacity-80 cursor-pointer group-hover:scale-110 transition-transform">
                play_circle
              </span>
              <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-24 max-w-[1280px] mx-auto px-6 md:px-16" id="gallery">
          <div className="relative inline-block mb-12">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-[#5f5f00]">
              Memories &amp; Moments
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
                  ? i % 2 === 0
                    ? "rotate-[-2deg]"
                    : "rotate-[3deg]"
                  : item.rotate || "";

              return (
                <div
                  key={i}
                  className={`polaroid ${rotate} mx-auto w-full max-w-sm`}
                >
                  <img
                    alt={caption}
                    className="w-full aspect-square object-cover bg-[#e4e2e1] rounded-sm"
                    src={url}
                  />
                  <p className="text-xs text-center mt-4 text-[#5d5c58] font-serif uppercase tracking-wider">
                    {caption}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* RSVP Section */}
        <section id="rsvp" className="py-20 bg-[#fcf9f8]">
          <RsvpSection partnerOne={celebrantName} partnerTwo="" />
        </section>

        {/* Footer */}
        <footer className="bg-[#f6f3f2] w-full py-12 border-t border-[#cac7b1]/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="font-serif text-xl font-bold text-[#5f5f00]">
              {celebrationHeader}
            </div>
            <div className="text-xs text-[#5d5c58] font-serif">
              © {new Date().getFullYear()} Crafted with Love for {celebrantName}'s Special Day
            </div>
            <div className="flex space-x-6 text-xs text-[#484837]">
              <a href="#" className="hover:text-[#904d00] transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-[#904d00] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
