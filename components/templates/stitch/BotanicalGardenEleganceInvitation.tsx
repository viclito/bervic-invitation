"use client";

import { useState, useEffect } from "react";
import { getWeddingTargetDate, formatAgeOrdinal } from "@/lib/dateUtils";
import { motion } from "framer-motion";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import { Menu, X, Flower2, Quote, MapPin } from "lucide-react";

export default function BotanicalGardenEleganceInvitation(
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
    const targetDate = getWeddingTargetDate(
      props.weddingDate,
      props.weddingTime
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
  }, [props.weddingDate, props.weddingTime]);

  // Timeline events fallback
  const timelineSteps =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay
      : [
          {
            time: "3:00 PM",
            title: "Welcome Drinks in the Conservatory",
            desc: "Arrive and settle in with artisanal botanical cocktails and acoustic melodies.",
          },
          {
            time: "4:30 PM",
            title: "The Celebration",
            desc: "A brief, heartfelt exchange of toasts beneath the ancient oak tree.",
          },
          {
            time: "6:00 PM",
            title: "Al Fresco Dining",
            desc: "A family-style feast featuring local, seasonal ingredients served at long wooden tables.",
          },
        ];

  // Main venue fallback
  const mainVenue =
    props.locations && props.locations.length > 0
      ? props.locations[0]
      : {
          name: props.venuePlace || "The Botanical Greenhouse & Conservatory",
          venueLabel: "The Setting",
          address:
            props.contactAddress ||
            props.venuePlace ||
            "124 Orchard Lane, Greenfield Valley",
          mapLink: `https://maps.google.com/?q=${encodeURIComponent(
            props.contactAddress || props.venuePlace || "Greenfield Valley"
          )}`,
          image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuAvWe_21aYaIvERquGq11QP4lDuSfJCppNLVOt1dIz4c0LnAUaS93PgIfx_jQCE0TT2Oled51PeaMiaxd81oA9Au5EwOAIV_SPYOnomEmQLpdcLfwguhecc6ggyvogJ3Tak0NcFIPbk_blt02bmnRBealKovkdtW2C80JY-VI3nIJyMZzJDvE9U-AoOCQJtCLD3I6bgb7677rP8GKjaYB6RhhpCC0Xt2PrOuK6-UZR2IoMHBqRmUuJq",
        };

  return (
    <div className="bg-[#fcf9f8] text-[#1b1c1c] font-sans antialiased overflow-x-hidden relative selection:bg-[#5f5f00]/20 selection:text-[#5f5f00]">
      {/* Material Symbols Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Embedded Botanical CSS Engine */}
      <style>{`
        .botanical-frame {
          position: relative;
          padding: 16px;
        }
        .botanical-frame::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid #cac7b1;
          opacity: 0.5;
          pointer-events: none;
          border-radius: 0.75rem;
        }
        .botanical-frame::after {
          content: '';
          position: absolute;
          inset: 8px;
          border: 1px solid #cac7b1;
          opacity: 0.3;
          pointer-events: none;
          border-radius: calc(0.75rem - 4px);
        }

        .level-1-shadow {
          box-shadow: 0 4px 20px rgba(95, 95, 0, 0.05);
        }
      `}</style>

      {/* Guest Personalized Envelope Cover */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday at 3:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="botanical-garden-elegance"
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
            className="font-serif text-2xl text-[#5f5f00] italic font-semibold"
            href="#"
          >
            {celebrationHeader}
          </a>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-8 font-serif text-sm">
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
                className="text-[#484837] hover:text-[#5f5f00] transition-colors duration-300"
                href="#rsvp"
              >
                RSVP
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <a
              className="hidden md:inline-flex items-center justify-center bg-[#5f5f00] text-white font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded hover:bg-[#797900] transition-colors duration-300 shadow-sm"
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
        </div>

        {/* Mobile Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#fcf9f8] border-b border-[#cac7b1]/30 px-6 py-4 flex flex-col gap-4 text-center">
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
        <section className="relative w-full min-h-[850px] md:min-h-[921px] flex items-center justify-center py-20 px-6 md:px-16">
          <div className="max-w-[1280px] w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 flex flex-col gap-6 text-center lg:text-left order-2 lg:order-1"
            >
              <span className="font-semibold text-xs text-[#904d00] tracking-widest uppercase">
                Join us to celebrate
              </span>

              <h1 className="text-4xl md:text-6xl font-bold font-serif text-[#5f5f00] leading-tight">
                A Day of Love,
                <br /> Laughter &amp; Botanical Beauty.
              </h1>

              <p className="text-base md:text-lg font-serif text-[#484837] max-w-md mx-auto lg:mx-0 leading-relaxed">
                {props.inviteLine && !props.inviteLine.includes("wedding")
                  ? props.inviteLine
                  : "We invite you to gather under the canopy of nature as we celebrate a new chapter surrounded by artisanal elegance."}
              </p>

              <div className="pt-4">
                <a
                  className="inline-flex items-center justify-center bg-[#5f5f00] text-white font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded hover:bg-[#797900] transition-colors duration-300 shadow-sm"
                  href="#rsvp"
                >
                  Confirm Your Presence
                </a>
              </div>
            </motion.div>

            {/* Arched Greenhouse Window Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-7 w-full h-[550px] lg:h-[750px] relative order-1 lg:order-2 botanical-frame bg-[#f6f3f2] rounded-t-[100px] rounded-b-xl overflow-hidden p-2 shadow-sm"
            >
              <img
                alt="Botanical Hero"
                className="w-full h-full object-cover rounded-t-[90px] rounded-b-lg grayscale-[20%] sepia-[10%] contrast-125"
                src={
                  props.heroImage ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAZJB7Ka0QuhOUlCq-WvrM9YMyT_qQPfo-5wStIzRDkI1rE9oGCRjHJdaWYb_Tt-1-cPvwl3V18SoideDwVuoURk_6KoaSahb4uvAzqjvjXFmcYtpduAe51zfVp1BCorfBQSLC8RNBqc0bQNLVdgOOboQj_9n5bUQOH1TNuz9dZ0-wAoMjGXonAU0jf1DHmoeXBD6f0kRy5N8hp_UHBZqxTOxq-l-hRSVSKr_AMKMmRVNBpLpeFr_Og"
                }
              />
            </motion.div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-20 bg-[#f6f3f2] w-full border-y border-[#cac7b1]/30">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 text-center flex flex-col items-center gap-10">
            <Flower2 className="w-10 h-10 text-[#5f5f00]" />

            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold font-serif text-[#904d00]">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-xs font-semibold text-[#484837] uppercase tracking-widest mt-2">
                  Days
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold font-serif text-[#904d00]">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-xs font-semibold text-[#484837] uppercase tracking-widest mt-2">
                  Hours
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-bold font-serif text-[#904d00]">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-xs font-semibold text-[#484837] uppercase tracking-widest mt-2">
                  Mins
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-28 px-6 md:px-16 bg-[#fcf9f8]" id="about">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-6 flex flex-row gap-4 items-center justify-center">
              {props.partnerTwo && props.partnerTwo.trim() !== "" && props.partnerTwo !== "Groom" ? (
                <>
                  <div className="botanical-frame p-2 bg-white shadow-sm rounded-xl w-1/2">
                    <img
                      alt={celebrantName}
                      className="w-full h-auto aspect-[3/4] object-cover rounded-lg"
                      src={
                        props.coupleImage ||
                        props.coverImage ||
                        props.heroImage ||
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuB6apaciEMxIAm-wQUZbDL2MzB_jdg_BPJ9LReFAofj2uH7oYLs13yZ4TiRn_Kel5_q1R7z3GgKbIUlpIqJlR0bsNrBu0rS98x2Nm6cp4j5Oz2d_OYt1XtICNhXTV8Nl1zZxn1Zsxg6Us2EVIi0WlICPjKwedftf3Hw5s5bbJ4IxGqJPPtIPLUQpK_9goc6svfanSSizvdj9Lh4LmiZJ1owRrpdyVBginVt8gJwmtxCzcYdxiahSQPO"
                      }
                    />
                    <p className="text-center text-xs font-serif italic text-[#5f5f00] mt-2 font-bold">{celebrantName}</p>
                  </div>
                  <div className="botanical-frame p-2 bg-white shadow-sm rounded-xl w-1/2">
                    <img
                      alt={props.partnerTwo}
                      className="w-full h-auto aspect-[3/4] object-cover rounded-lg"
                      src={props.partnerTwoImage || props.coverImage || "/images/templates/groom-bride-2.jpg"}
                    />
                    <p className="text-center text-xs font-serif italic text-[#5f5f00] mt-2 font-bold">{props.partnerTwo}</p>
                  </div>
                </>
              ) : (
                <div className="botanical-frame p-3 bg-white shadow-md rounded-2xl max-w-sm w-full">
                  <img
                    alt={celebrantName}
                    className="w-full h-auto aspect-[3/4] object-cover rounded-xl shadow-xs"
                    src={
                      props.coupleImage ||
                      props.coverImage ||
                      props.heroImage ||
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6apaciEMxIAm-wQUZbDL2MzB_jdg_BPJ9LReFAofj2uH7oYLs13yZ4TiRn_Kel5_q1R7z3GgKbIUlpIqJlR0bsNrBu0rS98x2Nm6cp4j5Oz2d_OYt1XtICNhXTV8Nl1zZxn1Zsxg6Us2EVIi0WlICPjKwedftf3Hw5s5bbJ4IxGqJPPtIPLUQpK_9goc6svfanSSizvdj9Lh4LmiZJ1owRrpdyVBginVt8gJwmtxCzcYdxiahSQPO"
                    }
                  />
                  <p className="text-center text-sm font-serif italic text-[#5f5f00] mt-3 font-bold">{celebrantName}</p>
                </div>
              )}
            </div>

            <div className="md:col-span-6 md:col-start-7 flex flex-col gap-6">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00] italic">
                Our Story
              </h2>
              <div className="h-px w-16 bg-[#904d00]"></div>
              <p className="text-base font-serif text-[#484837] leading-relaxed">
                What started as a shared love for slow Sunday mornings and rare botanical finds has blossomed into a lifelong journey. We believe in the beauty of unhurried moments and the elegance of simplicity.
              </p>
              <p className="text-base font-serif text-[#484837] leading-relaxed">
                {props.loveStoryText ||
                  `This celebration is an extension of our home—a space curated with love, grounded in nature, and designed to bring our closest friends together for an evening of fine dining and heartfelt conversation.`}
              </p>
            </div>
          </div>
        </section>

        {/* Highlight Banner */}
        <section className="py-28 bg-[#5f5f00] relative overflow-hidden flex items-center justify-center px-6 md:px-16 text-white">
          <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center gap-6">
            <Quote className="w-12 h-12 text-[#ffdcc2] opacity-60" />
            <p className="text-3xl md:text-5xl font-serif italic leading-tight">
              &ldquo;To plant a garden is to believe in tomorrow.&rdquo;
            </p>
            <span className="text-xs font-semibold text-[#ffdcc2] uppercase tracking-[0.2em]">
              Audrey Hepburn
            </span>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-28 px-6 md:px-16 bg-[#f6f3f2]" id="timeline">
          <div className="max-w-3xl mx-auto flex flex-col gap-12">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#5f5f00]">
                The Day&apos;s Flow
              </h2>
              <p className="text-sm font-serif text-[#5d5c58]">
                A curated experience from afternoon to evening.
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto space-y-12 py-4">
              {/* Central Vertical Line for Desktop */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-[#cac7b1] hidden md:block" />

              {/* Left Vertical Line for Mobile */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#cac7b1] md:hidden" />

              {timelineSteps.map((step, idx) => {
                const isEven = idx % 2 === 1;
                return (
                  <div
                    key={idx}
                    className="relative flex items-center md:items-start group"
                  >
                    {/* Node Circle Pin */}
                    <div
                      className={`absolute left-3 md:left-1/2 -translate-x-1/2 top-1.5 w-3 h-3 rounded-full ${
                        idx % 2 === 0 ? "bg-[#904d00]" : "bg-[#5f5f00]"
                      } ring-4 ring-[#f6f3f2] z-10 shadow-sm`}
                    />

                    {/* Content Box */}
                    <div
                      className={`pl-10 md:pl-0 w-full ${
                        isEven
                          ? "md:w-1/2 md:ml-auto md:pl-12 md:text-left"
                          : "md:w-1/2 md:mr-auto md:pr-12 md:text-right"
                      }`}
                    >
                      <span className="text-xs font-semibold text-[#904d00] uppercase tracking-widest block mb-1">
                        {step.time}
                      </span>
                      <h3 className="text-xl font-bold font-serif text-[#5f5f00] mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-sm font-serif text-[#484837] leading-relaxed">
                        {"desc" in step
                          ? (step as { desc?: string }).desc
                          : "Enjoy drinks, food, and music."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Venue & Location Section */}
        <section className="py-28 px-6 md:px-16 bg-[#fcf9f8]" id="venue">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="md:col-span-6 order-2 md:order-1">
              <div className="botanical-frame p-3 bg-white rounded-2xl shadow-sm overflow-hidden relative aspect-video flex items-center justify-center">
                <img
                  alt="Venue preview"
                  className="w-full h-full object-cover rounded-xl opacity-90"
                  src={
                    (mainVenue as { image?: string }).image ||
                    props.coverImage ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuAvWe_21aYaIvERquGq11QP4lDuSfJCppNLVOt1dIz4c0LnAUaS93PgIfx_jQCE0TT2Oled51PeaMiaxd81oA9Au5EwOAIV_SPYOnomEmQLpdcLfwguhecc6ggyvogJ3Tak0NcFIPbk_blt02bmnRBealKovkdtW2C80JY-VI3nIJyMZzJDvE9U-AoOCQJtCLD3I6bgb7677rP8GKjaYB6RhhpCC0Xt2PrOuK6-UZR2IoMHBqRmUuJq"
                  }
                />
              </div>
            </div>

            <div className="md:col-span-6 md:col-start-7 order-1 md:order-2 space-y-6">
              <div>
                <span className="font-semibold text-xs text-[#904d00] tracking-widest uppercase block mb-1">
                  Location &amp; Setting
                </span>
                <h2 className="text-3xl md:text-5xl font-bold font-serif text-[#5f5f00]">
                  {mainVenue.name || mainVenue.venueLabel || "The Botanical Setting"}
                </h2>
              </div>
              <div className="h-px w-16 bg-[#904d00]"></div>

              <div className="flex items-start gap-3 text-[#484837]">
                <MapPin className="w-5 h-5 text-[#904d00] shrink-0 mt-0.5" />
                <p className="text-base md:text-lg font-serif leading-relaxed">
                  {mainVenue.address || "124 Orchard Lane, Greenfield Valley"}
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={mainVenue.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[#5f5f00] text-white font-semibold text-xs uppercase tracking-wider px-8 py-4 rounded hover:bg-[#797900] transition-colors duration-300 shadow-sm"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Directions on Google Maps</span>
                </a>
              </div>
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
