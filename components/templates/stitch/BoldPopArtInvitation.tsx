"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { TemplateClassicFloralProps } from "@/types/template";
import PersonalizedEnvelopeCover from "../classic-floral/PersonalizedEnvelopeCover";
import RsvpSection from "../classic-floral/RsvpSection";
import {
  Menu,
  X,
  Sparkles,
  MapPin,
  PartyPopper,
  Calendar,
  Clock,
} from "lucide-react";

export default function BoldPopArtInvitation(
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
    minutes: 42,
    seconds: 0,
  });

  // Trigger burst confetti
  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ffda00", "#ff0055", "#00e5ff"],
      });
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ffda00", "#ff0055", "#00e5ff"],
      });
    } catch (err) {
      console.error("Confetti trigger error:", err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Initial celebratory confetti burst on load
    const timer = setTimeout(() => {
      fireConfetti();
    }, 600);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const targetDate = new Date(
      props.weddingDate || "2026-09-15T19:00:00"
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
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR0oGURCnONg_Sdtm17bZL2XsTUopLXP2Gkojk7abCtub29Kzr0YywAFRXBHvxjt1Kcsp-I_Vb7o2OP4ZwhbFw6G-BMQFKTwOfysPWdbSUKbQMv0aCDxZMHvC6pacekPE9SnKFbB8KJlDxaFey_AyrjFulhoWlw9W9gg1ujou87tkJkN4H75FCReG4S6yWGPZCxmwtaZe98wpxohBMklas8PRYrdcYLO_Dzbt-vJrPmyF7PmhwvkrA",
            caption: "Cake Time",
            rotate: "rotate-[-3deg]",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxSmBhBbmakm8EcduzuXQxBT7Jl1DjJYmLbV0XwVW4OBcCpcOENxw9mhi9j77zErLeuUxjASW5P4_AE8sBQYp1usjHBIBIBtpIvqv2qq5wNBQwfeR4uivAUqc3RtycfWtAel-SJemCcaGavwNEvqub0M0r7y66JJQlODEs2rSuQVik-s635G3TVZsA_u4h7whT7Ev1K8XtiJQeZfxekPpBEImFD4Z2wYEyKF3IlU4p4iFGcg3KAr4t",
            caption: "Balloons",
            rotate: "rotate-[4deg] md:mt-8",
          },
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaGPLCD7v21v1FYmEroTJPX0BbfkcmCzaqfYgklfKh2LV3iY8jujmu_ZKB7BBSebA1DixKGJNZa-0Tb9bIU5tyEjp4u2OE0sieDmzdrgx78z0jl0FGj0DHzFrJgjkJb_cvohspjIjSBx7HBhDYmBPYsXMZUT_oiunFPaMCsuDlRDE9yIwntNM9M14v9sZC8QUmx31vVl7vNppnBgW_F260BnCDvdzZKhgHW8yocovXKSIqgXyau61n",
            caption: "Confetti",
            rotate: "rotate-[-2deg] md:mt-4",
          },
        ];

  // Plan Timeline fallback
  const timelineSteps =
    props.timelineDay && props.timelineDay.length > 0
      ? props.timelineDay
      : [
          {
            time: "7:00 PM",
            title: "Arrival & Cocktails",
            desc: "Grab a neon drink and get the party started.",
            colorClass: "bg-[#ff0055] text-white",
            nodeColor: "bg-[#ffda00]",
          },
          {
            time: "8:30 PM",
            title: "Dinner & Toasts",
            desc: "A feast for the eyes and the stomach.",
            colorClass: "bg-[#ffda00] text-[#1b1c1c]",
            nodeColor: "bg-[#00e5ff]",
          },
          {
            time: "10:00 PM",
            title: "Dance Floor Opens",
            desc: "Music up, lights down. Let's go!",
            colorClass: "bg-[#1b1c1c] text-white",
            nodeColor: "bg-[#ff0055]",
          },
        ];

  // Venue location fallback
  const mainVenue =
    props.locations && props.locations[0]
      ? props.locations[0]
      : {
          name: "The Grand Estate",
          address: "123 Neon Avenue, Pop City, CA 90210",
          mapLink: "https://maps.google.com",
        };

  return (
    <div className="bg-[#fcf9f8] text-[#1b1c1c] font-sans antialiased overflow-x-hidden relative selection:bg-[#ffdcc2] selection:text-[#6e3a00]">
      {/* Material Symbols Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      {/* Embedded 90s Neo-Brutalist Pop Art CSS Engine */}
      <style>{`
        .pop-accent-1 { background-color: #ffda00; color: #1b1c1c; } /* Yellow */
        .pop-accent-2 { background-color: #ff0055; color: white; } /* Magenta */
        .pop-accent-3 { background-color: #00e5ff; color: #1b1c1c; } /* Cyan */

        .geo-border {
          border: 4px solid #1b1c1c;
          box-shadow: 8px 8px 0px #1b1c1c;
          transition: all 0.2s ease;
        }
        .geo-border:hover {
          box-shadow: 12px 12px 0px #1b1c1c;
          transform: translate(-4px, -4px);
        }

        .halftone-bg {
          background-image: radial-gradient(#1b1c1c 20%, transparent 20%), radial-gradient(#1b1c1c 20%, transparent 20%);
          background-color: transparent;
          background-position: 0 0, 10px 10px;
          background-size: 20px 20px;
          opacity: 0.06;
        }

        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }

        .shimmer-text {
          background: linear-gradient(90deg, #5f5f00 0%, #cccc52 50%, #5f5f00 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s infinite linear;
        }

        .polaroid {
          background-color: white;
          padding: 12px 12px 40px 12px;
          border: 4px solid #1b1c1c;
          box-shadow: 8px 8px 0px #1b1c1c;
          transition: all 0.2s ease;
        }
        .polaroid:hover {
          transform: scale(1.05) rotate(0deg) !important;
          z-index: 20;
        }
      `}</style>

      {/* Guest Personalized Envelope Cover */}
      <PersonalizedEnvelopeCover
        guestName={props.guestName}
        partnerOne={celebrantName}
        partnerTwo=""
        weddingTime={props.weddingTime || "Saturday at 7:00 PM"}
        isCustomizer={props.isCustomizer}
        templateSlug="bold-pop-art"
      />

      {/* Top Pop Art Navigation Bar */}
      <nav className="bg-[#fcf9f8]/90 backdrop-blur-md fixed top-0 w-full z-50 transition-all duration-300 ease-in-out border-b-4 border-[#1b1c1c] shadow-[0_4px_0_#1b1c1c]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center h-20">
          <a
            className="font-serif text-2xl text-[#5f5f00] italic uppercase tracking-wider font-extrabold shimmer-text"
            href="#"
          >
            {celebrationHeader}
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
            <a
              className="text-[#484837] hover:text-[#5f5f00] uppercase tracking-wider transition-colors duration-300"
              href="#about"
            >
              About
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] uppercase tracking-wider transition-colors duration-300"
              href="#timeline"
            >
              Timeline
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] uppercase tracking-wider transition-colors duration-300"
              href="#venue"
            >
              Venue
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] uppercase tracking-wider transition-colors duration-300"
              href="#gallery"
            >
              Gallery
            </a>
            <a
              className="text-[#484837] hover:text-[#5f5f00] uppercase tracking-wider transition-colors duration-300"
              href="#rsvp"
            >
              RSVP
            </a>
          </div>

          <a
            onClick={() => fireConfetti()}
            className="hidden md:inline-block pop-accent-2 px-6 py-2.5 border-2 border-[#1b1c1c] shadow-[4px_4px_0_#1b1c1c] font-bold text-xs uppercase tracking-wider hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#1b1c1c] transition-all cursor-pointer"
            href="#rsvp"
          >
            RSVP Now
          </a>

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden text-[#1b1c1c] p-2"
          >
            {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden bg-[#fcf9f8] border-b-4 border-[#1b1c1c] px-6 py-4 flex flex-col gap-4 text-center">
            <a
              href="#about"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#1b1c1c] font-bold uppercase py-2"
            >
              About
            </a>
            <a
              href="#timeline"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#1b1c1c] font-bold uppercase py-2"
            >
              Timeline
            </a>
            <a
              href="#venue"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#1b1c1c] font-bold uppercase py-2"
            >
              Venue
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileNavOpen(false)}
              className="text-[#1b1c1c] font-bold uppercase py-2"
            >
              Gallery
            </a>
            <a
              href="#rsvp"
              onClick={() => {
                fireConfetti();
                setMobileNavOpen(false);
              }}
              className="pop-accent-2 text-white border-2 border-[#1b1c1c] shadow-[4px_4px_0_#1b1c1c] py-3 font-bold text-xs uppercase tracking-wider"
            >
              RSVP Now
            </a>
          </div>
        )}
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[850px] md:min-h-[921px] flex items-center justify-center overflow-hidden bg-[#e9e86b]">
          <div className="absolute inset-0 halftone-bg pointer-events-none"></div>

          {/* Floating Geometric Pop Art Elements with Motion */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-24 left-12 w-32 h-32 rounded-full pop-accent-2 border-4 border-[#1b1c1c] hidden md:block z-0 shadow-[6px_6px_0_#1b1c1c]"
          />
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [12, -5, 12] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-24 right-20 w-48 h-48 pop-accent-3 border-4 border-[#1b1c1c] rotate-12 hidden md:block z-0 shadow-[8px_8px_0_#1b1c1c]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [-45, -35, -45] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/4 w-0 h-0 border-l-[40px] border-l-transparent border-b-[70px] border-b-[#904d00] border-r-[40px] border-r-transparent -rotate-45 hidden lg:block z-0"
          />

          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotate: -4 }}
              animate={{ scale: 1, opacity: 1, rotate: -2 }}
              transition={{ duration: 0.6 }}
              className="bg-[#fcf9f8] border-4 border-[#1b1c1c] shadow-[12px_12px_0_#ff0055] p-8 md:p-16 rotate-[-2deg]"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold font-serif text-[#1b1c1c] mb-6 uppercase tracking-tighter leading-none">
                {celebrantName}'s <br />
                <span className="text-[#5f5f00] italic shimmer-text">
                  Spectacular
                </span>{" "}
                <br />
                Birthday Bash
              </h1>

              <p className="text-base md:text-xl font-serif text-[#484837] mb-10 max-w-2xl mx-auto leading-relaxed">
                {props.inviteLine && !props.inviteLine.includes("wedding")
                  ? props.inviteLine
                  : "Join us for an unforgettable night of bold colors, loud music, and pure celebration."}
              </p>

              <a
                onClick={() => fireConfetti()}
                className="inline-block bg-[#5f5f00] text-white font-bold text-xs uppercase tracking-wider px-8 py-4 border-2 border-[#1b1c1c] shadow-[6px_6px_0_#1b1c1c] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#1b1c1c] transition-all cursor-pointer"
                href="#rsvp"
              >
                Count Me In
              </a>
            </motion.div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="py-16 bg-[#fcf9f8] border-b-4 border-[#1b1c1c] relative overflow-hidden">
          <div className="absolute inset-0 halftone-bg pointer-events-none"></div>
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10 text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-[#1b1c1c] uppercase tracking-wide shimmer-text">
              The Countdown Is On
            </h2>

            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {/* Days Node */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 3 }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full pop-accent-3 border-4 border-[#1b1c1c] shadow-[0_0_20px_#00e5ff,8px_8px_0_#1b1c1c] flex flex-col items-center justify-center cursor-pointer"
              >
                <span className="text-3xl md:text-4xl font-extrabold font-serif text-[#1b1c1c] leading-none">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#1b1c1c] mt-1">
                  Days
                </span>
              </motion.div>

              {/* Hours Node */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: -3 }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full pop-accent-1 border-4 border-[#1b1c1c] shadow-[0_0_20px_#ffda00,8px_8px_0_#1b1c1c] flex flex-col items-center justify-center cursor-pointer"
              >
                <span className="text-3xl md:text-4xl font-extrabold font-serif text-[#1b1c1c] leading-none">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#1b1c1c] mt-1">
                  Hours
                </span>
              </motion.div>

              {/* Minutes Node */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 4 }}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full pop-accent-2 border-4 border-[#1b1c1c] shadow-[0_0_20px_#ff0055,8px_8px_0_#1b1c1c] flex flex-col items-center justify-center cursor-pointer"
              >
                <span className="text-3xl md:text-4xl font-extrabold font-serif text-white leading-none">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white mt-1">
                  Mins
                </span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Highlight Banner */}
        <section className="border-b-4 border-[#1b1c1c] relative">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-12 md:p-24 pop-accent-3 border-r-0 md:border-r-4 border-[#1b1c1c] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 halftone-bg pointer-events-none"></div>
              <h2 className="text-4xl md:text-6xl font-extrabold font-serif text-[#1b1c1c] uppercase tracking-tighter relative z-10 rotate-[-5deg] leading-tight">
                It's Time To <br />
                <span className="text-white drop-shadow-[4px_4px_0_#1b1c1c]">
                  Party
                </span>
              </h2>
            </div>

            <div
              className="w-full md:w-1/2 h-[350px] md:h-auto bg-cover bg-center border-t-4 md:border-t-0 border-[#1b1c1c] filter contrast-125 saturate-150"
              style={{
                backgroundImage: `url('${
                  props.heroImage ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuA0H7kN4kpUI49ZggQ1URW2BqEbZp9DkXQ6t1wvXEcq1bEsvDJZegxWYrvzZWzWsqm0M7N_YLfjCG4HS-wlESn1hKVK05rUb7Z9lRAxGbpy5DOrZfv2Hs-OXMPyHl2nVcW0kjE5TzwszkRttIfcXIzTdBMoHAbJ_PAUaRnvh6vW4zo6dFPHqyuBRaEaFsfWa_AvTHa_Kkn9h9HiZqenpCOI3nlHkkXIkraBNqWrHsdnS9lbEFKX8S9H"
                }')`,
              }}
            ></div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 bg-[#ffdcc2] relative" id="about">
          <div className="absolute inset-0 halftone-bg pointer-events-none opacity-10"></div>
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <div className="geo-border bg-white p-4 rotate-3 w-4/5 mx-auto">
                  <img
                    alt={celebrantName}
                    className="w-full h-auto filter contrast-125 saturate-150 border-2 border-[#1b1c1c]"
                    src={
                      props.coupleImage ||
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuClDBWCwazIULhLZzUvAc9jA6dz1l-7FmmWhYOyA5h6mX3sfwRnPkSt8J-ayURuyUp90cju1tkcnABzuG3UTxgQYgKd3Kwpl25I6f4VGX3vltjsjqMgfq45dyK_k7SFDkFEgfKpQjseFBRs50sDloH9ctWZN9rBxSmHmWKCd3XDT7lanDyRn0h2aTk7uYzb4aMjIstiPJZ0UJDnL0eys8yJQpzcTqpddxSuX0sTarxyOkvmZ_d1WqRF"
                    }
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2 text-left space-y-6">
                <h2 className="text-2xl md:text-3xl font-extrabold font-serif text-[#1b1c1c] uppercase tracking-wide shimmer-text bg-white inline-block border-4 border-[#1b1c1c] px-6 py-2 shadow-[8px_8px_0_#1b1c1c]">
                  Our Story
                </h2>

                <p className="text-base md:text-lg font-serif text-[#484837] bg-white border-4 border-[#1b1c1c] p-6 shadow-[8px_8px_0_#1b1c1c] leading-relaxed">
                  From the very beginning, {celebrantName} has always brought color and life to every room. Now, as she reaches this spectacular milestone, we invite you to join a celebration that's just as vibrant, loud, and unforgettable as she is.
                </p>

                <p className="text-base md:text-lg font-serif text-[#484837] bg-white border-4 border-[#1b1c1c] p-6 shadow-[8px_8px_0_#1b1c1c] leading-relaxed">
                  {props.loveStoryText ||
                    "Expect neon lights, loud beats, and a night where memories will be made in vivid high contrast!"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section (The Plan) */}
        <section className="py-24 bg-[#f0eded]" id="timeline">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 space-y-16">
            <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#1b1c1c] uppercase tracking-wide text-center shimmer-text">
              The Plan
            </h2>

            <div className="max-w-3xl mx-auto relative before:content-[''] before:absolute before:inset-y-0 before:left-1/2 before:w-2 before:bg-[#1b1c1c] before:-ml-1 space-y-12">
              {timelineSteps.map((step, idx) => {
                const nodeColor =
                  idx === 0
                    ? "pop-accent-1"
                    : idx === 1
                    ? "pop-accent-3"
                    : "pop-accent-2";

                const badgeColor =
                  idx === 0
                    ? "pop-accent-2"
                    : idx === 1
                    ? "pop-accent-1 text-[#1b1c1c]"
                    : "bg-[#1b1c1c] text-white";

                return (
                  <div
                    key={idx}
                    className={`relative flex items-center justify-between md:justify-normal ${
                      idx % 2 === 1 ? "md:flex-row-reverse" : ""
                    } group`}
                  >
                    {/* Node Pin */}
                    <div
                      className={`absolute left-1/2 w-8 h-8 rounded-full ${nodeColor} border-4 border-[#1b1c1c] -ml-4 z-10 shadow-[4px_4px_0_#1b1c1c]`}
                    />

                    {/* Step Card */}
                    <div className="w-[45%] geo-border bg-white p-6 relative space-y-2">
                      <span
                        className={`font-bold text-xs ${badgeColor} px-3 py-1 uppercase border-2 border-[#1b1c1c] absolute -top-4 ${
                          idx % 2 === 1 ? "-right-4 md:-left-4" : "-left-4"
                        }`}
                      >
                        {step.time}
                      </span>
                      <h3 className="text-xl font-extrabold font-serif uppercase text-[#1b1c1c] pt-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-[#484837] font-serif leading-relaxed">
                        {"desc" in step
                          ? (step as any).desc
                          : "Enjoy food, music, and celebration."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Venue Section (The Spot) */}
        <section
          className="py-24 bg-[#e9e86b] border-y-4 border-[#1b1c1c] relative"
          id="venue"
        >
          <div className="absolute inset-0 halftone-bg pointer-events-none opacity-20"></div>
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 relative z-10 space-y-12">
            <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#1b1c1c] uppercase tracking-wide text-center shimmer-text">
              The Spot
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-center bg-white border-4 border-[#1b1c1c] shadow-[16px_16px_0_#1b1c1c] p-8 md:p-12">
              <div className="w-full md:w-1/2">
                <div className="aspect-video bg-[#eae7e7] border-4 border-[#1b1c1c] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30 bg-[#ffda00]/20" />
                  {/* Bouncing Pop Art Map Pin */}
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-12 h-12 rounded-full pop-accent-2 border-4 border-[#1b1c1c] relative z-10 shadow-[4px_4px_0_#1b1c1c] flex items-center justify-center"
                  >
                    <MapPin className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
              </div>

              <div className="w-full md:w-1/2 text-center md:text-left space-y-4">
                <h3 className="text-3xl md:text-4xl font-extrabold font-serif uppercase text-[#1b1c1c]">
                  {mainVenue.name || "The Grand Estate"}
                </h3>
                <p className="text-lg font-serif text-[#484837]">
                  {mainVenue.address}
                </p>
                <a
                  className="inline-block bg-[#1b1c1c] text-white font-bold text-xs uppercase tracking-wider px-8 py-4 border-2 border-[#1b1c1c] shadow-[6px_6px_0_#ff0055] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#ff0055] transition-all"
                  href={mainVenue.mapLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section (Our Moments) */}
        <section className="py-24 bg-[#fcf9f8]" id="gallery">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 space-y-16">
            <h2 className="text-3xl md:text-5xl font-extrabold font-serif text-[#1b1c1c] uppercase tracking-wide text-center shimmer-text">
              Our Moments
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {galleryList.map((item: any, i: number) => {
                const url = typeof item === "string" ? item : item.url;
                const caption =
                  typeof item === "string" ? `Moment #${i + 1}` : item.caption;
                const rotate =
                  typeof item === "string"
                    ? i % 2 === 0
                      ? "rotate-[-3deg]"
                      : "rotate-[4deg] md:mt-8"
                    : item.rotate || "";

                return (
                  <div
                    key={i}
                    className={`polaroid ${rotate} mx-auto w-full max-w-sm`}
                  >
                    <div className="aspect-square bg-cover bg-center border-2 border-[#1b1c1c] filter contrast-125 saturate-150 overflow-hidden">
                      <img
                        alt={caption}
                        className="w-full h-full object-cover"
                        src={url}
                      />
                    </div>
                    <p className="text-center font-extrabold font-serif uppercase text-[#1b1c1c] mt-4 text-xl">
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

        {/* Footer */}
        <footer className="bg-[#f6f3f2] w-full py-12 border-t-4 border-[#1b1c1c]">
          <div className="max-w-[1280px] mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="font-serif text-xl font-extrabold text-[#5f5f00] uppercase italic shimmer-text">
              {celebrationHeader}
            </div>
            <div className="text-xs text-[#5d5c58] font-serif">
              © {new Date().getFullYear()} Crafted with Love for {celebrantName}'s Special Day
            </div>
            <div className="flex gap-6 text-xs text-[#484837] font-semibold">
              <a href="#" className="hover:text-[#ff0055] transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-[#ff0055] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
