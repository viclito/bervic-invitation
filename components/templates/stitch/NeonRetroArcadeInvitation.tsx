"use client";

import { getWeddingTargetDate, formatAgeOrdinal } from "@/lib/dateUtils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Menu,
  X,
  Play,
  MapPin,
  Car,
  Gamepad2,
  Star,
  Trophy,
  ArrowRight,
} from "lucide-react";

export default function NeonRetroArcadeInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  // Celebrant name & headers
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const levelTag = "Level 30 Unlocked";
  const celebrationHeader = `${celebrantName}'s Celebration`;

  // Countdown state
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
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-fpRAgC2xAkCuFW6QjmJZAusF9s08OHXIadGM9ZKIsHyKRrba8X54suSDrFYG65BG0NfXaVD2K4qIJJx8fSwcqZg5zk8eqvJE4EZQQS8yF0QR7s80PXW9zYu-SaUgMbK-aKp8gl9bNgAVY-Iia8Jfv624hMprGpi-KAyYFyxqvW5rc6GHn2_ZQQKyuYNQGBYxz8cUX4Mr487FFkU1DRkmI4YNqXWn7N87VuEG76F8WPcEuYwIS12C",
            caption: "High Score 2018",
            rotate: "-rotate-3",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTAFyyxQN8X3cMLpemAw1nSVpOejmx4HaLLneDTMpCjcg-7zfIYHnvJN2cBcAJvt5GufEOWQm0yOtkX2VlJ1UuZZKtBz3OOPXlGJrYsAOxwcItu3OW2UaAu3t8-MB-ewIVhSGdvzTGeZBZBKnTPPEp2AzvG0vKVz2xB7qx_huM_h8NYmSL65a6VDnUDB4ammMipc2wXWf6sh-4vilPKEDgQSLaY4xrb_n5fmFGSRCcuPCGtjfsfQtJ",
            caption: "Level 25 Party",
            rotate: "rotate-2 md:mt-12",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9Vw7135bj4X2DXkPuAaJ6IxR4Ar9hrkvZZVOBeSpDGOfyiN9ocO44fLA3mV6xTFxC27UJYi4UTE9WmaXvaEtjc449ZKizBy-5f9298oZUO40sG7Ie9V-_IGfh8Bvf93atSdaETc153_V_8vocAjKrDHnFoNI9lYr10LEN8iM3Hr5BLV9I09p-psau1ac2A3G6_tu38fIePFbBY_vEceQnXgHvahOMouQJD4UTZChB5kU6GANqIZ1j",
            caption: "Player Two & Co.",
            rotate: "-rotate-2",
          },
        ];

  // Timeline steps fallback
  const timelineSteps =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay
      : [
          {
            order: 1,
            time: "6:00 PM - Sunset",
            title: "Welcome Cocktails",
            desc: "Signature drinks and light bites to kick off the evening while taking in the coastal views.",
          },
          {
            order: 2,
            time: "7:30 PM - 9:00 PM",
            title: "Artisanal Dinner",
            desc: "A curated menu of Mediterranean-inspired dishes served under the stars.",
          },
          {
            order: 3,
            time: "9:00 PM - Late",
            title: "Arcade Open & Dancing",
            desc: "The vintage cabinets light up. Hit the dance floor or set a new high score on Pac-Man.",
          },
        ];

  // Venue location fallback
  const mainVenue =
    props.locations && props.locations[0]
      ? props.locations[0]
      : {
          name: "The Secret Level",
          venueLabel: "Villa Seraphina",
          address: "123 Coastal Drive, Riviera",
          mapLink: "https://maps.google.com",
          image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDySUwQFGtF9sIxvghIl4uLA1fSHa-A6b-UMJMDaoxvkFKwvE-WyZS3_sXbPsawxBiAn45feKiltL8dap51TQPPPWswiKpUSFFcSzF_oLpwLUmZLgM1SWyAMIWJ0QQ44xx7-Ggz-gfTd__ORbc18cP3rtVJdS3jLzDvxNqVr7I0amQAHuohADqiAjLR0bJAwCzDCMt3jrkIwVTzybcPYdwTFhkFcugasYwUjDkqSAEdFKCuuds-4MfG",
        };

  return (
    <div className="bg-[#fcf9f8] text-[#1b1c1c] font-sans antialiased overflow-x-hidden relative selection:bg-[#5f5f00]/20 selection:text-[#5f5f00]">
      {/* Material Symbols Stylesheet for pixel-perfect Stitch icons */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Embedded CSS for Exact Neon, Scanlines, and Geometric Dot Grid from Stitch */}
      <style>{`
        .neon-glow-primary {
          box-shadow: 0 0 10px #5f5f00, 0 0 20px #5f5f00, inset 0 0 5px #cccc52;
          border: 1px solid #e9e86b;
        }
        .neon-glow-secondary {
          box-shadow: 0 0 10px #904d00, 0 0 20px #ffa049, inset 0 0 5px #ffb77c;
          border: 1px solid #ffdcc2;
        }
        .neon-text-primary {
          text-shadow: 0 0 5px #797900, 0 0 15px #5f5f00;
        }
        .neon-text-secondary {
          text-shadow: 0 0 5px #ffa049, 0 0 15px #904d00;
        }
        .scanlines::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(255, 255, 255, 0.05) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          z-index: 10;
          background-size: 100% 4px, 6px 100%;
          pointer-events: none;
          opacity: 0.3;
        }
        .countdown-digit {
          background: rgba(255, 255, 255, 0.8);
          border-radius: 0.5rem;
          position: relative;
          overflow: hidden;
          border: 2px solid #5f5f00;
          box-shadow: 0 0 15px rgba(95, 95, 0, 0.2);
        }
        .polaroid-frame {
          background: white;
          padding: 12px 12px 48px 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        .polaroid-frame:hover {
          transform: scale(1.05) rotate(0deg) !important;
          z-index: 30;
        }
        .geometric-bg {
          background-color: #f0eded;
          background-image: radial-gradient(#cccc52 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .timeline-level-node {
          box-shadow: 0 0 10px #797900;
        }
      `}</style>

      {/* Guest Personalized Envelope Cover */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday at 6:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="neon-retro-arcade"
      />

      {/* Top Navigation Bar */}
      <nav className="bg-[#fcf9f8]/80 backdrop-blur-md fixed top-0 w-full z-50 transition-all duration-300 ease-in-out border-b border-[#cac7b1]/30">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center h-20">
          <a
            className="font-serif text-2xl text-[#5f5f00] italic tracking-tight font-semibold"
            href="#"
          >
            {celebrationHeader}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a
              className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300 font-semibold text-sm"
              href="#about"
            >
              About
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300 font-semibold text-sm"
              href="#timeline"
            >
              Timeline
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300 font-semibold text-sm"
              href="#venue"
            >
              Venue
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300 font-semibold text-sm"
              href="#gallery"
            >
              Gallery
            </a>
            <a
              className="bg-[#5f5f00] text-white font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-[#797900] transition-colors duration-300 shadow-sm"
              href="#rsvp"
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
          <div className="md:hidden bg-[#fcf9f8] border-b border-[#cac7b1]/30 px-6 py-4 flex flex-col gap-4 text-center">
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
              className="bg-[#5f5f00] text-white py-3 rounded-lg font-semibold text-xs uppercase tracking-wider"
            >
              RSVP Now
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden flex items-center min-h-[819px]">
        <div className="absolute inset-0 bg-[#f6f3f2] z-0"></div>
        <div className="absolute inset-0 scanlines z-10 pointer-events-none"></div>

        <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-20 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-7 lg:col-span-6 space-y-8"
            >
              <div className="inline-block px-4 py-1 rounded-full bg-[#ffdcc2]/40 text-[#904d00] border border-[#904d00]/30 font-semibold text-xs tracking-wider uppercase">
                Leveling Up
              </div>

              <h1 className="text-4xl md:text-6xl font-bold font-serif text-[#1b1c1c] leading-tight">
                Ready Player{" "}
                <span className="text-[#5f5f00] neon-text-primary italic">
                  {celebrantName}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[#484837] font-serif max-w-lg leading-relaxed">
                {props.inviteLine && !props.inviteLine.includes("wedding")
                  ? props.inviteLine
                  : "Join us for an evening of nostalgic games, artisanal bites, and Mediterranean breezes as we celebrate another beautiful year around the sun."}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  className="bg-[#5f5f00] text-white font-semibold text-sm px-8 py-3 rounded-lg hover:bg-[#797900] transition-colors duration-300 flex items-center gap-2 neon-glow-primary shadow-lg"
                  href="#rsvp"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    sports_esports
                  </span>
                  <span>Insert Coin to RSVP</span>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:col-span-5 lg:col-span-6 mt-12 md:mt-0 relative"
            >
              <div className="aspect-square md:aspect-[4/5] rounded-xl overflow-hidden relative group shadow-xl">
                <div className="absolute inset-0 bg-[#5f5f00]/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                <img
                  alt={celebrantName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={
                    props.coupleImage ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuA2C3lRIhy9NnwmJD8yvqRPXssU0l6qJ7-vFS7JzYhvXas3PFq0YPnQ4b5u1XLE5qYF_qOKLXAjDZnuSQDhvNZDeB4W4iGT0JrOGHW4-72DYECSCMj5RtlnztYeDWB7zgFvMfPtwWkFCtvYK76ge05Eifc2_dq5ayUr2SXUhm4NzK3MBfUrPb-PcqfygqVry7tu0RBuni8HrGtfLaqOmfeEHaJI4HF__psK54aj3U9aKUm7NB_PLOu1"
                  }
                />
              </div>

              {/* Floating High Score Badge */}
              <div className="absolute -bottom-6 -left-6 md:-left-12 bg-[#fcf9f8] p-4 rounded-xl shadow-lg border border-[#cac7b1]/30 flex items-center gap-4 z-20 animate-[bounce_3s_infinite]">
                <div className="w-12 h-12 rounded-full bg-[#ffa049]/20 flex items-center justify-center text-[#904d00]">
                  <span className="material-symbols-outlined text-2xl">star</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1b1c1c]">
                    High Score
                  </p>
                  <p className="text-xs text-[#484837] font-serif">
                    {levelTag}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Wave Divider */}
      <div className="w-full overflow-hidden leading-none bg-[#f0eded] rotate-180">
        <svg
          className="relative block w-full h-12 md:h-20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            className="fill-[#fcf9f8]"
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          />
        </svg>
      </div>

      {/* Countdown Section (Neon Digit Boxes) */}
      <section className="py-16 bg-[#f0eded] relative overflow-hidden" id="countdown">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-20 text-center">
          <div className="mb-8 space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#1b1c1c]">
              Time Until Start
            </h2>
            <p className="text-base text-[#484837] font-serif">
              The arcade opens soon
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-4xl mx-auto">
            {/* Days */}
            <div className="flex flex-col items-center">
              <div className="countdown-digit w-20 h-24 md:w-28 md:h-32 flex items-center justify-center mb-3">
                <span className="text-4xl md:text-5xl font-bold font-serif text-[#5f5f00] neon-text-primary">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#484837]">
                Days
              </span>
            </div>

            {/* Separator */}
            <div className="hidden md:flex flex-col justify-center items-center h-32">
              <span className="text-4xl font-bold text-[#484837] opacity-50 pb-8">
                :
              </span>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="countdown-digit w-20 h-24 md:w-28 md:h-32 flex items-center justify-center mb-3">
                <span className="text-4xl md:text-5xl font-bold font-serif text-[#5f5f00] neon-text-primary">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#484837]">
                Hours
              </span>
            </div>

            {/* Separator */}
            <div className="hidden md:flex flex-col justify-center items-center h-32">
              <span className="text-4xl font-bold text-[#484837] opacity-50 pb-8">
                :
              </span>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="countdown-digit w-20 h-24 md:w-28 md:h-32 flex items-center justify-center mb-3">
                <span className="text-4xl md:text-5xl font-bold font-serif text-[#5f5f00] neon-text-primary">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#484837]">
                Mins
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Wave Divider */}
      <div className="w-full overflow-hidden leading-none bg-[#fcf9f8]">
        <svg
          className="relative block w-full h-12 md:h-20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            className="fill-[#f0eded]"
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          />
        </svg>
      </div>

      {/* Story Section */}
      <section className="py-24 bg-[#fcf9f8] relative" id="about">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              {/* Video Player Placeholder */}
              <div className="aspect-video bg-[#eae7e7] rounded-xl overflow-hidden relative flex items-center justify-center border border-[#cac7b1]/30 group shadow-lg">
                <img
                  alt="Story Video Thumbnail"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
                  src={
                    props.heroImage ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuBGndOSD6QjX_gVs-DsiVrnxi03b_tFUZPy9I_PEionCtONXA6-jOSDa1z-vwRbNVEzS-Z9EsfJnNXfykDqtm6tA1JAO83SezOk15QNK1Zm6uVtOULCqLeyplrRXbm0AJTriUEZ70Rim-ux5HW46at5-fKicQ_PHc0PT_k50BKFPPHNLJE7NH87Ij0od8rGda7vBFdm5yitprKVuqgczU626T6WTMmJkSwlAvmYrfexgB9QR5WNiaGF"
                  }
                />
                <button className="relative z-10 w-20 h-20 rounded-full bg-[#5f5f00]/90 text-white flex items-center justify-center hover:bg-[#5f5f00] transition-colors neon-glow-primary group-hover:scale-110 duration-300">
                  <span className="material-symbols-outlined text-4xl ml-1">
                    play_arrow
                  </span>
                </button>
                <div className="absolute inset-0 border-2 border-[#5f5f00]/20 rounded-xl m-4 pointer-events-none"></div>
              </div>

              {/* Decorative blurred circles */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#ffdcc2]/30 rounded-full blur-2xl z-0 pointer-events-none"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#cccc52]/30 rounded-full blur-2xl z-0 pointer-events-none"></div>
            </div>

            <div className="order-1 lg:order-2 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#eae7e7] text-[#484837] font-semibold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-[#904d00]">
                  auto_stories
                </span>
                <span>Player Origin Story</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold font-serif text-[#1b1c1c]">
                Press Start to Continue
              </h2>

              <p className="text-base md:text-lg text-[#484837] font-serif leading-relaxed">
                From early days mastering 8-bit classics to building a life full of rich experiences and vibrant friendships, it's been an incredible journey.
              </p>

              <p className="text-sm md:text-base text-[#484837] font-serif leading-relaxed">
                {props.loveStoryText ||
                  `This milestone celebration brings together everything ${celebrantName} loves: the nostalgia of retro gaming, the elegance of coastal living, and most importantly, the people who have been part of every level along the way. Get ready for a night of elevated fun and unforgettable memories.`}
              </p>

              <div className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-1 bg-[#5f5f00]"></div>
                  <span className="text-xs font-bold text-[#5f5f00] tracking-widest uppercase font-mono">
                    {levelTag}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-[#f6f3f2] relative" id="timeline">
        <div className="absolute inset-0 scanlines z-0 opacity-20 pointer-events-none"></div>
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-[#1b1c1c]">
              Event Levels
            </h2>
            <p className="text-base md:text-lg text-[#484837] font-serif">
              Your guide to the evening's gameplay. Don't miss a beat.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto space-y-12">
            {/* Center Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#cac7b1]/30 hidden md:block"></div>

            {/* Level 1 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              <div className="md:w-5/12 mb-6 md:mb-0 text-center md:text-right pr-0 md:pr-8">
                <h3 className="text-xl font-bold font-serif text-[#1b1c1c] mb-2">
                  Welcome Cocktails
                </h3>
                <p className="text-sm md:text-base text-[#484837] font-serif leading-relaxed">
                  Signature drinks and light bites to kick off the evening while taking in the coastal views.
                </p>
              </div>

              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#fcf9f8] border-4 border-[#5f5f00] flex items-center justify-center z-10 timeline-level-node group-hover:scale-125 transition-transform duration-300">
                <div className="w-2 h-2 rounded-full bg-[#5f5f00]"></div>
              </div>

              <div className="md:w-5/12 text-center md:text-left pl-0 md:pl-8">
                <div className="inline-block px-4 py-2 bg-[#5f5f00]/10 text-[#5f5f00] font-semibold text-sm rounded-lg neon-glow-primary">
                  6:00 PM - Sunset
                </div>
              </div>
            </div>

            {/* Level 2 (Reverse) */}
            <div className="relative flex flex-col md:flex-row-reverse items-center justify-between group">
              <div className="md:w-5/12 mb-6 md:mb-0 text-center md:text-left pl-0 md:pl-8">
                <h3 className="text-xl font-bold font-serif text-[#1b1c1c] mb-2">
                  Artisanal Dinner
                </h3>
                <p className="text-sm md:text-base text-[#484837] font-serif leading-relaxed">
                  A curated menu of Mediterranean-inspired dishes served under the stars.
                </p>
              </div>

              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#fcf9f8] border-4 border-[#904d00] flex items-center justify-center z-10 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_rgba(144,77,0,0.5)]">
                <div className="w-2 h-2 rounded-full bg-[#904d00]"></div>
              </div>

              <div className="md:w-5/12 text-center md:text-right pr-0 md:pr-8">
                <div className="inline-block px-4 py-2 bg-[#904d00]/10 text-[#904d00] font-semibold text-sm rounded-lg neon-glow-secondary">
                  7:30 PM - 9:00 PM
                </div>
              </div>
            </div>

            {/* Level 3 */}
            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              <div className="md:w-5/12 mb-6 md:mb-0 text-center md:text-right pr-0 md:pr-8">
                <h3 className="text-xl font-bold font-serif text-[#1b1c1c] mb-2">
                  Arcade Open &amp; Dancing
                </h3>
                <p className="text-sm md:text-base text-[#484837] font-serif leading-relaxed">
                  The vintage cabinets light up. Hit the dance floor or set a new high score on Pac-Man.
                </p>
              </div>

              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-[#fcf9f8] border-4 border-[#5f5f00] flex items-center justify-center z-10 timeline-level-node group-hover:scale-125 transition-transform duration-300">
                <div className="w-2 h-2 rounded-full bg-[#5f5f00]"></div>
              </div>

              <div className="md:w-5/12 text-center md:text-left pl-0 md:pl-8">
                <div className="inline-block px-4 py-2 bg-[#5f5f00]/10 text-[#5f5f00] font-semibold text-sm rounded-lg neon-glow-primary">
                  9:00 PM - Late
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bold Geometric Highlight Banner */}
      <section className="py-32 relative overflow-hidden geometric-bg border-y border-[#5f5f00]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#fcf9f8]/90 via-[#fcf9f8]/70 to-[#fcf9f8]/90 z-0"></div>
        <div className="max-w-4xl mx-auto px-6 md:px-16 text-center relative z-10">
          <span className="material-symbols-outlined text-6xl text-[#5f5f00] mb-6 animate-pulse block">
            star_rate
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-[#1b1c1c] mb-8 italic leading-tight">
            "Life is more fun when you play together."
          </h2>
          <a
            className="inline-block bg-[#5f5f00] text-white font-semibold text-sm px-10 py-4 rounded-lg hover:bg-[#797900] transition-colors duration-300 neon-glow-primary text-lg shadow-lg"
            href="#rsvp"
          >
            Join The Multiplayer Experience
          </a>
        </div>
      </section>

      {/* Venue Section Bento Grid */}
      <section className="py-24 md:py-32 bg-[#fcf9f8]" id="venue">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-bold font-serif text-[#1b1c1c] mb-6">
                The Secret Level
              </h2>
              <p className="text-lg text-[#484837] font-serif leading-relaxed">
                Join us at an exclusive coastal villa transformed into a sophisticated retro haven. Enjoy panoramic views while setting high scores.
              </p>
            </div>
            <a
              className="inline-flex items-center gap-2 font-semibold text-sm text-[#904d00] hover:text-[#6e3a00] transition-colors pb-1 border-b border-[#904d00]"
              href={mainVenue.mapLink}
              target="_blank"
              rel="noreferrer"
            >
              <span>Get Directions</span>
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px]">
            {/* Main Feature Image */}
            <div className="md:col-span-8 row-span-2 rounded-xl overflow-hidden relative group shadow-md border border-[#cac7b1]/30">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
              <img
                alt="Venue Exterior"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={mainVenue.image}
              />
              <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                <div className="bg-[#fcf9f8]/90 backdrop-blur-md p-6 rounded-lg inline-block border border-[#cac7b1]/30 shadow-md">
                  <h3 className="text-2xl font-bold font-serif text-[#1b1c1c] mb-2">
                    {mainVenue.venueLabel}
                  </h3>
                  <p className="text-sm text-[#484837] font-serif flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#5f5f00] text-[18px]">
                      location_on
                    </span>
                    <span>{mainVenue.address}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Map Tile */}
            <div className="md:col-span-4 row-span-1 rounded-xl overflow-hidden relative border border-[#cac7b1]/20 group shadow-sm">
              <img
                alt="Map Location"
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-Ntkfo22ExMuItzuHyaXsO2KiM6v6fUcbfCZrH0MxLDVnahdfU44B9gQNnyKU9aI1woPl4qDrTo5-Tf41Nm74Bs7uJ2MvRE8_uVn0sCxCUO1CHI7r4NPleQjtCwJJAdvh5GtBnRuKtZCKJ-a3lZB74M3Um98BxIVaQoTIcZgCzBGOTKeA3QjlsIAQ-wkgSSaELIda6aVPfwhkOjqpcc2S-Q9uk7cdiu0mCw6cZ5b6m-V8FOqesTpW"
              />
            </div>

            {/* Info Tile */}
            <div className="md:col-span-4 row-span-1 rounded-xl bg-[#f6f3f2] p-8 flex flex-col justify-center border border-[#cac7b1]/20 hover:border-[#5f5f00]/50 transition-colors group shadow-sm">
              <span className="material-symbols-outlined text-[#904d00] text-4xl mb-4 group-hover:neon-text-secondary transition-all">
                local_parking
              </span>
              <h4 className="text-sm font-bold text-[#1b1c1c] mb-2 uppercase tracking-wider">
                Valet Parking
              </h4>
              <p className="text-sm text-[#484837] font-serif leading-relaxed">
                Complimentary valet service available at the main entrance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Polaroid Gallery Section */}
      <section className="py-24 bg-[#f6f3f2] overflow-hidden" id="gallery">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-4xl md:text-6xl font-bold font-serif text-[#1b1c1c]">
              Highlights Reel
            </h2>
            <p className="text-lg text-[#484837] font-serif">
              A few favorite moments from previous levels.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12 pb-12">
            {galleryList.map((item: any, i: number) => {
              const url = typeof item === "string" ? item : item.url;
              const caption =
                typeof item === "string" ? `High Score #${i + 1}` : item.caption;
              const rotate =
                typeof item === "string"
                  ? i % 2 === 0
                    ? "-rotate-3"
                    : "rotate-2 md:mt-12"
                  : item.rotate || "";

              return (
                <div
                  key={i}
                  className={`polaroid-frame transform ${rotate} w-64 md:w-72`}
                >
                  <div className="aspect-square bg-[#dcd9d9] overflow-hidden mb-4 rounded-sm">
                    <img
                      alt={caption}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      src={url}
                    />
                  </div>
                  <p className="text-sm text-center text-[#484837] font-serif italic">
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
        <RsvpSection partnerOne={celebrantName} partnerTwo="" />
      </section>

      {/* Footer Component */}
      <footer className="bg-[#f6f3f2] w-full py-12 border-t border-[#cac7b1]/30 relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="font-serif text-xl font-bold text-[#5f5f00]">
            {celebrationHeader}
          </div>
          <div className="flex gap-6 text-xs text-[#484837]">
            <a href="#" className="hover:text-[#904d00] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#904d00] transition-colors">
              Contact
            </a>
          </div>
          <div className="text-xs text-[#5d5c58] font-serif">
            © {new Date().getFullYear()} Crafted with Love for {celebrantName}'s Special Day
          </div>
        </div>
      </footer>
    </div>
  );
}
