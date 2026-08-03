"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, ArrowRight, PlayCircle, Heart, Activity, MapPin, Map, Camera } from "lucide-react";

export default function IndustrialLoftChicInvitation(
  props: TemplateClassicFloralProps
) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Celebrant Name
  const celebrantName =
    props.partnerOne && props.partnerOne !== "Your Name"
      ? props.partnerOne
      : "Evelyn";

  const brandName = "LOFT ARCHITECTURAL";

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 24,
    hours: 12,
    minutes: 45,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(
      props.weddingDate || "2026-10-24T19:00:00"
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

  // Gallery items matching exact Stitch screen 7149b7865e6e4515b7981b6568922ff6
  const galleryList =
    props.galleryImages && props.galleryImages.length >= 4
      ? props.galleryImages
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDolpTaLm2ZqAVBYewqVQfLjKpSeV6iuzhFGSq_oXoJCSVlHgWTKnLDjb_bKfNf-Sxm5AuvIJvUYqVQij_KJWltszRpN234iT6ETIM0kdO4km0rr2XGDY-CwHfhIPiFooqcyJ3qnhckCc94R9Skd2fo36AnWyQsPe31oOAbYcODBw6_Q_VTscPgrDxaWrHkpo3e1h2pxrNvejp7NN6p9xnDee2NHkBXAmb_4cFwqHCxMDAi9uX4MKD0",
            caption: "ARCHIVE_01",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk7bC-znAaHgBbXTsZJAa580CtkGW5Np5sKddIm2U4B7Peec0JjyCRHEB5JO7Ej6yqSXMMkJ132QIGKjbRrODypvLZAUYAFWud5_Ss_gPTsnoxfInNwsfWz2tL-DGsRHRRnPHpT_TBFV-2wJg1YwPDEsZL7sVGhZVz0US41Eg363MtbNkHcJsVKGBL_hFLmAp-5QBzjRJwEngDlp0C0B40XGR3nRusgFQblBsEBvrlgGhrslD7MPmD",
            caption: "ARCHIVE_02",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDmAMlihfsL1TO2z4oXdLLZFQyviKjFqBvg3-J7VNBMeVMJDUrU4AjMF7TIH5nAm4Hkk01DszuMbugoSvhjd8Onpse7O79nYN4uSGJ9dvRZpfdPYv8WGXMVGJal7CuPzzvCCDl3eHjUnzW0REFL4If6dzSBlysEb4WCeG3hfYXG9xJuqULtuScyEPJJTmVG2b_CEpkG3VayDDHmn0RzJiaYeWAZfWHcCtm6IxdHjRFh_nElnJQ4zpP",
            caption: "ARCHIVE_03",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg7WFPpbvH5edZEVety6xwXsqQWDYuyfN3eVBZOPWXvrB4hAP4hdW1Dcj873YoW-1dIFNrEQed3cYulYI_b6L4DaGKb3PHMj3PzW6El9YOfD3xgKGiXYOa1J2OfHSRQAW7mIaxNP2ejBh1qbmx6eZHyaoGV8CK6pDUIahKweG_tKuo9c2gEjPcglULfWTM9-2QhUMoN6RtooCzAVswKEBr0VM7R6VtsrUn0wEgRVpXsFTvhOmReXit",
            caption: "ARCHIVE_04",
          },
        ];

  // Technical timeline phases
  const timelinePhases =
    props.events && props.events.length > 0
      ? props.events
      : [
          {
            phase: "PHASE 01 // 19:00",
            title: "Arrival & Cocktails",
            desc: "Initial structural assessment and lubrication. Signature copper-infused drinks served in the antechamber.",
          },
          {
            phase: "PHASE 02 // 20:30",
            title: "The Assembly",
            desc: "Main dinner seating in the central nave. Exposed brick backdrop for a heavy, tactile dining experience.",
          },
          {
            phase: "PHASE 03 // 22:00",
            title: "Acoustic Resonance",
            desc: "Music and movement. Testing the structural integrity of the dance floor.",
          },
        ];

  // Hero image fallback matching Industrial Loft Chic
  const isNonIndustrialHero =
    !props.heroImage ||
    props.heroImage.includes("unsplash.com") ||
    props.heroImage.includes("wedding") ||
    props.heroImage.includes("photo-1519741497674") ||
    props.heroImage.includes("photo-1511795409834") ||
    props.heroImage.includes("AB6AXuCbj6E_qQBW8N2") ||
    Boolean(props.partnerTwo && props.partnerTwo.trim() !== "");

  const displayHeroImage =
    props.heroImage && !isNonIndustrialHero
      ? props.heroImage
      : "https://lh3.googleusercontent.com/aida-public/AB6AXuBo1r1ueW0Kx3TOGR0Oq-YCekNyJJ_VR9fwQDWoXsmKCeWUGfStuSH_mDp5hVs34yn3hnoJ3CsMIVhqSp-Q08iPZ0sRcRauA0ifmDYxm7w-SlM5OajqPSz_KBJfeSZHmQBV2h_1hD23VllZKb3ZqsqcySs7zwXJzvV9Qe8OxE6cECytd015xUrN3rdJpq08Gu7LaSoGtnBD_HwBRRCaCICMbf9EgauF_dPj73XYr_wQ8Vgub7w8glRE";

  return (
    <div className="bg-[#131313] text-[#e5e2e1] font-sans antialiased overflow-x-hidden relative selection:bg-[#b87333]/30 selection:text-[#b87333] min-h-screen flex flex-col">
      {/* Space Mono Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&family=Space+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* Industrial Loft CSS Engine */}
      <style>{`
        body {
          background-color: #131313;
          background-image: linear-gradient(to right, rgba(160, 141, 128, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(160, 141, 128, 0.08) 1px, transparent 1px);
          background-size: 64px 64px;
          background-attachment: fixed;
        }

        .hard-shadow {
          box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
        }

        .metallic-hover:hover {
          background: linear-gradient(135deg, #b87333 0%, #ffdcc2 100%);
        }

        .sticker-peel {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .sticker-peel:hover {
          transform: scale(1.02) rotate(-1deg);
          box-shadow: 8px 8px 0px 0px #b87333;
          border-color: #b87333;
        }

        @keyframes spinSlow {
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }
      `}</style>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday, 24th October 2026 at 7:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="industrial-loft-chic"
      />

      {/* Header */}
      <header className="w-full top-0 sticky bg-[#131313]/90 backdrop-blur-md border-b border-[#524439] hard-shadow z-50">
        <div className="flex justify-between items-center w-full px-6 md:px-16 py-4 max-w-[1440px] mx-auto">
          {/* Brand */}
          <div className="font-sans font-bold text-lg md:text-xl text-[#b87333] uppercase tracking-widest">
            {brandName}
          </div>

          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex gap-8 items-center font-mono text-xs text-[#d8c3b4] font-medium tracking-wider">
            <a
              className="hover:text-[#b87333] transition-colors"
              href="#concept"
            >
              CONCEPT
            </a>
            <a
              className="hover:text-[#b87333] transition-colors"
              href="#story"
            >
              STORY
            </a>
            <a
              className="hover:text-[#b87333] transition-colors"
              href="#location"
            >
              LOCATION
            </a>
            <a
              className="hover:text-[#b87333] transition-colors"
              href="#gallery"
            >
              GALLERY
            </a>
            <a
              className="hover:text-[#b87333] transition-colors"
              href="#rsvp"
            >
              RSVP
            </a>
          </nav>

          {/* Action */}
          <a
            className="hidden md:flex bg-[#b87333] text-[#4d2700] px-6 py-2 border border-[#b87333] hard-shadow transition-transform metallic-hover font-mono text-xs font-bold tracking-widest uppercase"
            href="#rsvp"
          >
            RSVP
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-[#b87333] p-2"
          >
            {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#131313] border-t border-[#524439] px-6 py-4 flex flex-col gap-3 text-center font-mono text-xs">
            <a
              href="#concept"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#d8c3b4] py-2 border-b border-[#353535]"
            >
              CONCEPT
            </a>
            <a
              href="#story"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#d8c3b4] py-2 border-b border-[#353535]"
            >
              STORY
            </a>
            <a
              href="#location"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#d8c3b4] py-2 border-b border-[#353535]"
            >
              LOCATION
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#d8c3b4] py-2 border-b border-[#353535]"
            >
              GALLERY
            </a>
            <a
              href="#rsvp"
              onClick={() => setMobileNavOpen(false)}
              className="bg-[#b87333] text-[#4d2700] py-2.5 font-bold uppercase tracking-widest mt-2"
            >
              RSVP NOW
            </a>
          </div>
        )}
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-16 py-16 space-y-28">
        {/* Hero Section */}
        <section
          className="relative w-full border border-[#524439] bg-[#1c1b1b] p-6 md:p-12 overflow-hidden"
          id="concept"
        >
          <div className="absolute top-0 right-0 p-2 text-[#a08d80] font-mono text-xs border-l border-b border-[#524439]">
            COORD: {celebrantName.toUpperCase()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-6 z-10 relative">
              <h1 className="text-4xl md:text-6xl text-[#e5e2e1] uppercase tracking-widest font-extrabold leading-tight">
                {celebrantName}'s <br />
                <span className="text-[#b87333]">30th</span>
              </h1>
              <p className="text-base md:text-lg text-[#d8c3b4] max-w-lg border-l-2 border-[#b87333] pl-4 leading-relaxed">
                A celebration of structural milestones. Join us in the foundational space as we mark the next phase of our lives together.
              </p>
              <div className="pt-4">
                <a
                  className="inline-flex bg-[#131313] text-[#b87333] border border-[#b87333] px-8 py-3.5 hard-shadow hover:bg-[#b87333] hover:text-[#4d2700] transition-colors font-mono text-xs font-bold items-center gap-2 group cursor-pointer tracking-widest uppercase"
                  href="#rsvp"
                >
                  INITIATE SEQUENCE
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="md:col-span-5 relative h-80 md:h-[550px] border border-[#524439] hard-shadow group">
              {/* Technical framing lines */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#b87333] pointer-events-none"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#b87333] pointer-events-none"></div>
              <img
                alt={`${celebrantName} Industrial Hero`}
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                src={displayHeroImage}
              />
            </div>
          </div>
        </section>

        {/* Countdown Section with Orbit Rings */}
        <section className="flex flex-wrap justify-center gap-8 md:gap-16 py-12 relative border-y border-[#524439]">
          <div className="relative w-32 h-32 flex flex-col items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-[#a08d80] animate-spin-slow"></div>
            <div className="absolute inset-2 rounded-full border border-[#b87333] opacity-20"></div>
            <span className="font-extrabold text-[#b87333] text-3xl font-mono">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="font-mono text-xs text-[#d8c3b4] mt-1 tracking-widest">
              DAYS
            </span>
          </div>

          <div className="relative w-32 h-32 flex flex-col items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border border-dashed border-[#a08d80] animate-spin-slow"
              style={{ animationDirection: "reverse" }}
            ></div>
            <div className="absolute inset-2 rounded-full border border-[#b87333] opacity-20"></div>
            <span className="font-extrabold text-[#b87333] text-3xl font-mono">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="font-mono text-xs text-[#d8c3b4] mt-1 tracking-widest">
              HOURS
            </span>
          </div>

          <div className="relative w-32 h-32 flex flex-col items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-[#a08d80] animate-spin-slow"></div>
            <div className="absolute inset-2 rounded-full border border-[#b87333] opacity-20"></div>
            <span className="font-extrabold text-[#b87333] text-3xl font-mono">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="font-mono text-xs text-[#d8c3b4] mt-1 tracking-widest">
              MINS
            </span>
          </div>

          <div className="relative w-32 h-32 flex flex-col items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border border-dashed border-[#a08d80] animate-spin-slow"
              style={{ animationDirection: "reverse" }}
            ></div>
            <div className="absolute inset-2 rounded-full border border-[#b87333] opacity-20"></div>
            <span className="font-extrabold text-[#ffb3b1] text-3xl font-mono">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="font-mono text-xs text-[#d8c3b4] mt-1 tracking-widest">
              SEC
            </span>
          </div>
        </section>

        {/* Structural Foundation (Story) */}
        <section className="space-y-12 relative" id="story">
          <div className="border-b border-[#524439] pb-4 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#e5e2e1] uppercase flex items-center gap-4 tracking-widest">
              <Heart className="w-6 h-6 text-[#b87333] fill-current" />
              Structural Foundation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative border border-[#524439] bg-[#131313] p-4 hard-shadow">
              <div className="aspect-video bg-[#1c1b1b] flex items-center justify-center border border-dashed border-[#524439] relative group overflow-hidden">
                <PlayCircle className="w-16 h-16 text-[#b87333] opacity-80 group-hover:scale-110 transition-transform" />
                <div className="absolute bottom-2 left-2 font-mono text-xs text-[#a08d80]">
                  VIDEO_FEED_01.MP4
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[#b87333] uppercase tracking-widest">
                The Blueprint
              </h3>
              <p className="text-base text-[#d8c3b4] border-l-2 border-[#b87333] pl-4 leading-relaxed">
                Every strong structure starts with a solid foundation. {celebrantName} began her journey mapping out the blueprints of her future together. Through careful planning and spontaneous design changes, she built a connection engineered to last a lifetime.
              </p>
            </div>
          </div>
        </section>

        {/* Highlight Banner */}
        <section className="relative w-full py-20 bg-gradient-to-r from-[#b87333] to-[#8c4f10] border-y border-[#524439] overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#131313] uppercase tracking-widest leading-tight">
              "Love is the architecture of the soul."
            </h2>
          </div>
        </section>

        {/* Timeline: Schematic Style */}
        <section className="space-y-12 relative">
          <div className="border-b border-[#524439] pb-4 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#e5e2e1] uppercase flex items-center gap-4 tracking-widest">
              <Activity className="w-6 h-6 text-[#b87333]" />
              Project Timeline
            </h2>
          </div>

          <div className="relative pl-8 md:pl-0">
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#b87333] md:hidden"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {timelinePhases.map((phase: any, idx: number) => {
                const phaseBadge = phase.phase || `PHASE 0${idx + 1} // ${phase.time || '19:00'}`;
                const title = phase.title || "Event Phase";
                const desc = phase.desc || "Architectural celebration phase.";
                const isTertiary = idx === 2;

                return (
                  <div
                    key={idx}
                    className="relative border border-[#524439] bg-[#131313] p-6 hard-shadow"
                  >
                    <div
                      className={`absolute -left-10 md:top-6 md:-left-3.5 w-3.5 h-3.5 ${
                        isTertiary ? "bg-[#ffb3b1]" : "bg-[#b87333]"
                      } rounded-none border border-black`}
                    ></div>
                    <div
                      className={`font-mono text-xs ${
                        isTertiary ? "text-[#ffb3b1]" : "text-[#b87333]"
                      } mb-2 font-bold`}
                    >
                      {phaseBadge}
                    </div>
                    <h3 className="text-xl font-bold text-[#e5e2e1] mb-2 font-sans">
                      {title}
                    </h3>
                    <p className="text-sm text-[#d8c3b4] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Locations & Map */}
        <section className="space-y-12 relative" id="location">
          <div className="border-b border-[#524439] pb-4 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#e5e2e1] uppercase flex items-center gap-4 tracking-widest">
              <MapPin className="w-6 h-6 text-[#b87333]" />
              Site Coordinates
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              {/* SITE A */}
              <div className="border border-[#524439] bg-[#131313] p-6 hard-shadow relative">
                <div className="absolute top-0 right-0 bg-[#b87333] text-[#131313] font-mono text-xs px-2.5 py-1 font-bold">
                  SITE A
                </div>
                <h3 className="text-xl font-bold text-[#e5e2e1] mb-2 tracking-widest uppercase">
                  Celebration Pavilion
                </h3>
                <p className="font-mono text-xs text-[#b87333] mb-4">
                  SEP 15, 2026 // 18:00 HRS
                </p>
                <p className="text-sm text-[#d8c3b4] mb-4 leading-relaxed">
                  The Serene Estate<br />
                  123 Blueprint Ave, Design District
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono border-b border-[#b87333] text-[#b87333] hover:text-white transition-colors uppercase font-bold"
                >
                  GET DIRECTIONS
                </a>
              </div>

              {/* SITE B */}
              <div className="border border-[#524439] bg-[#131313] p-6 hard-shadow relative">
                <div className="absolute top-0 right-0 bg-[#b87333] text-[#131313] font-mono text-xs px-2.5 py-1 font-bold">
                  SITE B
                </div>
                <h3 className="text-xl font-bold text-[#e5e2e1] mb-2 tracking-widest uppercase">
                  After-Party Assembly
                </h3>
                <p className="font-mono text-xs text-[#b87333] mb-4">
                  SEP 15, 2026 // 21:30 HRS
                </p>
                <p className="text-sm text-[#d8c3b4] mb-4 leading-relaxed">
                  The Ironworks Loft Assembly<br />
                  456 Industrial Parkway, Sector 7
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono border-b border-[#b87333] text-[#b87333] hover:text-white transition-colors uppercase font-bold"
                >
                  GET DIRECTIONS
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="border border-[#524439] hard-shadow min-h-[380px] bg-[#1c1b1b] flex items-center justify-center relative overflow-hidden group">
              <div className="text-center z-10 flex flex-col items-center gap-2">
                <Map className="w-10 h-10 text-[#a08d80]" />
                <p className="font-mono text-xs text-[#a08d80] uppercase leading-relaxed">
                  TOPOGRAPHIC DATA UNAVAILABLE<br />
                  PLEASE REFER TO GPS LINK
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery (Visual Archive) */}
        <section className="space-y-12 relative" id="gallery">
          <div className="border-b border-[#524439] pb-4 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#e5e2e1] uppercase flex items-center gap-4 tracking-widest">
              <Camera className="w-6 h-6 text-[#b87333]" />
              Visual Archive
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {galleryList.map((item: any, i: number) => {
              const url = typeof item === "string" ? item : item.url;
              const caption =
                typeof item === "string" ? `ARCHIVE_0${i + 1}` : item.caption;

              return (
                <div
                  key={i}
                  className="aspect-square border border-[#524439] bg-[#1c1b1b] overflow-hidden sticker-peel relative group"
                >
                  <img
                    alt={caption}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    src={url}
                  />
                  <div className="absolute bottom-2 left-2 bg-[#131313]/80 px-2 py-1 font-mono text-[10px] text-[#b87333] border border-[#524439]">
                    {caption}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RSVP Form */}
        <section
          className="relative w-full max-w-3xl mx-auto border border-[#524439] bg-[#131313] p-8 md:p-12 hard-shadow"
          id="rsvp"
        >
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#b87333] m-2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#b87333] m-2 pointer-events-none"></div>

          <RsvpSection partnerOne={celebrantName} partnerTwo="" />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0e0e0e] border-t border-[#524439] w-full py-12 px-6 md:px-16 text-xs font-mono text-[#b4b5b7]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="text-base text-[#b87333] font-bold uppercase tracking-widest">
            {brandName}
          </div>
          <div>
            © {new Date().getFullYear()} {celebrantName}'s 30th Birthday. All Rights Reserved.
          </div>
          <nav className="flex gap-4 uppercase font-bold">
            <a href="#concept" className="hover:text-[#b87333] transition-colors">
              Concept
            </a>
            <a href="#story" className="hover:text-[#b87333] transition-colors">
              Story
            </a>
            <a href="#location" className="hover:text-[#b87333] transition-colors">
              Location
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
