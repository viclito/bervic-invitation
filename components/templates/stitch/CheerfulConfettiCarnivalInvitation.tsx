"use client";

import { getWeddingTargetDate, formatAgeOrdinal } from "@/lib/dateUtils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, Play, ArrowRight, MapPin, Sparkles, Navigation } from "lucide-react";

export default function CheerfulConfettiCarnivalInvitation(
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
    days: 30,
    hours: 12,
    minutes: 45,
  });

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

      setTimeLeft({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(interval);
  }, [props.weddingDate, props.weddingTime]);

  // Gallery items matching exact Stitch screen 64ce78a8a1eb42f9a5887b466b991367
  const galleryList =
    props.galleryImages && props.galleryImages.filter(img => Boolean(Boolean(img && String(img).trim()))).length > 0
      ? props.galleryImages
      : [
          {
            url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80",
            caption: "The Early Days",
            rotate: "rotate-[-4deg]",
            clipColor: "bg-[#FFEA00]",
          },
          {
            url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80",
            caption: "Graduation",
            rotate: "rotate-[3deg] translate-y-4 md:translate-y-8",
            clipColor: "bg-[#00E5FF]",
          },
          {
            url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80",
            caption: "Recent Adventures",
            rotate: "rotate-[-2deg]",
            clipColor: "bg-[#FF3366]",
          },
        ];

  // Timeline items matching exact Stitch screen 64ce78a8a1eb42f9a5887b466b991367
  const timelineSteps =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay
      : [
          {
            time: "7:00 PM",
            title: "Welcome Drinks",
            desc: "Signature cocktails and mingling as guests arrive.",
            badgeColor: "bg-[#FFEA00]",
          },
          {
            time: "8:30 PM",
            title: "Dinner & Toasts",
            desc: "A feast to remember, followed by heartfelt words.",
            badgeColor: "bg-[#FF3366]",
          },
          {
            time: "10:00 PM",
            title: "Dance Floor Opens",
            desc: "Time to party! DJ starts spinning the best tracks.",
            badgeColor: "bg-[#FFEA00]",
          },
        ];

  // Venue location matching exact Stitch screen 64ce78a8a1eb42f9a5887b466b991367
  const mainVenue =
    props.locations && props.locations[0]
      ? props.locations[0]
      : {
          name: "The Grand Ballroom",
          address: "123 Celebration Ave, Festivity District, Party City, PC 90210",
          mapLink: "https://maps.google.com",
        };

  return (
    <div className="bg-[#FFFDF7] text-[#111111] font-sans antialiased overflow-x-hidden relative selection:bg-[#FF3366] selection:text-white min-h-screen">
      {/* Material Symbols Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Neo-Brutalist & Confetti Animations Engine */}
      <style>{`
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 20px;
          opacity: 0;
          border: 2px solid #111111;
          animation: fall 3s linear infinite;
        }
        @keyframes fall {
          0% { opacity: 1; top: -10%; transform: translateX(0) rotate(0deg); }
          100% { opacity: 0; top: 110%; transform: translateX(20px) rotate(360deg); }
        }

        .brutal-border {
          border: 4px solid #111111;
          box-shadow: 6px 6px 0px #111111;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .brutal-border:hover {
          transform: translate(-2px, -2px);
          box-shadow: 8px 8px 0px #111111;
        }

        .brutal-button {
          border: 3px solid #111111;
          box-shadow: 4px 4px 0px #111111;
          transition: all 0.2s ease;
        }
        .brutal-button:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px #111111;
        }
        .brutal-button:active {
          transform: translate(4px, 4px);
          box-shadow: 0px 0px 0px #111111;
        }

        .sparkle-anim {
          animation: sparkle 2s infinite ease-in-out alternate;
        }
        @keyframes sparkle {
          0% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          100% { transform: scale(1.2) rotate(15deg); opacity: 1; }
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday at 7:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="cheerful-confetti-carnival"
      />

      {/* Top Navigation Bar */}
      <nav className="bg-[#FFFDF7]/90 backdrop-blur-md fixed top-0 w-full z-50 border-b-4 border-[#111111]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center h-20">
          {/* Brand Logo */}
          <div className="text-xl md:text-2xl text-[#111111] font-bold italic relative">
            <span className="relative z-10">{celebrationHeader}</span>
            <div className="absolute -bottom-1 -right-2 w-full h-3 bg-[#00E5FF] -z-10 -skew-x-12"></div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-8 items-center text-sm font-bold uppercase tracking-wider">
            <a
              className="text-[#111111] hover:text-[#FF3366] transition-colors"
              href="#about"
            >
              About
            </a>
            <a
              className="text-[#111111] hover:text-[#00E5FF] transition-colors"
              href="#timeline"
            >
              Timeline
            </a>
            <a
              className="text-[#111111] hover:text-[#FF3366] transition-colors"
              href="#venue"
            >
              Venue
            </a>
            <a
              className="text-[#111111] hover:text-[#00E5FF] transition-colors"
              href="#gallery"
            >
              Gallery
            </a>
            <a
              className="text-[#111111] hover:text-[#FF3366] transition-colors"
              href="#rsvp"
            >
              RSVP
            </a>
          </div>

          {/* RSVP Button */}
          <a
            href="#rsvp"
            className="hidden md:inline-block bg-[#FFEA00] text-[#111111] text-xs font-black uppercase tracking-widest px-6 py-3 brutal-button"
          >
            RSVP Now
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-[#111111] p-2"
          >
            {mobileNavOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#FFFDF7] border-t-4 border-[#111111] px-6 py-6 flex flex-col gap-4 text-center">
            <a
              href="#about"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#111111] font-bold text-lg py-2 border-b-2 border-[#111111]/20"
            >
              About
            </a>
            <a
              href="#timeline"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#111111] font-bold text-lg py-2 border-b-2 border-[#111111]/20"
            >
              Timeline
            </a>
            <a
              href="#venue"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#111111] font-bold text-lg py-2 border-b-2 border-[#111111]/20"
            >
              Venue
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#111111] font-bold text-lg py-2 border-b-2 border-[#111111]/20"
            >
              Gallery
            </a>
            <a
              href="#rsvp"
              onClick={() => setMobileNavOpen(false)}
              className="bg-[#FFEA00] text-[#111111] py-3 rounded text-sm font-black uppercase tracking-wider brutal-button"
            >
              RSVP Now
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header
        className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#FFFDF7]"
        id="hero"
      >
        {/* Animated Confetti Particles */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {[...Array(35)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${(i * 3) % 100}vw`,
                animationDelay: `${(i * 0.2) % 3}s`,
                animationDuration: `${2.5 + ((i * 0.3) % 2)}s`,
                backgroundColor:
                  i % 4 === 0
                    ? "#FF3366"
                    : i % 4 === 1
                    ? "#00E5FF"
                    : i % 4 === 2
                    ? "#FFEA00"
                    : "#111111",
                width: i % 2 === 0 ? "14px" : "10px",
                height: i % 2 === 0 ? "14px" : "22px",
              }}
            />
          ))}
        </div>

        {/* Decorative Background Shapes */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-[#FF3366] rounded-full border-4 border-[#111111] -z-1 opacity-20" />
        <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-[#00E5FF] border-4 border-[#111111] rotate-12 -z-1 opacity-20" />

        <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-20 text-center flex flex-col items-center">
          <div className="relative mb-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-[#111111] font-black uppercase relative z-10 tracking-tight leading-none">
              Join the <br />
              <span className="text-[#FF3366] underline decoration-[#FFEA00] decoration-8 underline-offset-8">
                Celebration
              </span>
            </h1>
            {/* Sparkle Icons */}
            <span className="material-symbols-outlined absolute -top-8 -right-8 text-[#00E5FF] text-5xl sparkle-anim">
              flare
            </span>
            <span
              className="material-symbols-outlined absolute bottom-4 -left-12 text-[#FFEA00] text-6xl sparkle-anim"
              style={{ animationDelay: "1s" }}
            >
              star
            </span>
          </div>

          <div className="bg-white brutal-border p-6 max-w-2xl mx-auto mb-10 -rotate-1">
            <p className="text-base md:text-lg text-[#111111] font-medium leading-relaxed">
              A joyous occasion marking a special milestone. We invite you to share in the laughter, memories, and a truly unforgettable night full of surprises and confetti!
            </p>
          </div>

          <div className="flex gap-4 md:gap-6 flex-wrap justify-center">
            <a
              href="#rsvp"
              className="bg-[#FF3366] text-white text-xs md:text-sm px-8 py-4 uppercase tracking-widest font-black brutal-button inline-block"
            >
              Join the Party
            </a>
            <a
              href="#about"
              className="bg-[#00E5FF] text-[#111111] text-xs md:text-sm px-8 py-4 uppercase tracking-widest font-black brutal-button inline-block"
            >
              View Details
            </a>
          </div>
        </div>
      </header>

      {/* Countdown Section */}
      <section
        className="py-24 bg-[#FFEA00] border-y-4 border-[#111111] relative overflow-hidden"
        id="countdown"
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#111 2px, transparent 2px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="max-w-[1280px] mx-auto px-6 md:px-16 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl text-[#111111] font-black uppercase mb-12">
            The Countdown Begins
          </h2>
          <div className="flex justify-center gap-6 md:gap-10 flex-wrap">
            {/* Days */}
            <div className="bg-white brutal-border p-6 min-w-[140px] rotate-[2deg]">
              <div className="text-4xl md:text-5xl text-[#FF3366] font-black">
                {String(timeLeft.days).padStart(2, "0")}
              </div>
              <div className="text-xs font-bold text-[#111111] uppercase tracking-widest mt-2 border-t-2 border-[#111111] pt-2">
                Days
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white brutal-border p-6 min-w-[140px] -rotate-2">
              <div className="text-4xl md:text-5xl text-[#00E5FF] font-black">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <div className="text-xs font-bold text-[#111111] uppercase tracking-widest mt-2 border-t-2 border-[#111111] pt-2">
                Hours
              </div>
            </div>

            {/* Minutes */}
            <div className="bg-white brutal-border p-6 min-w-[140px] rotate-1">
              <div className="text-4xl md:text-5xl text-[#FF3366] font-black">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <div className="text-xs font-bold text-[#111111] uppercase tracking-widest mt-2 border-t-2 border-[#111111] pt-2">
                Mins
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight Marquee Banner */}
      <section className="py-6 bg-[#111111] overflow-hidden border-b-4 border-[#111111]">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[#FFEA00] text-2xl md:text-4xl uppercase font-black px-8">
            ★ GET READY TO PARTY ★ {celebrantName.toUpperCase()} IS CELEBRATING ★ BRING YOUR DANCING SHOES ★
          </span>
          <span className="text-[#00E5FF] text-2xl md:text-4xl uppercase font-black px-8">
            ★ GET READY TO PARTY ★ {celebrantName.toUpperCase()} IS CELEBRATING ★ BRING YOUR DANCING SHOES ★
          </span>
          <span className="text-[#FFEA00] text-2xl md:text-4xl uppercase font-black px-8">
            ★ GET READY TO PARTY ★ {celebrantName.toUpperCase()} IS CELEBRATING ★ BRING YOUR DANCING SHOES ★
          </span>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-[#FFFDF7] relative" id="about">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Video Card */}
            <div className="col-span-1 md:col-span-5 relative">
              <div className="bg-[#00E5FF] brutal-border aspect-square w-full absolute top-4 -left-4 -z-10"></div>
              <div className="bg-white brutal-border p-4 relative aspect-[4/3] flex items-center justify-center cursor-pointer group">
                <div className="absolute inset-0 bg-[#111111]/10 group-hover:bg-transparent transition-colors z-10"></div>
                <div className="z-20 bg-white brutal-button rounded-full p-4 group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-[#FF3366] fill-[#FF3366]" />
                </div>
                <div className="absolute inset-0 bg-gray-200 border-2 border-[#111111] m-4 flex items-center justify-center overflow-hidden">
                  <span className="text-[#111111]/50 font-bold uppercase tracking-wider text-sm">
                    Video Highlight
                  </span>
                </div>
              </div>
            </div>

            {/* Journey Details */}
            <div className="col-span-1 md:col-span-7 md:pl-8">
              <div className="inline-block bg-[#FFEA00] border-2 border-[#111111] px-4 py-1 mb-4 -rotate-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#111111]">
                  The Journey
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl text-[#111111] font-black uppercase mb-6 leading-tight">
                A Story Worth <br />
                <span className="text-[#FF3366]">Celebrating</span>
              </h2>
              <p className="text-base md:text-lg text-[#111111] font-medium mb-6 bg-white brutal-border p-6 leading-relaxed">
                From the earliest memories to this incredible milestone, {celebrantName}'s journey has been filled with laughter, adventure, and the unwavering support of friends and family. This celebration is as much about honoring the past as it is looking forward to the vibrant future ahead.
              </p>
              <a
                href="#timeline"
                className="bg-[#00E5FF] text-[#111111] text-xs font-black uppercase tracking-widest px-6 py-3 brutal-button inline-flex items-center gap-2"
              >
                <span>Read More</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section
        className="py-24 bg-[#00E5FF]/20 border-y-4 border-[#111111]"
        id="timeline"
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl text-[#111111] font-black uppercase">
              Schedule of Events
            </h2>
            <div className="w-24 h-4 bg-[#FF3366] border-2 border-[#111111] mx-auto mt-4"></div>
          </div>

          <div className="max-w-3xl mx-auto relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-2 bg-[#111111] -translate-x-1/2"></div>

            <div className="space-y-12">
              {timelineSteps.map((step, idx) => {
                const isEven = idx % 2 === 1;
                const badgeColor =
                  (step as any).badgeColor ||
                  (idx % 2 === 0 ? "bg-[#FFEA00]" : "bg-[#FF3366]");
                const textColor =
                  idx % 2 === 0 ? "text-[#FF3366]" : "text-[#00E5FF]";
                const rotate = idx === 0 ? "rotate-1" : idx === 1 ? "-rotate-1" : "rotate-2";

                return (
                  <div
                    key={idx}
                    className={`relative flex items-center justify-between md:flex-row flex-col ${
                      isEven ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Desktop Content Side */}
                    <div
                      className={`w-full md:w-[45%] hidden md:block ${
                        isEven ? "text-left pl-12" : "text-right pr-12"
                      }`}
                    >
                      <h3 className="text-xl font-bold text-[#111111] uppercase">
                        {step.title}
                      </h3>
                      <p className="text-sm font-medium text-[#111111] mt-2">
                        {"desc" in step
                          ? (step as any).desc
                          : "Join in the fun!"}
                      </p>
                    </div>

                    {/* Timeline Node Pin */}
                    <div
                      className={`absolute left-4 md:left-1/2 w-8 h-8 ${badgeColor} border-4 border-[#111111] rounded-full -translate-x-1/2 z-10`}
                    />

                    {/* Time Box */}
                    <div
                      className={`w-full md:w-[45%] pl-12 md:pl-0 bg-white brutal-border p-4 ${rotate} ${
                        isEven ? "md:text-right md:pr-4" : ""
                      }`}
                    >
                      <div className={`text-3xl md:text-4xl ${textColor} font-black`}>
                        {step.time}
                      </div>
                      <div className="md:hidden mt-2">
                        <h3 className="text-lg font-bold text-[#111111] uppercase">
                          {step.title}
                        </h3>
                        <p className="text-xs font-medium text-[#111111] mt-1">
                          {"desc" in step
                            ? (step as any).desc
                            : "Join in the fun!"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-24 bg-[#FFFDF7]" id="venue">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="col-span-1 md:col-span-5 flex flex-col justify-center">
              <div className="inline-block bg-[#00E5FF] border-2 border-[#111111] px-4 py-1 mb-4 self-start rotate-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#111111]">
                  The Location
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl text-[#111111] font-black uppercase mb-6 leading-tight">
                The Grand <br />
                <span className="text-[#FFEA00] bg-[#111111] px-2 py-0.5">
                  Ballroom
                </span>
              </h2>

              <div className="bg-white brutal-border p-6 mb-8">
                <h3 className="text-xl font-bold text-[#111111] mb-2">
                  {mainVenue.name || "The Grand Ballroom"}
                </h3>
                <p className="text-sm font-medium text-[#111111] mb-4">
                  {mainVenue.address}
                </p>
                <p className="text-sm text-[#111111] mb-6 leading-relaxed">
                  Join us at the city's most vibrant venue. Valet parking is available at the main entrance.
                </p>
                <a
                  className="bg-[#FF3366] text-white text-xs font-black px-4 py-3 uppercase tracking-widest brutal-button inline-flex items-center gap-2"
                  href={mainVenue.mapLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Map Card */}
            <div className="col-span-1 md:col-span-7">
              <div className="bg-[#FFEA00] brutal-border p-2 w-full h-full min-h-[380px] relative rotate-1">
                <div className="absolute inset-0 m-2 border-4 border-[#111111] bg-gray-200 overflow-hidden flex items-center justify-center">
                  <span className="text-[#111111]/50 font-bold text-xl uppercase tracking-widest flex flex-col items-center gap-2">
                    <MapPin className="w-12 h-12 text-[#FF3366]" />
                    <span>Map Preview</span>
                  </span>
                </div>
                <div className="absolute -top-5 -right-5 w-14 h-14 bg-[#00E5FF] border-4 border-[#111111] rounded-full flex items-center justify-center animate-bounce shadow-md">
                  <MapPin className="w-7 h-7 text-[#111111] font-bold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        className="py-24 bg-[#FF3366] border-t-4 border-[#111111] overflow-hidden"
        id="gallery"
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl text-white font-black uppercase mb-4 drop-shadow-[4px_4px_0_#111]">
            Memories
          </h2>
          <p className="text-base md:text-lg text-white font-bold mb-16 max-w-2xl mx-auto bg-[#111111] px-4 py-2 inline-block -rotate-1">
            A sneak peek into the fun times
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {galleryList.map((item: any, i: number) => {
              const url = typeof item === "string" ? item : item.url;
              const caption =
                typeof item === "string" ? `Moment #${i + 1}` : item.caption;
              const rotate =
                typeof item === "string"
                  ? i === 0
                    ? "rotate-[-4deg]"
                    : i === 1
                    ? "rotate-[3deg] translate-y-4 md:translate-y-8"
                    : "rotate-[-2deg]"
                  : item.rotate || "";
              const clipColor =
                (item as any).clipColor ||
                (i === 0 ? "bg-[#FFEA00]" : i === 1 ? "bg-[#00E5FF]" : "bg-[#FF3366]");

              return (
                <div
                  key={i}
                  className={`bg-white brutal-border p-4 pb-12 ${rotate} hover:rotate-0 transition-transform duration-300 z-10 hover:z-20 relative`}
                >
                  <div className="aspect-square bg-gray-200 border-2 border-[#111111] mb-4 overflow-hidden">
                    <img
                      alt={caption}
                      className="w-full h-full object-cover"
                      src={url}
                    />
                  </div>
                  <div className="text-xs md:text-sm font-bold text-[#111111] uppercase text-center absolute bottom-4 left-0 w-full tracking-wider">
                    {caption}
                  </div>
                  {/* Top Pin Clip */}
                  <div
                    className={`absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 ${clipColor} border-2 border-[#111111] rounded-full z-10`}
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 80%)",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-24 bg-[#FFFDF7]">
        <RsvpSection partnerOne={celebrantName} partnerTwo="" />
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] w-full py-16 border-t-8 border-[#FFEA00] relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col items-center gap-8 relative z-10 text-center">
          <div className="text-3xl md:text-5xl text-[#FFEA00] font-black uppercase">
            {celebrantName}'s <span className="text-[#FF3366]">Celebration</span>
          </div>
          <div className="flex gap-8 text-xs md:text-sm font-bold uppercase tracking-widest text-white">
            <a href="#" className="hover:text-[#FF3366] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#00E5FF] transition-colors">
              Contact
            </a>
            <a href="#rsvp" className="hover:text-[#FFEA00] transition-colors">
              RSVP
            </a>
          </div>
          <div className="text-xs text-gray-400 bg-[#111111] border border-gray-700 px-4 py-2">
            © {new Date().getFullYear()} Crafted with Love (and Confetti) for {celebrantName}'s Special Day
          </div>
        </div>
      </footer>
    </div>
  );
}
