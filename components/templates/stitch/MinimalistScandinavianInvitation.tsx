"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Menu,
  X,
  ArrowRight,
  Wine,
  Utensils,
  PartyPopper,
  Music,
  MapPin,
  Compass,
} from "lucide-react";

export default function MinimalistScandinavianInvitation(
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
  const celebrationTitle = `${celebrantName}'s 30th`;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 45,
    hours: 12,
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
    const targetDate = new Date(
      props.weddingDate || "2026-10-15T18:00:00"
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

  // Gallery items fallback
  const galleryList =
    props.galleryImages && props.galleryImages.length >= 3
      ? props.galleryImages
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5dor9g1L4_g6-mK25HF-OR9AsC9zlXcWw6CLhk7baeC-sojU5X7u5f9dwCMp8cek0w-g2wkEt3C7O7P-8wws1gbAVN5YdPjqbXhZmNeIShbD71XrQwIkBMgq29ssfDmFzajpgyGmEnrbBNYPaWUp6BLvBNnGcPu1K51w4Dc4oqvNiFegfGY2_9m7oC9q_Q-l78e01I7GHSFfOlGcEpCqPxVoPi-mY-uclyuAcLueSObQyzyAAwWVn",
            caption: "Paris, 2018",
            rotate: "rotate-[-3deg]",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCp0LtLgcfcCsfXMLHgbQw8Pjm4P72OKKh4kd5rlIYOABatau9FG9D5zk29GSstnjzzCaoQlrB4ZODei-01OLdygTBG2Y3FonenWSOpyv1DzSM657QQyRfqG40Se4dxVfdSPj1bEirr8NxNIEyD7FZUZsGYTbNzZpdwWyoCE9e9k6i98ySLwLBy0Qr6L5La4SDZxLTIE1KGOPCEZle4OJQrUpIjULXZBtgw1r0snm5VDJIeLyRaePDK",
            caption: "Graduation Day",
            rotate: "rotate-[2deg] md:mt-8",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiRcoJYlTR4kGNxNLna9K3w3J1X5Q2pnMHVcSxI_Mqv0uiy7HIHG5r7Ee3KvFzXHvmLynEcwduXhXc4WNVc-T-PO2TNkw9nngHAYpxgrpRGRCI3KbK_ETtXchpyZElPz4iTSYVzq8BLJWAS5HBg7POth0dP8mE32Q03W0FiMCiEz0hO_p1UNGhMr8cu9qwyV4kJ9-5hviwNj67Gr6hv7Ukkn_O0DCuMIO4sn3aeFLtdaaCCGBuf_vj",
            caption: "Summer 2023",
            rotate: "rotate-[-1deg] md:mt-4",
          },
        ];

  // Evening's Flow Timeline fallback
  const timelineSteps =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay
      : [
          {
            time: "6:00 PM",
            title: "Arrival & Cocktails",
            desc: "Welcome drinks and light hors d'oeuvres as guests arrive.",
            icon: Wine,
          },
          {
            time: "7:30 PM",
            title: "Curated Dinner",
            desc: "A three-course meal featuring locally sourced ingredients.",
            icon: Utensils,
          },
          {
            time: "9:00 PM",
            title: "Toasts & Cake",
            desc: "Speeches, cutting of the cake, and a special toast to Evelyn.",
            icon: PartyPopper,
          },
          {
            time: "10:00 PM",
            title: "Music & Dancing",
            desc: "The dance floor opens. Let's celebrate into the night!",
            icon: Music,
          },
        ];

  // Venue location fallback
  const mainVenue =
    props.locations && props.locations[0]
      ? props.locations[0]
      : {
          name: "The Glasshouse Estate",
          address: "123 Meadow Lane, Countryside Valley, CV1 2AB",
          mapLink: "https://maps.google.com",
        };

  return (
    <div className="bg-[#F5F2ED] text-[#1b1c1c] font-sans antialiased overflow-x-hidden relative selection:bg-[#e9e86b] selection:text-[#1d1d00]">
      {/* Material Symbols Stylesheet */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Scandinavian Minimalist Stylesheet & Keyframes */}
      <style>{`
        .layer-0 { background-color: #F5F2ED; } /* Bone White Base */
        .layer-1 { background-color: #ffffff; box-shadow: 0 4px 20px rgba(95, 95, 0, 0.05); } /* Floating */
        .layer-2 { background-color: #ffffff; border: 1px solid #DED9D1; } /* Outlines */

        @keyframes zoomFade {
          0% { transform: scale(1); opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { transform: scale(1.05); opacity: 0.3; }
        }

        @keyframes goldShimmer {
          0% { text-shadow: 0 0 5px rgba(204, 204, 82, 0); }
          50% { text-shadow: 0 0 15px rgba(204, 204, 82, 0.4); }
          100% { text-shadow: 0 0 5px rgba(204, 204, 82, 0); }
        }

        @keyframes sparkleTwinkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        .animate-zoom-fade {
          animation: zoomFade 10s ease-out forwards infinite alternate;
        }

        .animate-gold-shimmer {
          animation: goldShimmer 3s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkleTwinkle 2s ease-in-out infinite;
        }

        .polaroid {
          background: white;
          padding: 1rem 1rem 3rem 1rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          transition: transform 0.3s ease;
        }
        .polaroid:hover {
          transform: scale(1.05) rotate(0deg) !important;
          z-index: 20;
        }

        .wave-divider {
          width: 100%;
          height: auto;
          line-height: 0;
        }
      `}</style>

      {/* Guest Personalized Envelope Cover */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday at 6:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="minimalist-scandinavian"
      />

      {/* Top Glassmorphism Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          navScrolled
            ? "bg-[#ffffff]/90 backdrop-blur-md shadow-sm border-b border-[#DED9D1]"
            : "bg-[#F5F2ED]/80 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center h-20">
          <a
            className="font-serif text-2xl text-[#5f5f00] italic font-semibold"
            href="#"
          >
            {celebrationHeader}
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
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
            className="hidden md:inline-flex bg-[#5f5f00] text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded hover:bg-[#797900] transition-colors items-center gap-2 shadow-sm"
            href="#rsvp"
          >
            <span>RSVP Now</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-[#5f5f00] p-2"
          >
            {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileNavOpen && (
          <div className="md:hidden bg-white border-b border-[#DED9D1] px-6 py-4 flex flex-col gap-4 text-center shadow-lg">
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
              className="bg-[#5f5f00] text-white py-3 rounded font-semibold text-xs uppercase tracking-wider"
            >
              RSVP Now
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[850px] md:min-h-[921px] flex items-center justify-center pt-20 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="bg-cover bg-center w-full h-full opacity-30 animate-zoom-fade"
            style={{
              backgroundImage: `url('${
                props.heroImage ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBie-JLofKmJ4k3YcsHl5WkK-mHrvLcX7PXi0vV50AZm24iJeVmVSmqsvUysmpQO0js7RsNPVQoGgU8iJJ3Th8O9we9LO8SFebBvWH5BbEJYa9UiZQrh-RCzFx5FQELWZM83aXAUko19ASQM4HVK1P4l7Y60qK4gx60XaycbqDqMyYoTFtYAbPjAKEcGHdUj6yb26QZNh4C6oYEGAx1ecKwENkNdMVxg3-fxacscLGWXyiv9jY59Z2c"
              }')`,
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="font-semibold text-xs text-[#ff7f50] tracking-widest uppercase block">
              Save the Date
            </span>

            <h1 className="text-4xl md:text-6xl font-bold font-serif text-[#5f5f00] leading-tight animate-gold-shimmer">
              Join us in celebrating <br />
              <span className="italic font-light">{celebrationTitle}</span>
            </h1>

            <p className="text-base md:text-lg font-serif text-[#484837] max-w-lg leading-relaxed">
              {props.inviteLine && !props.inviteLine.includes("wedding")
                ? props.inviteLine
                : "An evening of curated dining, fine wine, and cherished company nestled in the heart of the countryside."}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                className="bg-[#5f5f00] text-white font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded hover:bg-[#797900] transition-colors shadow-sm"
                href="#rsvp"
              >
                RSVP
              </a>
              <a
                className="border border-[#904d00] text-[#904d00] font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded hover:bg-[#904d00] hover:text-white transition-colors"
                href="#venue"
              >
                View Details
              </a>
            </div>
          </motion.div>

          {/* Floating Date Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 mt-8 lg:mt-0"
          >
            <div className="bg-white p-8 rounded-2xl relative shadow-[0_4px_20px_rgba(95,95,0,0.05)] border border-[#DED9D1]/50">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#626200]/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="text-center space-y-2">
                <span className="block font-bold font-serif text-2xl md:text-3xl text-[#5f5f00]">
                  {props.weddingDate || "October 15, 2026"}
                </span>
                <span className="block font-semibold text-xs text-[#484837] uppercase tracking-wider">
                  {props.weddingTime || "6:00 PM Onwards"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Wave Divider 1 */}
      <svg
        className="wave-divider fill-[#f6f3f2]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,0 C320,100 420,0 720,50 C1020,100 1120,0 1440,50 L1440,100 L0,100 Z" />
      </svg>

      {/* Countdown Section */}
      <section className="py-20 bg-[#f6f3f2] relative overflow-hidden" id="countdown">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] animate-gold-shimmer">
            The Celebration Begins In
          </h2>

          <div className="flex justify-center gap-6 md:gap-12 flex-wrap">
            {/* Days */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#5f5f00]/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(95,95,0,0.1)] bg-white relative overflow-hidden">
                <span className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00]">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#484837]">
                Days
              </span>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#5f5f00]/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(95,95,0,0.1)] bg-white relative overflow-hidden">
                <span className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00]">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#484837]">
                Hours
              </span>
            </div>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#5f5f00]/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(95,95,0,0.1)] bg-white relative overflow-hidden">
                <span className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00]">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#484837]">
                Minutes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider 2 */}
      <svg
        className="wave-divider fill-[#F5F2ED]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,50 C320,0 420,100 720,50 C1020,0 1120,100 1440,50 L1440,100 L0,100 Z" />
      </svg>

      {/* Our Story Section */}
      <section className="py-24 bg-[#F5F2ED] relative" id="about">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-[#5f5f00] italic animate-gold-shimmer">
              A Milestone to Remember
            </h2>
            <div className="text-base md:text-lg font-serif text-[#484837] space-y-4 leading-relaxed">
              <p>
                Three decades of laughter, growth, and beautiful memories. As {celebrantName} steps into this new chapter, we want to surround her with the people who have made her journey so special.
              </p>
              <p>
                {props.loveStoryText ||
                  "Join us for an elegant evening where stories will be shared, glasses will be raised, and new memories will be forged under the stars."}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <img
              alt="Table setting"
              className="w-full h-[450px] md:h-[500px] object-cover rounded-2xl shadow-lg border border-[#DED9D1]"
              src={
                props.coupleImage ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCafRCd3dJ3Y0-llbgCcTENn3OJbiiW218G858RMg-WuSSkZZq6b8MhEuR8_5t9M_T2Tc0b2R6PnHps94RYp9Pyh1NtD2_mSTe6Ie2MaElR9Q8O5d_i7UefnxOMv-vvxhvabKeqNW4plNDa3I87Vpwy4vzIouxsE38ehoCwmu6StK6EH7OkDB2frGm1xCwpvLIp18C3gGX_vvgiDdct2toBRM47D755vzS0qhWvPTlDwNWF1zFIz285"
              }
            />
          </div>
        </div>
      </section>

      {/* Highlight Banner */}
      <section className="relative py-20 overflow-hidden bg-[#ff7f50]/10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10 text-center space-y-8">
          <div className="relative inline-block w-full max-w-4xl">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#ff7f50] rounded-3xl transform -rotate-2 opacity-20 pointer-events-none"></div>
            <img
              alt="Celebration toast"
              className="mx-auto rounded-2xl shadow-2xl w-full max-w-4xl h-[350px] md:h-[400px] object-cover"
              src={
                props.heroImage ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCFT5-OI1W0ZrbzmbcAu1yCvuO8IJfYw1ytJEMiCRAewHzo4iY1-moW-k9V4e3zQyJ3tpF8ImL_tW6JcZ3T1D_3tTMWz_WlCIWr10z4WkheX0dyNsaj8d8Eh4Fda1pJO89l9afO4iTHZm13P_Qg2-bBM6apE4dmkCwT1AwrMwvGJF3Ca5vdCbXc3zKvZop7Smj5xmW27L5my_JpRZYoEvNMWynZAJVKgCB2V5UGP2nbhRu5vdyele93"
              }
            />
          </div>
          <h3 className="text-2xl md:text-4xl font-bold font-serif text-[#5f5f00] italic">
            "Life should not only be lived, it should be celebrated."
          </h3>
        </div>
      </section>

      {/* Wave Divider 3 */}
      <svg
        className="wave-divider fill-[#ffffff]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,0 C320,100 420,0 720,50 C1020,100 1120,0 1440,50 L1440,100 L0,100 Z" />
      </svg>

      {/* Timeline Section (The Evening's Flow) */}
      <section className="py-24 bg-white" id="timeline">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-[#5f5f00] animate-gold-shimmer">
              The Evening's Flow
            </h2>
            <p className="text-base text-[#484837] font-serif">
              What to expect throughout the night
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[#5f5f00]/20">
            {timelineSteps.map((step, idx) => {
              const IconComponent = (step as any).icon || Wine;
              return (
                <div
                  key={idx}
                  className={`relative flex items-center justify-between md:justify-normal ${
                    idx % 2 === 1 ? "md:flex-row-reverse" : ""
                  } group`}
                >
                  {/* Timeline Badge */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#5f5f00] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow absolute left-0 md:left-1/2 -translate-x-1/2 z-10">
                    {typeof IconComponent === "string" ? (
                      <span className="text-xl">{IconComponent}</span>
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>

                  {/* Content Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-xl bg-white shadow-[0_4px_20px_rgba(95,95,0,0.05)] border border-[#DED9D1]/60 ml-auto md:ml-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold font-serif text-[#5f5f00]">
                        {step.title}
                      </h4>
                      <span className="text-xs font-semibold text-[#904d00] px-3 py-1 bg-[#ffa049]/20 rounded-full">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-sm font-serif text-[#484837] leading-relaxed">
                      {"desc" in step
                        ? (step as any).desc
                        : "Enjoy wine, food, and music."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Wave Divider 4 */}
      <svg
        className="wave-divider fill-[#F5F2ED]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,50 C320,0 420,100 720,50 C1020,0 1120,100 1440,50 L1440,100 L0,100 Z" />
      </svg>

      {/* Venue Section */}
      <section className="py-24 bg-[#F5F2ED]" id="venue">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(95,95,0,0.05)] border border-[#DED9D1] space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] animate-gold-shimmer">
                The Venue
              </h2>
              <h3 className="text-xl font-bold font-serif text-[#1b1c1c]">
                {mainVenue.name || "The Glasshouse Estate"}
              </h3>
              <p className="text-sm font-serif text-[#484837]">
                {mainVenue.address}
              </p>
              <p className="text-sm font-serif text-[#484837] leading-relaxed">
                A beautiful conservatory surrounded by lush gardens, offering a perfect blend of indoor elegance and outdoor natural beauty.
              </p>
              <a
                className="inline-flex items-center gap-2 border border-[#5f5f00] text-[#5f5f00] font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded hover:bg-[#5f5f00] hover:text-white transition-colors"
                href={mainVenue.mapLink}
                target="_blank"
                rel="noreferrer"
              >
                <Compass className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="aspect-video bg-[#e4e2e1] rounded-2xl overflow-hidden relative shadow-md border border-[#DED9D1]">
              <img
                alt="Map location"
                className="w-full h-full object-cover opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyD-77khF-v4syjvQxKQ7v-G3fEgOMwBqyxCx8uG8G8JI84AeMbFnUPTvPdELLGVgXgG0ojrnpYrgKddU9GYqTAcK9nAmR-hbQvf4wAWsuPKR7aUiQcmRP0sx2PSg8j4HtpeVrXAVc-Z6fDVHzhopdAFWYd4j9EX4TeNzSLEjpzMhMy-WEwK426M1Ag_CBJEgLSuaG06xtTf7xnA71hD60FaNjK2xGMkt6KzdGW_TNt0Ew9uNIG5v-"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg flex items-center gap-3 border border-[#DED9D1]">
                  <MapPin className="w-6 h-6 text-[#904d00]" />
                  <span className="font-bold font-serif text-[#5f5f00]">
                    {mainVenue.name || "The Glasshouse Estate"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider 5 */}
      <svg
        className="wave-divider fill-[#ffffff]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,0 C320,100 420,0 720,50 C1020,100 1120,0 1440,50 L1440,100 L0,100 Z" />
      </svg>

      {/* Gallery Section */}
      <section className="py-24 bg-white overflow-hidden" id="gallery">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 space-y-16">
          <div className="text-center relative inline-block left-1/2 -translate-x-1/2">
            <span className="absolute -top-4 -left-6 text-yellow-500 animate-sparkle">
              ✨
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-[#5f5f00] animate-gold-shimmer">
              Memories
            </h2>
            <span
              className="absolute -bottom-2 -right-6 text-yellow-500 animate-sparkle"
              style={{ animationDelay: "1s" }}
            >
              ✨
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {galleryList.map((item: any, i: number) => {
              const url = typeof item === "string" ? item : item.url;
              const caption =
                typeof item === "string" ? `Memory #${i + 1}` : item.caption;
              const rotate =
                typeof item === "string"
                  ? i % 2 === 0
                    ? "rotate-[-3deg]"
                    : "rotate-[2deg] md:mt-8"
                  : item.rotate || "";

              return (
                <div
                  key={i}
                  className={`polaroid ${rotate} w-64 rounded-sm border border-[#DED9D1]`}
                >
                  <img
                    alt={caption}
                    className="w-full h-56 object-cover mb-4 rounded-sm"
                    src={url}
                  />
                  <p className="text-center font-serif text-sm text-[#5d5c58]">
                    {caption}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 bg-[#F5F2ED]">
        <RsvpSection partnerOne={celebrantName} partnerTwo="" />
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-[#DED9D1]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="font-serif text-xl font-bold text-[#5f5f00] italic">
            {celebrationHeader}
          </div>
          <div className="text-xs text-[#5d5c58] font-serif">
            © {new Date().getFullYear()} Crafted with Love for {celebrantName}'s Special Day
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
    </div>
  );
}
