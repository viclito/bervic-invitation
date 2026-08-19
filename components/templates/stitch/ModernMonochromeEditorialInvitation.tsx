"use client";

import { getWeddingTargetDate, formatAgeOrdinal } from "@/lib/dateUtils";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, ChevronDown, Sparkles, MapPin, ArrowRight } from "lucide-react";

export default function ModernMonochromeEditorialInvitation(
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

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 8,
    minutes: 45,
    seconds: 22,
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

  // Gallery items fallback matching exact Stitch screen 337baa07dcde4ebab2bf262ada7e55b3
  const validUserGallery = (props.galleryImages || []).filter(img => Boolean(Boolean(img && String(img).trim())));
  const galleryList =
    validUserGallery.length > 0
      ? validUserGallery
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6Xt4nFO26JrgTkI976YIDXHb56VeLqLydsYlcbtdeg_t5AI2CKES1uDYlqOJmPrYjZ4faFh8oEQ7CIcY2TQX68bH7c6HWcz2WMUoIzXlrNflserp1HTMp-u_9xP3kulIHX6syv458dE4N5JtmXGTV3TpqRyo_3to-np2uA5PLzYaiF46P9Tb9DtBHShDRtx6e8SdKiAyZIlCmhFfQ5V-zcZKA5mwfICOsKIfqXbmKTSpsul9Wby3s",
            caption: "Paris, 2018",
            rotate: "rotate-[-3deg]",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAXiKfUzw73sz7TacdLykZ1M_EOFbMMtyMocbayMD183eaWhyLF5k9rVxD1M-bVXGfbUftecenn810Vv1Yz1VqBirwwNsMocLXD8YNLjwMHfxihldFJraO_9jtHLN0sqwh8loKWZnK96NZkW0Dt7IKv9_M5jmfc7P8oZL0MNWFZfE018tXUYjAwd7KepdOaeiHka74SU4VWg3PF0HY_QofpHBT7R19ld8mfZtGEpW81xY0QtBlSgDK",
            caption: "Graduation Day",
            rotate: "rotate-[2deg] mt-8 md:mt-0",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAuDwOpLgDxUoEwsO-qWAfDxDsFogP38IZNCu-zHLO089LD8Ui85p3QMK7UqQl4ipcCUnwLpuBPDn0NUjQ3dJ789U23rMPedO01RzcHPprtNKiACpFDlwK6WaiRm8eF2CSXS2w-Mpq06rrtEcRx1BztLbgNmwbwdsplBTGtiqk94khtsbDaPn5okKjCUe9aNeYcPM9u8cmHyWauq0on2XXwV3IAB0353IieJ-g0a6Z6WZxWADFv_hc",
            caption: "Family Dinner",
            rotate: "rotate-[-1deg] mt-8 md:mt-12",
          },
        ];

  // Ensure no wedding timeline or wedding hero image is displayed
  const hasWeddingTimeline = props.timelineDay?.some((step) =>
    /marriage|vow|wedding|nuptials|bride|groom/i.test(step.title)
  );

  const timelineSteps =
    props.timelineDay && props.timelineDay.length > 0 && !hasWeddingTimeline
      ? props.timelineDay
      : [
          {
            time: "7:00 PM",
            title: "Arrival & Welcome",
            desc: "Signature cocktails and light canapés upon arrival.",
          },
          {
            time: "8:30 PM",
            title: "Dinner is Served",
            desc: "A curated three-course meal by our guest chef.",
          },
          {
            time: "10:00 PM",
            title: "Toasts & Dancing",
            desc: "Words from loved ones followed by music into the night.",
          },
        ];

  const isNonEditorialHero =
    !props.heroImage ||
    props.heroImage.includes("unsplash.com") ||
    props.heroImage.includes("wedding") ||
    props.heroImage.includes("photo-1519741497674") ||
    props.heroImage.includes("photo-1511795409834") ||
    props.heroImage.includes("AB6AXuCbj6E_qQBW8N2") ||
    Boolean(props.partnerTwo && props.partnerTwo.trim() !== "");

  const displayHeroImage =
    props.heroImage && !isNonEditorialHero
      ? props.heroImage
      : "https://images.pexels.com/photos/38471603/pexels-photo-38471603.jpeg?_gl=1*1c5oplg*_ga*NzM2MzIzMTQ0LjE2NjI3MjcxNjg.*_ga_8JE65Q40S6*czE3ODU3NDY2Nzkkbzc2JGcxJHQxNzg1NzQ2NzAzJGozNiRsMCRoMA..";

  // Story portrait image sanitization
  const isWeddingCoupleImage =
    props.coupleImage &&
    (props.coupleImage.includes("wedding") ||
      props.coupleImage.includes("AB6AXuArG5YFkRTyG0NbTRVMqnmH7qfHqXAFAyK9JzYzo") ||
      props.coupleImage.includes("AB6AXuCqCEp1yGZWj7bxmvIrpv5xGR3"));

  const displayCoupleImage =
    props.coupleImage && !isWeddingCoupleImage
      ? props.coupleImage
      : "https://lh3.googleusercontent.com/aida-public/AB6AXuCEdDZx1aRPUE3fFkophuJEeS31oluEC0l7esbN7rHFetOJbnlEFxPjR5YLKWxoZS6_iaaPXSaREWsNcQyE-wRdIZ6B57dx4NLkONSTJLw_YoqOBW1EJM4OO_MAYABhtRgz3rbnYfn5FO-FKUUKOQDJ7URWNVF0H7nPUBHn23BcS0K4dvzGDj5q_6JCegOi1Enllf2fF2dxma3Xs5kkHcCUURM6dXG7erffgQF29bVZFGAHbcAI08RA";

  // Story narrative text sanitization
  const isWeddingStoryText =
    props.loveStoryText &&
    /wedding|marriage|love story narrative|first met/i.test(props.loveStoryText);

  const displayStoryText1 = `From the quiet streets of her childhood home to the bustling avenues of her professional life, ${celebrantName} has always moved with grace and purpose. This evening is a reflection of the chapters written and a prelude to those yet to come.`;

  const displayStoryText2 =
    props.loveStoryText && !isWeddingStoryText
      ? props.loveStoryText
      : "We gather not just to mark the passage of time, but to celebrate the beautiful tapestry of friendships, experiences, and love that define her world.";

  // Venue location fallback & sanitization
  const rawVenueName =
    props.locations && props.locations[0]
      ? props.locations[0].name || props.locations[0].venueLabel || "The Glasshouse Conservatory"
      : "The Glasshouse Conservatory";

  const displayVenueName = /marriage|ceremony|wedding/i.test(rawVenueName)
    ? "The Glasshouse Conservatory"
    : rawVenueName;

  const rawVenueAddress =
    props.locations && props.locations[0]
      ? props.locations[0].address || "123 Botanical Gardens Way, Metropolis, NY 10001"
      : "123 Botanical Gardens Way, Metropolis, NY 10001";

  const displayVenueAddress = /marriage|wedding/i.test(rawVenueAddress)
    ? "123 Botanical Gardens Way, Metropolis, NY 10001"
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

      {/* Editorial CSS Engine & Keyframe Animations */}
      <style>{`
        .slow-zoom {
          animation: slowZoom 20s ease-in-out infinite alternate;
        }
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }

        .gold-shimmer {
          background: linear-gradient(90deg, #5f5f00 0%, #cccc52 50%, #5f5f00 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }
        @keyframes shimmer {
          to {
            background-position: 200% center;
          }
        }

        .polaroid {
          background: white;
          padding: 10px 10px 40px 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        .polaroid:hover {
          transform: scale(1.05) rotate(0deg) !important;
          z-index: 10;
        }

        .sparkle-anim {
          animation: sparkle 2s infinite alternate;
        }
        @keyframes sparkle {
          0% { opacity: 0.5; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Envelope Cover Integration */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday at 7:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="modern-monochrome-editorial"
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
          <a
            className="font-serif text-2xl font-semibold italic text-[#5f5f00] gold-shimmer"
            href="#"
          >
            {celebrationHeader}
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-sans text-xs uppercase tracking-widest font-semibold">
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
              className="bg-[#5f5f00] text-white px-6 py-3 rounded hover:bg-[#797900] transition-colors tracking-wider"
              href="#rsvp"
            >
              RSVP Now
            </a>
          </div>

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
              className="bg-[#5f5f00] text-white py-3 rounded font-semibold text-xs uppercase tracking-wider"
            >
              RSVP Now
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section (Editorial Focus) */}
      <header
        className="relative h-screen min-h-[800px] w-full overflow-hidden flex items-center justify-center pt-20"
        id="home"
      >
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#e4e2e1]">
          <img
            alt="Evelyn Hero Editorial"
            className="w-full h-full object-cover slow-zoom opacity-80 mix-blend-multiply"
            src={displayHeroImage}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-6 md:px-16 mt-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-serif italic gold-shimmer mb-6 max-w-4xl mx-auto leading-tight">
            A Celebration of Thirty Years.
          </h1>
          <p className="text-base md:text-lg font-serif text-[#484837] max-w-2xl mx-auto mb-10 leading-relaxed">
            Join us for an evening of quiet elegance, artisanal spirits, and shared memories as we toast to a new decade.
          </p>
          <a
            className="inline-block bg-[#5f5f00] text-white px-10 py-4 rounded hover:bg-[#797900] transition-colors text-xs font-semibold uppercase tracking-widest border border-[#5f5f00]"
            href="#rsvp"
          >
            Confirm Attendance
          </a>
        </motion.div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce text-[#5f5f00]">
          <a aria-label="Scroll Down" href="#countdown">
            <ChevronDown className="w-8 h-8" />
          </a>
        </div>
      </header>

      {/* Countdown Section */}
      <section className="py-24 bg-[#fcf9f8]" id="countdown">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] italic gold-shimmer mb-12">
            The Countdown Begins
          </h2>
          <div className="flex justify-center gap-4 md:gap-8 flex-wrap">
            {/* Days */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-[#5f5f00]/30 flex items-center justify-center bg-[#f6f3f2] shadow-[0_0_15px_rgba(95,95,0,0.1)] mb-4">
                <span className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00]">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#5d5c58] uppercase tracking-widest">
                Days
              </span>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-[#5f5f00]/30 flex items-center justify-center bg-[#f6f3f2] shadow-[0_0_15px_rgba(95,95,0,0.1)] mb-4">
                <span className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00]">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#5d5c58] uppercase tracking-widest">
                Hours
              </span>
            </div>

            {/* Mins */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-[#5f5f00]/30 flex items-center justify-center bg-[#f6f3f2] shadow-[0_0_15px_rgba(95,95,0,0.1)] mb-4">
                <span className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00]">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#5d5c58] uppercase tracking-widest">
                Mins
              </span>
            </div>

            {/* Secs */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-[#5f5f00]/30 flex items-center justify-center bg-[#f6f3f2] shadow-[0_0_15px_rgba(95,95,0,0.1)] mb-4">
                <span className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00]">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#5d5c58] uppercase tracking-widest">
                Secs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="w-full overflow-hidden leading-none bg-[#f6f3f2]">
        <svg
          className="relative block w-full h-[50px] fill-[#fcf9f8]"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      {/* Our Story Section */}
      <section className="py-24 bg-[#f6f3f2]" id="about">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-5 md:col-start-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] italic leading-tight">
                A Journey of <br />
                Thirty Years
              </h2>
              <p className="text-base font-serif text-[#484837] leading-relaxed">
                {displayStoryText1}
              </p>
              <p className="text-base font-serif text-[#484837] leading-relaxed">
                {displayStoryText2}
              </p>
            </div>

            <div className="md:col-span-5">
              <div className="aspect-[4/5] bg-[#e4e2e1] overflow-hidden rounded-lg shadow-md">
                <img
                  alt="Evelyn reading"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  src={displayCoupleImage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-[#fcf9f8]" id="timeline">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 space-y-16">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-center text-[#5f5f00] italic gold-shimmer">
            The Evening's Flow
          </h2>

          <div className="relative max-w-3xl mx-auto space-y-12 py-4">
            {/* Central Vertical Stem Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[#5f5f00]/20 hidden md:block" />

            {/* Mobile Vertical Stem Line */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-[#5f5f00]/20 md:hidden" />

            {timelineSteps.map((step, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={idx}
                  className="relative flex items-center md:items-start group"
                >
                  {/* Node Circle Pin */}
                  <div className="absolute left-3 md:left-1/2 -translate-x-1/2 top-1.5 w-4 h-4 bg-[#fcf9f8] border-2 border-[#5f5f00] rounded-full z-10 shadow-sm" />

                  {/* Content Box */}
                  <div
                    className={`pl-10 md:pl-0 w-full ${
                      isEven
                        ? "md:w-1/2 md:ml-auto md:pl-12 md:text-left"
                        : "md:w-1/2 md:mr-auto md:pr-12 md:text-right"
                    }`}
                  >
                    <span className="text-xs font-semibold text-[#5d5c58] tracking-widest uppercase block mb-1">
                      {step.time}
                    </span>
                    <h3 className="text-xl font-bold font-serif text-[#5f5f00] mb-1.5">
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
      </section>

      {/* Highlight Banner */}
      <section className="py-24 bg-[#5f5f00] text-white relative overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img
            alt="Abstract texture"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuExxZkYePZ4zsez2qB8y-7i1-PWU6EovrOXELLPYb9D8Uh7DmtzBRNmKXkJlj6OFeNDQIhpwJvZJhbleOmdSqemuJb58QhZAXJdr1ef8EPcs3yoXaMt5MoOjlKbBEDFZql4durbLnSIjdPRHveL6B6yHCdY89TUAyVFABJFFFsjlehfqSQ3RiR9D06_VCdtZCJJTanZmYbbQ6Kn43IfYP15ijGaYffanEWvcq6zK_Z1CYdkJ1g87Y"
          />
        </div>
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10 text-center w-full space-y-4">
          <p className="text-3xl md:text-5xl font-serif italic">
            "Elegance is the only beauty that never fades."
          </p>
          <span className="text-xs font-semibold uppercase tracking-widest opacity-80 block">
            - Audrey Hepburn
          </span>
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-24 bg-[#fcf9f8]" id="venue">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-5 md:col-start-2 order-2 md:order-1">
              <div className="aspect-square bg-[#e4e2e1] rounded-lg flex items-center justify-center border border-[#cac7b1] overflow-hidden relative shadow-sm">
                <img
                  alt="Venue map location"
                  className="w-full h-full object-cover opacity-80"
                  src={
                    (mainVenue as { image?: string }).image ||
                    props.coverImage ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCyD-77khF-v4syjvQxKQ7v-G3fEgOMwBqyxCx8uG8G8JI84AeMbFnUPTvPdELLGVgXgG0ojrnpYrgKddU9GYqTAcK9nAmR-hbQvf4wAWsuPKR7aUiQcmRP0sx2PSg8j4HtpeVrXAVc-Z6fDVHzhopdAFWYd4j9EX4TeNzSLEjpzMhMy-WEwK426M1Ag_CBJEgLSuaG06xtTf7xnA71hD60FaNjK2xGMkt6KzdGW_TNt0Ew9uNIG5v-"
                  }
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg flex items-center gap-3 border border-[#cac7b1]">
                    <MapPin className="w-6 h-6 text-[#904d00]" />
                    <span className="font-bold font-serif text-[#5f5f00]">
                      {mainVenue.name || "The Glasshouse Conservatory"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 order-1 md:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] italic">
                The Venue
              </h2>
              <h3 className="text-xl font-bold font-serif text-[#1b1c1c]">
                {mainVenue.name || "The Glasshouse Conservatory"}
              </h3>
              <p className="text-base font-serif text-[#484837]">
                {mainVenue.address}
              </p>
              <p className="text-sm font-serif text-[#484837] leading-relaxed">
                Valet parking will be provided at the main entrance. Please arrive via the South Gate for expedited entry.
              </p>
              <a
                className="inline-flex items-center gap-2 text-[#5f5f00] hover:text-[#797900] font-semibold text-xs uppercase tracking-wide transition-colors"
                href={mainVenue.mapLink}
                target="_blank"
                rel="noreferrer"
              >
                <span>Get Directions</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-[#f6f3f2] overflow-hidden" id="gallery">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 space-y-16">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6 text-[#5f5f00] sparkle-anim" />
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] italic">
              Our Moments
            </h2>
            <Sparkles className="w-6 h-6 text-[#5f5f00] sparkle-anim" />
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {galleryList.map((item: any, i: number) => {
              const url = typeof item === "string" ? item : item.url;
              const caption =
                typeof item === "string" ? `Moment #${i + 1}` : item.caption;
              const rotate =
                typeof item === "string"
                  ? i === 0
                    ? "rotate-[-3deg]"
                    : i === 1
                    ? "rotate-[2deg] mt-8 md:mt-0"
                    : "rotate-[-1deg] mt-8 md:mt-12"
                  : item.rotate || "";

              return (
                <div
                  key={i}
                  className={`polaroid w-64 transform ${rotate} rounded-sm`}
                >
                  <img
                    alt={caption}
                    className="w-full aspect-square object-cover mb-4 rounded-sm"
                    src={url}
                  />
                  <p className="text-center font-serif text-sm text-[#484837] italic">
                    {caption}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-24 bg-[#fcf9f8]">
        <RsvpSection partnerOne={celebrantName} partnerTwo="" />
      </section>

      {/* Footer */}
      <footer className="w-full py-12 bg-[#f6f3f2] border-t border-[#cac7b1]/30">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <span className="font-serif text-xl font-bold text-[#5f5f00] italic opacity-90 hover:opacity-100 transition-opacity">
            {celebrationHeader}
          </span>
          <div className="flex gap-6 text-xs text-[#484837] font-semibold uppercase">
            <a href="#" className="hover:text-[#904d00] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#904d00] transition-colors">
              Contact
            </a>
          </div>
          <p className="text-xs text-[#5d5c58] font-serif">
            © {new Date().getFullYear()} Crafted with Love for {celebrantName}'s Special Day
          </p>
        </div>
      </footer>
    </div>
  );
}
