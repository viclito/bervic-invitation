"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { TemplateClassicFloralProps } from "@/types/template";
import { getYouTubeEmbedUrl, getWeddingTargetDate, formatAgeOrdinal } from "@/lib/dateUtils";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, MapPin, Car, Compass } from "lucide-react";

export default function WhimsicalStorybookInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  // Celebrant name & headers
  const celebrantName =
    props.celebrantName ||
    (props.partnerOne && props.partnerOne !== "Your Name" ? props.partnerOne : "Evelyn");
  const ageMilestone = formatAgeOrdinal(props.turningAge);
  const celebrationHeader = ageMilestone
    ? `${celebrantName}'s ${ageMilestone} Birthday`
    : `${celebrantName}'s Celebration`;

  // Video state
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Celebrant portrait images
  const celebrantImg =
    props.coupleImage ||
    props.coverImage ||
    props.heroImage ||
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80";

  const coverImg =
    props.coverImage ||
    props.heroImage ||
    props.coupleImage ||
    celebrantImg;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Soft celebratory confetti explosion on mount
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const remaining = animationEnd - Date.now();
      if (remaining <= 0) return clearInterval(interval);

      const particleCount = 50 * (remaining / duration);
      const colors = ["#e9e86b", "#ffb77c", "#ffdcc2", "#ffdad6"];

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors,
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors,
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Live countdown timer computation
  useEffect(() => {
    const targetDate = getWeddingTargetDate(props.weddingDate, props.weddingTime).getTime();

    const updateTimer = () => {
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
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [props.weddingDate, props.weddingTime]);

  const defaultGallery = [
    "/images/templates/gallery-1.jpg",
    "/images/templates/gallery-2.jpg",
    "/images/templates/gallery-3.jpg",
    "/images/templates/gallery-4.jpg",
    "/images/templates/gallery-5.jpg",
    "/images/templates/gallery-6.jpg",
  ];

  const galleryList = props.galleryImages && props.galleryImages.length > 0 ? props.galleryImages : defaultGallery;

  const defaultTimeline = [
    {
      time: "4:00 PM",
      title: "Welcome & Mingling",
      desc: "Arrive, grab a welcome drink, and find your way through the garden path.",
    },
    {
      time: "5:30 PM",
      title: "The Main Event",
      desc: "Gather around for vows, toasts, and a few surprises.",
    },
    {
      time: "7:00 PM",
      title: "Dinner & Dancing Under the Stars",
      desc: "A feast followed by music as the evening settles in.",
    },
  ];

  const timelineSteps =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay
      : defaultTimeline;

  const displayHeroImage = coverImg;

  const displayStoryText =
    props.loveStoryText ||
    `Join us as we celebrate another magical year filled with laughter, cherished moments, and wonderful friendships. Here is to celebrating ${celebrantName}'s special milestone with those who make life beautiful!`;

  // Venue location fallback & sanitization
  const rawVenueName =
    props.locations && props.locations[0]
      ? props.locations[0].name || props.locations[0].venueLabel || "The Enchanted Garden Reserve"
      : "The Enchanted Garden Reserve";

  const displayVenueName = /marriage|ceremony|wedding/i.test(rawVenueName)
    ? "The Enchanted Garden Reserve"
    : rawVenueName;

  const rawVenueAddress =
    props.locations && props.locations[0]
      ? props.locations[0].address || "123 Secret Garden Lane, Whimsical Valley, WV 90210"
      : "123 Secret Garden Lane, Whimsical Valley, WV 90210";

  const displayVenueAddress = /marriage|wedding/i.test(rawVenueAddress)
    ? "123 Secret Garden Lane, Whimsical Valley, WV 90210"
    : rawVenueAddress;

  const mainVenue = {
    name: displayVenueName,
    address: displayVenueAddress,
    mapLink: (props.locations && props.locations[0] && props.locations[0].mapLink) || "https://maps.google.com",
  };

  return (
    <div className="bg-[#fcf9f8] text-[#1b1c1c] font-sans antialiased overflow-x-hidden relative selection:bg-[#5f5f00] selection:text-white">
      {/* Material Symbols Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Whimsical Storybook Keyframes & CSS Engine */}
      <style>{`
        .sparkle-container {
          position: relative;
          display: inline-block;
        }
        .sparkle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #e9e86b;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          animation: twinkle 2s infinite ease-in-out;
          opacity: 0;
        }
        .sparkle:nth-child(1) { top: -10px; left: -10px; animation-delay: 0s; }
        .sparkle:nth-child(2) { top: -5px; right: -15px; animation-delay: 0.5s; width: 6px; height: 6px; }
        .sparkle:nth-child(3) { bottom: -10px; left: 10px; animation-delay: 1s; width: 10px; height: 10px; }
        .sparkle:nth-child(4) { bottom: 0; right: -10px; animation-delay: 1.5s; }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(45deg); }
        }

        .polaroid {
          background: white;
          padding: 16px 16px 48px 16px;
          box-shadow: 0 4px 6px -1px rgba(95, 95, 0, 0.1), 0 2px 4px -1px rgba(95, 95, 0, 0.06);
          transition: transform 0.3s ease;
        }
        .polaroid:hover {
          transform: scale(1.05) rotate(0deg) !important;
          z-index: 10;
        }

        .organic-shape {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: morph 8s ease-in-out infinite;
        }
        @keyframes morph {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }

        @keyframes gold-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .gold-shimmer-text {
          background: linear-gradient(to right, #5f5f00 20%, #e9e86b 40%, #e9e86b 60%, #5f5f00 80%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: gold-shimmer 4s linear infinite;
        }

        @keyframes cinematic-zoom {
          0% { transform: scale(1.1); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .cinematic-zoom-bg {
          animation: cinematic-zoom 20s ease-out forwards;
        }

        @keyframes float-up {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        .floating-element {
          position: fixed;
          z-index: 0;
          bottom: -50px;
          animation: float-up 15s linear infinite;
        }

        .glow-ring {
          box-shadow: 0 0 15px rgba(233, 232, 107, 0.4);
        }

        .wave-divider {
          position: absolute;
          left: 0;
          width: 100%;
          overflow: hidden;
          line-height: 0;
        }
        .wave-divider svg {
          position: relative;
          display: block;
          width: calc(100% + 1.3px);
          height: 40px;
        }
        .wave-divider .shape-fill {
          fill: #f6f3f2;
        }
      `}</style>

      {/* Floating Elements Background */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="floating-element bg-[#ffdcc2] w-3 h-3 rounded-full" style={{ left: "10%", animationDelay: "0s", animationDuration: "12s" }}></div>
        <div className="floating-element bg-[#e9e86b] w-4 h-4 rounded-sm" style={{ left: "20%", animationDelay: "2s", animationDuration: "15s" }}></div>
        <div className="floating-element bg-[#ffdad6] w-2 h-2 rounded-full" style={{ left: "30%", animationDelay: "5s", animationDuration: "10s" }}></div>
        <div className="floating-element bg-[#ffdcc2] w-5 h-5 rounded-full" style={{ left: "45%", animationDelay: "1s", animationDuration: "18s" }}></div>
        <div className="floating-element bg-[#cccc52] w-3 h-3 rounded-sm" style={{ left: "60%", animationDelay: "7s", animationDuration: "14s" }}></div>
        <div className="floating-element bg-[#ffdad6] w-4 h-4 rounded-full" style={{ left: "75%", animationDelay: "3s", animationDuration: "11s" }}></div>
        <div className="floating-element bg-[#ffdcc2] w-2 h-2 rounded-full" style={{ left: "85%", animationDelay: "6s", animationDuration: "16s" }}></div>
      </div>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday at 4:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="whimsical-storybook"
      />

      {/* Top Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          navScrolled
            ? "bg-[#fcf9f8]/90 backdrop-blur-md shadow-sm border-b border-[#cac7b1]/30"
            : "bg-[#fcf9f8]/80 backdrop-blur-md border-b border-transparent shadow-none"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center h-20">
          <div className="font-serif text-2xl font-semibold italic text-[#5f5f00] gold-shimmer-text">
            {celebrationHeader}
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex space-x-8 font-serif text-sm">
            <li>
              <a
                className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300"
                href="#about"
              >
                About
              </a>
            </li>
            <li>
              <a
                className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300"
                href="#timeline"
              >
                Timeline
              </a>
            </li>
            <li>
              <a
                className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300"
                href="#venue"
              >
                Venue
              </a>
            </li>
            <li>
              <a
                className="text-[#904d00] border-b border-[#904d00] pb-1 font-semibold"
                href="#gallery"
              >
                Gallery
              </a>
            </li>
            <li>
              <a
                className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300"
                href="#rsvp"
              >
                RSVP
              </a>
            </li>
          </ul>

          <a
            className="hidden md:inline-flex items-center justify-center bg-[#5f5f00] text-white px-6 py-2.5 rounded-full font-semibold text-xs uppercase tracking-wider hover:bg-[#797900] transition-colors shadow-sm"
            href="#rsvp"
          >
            RSVP Now
          </a>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-[#5f5f00] p-2"
          >
            {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#fcf9f8] border-b border-[#cac7b1]/30 px-6 py-4 flex flex-col gap-4 text-center shadow-lg">
            <a
              href="#about"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#484837] font-semibold py-2 border-b border-[#f0eded]"
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
              className="bg-[#5f5f00] text-white py-3 rounded-full font-semibold text-xs uppercase tracking-wider"
            >
              RSVP Now
            </a>
          </div>
        )}
      </nav>

      <main className="pt-20 relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center justify-center overflow-hidden px-6 md:px-16 py-20 bg-[#fcf9f8]">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center opacity-40 cinematic-zoom-bg"
              style={{
                backgroundImage: `url('${displayHeroImage}')`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#fcf9f8]/60 via-[#fcf9f8]/20 to-[#fcf9f8]"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center mt-12 space-y-6">
            <div className="inline-block px-5 py-2 bg-[#5f5f00]/10 rounded-full text-[#5f5f00] text-xs font-bold uppercase tracking-[0.25em] border border-[#5f5f00]/30 shadow-sm">
              {props.tagline || (ageMilestone ? `CELEBRATING ${ageMilestone.toUpperCase()}` : "A MAGICAL CELEBRATION")}
            </div>

            <h1 className="text-4xl md:text-7xl font-bold font-serif sparkle-container gold-shimmer-text leading-tight">
              {celebrantName}&apos;s {ageMilestone ? `${ageMilestone} Birthday` : "Special Day"}
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
              <div className="sparkle"></div>
            </h1>

            <p className="text-base md:text-xl font-serif text-[#484837] max-w-2xl mx-auto leading-relaxed italic">
              {props.inviteLine && !props.inviteLine.includes("wedding")
                ? props.inviteLine
                : "Join us in celebrating this special birthday with an evening of music, delicious dining, and wonderful company!"}
            </p>

            {props.welcomeMessage && (
              <p className="text-sm font-serif text-[#904d00] font-semibold max-w-xl mx-auto tracking-wide">
                "{props.welcomeMessage}"
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <a
                className="w-full sm:w-auto bg-[#5f5f00] text-white px-8 py-4 rounded-full font-semibold text-xs uppercase tracking-wider hover:bg-[#797900] transition-all text-center shadow-[0_4px_14px_0_rgba(95,95,0,0.39)] hover:shadow-[0_6px_20px_rgba(95,95,0,0.23)] hover:-translate-y-0.5 duration-200"
                href="#rsvp"
              >
                RSVP Now
              </a>
            </div>
          </div>

          {/* Decorative ambient background blobs */}
          <div className="absolute -left-20 top-40 w-64 h-64 bg-[#ffdcc2] opacity-30 blur-3xl rounded-full mix-blend-multiply"></div>
          <div className="absolute -right-20 bottom-20 w-80 h-80 bg-[#cccc52] opacity-20 blur-3xl rounded-full mix-blend-multiply"></div>
        </section>

        {/* Meet the Celebrant Section */}
        <section className="py-20 px-6 md:px-16 bg-[#fcf9f8] border-b border-[#cac7b1]/30" id="couple">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div>
              <span className="text-xs font-bold text-[#904d00] uppercase tracking-[0.3em] block mb-2">
                {ageMilestone ? `Celebrating ${ageMilestone}` : "The Birthday Celebrant"}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-[#5f5f00] gold-shimmer-text">
                Celebrating {celebrantName}
              </h2>
            </div>

            <div className="max-w-md mx-auto">
              {/* Celebrant Card */}
              <div className="group relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#5f5f00]/30 bg-white p-3">
                <div className="relative h-[420px] w-full rounded-2xl overflow-hidden">
                  <img
                    src={celebrantImg}
                    alt={`${celebrantName} - Birthday Celebrant`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#5f5f00]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-left text-white">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#e9e86b] font-bold block mb-1">
                      {ageMilestone ? `${ageMilestone} Milestone` : "Birthday Celebrant"}
                    </span>
                    <h3 className="text-3xl font-serif font-bold">{celebrantName}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-24 px-6 md:px-16 bg-[#f6f3f2] relative" id="countdown">
          <div className="max-w-[1280px] mx-auto text-center pt-4 space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] gold-shimmer-text">
              The Celebration Begins In...
            </h2>

            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#cccc52] flex items-center justify-center glow-ring bg-white mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#5f5f00]/5"></div>
                  <span className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] relative z-10">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#484837] uppercase tracking-widest">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#cccc52] flex items-center justify-center glow-ring bg-white mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#5f5f00]/5"></div>
                  <span className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] relative z-10">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#484837] uppercase tracking-widest">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#cccc52] flex items-center justify-center glow-ring bg-white mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#5f5f00]/5"></div>
                  <span className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] relative z-10">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#484837] uppercase tracking-widest">
                  Minutes
                </span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#cccc52] flex items-center justify-center glow-ring bg-white mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#5f5f00]/5"></div>
                  <span className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] relative z-10">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#484837] uppercase tracking-widest">
                  Seconds
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24 px-6 md:px-16 bg-[#fcf9f8] relative" id="about">
          <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 md:col-start-2 order-2 md:order-1 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] gold-shimmer-text">
                  The Journey &amp; Milestones
                </h2>
                <p className="text-base font-serif text-[#484837] leading-relaxed">
                  {displayStoryText}
                </p>
              </div>

              <div className="md:col-span-5 md:col-start-8 order-1 md:order-2">
                <div className="relative">
                  <div className="organic-shape w-full aspect-square bg-[#ffdcc2] opacity-40 absolute -inset-4 z-0 pointer-events-none"></div>
                  <img
                    alt={`${celebrantName} portrait`}
                    className="relative z-10 rounded-2xl w-full h-auto object-cover shadow-lg filter sepia-[.1]"
                    src={coverImg}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24 px-6 md:px-16 bg-[#f6f3f2] relative" id="timeline">
          <div className="max-w-[1280px] mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] gold-shimmer-text">
                The Day's Flow
              </h2>
              <p className="text-base text-[#484837] font-serif">
                A gentle schedule of events as the magic unfolds.
              </p>
            </div>

            <div className="max-w-3xl mx-auto relative">
              {/* Timeline Central Stem Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#5f5f00]/20 transform md:-translate-x-1/2" />

              <div className="space-y-12">
                {timelineSteps.map((step, idx) => {
                  const isEven = idx % 2 === 1;
                  return (
                    <div
                      key={idx}
                      className="relative flex flex-col md:flex-row items-center group"
                    >
                      {/* Node Pin Circle */}
                      <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-[#e9e86b] rounded-full transform -translate-x-1/2 border-4 border-white glow-ring z-10" />

                      {/* Left Block on Desktop */}
                      <div
                        className={`hidden md:flex w-1/2 ${
                          isEven ? "justify-start pl-12" : "justify-end pr-12 text-right"
                        }`}
                      >
                        {!isEven ? (
                          <div>
                            <div className="text-xl font-bold font-serif text-[#904d00] mb-1">
                              {step.time}
                            </div>
                            <h3 className="text-xl font-bold font-serif text-[#5f5f00] mb-1">
                              {step.title}
                            </h3>
                            <p className="text-sm font-serif text-[#484837] leading-relaxed">
                              {"desc" in step
                                ? (step as any).desc
                                : "Enjoy drinks, food, and music."}
                            </p>
                          </div>
                        ) : (
                          <div className="text-xl font-bold font-serif text-[#904d00]">
                            {step.time}
                          </div>
                        )}
                      </div>

                      {/* Right Block on Desktop */}
                      <div
                        className={`ml-16 md:ml-0 md:w-1/2 ${
                          isEven ? "md:pl-12" : "md:hidden"
                        }`}
                      >
                        <div className="md:hidden text-lg font-bold font-serif text-[#904d00] mb-1">
                          {step.time}
                        </div>
                        <h3 className="text-xl font-bold font-serif text-[#5f5f00] mb-1">
                          {step.title}
                        </h3>
                        <p className="text-sm font-serif text-[#484837] leading-relaxed">
                          {"desc" in step
                            ? (step as any).desc
                            : "Enjoy drinks, food, and music."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Highlight Banner */}
        <section className="py-20 bg-[#ffdcc2]/30 border-y border-[#ffb77c]/20 px-6 md:px-16 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-3xl md:text-5xl font-serif text-[#5f5f00] italic leading-tight">
              "Here's to the nights that turn into mornings, and the friends who turn into family."
            </p>
          </div>
        </section>



        {/* Venue Section */}
        <section className="py-24 px-6 md:px-16 bg-[#fcf9f8] relative" id="venue">
          <div className="max-w-[1280px] mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-[#904d00] uppercase tracking-[0.3em] block">
                Event Locations &amp; Maps
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-serif text-[#5f5f00] gold-shimmer-text">
                The Setting
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(props.locations && props.locations.length > 0
                ? props.locations
                : [
                    {
                      name: props.venuePlace || "The Ceremony",
                      venueLabel: "The Ceremony",
                      address: props.contactAddress || "Villa Cetinale, Sovicille, Siena, Italy",
                      image: "/images/templates/venue-ceremony.jpg",
                      mapLink: "https://maps.google.com",
                    },
                    {
                      name: "The Reception",
                      venueLabel: "The Reception",
                      address: "Borgo Santo Pietro, Chiusdino, Siena, Italy",
                      image: "/images/templates/venue-reception.jpg",
                      mapLink: "https://maps.google.com",
                    },
                  ]
              ).map((loc, idx) => (
                <div
                  key={idx}
                  className="space-y-6 bg-white p-8 rounded-3xl border-2 border-[#5f5f00]/20 shadow-lg flex flex-col justify-between"
                >
                  <div className="h-56 rounded-2xl overflow-hidden shadow-sm">
                    <img
                      src={
                        loc.image ||
                        (idx === 0
                          ? "/images/templates/venue-ceremony.jpg"
                          : "/images/templates/venue-reception.jpg")
                      }
                      alt={loc.name || "Venue"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#5f5f00]">
                      {loc.venueLabel || (idx === 0 ? "The Ceremony" : "The Reception")}
                    </span>
                    <h3 className="text-2xl font-bold font-serif text-[#904d00]">
                      {loc.name || (idx === 0 ? "The Ceremony" : "The Reception")}
                    </h3>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#5f5f00] mt-0.5 shrink-0" />
                      <p className="text-sm font-serif text-[#484837]">
                        {loc.address || "Siena, Italy"}
                      </p>
                    </div>
                  </div>

                  <div className="h-48 w-full rounded-2xl overflow-hidden border border-[#cac7b1] mt-2 bg-gray-100">
                    <iframe
                      title={`Venue Map ${idx + 1}`}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        `${loc.name || ""} ${loc.address || ""}`.trim() || "New York, NY"
                      )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                    />
                  </div>

                  <a
                    className="inline-flex items-center justify-center gap-2 bg-[#5f5f00] text-white px-6 py-3 rounded-full font-semibold text-xs uppercase tracking-wider hover:bg-[#797900] transition-colors shadow-md mt-2"
                    href={
                      loc.mapLink && loc.mapLink !== "https://maps.google.com"
                        ? loc.mapLink
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${loc.name || ""} ${loc.address || ""}`.trim() || "New York, NY"
                          )}`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Get Directions</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-24 px-6 md:px-16 bg-[#f6f3f2] relative" id="gallery">
          <div className="max-w-[1280px] mx-auto space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl md:text-5xl font-bold font-serif sparkle-container gold-shimmer-text">
                Chapters So Far
                <div className="sparkle"></div>
                <div className="sparkle"></div>
              </h2>
              <p className="text-base text-[#484837] font-serif">
                A collection of moments captured in time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8 max-w-6xl mx-auto">
              {galleryList.map((item: any, i: number) => {
                const url = typeof item === "string" ? item : item.url;
                const caption =
                  typeof item === "string" ? `Chapter #${i + 1}` : item.caption;
                const rotate =
                  typeof item === "string"
                    ? i === 0
                      ? "rotate-[-3deg]"
                      : i === 1
                      ? "rotate-[4deg] md:mt-12"
                      : "rotate-[-2deg] lg:mt-6"
                    : item.rotate || "";

                return (
                  <div
                    key={i}
                    className={`polaroid transform ${rotate} mx-auto w-full max-w-sm rounded-sm`}
                  >
                    <div className="aspect-[4/5] w-full mb-4 overflow-hidden rounded bg-[#e4e2e1]">
                      <img
                        alt={caption}
                        className="w-full h-full object-cover filter sepia-[.15] contrast-105"
                        src={url}
                      />
                    </div>
                    <p className="text-center font-serif text-xl text-[#5f5f00] italic font-semibold">
                      {caption}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RSVP Section */}
        <section id="rsvp" className="py-20 bg-[#fcf9f8]">
          <RsvpSection partnerOne={celebrantName} partnerTwo="" templateSlug="whimsical-storybook" />
        </section>

        {/* Footer */}
        <footer className="bg-[#f6f3f2] py-12 border-t border-[#cac7b1]/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="font-serif text-xl font-bold text-[#5f5f00] italic">
              {celebrationHeader}
            </div>
            <div className="text-xs text-[#5d5c58] font-serif">
              © {new Date().getFullYear()} Crafted with Love for {celebrantName}&apos;s Special Day
            </div>
            <div className="flex gap-6 text-xs text-[#484837] font-semibold">
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
